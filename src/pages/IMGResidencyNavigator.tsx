import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';

interface StateEntry {
  name: string;
  img_friendly_score: number;
  institutions: string[];
}

interface SpecialtyEntry {
  specialty: string;
  states: StateEntry[];
}

const imgResidencyData: SpecialtyEntry[] = [
  {
    specialty: "Allergy and Immunology",
    states: [
      {
        name: "New York",
        img_friendly_score: 9.5,
        institutions: [
          "Brooklyn Hospital Center",
          "Mount Sinai Elmhurst"
        ]
      },
      {
        name: "Florida",
        img_friendly_score: 8.8,
        institutions: []
      },
      {
        name: "Pennsylvania",
        img_friendly_score: 8.7,
        institutions: []
      },
      {
        name: "Michigan",
        img_friendly_score: 8.5,
        institutions: []
      },
      {
        name: "New Jersey",
        img_friendly_score: 8.3,
        institutions: []
      }
    ]
  },
  {
    specialty: "Internal Medicine",
    states: [
      { name: "New York", img_friendly_score: 9.5, institutions: [] },
      { name: "Florida", img_friendly_score: 8.8, institutions: [] },
      { name: "Pennsylvania", img_friendly_score: 8.7, institutions: [] },
      { name: "Michigan", img_friendly_score: 8.5, institutions: [] },
      { name: "New Jersey", img_friendly_score: 8.3, institutions: [] }
    ]
  },
  {
    specialty: "Family Medicine",
    states: [
      { name: "Texas", img_friendly_score: 9.0, institutions: [] },
      { name: "Michigan", img_friendly_score: 8.5, institutions: [
        "McLaren Flint"
      ] },
      { name: "Illinois", img_friendly_score: 8.2, institutions: [
        "Advocate Illinois Masonic"
      ] },
      { name: "New York", img_friendly_score: 8.0, institutions: [] },
      { name: "Florida", img_friendly_score: 7.8, institutions: [] }
    ]
  },
  {
    specialty: "Psychiatry",
    states: [
      { name: "New York", img_friendly_score: 9.4, institutions: [
        "Interfaith Medical Center"
      ] },
      { name: "Michigan", img_friendly_score: 8.9, institutions: [] },
      { name: "Texas", img_friendly_score: 8.3, institutions: [] },
      { name: "Florida", img_friendly_score: 8.0, institutions: [] },
      { name: "California", img_friendly_score: 7.8, institutions: [] }
    ]
  },
  {
    specialty: "Pediatrics",
    states: [
      { name: "New Jersey", img_friendly_score: 8.7, institutions: [
        "Jersey Shore University Medical Center"
      ] },
      { name: "Florida", img_friendly_score: 8.2, institutions: [] },
      { name: "California", img_friendly_score: 7.8, institutions: [] },
      { name: "New York", img_friendly_score: 7.5, institutions: [] },
      { name: "Texas", img_friendly_score: 7.3, institutions: [] }
    ]
  },
  {
    specialty: "Obstetrics & Gynecology",
    states: [
      { name: "Michigan", img_friendly_score: 7.2, institutions: [] },
      { name: "Illinois", img_friendly_score: 6.9, institutions: [
        "Presence Saint Joseph Hospital"
      ] },
      { name: "New York", img_friendly_score: 6.5, institutions: [] },
      { name: "Florida", img_friendly_score: 6.2, institutions: [] },
      { name: "Texas", img_friendly_score: 6.0, institutions: [] }
    ]
  },
  {
    specialty: "General Surgery",
    states: [
      { name: "New York", img_friendly_score: 6.5, institutions: [
        "Brooklyn Hospital Center"
      ] },
      { name: "Florida", img_friendly_score: 6.2, institutions: [] },
      { name: "Texas", img_friendly_score: 6.0, institutions: [] },
      { name: "California", img_friendly_score: 5.8, institutions: [] },
      { name: "Illinois", img_friendly_score: 5.5, institutions: [] }
    ]
  },
  {
    specialty: "Neurology",
    states: [
      { name: "Texas", img_friendly_score: 8.1, institutions: [
        "Texas Tech University"
      ] },
      { name: "New York", img_friendly_score: 8.0, institutions: [] },
      { name: "Florida", img_friendly_score: 7.8, institutions: [] },
      { name: "California", img_friendly_score: 7.5, institutions: [] },
      { name: "Illinois", img_friendly_score: 7.3, institutions: [] }
    ]
  },
  {
    specialty: "Pathology",
    states: [
      { name: "Connecticut", img_friendly_score: 8.5, institutions: [
        "Danbury Hospital Program"
      ] },
      { name: "New York", img_friendly_score: 8.0, institutions: [] },
      { name: "Florida", img_friendly_score: 7.8, institutions: [] },
      { name: "Texas", img_friendly_score: 7.5, institutions: [] },
      { name: "California", img_friendly_score: 7.3, institutions: [] }
    ]
  },
  {
    specialty: "Anesthesiology",
    states: [
      {
        name: "New York",
        img_friendly_score: 9.0,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Michigan",
        img_friendly_score: 8.6,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      }
    ]
  },
  {
    specialty: "Dermatology",
    states: [
      {
        name: "California",
        img_friendly_score: 8.9,
        institutions: [
          "UCLA Medical Center",
          "Stanford Health Care",
          "UC San Diego Health",
          "Cedars-Sinai Medical Center",
          "UC Davis Medical Center"
        ]
      },
      {
        name: "Florida",
        img_friendly_score: 8.7,
        institutions: [
          "University of Miami/Jackson Memorial Hospital",
          "Mayo Clinic Florida",
          "Cleveland Clinic Florida",
          "UF Health Shands Hospital",
          "Tampa General Hospital"
        ]
      }
    ]
  },
  {
    specialty: "Emergency Medicine",
    states: [
      {
        name: "New York",
        img_friendly_score: 9.1,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Michigan",
        img_friendly_score: 8.8,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Pennsylvania",
        img_friendly_score: 8.7,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "New Jersey",
        img_friendly_score: 8.6,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Florida",
        img_friendly_score: 8.5,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      }
    ]
  },
  {
    specialty: "Neurosurgery",
    states: [
      {
        name: "New York",
        img_friendly_score: 9.2,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Michigan",
        img_friendly_score: 8.9,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Pennsylvania",
        img_friendly_score: 8.8,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "New Jersey",
        img_friendly_score: 8.6,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Florida",
        img_friendly_score: 8.5,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      }
    ]
  },
  {
    specialty: "Ophthalmology",
    states: [
      {
        name: "New York",
        img_friendly_score: 9.0,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Michigan",
        img_friendly_score: 8.8,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Pennsylvania",
        img_friendly_score: 8.7,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "New Jersey",
        img_friendly_score: 8.6,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Florida",
        img_friendly_score: 8.5,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      }
    ]
  },
  {
    specialty: "Orthopedics",
    states: [
      {
        name: "New York",
        img_friendly_score: 9.0,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Michigan",
        img_friendly_score: 8.8,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Pennsylvania",
        img_friendly_score: 8.7,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "New Jersey",
        img_friendly_score: 8.6,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Florida",
        img_friendly_score: 8.5,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      }
    ]
  },
  {
    specialty: "Otolaryngology - Head and Neck Surgery",
    states: [
      {
        name: "New York",
        img_friendly_score: 9.0,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Michigan",
        img_friendly_score: 8.8,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Pennsylvania",
        img_friendly_score: 8.7,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "New Jersey",
        img_friendly_score: 8.6,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Florida",
        img_friendly_score: 8.5,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      }
    ]
  },
  {
    specialty: "Plastic Surgery",
    states: [
      {
        name: "New York",
        img_friendly_score: 9.0,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Michigan",
        img_friendly_score: 8.8,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Pennsylvania",
        img_friendly_score: 8.7,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "New Jersey",
        img_friendly_score: 8.6,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Florida",
        img_friendly_score: 8.5,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      }
    ]
  },
  {
    specialty: "Preventive Medicine",
    states: [
      {
        name: "New York",
        img_friendly_score: 9.0,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Michigan",
        img_friendly_score: 8.8,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Pennsylvania",
        img_friendly_score: 8.7,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "New Jersey",
        img_friendly_score: 8.6,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Florida",
        img_friendly_score: 8.5,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      }
    ]
  },
  {
    specialty: "Radiology",
    states: [
      {
        name: "New York",
        img_friendly_score: 9.0,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Michigan",
        img_friendly_score: 8.8,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Pennsylvania",
        img_friendly_score: 8.7,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "New Jersey",
        img_friendly_score: 8.6,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Florida",
        img_friendly_score: 8.5,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      }
    ]
  },
  {
    specialty: "Urology",
    states: [
      {
        name: "New York",
        img_friendly_score: 9.0,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Michigan",
        img_friendly_score: 8.8,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Pennsylvania",
        img_friendly_score: 8.7,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "New Jersey",
        img_friendly_score: 8.6,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      },
      {
        name: "Florida",
        img_friendly_score: 8.5,
        institutions: [
          "Brooklyn Hospital Center",
          "Lincoln Medical and Mental Health Center",
          "Mount Sinai Hospital",
          "Cleveland Clinic Florida",
          "Detroit Medical Center"
        ]
      }
    ]
  }
];

const SPECIALTIES = imgResidencyData.map(d => d.specialty);
const ALL_STATES = Array.from(new Set(imgResidencyData.flatMap(d => d.states.map(s => s.name))));

const IMGResidencyNavigator: React.FC = () => {
  const { user } = useAppContext();
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [stateFilter, setStateFilter] = useState('All');

  const selectedData = useMemo(() => imgResidencyData.find(d => d.specialty === specialty), [specialty]);

  const filteredStates = useMemo(() => {
    if (!selectedData) return [];
    if (stateFilter === 'All') return selectedData.states;
    return selectedData.states.filter(s => s.name === stateFilter);
  }, [selectedData, stateFilter]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-extrabold text-blue-700 dark:text-blue-200 mb-6 tracking-tight">IMG Residency Navigator</h1>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-lg font-bold text-blue-800 dark:text-blue-300 mb-2 drop-shadow-sm tracking-wide">Specialty</label>
          <select
            value={specialty}
            onChange={e => setSpecialty(e.target.value)}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {imgResidencyData.map((item, index) => (
              <option key={index} value={item.specialty}>
                {item.specialty}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-lg font-bold text-blue-800 dark:text-blue-300 mb-2 drop-shadow-sm tracking-wide">State</label>
          <select
            value={stateFilter}
            onChange={e => setStateFilter(e.target.value)}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="All">All</option>
            {ALL_STATES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-8">
        {filteredStates.length === 0 && (
          <div className="text-gray-500 dark:text-gray-400">No states or institutions found for this filter.</div>
        )}
        {filteredStates.map(stateObj => (
          <div key={stateObj.name} className="bg-white dark:bg-gray-800 border rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-blue-700 dark:text-blue-200">{stateObj.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">IMG-friendliness score: <span className="font-bold">{stateObj.img_friendly_score}</span></span>
            </div>
            <ul className="list-disc pl-6">
              {stateObj.institutions.map(inst => (
                <li key={inst} className="text-gray-900 dark:text-white py-1">{inst}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IMGResidencyNavigator; 