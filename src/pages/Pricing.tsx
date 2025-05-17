import React from 'react';
import PricingCards from '../components/pricing/PricingCards';

const Pricing: React.FC = () => {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Escolha seu Plano</h1>
        <p className="mt-3 text-xl text-gray-600 max-w-2xl mx-auto">
          Invista em sua carreira médica internacional com um plano adequado ao seu momento.
        </p>
      </div>
      
      <PricingCards />
      
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Perguntas Frequentes</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Posso cancelar minha assinatura a qualquer momento?</h3>
            <p className="mt-2 text-gray-600">
              Sim, você pode cancelar sua assinatura a qualquer momento. Se você optar pelo plano anual e cancelar antes do término, não haverá reembolso proporcional.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">Como funciona a mentoria inclusa no plano anual?</h3>
            <p className="mt-2 text-gray-600">
              Todos os assinantes têm direito a uma sessão gratuita de até 40 minutos com um de nossos mentores. Você pode agendar essa sessão através da plataforma para discutir suas aplicações, preparação para entrevistas ou qualquer outra dúvida sobre a parte de estágios internacionais.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">Existe limite de armazenamento para meus documentos?</h3>
            <p className="mt-2 text-gray-600">
              Não há limite para o número de aplicações ou documentos que você pode armazenar na plataforma, independentemente do plano escolhido.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">Como posso obter suporte se tiver problemas?</h3>
            <p className="mt-2 text-gray-600">
              Todos os usuários têm acesso ao suporte por e-mail. Os assinantes do plano anual têm prioridade no atendimento, com tempo de resposta médio de até 24 horas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;