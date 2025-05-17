import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import VisaForm from '../components/visaPlanner/VisaForm';
import { VisaPlanning } from '../types';

const VisaPlanner: React.FC = () => {
  const { visaPlanning, addVisaPlanning, updateVisaPlanning, deleteVisaPlanning } = useAppContext();
  const [isAddingPlanning, setIsAddingPlanning] = useState(false);
  const [editingPlanning, setEditingPlanning] = useState<VisaPlanning | null>(null);

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
    if (confirm('Tem certeza que deseja excluir este planejamento?')) {
      deleteVisaPlanning(id);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Não agendado';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  // Status badges
  const statusBadge = (status: string) => {
    const styles = {
      'Pendente': 'bg-yellow-100 text-yellow-800',
      'Agendado': 'bg-blue-100 text-blue-800',
      'Concluído': 'bg-green-100 text-green-800',
    } as const;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planejamento de Visto e Viagem</h1>
          <p className="text-gray-600 mt-1">
            Organize seus documentos, agendamentos e preparativos de viagem
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
          Novo Planejamento
        </Button>
      </div>

      {isAddingPlanning && (
        <Card title="Adicionar Novo Planejamento">
          <VisaForm
            onSubmit={handleAddPlanning}
            isEdit={false}
          />
        </Card>
      )}

      {editingPlanning && (
        <Card title="Editar Planejamento">
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum planejamento adicionado</h3>
                <p className="text-gray-500 mb-6">
                  Adicione informações sobre seu visto e planejamento de viagem para cada país de destino.
                </p>
                <Button
                  variant="primary"
                  leftIcon={<PlusCircle size={18} />}
                  onClick={() => setIsAddingPlanning(true)}
                >
                  Criar Planejamento
                </Button>
              </div>
            </Card>
          ) : (
            visaPlanning.map(plan => (
              <Card key={plan.id} className="border border-gray-200">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{plan.country}</h3>
                      <p className="text-gray-600">Visto tipo: {plan.visaType}</p>
                    </div>
                    <div>
                      {statusBadge(plan.status)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Detalhes do Visto</h4>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Agendamento:</span> {formatDate(plan.appointmentDate)}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center space-x-2">
                          <span className="font-medium">Link da Embaixada:</span>
                          <a 
                            href={plan.embassyLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:text-blue-800 truncate max-w-xs inline-block"
                          >
                            {plan.embassyLink}
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Detalhes da Viagem</h4>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Hospedagem:</span> {plan.accommodation || 'Não definido'}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Seguro:</span> {plan.insurance || 'Não definido'}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Passagem:</span> {plan.flight || 'Não definido'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {plan.notes && (
                    <div className="pt-2">
                      <h4 className="text-sm font-medium text-gray-700">Observações</h4>
                      <p className="text-sm text-gray-600 mt-1">{plan.notes}</p>
                    </div>
                  )}
                  
                  <div className="pt-4 flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingPlanning(plan)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeletePlanning(plan.id)}
                    >
                      Excluir
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