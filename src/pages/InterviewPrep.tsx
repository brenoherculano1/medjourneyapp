import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import InterviewSimulator from '../components/interviewPrep/InterviewSimulator';
import ResponseList from '../components/interviewPrep/ResponseList';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { InterviewCategory, InterviewResponse } from '../types';
import { Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const InterviewPrep: React.FC = () => {
  const { interviewResponses, addInterviewResponse, deleteInterviewResponse } = useAppContext();
  const [isSimulating, setIsSimulating] = useState(false);
  const [editingResponse, setEditingResponse] = useState<InterviewResponse | null>(null);
  const [editedResponseText, setEditedResponseText] = useState('');
  const { t } = useTranslation();

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('interview_title')}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {t('interview_subtitle')}
          </p>
        </div>
        {!isSimulating && !editingResponse && (
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Play size={16} />}
            onClick={() => setIsSimulating(true)}
          >
            {t('interview_start_simulation')}
          </Button>
        )}
      </div>

      {isSimulating ? (
        <InterviewSimulator onSaveResponse={handleSaveResponse} />
      ) : editingResponse ? (
        <Card title={t('interview_edit_response', { category: editingResponse.category })}>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('interview_question')}</h3>
              <p className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-gray-800 dark:text-gray-200 italic">{editingResponse.question}</p>
            </div>
            <div>
              <label htmlFor="response" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('interview_your_response')}
              </label>
              <textarea
                id="response"
                value={editedResponseText}
                onChange={(e) => setEditedResponseText(e.target.value)}
                rows={8}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setEditingResponse(null)}
              >
                {t('interview_cancel')}
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdateResponse}
                disabled={!editedResponseText.trim()}
              >
                {t('interview_update_response')}
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