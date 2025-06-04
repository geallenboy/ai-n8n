'use client';

import { SignIn } from "@clerk/nextjs"
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Shield, 
  Zap, 
  Users,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SignInPage() {
  const t = useTranslations('auth');
  const locale = useLocale();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center p-4">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* 左侧介绍 */}
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="h-4 w-4 mr-2" />
              {locale === 'zh' ? '欢迎回来' : 'Welcome Back'}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {locale === 'zh' ? '登录 AI n8n' : 'Sign in to AI n8n'}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {locale === 'zh' 
                ? '继续您的 n8n 自动化学习之旅，探索更多 AI 驱动的工作流解决方案' 
                : 'Continue your n8n automation learning journey and explore more AI-driven workflow solutions'
              }
            </p>
          </div>

          {/* 特色功能 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold">
                    {locale === 'zh' ? '安全保障' : 'Secure Access'}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {locale === 'zh' 
                    ? '企业级安全认证，保护您的数据安全' 
                    : 'Enterprise-grade security to protect your data'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold">
                    {locale === 'zh' ? '快速同步' : 'Quick Sync'}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {locale === 'zh' 
                    ? '多设备学习进度实时同步' 
                    : 'Real-time progress sync across devices'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold">
                    {locale === 'zh' ? '社区交流' : 'Community'}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {locale === 'zh' 
                    ? '加入活跃的开发者社区' 
                    : 'Join our active developer community'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold">
                    {locale === 'zh' ? '个性化推荐' : 'Personalized'}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {locale === 'zh' 
                    ? '基于学习进度的智能推荐' 
                    : 'Smart recommendations based on your progress'
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 统计数据 */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">
                  {locale === 'zh' ? '活跃用户' : 'Active Users'}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">500+</div>
                <div className="text-sm text-muted-foreground">
                  {locale === 'zh' ? '学习资源' : 'Resources'}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">99%</div>
                <div className="text-sm text-muted-foreground">
                  {locale === 'zh' ? '满意度' : 'Satisfaction'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧登录表单 */}
        <div className="flex justify-center lg:justify-end">
          <Card className="card-enhanced w-full max-w-md">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  {locale === 'zh' ? '登录账户' : 'Sign In'}
                </h2>
                <p className="text-muted-foreground">
                  {locale === 'zh' 
                    ? '使用您的账户继续学习' 
                    : 'Use your account to continue learning'
                  }
                </p>
              </div>
              
              <SignIn 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-0 bg-transparent",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200",
                    formButtonPrimary: "w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                    footerActionLink: "text-primary hover:text-primary/80"
                  }
                }}
              />
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {locale === 'zh' ? '还没有账户？' : "Don't have an account?"}{' '}
                  <Link href="/sign-up" className="text-primary hover:text-primary/80 font-medium">
                    {locale === 'zh' ? '立即注册' : 'Sign up now'}
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
