import React, { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const BADGES = [
  { days: 1, label: 'Medical Student', emoji: '🎓' },
  { days: 3, label: 'Clerkship Warrior', emoji: '🦾' },
  { days: 7, label: 'Step Explorer', emoji: '🧭' },
  { days: 14, label: 'Match Ready', emoji: '🏅' },
  { days: 30, label: 'Future Attending', emoji: '👨‍⚕️' },
];

const getLastNDays = (n: number) => {
  const arr = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(d.toISOString().slice(0, 10));
  }
  return arr;
};

const STORAGE_KEY = 'studyLog';

type StudyLogEntry = {
  date: string;
  anki: number;
  uworld: number;
};

const StudyLog: React.FC = () => {
  const [log, setLog] = useState<StudyLogEntry[]>([]);
  const [anki, setAnki] = useState('');
  const [uworld, setUworld] = useState('');
  const [today, setToday] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setLog(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  }, [log]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!anki && !uworld) return;
    setLog(prev => {
      const filtered = prev.filter(entry => entry.date !== today);
      return [
        ...filtered,
        { date: today, anki: Number(anki) || 0, uworld: Number(uworld) || 0 },
      ];
    });
    setAnki('');
    setUworld('');
  };

  // Progresso semanal e mensal
  const last7 = getLastNDays(7);
  const last30 = getLastNDays(30);
  const weekLog = log.filter(l => last7.includes(l.date));
  const monthLog = log.filter(l => last30.includes(l.date));
  // Lógica de streak consecutivo mais recente
  const sortedLog = [...log].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let streakCounter = 0;
  if (sortedLog.length > 0) {
    let lastDate = new Date(sortedLog[sortedLog.length - 1].date);
    streakCounter = 1;
    for (let i = sortedLog.length - 2; i >= 0; i--) {
      const currentDate = new Date(sortedLog[i].date);
      const diff = (lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streakCounter++;
        lastDate = currentDate;
      } else if (diff > 1) {
        break;
      }
    }
    // Se o último registro não for hoje, streak só vai até o último dia consecutivo
    const todayStr = new Date().toISOString().slice(0, 10);
    if (sortedLog[sortedLog.length - 1].date !== todayStr) {
      // streakCounter permanece, mas não soma o dia de hoje
    }
  }
  const streak = weekLog.length === 7;
  const maxStreak = log.reduce((max, _, i, arr) => {
    let count = 1;
    for (let j = i - 1; j >= 0; j--) {
      const d1 = new Date(arr[j + 1].date);
      const d2 = new Date(arr[j].date);
      if ((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24) === 1) count++;
      else break;
    }
    return Math.max(max, count);
  }, 0);
  const unlocked = BADGES.filter(b => maxStreak >= b.days);

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Study Log</h1>
      <Card className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Data</label>
            <input
              type="date"
              value={today}
              onChange={e => setToday(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              max={new Date().toISOString().slice(0, 10)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Anki (flashcards)</label>
              <input
                type="number"
                min={0}
                value={anki}
                onChange={e => setAnki(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Quantos flashcards revisou hoje?"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">UWorld (questões)</label>
              <input
                type="number"
                min={0}
                value={uworld}
                onChange={e => setUworld(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Quantas questões fez hoje?"
              />
            </div>
          </div>
          <Button type="submit" className="mt-2 w-full bg-blue-600 text-white">Registrar</Button>
        </form>
        <div>
          <h2 className="font-semibold text-lg mb-2">Progresso semanal</h2>
          <div className="flex gap-2 mb-2">
            {last7.map(date => {
              const entry = log.find(l => l.date === date);
              return (
                <div key={date} className={`w-8 h-8 flex flex-col items-center justify-center rounded-full border ${entry ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {new Date(date).getDate()}
                </div>
              );
            })}
          </div>
          <div className="text-sm text-gray-600">{weekLog.length}/7 dias registrados nesta semana</div>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-2">Progresso mensal</h2>
          <div className="flex flex-wrap gap-1 mb-2">
            {last30.map(date => {
              const entry = log.find(l => l.date === date);
              return (
                <div key={date} className={`w-6 h-6 flex items-center justify-center rounded-full border text-xs ${entry ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-300'}`}>
                  {new Date(date).getDate()}
                </div>
              );
            })}
          </div>
          <div className="text-sm text-gray-600">{monthLog.length}/30 dias registrados neste mês</div>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-2">Streak atual</h2>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="text-lg font-bold">{streakCounter} dias</span>
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-2">Selos desbloqueados</h2>
          <div className="flex gap-3 flex-wrap">
            {unlocked.length === 0 && <span className="text-gray-400">Nenhum selo ainda</span>}
            {unlocked.map(badge => (
              <div key={badge.days} className="flex flex-col items-center">
                <span className="text-3xl">{badge.emoji}</span>
                <span className="text-xs font-medium text-gray-700">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudyLog;
