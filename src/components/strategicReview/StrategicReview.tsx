import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { CheckCircle, AlertTriangle, Flame, BookOpen, ClipboardList, MessageSquare, TrendingUp } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useAppContext } from '../../contexts/AppContext';

const getLastNDays = (n: number) => {
  const arr = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(d.toISOString().slice(0, 10));
  }
  return arr;
};

const StrategicReview: React.FC = () => {
  const { applications, interviewResponses } = useAppContext();
  // Simulação: buscar dados do localStorage
  const [studyLog, setStudyLog] = useState<any[]>([]);
  const [usmleProgress, setUsmleProgress] = useState<any>({});
  const [firstLogin, setFirstLogin] = useState<string | null>(null);
  const [lastReview, setLastReview] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    setFirstLogin(localStorage.getItem('firstLoginDate') || new Date().toISOString());
    setLastReview(localStorage.getItem('lastStrategicReview') || null);
    setStudyLog(JSON.parse(localStorage.getItem('studyLog') || '[]'));
    setUsmleProgress(JSON.parse(localStorage.getItem('usmle-progress') || '{}'));
  }, []);

  // Checagem automática semanal
  useEffect(() => {
    if (!firstLogin) return;
    const last = lastReview ? new Date(lastReview) : null;
    const now = new Date();
    const first = new Date(firstLogin);
    const diff = Math.floor((now.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
    if (diff % 7 === 0 && (!last || now.getDate() !== last.getDate())) {
      setShowReview(true);
      localStorage.setItem('lastStrategicReview', now.toISOString());
    }
  }, [firstLogin, lastReview]);

  // Acionamento manual
  const handleManualReview = () => {
    setShowReview(true);
    localStorage.setItem('lastStrategicReview', new Date().toISOString());
  };

  // Resetar semana
  const handleResetWeek = () => {
    setShowReview(false);
  };

  // Lógica de análise dos dados
  const last7Days = getLastNDays(7);
  const last14Days = getLastNDays(14);

  // 1. Aplicações
  const recentApps = applications.filter(app => last7Days.includes(app.updatedAt?.slice(0, 10)));
  const daysSinceLastApp = applications.length
    ? Math.floor((new Date().getTime() - new Date(applications[applications.length - 1].updatedAt).getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  // 2. Entrevistas
  const recentInterviews = interviewResponses.filter(resp => last7Days.includes(resp.createdAt?.slice(0, 10)));

  // 3. USMLE Tracker
  const usmleUpdated = usmleProgress && last7Days.some(day =>
    ['step1', 'step2Done', 'step2Score', 'oet', 'ecfmg', 'epic'].some(key =>
      usmleProgress[key + '_updated'] === day
    )
  );

  // 4. Study Log
  const studyLogWeek = studyLog.filter(log => last7Days.includes(log.date));
  const studyLogPrev = studyLog.filter(log => last14Days.includes(log.date) && !last7Days.includes(log.date));
  const streak = studyLogWeek.length === 7;
  const streakBroken = studyLogWeek.length < 7 && studyLogPrev.length > 0;

  // Gráfico comparativo
  const chartData = {
    labels: last7Days,
    datasets: [
      {
        label: 'Flashcards',
        backgroundColor: '#2563eb',
        data: last7Days.map(day => studyLog.find(l => l.date === day)?.anki || 0),
      },
      {
        label: 'Questões USMLE',
        backgroundColor: '#dc2626',
        data: last7Days.map(day => studyLog.find(l => l.date === day)?.usmle || 0),
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="mr-2 text-blue-600" /> Revisão Estratégica
        </h1>
        <Button variant="primary" onClick={handleManualReview}>
          Revisar minha jornada agora
        </Button>
      </div>

      {showReview && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Aplicações */}
          <Card>
            <div className="flex items-center mb-2">
              <ClipboardList className="text-blue-600 mr-2" />
              <span className="font-semibold text-lg">Aplicações</span>
            </div>
            <div className={`mb-2 ${daysSinceLastApp >= 5 ? 'text-yellow-700' : 'text-green-700'}`}>
              {applications.length === 0 ? (
                <>
                  <AlertTriangle className="inline mr-1 text-yellow-500" />
                  Nenhuma aplicação registrada ainda.
                </>
              ) : daysSinceLastApp >= 5 ? (
                <>
                  <AlertTriangle className="inline mr-1 text-yellow-500" />
                  Você está há 5 dias sem adicionar nenhuma aplicação. Isso pode afetar suas chances de resposta a tempo dos programas.
                </>
              ) : (
                <>
                  <CheckCircle className="inline mr-1 text-green-500" />
                  {recentApps.length} aplicações criadas/editadas nos últimos 7 dias.
                </>
              )}
            </div>
          </Card>

          {/* Entrevistas */}
          <Card>
            <div className="flex items-center mb-2">
              <MessageSquare className="text-green-600 mr-2" />
              <span className="font-semibold text-lg">Entrevistas</span>
            </div>
            <div className={recentInterviews.length ? 'text-green-700' : 'text-yellow-700'}>
              {interviewResponses.length === 0 ? (
                <>
                  <AlertTriangle className="inline mr-1 text-yellow-500" />
                  Nenhum treino de entrevista registrado ainda.
                </>
              ) : recentInterviews.length ? (
                <>
                  <CheckCircle className="inline mr-1 text-green-500" />
                  Excelente! Você manteve seu ritmo de simulações.
                </>
              ) : (
                <>
                  <AlertTriangle className="inline mr-1 text-yellow-500" />
                  Que tal agendar pelo menos uma simulação esta semana para manter o ritmo de preparação?
                </>
              )}
            </div>
          </Card>

          {/* USMLE Tracker */}
          <Card>
            <div className="flex items-center mb-2">
              <BookOpen className="text-purple-600 mr-2" />
              <span className="font-semibold text-lg">USMLE Tracker</span>
            </div>
            <div className={usmleUpdated ? 'text-green-700' : 'text-red-700'}>
              {Object.keys(usmleProgress).length === 0 ? (
                <>
                  <AlertTriangle className="inline mr-1 text-red-500" />
                  Nenhum progresso registrado nos exames. Atualize seu USMLE Tracker para manter seu plano estratégico alinhado.
                </>
              ) : usmleUpdated ? (
                <>
                  <CheckCircle className="inline mr-1 text-green-500" />
                  Progresso registrado nos exames nesta semana.
                </>
              ) : (
                <>
                  <AlertTriangle className="inline mr-1 text-red-500" />
                  Nenhum progresso registrado nos exames. Atualize seu USMLE Tracker para manter seu plano estratégico alinhado.
                </>
              )}
            </div>
          </Card>

          {/* Study Log */}
          <Card>
            <div className="flex items-center mb-2">
              <Flame className="text-orange-600 mr-2" />
              <span className="font-semibold text-lg">Study Log</span>
            </div>
            <div className={streak ? 'text-green-700' : streakBroken ? 'text-yellow-700' : 'text-red-700'}>
              {studyLog.length === 0 ? (
                <>
                  <AlertTriangle className="inline mr-1 text-red-500" />
                  Nenhum registro de estudo nesta semana.
                </>
              ) : streak ? (
                <>
                  <Flame className="inline mr-1 text-orange-500" />
                  Você manteve sua disciplina e registrou estudo todos os dias. Excelente!
                </>
              ) : streakBroken ? (
                <>
                  <AlertTriangle className="inline mr-1 text-yellow-500" />
                  Seu streak foi interrompido. Consistência é um dos fatores mais valorizados no Match.
                </>
              ) : (
                <>
                  <AlertTriangle className="inline mr-1 text-red-500" />
                  Nenhum registro de estudo nesta semana.
                </>
              )}
            </div>
            <div className="mt-4">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: true } },
                  scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } },
                }}
              />
            </div>
          </Card>
        </div>
      )}

      {showReview && (
        <div className="flex justify-center mt-8">
          <Button variant="success" onClick={handleResetWeek}>
            Começar nova semana com foco total
          </Button>
        </div>
      )}
    </div>
  );
};

export default StrategicReview; 