export type ApplicationStatus = 'Preparando' | 'Enviado' | 'Aguardando' | 'Aceito' | 'Rejeitado';
export type ApplicationType = 'Clinical' | 'Observership' | 'Research';
export type InterviewCategory = 'Pessoal' | 'Clínica' | 'Ética' | 'Storytelling';
export type VisaStatus = 'Pendente' | 'Agendado' | 'Concluído';
export type DocumentStatus = 'Pendente' | 'Em Progresso' | 'Concluído';

export interface Application {
  id: string;
  hospitalName: string;
  type: ApplicationType;
  deadline: string;
  status: ApplicationStatus;
  website: string;
  notes: string;
  documents: DocumentChecklist;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentChecklist {
  cv: { status: DocumentStatus; notes: string };
  personalStatement: { status: DocumentStatus; notes: string };
  recommendation: { status: DocumentStatus; notes: string };
  vaccination: { status: DocumentStatus; notes: string };
  passport: { status: DocumentStatus; notes: string };
  insurance: { status: DocumentStatus; notes: string };
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: InterviewCategory;
}

export interface InterviewResponse {
  id: string;
  questionId: string;
  question: string;
  response: string;
  category: InterviewCategory;
  createdAt: string;
}

export interface Country {
  id: string;
  name: string;
  visaTypes: string[];
  embassyLink: string;
}

export interface VisaPlanning {
  id: string;
  country: string;
  visaType: string;
  appointmentDate: string;
  status: VisaStatus;
  embassyLink: string;
  accommodation: string;
  insurance: string;
  flight: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  subscription: 'free' | 'monthly' | 'annual' | null;
  subscriptionExpiry: string | null;
}