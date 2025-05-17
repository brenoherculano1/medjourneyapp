import { InterviewQuestion, Country } from '../types';

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: '1',
    question: 'Tell me about yourself and why you chose medicine.',
    category: 'Pessoal',
  },
  {
    id: '2',
    question: 'What motivated you to apply for this specific program?',
    category: 'Pessoal',
  },
  {
    id: '3',
    question: 'Describe a challenging patient encounter and how you handled it.',
    category: 'Clínica',
  },
  {
    id: '4',
    question: 'How would you approach a patient who refuses treatment?',
    category: 'Ética',
  },
  {
    id: '5',
    question: 'Tell me about a time you had to deliver bad news to a patient or family.',
    category: 'Storytelling',
  },
  {
    id: '6',
    question: 'What are your strengths and weaknesses as a medical student?',
    category: 'Pessoal',
  },
  {
    id: '7',
    question: 'How do you prioritize multiple patients with competing needs?',
    category: 'Clínica',
  },
  {
    id: '8',
    question: 'Describe a situation where you identified a medical error. What did you do?',
    category: 'Ética',
  },
  {
    id: '9',
    question: 'Tell me about a time you worked effectively in a team to solve a problem.',
    category: 'Storytelling',
  },
  {
    id: '10',
    question: 'What are your long-term career goals in medicine?',
    category: 'Pessoal',
  },
];

export const COUNTRIES: Country[] = [
  {
    id: '1',
    name: 'Estados Unidos',
    visaTypes: ['B1/B2', 'J1', 'F1'],
    embassyLink: 'https://br.usembassy.gov/pt/visas-pt/',
  },
  {
    id: '2',
    name: 'Canadá',
    visaTypes: ['Visitor', 'Study Permit', 'Work Permit'],
    embassyLink: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html',
  },
  {
    id: '3',
    name: 'Reino Unido',
    visaTypes: ['Standard Visitor', 'Student', 'Skilled Worker'],
    embassyLink: 'https://www.gov.uk/browse/visas-immigration',
  },
  {
    id: '4',
    name: 'Austrália',
    visaTypes: ['Visitor', 'Student', 'Temporary Skill Shortage'],
    embassyLink: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder',
  },
  {
    id: '5',
    name: 'Alemanha',
    visaTypes: ['Schengen', 'Student', 'Research'],
    embassyLink: 'https://brasil.diplo.de/br-pt/servicos/visto/1010220',
  },
];

export const APP_ROUTES = {
  DASHBOARD: '/',
  APP_TRACKER: '/applications',
  INTERVIEW_PREP: '/interviews',
  VISA_PLANNER: '/visa-planning',
  PRICING: '/pricing',
  PROFILE: '/profile',
};