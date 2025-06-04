import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowRight,
  BarChart3,
  BookOpen,
  FileText,
  Lightbulb,
  TrendingUp,
  Clock,
  Users,
  Target
} from 'lucide-react';

import { Navigation, Footer } from '@/features/layout';
import { getDashboardStats } from '@/features/common';

export default async function DashboardPage() {
  // 获取服务器端数据
  const statsResult = await getDashboardStats();
  const data = statsResult.success && statsResult.data ? statsResult.data : null;

  return (
    <div className="min-h-screen ">
     
      {/* 头部欢迎区域 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                欢迎来到 n8n 学习中心
              </h1>
              <p className="text-xl opacity-90">
                探索自动化世界，提升您的技能水平
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/front/use-cases">
                <Button size="lg" variant="secondary">
                  开始探索
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        {data?.stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="h-10 w-10 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">用例库</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {data.stats.publishedUseCases}
                    </p>
                    <p className="text-xs text-gray-500">
                      总共 {data.stats.totalUseCases} 个案例
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BookOpen className="h-10 w-10 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">技术博客</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {data.stats.publishedBlogs}
                    </p>
                    <p className="text-xs text-gray-500">
                      总共 {data.stats.totalBlogs} 篇文章
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Lightbulb className="h-10 w-10 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">学习教程</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {data.stats.totalTutorials}
                    </p>
                    <p className="text-xs text-gray-500">
                      系统化学习路径
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-10 w-10 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">活跃用户</p>
                    <p className="text-2xl font-bold text-gray-900">
                      500+
                    </p>
                    <p className="text-xs text-gray-500">
                      持续增长中
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 快速导航 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>快速导航</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/front/use-cases">
                <div className="p-4 text-center border rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors">
                  <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">用例库</p>
                  <p className="text-sm text-gray-500">实用案例</p>
                </div>
              </Link>
              
              <Link href="/front/tutorial">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  学习教程
                </Button>
              </Link>
              
              <Link href="/front/blogs">
                <div className="p-4 text-center border rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors">
                  <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">技术博客</p>
                  <p className="text-sm text-gray-500">深度文章</p>
                </div>
              </Link>
              
              <Link href="/front/about">
                <div className="p-4 text-center border rounded-lg hover:bg-orange-50 hover:border-orange-200 transition-colors">
                  <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">关于我们</p>
                  <p className="text-sm text-gray-500">了解团队</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
} 