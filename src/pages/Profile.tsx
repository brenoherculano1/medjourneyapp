// src/pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Profile = () => {
  const { user } = useAppContext();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [graduationYear, setGraduationYear] = useState('');

  useEffect(() => {
    if (user?.uid) {
      const userRef = doc(db, 'users', user.uid);
      getDoc(userRef).then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFullName(data.fullName || '');
          setUniversity(data.university || '');
          setGraduationYear(data.graduationYear || '');
        } else {
          setFullName(user.displayName || '');
          setEmail(user.email || '');
        }
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user?.uid) return alert("Usuário não autenticado.");

    try {
      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        university,
        graduationYear,
        email,
      });
      alert("Dados salvos com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Erro ao salvar os dados.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Informações Pessoais</h2>
      <div className="space-y-4 max-w-xl">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Nome Completo"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="email"
          className="w-full p-2 border rounded"
          placeholder="Email"
          value={email}
          disabled
        />
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Universidade"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
        />
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Ano de Graduação"
          value={graduationYear}
          onChange={(e) => setGraduationYear(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default Profile;
