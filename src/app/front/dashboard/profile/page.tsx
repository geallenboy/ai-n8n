'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Heart, 
  Bookmark, 
  Share2, 
  Clock, 
  TrendingUp, 
  BookOpen,
  FileText,
  MessageSquare,
  Trophy,
  Calendar,
  Eye,
  Download,
  Target,
  Settings,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface UserActivity {
  id: string;
  type: string;
  action: string;
  platform?: string;
  createdAt: string;
  resource: {
    id: string;
    title: string;
    titleZh?: string;
  } | null;
}

interface UserStats {
  likesCount: number;
  favoritesCount: number;
  sharesCount: number;
  viewsCount: number;
  learningTime: number;
  completedTutorials: number;
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData();
    }
  }, [isLoaded, user]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      
      // 获取用户活动
      const activitiesResponse = await fetch('/api/user/activities');
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData.activities || []);
      }

      // 这里可以添加获取用户统计信息的API调用
      // 暂时使用模拟数据
      setStats({
        likesCount: 12,
        favoritesCount: 8,
        sharesCount: 5,
        viewsCount: 145,
        learningTime: 1240, // 分钟
        completedTutorials: 3
      });

    } catch (error) {
      console.error('获取用户数据失败:', error);
      toast.error('加载数据失败', { description: '请稍后重试' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'like':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'favorite':
        return <Bookmark className="w-4 h-4 text-blue-500" />;
      case 'share':
        return <Share2 className="w-4 h-4 text-green-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActionText = (action: string, resourceType: string) => {
    const typeText = resourceType === 'tutorial' ? '教程' : 
                    resourceType === 'use_case' ? '案例' : '博客';
    
    switch (action) {
      case 'like':
        return `点赞了${typeText}`;
      case 'favorite':
        return `收藏了${typeText}`;
      case 'share':
        return `分享了${typeText}`;
      default:
        return `查看了${typeText}`;
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 用户信息头部 */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.imageUrl} alt={user.fullName || user.firstName || ''} />
                <AvatarFallback>
                  {(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">
                  {user.fullName || `${user.firstName} ${user.lastName}` || '用户'}
                </h1>
                <p className="text-muted-foreground mb-2">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
                <p className="text-sm text-muted-foreground">
                  加入时间：{user.createdAt ? formatDate(user.createdAt.toString()) : '未知'}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  设置
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 统计概览 */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.likesCount}</p>
                <p className="text-sm text-muted-foreground">点赞</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Bookmark className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.favoritesCount}</p>
                <p className="text-sm text-muted-foreground">收藏</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Share2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.sharesCount}</p>
                <p className="text-sm text-muted-foreground">分享</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Eye className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.viewsCount}</p>
                <p className="text-sm text-muted-foreground">浏览</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{Math.round(stats.learningTime / 60)}h</p>
                <p className="text-sm text-muted-foreground">学习时长</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.completedTutorials}</p>
                <p className="text-sm text-muted-foreground">完成教程</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 详细内容 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="activities">活动记录</TabsTrigger>
            <TabsTrigger value="favorites">我的收藏</TabsTrigger>
            <TabsTrigger value="progress">学习进度</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* 最近活动 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    最近活动
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
                          <div className="flex-1 space-y-1">
                            <div className="h-4 bg-muted rounded animate-pulse"></div>
                            <div className="h-3 bg-muted rounded w-1/2 animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.slice(0, 5).map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="mt-0.5">
                            {getActionIcon(activity.action)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">
                              {getActionText(activity.action, activity.type)}
                              {activity.resource && (
                                <span className="font-medium">
                                  「{activity.resource.titleZh || activity.resource.title}」
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(activity.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                      <Link href="?tab=activities">
                        <Button variant="outline" size="sm" className="w-full">
                          查看全部活动
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      还没有活动记录
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* 学习统计 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    学习统计
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>本月学习时长</span>
                      <span>25h / 40h</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>教程完成度</span>
                      <span>3 / 10</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>活跃度</span>
                      <span>良好</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>全部活动记录</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded animate-pulse"></div>
                          <div className="h-3 bg-muted rounded w-1/3 animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activities.length > 0 ? (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                        <div className="mt-0.5">
                          {getActionIcon(activity.action)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            {getActionText(activity.action, activity.type)}
                            {activity.resource && (
                              <span className="font-medium">
                                「{activity.resource.titleZh || activity.resource.title}」
                              </span>
                            )}
                            {activity.platform && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {activity.platform}
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(activity.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    还没有活动记录
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>我的收藏</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  收藏列表功能开发中...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>学习进度</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  学习进度功能开发中...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 