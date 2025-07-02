import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const { email } = await req.json(); // ✅ get email from body

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email, // ✅ autofill checkout form
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'TicketSolver Legal Service',
            },
            unit_amount: 9999, // $50.00
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('❌ Stripe error:', err.message || err);
    return NextResponse.json({ error: 'Stripe session creation failed' }, { status: 500 });
  }
}
