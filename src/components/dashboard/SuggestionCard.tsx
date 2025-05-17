import React from 'react';
import { Calendar, PenLine, Send } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Application } from '../../types';
import { useNavigation } from '../../contexts/NavigationContext';

interface SuggestionCardProps {
  applications: Application[];
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ applications }) => {
  // Determine which suggestion to show based on user data
  const hasRejections = applications.some(app => app.status === 'Rejeitado');
  const hasPendingApplications = applications.some(app => app.status === 'Preparando' || app.status === 'Enviado');
  
  // Choose a suggestion based on application status
  const getSuggestion = () => {
    if (applications.length === 0) {
      return {
        icon: <PenLine className="h-8 w-8 text-blue-500" />,
        title: 'Comece sua jornada internacional',
        description: 'Configure sua primeira aplicação para um estágio internacional e receba orientações personalizadas.',
        actionText: 'Criar Aplicação',
        actionLink: '/applications',
      };
    } else if (hasRejections) {
      return {
        icon: <Send className="h-8 w-8 text-orange-500" />,
        title: 'Melhore sua próxima aplicação',
        description: 'Quer feedback estratégico sobre como melhorar após uma rejeição? Agende uma mentoria gratuita.',
        actionText: 'Agendar Mentoria',
        actionLink: '#',
      };
    } else if (hasPendingApplications) {
      return {
        icon: <Calendar className="h-8 w-8 text-green-500" />,
        title: 'Prepare-se para entrevistas',
        description: 'Enquanto aguarda respostas, pratique para possíveis entrevistas com nosso simulador.',
        actionText: 'Treinar Entrevistas',
        actionLink: '/interviews',
      };
    } else {
      return {
        icon: <Calendar className="h-8 w-8 text-purple-500" />,
        title: 'Complete seu planejamento',
        description: 'Parabéns pelos estágios! Agora planeje sua viagem e documentação para o estágio.',
        actionText: 'Criar Estágio',
        actionLink: '/visa-planning',
      };
    }
  };

  const suggestion = getSuggestion();
  const { navigateTo } = useNavigation();

  // Função para tratar o clique do botão
  const handleActionClick = () => {
    if (suggestion.actionLink === '/interviews') {
      navigateTo('interviews');
    } else if (suggestion.actionLink === '/applications') {
      navigateTo('applications');
    } else if (suggestion.actionLink === '/visa-planning') {
      navigateTo('visaPlanning');
    } else if (suggestion.actionLink === '/profile') {
      navigateTo('profile');
    } else if (suggestion.actionLink === '/pricing') {
      navigateTo('pricing');
    } // Se for '#' ou outro, não faz nada
  };

  return (
    <Card className="h-full bg-gradient-to-br from-blue-50 to-white border border-blue-100">
      <div className="flex flex-col items-center text-center">
        <div className="p-3 bg-white rounded-full shadow-sm mb-4">
          {suggestion.icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{suggestion.title}</h3>
        <p className="text-gray-600 mb-6">{suggestion.description}</p>
        <Button
          onClick={handleActionClick}
          className={`
            flex items-center justify-center gap-2
            bg-[#2563eb] text-white font-bold shadow-md rounded-full
            px-6 py-3 mt-2 transition
            hover:bg-[#1d4fd7] hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-blue-400
            active:scale-100
          `}
          style={{ fontSize: 18 }}
        >
          <Calendar size={20} className="mr-2" />
          {suggestion.actionText}
        </Button>
      </div>
    </Card>
  );
};

// Import ChevronRight icon
function ChevronRight(props: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={props.size} 
      height={props.size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
}

export default SuggestionCard;