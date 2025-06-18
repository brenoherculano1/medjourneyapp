import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Aqui você pode verificar o status da sessão se necessário
    // Por exemplo, fazer uma chamada para sua API para confirmar o pagamento
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Confirmando seu pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pagamento Confirmado!
          </h1>
          <p className="text-gray-600">
            Sua assinatura foi ativada com sucesso. Bem-vindo ao MedJourney!
          </p>
        </div>

        {sessionId && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>ID da Sessão:</strong> {sessionId}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link to="/dashboard">
            <Button variant="primary" className="w-full" rightIcon={<ArrowRight size={16} />}>
              Ir para o Dashboard
            </Button>
          </Link>
          
          <Link to="/applications">
            <Button variant="outline" className="w-full">
              Começar a Aplicar
            </Button>
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Você receberá um email de confirmação em breve com os detalhes da sua assinatura.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Success; 