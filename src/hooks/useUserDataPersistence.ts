import { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface StreakData {
  streak: number;
  anki: number;
  usmle: number;
  lastUpdated?: string;
}

export function useUserDataPersistence() {
  const { user, streakData, setStreakData } = useAppContext();

  useEffect(() => {
    if (!user?.uid) return;

    const ref = doc(db, 'users', user.uid);

    const fetchUserData = async () => {
      try {
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.streakData) {
            setStreakData(data.streakData as StreakData);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUserData();
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid || !streakData) return;

    const ref = doc(db, 'users', user.uid);

    const saveData = async () => {
      try {
        await setDoc(ref, { 
          streakData: {
            ...streakData,
            lastUpdated: new Date().toISOString()
          }
        }, { merge: true });
      } catch (error) {
        console.error('Erro ao salvar dados do usuário:', error);
      }
    };

    saveData();
  }, [user?.uid, streakData]);
} 