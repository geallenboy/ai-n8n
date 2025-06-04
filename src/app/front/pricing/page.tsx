'use client';

import React from 'react';
import PricingSection from '@/components/payment/pricing-section';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Shield, CheckCircle, Star } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 页面头部 */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <Badge className="mb-4 px-4 py-2 bg-white/10 text-white border-white/20">
              <CreditCard className="h-4 w-4 mr-2" />
              订阅计划
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              选择适合您的订阅计划
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
              从免费版开始，随时升级到更高级的功能，解锁更多自动化可能性
            </p>
            <div className="flex items-center justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm">安全支付</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm">随时取消</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-sm">14天免费试用</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 定价组件 */}
      <div className="relative -mt-12">
        <PricingSection />
      </div>

      {/* FAQ部分 */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              常见问题
            </h2>
            <p className="text-lg text-muted-foreground">
              关于订阅和支付的常见问题解答
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-card rounded-lg p-6 border border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                我可以随时取消订阅吗？
              </h3>
              <p className="text-muted-foreground">
                是的，您可以随时取消订阅。取消后，您仍可以使用付费功能直到当前计费周期结束。
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 border border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                支持哪些支付方式？
              </h3>
              <p className="text-muted-foreground">
                我们支持所有主要的信用卡和借记卡，包括 Visa、Mastercard、American Express 等。
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 border border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                年付计划有什么优势？
              </h3>
              <p className="text-muted-foreground">
                选择年付计划可以节省20%的费用，相当于免费使用2个多月。同时享受更稳定的服务体验。
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 border border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                免费版有什么限制？
              </h3>
              <p className="text-muted-foreground">
                免费版可以访问10个案例、5个教程模块和3篇博客文章。升级到付费版本可以解锁所有内容和高级功能。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 