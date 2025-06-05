'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { useTranslations, useLocale } from 'next-intl';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import {  
  User, 
  Calendar, 
  Download,
  Eye,
  Heart,
  FileText,
  BookOpen,
  Lightbulb,
  Bookmark,
  ArrowLeft,
  Play,
  Settings,
  Lock
} from 'lucide-react';

import { AdvancedMarkdownRenderer } from '@/features/common';
import { N8nWorkflowPreview } from '@/features/common';
import { UseCaseType } from '@/features/use-cases';
import InteractionButtons from '@/features/common/components/interaction-buttons';

interface UseCaseDetailClientProps {
  useCase: UseCaseType;
  stats: {
    views: number;
    favorites: number;
    downloads: number;
  };
  isFavorited: boolean;
  userId: string | null;
  id: string;
}

export function UseCaseDetailClient({ 
  useCase, 
  stats: initialStats, 
 
  id 
}: UseCaseDetailClientProps) {
  const t = useTranslations('useCases.detail');
  const t2 = useTranslations('tutorials');
  const locale = useLocale();
  const { user } = useUser();
  const router = useRouter();
  const dateLocale = locale === 'zh' ? zhCN : enUS;
  const [activeTab, setActiveTab] = useState('description');
  const [stats, setStats] = useState(initialStats);

  // 获取真实的统计数据
  const fetchStats = async () => {
    try {
      // 获取点赞数据
      const likesResponse = await fetch(`/api/likes?resourceType=use_case&resourceId=${id}`);
      if (likesResponse.ok) {
        const likesData = await likesResponse.json();
        setStats(prev => ({ ...prev, likes: Number(likesData.count) || 0 }));
      }

      // 获取收藏数据
      const favoritesResponse = await fetch(`/api/favorites?resourceType=use_case&resourceId=${id}`);
      if (favoritesResponse.ok) {
        const favoritesData = await favoritesResponse.json();
        setStats(prev => ({ ...prev, favorites: Number(favoritesData.count) || prev.favorites }));
      }

      // 获取下载数据
      const downloadsResponse = await fetch(`/api/downloads?resourceType=use_case&resourceId=${id}`);
      if (downloadsResponse.ok) {
        const downloadsData = await downloadsResponse.json();
        setStats(prev => ({ ...prev, downloads: Number(downloadsData.count) || prev.downloads }));
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
      // 如果API失败，保持使用确定性数据
    }
  };

  useEffect(() => {
    // 只有当id是有效UUID时才获取数据
    const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isValidUuid) {
      fetchStats();
    }
  }, [id]);

  // 处理交互按钮操作后的数据刷新
  const handleStatsUpdate = () => {
    // 延迟一点时间再刷新，确保后端数据已更新
    setTimeout(() => {
      fetchStats();
    }, 500);
  };

  // 多语言显示函数
  const getDisplayTitle = () => {
    return locale === 'zh' ? (useCase.titleZh||"") : useCase.title;
  };

  const getDisplaySummary = () => {
    return locale === 'zh' ? (useCase.summaryZh ) : useCase.summary;
  };

  const getDisplayContent = () => {
    return locale === 'zh' ? (useCase.readmeZh ) : (useCase.readme );
  };

  const getDisplayInterpretation = () => {
    return locale === 'zh' ? (useCase.workflowInterpretationZh ) : (useCase.workflowInterpretation );
  };

  const getDisplayTutorial = () => {
    return locale === 'zh' ? (useCase.workflowTutorialZh) : (useCase.workflowTutorial );
  };

  const getDisplayWorkflowJson = () => {
    return locale === 'zh' ? (useCase.workflowJsonZh) : (useCase.workflowJson);
  };

  // 下载工作流JSON - 添加登录权限控制
  const handleDownloadWorkflow = async () => {
    if (!user) {
      toast.error('请先登录', { 
        description: '登录用户可下载工作流文件到本地使用',
        action: {
          label: '立即登录',
          onClick: () => router.push('/sign-in')
        }
      });
      return;
    }

    const workflowData = getDisplayWorkflowJson();
    if (!workflowData) {
      toast.error('工作流数据不可用');
      return;
    }

    try {
      // 记录下载行为
      await fetch('/api/downloads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          resourceType: 'use_case', 
          resourceId: id 
        }),
      });

      const dataStr = JSON.stringify(workflowData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `${useCase.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_workflow.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      toast.success('下载成功', { description: '工作流文件已保存到本地' });
      
      // 刷新下载统计
      handleStatsUpdate();
    } catch (error) {
      console.error('下载失败:', error);
      toast.error('下载失败', { description: '请稍后重试' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 页面头部导航 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         {/* 主要内容区域 */}
         <div className="space-y-8">
            {/* 案例头部信息 */}
            <Card className="card-enhanced">
              <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <Link href="/front/use-cases">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t2('actions.backToList')}
                  </Button>
                </Link>
                
                <InteractionButtons
                  resourceType="use_case"
                  resourceId={id}
                  title={getDisplayTitle() || ''}
                  className="flex-shrink-0"
                  onStatsUpdate={handleStatsUpdate}
                />
              </div>
                {/* 分类标签和状态 */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {useCase.difficulty && (
                    <Badge variant="outline" className="border-orange-500/20 text-orange-600 dark:text-orange-400">
                      <Settings className="h-3 w-3 mr-1" />
                      {useCase.difficulty}
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                  {getDisplayTitle()}
                </h1>

                {/* 作者和发布信息 */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                  {useCase.n8nAuthor && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-2">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <span className="font-medium text-foreground">{useCase.n8nAuthor}</span>
                        <div className="text-xs text-muted-foreground">{locale === 'zh' ? '作者' : 'Author'}</div>
                      </div>
                    </div>
                  )}
                  {useCase.publishedAt && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <div>
                        <span className="font-medium text-foreground">
                          {formatDistanceToNow(new Date(useCase.publishedAt), {
                            addSuffix: true,
                            locale: dateLocale
                          })}
                        </span>
                        <div className="text-xs text-muted-foreground">{locale === 'zh' ? '发布时间' : 'Published'}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 统计信息卡片 - 参考博客详情页面样式 */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 text-center border border-blue-200/20">
                    <Eye className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-foreground">{stats.views}</div>
                    <div className="text-xs text-muted-foreground">{locale === 'zh' ? '次浏览' : 'views'}</div>
                  </div>
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-4 text-center border border-red-200/20">
                    <Heart className="h-5 w-5 text-red-500 mx-auto mb-2" />
                    <div className="text-lg font-bold text-foreground">{stats.favorites}</div>
                    <div className="text-xs text-muted-foreground">{locale === 'zh' ? '次收藏' : 'favorites'}</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 text-center border border-purple-200/20">
                    <Bookmark className="h-5 w-5 text-purple-500 mx-auto mb-2" />
                    <div className="text-lg font-bold text-foreground">{stats.downloads || 0}</div>
                    <div className="text-xs text-muted-foreground">{locale === 'zh' ? '次下载' : 'downloads'}</div>
                  </div>
                </div>
                <div >
                  {/* 工作流可视化预览 */}
                  <N8nWorkflowPreview 
                      workflowJson={getDisplayWorkflowJson()}
                     
                    />
                </div>

               
                 {/* Tab美化展示的详细内容 */}
            <Card className="card-enhanced mt-8">
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="border-b border-border/50 px-6 pt-6">
                    <TabsList className="grid w-full grid-cols-4 bg-muted/30 p-1 rounded-lg">
                      <TabsTrigger 
                        value="description" 
                        className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                      >
                        <BookOpen className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('content.description')}</span>
                        <span className="sm:hidden">{locale === 'zh' ? '说明' : 'Docs'}</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="interpretation" 
                        className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                      >
                        <Lightbulb className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('content.interpretation')}</span>
                        <span className="sm:hidden">{locale === 'zh' ? '解读' : 'Guide'}</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="tutorial" 
                        className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                      >
                        <Play className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('content.tutorial')}</span>
                        <span className="sm:hidden">{locale === 'zh' ? '教程' : 'Tutorial'}</span>
                      </TabsTrigger>
                     
                    </TabsList>
                  </div>

                  <div className="p-6">
                    <TabsContent value="description" className="mt-0">
                      {getDisplayContent() ? (
                        <AdvancedMarkdownRenderer 
                          content={getDisplayContent() || ''}
                          className="prose prose-lg dark:prose-invert max-w-none"
                        />
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="text-lg font-medium text-foreground mb-2">{t('empty.readme.title')}</h3>
                          <p className="text-muted-foreground">{t('empty.readme.description')}</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="interpretation" className="mt-0">
                      {getDisplayInterpretation() ? (
                        <AdvancedMarkdownRenderer 
                          content={getDisplayInterpretation() || ''}
                          className="prose prose-lg dark:prose-invert max-w-none"
                        />
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-200 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Lightbulb className="h-8 w-8 text-yellow-600" />
                          </div>
                          <h3 className="text-lg font-medium text-foreground mb-2">{t('empty.interpretation.title')}</h3>
                          <p className="text-muted-foreground">{t('empty.interpretation.description')}</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="tutorial" className="mt-0">
                      {getDisplayTutorial() ? (
                        <AdvancedMarkdownRenderer 
                          content={getDisplayTutorial() || ''}
                          className="prose prose-lg dark:prose-invert max-w-none"
                        />
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Play className="h-8 w-8 text-green-600" />
                          </div>
                          <h3 className="text-lg font-medium text-foreground mb-2">{t('empty.tutorial.title')}</h3>
                          <p className="text-muted-foreground">{t('empty.tutorial.description')}</p>
                        </div>
                      )}
                    </TabsContent>

                    {/* 工作流下载部分 */}
                    {getDisplayWorkflowJson() && (
                      <div className="mt-8 pt-6 border-t border-border/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              {locale === 'zh' ? '下载工作流' : 'Download Workflow'}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {locale === 'zh' 
                                ? '获取完整的 n8n 工作流 JSON 文件，导入到您的 n8n 实例中使用'
                                : 'Get the complete n8n workflow JSON file to import into your n8n instance'
                              }
                            </p>
                          </div>
                          <Button
                            onClick={handleDownloadWorkflow}
                            className={`flex items-center space-x-2 ${
                              !user ? 'bg-muted text-muted-foreground hover:bg-muted' : 'btn-primary-gradient'
                            }`}
                            disabled={!getDisplayWorkflowJson()}
                            title={!user ? '登录后即可下载' : ''}
                          >
                            <Download className="h-4 w-4" />
                            {!user && <Lock className="h-3 w-3" />}
                            <span>{locale === 'zh' ? '下载 JSON' : 'Download JSON'}</span>
                          </Button>
                        </div>
                        {!user && (
                          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200/20">
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                              💡 {locale === 'zh' 
                                ? '登录后即可下载工作流文件，建立您的自动化工具库'
                                : 'Login to download workflow files and build your automation toolkit'
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Tabs>
              </CardContent>
            </Card>
              </CardContent>
            </Card>

           
          </div>
      </div>
    </div>
  );
} 