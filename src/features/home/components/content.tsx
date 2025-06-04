'use client';
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";
import FeaturedUseCasesUI from "@/features/use-cases/components/featured-use-cases-ui";
import FeaturedTutorialsUI from "@/features/tutorial/components/featured-tutorials-ui";
import FeaturedBlogsUI from "@/features/blogs/components/featured-blogs-ui";
import PricingSection from "@/components/payment/pricing-section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, BookOpen, Lightbulb, Users, Clock, Sparkles, TrendingUp, Star, Zap, Target, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UseCaseType } from "@/features/use-cases";
import { TutorialModuleType } from "@/features/tutorial";
import { BlogType } from "@/features/blogs";


interface ContentProps {
  stats: {
    totalUseCases: number;
    totalBlogs: number;
    totalTutorials: number;
    publishedUseCases: number;
    publishedBlogs: number;
  } | null;
  locale: string;
  useCases: UseCaseType[];
  tutorials: TutorialModuleType[];
  blogs: BlogType[];
}

const Content = ({ stats, useCases, tutorials, blogs,locale }: ContentProps) => {
    const t = useTranslations('home.homepage');

  return (
    <>
    {/* 统计数据展示 */}
    {stats && (
      <section className="py-20 bg-gradient-to-br from-gray-50/50 to-blue-50/30 dark:from-gray-900/50 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
           
            <h2 className="subHeading mb-6">
              {t('stats.subtitle')}
            </h2>
            <p className="subText">
              {t('stats.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="card-enhanced card-hover group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">
                  {stats.publishedUseCases}
                </div>
                <div className="text-sm font-medium text-foreground mb-2">{t('stats.useCases')}</div>
                <div className="text-xs text-muted-foreground">
                  {t('stats.totalCases', { count: stats.totalUseCases })}
                </div>
                <div className="mt-4 flex items-center justify-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-xs text-muted-foreground ml-1">{t('stats.quality')}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced card-hover group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">
                  {stats.publishedBlogs}
                </div>
                <div className="text-sm font-medium text-foreground mb-2">{t('stats.blogs')}</div>
                <div className="text-xs text-muted-foreground">
                  {t('stats.totalBlogs', { count: stats.totalBlogs })}
                </div>
                <div className="mt-4 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-xs text-muted-foreground ml-1">{t('stats.updates')}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced card-hover group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">
                  {stats.totalTutorials}
                </div>
                <div className="text-sm font-medium text-foreground mb-2">{t('stats.tutorials')}</div>
                <div className="text-xs text-muted-foreground">
                  {t('stats.systemPath')}
                </div>
                <div className="mt-4 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span className="text-xs text-muted-foreground ml-1">{t('stats.structured')}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced card-hover group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">
                  500+
                </div>
                <div className="text-sm font-medium text-foreground mb-2">{t('stats.users')}</div>
                <div className="text-xs text-muted-foreground">
                  {t('stats.growing')}
                </div>
                <div className="mt-4 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-muted-foreground ml-1">{t('stats.growth')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )}

    {/* 特色功能介绍 */}
    {/* <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          
          <h2 className="subHeading mb-6">
            {t('features.subtitle')}
          </h2>
          <p className="subText">
            {t('features.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center group">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-xl">
                <Target className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-6">
              {t('features.professional.title')}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {t('features.professional.description')}
            </p>
          </div>

          <div className="text-center group">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-xl">
                <Zap className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                <CheckCircle className="h-3 w-3 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-6">
              {t('features.efficient.title')}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {t('features.efficient.description')}
            </p>
          </div>

          <div className="text-center group">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-xl">
                <TrendingUp className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <Star className="h-3 w-3 text-white fill-current" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-6">
              {t('features.updated.title')}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {t('features.updated.description')}
            </p>
          </div>
        </div>
      </div>
    </section> */}
   
    <FeaturedUseCasesUI useCases={useCases} locale={locale} />
    <FeaturedTutorialsUI tutorials={tutorials} locale={locale} />
    <FeaturedBlogsUI blogs={blogs} locale={locale} />
    {/* Stripe支付模块 */}
    {/* <PricingSection /> */}
   

    {/* Call to Action */}
    <section className="relative py-24 overflow-hidden">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600"></div>
      
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge className="mb-6 px-4 py-2 bg-white/10 text-white border-white/20">
          <Sparkles className="h-4 w-4 mr-2" />
          {t('cta.subtitle')}
        </Badge>
        
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
          {t('cta.title')}
        </h2>
        
        <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
          {t('cta.description')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/front/tutorial">
            <Button size="lg" variant="outline" className="min-w-[200px] group">
              {t('tutorials.viewAll')}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/front/use-cases">
            <Button 
              size="lg" 
              variant="outline"
              className="min-w-[200px] h-14 text-lg font-semibold text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/50 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              {t('cta.exploreCases')}
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
        </div>

        {/* 底部特性提示 */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-white/80">
          <div className="flex items-center justify-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-sm">{t('cta.features.free')}</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-sm">{t('cta.features.professional')}</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-sm">{t('cta.features.community')}</span>
          </div>
        </div>
      </div>
    </section>
  </>
  );
};

export default Content;
