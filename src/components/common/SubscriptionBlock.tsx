import React, { useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { createCheckoutSession } from '../../lib/stripe';
import Button from './Button';

const SubscriptionBlock: React.FC = () => {
  const stripe = useStripe();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!stripe) {
      console.error('Stripe not loaded');
      return;
    }

    setLoading(true);

    try {
      // Usar o plano anual como padrão
      const sessionId = await createCheckoutSession(
        'price_anual', // Substitua pelo ID real do Stripe
        'anual'
      );

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error('Error redirecting to checkout:', error);
        alert('Erro ao redirecionar para o pagamento. Tente novamente.');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Erro ao criar sessão de pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Acesso Restrito</h2>
        <p className="mb-6 text-gray-700">
          O MedJourney é uma plataforma exclusiva para médicos em jornada internacional.<br />
          Acesse com sua assinatura ativa.
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Carregando...' : 'Assinar agora'}
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionBlock; 