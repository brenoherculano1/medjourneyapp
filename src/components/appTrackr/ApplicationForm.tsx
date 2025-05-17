import React, { useState } from 'react';
import { Calendar, Link as LinkIcon } from 'lucide-react';
import Button from '../common/Button';
import { Application, ApplicationStatus, ApplicationType, DocumentStatus } from '../../types';

interface ApplicationFormProps {
  onSubmit: (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Application;
  isEdit?: boolean;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  onSubmit,
  initialData,
  isEdit = false,
}) => {
  const emptyDocuments = {
    cv: { status: 'Pendente' as DocumentStatus, notes: '' },
    personalStatement: { status: 'Pendente' as DocumentStatus, notes: '' },
    recommendation: { status: 'Pendente' as DocumentStatus, notes: '' },
    vaccination: { status: 'Pendente' as DocumentStatus, notes: '' },
    passport: { status: 'Pendente' as DocumentStatus, notes: '' },
    insurance: { status: 'Pendente' as DocumentStatus, notes: '' },
  };

  const [formData, setFormData] = useState<Omit<Application, 'id' | 'createdAt' | 'updatedAt'> & {
    professorName?: string;
    professorEmail?: string;
  }>({
    hospitalName: initialData?.hospitalName || '',
    type: initialData?.type || 'Clerkship',
    deadline: initialData?.deadline || '',
    status: initialData?.status || 'Preparando',
    website: initialData?.website || '',
    notes: initialData?.notes || '',
    documents: initialData?.documents || emptyDocuments,
    professorName: initialData?.professorName || '',
    professorEmail: initialData?.professorEmail || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700">
            Nome do Hospital/Programa *
          </label>
          <input
            type="text"
            id="hospitalName"
            name="hospitalName"
            value={formData.hospitalName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Tipo de Estágio *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Clerkship">Clerkship</option>
              <option value="Observership">Observership</option>
              <option value="Research">Research</option>
            </select>
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
              {formData.type === 'Clerkship' ? 'Deadline *' : 'Data de envio da aplicação *'}
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={16} className="text-gray-400" />
              </div>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                className="block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Campos extras para Observership/Research */}
        {(formData.type === 'Observership' || formData.type === 'Research') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="professorName" className="block text-sm font-medium text-gray-700">
                Nome do professor
              </label>
              <input
                type="text"
                id="professorName"
                name="professorName"
                value={formData.professorName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Digite o nome do professor"
              />
            </div>
            <div>
              <label htmlFor="professorEmail" className="block text-sm font-medium text-gray-700">
                E-mail do Professor
              </label>
              <input
                type="email"
                id="professorEmail"
                name="professorEmail"
                value={formData.professorEmail}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="exemplo@email.com"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Preparando">Preparando</option>
              <option value="Enviado">Enviado</option>
              <option value="Aguardando">Aguardando</option>
              <option value="Aceito">Aceito</option>
              <option value="Rejeitado">Rejeitado</option>
            </select>
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Link do Programa
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon size={16} className="text-gray-400" />
              </div>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Anotações
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Informações adicionais sobre esta aplicação..."
          />
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
          >
            {isEdit ? 'Atualizar Aplicação' : 'Adicionar Aplicação'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ApplicationForm;