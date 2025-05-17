import React from 'react';
import { Clock, Edit, Trash2 } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { InterviewResponse } from '../../types';

interface ResponseListProps {
  responses: InterviewResponse[];
  onDelete: (id: string) => void;
  onEdit: (response: InterviewResponse) => void;
}

const ResponseList: React.FC<ResponseListProps> = ({ responses, onDelete, onEdit }) => {
  // Sort responses by date (newest first)
  const sortedResponses = [...responses].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Minhas Respostas</h2>
      
      {sortedResponses.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">Você ainda não salvou nenhuma resposta</p>
            <p className="text-sm text-gray-400">Use o simulador para praticar suas respostas de entrevista</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedResponses.map((response) => (
            <Card key={response.id} className="border border-gray-200">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {response.category}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={14} className="mr-1" />
                    {formatDate(response.createdAt)}
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900">{response.question}</h3>
                
                <div className="bg-gray-50 p-3 rounded text-gray-700">
                  <p className="whitespace-pre-line">{response.response}</p>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Edit size={16} />}
                    onClick={() => onEdit(response)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<Trash2 size={16} />}
                    onClick={() => onDelete(response.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResponseList;