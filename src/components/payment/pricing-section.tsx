'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Check, 
  CreditCard, 
  Zap, 
  Star, 
  Crown,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@clerk/nextjs';

// 安全获取Stripe Publishable Key
function getStripePublishableKey() {
  try {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
      throw new Error('Stripe configuration error');
    }
    return key;
  } catch (error) {
    console.error('Error getting Stripe publishable key:', error);
    throw error;
  }
}

// 初始化Stripe（带错误处理）
let stripePromise: Promise<any> | null = null;

function getStripePromise() {
  if (!stripePromise) {
    try {
      const publishableKey = getStripePublishableKey();
      stripePromise = loadStripe(publishableKey);
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
      stripePromise = Promise.reject(error);
    }
  }
  return stripePromise;
}

interface PricingPlan {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  featuresZh: string[];
  isPopular?: boolean;
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
  icon: React.ReactNode;
  color: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    nameZh: '免费版',
    description: 'Perfect for getting started',
    descriptionZh: '适合初学者使用',
    priceMonthly: 0,
    priceYearly: 0,
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
    ],
    icon: <Zap className="h-6 w-6" />,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'pro',
    name: 'Pro',
    nameZh: '专业版',
    description: 'For serious automation enthusiasts',
    descriptionZh: '适合自动化爱好者',
    priceMonthly: 29,
    priceYearly: 290,
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
    ],
    isPopular: true,
    stripePriceIdMonthly: 'price_pro_monthly', // 需要从Stripe获取实际的price ID
    stripePriceIdYearly: 'price_pro_yearly',
    icon: <Star className="h-6 w-6" />,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    nameZh: '企业版',
    description: 'For teams and organizations',
    descriptionZh: '适合团队和企业',
    priceMonthly: 99,
    priceYearly: 990,
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
    ],
    stripePriceIdMonthly: 'price_enterprise_monthly',
    stripePriceIdYearly: 'price_enterprise_yearly',
    icon: <Crown className="h-6 w-6" />,
    color: 'from-orange-500 to-orange-600'
  }
];

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const { isSignedIn, userId } = useAuth();

  // 检查Stripe配置
  React.useEffect(() => {
    try {
      getStripePublishableKey();
    } catch (error) {
      setStripeError('Stripe配置错误，支付功能暂时不可用');
    }
  }, []);

  const handleSubscribe = async (plan: PricingPlan) => {
    if (!isSignedIn) {
      toast.error('请先登录账户');
      return;
    }

    if (plan.id === 'free') {
      toast.info('您已在使用免费版');
      return;
    }

    if (stripeError) {
      toast.error(stripeError);
      return;
    }

    setLoading(plan.id);

    try {
      const priceId = isYearly ? plan.stripePriceIdYearly : plan.stripePriceIdMonthly;
      
      if (!priceId) {
        toast.error('价格配置错误');
        return;
      }

      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          planName: plan.name,
          isYearly,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      if (!sessionId) {
        throw new Error('Failed to create checkout session');
      }

      const stripe = await getStripePromise();
      if (!stripe) {
        throw new Error('Stripe not loaded');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('支付页面创建失败，请稍后重试');
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50/50 to-blue-50/30 dark:from-gray-900/50 dark:to-blue-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary border-primary/20">
            <CreditCard className="h-4 w-4 mr-2" />
            订阅计划
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            选择适合您的
            <span className="gradient-text ml-2">订阅计划</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            从免费版开始，随时升级到更高级的功能
          </p>
          
          {stripeError && (
            <div className="max-w-md mx-auto mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-medium">支付功能配置中</p>
                  <p>{stripeError}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* 年度/月度切换 */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <Label htmlFor="billing-switch" className={`text-base ${!isYearly ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
              按月计费
            </Label>
            <Switch
              id="billing-switch"
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <Label htmlFor="billing-switch" className={`text-base ${isYearly ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
              按年计费
            </Label>
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              <Sparkles className="h-3 w-3 mr-1" />
              年付省20%
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => {
            const price = isYearly ? plan.priceYearly : plan.priceMonthly;
            const originalYearlyPrice = plan.priceMonthly * 12;
            const yearlyDiscount = originalYearlyPrice - plan.priceYearly;
            
            return (
              <Card key={plan.id} className={`relative card-enhanced card-hover ${plan.isPopular ? 'border-primary shadow-xl scale-105' : ''}`}>
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      最受欢迎
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white`}>
                    {plan.icon}
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-foreground mb-2">
                    {plan.nameZh}
                  </CardTitle>
                  
                  <p className="text-muted-foreground mb-6">
                    {plan.descriptionZh}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold gradient-text">
                        ¥{price}
                      </span>
                      {plan.id !== 'free' && (
                        <span className="text-muted-foreground ml-2">
                          /{isYearly ? '年' : '月'}
                        </span>
                      )}
                    </div>
                    
                    {plan.id !== 'free' && isYearly && yearlyDiscount > 0 && (
                      <p className="text-sm text-green-600">
                        年付节省 ¥{yearlyDiscount}
                      </p>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <Button
                    className={`w-full mb-8 ${plan.isPopular ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={plan.isPopular ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => handleSubscribe(plan)}
                    disabled={loading === plan.id || stripeError !== null}
                  >
                    {loading === plan.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        处理中...
                      </>
                    ) : (
                      <>
                        {plan.id === 'free' ? '当前计划' : '立即订阅'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">功能包含：</h4>
                    <ul className="space-y-3">
                      {plan.featuresZh.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* 底部说明 */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            所有计划都包含 14 天免费试用期，无需绑定信用卡
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>随时取消</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>安全支付</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>24/7 支持</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 