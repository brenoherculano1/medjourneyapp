import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './contexts/AppContext';
import { NavigationProvider } from './contexts/NavigationContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NavigationProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </NavigationProvider>
  </StrictMode>
);