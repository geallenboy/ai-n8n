import Stripe from 'stripe';

// 服务端 Stripe 配置 - 只在服务端初始化
let stripe: Stripe | null = null;

export const getServerStripe = (): Stripe => {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
    }
    
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-05-28.basil',
      typescript: true,
    });
  }
  return stripe;
};

// 客户端使用的 Publishable Key
export const getStripePublishableKey = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set in environment variables');
  }
  return key;
};

// 订阅计划配置
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    nameZh: '免费版',
    priceMonthly: 0,
    maxUseCases: 10,
    maxTutorials: 5,
    maxBlogs: 3,
    features: [
      'Access to 10 use cases',
      '5 tutorial modules',
      '3 blog posts',
      'Community support',
      'Basic automation templates'
    ],
    featuresZh: [
      '访问10个案例',
      '5个教程模块',
      '3篇博客文章',
      '社区支持',
      '基础自动化模板'
    ]
  },
  PRO: {
    name: 'Pro',
    nameZh: '专业版',
    priceMonthly: 29,
    priceYearly: 290,
    maxUseCases: -1,
    maxTutorials: -1,
    maxBlogs: -1,
    features: [
      'Unlimited use cases access',
      'All tutorial modules',
      'All blog posts',
      'Priority support',
      'Advanced automation templates',
      'AI workflow analysis',
      'Custom workflow templates'
    ],
    featuresZh: [
      '无限制案例访问',
      '所有教程模块',
      '所有博客文章',
      '优先支持',
      '高级自动化模板',
      'AI工作流分析',
      '自定义工作流模板'
    ]
  },
  ENTERPRISE: {
    name: 'Enterprise',
    nameZh: '企业版',
    priceMonthly: 99,
    priceYearly: 990,
    maxUseCases: -1,
    maxTutorials: -1,
    maxBlogs: -1,
    features: [
      'Everything in Pro',
      'White-label solution',
      'Custom integrations',
      'Dedicated support',
      'Advanced analytics',
      'Team management',
      'Custom training sessions'
    ],
    featuresZh: [
      '包含专业版所有功能',
      '白标解决方案',
      '自定义集成',
      '专属支持',
      '高级分析',
      '团队管理',
      '定制培训课程'
    ]
  }
};

// Stripe Webhook事件类型
export const STRIPE_WEBHOOK_EVENTS = {
  CUSTOMER_SUBSCRIPTION_CREATED: 'customer.subscription.created',
  CUSTOMER_SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  CUSTOMER_SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  INVOICE_PAYMENT_SUCCEEDED: 'invoice.payment_succeeded',
  INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
  PAYMENT_INTENT_SUCCEEDED: 'payment_intent.succeeded',
  PAYMENT_INTENT_PAYMENT_FAILED: 'payment_intent.payment_failed',
} as const; 