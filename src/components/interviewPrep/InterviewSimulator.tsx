import React, { useState, useEffect } from 'react';
import { CameraIcon, Mic, MicOff, Clock } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { InterviewCategory, InterviewQuestion } from '../../types';
import { INTERVIEW_QUESTIONS } from '../../utils/constants';
import { useTranslation } from 'react-i18next';

interface InterviewSimulatorProps {
  onSaveResponse: (questionId: string, question: string, response: string, category: InterviewCategory) => void;
}

const InterviewSimulator: React.FC<InterviewSimulatorProps> = ({ onSaveResponse }) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<InterviewCategory | 'Todas'>('Todas');
  const [questionsQueue, setQuestionsQueue] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);

  // Filter questions by category
  const filteredQuestions = selectedCategory === 'Todas'
    ? INTERVIEW_QUESTIONS
    : INTERVIEW_QUESTIONS.filter(q => q.category === selectedCategory);

  // Generate 5 unique random questions
  const generateQuestionsQueue = () => {
    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  };

  // Start simulation with 5 questions
  const startSimulation = () => {
    const queue = generateQuestionsQueue();
    setQuestionsQueue(queue);
    setCurrentIndex(0);
    setResponse('');
    setTimeLeft(120);
    setIsSimulating(true);
    setTimerActive(true);
  };

  // Handle next question
  const handleNext = () => {
    if (questionsQueue[currentIndex] && response.trim()) {
      onSaveResponse(
        questionsQueue[currentIndex].id,
        questionsQueue[currentIndex].question,
        response,
        questionsQueue[currentIndex].category
      );
    }
    if (currentIndex < 4) {
      setCurrentIndex(currentIndex + 1);
      setResponse('');
      setTimeLeft(120);
      setTimerActive(true);
    } else {
      setIsSimulating(false);
      setTimerActive(false);
    }
  };

  // Handle timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate timer progress percentage
  const timerProgress = (timeLeft / 120) * 100;

  // Determine timer color based on time left
  const getTimerColor = () => {
    if (timeLeft > 60) return 'bg-green-500';
    if (timeLeft > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card title={t('interview_title')} className="h-full">
      {!isSimulating ? (
        <div className="space-y-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('interview_select_category')}
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as InterviewCategory | 'Todas')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Todas">{t('interview_all_categories')}</option>
            </select>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">{t('interview_how_it_works_title')}</h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              {t('interview_how_it_works_desc')}
            </p>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={startSimulation} 
              variant="primary"
              size="lg"
              disabled={filteredQuestions.length < 5}
              leftIcon={<CameraIcon size={20} />}
            >
              {t('interview_start_training')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              {questionsQueue[currentIndex]?.category}
            </span>
            
            <div className="flex items-center">
              <Clock size={16} className="text-gray-500 dark:text-gray-400 mr-1" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{formatTime(timeLeft)}</span>
            </div>
          </div>
          
          {/* Timer bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-6">
            <div 
              className={`h-2.5 rounded-full transition-all duration-1000 ease-linear ${getTimerColor()}`} 
              style={{ width: `${timerProgress}%` }}
            ></div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('interview_question_number', { number: currentIndex + 1 })}</h3>
            <p className="text-gray-800 dark:text-gray-200 italic">{questionsQueue[currentIndex]?.question}</p>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="response" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('interview_your_response')}
              </label>
              <div className="flex items-center">
                {timerActive ? (
                  <Mic size={16} className="text-green-500 mr-1" />
                ) : (
                  <MicOff size={16} className="text-red-500 mr-1" />
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {timerActive ? t('interview_recording') : t('interview_time_up')}
                </span>
              </div>
            </div>
            <textarea
              id="response"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={6}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder={t('interview_placeholder')}
              disabled={!timerActive}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            {timerActive && (
              <Button 
                onClick={() => setTimerActive(false)} 
                variant="outline"
                size="md"
              >
                {t('interview_pause_timer')}
              </Button>
            )}
            <Button 
              onClick={handleNext}
              variant="primary"
              size="md"
              disabled={!response.trim() && timerActive}
            >
              {currentIndex < 4 ? t('interview_next_question') : t('interview_finish')}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default InterviewSimulator;