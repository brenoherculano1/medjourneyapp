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
  const [applicationsLoaded, setApplicationsLoaded] = useState(false); // 1. Marca quando o carregamento inicial foi concluído
  const [readyToSave, setReadyToSave] = useState(false); // 2. Só true depois de applicationsLoaded
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true); // 4. Loading global de autenticação

  // Efeito para controlar o loading de autenticação
  useEffect(() => {
    // Simula o loading do Firebase Auth
    // Se o user já está definido (mesmo que null), loading termina
    setAuthLoading(false);
  }, [user]);

  // Carregar aplicações do Firestore ao logar
  useEffect(() => {
    if (authLoading) return; // 1. Só carrega após autenticação
    if (!user?.uid) return;
    setApplicationsLoaded(false);
    setReadyToSave(false);
    const fetchApplications = async () => {
      try {
        const ref = doc(db, 'users', user.uid);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.applications) {
            setApplications(data.applications);
            console.log('Carregado do Firestore:', data.applications);
          } else {
            console.log('Carregado do Firestore: nenhum campo applications encontrado');
          }
        } else {
          console.log('Carregado do Firestore: documento não existe');
        }
      } catch (error) {
        console.error('Erro ao buscar aplicações do Firestore:', error);
        alert('Erro ao buscar aplicações do Firestore: ' + (error?.message || error));
      } finally {
        setApplicationsLoaded(true);
      }
    };
    fetchApplications();
  }, [user, authLoading]);

  // 2. Só define readyToSave como true depois do carregamento inicial
  useEffect(() => {
    if (applicationsLoaded) {
      setReadyToSave(true);
    }
  }, [applicationsLoaded]);

  // Salvar aplicações no Firestore sempre que mudar, mas só depois do carregamento inicial e quando readyToSave === true
  useEffect(() => {
    if (!user?.uid || !readyToSave) return;
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
        alert('Erro ao salvar aplicações no Firestore: ' + (error?.message || error));
      }
    };
    saveApplications();
  }, [applications, user?.uid, readyToSave, applicationsLoading]);
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
    const updatedApplications = [...applications, newApplication];
    console.log('addApplication chamado:', { application, newApplication, updatedApplications });
    setApplications(updatedApplications);
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
  // Evitar renderizar estágios enquanto user for null ou authLoading
  if (authLoading || user === null) {
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