'use client';

import { SignUp } from "@clerk/nextjs"
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Rocket, 
  BookOpen, 
  Users,
  CheckCircle,
  Star,
  Target,
  Zap,
  Gift
} from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
  const t = useTranslations('auth');
  const locale = useLocale();

  const benefits = [
    {
      icon: BookOpen,
      title: locale === 'zh' ? '系统化学习' : 'Structured Learning',
      description: locale === 'zh' ? '从基础到高级的完整学习路径' : 'Complete learning path from basics to advanced'
    },
    {
      icon: Target,
      title: locale === 'zh' ? '实战项目' : 'Real Projects',
      description: locale === 'zh' ? '通过真实项目掌握 n8n 技能' : 'Master n8n skills through real projects'
    },
    {
      icon: Users,
      title: locale === 'zh' ? '社区支持' : 'Community Support',
      description: locale === 'zh' ? '加入活跃的开发者社区' : 'Join our active developer community'
    },
    {
      icon: Zap,
      title: locale === 'zh' ? 'AI 集成' : 'AI Integration',
      description: locale === 'zh' ? '学习最新的 AI 自动化技术' : 'Learn the latest AI automation technologies'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900/20 dark:to-purple-900/20 flex items-center justify-center p-4">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/30 to-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* 左侧介绍 */}
        <div className="space-y-8 order-2 lg:order-1">
          <div className="text-center lg:text-left">
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 text-green-600 dark:text-green-400 border-green-500/20">
              <Rocket className="h-4 w-4 mr-2" />
              {locale === 'zh' ? '开始您的旅程' : 'Start Your Journey'}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              {locale === 'zh' ? '加入 AI n8n' : 'Join AI n8n'}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {locale === 'zh' 
                ? '免费注册，开始您的 n8n 自动化学习之旅，掌握 AI 驱动的工作流技能' 
                : 'Sign up for free and start your n8n automation journey to master AI-driven workflow skills'
              }
            </p>
          </div>

          {/* 会员福利 */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold mb-4 flex items-center justify-center lg:justify-start">
                <Gift className="h-6 w-6 mr-2 text-primary" />
                {locale === 'zh' ? '会员专享福利' : 'Member Benefits'}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} className="card-enhanced">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">{benefit.title}</h4>
                          <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* 免费提醒 */}
          <Card className="border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <div>
                  <h4 className="font-semibold text-green-700 dark:text-green-300">
                    {locale === 'zh' ? '完全免费' : '100% Free'}
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {locale === 'zh' 
                      ? '所有核心功能永久免费，无隐藏费用' 
                      : 'All core features are free forever, no hidden costs'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 用户评价 */}
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                ))}
                <span className="text-sm font-medium">4.9/5</span>
              </div>
              <blockquote className="text-muted-foreground italic mb-3">
                "{locale === 'zh' 
                  ? 'AI n8n 让我快速掌握了自动化技能，教程质量很高！' 
                  : 'AI n8n helped me quickly master automation skills, excellent tutorial quality!'
                }"
              </blockquote>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">A</span>
                </div>
                <div>
                  <div className="text-sm font-medium">Alex Chen</div>
                  <div className="text-xs text-muted-foreground">
                    {locale === 'zh' ? '全栈开发者' : 'Full Stack Developer'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧注册表单 */}
        <div className="flex justify-center lg:justify-start order-1 lg:order-2">
          <Card className="card-enhanced w-full max-w-md">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  {locale === 'zh' ? '创建账户' : 'Create Account'}
                </h2>
                <p className="text-muted-foreground">
                  {locale === 'zh' 
                    ? '开始您的自动化学习之旅' 
                    : 'Start your automation learning journey'
                  }
                </p>
              </div>
              
              <SignUp 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-0 bg-transparent",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200",
                    formButtonPrimary: "w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700",
                    footerActionLink: "text-primary hover:text-primary/80"
                  }
                }}
              />
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {locale === 'zh' ? '已有账户？' : 'Already have an account?'}{' '}
                  <Link href="/sign-in" className="text-primary hover:text-primary/80 font-medium">
                    {locale === 'zh' ? '立即登录' : 'Sign in now'}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
