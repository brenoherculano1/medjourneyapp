import React, { ReactNode } from 'react';
import { 
  Home, 
  ClipboardList, 
  MessageSquare, 
  Plane, 
  CreditCard, 
  User, 
  Menu, 
  X,
  LogOut,
  BookOpen,
  TrendingUp} from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useAppContext } from '../../contexts/AppContext';

interface LayoutProps {
  children: ReactNode;
}

const UsaFlagIcon = (props: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    width="1em"
    height="1em"
    className={props.className}
    style={{ display: 'inline' }}
  >
    <rect width="32" height="32" rx="6" fill="#fff"/>
    <rect width="32" height="32" rx="6" fill="#b22234"/>
    <g>
      <rect y="2.46" width="32" height="2.46" fill="#fff"/>
      <rect y="7.38" width="32" height="2.46" fill="#fff"/>
      <rect y="12.3" width="32" height="2.46" fill="#fff"/>
      <rect y="17.22" width="32" height="2.46" fill="#fff"/>
      <rect y="22.14" width="32" height="2.46" fill="#fff"/>
      <rect y="27.06" width="32" height="2.46" fill="#fff"/>
    </g>
    <rect width="14" height="14" fill="#3c3b6e"/>
    <g fill="#fff">
      <circle cx="2" cy="2" r="0.7"/>
      <circle cx="4.7" cy="2" r="0.7"/>
      <circle cx="7.4" cy="2" r="0.7"/>
      <circle cx="10.1" cy="2" r="0.7"/>
      <circle cx="12.8" cy="2" r="0.7"/>
      <circle cx="3.35" cy="3.4" r="0.7"/>
      <circle cx="6.05" cy="3.4" r="0.7"/>
      <circle cx="8.75" cy="3.4" r="0.7"/>
      <circle cx="11.45" cy="3.4" r="0.7"/>
      <circle cx="2" cy="4.8" r="0.7"/>
      <circle cx="4.7" cy="4.8" r="0.7"/>
      <circle cx="7.4" cy="4.8" r="0.7"/>
      <circle cx="10.1" cy="4.8" r="0.7"/>
      <circle cx="12.8" cy="4.8" r="0.7"/>
      <circle cx="3.35" cy="6.2" r="0.7"/>
      <circle cx="6.05" cy="6.2" r="0.7"/>
      <circle cx="8.75" cy="6.2" r="0.7"/>
      <circle cx="11.45" cy="6.2" r="0.7"/>
      <circle cx="2" cy="7.6" r="0.7"/>
      <circle cx="4.7" cy="7.6" r="0.7"/>
      <circle cx="7.4" cy="7.6" r="0.7"/>
      <circle cx="10.1" cy="7.6" r="0.7"/>
      <circle cx="12.8" cy="7.6" r="0.7"/>
      <circle cx="3.35" cy="9" r="0.7"/>
      <circle cx="6.05" cy="9" r="0.7"/>
      <circle cx="8.75" cy="9" r="0.7"/>
      <circle cx="11.45" cy="9" r="0.7"/>
      <circle cx="2" cy="10.4" r="0.7"/>
      <circle cx="4.7" cy="10.4" r="0.7"/>
      <circle cx="7.4" cy="10.4" r="0.7"/>
      <circle cx="10.1" cy="10.4" r="0.7"/>
      <circle cx="12.8" cy="10.4" r="0.7"/>
      <circle cx="3.35" cy="11.8" r="0.7"/>
      <circle cx="6.05" cy="11.8" r="0.7"/>
      <circle cx="8.75" cy="11.8" r="0.7"/>
      <circle cx="11.45" cy="11.8" r="0.7"/>
    </g>
  </svg>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { currentPage, navigateTo } = useNavigation();
  const { user } = useAppContext();

  const navigationItems = [
    { name: 'Dashboard', page: 'dashboard' as const, icon: Home },
    { name: 'Estágios', page: 'applications' as const, icon: ClipboardList },
    { name: 'Entrevistas', page: 'interviews' as const, icon: MessageSquare },
    { name: 'Vistos & Viagem', page: 'visaPlanning' as const, icon: Plane },
    { name: 'USMLE', page: 'usmle' as const, icon: UsaFlagIcon },
    { name: 'study Log', page: 'studylog' as const, icon: BookOpen },
    // { name: 'Revisão Estratégica', page: 'strategicreview' as const, icon: TrendingUp },
    { name: 'Assinatura', page: 'pricing' as const, icon: CreditCard },
    { name: 'Perfil', page: 'profile' as const, icon: User },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`flex flex-col z-50 bg-white shadow-lg transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-64' : 'w-16'}
          md:w-64
        `}
      >
        <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex items-center">
              <span className="text-blue-600 font-bold text-xl">MedJourney</span>
            </div>
          </div>
          <button onClick={toggleSidebar} className="md:hidden">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigationItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigateTo(item.page);
                    setSidebarOpen(false);
                  }}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md w-full ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {user.name}
                </p>
                <div className="flex items-center mt-1">
                  {user.subscription && (
                    <span className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                      Premium
                    </span>
                  )}
                  <button className="ml-auto flex items-center text-xs text-gray-500 hover:text-gray-700">
                    <LogOut size={14} className="mr-1" />
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            onClick={toggleSidebar}
            className="px-4 md:hidden border-r border-gray-200 text-gray-500 focus:outline-none focus:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex justify-center md:hidden">
              <div className="flex items-center">
                <img
                  src="/logo-medjourney.png"
                  alt="MedJourney App"
                  className="h-10 w-auto"
                />
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {user.subscription && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Premium
                </span>
              )}
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;