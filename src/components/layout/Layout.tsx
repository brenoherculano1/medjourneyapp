import React, { ReactNode, useEffect, useState } from 'react';
import {
  Home, ClipboardList, MessageSquare, Plane, CreditCard, User, Menu, LogOut, BookOpen, X, Sun, Moon
} from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useAppContext } from '../../contexts/AppContext';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

interface LayoutProps {
  children: ReactNode;
}

const BrazilFlagIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 32 32" width="1em" height="1em" className={props.className} style={{ display: 'inline' }}>
    <rect width="32" height="32" rx="6" fill="#009b3a"/>
    <path d="M16,5 L27,16 L16,27 L5,16 L16,5z" fill="#fedf00" stroke="#fedf00" strokeWidth="0.5"/>
    <circle cx="16" cy="16" r="5.5" fill="#002776" stroke="#002776" strokeWidth="0.2"/>
    <path 
      d="M13.5,15.5 C14.5,14.5 17.5,14.5 18.5,15.5" 
      fill="none" 
      stroke="#fff" 
      strokeWidth="0.8" 
      strokeLinecap="round"
    />
  </svg>
);

const UsaFlagIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 32 32" width="1em" height="1em" className={props.className} style={{ display: 'inline' }}>
    <rect width="32" height="32" rx="6" fill="#fff"/>
    <rect width="32" height="32" rx="6" fill="#b22234"/>
    <g>
      {[2.46, 7.38, 12.3, 17.22, 22.14, 27.06].map((y, i) => (
        <rect key={i} y={y} width="32" height="2.46" fill="#fff" />
      ))}
    </g>
    <rect width="14" height="14" fill="#3c3b6e"/>
    <g fill="#fff">
      {[...Array(30)].map((_, i) => (
        <circle key={i} cx={(i % 5) * 2.7 + 2} cy={Math.floor(i / 5) * 1.4 + 2} r="0.7" />
      ))}
    </g>
  </svg>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentPage, navigateTo } = useNavigation();
  const { user } = useAppContext();

  const navigationItems = [
    { name: t('dashboard'), page: 'dashboard' as const, icon: Home },
    { name: t('applications'), page: 'applications' as const, icon: ClipboardList },
    { name: t('interviews'), page: 'interviews' as const, icon: MessageSquare },
    { name: t('visa_travel'), page: 'visaPlanning' as const, icon: Plane },
    { name: t('usmle'), page: 'usmle' as const, icon: BookOpen },
    { name: t('nbme_simulator'), page: 'nbmesimulator' as const, icon: BookOpen },
    { name: t('img_residency_navigator'), page: 'imgnavigator' as const, icon: User },
    { name: t('system_tracker'), page: 'studylog' as const, icon: BookOpen },
    { name: t('study_log'), page: 'dailylog' as const, icon: ClipboardList },
    { name: t('subscription'), page: 'pricing' as const, icon: CreditCard },
    { name: t('profile'), page: 'profile' as const, icon: User },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigateTo('dashboard');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar para desktop */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
            <div className="flex items-center justify-between px-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                MedJourney
              </h1>
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  {isDark ? (
                    <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  )}
                </button>
                <button 
                  onClick={() => i18n.changeLanguage(i18n.language === 'pt' ? 'en' : 'pt')}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-2"
                >
                  {i18n.language === 'pt' ? (
                    <>
                      <BrazilFlagIcon className="w-5 h-5" />
                      <span className="sr-only">Switch to English</span>
                    </>
                  ) : (
                    <>
                      <UsaFlagIcon className="w-5 h-5" />
                      <span className="sr-only">Mudar para Português</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <nav className="mt-8 flex-1 px-4 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.page;
                return (
                  <button
                    key={item.page}
                    onClick={() => navigateTo(item.page)}
                    className={`
                      w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg
                      transition-all duration-200 group relative
                      ${isActive 
                        ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/50 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }
                    `}
                  >
                    <Icon className={`
                      h-5 w-5 mr-3 transition-transform duration-200
                      ${isActive ? 'text-blue-600 dark:text-blue-400 transform scale-110' : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'}
                    `} />
                    {item.name}
                    {isActive && (
                      <span className="absolute inset-y-0 left-0 w-1 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
          
          <div className="flex-shrink-0 p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
              {t('logout')}
            </button>
          </div>
        </div>
      </div>

      {/* Layout principal */}
      <div className="md:pl-72 flex flex-col flex-1">
        {/* Header mobile */}
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700">
          <div className="px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              MedJourney
            </h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
              <button 
                onClick={() => i18n.changeLanguage(i18n.language === 'pt' ? 'en' : 'pt')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-2"
              >
                {i18n.language === 'pt' ? (
                  <>
                    <BrazilFlagIcon className="w-5 h-5" />
                    <span className="sr-only">Switch to English</span>
                  </>
                ) : (
                  <>
                    <UsaFlagIcon className="w-5 h-5" />
                    <span className="sr-only">Mudar para Português</span>
                  </>
                )}
              </button>
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                onClick={toggleSidebar}
              >
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar mobile */}
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
              onClick={closeSidebar}
            />
            
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-800 z-50 shadow-xl transform transition-transform duration-300">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  MedJourney
                </h2>
                <button
                  onClick={closeSidebar}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              
              <nav className="p-4 space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.page;
                  return (
                    <button
                      key={item.page}
                      onClick={() => {
                        navigateTo(item.page);
                        closeSidebar();
                      }}
                      className={`
                        w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg
                        transition-all duration-200 group relative
                        ${isActive 
                          ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/50 dark:text-blue-400' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }
                      `}
                    >
                      <Icon className={`
                        h-5 w-5 mr-3 transition-transform duration-200
                        ${isActive ? 'text-blue-600 dark:text-blue-400 transform scale-110' : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'}
                      `} />
                      {item.name}
                      {isActive && (
                        <span className="absolute inset-y-0 left-0 w-1 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
                      )}
                    </button>
                  );
                })}
              </nav>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => {
                    handleLogout();
                    closeSidebar();
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                  {t('logout')}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Conteúdo principal */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
