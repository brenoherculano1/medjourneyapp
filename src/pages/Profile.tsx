import React, { useState } from 'react';
import { User, Mail, CreditCard, Bell, Shield, LogOut } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAppContext } from '../contexts/AppContext';

const Profile: React.FC = () => {
  const { user } = useAppContext();
  const [activeTab, setActiveTab] = useState('personal');
  
  const tabs = [
    { id: 'personal', label: 'Informações Pessoais', icon: User },
    { id: 'subscription', label: 'Assinatura', icon: CreditCard },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                defaultValue={user.name}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                defaultValue={user.email}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                Universidade
              </label>
              <input
                type="text"
                id="university"
                placeholder="Sua universidade ou escola de medicina"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="graduation-year" className="block text-sm font-medium text-gray-700">
                Ano de Graduação
              </label>
              <select
                id="graduation-year"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {Array.from({ length: 2035 - 1990 + 1 }, (_, i) => 1990 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="pt-5">
              <Button variant="primary">Salvar Alterações</Button>
            </div>
          </div>
        );
      case 'subscription':
        return (
          <div className="space-y-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Plano Atual</h3>
                  <p className="text-gray-600 mt-1">
                    {user.subscription ? (
                      user.subscription === 'monthly' ? 'Plano Mensal' : 'Plano Anual'
                    ) : (
                      'Você ainda não possui um plano'
                    )}
                  </p>
                </div>
                {user.subscription ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Ativo
                  </span>
                ) : null}
              </div>
              {user.subscription && user.subscriptionExpiry && (
                <div className="mt-4 text-sm text-gray-500">
                  Próxima cobrança em: {new Date(user.subscriptionExpiry).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>
            {user.subscription ? (
              <div className="space-y-4">
                <Button variant="outline">
                  Alterar Plano
                </Button>
                <Button variant="danger">
                  Cancelar Assinatura
                </Button>
              </div>
            ) : null}
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Atualizações de Estágios</h3>
                  <p className="text-sm text-gray-500">Receba notificações quando houver mudanças em seus estágios</p>
                </div>
                <div className="flex items-center">
                  <input
                    id="notifications-app"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Lembretes de Entrevista</h3>
                  <p className="text-sm text-gray-500">Receba lembretes para praticar com o simulador de entrevistas</p>
                </div>
                <div className="flex items-center">
                  <input
                    id="notifications-interview"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Atualizações de Visto</h3>
                  <p className="text-sm text-gray-500">Receba alertas sobre agendamentos e prazos de visto</p>
                </div>
                <div className="flex items-center">
                  <input
                    id="notifications-visa"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Emails Promocionais</h3>
                  <p className="text-sm text-gray-500">Receba ofertas especiais e novidades sobre a plataforma</p>
                </div>
                <div className="flex items-center">
                  <input
                    id="notifications-promo"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-5">
              <Button variant="primary">Salvar Preferências</Button>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Alterar Senha</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    id="current-password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6">
                <Button variant="primary">Atualizar Senha</Button>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Excluir conta</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Ao excluir sua conta, todos os seus dados serão permanentemente removidos.
                  </p>
                </div>
                <Button variant="danger">Excluir Conta</Button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 text-center border-b border-gray-200">
              <div className="inline-flex h-20 w-20 rounded-full bg-blue-100 items-center justify-center">
                <span className="text-xl font-medium text-blue-600">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500 flex items-center justify-center mt-1">
                <Mail size={14} className="mr-1" />
                {user.email}
              </p>
            </div>
            <nav className="py-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center w-full px-4 py-2 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon size={16} className="mr-3" />
                  {tab.label}
                </button>
              ))}
              <button
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} className="mr-3" />
                Sair
              </button>
            </nav>
          </div>
        </div>
        <div className="flex-1">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{tabs.find(t => t.id === activeTab)?.label}</h2>
            {renderTabContent()}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;