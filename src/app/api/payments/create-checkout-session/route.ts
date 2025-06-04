import { NextRequest, NextResponse } from 'next/server';
import { getServerStripe } from '@/lib/stripe';
import { auth } from '@clerk/nextjs/server';

// 移除Edge Runtime配置，因为与PostgreSQL驱动不兼容
// export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { priceId, planName, isYearly = false } = await req.json();

    if (!priceId || !planName) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const stripe = getServerStripe();

    // 创建或获取Stripe客户
    const customers = await stripe.customers.search({
      query: `metadata["userId"]:"${userId}"`,
    });

    let customerId: string;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        metadata: {
          userId: userId,
        },
      });
      customerId = customer.id;
    }

    // 创建checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/front/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?canceled=true`,
      metadata: {
        userId: userId,
        planName: planName,
        isYearly: isYearly.toString(),
      },
    });

    return NextResponse.json({ sessionId: session.id });
    
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 