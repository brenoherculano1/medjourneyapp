import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useTranslation } from 'react-i18next';

const Success: React.FC = () => {
  const { t, i18n } = useTranslation();
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
          <p className="mt-4 text-gray-600">{t('loading_payment')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full text-center">
        <div className="flex justify-end mb-2">
          <button onClick={() => i18n.changeLanguage('pt')} className={`px-3 py-1 rounded-l ${i18n.language === 'pt' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>PT</button>
          <button onClick={() => i18n.changeLanguage('en')} className={`px-3 py-1 rounded-r ${i18n.language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>EN</button>
        </div>
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('success_payment')}
          </h1>
          <p className="text-gray-600">
            {t('welcome')}
          </p>
        </div>

        {sessionId && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>{t('session_id')}:</strong> {sessionId}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link to="/dashboard">
            <Button variant="primary" className="w-full" rightIcon={<ArrowRight size={16} />}>
              {t('go_to_dashboard')}
            </Button>
          </Link>
          
          <Link to="/applications">
            <Button variant="outline" className="w-full">
              {t('start_applying')}
            </Button>
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            {t('confirmation_email')}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Success; 