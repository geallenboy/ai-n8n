'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { 
  ArrowRight, 
  BookOpen, 
  Clock, 
  Star, 
  Play,
  Users,
} from 'lucide-react';
import { TutorialModuleType } from '../types';



interface FeaturedTutorialsUIProps {
  tutorials: TutorialModuleType[];
  locale: string;
}

const difficultyColors = {
  beginner: 'from-green-500 to-emerald-500',
  intermediate: 'from-yellow-500 to-orange-500',
  advanced: 'from-red-500 to-pink-500'
};

const difficultyLabels = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级'
};

// 基于索引生成确定性的"随机"数
const generateDeterministicValue = (index: number, seed: number, min: number, max: number) => {
  return ((index * seed) % (max - min + 1)) + min;
};

export default function FeaturedTutorialsUI({ tutorials,locale }: FeaturedTutorialsUIProps) {
  const t = useTranslations('tutorials');
  
  if (!tutorials || tutorials.length === 0) {
    return (
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <p className="text-muted-foreground text-lg">{t('featured.loading')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-background">
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
          {tutorials.map((tutorial, index) => {
            // 随机分配难度以演示
            const difficultyKeys = Object.keys(difficultyColors) as Array<keyof typeof difficultyColors>;
            const randomDifficulty = difficultyKeys[index % difficultyKeys.length];
            
            // 使用基于索引的确定性值替代 Math.random()
            const userCount = generateDeterministicValue(index, 17, 50, 200);
            const progressPercent = generateDeterministicValue(index, 23, 0, 100);
            
            return (
              <Card key={tutorial.id} className="card-enhanced card-hover group relative overflow-hidden h-full flex flex-col">
                {/* 装饰性元素 */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                
                {/* 头部装饰 */}
                <div className="h-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>
                
                <CardHeader className="relative pb-4 flex-shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <Badge 
                      variant="secondary" 
                      className={`bg-gradient-to-r ${difficultyColors[randomDifficulty]} text-white border-0`}
                    >
                      {difficultyLabels[randomDifficulty]}
                    </Badge>
                    {index < 2 && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        {t('featured.recommended')}
                      </Badge>
                    )}
                  </div>
                  
                  <CardTitle className="text-xl line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-200">
                    {locale === 'zh' ? (tutorial.titleZh || tutorial.title) : tutorial.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-muted-foreground">
                    {(() => {
                      const description = locale === 'zh' ? (tutorial.descriptionZh || tutorial.description) : tutorial.description;
                      const content = locale === 'zh' ? (tutorial.contentZh || tutorial.content) : tutorial.content;
                      
                      if (description) {
                        return description.length > 100 ? description.substring(0, 100) + '...' : description;
                      } else if (content) {
                        return content.length > 100 ? content.substring(0, 100) + '...' : content;
                      } else {
                        return t('featured.noDescription');
                      }
                    })()}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0 flex-1 flex flex-col">
                  <div className="flex-1">
                    {/* 统计信息 */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{tutorial.estimatedTimeMinutes || 30} {t('featured.minutes')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{userCount}</span>
                      </div>
                    </div>
                  </div>
                    
                  {/* 操作按钮 - 固定在底部 */}
                  <div className="mt-auto">
                    <Link href={`/front/tutorial/${tutorial.id}`}>
                      <Button className="w-full btn-primary-gradient group/btn">
                        <Play className="mr-2 h-4 w-4" />
                        {t('featured.startLearning')}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
                
                {/* 底部装饰 */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/front/tutorial">
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