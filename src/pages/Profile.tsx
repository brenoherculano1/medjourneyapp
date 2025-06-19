// src/pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [graduationYear, setGraduationYear] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

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
          setFullName(user.name || '');
          setEmail(user.email || '');
        }
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user?.uid) {
      alert(t('profile_login_required'));
      navigate('/login');
      return;
    }
    try {
      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        university,
        graduationYear,
        email,
      });
      alert(t('profile_save_success'));
    } catch (error) {
      alert(t('profile_save_error'));
      console.error(t('profile_save_error_log'), error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">{t('profile_personal_info')}</h2>
      <div className="space-y-4 max-w-xl">
        <input
          type="text"
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder={t('profile_full_name')}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="email"
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder={t('profile_email')}
          value={email}
          disabled
        />
        <input
          type="text"
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder={t('profile_university')}
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
        />
        <input
          type="text"
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder={t('profile_graduation_year')}
          value={graduationYear}
          onChange={(e) => setGraduationYear(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          onClick={handleSave}
        >
          {t('profile_save_changes')}
        </button>
      </div>
    </div>
  );
};

export default Profile;
