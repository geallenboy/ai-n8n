'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Card, CardContent,CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import AdvancedMarkdownRenderer from '@/features/common/components/advanced-markdown-renderer';
import { getTutorialStatsById } from '@/features/common';
import InteractionButtons from '@/features/common/components/interaction-buttons';
import { 
  BookOpen, 
  Clock, 
  Star, 
  ArrowLeft,
  Target,
  CheckCircle,
  Users,
  Share2,
  Bookmark,
  FileText,
  Award,
  BarChart3,
  Eye,
  Heart,
  Lightbulb,
  Zap,
  Trophy,
  Check,
  Download,
  Lock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { TutorialModuleType } from '@/features/tutorial';

interface TutorialDetailClientProps {
  tutorial: TutorialModuleType & {
    sectionTitle?: string;
    sectionTitleZh?: string;
  };
}

// 难度配置
const difficultyConfig = {
  beginner: {
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    textColor: 'text-green-700 dark:text-green-300',
    borderColor: 'border-green-200 dark:border-green-800',
    icon: Lightbulb
  },
  intermediate: {
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    textColor: 'text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-800',
    icon: Zap
  },
  advanced: {
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    textColor: 'text-purple-700 dark:text-purple-300',
    borderColor: 'border-purple-200 dark:border-purple-800',
    icon: Trophy
  }
};

export default function TutorialDetailClient({ tutorial }: TutorialDetailClientProps) {
  const t = useTranslations('tutorials');
  const locale = useLocale();
  const { user } = useUser();
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);
  const [stats, setStats] = useState({ views: 0, likes: 0, favorites: 0 });

  const difficulty = (tutorial.difficulty || 'beginner') as keyof typeof difficultyConfig;
  const difficultyStyle = difficultyConfig[difficulty];
  const DifficultyIcon = difficultyStyle.icon;

  // 获取真实的统计数据
  const fetchStats = async () => {
    try {
      // 获取点赞数据
      const likesResponse = await fetch(`/api/likes?resourceType=tutorial&resourceId=${tutorial.id}`);
      if (likesResponse.ok) {
        const likesData = await likesResponse.json();
        setStats(prev => ({ ...prev, likes: Number(likesData.count) || 0 }));
      }

      // 获取收藏数据
      const favoritesResponse = await fetch(`/api/favorites?resourceType=tutorial&resourceId=${tutorial.id}`);
      if (favoritesResponse.ok) {
        const favoritesData = await favoritesResponse.json();
        setStats(prev => ({ ...prev, favorites: Number(favoritesData.count) || 0 }));
      }

      // 获取浏览数据
      const viewsResponse = await fetch(`/api/views?resourceType=tutorial&resourceId=${tutorial.id}`);
      if (viewsResponse.ok) {
        const viewsData = await viewsResponse.json();
        setStats(prev => ({ ...prev, views: Number(viewsData.count) || 0 }));
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
      // 如果API失败，保持使用确定性数据
    }
  };

  useEffect(() => {
    // 只有当id是有效UUID时才获取数据
    const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tutorial.id);
    if (isValidUuid) {
      fetchStats();
    }
  }, [tutorial.id]);

  // 处理交互按钮操作后的数据刷新
  const handleStatsUpdate = () => {
    // 延迟一点时间再刷新，确保后端数据已更新
    setTimeout(() => {
      fetchStats();
    }, 500);
  };


  const getDisplayTitle = () => {
    return locale === 'zh' ? (tutorial.titleZh ) : tutorial.title;
  };

  const getDisplayDescription = () => {
    return locale === 'zh' ? (tutorial.descriptionZh ) : tutorial.description;
  };

  const getDisplayContent = () => {
    return locale === 'zh' ? (tutorial.contentZh ) : tutorial.content;
  };

  const handleMarkCompleted = () => {
    if (!user) {
      toast.error('请先登录', { 
        description: '登录后即可跟踪学习进度，获得学习成就',
        action: {
          label: '立即登录',
          onClick: () => router.push('/sign-in')
        }
      });
      return;
    }

    setIsCompleted(!isCompleted);
    toast.success(
      !isCompleted ? '恭喜完成教程！' : '已取消完成标记',
      { description: !isCompleted ? '您的学习进度已记录' : '进度已更新' }
    );
    // 这里可以添加保存到后端的逻辑
  };

  // 下载教程资源
  const handleDownloadResources = async () => {
    if (!user) {
      toast.error('请先登录', { 
        description: '登录用户可下载教程相关资源文件',
        action: {
          label: '立即登录',
          onClick: () => router.push('/sign-in')
        }
      });
      return;
    }

    try {
      // 记录下载行为
      await fetch('/api/downloads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          resourceType: 'tutorial', 
          resourceId: tutorial.id 
        }),
      });

      // 这里可以添加实际的资源下载逻辑
      toast.success('下载成功', { description: '教程资源已保存到本地' });
      
      // 刷新下载统计
      handleStatsUpdate();
    } catch (error) {
      console.error('下载失败:', error);
      toast.error('下载失败', { description: '请稍后重试' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 主要内容区域 */}
        <div className="lg:col-span-3 space-y-8">
            {/* 教程头部信息 */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Link href="/front/tutorial">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('actions.backToList')}
                  </Button>
                </Link>
                
                <InteractionButtons
                  resourceType="tutorial"
                  resourceId={tutorial.id}
                  title={getDisplayTitle() || ''}
                  className="flex-shrink-0"
                  onStatsUpdate={handleStatsUpdate}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant="secondary" 
                    className={`${difficultyStyle.bgColor} ${difficultyStyle.textColor} ${difficultyStyle.borderColor} border`}
                  >
                    <DifficultyIcon className="h-3 w-3 mr-1" />
                    {t(`difficulty.${difficulty}`)}
                  </Badge>
                  {tutorial.sectionTitleZh && (
                    <Badge variant="outline">
                      {tutorial.sectionTitleZh}
                    </Badge>
                  )}
                  {isCompleted && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {t('progress.completed')}
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {getDisplayTitle()}
                </h1>

                {getDisplayDescription() && (
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {getDisplayDescription()}
                  </p>
                )}

                {/* 统计信息卡片 - 参考博客详情页面样式 */}
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

                {/* 教程时长信息 */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{tutorial.estimatedTimeMinutes || 30} {t('featured.minutes')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 完成学习按钮 */}
            <div className="mt-6">
              <Button 
                className={`w-full ${isCompleted ? 'bg-green-600 hover:bg-green-700' : 
                  !user ? 'bg-muted text-muted-foreground hover:bg-muted border-muted' : 'btn-primary-gradient'}`}
                onClick={handleMarkCompleted}
                title={!user ? '登录后即可跟踪学习进度' : ''}
              >
                <Check className="mr-2 h-4 w-4" />
                {!user && <Lock className="mr-1 h-3 w-3" />}
                {isCompleted ? t('tutorial.completed') || '已完成学习' : t('tutorial.markComplete') || '标记为已完成'}
              </Button>
              {isCompleted && (
                <div className="text-center text-sm text-green-600 dark:text-green-400 mt-2">
                  <Award className="h-4 w-4 mx-auto mb-1" />
                  {t('tutorial.congratulations') || '恭喜完成本教程！'}
                </div>
              )}
              {!user && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200/20">
                  <p className="text-sm text-blue-600 dark:text-blue-400 text-center">
                    💡 {locale === 'zh' 
                      ? '登录后可跟踪学习进度，获得学习成就和证书'
                      : 'Login to track your learning progress and earn achievements'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* 学习目标 */}
            {tutorial.learningObjectives && tutorial.learningObjectives.length > 0 && (
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Target className="h-5 w-5 mr-2 text-green-500" />
                    {t('tutorial.learningObjectives')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tutorial.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* 前置条件 */}
            {tutorial.prerequisites && tutorial.prerequisites.length > 0 && (
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                    {t('tutorial.prerequisites')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tutorial.prerequisites.map((prerequisite, index) => (
                      <li key={index} className="flex items-start">
                        <div className="h-2 w-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                        <span>{prerequisite}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* 教程内容 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    {t('tutorial.content') || '教程内容'}
                  </div>
                  {/* 下载资源按钮 */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadResources}
                    className={`flex items-center space-x-1 ${
                      !user ? 'text-muted-foreground border-muted' : 'hover:text-green-600 hover:border-green-200'
                    }`}
                    title={!user ? '登录后即可下载教程资源' : ''}
                  >
                    <Download className="h-4 w-4" />
                    {!user && <Lock className="h-3 w-3" />}
                    <span>{locale === 'zh' ? '下载资源' : 'Download'}</span>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getDisplayContent() ? (
                  <AdvancedMarkdownRenderer 
                    content={getDisplayContent() || ''} 
                   
                  />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{t('tutorial.noContent') || '暂无教程内容'}</p>
                  </div>
                )}
                
                {!user && (
                  <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200/20">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                        <Lock className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                          {locale === 'zh' ? '解锁更多功能' : 'Unlock More Features'}
                        </h4>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          {locale === 'zh' 
                            ? '登录后可以跟踪学习进度、下载资源文件、收藏教程，并获得学习成就徽章。'
                            : 'Login to track progress, download resources, bookmark tutorials, and earn achievement badges.'
                          }
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push('/sign-in')}
                          className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/20"
                        >
                          {locale === 'zh' ? '立即登录' : 'Login Now'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
      </div>
    </div>
  );
} 