import React, { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'usmle-progress';

const MiniUsaFlag = () => (
  <span role="img" aria-label="USA Flag" style={{ fontSize: 18 }}>🇺🇸</span>
);

const USMLE: React.FC = () => {
  const { t, i18n } = useTranslation();
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

  // Mapas para status traduzidos
  const step1Options = [
    { value: 'Não feito', label: t('usmle_not_done') },
    { value: 'Pass', label: 'Pass' },
    { value: 'Fail', label: 'Fail' },
  ];
  const oetOptions = [
    { value: 'Concluído', label: t('usmle_completed') },
    { value: 'Não concluído', label: t('usmle_not_done') },
  ];
  const ecfmgOptions = [
    { value: 'Solicitado', label: t('usmle_requested') },
    { value: 'Recebido', label: t('usmle_received') },
    { value: 'Não iniciado', label: t('usmle_not_started') },
  ];
  const epicOptions = [
    { value: 'Feita', label: t('usmle_done') },
    { value: 'Pendente', label: t('usmle_pending') },
  ];

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">USMLE Tracker</h1>
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
              <span className="text-2xl md:text-3xl font-bold text-center text-blue-900 dark:text-blue-100" style={{textShadow: '0 1px 6px rgba(0,0,0,0.10), 0 0px 1px #fff'}}>
                🎉 {t('usmle_congrats_title')} 🎉
              </span>
              <div className="flex items-center gap-2 mt-4 justify-center">
                <MiniUsaFlag /> <MiniUsaFlag /> <MiniUsaFlag />
              </div>
            </div>
            <div className="mt-6 mb-4 text-center text-lg font-medium text-gray-800 dark:text-gray-100">
              {t('usmle_question')}
            </div>
            {!answer && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-bounce">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow transition"
                  onClick={() => setAnswer('done')}
                >
                  {t('usmle_answer_done')}
                </button>
                <button
                  className="bg-white dark:bg-gray-700 border-2 border-blue-600 hover:bg-blue-50 dark:hover:bg-gray-600 text-blue-700 dark:text-blue-300 font-semibold px-6 py-2 rounded-full shadow transition"
                  onClick={() => setAnswer('notyet')}
                >
                  {t('usmle_answer_notyet')}
                </button>
              </div>
            )}
            {answer === 'done' && (
              <div className="text-center text-lg font-medium text-blue-800 dark:text-blue-200 animate-fade-in">
                {t('usmle_msg_done')}
              </div>
            )}
            {answer === 'notyet' && (
              <div className="mt-6 text-center animate-fade-in">
                <div className="text-base font-medium text-blue-800 dark:text-blue-200 mb-4">
                  {t('usmle_msg_notyet')}
                </div>
                <a
                  href="https://wa.me/+5555839861362?text=Ol%C3%A1%2C%20acabei%20de%20finalizar%20os%20Steps%2C%20mas%20ainda%20n%C3%A3o%20fiz%20os%20est%C3%A1gios%20necess%C3%A1rios%20para%20conseguir%20meu%20Match%2C%20quero%20marcar%20uma%20mentoria%20com%20um%20especialista!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full shadow transition"
                >
                  📲 {t('usmle_btn_mentoring')}
                </a>
              </div>
            )}
            <div className="mb-4 mt-8">
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4 mb-2">
                <div
                  className="bg-gradient-to-r from-blue-800 to-red-700 h-4 rounded-full animate-pulse"
                  style={{ width: '100%' }}
                />
              </div>
              <div className="text-right text-base font-bold text-blue-700 dark:text-blue-300">{t('usmle_100_complete')}</div>
            </div>
          </Card>
        </div>
      ) :
        <Card className="space-y-6">
          {/* Step 1 */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-white mb-1">Step 1</label>
            <select
              value={step1}
              onChange={e => setStep1(e.target.value as any)}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {step1Options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          {/* Step 2 CK */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-white mb-1">Step 2 CK</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center text-gray-700 dark:text-white">
                <input
                  type="checkbox"
                  checked={step2Done}
                  onChange={e => setStep2Done(e.target.checked)}
                  className="mr-2"
                />
                {t('usmle_done')}
              </label>
              {step2Done && (
                <input
                  type="number"
                  placeholder={t('usmle_score')}
                  value={step2Score}
                  onChange={e => setStep2Score(e.target.value)}
                  className="w-24 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min={0}
                  max={300}
                />
              )}
            </div>
          </div>
          {/* OET */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-white mb-1">OET (Occupational English Test)</label>
            <div className="flex space-x-4">
              {oetOptions.map(opt => (
                <label key={opt.value} className="flex items-center text-gray-700 dark:text-white">
                  <input
                    type="radio"
                    checked={oet === opt.value}
                    onChange={() => setOet(opt.value as any)}
                    className="mr-2"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
          {/* ECFMG */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-white mb-1">ECFMG</label>
            <div className="flex space-x-4">
              {ecfmgOptions.map(opt => (
                <label key={opt.value} className="flex items-center text-gray-700 dark:text-white">
                  <input
                    type="radio"
                    checked={ecfmg === opt.value}
                    onChange={() => setEcfmg(opt.value as any)}
                    className="mr-2"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
          {/* EPIC */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-white mb-1">EPIC</label>
            <div className="flex space-x-4">
              {epicOptions.map(opt => (
                <label key={opt.value} className="flex items-center text-gray-700 dark:text-white">
                  <input
                    type="radio"
                    checked={epic === opt.value}
                    onChange={() => setEpic(opt.value as any)}
                    className="mr-2"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
          {/* Progresso */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-white mb-1">{t('usmle_progress')}</label>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
              <div
                className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-right text-sm font-medium text-blue-700 dark:text-blue-300 mt-1">{progress}%</div>
          </div>
        </Card>
      }
    </div>
  );
};

export default USMLE; 