'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Tag, FolderOpen, TrendingUp } from 'lucide-react';
import type { BlogStatsType } from '../types';

/**
 * 博客统计信息卡片组件
 * 显示博客相关的统计数据
 */
interface BlogStatsCardProps {
  /** 统计数据 */
  stats: BlogStatsType;
  /** 分类数量 */
  categoriesCount?: number;
  /** 是否正在加载 */
  loading?: boolean;
}

export default function BlogStatsCard({ 
  stats, 
  categoriesCount = 0,
  loading = false 
}: BlogStatsCardProps) {
  const statsItems = [
    {
      title: '总博客数',
      value: stats.total,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: '分类数量',
      value: categoriesCount,
      icon: FolderOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: '标签数量',
      value: Object.keys(stats.byCategory).length,
      icon: Tag,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: '本月新增',
      value: Object.values(stats.byMonth).reduce((sum, count) => sum + count, 0),
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {item.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${item.bgColor}`}>
                <Icon className={`h-4 w-4 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {item.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 