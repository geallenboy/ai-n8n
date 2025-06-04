'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Users, 
  Globe, 
  Zap, 
  BookOpen,
  Heart,
  Code,
  Rocket,
  Shield,
  Lightbulb,
  Github,
  Mail,
  MessageCircle,
  Star,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  Sparkles
} from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('about');
  const locale = useLocale();

  const features = [
    {
      icon: Zap,
      title: t('coreFeatures.automation.title'),
      description: t('coreFeatures.automation.description'),
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: BookOpen,
      title: t('coreFeatures.tutorials.title'),
      description: t('coreFeatures.tutorials.description'),
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Target,
      title: t('coreFeatures.cases.title'),
      description: t('coreFeatures.cases.description'),
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Users,
      title: t('coreFeatures.community.title'),
      description: t('coreFeatures.community.description'),
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const stats = [
    { label: t('stats.users'), value: '10,000+', icon: Users, color: 'text-blue-600' },
    { label: t('stats.useCases'), value: '500+', icon: Target, color: 'text-green-600' },
    { label: t('stats.tutorials'), value: '100+', icon: BookOpen, color: 'text-purple-600' },
    { label: t('stats.discussions'), value: '1,000+', icon: MessageCircle, color: 'text-orange-600' }
  ];

  const technologies = [
    { name: 'Next.js', description: t('technologies.nextjs'), icon: '⚛️' },
    { name: 'TypeScript', description: t('technologies.typescript'), icon: '📘' },
    { name: 'Tailwind CSS', description: t('technologies.tailwind'), icon: '🎨' },
    { name: 'n8n', description: t('technologies.n8n'), icon: '🔗' },
    { name: 'PostgreSQL', description: t('technologies.postgresql'), icon: '🗄️' },
    { name: 'Vercel', description: t('technologies.vercel'), icon: '▲' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 页面头部 */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <Badge className="mb-4 px-4 py-2 bg-white/10 text-white border-white/20">
              <Heart className="h-4 w-4 mr-2" />
              {t('title')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('subtitle')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-indigo-100">
              {t('description')}
            </p>
            <div className="flex items-center justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">{t('features.openSource')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm">{t('features.community')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm">{t('features.innovation')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 平台统计 */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('stats.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('stats.description')}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="card-enhanced card-hover text-center group">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold gradient-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 核心特色 */}
        <section className="mb-20">
          <div className="text-center mb-12">
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('coreFeatures.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('coreFeatures.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-enhanced card-hover group relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color}`}></div>
                <CardHeader className="relative">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors duration-200">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 技术栈 */}
        <section className="mb-20">
          <div className="text-center mb-12">
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('technologies.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('technologies.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, index) => (
              <Card key={index} className="card-enhanced card-hover group">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{tech.icon}</div>
                  <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                    {tech.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {tech.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 社区参与 */}
        <section className="mb-20">
          <Card className="card-enhanced bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/10">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                加入我们的社区
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                与全球 n8n 爱好者一起交流学习，分享经验，共同推动自动化技术的发展
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="min-w-[150px] group">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub 仓库
                </Button>
                <Button variant="outline" size="lg" className="min-w-[150px] group">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  加入讨论
                </Button>
                <Button variant="outline" size="lg" className="min-w-[150px] group">
                  <Mail className="h-4 w-4 mr-2" />
                  联系我们
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 未来规划 */}
        <section>
          <div className="text-center mb-12">
           
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              展望未来
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              我们将继续完善平台功能，扩展学习资源，建设更强大的社区生态
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: '更多教程', desc: '涵盖更多应用场景' },
              { icon: Target, title: '案例库扩充', desc: '持续添加实用案例' },
              { icon: Globe, title: '多语言支持', desc: '服务全球用户' },
              { icon: Lightbulb, title: 'AI 助手', desc: '智能学习推荐' }
            ].map((item, index) => (
              <Card key={index} className="card-enhanced card-hover group text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 