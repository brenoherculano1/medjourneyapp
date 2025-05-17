import React from 'react';

const SubscriptionBlock: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Acesso Restrito</h2>
      <p className="mb-6 text-gray-700">
        O MedJourney é uma plataforma exclusiva para médicos em jornada internacional.<br />
        Acesse com sua assinatura ativa.
      </p>
      <a
        href="https://seu-link-de-checkout.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition"
      >
        Assinar agora
      </a>
    </div>
  </div>
);

export default SubscriptionBlock; 