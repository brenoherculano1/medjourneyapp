import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Application, InterviewResponse, VisaPlanning, User } from '../types';
import { mockUser, mockApplications, mockInterviewResponses, mockVisaPlanning } from '../utils/mockData';

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
  const [applications, setApplications] = useState<Application[]>(mockApplications);
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