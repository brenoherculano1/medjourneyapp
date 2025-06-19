import React, { useState } from 'react';
import { PlusCircle, FileCheck } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ApplicationForm from '../components/appTrackr/ApplicationForm';
import DocumentChecklistForm from '../components/appTrackr/DocumentChecklistForm';
import { Application, DocumentChecklist } from '../types';
import { useTranslation } from 'react-i18next';

const AppTrackr: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { applications, addApplication, updateApplication, deleteApplication } = useAppContext();
  const [isAddingApplication, setIsAddingApplication] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [showDocumentChecklist, setShowDocumentChecklist] = useState<string | null>(null);

  const handleAddApplication = (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => {
    addApplication(application);
    setIsAddingApplication(false);
  };

  const handleUpdateApplication = (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingApplication) {
      updateApplication(editingApplication.id, application);
      setEditingApplication(null);
    }
  };

  const handleDeleteApplication = (id: string) => {
    if (confirm(t('applications_confirm_delete'))) {
      deleteApplication(id);
    }
  };

  const handleDocumentChecklistUpdate = (applicationId: string, documents: DocumentChecklist) => {
    updateApplication(applicationId, { documents });
    setShowDocumentChecklist(null);
  };

  // Group applications by status
  const applicationsByStatus: Record<string, Application[]> = {
    'Preparando': [],
    'Enviado': [],
    'Aguardando': [],
    'Aceito': [],
    'Rejeitado': [],
  };

  applications.forEach(app => {
    if (applicationsByStatus[app.status]) {
      applicationsByStatus[app.status].push(app);
    }
  });

  // Status colors and icons
  const statusStyles: Record<string, { color: string; bgColor: string; borderColor: string }> = {
    'Preparando': { color: 'text-blue-800', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    'Enviado': { color: 'text-yellow-800', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
    'Aguardando': { color: 'text-purple-800', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
    'Aceito': { color: 'text-green-800', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    'Rejeitado': { color: 'text-red-800', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language === 'en' ? 'en-US' : 'pt-BR').format(date);
  };

  // Normaliza tipo para tradução
  const getTypeLabel = (type: string) => {
    const key = `application_type_${type.toLowerCase()}`;
    return t(key, type);
  };

  // Normaliza status para tradução
  const getStatusLabel = (status: string) => {
    // Mapeamento para as chaves corretas do translation.json
    const statusMap: Record<string, string> = {
      'Preparando': 'status_preparing',
      'Enviado': 'status_sent',
      'Aguardando': 'status_waiting',
      'Aceito': 'status_accepted',
      'Rejeitado': 'status_rejected',
    };
    const key = statusMap[status] || status;
    return t(key, status);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('applications_title')}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {t('applications_subtitle')}
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<PlusCircle size={16} />}
          onClick={() => {
            setIsAddingApplication(true);
            setEditingApplication(null);
          }}
          disabled={isAddingApplication || editingApplication !== null || showDocumentChecklist !== null}
        >
          {t('applications_new')}
        </Button>
      </div>

      {isAddingApplication && (
        <Card title={t('applications_add_new')}>
          <ApplicationForm
            onSubmit={handleAddApplication}
            isEdit={false}
          />
        </Card>
      )}

      {editingApplication && (
        <Card title={t('applications_edit')}>
          <ApplicationForm
            onSubmit={handleUpdateApplication}
            initialData={editingApplication}
            isEdit={true}
          />
        </Card>
      )}

      {showDocumentChecklist && (
        <Card title={t('applications_checklist')}>
          <DocumentChecklistForm
            documentChecklist={applications.find(app => app.id === showDocumentChecklist)?.documents || {
              cv: { status: 'Pendente', notes: '' },
              personalStatement: { status: 'Pendente', notes: '' },
              recommendation: { status: 'Pendente', notes: '' },
              vaccination: { status: 'Pendente', notes: '' },
              passport: { status: 'Pendente', notes: '' },
              insurance: { status: 'Pendente', notes: '' },
            }}
            onSave={(documents) => handleDocumentChecklistUpdate(showDocumentChecklist, documents)}
            onCancel={() => setShowDocumentChecklist(null)}
          />
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(applicationsByStatus).map(([status, apps]) => (
          <div key={status} className={`space-y-4 ${statusStyles[status].bgColor} p-5 rounded-lg ${statusStyles[status].borderColor} border`}>
            <div className="flex justify-between items-center">
              <h2 className={`font-semibold ${statusStyles[status].color}`}>{getStatusLabel(status)} ({apps.length})</h2>
            </div>

            {apps.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {t('applications_none_status')}
              </div>
            ) : (
              <div className="space-y-3">
                {apps.map(app => (
                  <Card
                    key={app.id}
                    className="hover:shadow-md transition-shadow duration-200 border-gray-200"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{getTypeLabel(app.type)}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{t('applications_deadline')}: {formatDate(app.deadline)}</span>
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{app.hospitalName}</h3>
                      {app.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">{app.notes}</p>
                      )}
                      <div className="pt-2 flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<FileCheck size={14} />}
                          onClick={() => {
                            setShowDocumentChecklist(app.id);
                            setIsAddingApplication(false);
                            setEditingApplication(null);
                          }}
                          className="rounded-full px-6 py-2 font-bold border-2 border-blue-600 text-blue-700 bg-white hover:bg-blue-50 hover:shadow-lg hover:scale-[1.03] transition-all duration-150 w-full sm:w-auto mb-2 flex items-center justify-center gap-2 shadow-sm"
                        >
                          {t('applications_documents', 'Documentos')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingApplication(app);
                            setIsAddingApplication(false);
                            setShowDocumentChecklist(null);
                          }}
                          className="rounded-full px-6 py-2 font-bold border-2 border-blue-600 text-blue-700 bg-white hover:bg-blue-50 hover:shadow-lg hover:scale-[1.03] transition-all duration-150 w-full sm:w-auto mb-2 flex items-center justify-center gap-2 shadow-sm"
                        >
                          {t('applications_edit_btn', 'Editar')}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteApplication(app.id)}
                          className="rounded-full px-6 py-2 font-bold bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:scale-[1.03] transition-all duration-150 w-full sm:w-auto flex items-center justify-center gap-2 shadow-sm"
                        >
                          {t('applications_delete_btn', 'Excluir')}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppTrackr;