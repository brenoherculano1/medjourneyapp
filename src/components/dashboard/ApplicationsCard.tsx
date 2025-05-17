import React from 'react';
import { ChevronRight, PlusCircle } from 'lucide-react';
import Card from '../common/Card';
import { Application } from '../../types';
import { useNavigation } from '../../contexts/NavigationContext';
import Button from '../common/Button';

interface ApplicationsCardProps {
  applications: Application[];
}

const StatusBadge: React.FC<{ status: Application['status'] }> = ({ status }) => {
  const statusStyles = {
    'Preparando': 'bg-blue-100 text-blue-800',
    'Enviado': 'bg-yellow-100 text-yellow-800',
    'Aguardando': 'bg-purple-100 text-purple-800',
    'Aceito': 'bg-green-100 text-green-800',
    'Rejeitado': 'bg-red-100 text-red-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

const ApplicationsCard: React.FC<ApplicationsCardProps> = ({ applications }) => {
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
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  };

  return (
    <Card 
      title="Aplicações recentes para estágio" 
      className="h-full"
      headerActions={
        <button 
          onClick={() => navigateTo('applications')}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          Ver todas
          <ChevronRight size={16} className="ml-1" />
        </button>
      }
      footer={
        <Button
          onClick={() => navigateTo('applications')}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium w-full flex items-center justify-center"
        >
          <PlusCircle size={16} className="mr-1" />
          Novo Estágio
        </Button>
      }
    >
      {upcomingApplications.length > 0 ? (
        <div className="space-y-4">
          {upcomingApplications.map((application) => (
            <div key={application.id} className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{application.hospitalName}</h4>
                <div className="flex items-center mt-1 space-x-2">
                  <span className="text-sm text-gray-500">{application.type}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">Prazo: {formatDate(application.deadline)}</span>
                </div>
              </div>
              <StatusBadge status={application.status} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">Nenhum estágio cadastrado</p>
          <p className="text-sm text-gray-400 mt-1">Adicione seu primeiro estágio</p>
        </div>
      )}
    </Card>
  );
};

export default ApplicationsCard;