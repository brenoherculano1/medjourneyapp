import { useState, useEffect, useMemo } from "react";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface SpecialtyRecommendation {
  specialty: string;
  minScore: number;
}

const recommendations: SpecialtyRecommendation[] = [
  { specialty: "Internal Medicine", minScore: 210 },
  { specialty: "Family Medicine", minScore: 200 },
  { specialty: "Pediatrics", minScore: 205 },
  { specialty: "Psychiatry", minScore: 210 },
  { specialty: "Pathology", minScore: 215 },
  { specialty: "Neurology", minScore: 215 },
  { specialty: "Obstetrics & Gynecology", minScore: 220 },
  { specialty: "General Surgery", minScore: 225 },
  { specialty: "Emergency Medicine", minScore: 230 },
  { specialty: "Radiology", minScore: 235 },
  { specialty: "Dermatology", minScore: 245 },
  { specialty: "Orthopedics", minScore: 245 },
  { specialty: "Plastic Surgery", minScore: 250 },
  { specialty: "Neurosurgery", minScore: 250 },
];

interface NBMEEntry {
  score: number;
  date: string;
}

const STORAGE_KEY = 'nbme-scores';

export default function NBMESimulator() {
  const { t, i18n } = useTranslation();
  const [score, setScore] = useState<number | null>(null);
  const [date, setDate] = useState<string>("");
  const [result, setResult] = useState<string[]>([]);
  const [tips, setTips] = useState<typeof studyTips[0] | null>(null);
  const [nbmeList, setNbmeList] = useState<NBMEEntry[]>([]);

  const studyTips = useMemo(() => [
    {
      range: [0, 199],
      color: 'red-500',
      emoji: '🔴',
      title: t('nbme_tip_title_0'),
      tips: [
        t('nbme_tip_0_0'),
        t('nbme_tip_0_1'),
        t('nbme_tip_0_2'),
        t('nbme_tip_0_3'),
        t('nbme_tip_0_4'),
      ]
    },
    {
      range: [200, 219],
      color: 'orange-500',
      emoji: '🟠',
      title: t('nbme_tip_title_1'),
      tips: [
        t('nbme_tip_1_0'),
        t('nbme_tip_1_1'),
        t('nbme_tip_1_2'),
        t('nbme_tip_1_3'),
        t('nbme_tip_1_4'),
      ]
    },
    {
      range: [220, 239],
      color: 'yellow-500',
      emoji: '🟡',
      title: t('nbme_tip_title_2'),
      tips: [
        t('nbme_tip_2_0'),
        t('nbme_tip_2_1'),
        t('nbme_tip_2_2'),
        t('nbme_tip_2_3'),
        t('nbme_tip_2_4'),
      ]
    },
    {
      range: [240, 259],
      color: 'green-500',
      emoji: '🟢',
      title: t('nbme_tip_title_3'),
      tips: [
        t('nbme_tip_3_0'),
        t('nbme_tip_3_1'),
        t('nbme_tip_3_2'),
        t('nbme_tip_3_3'),
        t('nbme_tip_3_4'),
      ]
    },
    {
      range: [260, 300],
      color: 'emerald-600',
      emoji: '🟩',
      title: t('nbme_tip_title_4'),
      tips: [
        t('nbme_tip_4_0'),
        t('nbme_tip_4_1'),
        t('nbme_tip_4_2'),
        t('nbme_tip_4_3'),
        t('nbme_tip_4_4'),
      ]
    }
  ], [i18n.language, t]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setNbmeList(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = () => {
    if (score === null || score < 120 || score > 300) {
      alert(t('nbme_alert_invalid_score'));
      return;
    }
    const matched = recommendations
      .filter((rec) => score >= rec.minScore)
      .map((rec) => rec.specialty);
    setResult(matched);
    const foundTips = studyTips.find(tip => score >= tip.range[0] && score <= tip.range[1]);
    setTips(foundTips || null);
  };

  const handleSave = () => {
    if (score === null || !date) {
      alert(t('nbme_alert_fill_score_date'));
      return;
    }
    const newList = [...nbmeList, { score, date }];
    setNbmeList(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    alert(t('nbme_alert_score_saved'));
  };

  // Dados para o gráfico
  const chartData = {
    labels: nbmeList.map((entry) => entry.date),
    datasets: [
      {
        label: t('nbme_chart_label'),
        data: nbmeList.map((entry) => entry.score),
        fill: false,
        borderColor: '#2563eb',
        backgroundColor: '#2563eb',
        tension: 0.2,
        pointRadius: 6,
        pointBackgroundColor: '#2563eb',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: t('nbme_chart_title'), font: { size: 18 } },
    },
    scales: {
      y: {
        min: 120,
        max: 300,
        ticks: { stepSize: 10 },
        title: { display: true, text: t('nbme_chart_y') },
      },
      x: {
        title: { display: true, text: t('nbme_chart_x') },
      },
    },
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">📊 {t('nbme_title')}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm">{t('nbme_subtitle')}</p>

        <input
          type="number"
          value={score ?? ""}
          onChange={(e) => setScore(Number(e.target.value))}
          placeholder={t('nbme_input_placeholder')}
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2 transition"
          min={120}
          max={300}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 transition"
        />
        <div className="flex gap-2 mb-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition w-full"
            onClick={handleSubmit}
          >
            {t('nbme_analyze_btn')}
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded transition w-full"
            onClick={handleSave}
          >
            {t('nbme_save_btn')}
          </button>
        </div>

        {result.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">{t('nbme_result_title')}</h3>
            <div className="space-y-2">
              {result.map((specialty, index) => (
                <div key={index} className="flex items-center text-blue-700 dark:text-blue-300">
                  <span className="mr-2">✅</span>
                  <span>{t(`nbme_${specialty.toLowerCase().replace(/\s+/g, '_')}`)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tips && (
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">{tips.title}</h3>
            <ul className="space-y-2">
              {tips.tips.map((tip, index) => (
                <li key={index} className="text-sm text-yellow-700 dark:text-yellow-300 flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('nbme_important')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{t('nbme_important_desc')}</p>
        </div>

        {nbmeList.length >= 2 && (
          <div className="mb-8">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  );
} 