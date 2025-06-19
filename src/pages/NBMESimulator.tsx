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
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-800 mb-2 flex items-center gap-2">📊 {t('nbme_title')}</h2>
        <p className="text-gray-700 mb-6 text-sm">{t('nbme_subtitle')}</p>

        <input
          type="number"
          value={score ?? ""}
          onChange={(e) => setScore(Number(e.target.value))}
          placeholder={t('nbme_input_placeholder')}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2 transition"
          min={120}
          max={300}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 transition"
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
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('nbme_result_title')}</h3>
            <ul className="list-disc pl-5 text-gray-700">
              {result.map((spec, idx) => (
                <li key={idx}>{spec}</li>
              ))}
            </ul>
          </div>
        )}

        {tips && (
          <div className={`p-4 rounded-lg border-l-4 mb-4 ${tips.color === 'red-500' ? 'border-red-500 bg-red-50' : tips.color === 'orange-500' ? 'border-orange-500 bg-orange-50' : tips.color === 'yellow-500' ? 'border-yellow-500 bg-yellow-50' : tips.color === 'green-500' ? 'border-green-500 bg-green-50' : 'border-emerald-600 bg-emerald-50'}`}>
            <div className="font-bold mb-2 flex items-center gap-2">{tips.emoji} {tips.title}</div>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
              {tips.tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {nbmeList.length >= 2 && (
          <div className="mb-8">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}

        <div className="mt-8 text-xs text-gray-500 border-t pt-4">
          <strong>{t('nbme_important')}:</strong> {t('nbme_important_desc')}
        </div>
      </div>
    </div>
  );
} 