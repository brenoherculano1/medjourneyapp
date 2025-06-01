import React, { useState, useEffect } from 'react';
import { useUserData } from '../../hooks/useUserData';

const StudyLogTracker = () => {
  const { userData, updateUserData } = useUserData();
  const [ankiCount, setAnkiCount] = useState(0);
  const [usmleCount, setUsmleCount] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (userData) {
      setAnkiCount(userData.anki || 0);
      setUsmleCount(userData.usmle || 0);
      setStreak(userData.streak || 0);
    }
  }, [userData]);

  const handleSave = () => {
    if (!userData) {
      alert('Você precisa estar logado para salvar seu progresso.');
      return;
    }
    updateUserData({
      anki: ankiCount,
      usmle: usmleCount,
      streak: streak
    });
  };

  return (
    <div className="p-4 bg-white rounded shadow-md space-y-4">
      <div>
        <label className="block mb-1">Anki Cards This Week</label>
        <input
          type="number"
          value={ankiCount}
          onChange={(e) => setAnkiCount(Number(e.target.value))}
          className="border rounded px-3 py-2 w-full"
        />
      </div>
      <div>
        <label className="block mb-1">USMLE Questions This Week</label>
        <input
          type="number"
          value={usmleCount}
          onChange={(e) => setUsmleCount(Number(e.target.value))}
          className="border rounded px-3 py-2 w-full"
        />
      </div>
      <div>
        <label className="block mb-1">Current Streak</label>
        <input
          type="number"
          value={streak}
          onChange={(e) => setStreak(Number(e.target.value))}
          className="border rounded px-3 py-2 w-full"
        />
      </div>
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Progress
      </button>
    </div>
  );
};

export default StudyLogTracker; 