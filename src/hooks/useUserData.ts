import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAppContext } from '../contexts/AppContext';

interface UserData {
  anki?: number;
  usmle?: number;
  streak?: number;
  lastUpdated?: string;
}

export const useUserData = () => {
  const { user } = useAppContext();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'userData', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const updateUserData = async (newData: Partial<UserData>) => {
    if (!user?.uid) {
      alert('Você precisa estar logado para salvar seus dados.');
      return;
    }
    try {
      const updatedData = {
        ...userData,
        ...newData,
        lastUpdated: new Date().toISOString(),
      };
      await setDoc(doc(db, 'userData', user.uid), updatedData);
      setUserData(updatedData);
    } catch (error) {
      alert('Erro ao salvar dados do usuário.');
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  return { userData, loading, updateUserData };
}; 