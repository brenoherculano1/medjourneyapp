import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';

const STORAGE_KEY = 'usmle-progress';

const MiniUsaFlag = () => (
  <span role="img" aria-label="USA Flag" style={{ fontSize: 24, margin: '0 2px' }}>🇺🇸</span>
);

const USMLE: React.FC = () => {
  // Estados dos campos
  const [step1, setStep1] = useState<'Não feito' | 'Pass' | 'Fail'>('Não feito');
  const [step2Done, setStep2Done] = useState(false);
  const [step2Score, setStep2Score] = useState('');
  const [oet, setOet] = useState<'Concluído' | 'Não concluído'>('Não concluído');
  const [ecfmg, setEcfmg] = useState<'Solicitado' | 'Recebido' | 'Não iniciado'>('Não iniciado');
  const [epic, setEpic] = useState<'Feita' | 'Pendente'>('Pendente');
  const [answer, setAnswer] = useState<null | 'done' | 'notyet'>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Carregar dados salvos ao montar
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setStep1(data.step1 ?? 'Não feito');
      setStep2Done(data.step2Done ?? false);
      setStep2Score(data.step2Score ?? '');
      setOet(data.oet ?? 'Não concluído');
      setEcfmg(data.ecfmg ?? 'Não iniciado');
      setEpic(data.epic ?? 'Pendente');
    }
  }, []);

  // Salvar sempre que algum campo mudar
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ step1, step2Done, step2Score, oet, ecfmg, epic })
    );
  }, [step1, step2Done, step2Score, oet, ecfmg, epic]);

  // Cálculo do progresso
  let filled = 0;
  if (step1 !== 'Não feito') filled++;
  if (step2Done && step2Score) filled++;
  else if (step2Done) filled += 0.5;
  if (oet === 'Concluído') filled++;
  if (ecfmg !== 'Não iniciado') filled++;
  if (epic === 'Feita') filled++;
  const total = 5;
  const progress = Math.round((filled / total) * 100);

  // Confete ao atingir 100%
  useEffect(() => {
    if (progress === 100) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [progress]);

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">USMLE Tracker</h1>
      {progress === 100 ? (
        <div className="relative">
          {/* Confete simples */}
          {showConfetti && (
            <div style={{position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 10, pointerEvents: 'none'}}>
              <div style={{fontSize: 40, textAlign: 'center', animation: 'confetti 1.5s linear infinite'}}>
                🎉🎊🎉🎊🎉
              </div>
              <style>{`
                @keyframes confetti {
                  0% { opacity: 1; }
                  100% { opacity: 0.2; }
                }
              `}</style>
            </div>
          )}
          <Card className="space-y-6 border-4 border-blue-700 animate-fade-in">
            <div className="flex flex-col items-center mb-4">
              <span className="text-2xl md:text-3xl font-bold text-center text-blue-900" style={{textShadow: '0 1px 6px rgba(0,0,0,0.10), 0 0px 1px #fff'}}>
                🎉 Parabéns! Você completou o processo do USMLE! 🎉
              </span>
              <div className="flex items-center gap-2 mt-4 justify-center">
                <MiniUsaFlag /> <MiniUsaFlag /> <MiniUsaFlag />
              </div>
            </div>
            <div className="mt-6 mb-4 text-center text-lg font-medium text-gray-800">
              Me responde uma pergunta: você já fez os estágios necessários para ter seu tão sonhado Match?
            </div>
            {!answer && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-bounce">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow transition"
                  onClick={() => setAnswer('done')}
                >
                  Já fiz!!
                </button>
                <button
                  className="bg-white border-2 border-blue-600 hover:bg-blue-50 text-blue-700 font-semibold px-6 py-2 rounded-full shadow transition"
                  onClick={() => setAnswer('notyet')}
                >
                  Ainda não, será meu foco agora!
                </button>
              </div>
            )}
            {answer === 'done' && (
              <div className="mt-6 text-center text-base font-medium text-blue-800 animate-fade-in">
                Incrível! Ficamos felizes de ver você tão bem posicionado. Que sua aplicação seja um sucesso — estamos na torcida para ver você conquistando o Match em grande estilo. 👏🇺🇸
              </div>
            )}
            {answer === 'notyet' && (
              <div className="mt-6 text-center animate-fade-in">
                <div className="text-base font-medium text-blue-800 mb-4">
                  Esse é o momento perfeito. Agora que você dominou o USMLE, falta só o próximo passo estratégico: os estágios certos.<br /><br />
                  Nessa fase, a maioria comete erros caros, perde tempo com estágios fracos ou não entende o jogo real das cartas de recomendação.<br /><br />
                  Nós criamos uma mentoria individual pensada exatamente para quem está no seu nível — para alinhar sua realidade com o tipo de aplicação que realmente vence.
                </div>
                <a
                  href="https://wa.me/+5555839861362?text=Ol%C3%A1%2C%20acabei%20de%20finalizar%20os%20Steps%2C%20mas%20ainda%20n%C3%A3o%20fiz%20os%20est%C3%A1gios%20necess%C3%A1rios%20para%20conseguir%20meu%20Match%2C%20quero%20marcar%20uma%20mentoria%20com%20um%20especialista!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full shadow transition"
                >
                  📲 Quero conversar com um estrategista
                </a>
              </div>
            )}
            <div className="mb-4 mt-8">
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-gradient-to-r from-blue-800 to-red-700 h-4 rounded-full animate-pulse"
                  style={{ width: '100%' }}
                />
              </div>
              <div className="text-right text-base font-bold text-blue-700">100% completo</div>
            </div>
          </Card>
        </div>
      ) : (
        <Card className="space-y-6">
          {/* Step 1 */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Step 1</label>
            <select
              value={step1}
              onChange={e => setStep1(e.target.value as any)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Não feito">Não feito</option>
              <option value="Pass">Pass</option>
              <option value="Fail">Fail</option>
            </select>
          </div>
          {/* Step 2 CK */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Step 2 CK</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={step2Done}
                  onChange={e => setStep2Done(e.target.checked)}
                  className="mr-2"
                />
                Feito
              </label>
              {step2Done && (
                <input
                  type="number"
                  placeholder="Nota"
                  value={step2Score}
                  onChange={e => setStep2Score(e.target.value)}
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min={0}
                  max={300}
                />
              )}
            </div>
          </div>
          {/* OET */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">OET (Occupational English Test)</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={oet === 'Concluído'}
                  onChange={() => setOet('Concluído')}
                  className="mr-2"
                />
                Concluído
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={oet === 'Não concluído'}
                  onChange={() => setOet('Não concluído')}
                  className="mr-2"
                />
                Não concluído
              </label>
            </div>
          </div>
          {/* ECFMG */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">ECFMG Certification</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={ecfmg === 'Solicitado'}
                  onChange={() => setEcfmg('Solicitado')}
                  className="mr-2"
                />
                Solicitado
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={ecfmg === 'Recebido'}
                  onChange={() => setEcfmg('Recebido')}
                  className="mr-2"
                />
                Recebido
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={ecfmg === 'Não iniciado'}
                  onChange={() => setEcfmg('Não iniciado')}
                  className="mr-2"
                />
                Não iniciado
              </label>
            </div>
          </div>
          {/* EPIC */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">EPIC Verification</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={epic === 'Feita'}
                  onChange={() => setEpic('Feita')}
                  className="mr-2"
                />
                Feita
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={epic === 'Pendente'}
                  onChange={() => setEpic('Pendente')}
                  className="mr-2"
                />
                Pendente
              </label>
            </div>
          </div>
          {/* Progresso */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Progresso</label>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-right text-sm font-medium text-blue-700 mt-1">{progress}%</div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default USMLE; 