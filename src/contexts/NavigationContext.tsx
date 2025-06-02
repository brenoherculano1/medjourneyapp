import React, { createContext, useContext, useState, ReactNode } from 'react';

type Page =
  | 'dashboard'
  | 'applications'
  | 'interviews'
  | 'visaPlanning'
  | 'profile'
  | 'pricing'
  | 'usmle'
  | 'studylog'
  | 'dailylog'
  | 'imgnavigator'
  | 'strategicreview'
  | 'nbmesimulator';

interface NavigationContextType {
  currentPage: Page;
  navigateTo: (page: Page) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <NavigationContext.Provider value={{ currentPage, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  );
};