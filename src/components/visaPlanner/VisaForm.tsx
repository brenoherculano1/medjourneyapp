import React, { useState } from 'react';
import { Calendar, Link as LinkIcon, Home, Plane, Shield } from 'lucide-react';
import Button from '../common/Button';
import { VisaPlanning, VisaStatus } from '../../types';
import { COUNTRIES } from '../../utils/constants';
import { useTranslation } from 'react-i18next';

interface VisaFormProps {
  onSubmit: (visaPlanning: Omit<VisaPlanning, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: VisaPlanning;
  isEdit?: boolean;
}

const VisaForm: React.FC<VisaFormProps> = ({
  onSubmit,
  initialData,
  isEdit = false,
}) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<Omit<VisaPlanning, 'id' | 'createdAt' | 'updatedAt'>>({
    country: initialData?.country || COUNTRIES[0].name,
    visaType: initialData?.visaType || COUNTRIES[0].visaTypes[0],
    appointmentDate: initialData?.appointmentDate || '',
    status: initialData?.status || 'Pendente',
    embassyLink: initialData?.embassyLink || COUNTRIES[0].embassyLink,
    accommodation: initialData?.accommodation || '',
    insurance: initialData?.insurance || '',
    flight: initialData?.flight || '',
    notes: initialData?.notes || '',
  });

  // Get visa types for the selected country
  const getVisaTypes = () => {
    const country = COUNTRIES.find(c => c.name === formData.country);
    return country ? country.visaTypes : [];
  };

  // Get embassy link for the selected country
  const getEmbassyLink = (countryName: string) => {
    const country = COUNTRIES.find(c => c.name === countryName);
    return country ? country.embassyLink : '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // If country changes, update embassy link and set first visa type
    if (name === 'country') {
      const country = COUNTRIES.find(c => c.name === value);
      setFormData(prev => ({
        ...prev,
        country: value,
        embassyLink: country ? country.embassyLink : '',
        visaType: country ? country.visaTypes[0] : '',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('visa_form_title')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                {t('visa_form_country')} *
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {COUNTRIES.map((country) => (
                  <option key={country.id} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="visaType" className="block text-sm font-medium text-gray-700">
                {t('visa_form_type')} *
              </label>
              <select
                id="visaType"
                name="visaType"
                value={formData.visaType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="B1/B2">B1/B2</option>
                <option value="J1">J1</option>
                <option value="F1">F1</option>
                <option value="H1b">H1b</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">
                {t('visa_form_appointment')}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="appointmentDate"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  className="block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                {t('visa_form_status')} *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Pendente">{t('visa_status_pending')}</option>
                <option value="Agendado">{t('visa_status_scheduled')}</option>
                <option value="Concluído">{t('visa_status_completed')}</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="embassyLink" className="block text-sm font-medium text-gray-700">
              {t('visa_form_embassy_link')}
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon size={16} className="text-gray-400" />
              </div>
              <input
                type="url"
                id="embassyLink"
                name="embassyLink"
                value={formData.embassyLink}
                onChange={handleChange}
                readOnly
                className="block w-full pl-10 rounded-md border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('travel_form_title')}</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="accommodation" className="block text-sm font-medium text-gray-700 flex items-center">
                <Home size={16} className="mr-2 text-gray-500" />
                {t('travel_accommodation')}
              </label>
              <input
                type="text"
                id="accommodation"
                name="accommodation"
                value={formData.accommodation}
                onChange={handleChange}
                placeholder={t('travel_accommodation_placeholder')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="insurance" className="block text-sm font-medium text-gray-700 flex items-center">
                <Shield size={16} className="mr-2 text-gray-500" />
                {t('travel_insurance')}
              </label>
              <input
                type="text"
                id="insurance"
                name="insurance"
                value={formData.insurance}
                onChange={handleChange}
                placeholder={t('travel_insurance_placeholder')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="flight" className="block text-sm font-medium text-gray-700 flex items-center">
                <Plane size={16} className="mr-2 text-gray-500" />
                {t('travel_flight')}
              </label>
              <input
                type="text"
                id="flight"
                name="flight"
                value={formData.flight}
                onChange={handleChange}
                placeholder={t('travel_flight_placeholder')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                {t('visa_notes')}
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder={t('visa_notes_placeholder')}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
        >
          {isEdit ? t('save_changes') : t('add_plan')}
        </Button>
      </div>
    </form>
  );
};

export default VisaForm;