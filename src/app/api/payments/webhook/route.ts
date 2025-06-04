import { NextRequest, NextResponse } from 'next/server';
import { getServerStripe, STRIPE_WEBHOOK_EVENTS } from '@/lib/stripe';
import { db } from '@/drizzle';
import { userSubscriptions, paymentRecords } from '@/drizzle/schemas';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

// 移除Edge Runtime配置，因为与PostgreSQL驱动不兼容
// export const runtime = 'edge';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;
    const stripe = getServerStripe();

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('Received webhook event:', event.type);

    switch (event.type) {
      case STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_CREATED:
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_UPDATED:
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_DELETED:
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case STRIPE_WEBHOOK_EVENTS.INVOICE_PAYMENT_SUCCEEDED:
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case STRIPE_WEBHOOK_EVENTS.INVOICE_PAYMENT_FAILED:
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const stripe = getServerStripe();
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    
    if (!customer || customer.deleted) return;

    const userId = (customer as Stripe.Customer).metadata?.userId;
    if (!userId) return;

    // 获取订阅计划信息
    const priceId = subscription.items.data[0].price.id;
    
    // 这里需要根据价格ID获取计划ID，暂时用默认值
    const planId = 'default-plan-id'; // 需要从数据库中查询

    await db.insert(userSubscriptions).values({
      userId: userId,
      planId: planId,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    });

    console.log('Subscription created for user:', userId);
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    await db
      .update(userSubscriptions)
      .set({
        status: subscription.status,
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
        updatedAt: new Date(),
      })
      .where(eq(userSubscriptions.stripeSubscriptionId, subscription.id));

    console.log('Subscription updated:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    await db
      .update(userSubscriptions)
      .set({
        status: 'canceled',
        updatedAt: new Date(),
      })
      .where(eq(userSubscriptions.stripeSubscriptionId, subscription.id));

    console.log('Subscription canceled:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const stripe = getServerStripe();
    const customer = await stripe.customers.retrieve(invoice.customer as string);
    
    if (!customer || customer.deleted) return;

    const userId = (customer as Stripe.Customer).metadata?.userId;
    if (!userId) return;

    // 获取相关订阅
    const [subscription] = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.stripeCustomerId, invoice.customer as string))
      .limit(1);

    await db.insert(paymentRecords).values({
      userId: userId,
      subscriptionId: subscription?.id,
      stripeInvoiceId: invoice.id,
      amount: ((invoice as any).amount_paid / 100).toString(),
      currency: invoice.currency,
      status: 'succeeded',
      paymentMethod: 'card',
      description: `Payment for ${(invoice as any).subscription}`,
    });

    console.log('Payment succeeded for user:', userId);
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const stripe = getServerStripe();
    const customer = await stripe.customers.retrieve(invoice.customer as string);
    
    if (!customer || customer.deleted) return;

    const userId = (customer as Stripe.Customer).metadata?.userId;
    if (!userId) return;

    // 获取相关订阅
    const [subscription] = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.stripeCustomerId, invoice.customer as string))
      .limit(1);

    await db.insert(paymentRecords).values({
      userId: userId,
      subscriptionId: subscription?.id,
      stripeInvoiceId: invoice.id,
      amount: ((invoice as any).amount_due / 100).toString(),
      currency: invoice.currency,
      status: 'failed',
      paymentMethod: 'card',
      description: `Failed payment for ${(invoice as any).subscription}`,
    });

    console.log('Payment failed for user:', userId);
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
} 