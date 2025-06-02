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

      {/* Barra superior para mobile */}
      <div className="md:hidden">
        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40" 
            onClick={closeSidebar}
          />
        )}
        
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 max-w-xs w-full bg-white transform transition-transform duration-300 ease-in-out z-50 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={closeSidebar}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">MedJourney</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
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
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md w-full`}
                  >
                    <Icon className="mr-4 h-6 w-6" />
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

      {/* Botão de menu para mobile */}
      <div className="sticky top-0 z-30 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
        <button
          type="button"
          className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Conteúdo principal */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Conteúdo da página */}
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
