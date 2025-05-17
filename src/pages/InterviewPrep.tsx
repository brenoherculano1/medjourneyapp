import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import InterviewSimulator from '../components/interviewPrep/InterviewSimulator';
import ResponseList from '../components/interviewPrep/ResponseList';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { InterviewCategory, InterviewResponse } from '../types';
import { Play } from 'lucide-react';

const InterviewPrep: React.FC = () => {
  const { interviewResponses, addInterviewResponse, deleteInterviewResponse } = useAppContext();
  const [isSimulating, setIsSimulating] = useState(false);
  const [editingResponse, setEditingResponse] = useState<InterviewResponse | null>(null);
  const [editedResponseText, setEditedResponseText] = useState('');

  const handleSaveResponse = (questionId: string, question: string, response: string, category: InterviewCategory) => {
    addInterviewResponse({
      questionId,
      question,
      response,
      category,
    });
    setIsSimulating(false);
  };

  const handleDeleteResponse = (id: string) => {
    deleteInterviewResponse(id);
  };

  const handleEditResponse = (response: InterviewResponse) => {
    setEditingResponse(response);
    setEditedResponseText(response.response);
  };

  const handleUpdateResponse = () => {
    if (editingResponse) {
      // Create a new response object with the updated text
      addInterviewResponse({
        questionId: editingResponse.questionId,
        question: editingResponse.question,
        response: editedResponseText,
        category: editingResponse.category,
      });
      // Delete the old response
      deleteInterviewResponse(editingResponse.id);
      setEditingResponse(null);
      setEditedResponseText('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Simulador de Entrevistas</h1>
          <p className="text-gray-600 mt-1">
            Pratique para entrevistas em inglês com nosso simulador
          </p>
        </div>
        {!isSimulating && !editingResponse && (
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Play size={16} />}
            onClick={() => setIsSimulating(true)}
          >
            Iniciar Simulação
          </Button>
        )}
      </div>

      {isSimulating ? (
        <InterviewSimulator onSaveResponse={handleSaveResponse} />
      ) : editingResponse ? (
        <Card title={`Editar Resposta - ${editingResponse.category}`}>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Pergunta:</h3>
              <p className="bg-gray-50 p-3 rounded text-gray-800 italic">{editingResponse.question}</p>
            </div>
            <div>
              <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-2">
                Sua resposta:
              </label>
              <textarea
                id="response"
                value={editedResponseText}
                onChange={(e) => setEditedResponseText(e.target.value)}
                rows={8}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setEditingResponse(null)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdateResponse}
                disabled={!editedResponseText.trim()}
              >
                Atualizar Resposta
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <ResponseList
          responses={interviewResponses}
          onDelete={handleDeleteResponse}
          onEdit={handleEditResponse}
        />
      )}
    </div>
  );
};

export default InterviewPrep;