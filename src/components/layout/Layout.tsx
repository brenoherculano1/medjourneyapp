import React, { ReactNode, useEffect, useState } from 'react';
import {
  Home, ClipboardList, MessageSquare, Plane, CreditCard, User, Menu, LogOut, BookOpen, X
} from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useAppContext } from '../../contexts/AppContext';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import StudyLogTracker from '../dashboard/StudyLogTracker';

interface LayoutProps {
  children: ReactNode;
}

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentPage, navigateTo } = useNavigation();
  const { user } = useAppContext();

  const navigationItems = [
    { name: 'Dashboard', page: 'dashboard' as const, icon: Home },
    { name: 'Estágios', page: 'applications' as const, icon: ClipboardList },
    { name: 'Entrevistas', page: 'interviews' as const, icon: MessageSquare },
    { name: 'Vistos & Viagem', page: 'visaPlanning' as const, icon: Plane },
    { name: 'USMLE', page: 'usmle' as const, icon: BookOpen },
    { name: 'IMG Residency Navigator', page: 'imgnavigator' as const, icon: User },
    { name: 'System Tracker', page: 'studylog' as const, icon: BookOpen },
    { name: 'Study Log', page: 'dailylog' as const, icon: ClipboardList },
    { name: 'Assinatura', page: 'pricing' as const, icon: CreditCard },
    { name: 'Perfil', page: 'profile' as const, icon: User },
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
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar para desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">MedJourney</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.page}
                    onClick={() => navigateTo(item.page)}
                    className={`${
                      currentPage === item.page
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                  >
                    <Icon className="mr-3 h-6 w-6" />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex-shrink-0 w-full group block"
            >
              <div className="flex items-center">
                <div>
                  <LogOut className="h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Sair
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Layout principal */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Header mobile */}
        <div className="md:hidden bg-white shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">MedJourney</h1>
            <button
              type="button"
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Sidebar mobile */}
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closeSidebar}
            />
            
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-lg">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  onClick={closeSidebar}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-900"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <nav className="p-4 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.page}
                      onClick={() => {
                        navigateTo(item.page);
                        closeSidebar();
                      }}
                      className={`${
                        currentPage === item.page
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50'
                      } flex items-center w-full px-3 py-2 rounded-md`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </button>
                  );
                })}
              </nav>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Sair
                </button>
              </div>
            </div>
          </>
        )}

        {/* Conteúdo principal */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
