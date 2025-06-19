import React from 'react';
import { ChevronRight, PlusCircle, Calendar, School } from 'lucide-react';
import Card from '../common/Card';
import { Application } from '../../types';
import { useNavigation } from '../../contexts/NavigationContext';
import Button from '../common/Button';
import { useTranslation } from 'react-i18next';

interface ApplicationsCardProps {
  applications: Application[];
}

const StatusBadge: React.FC<{ status: Application['status'] }> = ({ status }) => {
  const { t } = useTranslation();
  const statusStyles = {
    'Preparando': 'bg-blue-50 text-blue-700 border-blue-100 ring-blue-100/50',
    'Enviado': 'bg-amber-50 text-amber-700 border-amber-100 ring-amber-100/50',
    'Aguardando': 'bg-purple-50 text-purple-700 border-purple-100 ring-purple-100/50',
    'Aceito': 'bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-100/50',
    'Rejeitado': 'bg-rose-50 text-rose-700 border-rose-100 ring-rose-100/50',
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'preparando':
        return t('status_preparing');
      case 'enviado':
        return t('status_sent');
      case 'aguardando':
        return t('status_waiting');
      case 'aceito':
        return t('status_accepted');
      case 'rejeitado':
        return t('status_rejected');
      default:
        return status;
    }
  };

  return (
    <span 
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border 
        shadow-sm ring-1 ring-inset
        transition-all duration-300 hover:scale-105
        ${statusStyles[status]}
      `}
    >
      {getStatusText(status)}
    </span>
  );
};

const ApplicationsCard: React.FC<ApplicationsCardProps> = ({ applications }) => {
  const { t } = useTranslation();
  const { navigateTo } = useNavigation();

  // Sort applications by deadline (closest first)
  const sortedApplications = [...applications].sort((a, b) => {
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  // Get upcoming applications (only show max 3)
  const upcomingApplications = sortedApplications.slice(0, 3);

  // Format deadline date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <Card 
      title={t('applications_recent_title')} 
      className="h-full transform transition-all duration-500 hover:shadow-lg"
      headerActions={
        <button 
          onClick={() => navigateTo('applications')}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center transition-all duration-300 hover:translate-x-1"
        >
          {t('applications_see_all')}
          <ChevronRight size={16} className="ml-1" />
        </button>
      }
      footer={
        <Button
          onClick={() => navigateTo('applications')}
          className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-300 transform hover:scale-[1.02] rounded-lg py-3 font-medium"
        >
          <PlusCircle size={18} />
          {t('applications_new')}
        </Button>
      }
    >
      {upcomingApplications.length > 0 ? (
        <div className="space-y-6">
          {upcomingApplications.map((application) => (
            <div 
              key={application.id} 
              className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">{application.hospitalName}</h4>
                <StatusBadge status={application.status} />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <School size={16} className="mr-2" />
                  <span>{application.type}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Calendar size={16} className="mr-2" />
                  <span>{t('applications_deadline')}: {formatDate(application.deadline)}</span>
                </div>
                
                {application.notes && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{application.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 font-medium">{t('applications_none')}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{t('applications_add_first')}</p>
        </div>
      )}
    </Card>
  );
};

export default ApplicationsCard;