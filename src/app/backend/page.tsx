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
  MoreHorizontal,
  Calendar,
  Globe,
  BarChart3,
  Zap,
  Star,
  CheckCircle,
  RefreshCw,
  Eye,
  Heart,
  MessageSquare,
  Download,
  Share2
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

interface ActivityItem {
  id: string;
  type: string;
  message: string;
  time: string;
  icon: any;
  color: string;
}

interface PopularItem {
  id: string;
  title: string;
  type: 'blog' | 'usecase' | 'tutorial';
  views: number;
  likes: number;
  engagement: number;
}

const quickActions = [
  {
    title: '创建案例',
    description: '分享实用的自动化案例',
    href: '/backend/use-cases/create',
    icon: Lightbulb,
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    hoverColor: 'hover:from-purple-600 hover:to-purple-700'
  },
  {
    title: '发布博客',
    description: '添加新的技术博客',
    href: '/backend/blogs/create',
    icon: FileText,
    color: 'bg-gradient-to-br from-green-500 to-green-600',
    hoverColor: 'hover:from-green-600 hover:to-green-700'
  },
  {
    title: '添加教程',
    description: '创建新的教程内容',
    href: '/backend/tutorial/create',
    icon: BookOpen,
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    hoverColor: 'hover:from-blue-600 hover:to-blue-700'
  },
  {
    title: '用户管理',
    description: '查看和管理用户',
    href: '/backend/users',
    icon: Users,
    color: 'bg-gradient-to-br from-orange-500 to-orange-600',
    hoverColor: 'hover:from-orange-600 hover:to-orange-700'
  },
];

const recentActivities: ActivityItem[] = [
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
  {
    id: '5',
    type: 'user_feedback',
    message: '用户王五对教程给出了5星评价',
    time: '3小时前',
    icon: Star,
    color: 'text-yellow-600',
  },
];

const topContent: PopularItem[] = [
  { id: '1', title: 'n8n 基础入门教程', type: 'tutorial', views: 1234, likes: 89, engagement: 92 },
  { id: '2', title: 'API 集成最佳实践', type: 'blog', views: 892, likes: 67, engagement: 85 },
  { id: '3', title: '智能客服自动化案例', type: 'usecase', views: 654, likes: 45, engagement: 78 },
  { id: '4', title: '工作流错误处理技巧', type: 'tutorial', views: 543, likes: 38, engagement: 75 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<GrowthTrends | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
    toast.success('数据已刷新');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blog': return FileText;
      case 'usecase': return Lightbulb;
      case 'tutorial': return BookOpen;
      default: return FileText;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'blog': return <Badge variant="outline" className="text-green-600 border-green-600">博客</Badge>;
      case 'usecase': return <Badge variant="outline" className="text-purple-600 border-purple-600">案例</Badge>;
      case 'tutorial': return <Badge variant="outline" className="text-blue-600 border-blue-600">教程</Badge>;
      default: return <Badge variant="outline">其他</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">控制台</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">欢迎回到 AI-N8N 平台管理后台</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? '刷新中...' : '刷新数据'}
          </Button>
          <Button asChild>
            <Link href="/backend/settings">
              <BarChart3 className="h-4 w-4 mr-2" />
              系统设置
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 用户统计 */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">用户总数</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.users.total || 0}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                活跃用户: {stats?.users.active || 0}
              </div>
              <div className="mt-2">
                <Button asChild size="sm" variant="ghost" className="h-auto p-0 text-xs">
                  <Link href="/backend/users">查看详情 →</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 博客统计 */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">博客文章</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.blogs.total || 0}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                已发布: {stats?.blogs.published || 0}
              </div>
              <div className="mt-2">
                <Button asChild size="sm" variant="ghost" className="h-auto p-0 text-xs">
                  <Link href="/backend/blogs">管理博客 →</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 案例统计 */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">应用案例</CardTitle>
              <Lightbulb className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.useCases.total || 0}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Globe className="h-3 w-3 mr-1 text-purple-600" />
                已发布: {stats?.useCases.published || 0}
              </div>
              <div className="mt-2">
                <Button asChild size="sm" variant="ghost" className="h-auto p-0 text-xs">
                  <Link href="/backend/use-cases">管理案例 →</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 教程统计 */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">教程模块</CardTitle>
              <BookOpen className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.tutorial.totalModules || 0}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Target className="h-3 w-3 mr-1 text-orange-600" />
                完成率: {stats?.tutorial.completionRate || 0}%
              </div>
              <div className="mt-2">
                <Button asChild size="sm" variant="ghost" className="h-auto p-0 text-xs">
                  <Link href="/backend/tutorial">管理教程 →</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 快速操作和活动 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 快速操作 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              快速操作
            </CardTitle>
            <CardDescription>常用功能快速入口</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <Card className={`p-4 transition-all duration-200 hover:shadow-lg cursor-pointer border-2 hover:border-gray-300 dark:hover:border-gray-600`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${action.color} ${action.hoverColor} transition-colors`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{action.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{action.description}</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 最近活动 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              最近活动
            </CardTitle>
            <CardDescription>系统最新动态</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="mt-1">
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                      {activity.message}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 热门内容和增长趋势 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 热门内容 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              热门内容
            </CardTitle>
            <CardDescription>用户最喜爱的内容</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topContent.map((item, index) => {
                const Icon = getTypeIcon(item.type);
                return (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{index + 1}</span>
                    </div>
                    <Icon className="h-5 w-5 text-gray-500" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        {getTypeBadge(item.type)}
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {item.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {item.likes}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 增长趋势 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              增长趋势
            </CardTitle>
            <CardDescription>本月数据变化情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">用户增长</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    +{trends?.userGrowth || 0}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">博客增长</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    +{trends?.blogGrowth || 0}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Lightbulb className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">案例增长</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    +{trends?.useCaseGrowth || 0}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium">学习进度</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    +{trends?.progressGrowth || 0}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 