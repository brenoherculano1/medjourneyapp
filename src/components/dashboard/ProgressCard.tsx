import React from 'react';
import { useTranslation } from 'react-i18next';
import { Application, InterviewResponse, VisaPlanning } from '../../types';
import Card from '../common/Card';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

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
  const { t } = useTranslation();

  const calculateProgress = (completed: number, total: number): number => {
    if (total === 0) return 0;
    return (completed / total) * 100;
  };

  const applicationProgress = calculateProgress(
    applications.filter((app) => app.status === 'Aceito').length,
    applications.length || 1
  );
  
  const interviewProgress = calculateProgress(
    interviewResponses.length,
    applications.length || 1
  );

  const visaProgress = calculateProgress(
    visaPlanning.filter((plan) => plan.status === 'Concluído').length,
    applications.filter((app) => app.status === 'Aceito').length || 1
  );

  const totalProgress = (applicationProgress + interviewProgress + visaProgress) / 3;

  const getProgressColor = (progress: number): string => {
    if (progress >= 70) return 'bg-green-500';
    if (progress >= 30) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getProgressIcon = (progress: number) => {
    if (progress >= 70) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (progress >= 30) return <Clock className="w-5 h-5 text-yellow-500" />;
    return <AlertTriangle className="w-5 h-5 text-blue-500" />;
  };
  
  const renderProgressBar = (progress: number, label: string) => (
    <div className="transform transition-all duration-500 hover:scale-[1.02]">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          {getProgressIcon(progress)}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${getProgressColor(progress)}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );

  return (
    <Card 
      title={t('progress_title')} 
      className="h-full transform transition-all duration-500 hover:shadow-lg"
    >
      <div className="space-y-6">
        {renderProgressBar(applicationProgress, t('progress_applications'))}
        {renderProgressBar(interviewProgress, t('progress_interviews'))}
        {renderProgressBar(visaProgress, t('progress_visa'))}
        
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('progress_overall')}</span>
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">{Math.round(totalProgress)}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
            <div 
              className={`h-4 rounded-full transition-all duration-1000 ease-out ${getProgressColor(totalProgress)}`}
              style={{ width: `${totalProgress}%` }}
            />
          </div>
          
          <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {totalProgress < 30 && t('progress_msg_start')}
              {totalProgress >= 30 && totalProgress < 70 && t('progress_msg_mid')}
              {totalProgress >= 70 && t('progress_msg_ready')}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProgressCard;