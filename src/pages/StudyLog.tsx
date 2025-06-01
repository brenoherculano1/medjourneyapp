import React, { useEffect, useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Check, Search } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAppContext } from '../contexts/AppContext';
import { User } from '../types';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

type TopicStatus = 'To Review' | 'In Progress' | 'Mastered';

interface Topic {
  id: string;
  name: string;
  completed: boolean;
  status: TopicStatus;
}

interface System {
  id: string;
  name: string;
  topics: Topic[];
  isExpanded: boolean;
}

const SYSTEMS: System[] = [
  {
    id: 'cardiovascular',
    name: 'Cardiovascular',
    isExpanded: false,
    topics: [
      { id: 'cv1', name: 'Cardiac Physiology', completed: false, status: 'To Review' },
      { id: 'cv2', name: 'Heart Sounds', completed: false, status: 'To Review' },
      { id: 'cv3', name: 'Valvular Diseases', completed: false, status: 'To Review' },
      { id: 'cv4', name: 'Myocardial Infarction', completed: false, status: 'To Review' },
      { id: 'cv5', name: 'Anti-hypertensive Drugs', completed: false, status: 'To Review' },
      { id: 'cv6', name: 'Heart Failure Treatments', completed: false, status: 'To Review' },
    ],
  },
  {
    id: 'respiratory',
    name: 'Respiratory',
    isExpanded: false,
    topics: [
      { id: 'resp1', name: 'Lung Physiology', completed: false, status: 'To Review' },
      { id: 'resp2', name: 'Asthma & COPD', completed: false, status: 'To Review' },
      { id: 'resp3', name: 'Pneumonia', completed: false, status: 'To Review' },
      { id: 'resp4', name: 'Pulmonary Hypertension', completed: false, status: 'To Review' },
      { id: 'resp5', name: 'Lung Cancer', completed: false, status: 'To Review' },
    ],
  },
  {
    id: 'gastrointestinal',
    name: 'Gastrointestinal',
    isExpanded: false,
    topics: [
      { id: 'gi1', name: 'GI Physiology', completed: false, status: 'To Review' },
      { id: 'gi2', name: 'Liver Function', completed: false, status: 'To Review' },
      { id: 'gi3', name: 'Inflammatory Bowel Disease', completed: false, status: 'To Review' },
      { id: 'gi4', name: 'GI Bleeding', completed: false, status: 'To Review' },
      { id: 'gi5', name: 'Pancreatic Disorders', completed: false, status: 'To Review' },
    ],
  },
  {
    id: 'neurology',
    name: 'Neurology',
    isExpanded: false,
    topics: [
      { id: 'neuro1', name: 'Neuroanatomy', completed: false, status: 'To Review' },
      { id: 'neuro2', name: 'Stroke', completed: false, status: 'To Review' },
      { id: 'neuro3', name: 'Seizures', completed: false, status: 'To Review' },
      { id: 'neuro4', name: 'Multiple Sclerosis', completed: false, status: 'To Review' },
      { id: 'neuro5', name: 'Parkinson\'s Disease', completed: false, status: 'To Review' },
    ],
  },
  {
    id: 'musculoskeletal',
    name: 'Musculoskeletal',
    isExpanded: false,
    topics: [
      { id: 'msk1', name: 'Bone Physiology', completed: false, status: 'To Review' },
      { id: 'msk2', name: 'Osteoarthritis', completed: false, status: 'To Review' },
      { id: 'msk3', name: 'Rheumatoid Arthritis', completed: false, status: 'To Review' },
      { id: 'msk4', name: 'Osteoporosis', completed: false, status: 'To Review' },
      { id: 'msk5', name: 'Muscle Disorders', completed: false, status: 'To Review' },
    ],
  },
  {
    id: 'endocrine',
    name: 'Endocrine',
    isExpanded: false,
    topics: [
      { id: 'endo1', name: 'Diabetes Mellitus', completed: false, status: 'To Review' },
      { id: 'endo2', name: 'Thyroid Disorders', completed: false, status: 'To Review' },
      { id: 'endo3', name: 'Adrenal Disorders', completed: false, status: 'To Review' },
      { id: 'endo4', name: 'Pituitary Disorders', completed: false, status: 'To Review' },
      { id: 'endo5', name: 'Calcium Metabolism', completed: false, status: 'To Review' },
    ],
  },
  {
    id: 'reproductive',
    name: 'Reproductive',
    isExpanded: false,
    topics: [
      { id: 'repro1', name: 'Menstrual Cycle', completed: false, status: 'To Review' },
      { id: 'repro2', name: 'Pregnancy', completed: false, status: 'To Review' },
      { id: 'repro3', name: 'Contraception', completed: false, status: 'To Review' },
      { id: 'repro4', name: 'Infertility', completed: false, status: 'To Review' },
      { id: 'repro5', name: 'STIs', completed: false, status: 'To Review' },
    ],
  },
  {
    id: 'renal',
    name: 'Renal',
    isExpanded: false,
    topics: [
      { id: 'renal1', name: 'Kidney Physiology', completed: false, status: 'To Review' },
      { id: 'renal2', name: 'Acid-Base Disorders', completed: false, status: 'To Review' },
      { id: 'renal3', name: 'Glomerular Diseases', completed: false, status: 'To Review' },
      { id: 'renal4', name: 'Electrolyte Disorders', completed: false, status: 'To Review' },
      { id: 'renal5', name: 'Dialysis', completed: false, status: 'To Review' },
    ],
  },
  {
    id: 'hematology',
    name: 'Hematology/Oncology',
    isExpanded: false,
    topics: [
      { id: 'hem1', name: 'Anemia', completed: false, status: 'To Review' },
      { id: 'hem2', name: 'Leukemia', completed: false, status: 'To Review' },
      { id: 'hem3', name: 'Lymphoma', completed: false, status: 'To Review' },
      { id: 'hem4', name: 'Coagulation Disorders', completed: false, status: 'To Review' },
      { id: 'hem5', name: 'Transfusion Medicine', completed: false, status: 'To Review' },
    ],
  },
  {
    id: 'psychiatry',
    name: 'Psychiatry',
    isExpanded: false,
    topics: [
      { id: 'psych1', name: 'Mood Disorders', completed: false, status: 'To Review' },
      { id: 'psych2', name: 'Anxiety Disorders', completed: false, status: 'To Review' },
      { id: 'psych3', name: 'Psychotic Disorders', completed: false, status: 'To Review' },
      { id: 'psych4', name: 'Personality Disorders', completed: false, status: 'To Review' },
      { id: 'psych5', name: 'Substance Abuse', completed: false, status: 'To Review' },
    ],
  },
  {
    id: 'immunology',
    name: 'Immunology',
    isExpanded: false,
    topics: [
      { id: 'immuno1', name: 'Immune System Basics', completed: false, status: 'To Review' },
      { id: 'immuno2', name: 'Autoimmune Diseases', completed: false, status: 'To Review' },
      { id: 'immuno3', name: 'Immunodeficiency', completed: false, status: 'To Review' },
      { id: 'immuno4', name: 'Transplantation', completed: false, status: 'To Review' },
      { id: 'immuno5', name: 'Vaccination', completed: false, status: 'To Review' },
    ],
  },
  {
    id: 'microbiology',
    name: 'Microbiology',
    isExpanded: false,
    topics: [
      { id: 'micro1', name: 'Bacteria', completed: false, status: 'To Review' },
      { id: 'micro2', name: 'Viruses', completed: false, status: 'To Review' },
      { id: 'micro3', name: 'Fungi', completed: false, status: 'To Review' },
      { id: 'micro4', name: 'Parasites', completed: false, status: 'To Review' },
      { id: 'micro5', name: 'Antimicrobials', completed: false, status: 'To Review' },
    ],
  },
  {
    id: 'pathology',
    name: 'Pathology',
    isExpanded: false,
    topics: [
      { id: 'path1', name: 'Cell Injury', completed: false, status: 'To Review' },
      { id: 'path2', name: 'Inflammation', completed: false, status: 'To Review' },
      { id: 'path3', name: 'Neoplasia', completed: false, status: 'To Review' },
      { id: 'path4', name: 'Genetic Disorders', completed: false, status: 'To Review' },
      { id: 'path5', name: 'Environmental Pathology', completed: false, status: 'To Review' },
    ],
  },
  {
    id: 'pharmacology',
    name: 'Pharmacology',
    isExpanded: false,
    topics: [
      { id: 'pharm1', name: 'Pharmacokinetics', completed: false, status: 'To Review' },
      { id: 'pharm2', name: 'Pharmacodynamics', completed: false, status: 'To Review' },
      { id: 'pharm3', name: 'Autonomic Drugs', completed: false, status: 'To Review' },
      { id: 'pharm4', name: 'Cardiovascular Drugs', completed: false, status: 'To Review' },
      { id: 'pharm5', name: 'CNS Drugs', completed: false, status: 'To Review' },
    ],
  },
  {
    id: 'biochemistry',
    name: 'Biochemistry',
    isExpanded: false,
    topics: [
      { id: 'biochem1', name: 'Metabolism', completed: false, status: 'To Review' },
      { id: 'biochem2', name: 'Enzymes', completed: false, status: 'To Review' },
      { id: 'biochem3', name: 'Vitamins', completed: false, status: 'To Review' },
      { id: 'biochem4', name: 'Minerals', completed: false, status: 'To Review' },
      { id: 'biochem5', name: 'Molecular Biology', completed: false, status: 'To Review' },
    ],
  },
  {
    id: 'behavioral',
    name: 'Behavioral Science',
    isExpanded: false,
    topics: [
      { id: 'behav1', name: 'Learning Theory', completed: false, status: 'To Review' },
      { id: 'behav2', name: 'Social Psychology', completed: false, status: 'To Review' },
      { id: 'behav3', name: 'Ethics', completed: false, status: 'To Review' },
      { id: 'behav4', name: 'Statistics', completed: false, status: 'To Review' },
      { id: 'behav5', name: 'Epidemiology', completed: false, status: 'To Review' },
    ],
  },
];

const StudyLog: React.FC = () => {
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();
  const [systems, setSystems] = useState<System[]>(SYSTEMS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Cálculo dos totais globais
  const allTopics = systems.flatMap(system => system.topics);
  const totalTopics = allTopics.length;
  const completedTopics = allTopics.filter(t => t.completed).length;
  const inProgressTopics = allTopics.filter(t => t.status === 'In Progress').length;
  const masteredTopics = allTopics.filter(t => t.status === 'Mastered').length;
  const globalProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  useEffect(() => {
    const loadUserProgress = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, 'studyProgress', user.uid));
        if (userDoc.exists()) {
          setSystems(userDoc.data().systems);
        }
      } catch (error) {
        setSystems(SYSTEMS);
      } finally {
        setLoading(false);
      }
    };
    loadUserProgress();
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          subscription: null,
          subscriptionExpiry: null,
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const saveProgress = async (updatedSystems: System[]) => {
    if (!user?.uid) {
      alert('Você precisa estar logado para salvar seu progresso.');
      navigate('/login');
      return;
    }
    try {
      await setDoc(doc(db, 'studyProgress', user.uid), {
        systems: updatedSystems,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      alert('Erro ao salvar progresso.');
    }
  };

  const toggleSystem = (systemId: string) => {
    const updatedSystems = systems.map(system =>
      system.id === systemId
        ? { ...system, isExpanded: !system.isExpanded }
        : system
    );
    setSystems(updatedSystems);
    saveProgress(updatedSystems);
  };

  const toggleTopic = (systemId: string, topicId: string) => {
    const updatedSystems = systems.map(system =>
      system.id === systemId
        ? {
            ...system,
            topics: system.topics.map(topic =>
              topic.id === topicId
                ? { ...topic, completed: !topic.completed }
                : topic
            ),
          }
        : system
    );
    setSystems(updatedSystems);
    saveProgress(updatedSystems);
  };

  const updateTopicStatus = (systemId: string, topicId: string, status: TopicStatus) => {
    const updatedSystems = systems.map(system =>
      system.id === systemId
        ? {
            ...system,
            topics: system.topics.map(topic =>
              topic.id === topicId
                ? { ...topic, status }
                : topic
            ),
          }
        : system
    );
    setSystems(updatedSystems);
    saveProgress(updatedSystems);
  };

  const calculateSystemProgress = (system: System) => {
    const completed = system.topics.filter(topic => topic.completed).length;
    return Math.round((completed / system.topics.length) * 100);
  };

  const filteredSystems = useMemo(() => {
    if (!searchQuery) return systems;
    const query = searchQuery.toLowerCase();
    return systems.map(system => ({
      ...system,
      topics: system.topics.filter(topic =>
        topic.name.toLowerCase().includes(query)
      ),
    })).filter(system => system.topics.length > 0);
  }, [systems, searchQuery]);

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Carregando...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-200 mb-6 tracking-tight drop-shadow-sm">USMLE System Tracker</h1>
      {/* Cards de contagem */}
      <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-4">
        <div className="bg-blue-900 text-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold">{totalTopics}</span>
          <span className="text-sm mt-1 text-center">Total Topics</span>
        </div>
        <div className="bg-green-800 text-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold">{completedTopics}</span>
          <span className="text-sm mt-1 text-center">Completed</span>
        </div>
        <div className="bg-yellow-900 text-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold">{inProgressTopics}</span>
          <span className="text-sm mt-1 text-center">In Progress</span>
        </div>
        <div className="bg-purple-900 text-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold">{masteredTopics}</span>
          <span className="text-sm mt-1 text-center">Mastered</span>
        </div>
      </div>
      {/* Barra de progresso global */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Progress</span>
          <span className="text-sm font-medium text-blue-700 dark:text-blue-200">{globalProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-800 to-purple-700 h-3 rounded-full transition-all duration-300"
            style={{ width: `${globalProgress}%` }}
          />
        </div>
      </div>
      {/* Busca */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search topics or systems..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 pl-10 border rounded-lg bg-gray-900 text-white placeholder-gray-400"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
      {/* Lista de sistemas */}
      <div className="space-y-4">
        {filteredSystems.map((system) => (
          <div key={system.id} className="bg-gray-900 rounded-lg shadow">
            <button
              onClick={() => toggleSystem(system.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-800 rounded-t-lg"
            >
              <div className="flex items-center">
                <span className="font-semibold text-white">{system.name}</span>
                <span className="ml-2 text-sm text-gray-400">
                  {system.topics.filter(t => t.completed).length} of {system.topics.length} topics completed - {calculateSystemProgress(system)}%
                </span>
              </div>
              {system.isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>
            {system.isExpanded && (
              <div className="p-4 border-t border-gray-800 bg-gray-800 rounded-b-lg">
                <div className="space-y-2">
                  {system.topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-700 rounded"
                    >
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleTopic(system.id, topic.id)}
                          className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${
                            topic.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-500'
                          }`}
                        >
                          {topic.completed && <Check className="h-4 w-4 text-white" />}
                        </button>
                        <span className="text-white">{topic.name}</span>
                      </div>
                      <select
                        value={topic.status}
                        onChange={(e) =>
                          updateTopicStatus(system.id, topic.id, e.target.value as TopicStatus)
                        }
                        className="text-sm border rounded px-2 py-1 bg-gray-900 text-white border-gray-600"
                      >
                        <option value="To Review">To Review</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Mastered">Mastered</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyLog;
