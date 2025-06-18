import React, { useState } from 'react';
import { Check, Calendar, Infinity } from 'lucide-react';
import { useStripe } from '@stripe/react-stripe-js';
import Card from '../common/Card';
import Button from '../common/Button';
import { createCheckoutSession } from '../../lib/stripe';

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
  const stripe = useStripe();
  const [loading, setLoading] = useState<string | null>(null);

  const pricingPlans: PricingPlan[] = [
    {
      title: 'Mensal',
      description: 'Acesso completo a todos os recursos, renovação mensal.',
      price: 'R$67,90',
      period: '/mês',
      icon: <Calendar className="h-6 w-6 text-purple-500" />,
      priceId: 'price_mensal',
      planType: 'mensal',
      features: [
        { text: 'Acesso a todas as ferramentas de aplicação', included: true },
        { text: 'Simulador de entrevistas ilimitado', included: true },
        { text: 'Planejamento de visto e viagem', included: true },
        { text: 'Dashboard personalizado', included: true },
        { text: 'Armazenamento de dados na nuvem', included: true },
        { text: 'Suporte por email', included: true },
        { text: 'Uma Mentoria individual sobre estágios internacionais', included: false },
      ],
      buttonText: 'Assinar Mensal',
    },
    {
      title: 'Trimestral',
      description: 'Acesso completo a todos os recursos, renovação a cada 3 meses.',
      price: 'R$119,90',
      period: '/trimestre',
      icon: <Calendar className="h-6 w-6 text-blue-500" />,
      priceId: 'price_trimestral',
      planType: 'trimestral',
      features: [
        { text: 'Acesso a todas as ferramentas de aplicação', included: true },
        { text: 'Simulador de entrevistas ilimitado', included: true },
        { text: 'Planejamento de visto e viagem', included: true },
        { text: 'Dashboard personalizado', included: true },
        { text: 'Armazenamento de dados na nuvem', included: true },
        { text: 'Suporte por email', included: true },
        { text: 'Uma Mentoria individual sobre estágios internacionais', included: true },
      ],
      buttonText: 'Assinar Trimestral',
    },
    {
      title: 'Anual',
      description: 'Economize 30% com o plano anual.',
      price: 'R$349,90',
      period: '/ano',
      icon: <Infinity className="h-6 w-6 text-green-500" />,
      highlighted: true,
      priceId: 'price_anual',
      planType: 'anual',
      features: [
        { text: 'Acesso a todas as ferramentas de aplicação', included: true },
        { text: 'Simulador de entrevistas ilimitado', included: true },
        { text: 'Planejamento de visto e viagem', included: true },
        { text: 'Dashboard personalizado', included: true },
        { text: 'Armazenamento de dados na nuvem', included: true },
        { text: 'Suporte por email prioritário', included: true },
        { text: 'Uma Mentoria individual sobre estágios internacionais', included: true },
      ],
      buttonText: 'Escolher Anual',
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
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
              Melhor valor
            </div>
          )}
          
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              {plan.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{plan.title}</h3>
            <p className="text-gray-500 mt-2">{plan.description}</p>
          </div>
          
          <div className="flex justify-center items-baseline my-8">
            <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
            <span className="ml-1 text-xl text-gray-500">{plan.period}</span>
          </div>
          
          <ul className="space-y-4 mb-8">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start">
                <span className={`flex-shrink-0 h-5 w-5 rounded-full ${feature.included ? 'text-green-500' : 'text-gray-400'} mr-2`}>
                  {feature.included ? <Check size={20} /> : '–'}
                </span>
                <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-500'}`}>
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
          
          {plan.planType === 'mensal' ? (
            <div className="w-full flex justify-center mt-4">
              <stripe-buy-button
                buy-button-id="buy_btn_1RbQa6AVYAfdSmjuEJi0GT0D"
                publishable-key="pk_live_51RPUJpAVYAfdSmjuxytAwxYVRFNc5qr6kAvM5NAIHTcUUkWdju6y2XqnBraPQLj0j8MimCqrJLsvsWVpQj6owpAx001aLVvNsn"
              ></stripe-buy-button>
            </div>
          ) : plan.planType === 'trimestral' ? (
            <div className="w-full flex justify-center mt-4">
              <stripe-buy-button
                buy-button-id="buy_btn_1RbQdZAVYAfdSmjusM57WX4Y"
                publishable-key="pk_live_51RPUJpAVYAfdSmjuxytAwxYVRFNc5qr6kAvM5NAIHTcUUkWdju6y2XqnBraPQLj0j8MimCqrJLsvsWVpQj6owpAx001aLVvNsn"
              ></stripe-buy-button>
            </div>
          ) : plan.planType === 'anual' ? (
            <div className="w-full flex justify-center mt-4">
              <stripe-buy-button
                buy-button-id="buy_btn_1RbQghAVYAfdSmju0Ayo0Jav"
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
              {loading === plan.planType ? 'Carregando...' : plan.buttonText}
            </Button>
          )}
        </Card>
      ))}
    </div>
  );
};

export default PricingCards;