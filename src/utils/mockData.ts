import { Application, InterviewResponse, VisaPlanning, User } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'João Silva',
  email: 'joao.silva@gmail.com',
  subscription: null,
  subscriptionExpiry: null,
};

export const mockApplications: Application[] = [
  {
    id: '1',
    hospitalName: 'University of California San Francisco',
    type: 'Clinical',
    deadline: '2023-12-15',
    status: 'Preparando',
    website: 'https://www.ucsf.edu/international-programs',
    notes: 'Preciso atualizar meu CV e pedir carta para o Dr. Santos',
    documents: {
      cv: { status: 'Em Progresso', notes: 'Atualizar publicações recentes' },
      personalStatement: { status: 'Pendente', notes: '' },
      recommendation: { status: 'Pendente', notes: 'Pedir para Dr. Santos' },
      vaccination: { status: 'Concluído', notes: '' },
      passport: { status: 'Concluído', notes: 'Válido até 2027' },
      insurance: { status: 'Pendente', notes: '' },
    },
    createdAt: '2023-09-01T12:00:00Z',
    updatedAt: '2023-09-10T14:30:00Z',
  },
  {
    id: '2',
    hospitalName: 'Mayo Clinic',
    type: 'Observership',
    deadline: '2023-11-20',
    status: 'Enviado',
    website: 'https://www.mayoclinic.org/international',
    notes: 'Enviei aplicação completa. Aguardando resposta inicial.',
    documents: {
      cv: { status: 'Concluído', notes: '' },
      personalStatement: { status: 'Concluído', notes: '' },
      recommendation: { status: 'Concluído', notes: 'Dr. Santos e Dr. Oliveira' },
      vaccination: { status: 'Concluído', notes: '' },
      passport: { status: 'Concluído', notes: '' },
      insurance: { status: 'Concluído', notes: '' },
    },
    createdAt: '2023-08-15T10:00:00Z',
    updatedAt: '2023-09-05T09:45:00Z',
  },
];

export const mockInterviewResponses: InterviewResponse[] = [
  {
    id: '1',
    questionId: '1',
    question: 'Tell me about yourself and why you chose medicine.',
    response: 'I am a final-year medical student from Brazil with a passion for internal medicine and research. I chose medicine after witnessing how healthcare made a significant difference in my community following a natural disaster when I was younger.',
    category: 'Pessoal',
    createdAt: '2023-09-12T15:30:00Z',
  },
  {
    id: '2',
    questionId: '5',
    question: 'Tell me about a time you had to deliver bad news to a patient or family.',
    response: 'During my internal medicine rotation, I assisted a senior physician in communicating a diagnosis of aggressive lymphoma to a 45-year-old patient and her family. I observed how the doctor balanced honesty with compassion, allowing pauses for questions and emotional processing.',
    category: 'Storytelling',
    createdAt: '2023-09-14T11:20:00Z',
  },
];

export const mockVisaPlanning: VisaPlanning[] = [
  {
    id: '1',
    country: 'Estados Unidos',
    visaType: 'B1/B2',
    appointmentDate: '2023-10-25',
    status: 'Agendado',
    embassyLink: 'https://br.usembassy.gov/pt/visas-pt/',
    accommodation: 'Pesquisando opções perto do UCSF',
    insurance: 'Cotação em andamento - Atlas America',
    flight: 'Ainda não comprado',
    notes: 'Preparar documentos financeiros e carta de confirmação do estágio',
    createdAt: '2023-09-03T09:00:00Z',
    updatedAt: '2023-09-10T16:45:00Z',
  },
];