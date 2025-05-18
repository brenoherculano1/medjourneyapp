import React, { ReactNode, useEffect, useState } from 'react';
import {
  Home, ClipboardList, MessageSquare, Plane, CreditCard, User, Menu, LogOut, BookOpen, X
} from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useAppContext } from '../../contexts/AppContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';

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
    { name: 'USMLE', page: 'usmle' as const, icon: UsaFlagIcon },
    { name: 'study Log', page: 'studylog' as const, icon: BookOpen },
    { name: 'Assinatura', page: 'pricing' as const, icon: CreditCard },
    { name: 'Perfil', page: 'profile' as const, icon: User },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Overlay para mobile quando sidebar aberta */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed z-50 inset-y-0 left-0 flex flex-col bg-white shadow-lg transition-transform duration-300 ease-in-out
          w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0 md:w-64 md:flex
        `}
      >
        {/* Topo da sidebar */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200 relative">
          <span className="text-blue-600 font-bold text-xl mx-auto md:mx-0">MedJourney</span>
          {/* Botão X só no mobile e quando aberta */}
          {sidebarOpen && (
            <button
              className="absolute right-4 md:hidden text-gray-500 hover:text-gray-700"
              onClick={closeSidebar}
              aria-label="Fechar menu"
            >
              <X size={24} />
            </button>
          )}
        </div>
        {/* Navegação */}
        <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigationItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigateTo(item.page);
                    closeSidebar();
                  }}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md w-full ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>
        {/* Usuário e logout */}
        <div className="border-t border-gray-200 p-4">
          <button className="flex items-center text-xs text-gray-500 hover:text-gray-700">
            <LogOut size={14} className="mr-1" />
            Sair
          </button>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar/topbar */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow items-center justify-between px-4 md:px-8">
          {/* Botão menu hambúrguer só no mobile */}
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-500 focus:outline-none"
            aria-label="Abrir menu"
          >
            <Menu size={28} />
          </button>
          {/* Logo centralizado no mobile, alinhado à esquerda no desktop */}
          <div className="flex-1 flex justify-center md:justify-start">
            <span className="text-blue-600 font-bold text-xl">MedJourney</span>
          </div>
          {/* Itens só no desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-base font-medium text-gray-700">Seja Bem-vindo!</span>
            {user.subscription && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Premium</span>
            )}
          </div>
        </div>
        {/* Conteúdo */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-2 sm:p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
