import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import AppTrackr from './pages/AppTrackr';
import InterviewPrep from './pages/InterviewPrep';
import VisaPlanner from './pages/VisaPlanner';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';
import USMLE from './pages/USMLE';
import StrategicReviewPage from './pages/StrategicReviewPage';
import { useNavigation } from './contexts/NavigationContext';
import StudyLog from './pages/StudyLog';
import Login from './pages/Login'; // <- certifique-se de ter criado essa página

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; // <- CORREÇÃO AQUI

function App() {
  const { currentPage } = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

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
      case 'strategicreview':
        return <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return <Layout>{renderPage()}</Layout>;
}

export default App;
