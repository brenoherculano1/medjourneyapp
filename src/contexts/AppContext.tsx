import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Application, InterviewResponse, VisaPlanning, User } from '../types';
import { mockUser, mockApplications, mockInterviewResponses, mockVisaPlanning } from '../utils/mockData';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';

interface StreakData {
  streak: number;
  anki: number;
  usmle: number;
  lastUpdated?: string;
}

interface AppContextType {
  user: User | null;
  applications: Application[];
  interviewResponses: InterviewResponse[];
  visaPlanning: VisaPlanning[];
  streakData: StreakData | null;
  setStreakData: (data: StreakData) => void;
  addApplication: (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateApplication: (id: string, application: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  addInterviewResponse: (response: Omit<InterviewResponse, 'id' | 'createdAt'>) => void;
  deleteInterviewResponse: (id: string) => void;
  addVisaPlanning: (planning: Omit<VisaPlanning, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateVisaPlanning: (id: string, planning: Partial<VisaPlanning>) => void;
  deleteVisaPlanning: (id: string) => void;
  setUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [applicationsLoaded, setApplicationsLoaded] = useState(false);

  // Carregar aplicações do Firestore ao logar
  useEffect(() => {
    let isMounted = true;
    if (!user?.uid) {
      setApplications([]);
      setApplicationsLoading(false);
      setApplicationsLoaded(true);
      return;
    }
    setApplicationsLoading(true);
    setApplicationsLoaded(false);
    const fetchApplications = async () => {
      try {
        const ref = doc(db, 'applications', user.uid);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          if (isMounted) setApplications(snapshot.data().applications || []);
        } else {
          if (isMounted) setApplications([]);
        }
      } catch (error) {
        console.error('Erro ao buscar aplicações do Firestore:', error);
        if (isMounted) setApplications([]);
      } finally {
        if (isMounted) {
          setApplicationsLoading(false);
          setApplicationsLoaded(true);
        }
      }
    };
    fetchApplications();
    return () => { isMounted = false; };
  }, [user?.uid]);

  // Salvar aplicações no Firestore sempre que mudar, mas só depois do carregamento inicial
  useEffect(() => {
    if (!user?.uid || !applicationsLoaded) return;
    // Não salva imediatamente após o carregamento inicial, só em mudanças subsequentes
    if (applicationsLoading) return;
    console.log('Tentando salvar aplicações no Firestore:', { uid: user.uid, applications });
    const saveApplications = async () => {
      try {
        await setDoc(doc(db, 'applications', user.uid), {
          applications,
          lastUpdated: new Date().toISOString(),
        });
        console.log('Salvo com sucesso no Firestore!');
      } catch (error) {
        console.error('Erro ao salvar aplicações no Firestore:', error);
      }
    };
    saveApplications();
  }, [applications, user?.uid, applicationsLoaded, applicationsLoading]);
  const [interviewResponses, setInterviewResponses] = useState<InterviewResponse[]>(mockInterviewResponses);
  const [visaPlanning, setVisaPlanning] = useState<VisaPlanning[]>(mockVisaPlanning);
  const [streakData, setStreakData] = useState<StreakData | null>(null);

  const addApplication = (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newApplication: Application = {
      ...application,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    setApplications([...applications, newApplication]);
  };

  const updateApplication = (id: string, updatedFields: Partial<Application>) => {
    setApplications(
      applications.map((app) =>
        app.id === id
          ? { ...app, ...updatedFields, updatedAt: new Date().toISOString() }
          : app
      )
    );
  };

  const deleteApplication = (id: string) => {
    setApplications(applications.filter((app) => app.id !== id));
  };

  const addInterviewResponse = (response: Omit<InterviewResponse, 'id' | 'createdAt'>) => {
    const newResponse: InterviewResponse = {
      ...response,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setInterviewResponses([...interviewResponses, newResponse]);
  };

  const deleteInterviewResponse = (id: string) => {
    setInterviewResponses(interviewResponses.filter((response) => response.id !== id));
  };

  const addVisaPlanning = (planning: Omit<VisaPlanning, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newPlanning: VisaPlanning = {
      ...planning,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    setVisaPlanning([...visaPlanning, newPlanning]);
  };

  const updateVisaPlanning = (id: string, updatedFields: Partial<VisaPlanning>) => {
    setVisaPlanning(
      visaPlanning.map((plan) =>
        plan.id === id
          ? { ...plan, ...updatedFields, updatedAt: new Date().toISOString() }
          : plan
      )
    );
  };

  const deleteVisaPlanning = (id: string) => {
    setVisaPlanning(visaPlanning.filter((plan) => plan.id !== id));
  };

  console.log('USER CONTEXT:', user);
  if (applicationsLoading) {
    return <div className="p-8 text-center text-gray-600">Carregando estágios...</div>;
  }
  return (
    <AppContext.Provider
      value={{
        user,
        applications,
        interviewResponses,
        visaPlanning,
        streakData,
        setStreakData,
        addApplication,
        updateApplication,
        deleteApplication,
        addInterviewResponse,
        deleteInterviewResponse,
        addVisaPlanning,
        updateVisaPlanning,
        deleteVisaPlanning,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};