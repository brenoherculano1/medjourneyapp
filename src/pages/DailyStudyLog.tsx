import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAppContext } from '../contexts/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

type StudyLogEntry = {
  date: string;
  anki: number;
  uworld: number;
};

const BADGES = [
  { days: 7, label: 'Medical Student', emoji: '🎓' },
  { days: 14, label: 'Clerkship Explorer', emoji: '🔍' },
  { days: 30, label: 'Clerkship Warrior', emoji: '💪' },
  { days: 60, label: 'Step Master', emoji: '👑' },
  { days: 90, label: 'Future Attending', emoji: '⭐' },
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

const getWeekRange = () => {
  const now = new Date();
  const day = now.getDay(); // 0 (domingo) a 6 (sábado)
  const start = new Date(now);
  start.setDate(now.getDate() - day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const DailyStudyLog: React.FC = () => {
  const { user } = useAppContext();
  const [log, setLog] = useState<StudyLogEntry[]>([]);
  const [anki, setAnki] = useState('');
  const [uworld, setUworld] = useState('');
  const [today, setToday] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudyLog = async () => {
      if (!user?.id) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'dailyStudyLog', user.id));
        if (userDoc.exists()) {
          setLog(userDoc.data().entries || []);
        }
      } catch (error) {
        console.error('Error loading study log:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStudyLog();
  }, [user]);

  const saveStudyLog = async (updatedLog: StudyLogEntry[]) => {
    if (!user?.id) return;
    
    try {
      await setDoc(doc(db, 'dailyStudyLog', user.id), {
        entries: updatedLog,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving study log:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!anki && !uworld) return;

    const newLog = [
      ...log.filter(entry => entry.date !== today),
      {
        date: today,
        anki: Number(anki) || 0,
        uworld: Number(uworld) || 0,
      }
    ];

    setLog(newLog);
    await saveStudyLog(newLog);
    setAnki('');
    setUworld('');
  };

  // Cálculo de streak e progresso
  const sortedLog = [...log].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;

  // Calcula o streak atual e máximo
  if (sortedLog.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let lastDate = new Date(sortedLog[sortedLog.length - 1].date);
    lastDate.setHours(0, 0, 0, 0);

    // Se o último registro não for de hoje ou ontem, streak = 0
    if (today.getTime() - lastDate.getTime() <= 86400000) {
      currentStreak = 1;
      
      for (let i = sortedLog.length - 2; i >= 0; i--) {
        const currentDate = new Date(sortedLog[i].date);
        currentDate.setHours(0, 0, 0, 0);
        const diff = (lastDate.getTime() - currentDate.getTime()) / 86400000;
        
        if (diff === 1) {
          currentStreak++;
          lastDate = currentDate;
        } else {
          break;
        }
      }
    }

    // Calcula o streak máximo
    lastDate = new Date(sortedLog[0].date);
    tempStreak = 1;

    for (let i = 1; i < sortedLog.length; i++) {
      const currentDate = new Date(sortedLog[i].date);
      const diff = (currentDate.getTime() - lastDate.getTime()) / 86400000;
      
      if (diff === 1) {
        tempStreak++;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
      
      lastDate = currentDate;
    }
  }

  // Cálculo dos contadores dinâmicos
  const { start: weekStart, end: weekEnd } = getWeekRange();
  const weekLog = log.filter(l => {
    const d = new Date(l.date);
    return d >= weekStart && d <= weekEnd;
  });
  const uworldWeek = weekLog.reduce((sum, l) => sum + (l.uworld || 0), 0);
  const ankiWeek = weekLog.reduce((sum, l) => sum + (l.anki || 0), 0);
  const uworldTotal = log.reduce((sum, l) => sum + (l.uworld || 0), 0);
  const ankiTotal = log.reduce((sum, l) => sum + (l.anki || 0), 0);

  const last7 = getLastNDays(7);
  const last30 = getLastNDays(30);
  const monthLog = log.filter(l => last30.includes(l.date));
  const unlockedBadges = BADGES.filter(b => maxStreak >= b.days);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-200 mb-6 tracking-tight drop-shadow-sm">Daily Study Log</h1>

      {/* Counters Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 border rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{uworldWeek}</span>
          <span className="text-sm text-gray-600 dark:text-gray-300 mt-1 text-center">UWorld this week</span>
        </div>
        <div className="bg-white dark:bg-gray-800 border rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-green-700 dark:text-green-300">{ankiWeek}</span>
          <span className="text-sm text-gray-600 dark:text-gray-300 mt-1 text-center">Anki this week</span>
        </div>
        <div className="bg-white dark:bg-gray-800 border rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{uworldTotal}</span>
          <span className="text-sm text-gray-600 dark:text-gray-300 mt-1 text-center">UWorld total</span>
        </div>
        <div className="bg-white dark:bg-gray-800 border rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-green-700 dark:text-green-300">{ankiTotal}</span>
          <span className="text-sm text-gray-600 dark:text-gray-300 mt-1 text-center">Anki total</span>
        </div>
      </div>

      <Card className="space-y-6">
        {/* Form de Registro */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={today}
              onChange={e => setToday(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                Anki (flashcards)
              </label>
              <input
                type="number"
                min={0}
                value={anki}
                onChange={e => setAnki(e.target.value)}
                placeholder="How many flashcards did you review today?"
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                UWorld (questions)
              </label>
              <input
                type="number"
                min={0}
                value={uworld}
                onChange={e => setUworld(e.target.value)}
                placeholder="How many questions did you complete today?"
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 text-white">
            Register
          </Button>
        </form>

        {/* Weekly Progress */}
        <div>
          <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            Weekly Progress
          </h2>
          <div className="flex gap-2 mb-2">
            {last7.map(date => {
              const entry = log.find(l => l.date === date);
              return (
                <div
                  key={date}
                  className={`w-8 h-8 flex flex-col items-center justify-center rounded-full border
                    ${entry
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600'
                    }`}
                >
                  {new Date(date).getDate()}
                </div>
              );
            })}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {weekLog.length}/7 days logged this week
          </div>
        </div>

        {/* Monthly Progress */}
        <div>
          <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            Monthly Progress
          </h2>
          <div className="flex flex-wrap gap-1 mb-2">
            {last30.map(date => {
              const entry = log.find(l => l.date === date);
              return (
                <div
                  key={date}
                  className={`w-6 h-6 flex items-center justify-center rounded-full border text-xs
                    ${entry
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600'
                    }`}
                >
                  {new Date(date).getDate()}
                </div>
              );
            })}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {monthLog.length}/30 days logged this month
          </div>
        </div>

        {/* Current Streak */}
        <div>
          <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            Current Streak
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {currentStreak} days
            </span>
          </div>
        </div>

        {/* Badges */}
        <div>
          <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            Badges Unlocked
          </h2>
          <div className="flex gap-3 flex-wrap">
            {unlockedBadges.length === 0 && (
              <span className="text-gray-400 dark:text-gray-500">
                No badges unlocked yet
              </span>
            )}
            {unlockedBadges.map(badge => (
              <div key={badge.days} className="flex flex-col items-center">
                <span className="text-3xl">{badge.emoji}</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DailyStudyLog; 