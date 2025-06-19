import React, { useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { createCheckoutSession } from '../../lib/stripe';
import Button from './Button';
import { useTranslation } from 'react-i18next';

const SubscriptionBlock: React.FC = () => {
  const { t, i18n } = useTranslation();
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
        alert(t('error_redirect_checkout'));
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert(t('error_create_checkout'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="flex justify-end mb-2">
          <button onClick={() => i18n.changeLanguage('pt')} className={`px-3 py-1 rounded-l ${i18n.language === 'pt' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>PT</button>
          <button onClick={() => i18n.changeLanguage('en')} className={`px-3 py-1 rounded-r ${i18n.language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>EN</button>
        </div>
        <h2 className="text-2xl font-bold text-blue-700 mb-4">{t('restricted_access')}</h2>
        <p className="mb-6 text-gray-700">
          {t('platform_exclusive')}<br />
          {t('active_subscription')}
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full"
        >
          {loading ? t('loading') : t('subscribe_annual')}
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionBlock; 