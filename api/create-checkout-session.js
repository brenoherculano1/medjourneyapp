import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, planType } = req.body;

    // Validar se o priceId foi fornecido
    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    // Configurar URLs baseadas no ambiente
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://medjourney.com' 
      : 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      metadata: {
        planType: planType || 'unknown',
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_email: req.body.customerEmail, // Se disponível
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 