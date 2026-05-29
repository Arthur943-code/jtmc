import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  const { productId, title, price } = await req.json()

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: { name: title },
        unit_amount: Math.round(price * 100),
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/catalogue?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/catalogue?canceled=true`,
  })

  return Response.json({ url: session.url })
}