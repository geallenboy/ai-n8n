'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { 
  ArrowRight, 
  FileText, 
  Calendar, 
  User,
  Eye,
  MessageSquare,
  Heart,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { BlogType } from '../types';



interface FeaturedBlogsUIProps {
  blogs: BlogType[];
  locale: string;
}

// 基于索引生成确定性的"随机"数
const generateDeterministicValue = (index: number, seed: number, min: number, max: number) => {
  return ((index * seed) % (max - min + 1)) + min;
};

export default function FeaturedBlogsUI({ blogs,locale }: FeaturedBlogsUIProps) {
  const t = useTranslations('blogs');
  
  if (!blogs || blogs.length === 0) {
    return (
      <section className="py-24 bg-gradient-to-br from-purple-50/50 to-pink-50/30 dark:from-purple-900/20 dark:to-pink-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <p className="text-muted-foreground text-lg">{t('featured.loading')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-br from-purple-50/50 to-pink-50/30 dark:from-purple-900/20 dark:to-pink-900/10">
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
          {blogs.map((blog, index) => {
            // 使用基于索引的确定性值替代 Math.random()
            const viewCount = generateDeterministicValue(index, 13, 100, 1000);
            const commentCount = generateDeterministicValue(index, 19, 5, 50);
            const likeCount = generateDeterministicValue(index, 29, 10, 100);
            
            return (
              <Card key={blog.id} className="card-enhanced card-hover group relative overflow-hidden h-full flex flex-col">
                {/* 装饰性渐变 */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
                
                {/* 悬浮装饰 */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
                
                <CardHeader className="relative pt-6 flex-shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-purple-600 border-purple-200 dark:border-purple-800">
                      <FileText className="h-3 w-3 mr-1" />
                      {t('featured.article')}
                    </Badge>
                    {index < 2 && (
                      <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {t('featured.trending')}
                      </Badge>
                    )}
                  </div>
                  
                  <CardTitle className="text-xl line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-200">
                    {locale === 'zh' ? (blog.titleZh || blog.title) : blog.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-muted-foreground">
                    {(() => {
                      const summary = locale === 'zh' ? (blog.excerptZh || blog.excerpt || blog.summary) : (blog.excerpt || blog.summary);
                      return summary || t('featured.noDescription');
                    })()}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0 flex-1 flex flex-col">
                  <div className="flex-1 space-y-4">
                    {/* 作者和时间信息 */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{blog.author || t('featured.anonymous')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {blog.publishedAt 
                            ? formatDistanceToNow(new Date(blog.publishedAt), { 
                                addSuffix: true,
                                locale: zhCN 
                              })
                            : t('featured.recently')
                          }
                        </span>
                      </div>
                    </div>
                    
                    {/* 统计信息 */}
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{viewCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{commentCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{likeCount}</span>
                      </div>
                    </div>
                    
                    {/* 标签 */}
                    <div className="flex flex-wrap gap-2">
                      {['AI', 'n8n', '自动化'].map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                    
                  {/* 操作按钮 - 固定在底部 */}
                  <div className="mt-auto pt-4">
                    <Link href={`/front/blogs/${blog.id}`}>
                      <Button className="w-full btn-primary-gradient group/btn">
                        {t('featured.readMore')}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
                
                {/* 底部装饰光效 */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/front/blogs">
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