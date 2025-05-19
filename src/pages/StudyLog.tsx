import React, { useEffect, useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Check, Search } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAppContext } from '../contexts/AppContext';
import { User } from '../types';

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
  const { user } = useAppContext();
  const [systems, setSystems] = useState<System[]>(SYSTEMS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadUserProgress = async () => {
      if (!user?.id) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'studyProgress', user.id));
        if (userDoc.exists()) {
          setSystems(userDoc.data().systems);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProgress();
  }, [user]);

  const saveProgress = async (updatedSystems: System[]) => {
    if (!user?.id) return;
    
    try {
      await setDoc(doc(db, 'studyProgress', user.id), {
        systems: updatedSystems,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
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
    const total = system.topics.length;
    const percentage = Math.round((completed / total) * 100);
    return { completed, total, percentage };
  };

  const filteredSystems = useMemo(() => {
    if (!searchQuery) return systems;

    const query = searchQuery.toLowerCase();
    return systems.map(system => ({
      ...system,
      topics: system.topics.filter(topic => 
        topic.name.toLowerCase().includes(query) ||
        system.name.toLowerCase().includes(query)
      )
    })).filter(system => system.topics.length > 0);
  }, [systems, searchQuery]);

  const stats = useMemo(() => {
    const allTopics = systems.flatMap(system => system.topics);
    const total = allTopics.length;
    const completed = allTopics.filter(topic => topic.completed).length;
    const inProgress = allTopics.filter(topic => topic.status === 'In Progress').length;
    const mastered = allTopics.filter(topic => topic.status === 'Mastered').length;
    const toReview = allTopics.filter(topic => topic.status === 'To Review').length;

    return {
      total,
      completed,
      inProgress,
      mastered,
      toReview,
      percentage: Math.round((completed / total) * 100)
    };
  }, [systems]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">USMLE System Tracker</h1>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
              <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics or systems..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Topics</div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</div>
            </div>
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
            <div className="text-sm font-medium text-green-800 dark:text-green-200">Completed</div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.completed}</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg">
            <div className="text-sm font-medium text-orange-800 dark:text-orange-200">In Progress</div>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.inProgress}</div>
                </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
            <div className="text-sm font-medium text-purple-800 dark:text-purple-200">Mastered</div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.mastered}</div>
          </div>
        </div>
        
        {/* Global Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Progress</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stats.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${stats.percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Systems List */}
        <div className="space-y-4">
          {filteredSystems.map(system => {
            const { completed, total, percentage } = calculateSystemProgress(system);
            
            return (
              <div
                key={system.id}
                className="border dark:border-gray-700 rounded-lg overflow-hidden"
              >
                {/* System Header */}
                <button
                  onClick={() => toggleSystem(system.id)}
                  className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  aria-expanded={system.isExpanded}
                  aria-controls={`${system.id}-topics`}
                >
                  <div className="flex items-center space-x-3">
                    {system.isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    <span className="font-medium text-gray-900 dark:text-white">{system.name}</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {completed} of {total} topics completed - {percentage}%
                  </span>
                </button>

                {/* Topics List */}
                {system.isExpanded && (
                  <div 
                    id={`${system.id}-topics`}
                    className="p-4 space-y-3 bg-white dark:bg-gray-800"
                    role="region"
                    aria-label={`${system.name} topics`}
                  >
                    {system.topics.map(topic => (
                      <div
                        key={topic.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleTopic(system.id, topic.id)}
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
                              ${topic.completed
                                ? 'bg-blue-600 border-blue-600'
                                : 'border-gray-300 dark:border-gray-600'
                              }`}
                            aria-label={`Mark ${topic.name} as ${topic.completed ? 'incomplete' : 'complete'}`}
                          >
                            {topic.completed && <Check size={14} className="text-white" />}
                          </button>
                          <span className="text-gray-900 dark:text-white">{topic.name}</span>
                        </div>
                        
                        <select
                          value={topic.status}
                          onChange={(e) => updateTopicStatus(system.id, topic.id, e.target.value as TopicStatus)}
                          className={`px-2 py-1 rounded text-sm font-medium
                            ${topic.status === 'To Review'
                              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                              : topic.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            }`}
                          aria-label={`Change status for ${topic.name}`}
                        >
                          <option value="To Review">To Review</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Mastered">Mastered</option>
                        </select>
              </div>
            ))}
          </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudyLog;
