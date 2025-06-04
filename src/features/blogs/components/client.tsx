'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { useTranslations, useLocale } from 'next-intl';
import { 
  User, 
  Calendar, 
  Clock,
  BookOpen,
  FileText,
  ArrowLeft,
  Eye,
  Heart,
  Bookmark,
} from 'lucide-react';

import { AdvancedMarkdownRenderer } from '@/features/common';

import InteractionButtons from '@/features/common/components/interaction-buttons';

interface BlogDetailClientProps {
  blog: any;
  blogId: string;
}


export default function BlogDetailClient({ blog, blogId }: BlogDetailClientProps) {
  const t = useTranslations('blogs');
  const t2 = useTranslations('tutorials');
  
  const locale = useLocale();
  const dateLocale = locale === 'zh' ? zhCN : enUS;
  
  const [stats, setStats] = useState({ 
    views: 0, 
    favorites: 0, 
    likes: 0
  });
  const [imageError, setImageError] = useState(false);

  // 获取真实的统计数据
  const fetchStats = async () => {
    try {
      // 获取点赞数据
      const likesResponse = await fetch(`/api/likes?resourceType=blog&resourceId=${blogId}`);
      if (likesResponse.ok) {
        const likesData = await likesResponse.json();
        setStats(prev => ({ ...prev, likes: Number(likesData.count) || 0 }));
      }

      // 获取收藏数据
      const favoritesResponse = await fetch(`/api/favorites?resourceType=blog&resourceId=${blogId}`);
      if (favoritesResponse.ok) {
        const favoritesData = await favoritesResponse.json();
        setStats(prev => ({ ...prev, favorites: Number(favoritesData.count) || prev.favorites }));
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
      // 如果API失败，保持使用确定性数据
    }
  };

  useEffect(() => {
    // 只有当blogId是有效UUID时才获取数据
    const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(blogId);
    if (isValidUuid) {
      fetchStats();
    }
  }, [blogId]);

  // 处理交互按钮操作后的数据刷新
  const handleStatsUpdate = () => {
    // 延迟一点时间再刷新，确保后端数据已更新
    setTimeout(() => {
      fetchStats();
    }, 500);
  };

  // 获取显示内容（根据语言选择）
  const getDisplayTitle = () => {
    return locale === 'zh' ? (blog.titleZh ||  "") : blog.title;
  };

  const getDisplayExcerpt = () => {
    return locale === 'zh' ? (blog.excerptZh || "") : (blog.excerpt);
  };

  const getDisplayContent = () => {
    const content = locale === 'zh' ? (blog.readmeZh ||"") : (blog.readme );
    return content || '';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 主要内容 */}
        <div className="">
            {/* 博客标题和基本信息 */}
            <Card className="card-enhanced mb-8">
              <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <Link href="/front/blogs">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t2('actions.backToList')}
                  </Button>
                </Link>
                
                <InteractionButtons
                  resourceType="blog"
                  resourceId={blogId}
                  title={getDisplayTitle() || ''}
                  className="flex-shrink-0"
                  onStatsUpdate={handleStatsUpdate}
                />
              </div>
              

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                  {getDisplayTitle()}
                </h1>

                {/* 作者和发布信息 */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                  {blog.author && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-2">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <span className="font-medium text-foreground">{blog.author}</span>
                        <div className="text-xs text-muted-foreground">{locale === 'zh' ? '作者' : 'Author'}</div>
                      </div>
                    </div>
                  )}
                  {blog.publishedAt && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <div>
                        <span className="font-medium text-foreground">
                          {formatDistanceToNow(new Date(blog.publishedAt), {
                            addSuffix: true,
                            locale: dateLocale
                          })}
                        </span>
                        <div className="text-xs text-muted-foreground">{locale === 'zh' ? '发布时间' : 'Published'}</div>
                      </div>
                    </div>
                  )}
                  {blog.estimatedReadTime && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      <div>
                        <span className="font-medium text-foreground">{blog.estimatedReadTime}{t('featured.minutes')}{locale === 'zh' ? '阅读' : ' read'}</span>
                        <div className="text-xs text-muted-foreground">{locale === 'zh' ? '阅读时间' : 'Reading Time'}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 统计信息卡片 - 使用真实数据或确定性数据作为后备 */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 text-center border border-blue-200/20">
                    <Eye className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-foreground">{stats.views}</div>
                    <div className="text-xs text-muted-foreground">{locale === 'zh' ? '次浏览' : 'views'}</div>
                  </div>
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-4 text-center border border-red-200/20">
                    <Heart className="h-5 w-5 text-red-500 mx-auto mb-2" />
                    <div className="text-lg font-bold text-foreground">{stats.likes}</div>
                    <div className="text-xs text-muted-foreground">{locale === 'zh' ? '次点赞' : 'likes'}</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 text-center border border-purple-200/20">
                    <Bookmark className="h-5 w-5 text-purple-500 mx-auto mb-2" />
                    <div className="text-lg font-bold text-foreground">{stats.favorites}</div>
                    <div className="text-xs text-muted-foreground">{locale === 'zh' ? '次收藏' : 'favorites'}</div>
                  </div>
                </div>

                {/* 博客封面图 */}
                {(blog.coverImageUrl || blog.thumbnail) && !imageError && (
                  <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={blog.coverImageUrl || blog.thumbnail}
                      alt={getDisplayTitle()}
                      className="w-full h-64 md:h-96 object-cover hover:scale-105 transition-transform duration-500"
                      onError={() => setImageError(true)}
                    />
                  </div>
                )}

                {/* 博客摘要卡片 */}
                {getDisplayExcerpt() && (
                  <Card className="mb-8 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20 border-primary/10">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-semibold mb-3 text-foreground flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        {t('detail.summary')}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {getDisplayExcerpt()}
                      </p>
                    </CardContent>
                  </Card>
                )}

                <div className="p-8">
                {getDisplayContent() ? (
                  <AdvancedMarkdownRenderer 
                    content={getDisplayContent()}
                    className="prose prose-lg dark:prose-invert max-w-none"
                  />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">{t('detail.empty.content.title')}</h3>
                    <p className="text-muted-foreground">{t('detail.empty.content.description')}</p>
                  </div>
                )}
              </div>
              </CardContent>
            </Card>

          </div>
      </div>
    </div>
  );
} 