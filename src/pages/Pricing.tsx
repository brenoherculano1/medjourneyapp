import React from 'react';
import PricingCards from '../components/pricing/PricingCards';
import { useTranslation } from 'react-i18next';

const Pricing: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">{t('choose_plan')}</h1>
        <p className="mt-3 text-xl text-gray-600 max-w-2xl mx-auto">
          {t('pricing_subtitle')}
        </p>
      </div>
      
      <PricingCards />
      
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('pricing_faq_title')}</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{t('pricing_faq_cancel_title')}</h3>
            <p className="mt-2 text-gray-600">
              {t('pricing_faq_cancel_desc')}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">{t('pricing_faq_mentoring_title')}</h3>
            <p className="mt-2 text-gray-600">
              {t('pricing_faq_mentoring_desc')}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">{t('pricing_faq_storage_title')}</h3>
            <p className="mt-2 text-gray-600">
              {t('pricing_faq_storage_desc')}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">{t('pricing_faq_support_title')}</h3>
            <p className="mt-2 text-gray-600">
              {t('pricing_faq_support_desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;