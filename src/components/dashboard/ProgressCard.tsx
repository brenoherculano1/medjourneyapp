import React from 'react';
import { Application, InterviewResponse, VisaPlanning } from '../../types';
import Card from '../common/Card';

interface ProgressCardProps {
  applications: Application[];
  interviewResponses: InterviewResponse[];
  visaPlanning: VisaPlanning[];
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  applications,
  interviewResponses,
  visaPlanning,
}) => {
  // Calculate application progress
  const applicationProgress = applications.length > 0 
    ? applications.filter(app => app.status !== 'Preparando').length / applications.length * 100 
    : 0;
  
  // Calculate interview progress
  const interviewProgress = interviewResponses.length > 0 ? 100 : 0;
  
  // Calculate visa planning progress
  const visaProgress = visaPlanning.length > 0 
    ? visaPlanning.filter(plan => plan.status !== 'Pendente').length / visaPlanning.length * 100 
    : 0;
  
  // Calculate overall progress
  const totalProgress = (applicationProgress + interviewProgress + visaProgress) / 3;
  
  const renderProgressBar = (progress: number, label: string) => (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <Card 
      title="Seu Progresso" 
      className="h-full"
    >
      <div className="space-y-4">
        {renderProgressBar(applicationProgress, 'Estágios')}
        {renderProgressBar(interviewProgress, 'Entrevistas')}
        {renderProgressBar(visaProgress, 'Vistos & Viagem')}
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center mb-1">
            <span className="text-base font-medium text-gray-800">Progresso Geral</span>
            <span className="text-base font-medium text-gray-800">{Math.round(totalProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${totalProgress}%` }}
            ></div>
          </div>
          
          <div className="mt-3 text-sm text-gray-600">
            {totalProgress < 30 && "Você está começando sua jornada! Continue configurando seus estágios."}
            {totalProgress >= 30 && totalProgress < 70 && "Bom progresso! Continue preparando suas entrevistas e planejando sua viagem."}
            {totalProgress >= 70 && "Você está quase pronto para embarcar na sua experiência internacional!"}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProgressCard;