import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import VisaForm from '../components/visaPlanner/VisaForm';
import { VisaPlanning } from '../types';
import { useTranslation } from 'react-i18next';

const VisaPlanner: React.FC = () => {
  const { visaPlanning, addVisaPlanning, updateVisaPlanning, deleteVisaPlanning } = useAppContext();
  const [isAddingPlanning, setIsAddingPlanning] = useState(false);
  const [editingPlanning, setEditingPlanning] = useState<VisaPlanning | null>(null);
  const { t, i18n } = useTranslation();

  const handleAddPlanning = (planning: Omit<VisaPlanning, 'id' | 'createdAt' | 'updatedAt'>) => {
    addVisaPlanning(planning);
    setIsAddingPlanning(false);
  };

  const handleUpdatePlanning = (planning: Omit<VisaPlanning, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingPlanning) {
      updateVisaPlanning(editingPlanning.id, planning);
      setEditingPlanning(null);
    }
  };

  const handleDeletePlanning = (id: string) => {
    if (confirm(t('visa_confirm_delete'))) {
      deleteVisaPlanning(id);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return t('visa_not_scheduled');
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language === 'en' ? 'en-US' : 'pt-BR').format(date);
  };

  // Status badges
  const statusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      'Pendente': t('visa_status_pending'),
      'Agendado': t('visa_status_scheduled'),
      'Concluído': t('visa_status_completed'),
    };
    const styles = {
      [t('visa_status_pending')]: 'bg-yellow-100 text-yellow-800',
      [t('visa_status_scheduled')]: 'bg-blue-100 text-blue-800',
      [t('visa_status_completed')]: 'bg-green-100 text-green-800',
    } as const;
    const label = statusMap[status] || status;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[label] || ''}`}>
        {label}
      </span>
    );
  };

  // Função utilitária para traduzir campos dinâmicos simples
  const translateField = (text: string) => {
    if (i18n.language === 'en') {
      // Traduções simples para exemplos comuns
      if (text === 'Pesquisando opções perto do UCSF') return 'Searching for options near UCSF';
      if (text === 'Cotação em andamento - Atlas America') return 'Quote in progress - Atlas America';
      if (text === 'Ainda não comprado') return 'Not purchased yet';
      if (text === 'Preparar documentos financeiros e carta de confirmação do estágio') return 'Prepare financial documents and rotation confirmation letter';
      // Adicione mais traduções conforme necessário
    }
    return text;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('visa_title')}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {t('visa_subtitle')}
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<PlusCircle size={16} />}
          onClick={() => {
            setIsAddingPlanning(true);
            setEditingPlanning(null);
          }}
          disabled={isAddingPlanning || editingPlanning !== null}
        >
          {t('visa_new_plan')}
        </Button>
      </div>

      {isAddingPlanning && (
        <Card title={t('visa_add_new')}>
          <VisaForm
            onSubmit={handleAddPlanning}
            isEdit={false}
          />
        </Card>
      )}

      {editingPlanning && (
        <Card title={t('visa_edit_plan')}>
          <VisaForm
            onSubmit={handleUpdatePlanning}
            initialData={editingPlanning}
            isEdit={true}
          />
        </Card>
      )}

      {(!isAddingPlanning && !editingPlanning) && (
        <div className="space-y-5">
          {visaPlanning.length === 0 ? (
            <Card>
              <div className="text-center py-10">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('visa_none_added')}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {t('visa_none_desc')}
                </p>
                <Button
                  variant="primary"
                  leftIcon={<PlusCircle size={18} />}
                  onClick={() => setIsAddingPlanning(true)}
                >
                  {t('visa_create_plan')}
                </Button>
              </div>
            </Card>
          ) : (
            visaPlanning.map(plan => (
              <Card key={plan.id} className="border border-gray-200">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{plan.country}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{t('visa_type')}: {plan.visaType}</p>
                    </div>
                    <div>
                      {statusBadge(plan.status)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('visa_details')}</h4>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">{t('visa_appointment')}:</span> {formatDate(plan.appointmentDate)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                          <span className="font-medium">{t('visa_embassy_link')}:</span>
                          <a 
                            href={plan.embassyLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate max-w-xs inline-block"
                          >
                            {plan.embassyLink}
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('travel_details')}</h4>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">{t('travel_accommodation')}:</span> {plan.accommodation ? translateField(plan.accommodation) : t('not_defined')}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">{t('travel_insurance')}:</span> {plan.insurance ? translateField(plan.insurance) : t('not_defined')}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">{t('travel_flight')}:</span> {plan.flight ? translateField(plan.flight) : t('not_defined')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {plan.notes && (
                    <div className="pt-2">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('visa_notes')}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{translateField(plan.notes)}</p>
                    </div>
                  )}
                  
                  <div className="pt-4 flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingPlanning(plan)}
                    >
                      {t('edit')}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeletePlanning(plan.id)}
                    >
                      {t('delete')}
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default VisaPlanner;