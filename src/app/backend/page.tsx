'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  FileText, 
  Lightbulb,
  TrendingUp,
  Activity,
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { 
  getDashboardOverview, 
  getRecentActivity, 
  getGrowthTrends,
  getPopularContent 
} from '@/features/dashboard/actions/dashboard-actions';
import { toast } from 'sonner';

interface DashboardStats {
  users: {
    total: number;
    active: number;
    admins: number;
    inactive: number;
  };
  blogs: {
    total: number;
    published: number;
    drafts: number;
  };
  useCases: {
    total: number;
    published: number;
    drafts: number;
  };
  tutorial: {
    totalSections: number;
    totalModules: number;
    totalProgress: number;
    completedProgress: number;
    completionRate: number;
  };
}

interface GrowthTrends {
  userGrowth: number;
  blogGrowth: number;
  useCaseGrowth: number;
  progressGrowth: number;
}

const recentActivities = [
  {
    id: '1',
    type: 'user_registered',
    message: '新用户 张三 注册了账号',
    time: '2分钟前',
    icon: Users,
    color: 'text-green-600',
  },
  {
    id: '2',
    type: 'module_completed',
    message: '李四 完成了 "n8n 基础入门" 模块',
    time: '5分钟前',
    icon: BookOpen,
    color: 'text-blue-600',
  },
  {
    id: '3',
    type: 'article_published',
    message: '新博客 "AI 集成最佳实践" 已发布',
    time: '1小时前',
    icon: FileText,
    color: 'text-purple-600',
  },
  {
    id: '4',
    type: 'use_case_added',
    message: '新案例 "智能客服自动化" 已添加',
    time: '2小时前',
    icon: Lightbulb,
    color: 'text-orange-600',
  },
];

const topModules = [
  { name: 'n8n 基础入门', completions: 234, rating: 4.8 },
  { name: 'API 集成技巧', completions: 189, rating: 4.6 },
  { name: '工作流优化', completions: 156, rating: 4.7 },
  { name: '错误处理机制', completions: 143, rating: 4.5 },
];

const quickActions = [
  {
    title: '添加教程管理',
    description: '创建新的教程内容',
    href: '/admin/tutorial/new',
    icon: BookOpen,
    color: 'bg-blue-500',
  },
  {
    title: '发布博客',
    description: '添加新的技术博客',
    href: '/admin/articles/new',
    icon: FileText,
    color: 'bg-green-500',
  },
  {
    title: '创建案例',
    description: '分享实用的自动化案例',
    href: '/admin/use-cases/new',
    icon: Lightbulb,
    color: 'bg-purple-500',
  },
  {
    title: '用户管理',
    description: '查看和管理用户',
    href: '/admin/users',
    icon: Users,
    color: 'bg-orange-500',
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<GrowthTrends | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [overviewResult, trendsResult] = await Promise.all([
        getDashboardOverview(),
        getGrowthTrends()
      ]);

      if (overviewResult.success && overviewResult.data) {
        setStats(overviewResult.data);
      } else {
        toast.error('加载仪表盘数据失败');
      }

      if (trendsResult.success && trendsResult.data) {
        setTrends(trendsResult.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('加载仪表盘数据失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">仪表板</h1>
          <p className="text-gray-600 mt-2">欢迎回到 n8n 教程平台管理后台</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            数据刷新
          </Button>
          <Button>
            <TrendingUp className="h-4 w-4 mr-2" />
            查看报告
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">总用户数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.users.total.toLocaleString()}</div>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+{trends?.userGrowth || 0} 本月新增</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">活跃用户</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{stats.users.active.toLocaleString()}</div>
              <div className="flex items-center mt-2">
                <Activity className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">当前活跃</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">教程管理</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{stats.tutorial.totalModules}</div>
              <div className="flex items-center mt-2">
                <Target className="h-4 w-4 text-purple-600 mr-1" />
                <span className="text-sm text-purple-600">{stats.tutorial.completionRate.toFixed(1)}% 完成率</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">内容总数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">
                {(stats.blogs.total + stats.useCases.total).toLocaleString()}
              </div>
              <div className="flex items-center mt-2">
                <FileText className="h-4 w-4 text-orange-600 mr-1" />
                <span className="text-sm text-orange-600">博客 + 案例</span>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">加载数据失败</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              最近活动
            </CardTitle>
            <CardDescription>平台上的最新动态</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Modules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              热门教程管理
            </CardTitle>
            <CardDescription>最受欢迎的教程内容</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topModules.map((module, index) => (
                <div key={module.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{module.name}</p>
                      <p className="text-xs text-gray-500">{module.completions} 次完成</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      ⭐ {module.rating}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>快速操作</CardTitle>
          <CardDescription>常用的管理功能</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span>添加用户</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <BookOpen className="h-6 w-6" />
              <span>创建模块</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <FileText className="h-6 w-6" />
              <span>发布博客</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Lightbulb className="h-6 w-6" />
              <span>添加案例</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 