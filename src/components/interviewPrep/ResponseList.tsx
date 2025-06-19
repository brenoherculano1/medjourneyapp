import React from 'react';
import { Clock, Edit, Trash2 } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { InterviewResponse } from '../../types';
import { useTranslation } from 'react-i18next';

interface ResponseListProps {
  responses: InterviewResponse[];
  onDelete: (id: string) => void;
  onEdit: (response: InterviewResponse) => void;
}

const ResponseList: React.FC<ResponseListProps> = ({ responses, onDelete, onEdit }) => {
  const { t, i18n } = useTranslation();
  // Sort responses by date (newest first)
  const sortedResponses = [...responses].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language === 'en' ? 'en-US' : 'pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const categoryMap: Record<string, string> = {
    'Pessoal': t('interview_category_personal', 'Personal'),
    'Clínica': t('interview_category_clinical', 'Clinical'),
    'Ética': t('interview_category_ethics', 'Ethics'),
    'Storytelling': t('interview_category_storytelling', 'Storytelling'),
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('interview_my_responses', 'My Responses')}</h2>
      
      {sortedResponses.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-2">{t('interview_no_responses')}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">{t('interview_use_simulator')}</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedResponses.map((response) => (
            <Card key={response.id} className="border border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {categoryMap[response.category] || response.category}
                  </span>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock size={14} className="mr-1" />
                    {formatDate(response.createdAt)}
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{response.question}</h3>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-gray-700 dark:text-gray-300">
                  <p className="whitespace-pre-line">{response.response}</p>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Edit size={16} />}
                    onClick={() => onEdit(response)}
                  >
                    {t('interview_edit', 'Edit')}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<Trash2 size={16} />}
                    onClick={() => onDelete(response.id)}
                  >
                    {t('interview_delete', 'Delete')}
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