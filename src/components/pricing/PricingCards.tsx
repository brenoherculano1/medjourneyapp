import React, { useState } from 'react';
import { Check, Calendar, Infinity } from 'lucide-react';
import { useStripe } from '@stripe/react-stripe-js';
import Card from '../common/Card';
import Button from '../common/Button';
import { createCheckoutSession } from '../../lib/stripe';
import { useTranslation } from 'react-i18next';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  title: string;
  description: string;
  price: string;
  period: string;
  features: PricingFeature[];
  buttonText: string;
  highlighted?: boolean;
  icon: React.ReactNode;
  priceId: string; // ID do preço no Stripe
  planType: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'buy-button-id': string;
        'publishable-key': string;
      };
    }
  }
}

const PricingCards: React.FC = () => {
  const { t, i18n } = useTranslation();
  const stripe = useStripe();
  const [loading, setLoading] = useState<string | null>(null);

  const pricingPlans: PricingPlan[] = [
    {
      title: 'monthly',
      description: t('pricing_monthly_desc'),
      price: i18n.language === 'en' ? 'U$19.90' : 'R$67,90',
      period: t('pricing_per_month'),
      icon: <Calendar className="h-6 w-6 text-purple-500" />,
      priceId: 'price_mensal',
      planType: 'monthly',
      features: [
        { text: t('pricing_feature_tools'), included: true },
        { text: t('pricing_feature_interviews'), included: true },
        { text: t('pricing_feature_visa'), included: true },
        { text: t('pricing_feature_dashboard'), included: true },
        { text: t('pricing_feature_storage'), included: true },
        { text: t('pricing_feature_support'), included: true },
        { text: t('pricing_feature_mentoring'), included: false },
      ],
      buttonText: t('subscribe_monthly'),
    },
    {
      title: 'quarterly',
      description: t('pricing_quarterly_desc'),
      price: i18n.language === 'en' ? 'U$49.90' : 'R$119,90',
      period: t('pricing_per_quarter'),
      icon: <Calendar className="h-6 w-6 text-blue-500" />,
      priceId: 'price_trimestral',
      planType: 'quarterly',
      features: [
        { text: t('pricing_feature_tools'), included: true },
        { text: t('pricing_feature_interviews'), included: true },
        { text: t('pricing_feature_visa'), included: true },
        { text: t('pricing_feature_dashboard'), included: true },
        { text: t('pricing_feature_storage'), included: true },
        { text: t('pricing_feature_support'), included: true },
        { text: t('pricing_feature_mentoring'), included: true },
      ],
      buttonText: t('subscribe_quarterly'),
    },
    {
      title: 'annual',
      description: t('pricing_annual_desc'),
      price: i18n.language === 'en' ? 'U$169.90' : 'R$349,90',
      period: t('pricing_per_year'),
      icon: <Infinity className="h-6 w-6 text-green-500" />,
      highlighted: true,
      priceId: 'price_anual',
      planType: 'annual',
      features: [
        { text: t('pricing_feature_tools'), included: true },
        { text: t('pricing_feature_interviews'), included: true },
        { text: t('pricing_feature_visa'), included: true },
        { text: t('pricing_feature_dashboard'), included: true },
        { text: t('pricing_feature_storage'), included: true },
        { text: t('pricing_feature_support_priority'), included: true },
        { text: t('pricing_feature_mentoring'), included: true },
      ],
      buttonText: t('subscribe_annual'),
    },
  ];

  const handleCheckout = async (plan: PricingPlan) => {
    if (!stripe) {
      console.error('Stripe not loaded');
      return;
    }

    setLoading(plan.planType);

    try {
      // Criar sessão de checkout
      const sessionId = await createCheckoutSession(
        plan.priceId,
        plan.planType
      );

      // Redirecionar para o checkout do Stripe
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
      setLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-end mb-4">
        <button onClick={() => i18n.changeLanguage('pt')} className={`px-3 py-1 rounded-l ${i18n.language === 'pt' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>PT</button>
        <button onClick={() => i18n.changeLanguage('en')} className={`px-3 py-1 rounded-r ${i18n.language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>EN</button>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">{t('choose_plan')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {pricingPlans.map((plan, index) => (
        <Card
          key={index}
          className={`
            relative overflow-hidden transition-all duration-300
            ${plan.highlighted ? 'border-2 border-blue-500 transform hover:-translate-y-1' : 'border border-gray-200 hover:border-blue-200'}
          `}
        >
          {plan.highlighted && (
            <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs font-bold uppercase transform translate-y-0 translate-x-0 rotate-0">
                {t('best_value')}
            </div>
          )}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              {plan.icon}
            </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t(plan.title)}</h3>
              <p className="text-gray-500 dark:text-gray-300 mt-2">{plan.description}</p>
          </div>
          <div className="flex justify-center items-baseline my-8">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
              <span className="ml-1 text-xl text-gray-500 dark:text-gray-300">{plan.period}</span>
          </div>
          <ul className="space-y-4 mb-8">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start">
                  <span className={`flex-shrink-0 h-5 w-5 rounded-full ${feature.included ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'} mr-2`}>
                  {feature.included ? <Check size={20} /> : '–'}
                </span>
                  <span className={`text-sm ${feature.included ? 'text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>{feature.text}</span>
              </li>
            ))}
          </ul>
            {plan.planType === 'monthly' ? (
              <div className="w-full flex justify-center mt-4">
                <stripe-buy-button
                  buy-button-id="buy_btn_1RbgXuAVYAfdSmjulNJ0G8w3"
                  publishable-key="pk_live_51RPUJpAVYAfdSmjuxytAwxYVRFNc5qr6kAvM5NAIHTcUUkWdju6y2XqnBraPQLj0j8MimCqrJLsvsWVpQj6owpAx001aLVvNsn"
                ></stripe-buy-button>
              </div>
            ) : plan.planType === 'quarterly' ? (
              <div className="w-full flex justify-center mt-4">
                <stripe-buy-button
                  buy-button-id="buy_btn_1RbgZRAVYAfdSmjuSzJjA3Ss"
                  publishable-key="pk_live_51RPUJpAVYAfdSmjuxytAwxYVRFNc5qr6kAvM5NAIHTcUUkWdju6y2XqnBraPQLj0j8MimCqrJLsvsWVpQj6owpAx001aLVvNsn"
                ></stripe-buy-button>
              </div>
            ) : plan.planType === 'annual' ? (
              <div className="w-full flex justify-center mt-4">
                <stripe-buy-button
                  buy-button-id="buy_btn_1RbgarAVYAfdSmjuDXm2KYRV"
                  publishable-key="pk_live_51RPUJpAVYAfdSmjuxytAwxYVRFNc5qr6kAvM5NAIHTcUUkWdju6y2XqnBraPQLj0j8MimCqrJLsvsWVpQj6owpAx001aLVvNsn"
                ></stripe-buy-button>
              </div>
            ) : (
          <Button
            variant={plan.highlighted ? 'primary' : 'outline'}
            size="lg"
            className="w-full"
                onClick={() => handleCheckout(plan)}
                disabled={loading === plan.planType}
          >
                {loading === plan.planType ? 'Carregando...' : t(plan.buttonText)}
          </Button>
            )}
        </Card>
      ))}
      </div>
    </div>
  );
};

export default PricingCards;