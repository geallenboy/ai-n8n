import { pgTable, uuid, varchar, decimal, text, timestamp, integer, boolean, json } from 'drizzle-orm/pg-core';

// 订阅计划表
export const subscriptionPlans = pgTable('subscription_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  nameZh: varchar('name_zh', { length: 100 }),
  description: text('description'),
  descriptionZh: text('description_zh'),
  priceMonthly: decimal('price_monthly', { precision: 10, scale: 2 }).notNull(),
  priceYearly: decimal('price_yearly', { precision: 10, scale: 2 }),
  features: json('features').$type<string[]>().notNull().default([]),
  featuresZh: json('features_zh').$type<string[]>().default([]),
  maxUseCases: integer('max_use_cases').default(-1), // -1 表示无限制
  maxTutorials: integer('max_tutorials').default(-1),
  maxBlogs: integer('max_blogs').default(-1),
  stripePriceId: varchar('stripe_price_id', { length: 255 }),
  stripePriceIdYearly: varchar('stripe_price_id_yearly', { length: 255 }),
  isActive: boolean('is_active').default(true),
  isPopular: boolean('is_popular').default(false),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 用户订阅表
export const userSubscriptions = pgTable('user_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  planId: uuid('plan_id').notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  status: varchar('status', { length: 50 }).notNull().default('active'), // active, canceled, expired, past_due
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 支付记录表
export const paymentRecords = pgTable('payment_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  subscriptionId: uuid('subscription_id'),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  stripeInvoiceId: varchar('stripe_invoice_id', { length: 255 }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('usd'),
  status: varchar('status', { length: 50 }).notNull(), // succeeded, failed, pending, refunded
  paymentMethod: varchar('payment_method', { length: 50 }), // card, alipay, wechat_pay
  description: text('description'),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 用户使用限额记录表
export const userUsageLimits = pgTable('user_usage_limits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique(),
  subscriptionId: uuid('subscription_id'),
  usedUseCases: integer('used_use_cases').default(0),
  usedTutorials: integer('used_tutorials').default(0),
  usedBlogs: integer('used_blogs').default(0),
  resetDate: timestamp('reset_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}); 