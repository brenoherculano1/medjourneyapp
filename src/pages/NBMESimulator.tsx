import { useState, useEffect } from "react";
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

const studyTips = [
  {
    range: [0, 199],
    color: 'red-500',
    emoji: '🔴',
    title: 'Objetivo: Construir base sólida e reforçar conceitos fundamentais.',
    tips: [
      'Rever a UWorld passo a passo, com ênfase em revisar a explicação de cada questão.',
      'Focar nas disciplinas básicas mais cobradas: Medicina interna, pediatria, OB/GYN.',
      'Estudo ativo com anotações curtas das explicações.',
      'Usar os resumos do Mehlman para criar flashcards ou fichas rápidas, garantindo memorização de pontos high-yield.',
      'Completar vídeos de revisão (Boards and Beyond, Emma Holliday) junto dos Mehlman Notes.'
    ]
  },
  {
    range: [200, 219],
    color: 'orange-500',
    emoji: '🟠',
    title: 'Objetivo: Consolidar conhecimento e começar prática intensiva de questões.',
    tips: [
      'Finalizar a 1ª volta da UWorld com revisão ativa de todas as explicações.',
      'Fazer sistematicamente um tema por dia (ex: segunda = cardio, terça = pulmão).',
      'Aumentar o uso de notas do Mehlman para revisar os tópicos mais cobrados.',
      'Revisar gráficos, scores (CHADS-VASc, Wells, TIMI, etc.) e guidelines clínicas com base nos Mehlman Notes.',
      'Simulados NBME a cada 10–14 dias com análise minuciosa.'
    ]
  },
  {
    range: [220, 239],
    color: 'yellow-500',
    emoji: '🟡',
    title: 'Objetivo: Aumentar precisão, refinar tempo de prova, revisar pontos fracos.',
    tips: [
      'Segunda volta de UWorld por sistema ou modo aleatório.',
      'Fazer revisões rápidas usando os Mehlman Notes antes de cada bloco de questões.',
      'Marcar questões erradas com um código (ex: confundi conceito, falha de interpretação, chute).',
      'Praticar tempo com UWSA e NBME full-lengths.',
      'Reforçar os "escondidos" como ética, dermato, psiquiatria, doenças raras pediátricas com os Mehlman Notes.'
    ]
  },
  {
    range: [240, 259],
    color: 'green-500',
    emoji: '🟢',
    title: 'Objetivo: Polir os detalhes e garantir constância no acerto.',
    tips: [
      'Revisar seus erros recorrentes no UWorld e simulados.',
      'Repassar tópicos raros com revisão de Mehlman Notes + UWorld tags.',
      'Estudo em modo reverso: tentar prever a pergunta a partir da explicação.',
      'Praticar exames simulados em condições reais (7 blocos de 40 questões) para melhorar resistência mental.',
      'Reforçar detalhes com Mehlman: mnemônicos, pegadinhas clássicas e diferenças sutis entre diagnósticos.'
    ]
  },
  {
    range: [260, 300],
    color: 'emerald-600',
    emoji: '🟩',
    title: 'Objetivo: Manter performance e revisar de forma inteligente e seletiva.',
    tips: [
      'Revisões direcionadas com flashcards (Anki ou personalizados com base nos Mehlman Notes).',
      'Praticar resolução com agilidade e foco em questões tipo "most likely to be missed".',
      'Reforçar aspectos de gestão clínica e guidelines atualizadas.',
      'Treinar atenção plena para não cair em distrações durante questões fáceis.',
      'Usar Mehlman Notes como "checklist final" antes do exame para não esquecer nada essencial.'
    ]
  }
];

interface NBMEEntry {
  score: number;
  date: string;
}

const STORAGE_KEY = 'nbme-scores';

export default function NBMESimulator() {
  const [score, setScore] = useState<number | null>(null);
  const [date, setDate] = useState<string>("");
  const [result, setResult] = useState<string[]>([]);
  const [tips, setTips] = useState<typeof studyTips[0] | null>(null);
  const [nbmeList, setNbmeList] = useState<NBMEEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setNbmeList(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = () => {
    if (score === null || score < 120 || score > 300) {
      alert("Por favor, insira uma nota válida (entre 120 e 300)");
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
      alert('Preencha a nota e a data para salvar!');
      return;
    }
    const newList = [...nbmeList, { score, date }];
    setNbmeList(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    alert('Nota salva com sucesso!');
  };

  // Dados para o gráfico
  const chartData = {
    labels: nbmeList.map((entry) => entry.date),
    datasets: [
      {
        label: 'NBME Score',
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
      title: { display: true, text: 'Evolução das Notas NBME', font: { size: 18 } },
    },
    scales: {
      y: {
        min: 120,
        max: 300,
        ticks: { stepSize: 10 },
        title: { display: true, text: 'Nota' },
      },
      x: {
        title: { display: true, text: 'Data' },
      },
    },
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-800 mb-2 flex items-center gap-2">📊 Análise do seu NBME</h2>
        <p className="text-gray-700 mb-6 text-sm">Insira sua nota no simulado (NBME ou UWSA) e veja as especialidades onde você tem chance de ser competitivo:</p>

        <input
          type="number"
          value={score ?? ""}
          onChange={(e) => setScore(Number(e.target.value))}
          placeholder="Digite sua nota (ex: 230)"
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
            onClick={handleSubmit}
            className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition shadow"
          >
            Ver Especialidades Compatíveis
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition shadow"
          >
            Salvar Nota
          </button>
        </div>

        {result.length > 0 && (
          <div className="mt-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Com essa nota, você pode aplicar para:</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {result.map((spec, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-200 shadow-sm"
                >
                  ✅ {spec}
                </span>
              ))}
            </div>
            {tips && (
              <div className={`rounded-lg border-l-4 pl-4 py-3 bg-gray-50 border-${tips.color} mb-2`}> 
                <div className={`font-bold text-${tips.color} mb-1 flex items-center gap-1`}>{tips.emoji} {tips.title}</div>
                <ul className="list-disc ml-5 text-gray-700 text-sm space-y-1">
                  {tips.tips.map((dica, i) => (
                    <li key={i}>{dica}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {nbmeList.length >= 2 && (
          <div className="mt-10">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}

        <div className="mt-8 text-xs text-gray-500 border-t pt-4">
          <strong>Importante:</strong> Utilizamos as médias dos candidatos aprovados em cada especialidade. É importante lembrar que, além da pontuação no Step 2 CK, outros fatores como experiências clínicas, cartas de recomendação, atividades de pesquisa e desempenho em entrevistas também desempenham papéis cruciais no processo de seleção para residências médicas nos EUA.
        </div>
      </div>
    </div>
  );
} 