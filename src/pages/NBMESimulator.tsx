import { useState } from "react";

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

export default function NBMESimulator() {
  const [score, setScore] = useState<number | null>(null);
  const [result, setResult] = useState<string[]>([]);

  const handleSubmit = () => {
    if (score === null || score < 120 || score > 300) {
      alert("Por favor, insira uma nota válida (entre 120 e 300)");
      return;
    }

    const matched = recommendations
      .filter((rec) => score >= rec.minScore)
      .map((rec) => rec.specialty);

    setResult(matched);
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
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 transition"
          min={120}
          max={300}
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition mb-4 shadow"
        >
          Ver Especialidades Compatíveis
        </button>

        {result.length > 0 && (
          <div className="mt-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Com essa nota, você pode aplicar para:</h3>
            <div className="flex flex-wrap gap-2">
              {result.map((spec, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-200 shadow-sm"
                >
                  ✅ {spec}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="mt-8 text-xs text-gray-500 border-t pt-4">
          <strong>Importante:</strong> Utilizamos as médias dos candidatos aprovados em cada especialidade. É importante lembrar que, além da pontuação no Step 2 CK, outros fatores como experiências clínicas, cartas de recomendação, atividades de pesquisa e desempenho em entrevistas também desempenham papéis cruciais no processo de seleção para residências médicas nos EUA.
        </div>
      </div>
    </div>
  );
} 