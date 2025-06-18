import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import AppTrackr from './pages/AppTrackr';
import InterviewPrep from './pages/InterviewPrep';
import VisaPlanner from './pages/VisaPlanner';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';
import USMLE from './pages/USMLE';
import StrategicReviewPage from './pages/StrategicReviewPage';
import StudyLog from './pages/StudyLog';
import DailyStudyLog from './pages/DailyStudyLog';
import Login from './pages/Login';
import IMGResidencyNavigator from './pages/IMGResidencyNavigator';
import NBMESimulator from './pages/NBMESimulator';
import Success from './pages/Success';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from './lib/stripe';

import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { AppProvider } from './contexts/AppContext';
import { useUserDataPersistence } from './hooks/useUserDataPersistence';

function InnerApp() {
  const { currentPage } = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // Persistência global dos dados do usuário (como progresso e preferências)
  useUserDataPersistence();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (isLoggedIn === null) {
    return <div className="p-8 text-center text-gray-600">Carregando...</div>;
  }

  if (!isLoggedIn) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'applications':
        return <AppTrackr />;
      case 'interviews':
        return <InterviewPrep />;
      case 'visaPlanning':
        return <VisaPlanner />;
      case 'pricing':
        return <Pricing />;
      case 'profile':
        return <Profile />;
      case 'usmle':
        return <USMLE />;
      case 'studylog':
        return <StudyLog />;
      case 'dailylog':
        return <DailyStudyLog />;
      case 'strategicreview':
        return <StrategicReviewPage />;
      case 'imgnavigator':
        return <IMGResidencyNavigator />;
      case 'nbmesimulator':
        return <NBMESimulator />;
      case 'success':
        return <Success />;
      default:
        return <Dashboard />;
    }
  };

  return <Layout>{renderPage()}</Layout>;
}

function App() {
  return (
    <Elements stripe={stripePromise}>
      <NavigationProvider>
        <AppProvider>
          <InnerApp />
        </AppProvider>
      </NavigationProvider>
    </Elements>
  );
}

export default App;
