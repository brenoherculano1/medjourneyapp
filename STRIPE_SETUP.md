# Configuração do Stripe - MedJourney

## ✅ Status da Integração

A integração do Stripe foi **implementada com sucesso**! Aqui está o que foi configurado:

### 📦 Dependências Instaladas
- `stripe` (v18.2.1) - Backend
- `@stripe/stripe-js` (v7.3.1) - Frontend
- `@stripe/react-stripe-js` (v3.7.0) - Componentes React
- `micro` - Para processamento de webhooks

### 🔧 Arquivos Criados/Modificados

#### Backend (API Routes)
- `api/create-checkout-session.js` - Cria sessões de checkout
- `api/create-portal-session.js` - Portal do cliente para gerenciar assinaturas
- `api/stripe-webhook.js` - Webhook para processar eventos do Stripe

#### Frontend
- `src/lib/stripe.ts` - Configuração e funções do Stripe
- `src/components/pricing/PricingCards.tsx` - Integração com checkout
- `src/components/common/SubscriptionBlock.tsx` - Integração com checkout
- `src/pages/Success.tsx` - Página de sucesso do pagamento
- `src/App.tsx` - Stripe Provider configurado

#### Configuração
- `.env` - Variáveis de ambiente do Stripe

## 🚀 Próximos Passos para Ativar

### 1. Configurar Produtos no Stripe Dashboard

1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com)
2. Vá para **Products** → **Add Product**
3. Crie dois produtos:

#### Produto Trimestral
- **Name**: MedJourney Trimestral
- **Price**: R$119,90
- **Billing**: Recurring (every 3 months)
- **Anote o Price ID**: `price_xxxxx`

#### Produto Anual
- **Name**: MedJourney Anual  
- **Price**: R$397,90
- **Billing**: Recurring (yearly)
- **Anote o Price ID**: `price_xxxxx`

### 2. Atualizar Price IDs no Código

Substitua os placeholders nos seguintes arquivos:

```typescript
// src/components/pricing/PricingCards.tsx
priceId: 'price_trimestral', // → seu_price_id_trimestral
priceId: 'price_anual', // → seu_price_id_anual

// src/components/common/SubscriptionBlock.tsx
'price_anual', // → seu_price_id_anual
```

### 3. Configurar Webhook

1. No Stripe Dashboard, vá para **Developers** → **Webhooks**
2. Clique **Add endpoint**
3. **Endpoint URL**: `https://seu-dominio.com/api/stripe-webhook`
4. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. **Anote o Webhook Secret**: `whsec_xxxxx`

### 4. Atualizar Variáveis de Ambiente

Substitua os valores no arquivo `.env`:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_publica_real
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta_real
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret_real
```

### 5. Configurar URLs de Retorno

Atualize as URLs no arquivo `api/create-checkout-session.js`:

```javascript
const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://seu-dominio.com' // ← Seu domínio real
  : 'http://localhost:5173';
```

## 🔄 Funcionalidades Implementadas

### ✅ Checkout de Assinatura
- Botões funcionais nos cards de preço
- Redirecionamento para Stripe Checkout
- Suporte a códigos promocionais
- Coleta de endereço de cobrança

### ✅ Webhook Completo
- Validação de assinatura
- Processamento de eventos:
  - Pagamento confirmado
  - Assinatura criada/atualizada/cancelada
  - Pagamento falhou

### ✅ Portal do Cliente
- Gerenciamento de assinaturas
- Atualização de métodos de pagamento
- Cancelamento de assinaturas

### ✅ Páginas de Sucesso
- Confirmação de pagamento
- Redirecionamento para dashboard

## 🧪 Testando

### Cartões de Teste
- **Sucesso**: `4242 4242 4242 4242`
- **Falha**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

### Fluxo de Teste
1. Acesse `/pricing`
2. Clique em "Começar Agora" ou "Escolher Anual"
3. Preencha com cartão de teste
4. Confirme o pagamento
5. Verifique redirecionamento para `/success`

## 🔒 Segurança

- ✅ Validação de webhook com assinatura
- ✅ Chaves secretas em variáveis de ambiente
- ✅ Verificação de método HTTP
- ✅ Tratamento de erros

## 📝 Notas Importantes

1. **Ambiente de Teste**: Use sempre `pk_test_` e `sk_test_` para desenvolvimento
2. **Webhook**: Configure o endpoint correto no Stripe Dashboard
3. **Price IDs**: Substitua os placeholders pelos IDs reais dos produtos
4. **Domínio**: Atualize as URLs para seu domínio de produção

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs do console
2. Confirme as variáveis de ambiente
3. Teste com cartões de teste
4. Verifique a configuração do webhook no Stripe Dashboard 