import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAppContext } from "../contexts/AppContext";
import { useEffect, useState } from "react";
import { User } from "../types";

interface UserData {
  streak: number;
  anki: number;
  usmle: number;
}

export const useUserDataPersistence = () => {
  const { user } = useAppContext();
  const [userData, setUserData] = useState<UserData | null>(null);

  // Carrega os dados do Firestore assim que o usuário loga
  useEffect(() => {
    if (user?.id) {
      const loadUserData = async () => {
        const ref = doc(db, "users", user.id);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          setUserData(snapshot.data() as UserData);
        }
      };
      loadUserData();
    }
  }, [user]);

  // Salva automaticamente no Firestore sempre que userData for alterado
  useEffect(() => {
    if (user?.id && userData) {
      const saveUserData = async () => {
        const ref = doc(db, "users", user.id);
        await setDoc(ref, userData, { merge: true });
      };
      saveUserData();
    }
  }, [userData]);

  return { userData, setUserData };
}; 