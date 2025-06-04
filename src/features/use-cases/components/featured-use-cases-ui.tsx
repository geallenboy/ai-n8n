'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { ArrowRight, Star, Eye, Target, Clock, Play, Zap } from 'lucide-react';
import { UseCaseType } from '../types';

interface FeaturedUseCasesUIProps {
  useCases: UseCaseType[];
  locale: string;
}

export default function FeaturedUseCasesUI({ useCases, locale }: FeaturedUseCasesUIProps) {
  const t = useTranslations('useCases');
 
  if (!useCases || useCases.length === 0) {
    return (
      <section className="py-24 bg-gradient-to-br from-gray-50/50 to-blue-50/30 dark:from-gray-900/50 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-white" />
            </div>
            <p className="text-muted-foreground text-lg">{t('featured.loading')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50/50 to-blue-50/30 dark:from-gray-900/50 dark:to-blue-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          
          <h2 className="subHeading mb-6">
            {t('featured.title')}
          </h2>
          <p className="subText">
            {t('featured.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {useCases.map((useCase, index) => {
            const title = locale === 'zh' ? useCase.titleZh || useCase.title : useCase.title;
            const description = locale === 'zh' ? useCase.summaryZh || useCase.summary : useCase.summary;
            
            return (
              <Card key={useCase.id} className="card-enhanced card-hover group overflow-hidden h-full flex flex-col">
                {/* 卡片头部图片区域 */}
                <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                  
                  {/* 装饰元素 */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                  
                  {/* 推荐标签 */}
                  <div className="absolute top-4 left-4">
                    {index < 3 && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        {t('featured.recommended', { defaultValue: '推荐' })}
                      </Badge>
                    )}
                  </div>
                  
                  {/* 中心图标 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                  </CardTitle>
                </CardHeader>

                {/* 弹性内容区域 */}
                <CardContent className="pt-0 flex-1 flex flex-col">
                  <CardDescription className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                    {description || t('featured.noDescription')}
                  </CardDescription>

                  {/* 统计信息 */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{Math.floor(Math.random() * 1000) + 100}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {useCase.publishedAt 
                            ? formatDistanceToNow(new Date(useCase.publishedAt), { 
                                addSuffix: true,
                                locale: locale === 'zh' ? zhCN : enUS
                              })
                            : t('featured.recently', { defaultValue: '最近' })
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 - 固定在底部 */}
                  <div className="mt-auto">
                    <Link href={`/front/use-cases/${useCase.id}`}>
                      <Button className="w-full btn-primary-gradient group/btn">
                        <Play className="mr-2 h-4 w-4" />
                        {t('featured.viewDetails')}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/front/use-cases">
            <Button size="lg" variant="outline" className="min-w-[200px] group">
              {t('featured.viewAll')}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
} 