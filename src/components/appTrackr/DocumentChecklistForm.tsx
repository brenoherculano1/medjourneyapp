import React, { useState } from 'react';
import Button from '../common/Button';
import { DocumentChecklist, DocumentStatus } from '../../types';

interface DocumentChecklistFormProps {
  documentChecklist: DocumentChecklist;
  onSave: (updatedChecklist: DocumentChecklist) => void;
  onCancel: () => void;
}

const DocumentChecklistForm: React.FC<DocumentChecklistFormProps> = ({
  documentChecklist,
  onSave,
  onCancel,
}) => {
  const [checklist, setChecklist] = useState<DocumentChecklist>(documentChecklist);

  const handleStatusChange = (document: keyof DocumentChecklist, status: DocumentStatus) => {
    setChecklist(prev => ({
      ...prev,
      [document]: {
        ...prev[document],
        status,
      },
    }));
  };

  const handleNotesChange = (document: keyof DocumentChecklist, notes: string) => {
    setChecklist(prev => ({
      ...prev,
      [document]: {
        ...prev[document],
        notes,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(checklist);
  };

  const documentLabels: Record<keyof DocumentChecklist, string> = {
    cv: 'Curriculum Vitae (CV)',
    personalStatement: 'Personal Statement',
    recommendation: 'Cartas de Recomendação',
    vaccination: 'Comprovante de Vacinação',
    passport: 'Passaporte',
    insurance: 'Seguro Saúde/Viagem',
  };

  const statusOptions: DocumentStatus[] = ['Pendente', 'Em Progresso', 'Concluído'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {(Object.keys(checklist) as Array<keyof DocumentChecklist>).map((doc) => (
          <div key={doc} className="border border-gray-200 rounded-lg p-4">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{documentLabels[doc]}</span>
                <select
                  value={checklist[doc].status}
                  onChange={(e) => handleStatusChange(doc, e.target.value as DocumentStatus)}
                  className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <textarea
                  value={checklist[doc].notes}
                  onChange={(e) => handleNotesChange(doc, e.target.value)}
                  placeholder="Anotações adicionais..."
                  rows={2}
                  className="w-full text-sm rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
        >
          Salvar Checklist
        </Button>
      </div>
    </form>
  );
};

export default DocumentChecklistForm;