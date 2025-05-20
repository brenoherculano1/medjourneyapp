import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export function useUserData() {
  const [userData, setUserData] = useState<any>(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const ref = doc(db, 'userData', user.uid);
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        setUserData(snapshot.data());
      } else {
        await setDoc(ref, { streak: 0, anki: 0, usmle: 0 });
        setUserData({ streak: 0, anki: 0, usmle: 0 });
      }
    };

    fetchData();
  }, [user]);

  const updateUserData = async (data: Partial<any>) => {
    if (!user) return;
    const ref = doc(db, 'userData', user.uid);
    await setDoc(ref, { ...userData, ...data }, { merge: true });
    setUserData((prev: any) => ({ ...prev, ...data }));
  };

  return { userData, updateUserData };
} 