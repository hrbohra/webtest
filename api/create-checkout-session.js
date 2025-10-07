// Vercel serverless function (Node) — uses STRIPE_SECRET_KEY from environment
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Server-side copy of products — keep in sync with public/products.js
const PRODUCTS = [
  { id: 'p1', name: 'Vanguard Leather Jacket', price: 32500, currency: 'gbp' },
  { id: 'p2', name: 'Roadster Helm', price: 14900, currency: 'gbp' },
  { id: 'p3', name: 'Iron Boots', price: 11900, currency: 'gbp' },
  { id: 'p4', name: 'Chain Wallet', price: 3900, currency: 'gbp' },
  { id: 'p5', name: 'Grind Gloves', price: 5900, currency: 'gbp' },
  { id: 'p6', name: 'Bandana Pack', price: 1200, currency: 'gbp' },
  { id: 'p7', name: 'Rider Tee — Black', price: 2500, currency: 'gbp' },
  { id: 'p8', name: 'Torque Sunglasses', price: 8500, currency: 'gbp' },
  { id: 'p9', name: 'Trail Backpack', price: 9900, currency: 'gbp' },
  { id: 'p10', name: 'Exhaust Keychain', price: 700, currency: 'gbp' }
];

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try{
    const { items } = req.body;
    if(!items || !Array.isArray(items) || items.length===0) return res.status(400).json({ error: 'No items' });

    const line_items = items.map(it => {
      const prod = PRODUCTS.find(p => p.id === it.id);
      if(!prod) throw new Error('Invalid product ' + it.id);
      return {
        price_data: {
          currency: prod.currency,
          product_data: { name: prod.name },
          unit_amount: prod.price
        },
        quantity: it.quantity
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${getOrigin(req)}/success.html`,
      cancel_url: `${getOrigin(req)}/cart.html`
    });

    res.json({ url: session.url });
  } catch(err){
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

function getOrigin(req){
  // Use origin header when available, otherwise build from host
  const origin = req.headers.origin || (`https://${req.headers.host}`);
  return origin.replace(/:\d+$/, '');
}
