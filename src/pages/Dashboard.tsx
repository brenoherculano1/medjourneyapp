import React, { useEffect, useState } from 'react';
import { Sparkles, Plus, MessageSquare } from 'lucide-react';

import { useAppContext } from '../contexts/AppContext';
import { useNavigation } from '../contexts/NavigationContext';
import Button from '../components/common/Button';
import ProgressCard from '../components/dashboard/ProgressCard';
import ApplicationsCard from '../components/dashboard/ApplicationsCard';
import SuggestionCard from '../components/dashboard/SuggestionCard';

const Dashboard: React.FC = () => {
  const { applications, interviewResponses, visaPlanning, user } = useAppContext();
  const { navigateTo } = useNavigation();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Seja Bem-vindo!</h1>

          <p className="text-gray-600 mt-1">
            Acompanhe seu progresso e gerencie seus estágios internacionais.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Progress Overview */}
        <div className="md:col-span-7">
          <ProgressCard 
            applications={applications}
            interviewResponses={interviewResponses}
            visaPlanning={visaPlanning}
          />
        </div>
        {/* USMLE Tracker */}
        <div className="md:col-span-5">
          <UsmleTrackerCard />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Suggestion Card */}
        <div className="md:col-span-5">
          <SuggestionCard applications={applications} />
        </div>
        
        {/* Recent Applications */}
        <div className="md:col-span-7">
          <ApplicationsCard applications={applications} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Quick Actions */}
        <div className="md:col-span-6">
          <div className="bg-white rounded-lg shadow-sm p-6 h-full">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Ações Rápidas</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => navigateTo('applications')}
                className="group w-full"
              >
                <div className="border border-gray-200 hover:border-blue-200 hover:bg-blue-50 rounded-lg p-4 transition-all duration-200">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Plus size={18} className="text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900 group-hover:text-blue-700">Nova Aplicação</span>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => navigateTo('interviews')}
                className="group w-full"
              >
                <div className="border border-gray-200 hover:border-blue-200 hover:bg-blue-50 rounded-lg p-4 transition-all duration-200">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <MessageSquare size={18} className="text-green-600" />
                    </div>
                    <span className="font-medium text-gray-900 group-hover:text-blue-700">Treinar Entrevista</span>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => navigateTo('visaPlanning')}
                className="group w-full"
              >
                <div className="border border-gray-200 hover:border-blue-200 hover:bg-blue-50 rounded-lg p-4 transition-all duration-200">
                  <div className="flex items-center">
                    <div className="bg-orange-100 p-2 rounded-full mr-3">
                      <PlaneIcon size={18} className="text-orange-600" />
                    </div>
                    <span className="font-medium text-gray-900 group-hover:text-blue-700">Planejar Viagem</span>
                  </div>
                </div>
              </button>
              
              <a
                href="https://form.respondi.app/ggzIx6cO"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full"
              >
                <div className="border border-gray-200 hover:border-blue-200 hover:bg-blue-50 rounded-lg p-4 transition-all duration-200">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <CalendarIcon size={18} className="text-purple-600" />
                    </div>
                    <span className="font-medium text-gray-900 group-hover:text-blue-700">
                      Agendar Mentoria Gratuita
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom icons

function PlaneIcon(props: { size: number; className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={props.size} 
      height={props.size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
    </svg>
  );
}

function CalendarIcon(props: { size: number; className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={props.size} 
      height={props.size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={props.className}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}

// Componente de mini bandeira dos EUA
const MiniUsaFlag = ({ className = "" }) => (
  <svg
    width="32"
    height="20"
    viewBox="0 0 32 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: "inline", margin: "0 0.25rem" }}
  >
    <rect width="32" height="20" rx="2" fill="#fff"/>
    <rect width="32" height="20" rx="2" fill="#B22234"/>
    <g>
      <rect y="2" width="32" height="2" fill="#fff"/>
      <rect y="6" width="32" height="2" fill="#fff"/>
      <rect y="10" width="32" height="2" fill="#fff"/>
      <rect y="14" width="32" height="2" fill="#fff"/>
      <rect y="18" width="32" height="2" fill="#fff"/>
    </g>
    <rect width="9" height="10" fill="#3C3B6E"/>
    <g fill="#fff">
      <circle cx="1.5" cy="1.5" r="0.5"/>
      <circle cx="3.5" cy="1.5" r="0.5"/>
      <circle cx="5.5" cy="1.5" r="0.5"/>
      <circle cx="7.5" cy="1.5" r="0.5"/>
      <circle cx="1.5" cy="3" r="0.5"/>
      <circle cx="3.5" cy="3" r="0.5"/>
      <circle cx="5.5" cy="3" r="0.5"/>
      <circle cx="7.5" cy="3" r="0.5"/>
      <circle cx="1.5" cy="4.5" r="0.5"/>
      <circle cx="3.5" cy="4.5" r="0.5"/>
      <circle cx="5.5" cy="4.5" r="0.5"/>
      <circle cx="7.5" cy="4.5" r="0.5"/>
      <circle cx="1.5" cy="6" r="0.5"/>
      <circle cx="3.5" cy="6" r="0.5"/>
      <circle cx="5.5" cy="6" r="0.5"/>
      <circle cx="7.5" cy="6" r="0.5"/>
      <circle cx="1.5" cy="7.5" r="0.5"/>
      <circle cx="3.5" cy="7.5" r="0.5"/>
      <circle cx="5.5" cy="7.5" r="0.5"/>
      <circle cx="7.5" cy="7.5" r="0.5"/>
      <circle cx="1.5" cy="9" r="0.5"/>
      <circle cx="3.5" cy="9" r="0.5"/>
      <circle cx="5.5" cy="9" r="0.5"/>
      <circle cx="7.5" cy="9" r="0.5"/>
    </g>
  </svg>
);

const USMLE_CONGRATS_KEY = 'usmle-congrats-shown';

const UsmleTrackerCard: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [answer, setAnswer] = useState<null | 'done' | 'notyet'>(null);
  const { navigateTo } = useNavigation();

  useEffect(() => {
    const saved = localStorage.getItem('usmle-progress');
    if (saved) {
      const data = JSON.parse(saved);
      let filled = 0;
      if (data.step1 && data.step1 !== 'Não feito') filled++;
      if (data.step2Done && data.step2Score) filled++;
      else if (data.step2Done) filled += 0.5;
      if (data.oet === 'Concluído') filled++;
      if (data.ecfmg && data.ecfmg !== 'Não iniciado') filled++;
      if (data.epic === 'Feita') filled++;
      const pct = Math.round((filled / 5) * 100);
      setProgress(pct);
    } else {
      setProgress(0);
    }
  }, []);

  // Card comemorativo interativo ao atingir 100%
  if (progress === 100) {
    return (
      <div
        className="relative bg-white border-4 rounded-xl p-6 h-full flex flex-col justify-between shadow-lg animate-fade-in"
        style={{
          borderColor: '#3b82f6 #ef4444 #3b82f6 #ef4444',
          borderStyle: 'solid',
          borderWidth: '4px',
          animation: 'fadeIn 0.8s',
        }}
      >
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(30px);}
              to { opacity: 1; transform: none;}
            }
            .animate-fade-in { animation: fadeIn 0.8s; }
            .animate-bounce {
              animation: bounceIn 0.7s;
            }
            @keyframes bounceIn {
              0% { transform: scale(0.9); opacity: 0; }
              60% { transform: scale(1.05); opacity: 1; }
              100% { transform: scale(1); }
            }
          `}
        </style>
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center justify-center mb-2">
            <span
              className="text-2xl md:text-3xl font-bold text-center"
              style={{
                color: '#1e3a8a',
                textShadow: '0 1px 6px rgba(0,0,0,0.10), 0 0px 1px #fff',
                background: 'none',
                WebkitBackgroundClip: 'initial',
                WebkitTextFillColor: 'initial',
                borderRadius: '1em',
                border: 'none',
                boxShadow: 'none',
                padding: 0,
              }}
            >
              🎉 "Vimos que você completou o processo para o USMLE. Meus parabéns, futuro(a) M.D.!!"
            </span>
          </div>
          <div className="flex items-center gap-2 mt-4 justify-center">
            <MiniUsaFlag />
            <MiniUsaFlag />
            <MiniUsaFlag />
          </div>
        </div>
        <div className="mt-6 mb-4 text-center text-lg font-medium text-gray-800">
          Me responde uma pergunta: você já fez os estágios necessários para ter seu tão sonhado Match?
        </div>
        {!answer && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-bounce">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow transition"
              onClick={() => setAnswer('done')}
            >
              Já fiz!!
            </button>
            <button
              className="bg-white border-2 border-blue-600 hover:bg-blue-50 text-blue-700 font-semibold px-6 py-2 rounded-full shadow transition"
              onClick={() => setAnswer('notyet')}
            >
              Ainda não, será meu foco agora!
            </button>
          </div>
        )}
        {answer === 'done' && (
          <div className="mt-6 text-center text-base font-medium text-blue-800 animate-fade-in">
            Incrível! Ficamos felizes de ver você tão bem posicionado. Que sua aplicação seja um sucesso — estamos na torcida para ver você conquistando o Match em grande estilo. 👏🇺🇸
          </div>
        )}
        {answer === 'notyet' && (
          <div className="mt-6 text-center animate-fade-in">
            <div className="text-base font-medium text-blue-800 mb-4">
              Esse é o momento perfeito. Agora que você dominou o USMLE, falta só o próximo passo estratégico: os estágios certos.<br /><br />
              Nessa fase, a maioria comete erros caros, perde tempo com estágios fracos ou não entende o jogo real das cartas de recomendação.<br /><br />
              Nós criamos uma mentoria individual pensada exatamente para quem está no seu nível — para alinhar sua realidade com o tipo de aplicação que realmente vence.
            </div>
            <a
              href="https://wa.me/+5555839861362?text=Ol%C3%A1%2C%20acabei%20de%20finalizar%20os%20Steps%2C%20mas%20ainda%20n%C3%A3o%20fiz%20os%20est%C3%A1gios%20necess%C3%A1rios%20para%20conseguir%20meu%20Match%2C%20quero%20marcar%20uma%20mentoria%20com%20um%20especialista!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full shadow transition"
            >
              📲 Quero conversar com um estrategista
            </a>
          </div>
        )}
        <div className="mb-4 mt-8">
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div
              className="bg-gradient-to-r from-blue-800 to-red-700 h-4 rounded-full animate-pulse"
              style={{ width: '100%' }}
            />
          </div>
          <div className="text-right text-base font-bold text-blue-700">100% completo</div>
        </div>
      </div>
    );
  }

  // Card padrão (progresso < 100%)
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">USMLE Tracker</h2>
        <p className="text-gray-600 text-sm mb-4">Acompanhe seu progresso nos exames da jornada internacional.</p>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div
            className="bg-blue-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-right text-sm font-medium text-blue-700">{progress}%</div>
      </div>
      <Button
        variant="secondary"
        className="w-full rounded-full text-blue-700 bg-blue-100 hover:bg-blue-200"
        onClick={() => navigateTo('usmle')}
      >
        Atualize seu Status do USMLE
      </Button>
    </div>
  );
};

export default Dashboard;