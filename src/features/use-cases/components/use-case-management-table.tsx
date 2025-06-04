'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Trash2, Eye, Clock, Star, Download, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import type { UseCaseType } from '../types';

/**
 * 用例管理表格组件
 * 用于显示用例列表并提供编辑、删除等操作
 */
interface UseCaseManagementTableProps {
  /** 用例列表数据 */
  useCases: UseCaseType[];
  /** 选中的用例ID列表 */
  selectedUseCases: string[];
  /** 是否正在加载 */
  loading: boolean;
  /** 选择用例的回调函数 */
  onSelectUseCase: (useCaseId: string, checked: boolean) => void;
  /** 全选/取消全选的回调函数 */
  onSelectAll: (checked: boolean) => void;
  /** 删除用例的回调函数 */
  onDeleteUseCase: (useCaseId: string) => void;
}

export default function UseCaseManagementTable({
  useCases,
  selectedUseCases,
  loading,
  onSelectUseCase,
  onSelectAll,
  onDeleteUseCase,
}: UseCaseManagementTableProps) {
  const isAllSelected = useCases.length > 0 && selectedUseCases.length === useCases.length;

  const getDifficultyColor = (difficulty?: string | null) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty?: string | null) => {
    switch (difficulty) {
      case 'beginner':
        return '初级';
      case 'intermediate':
        return '中级';
      case 'advanced':
        return '高级';
      default:
        return '未设置';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (useCases.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">暂无用例数据</div>
        <p className="text-gray-400 mt-2">点击"创建用例"开始添加内容</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={onSelectAll}
              aria-label="全选"
            />
          </TableHead>
          <TableHead>标题</TableHead>
          <TableHead>分类</TableHead>
          <TableHead>难度</TableHead>
          <TableHead>统计</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>创建时间</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {useCases.map((useCase) => (
          <TableRow key={useCase.id}>
            <TableCell>
              <Checkbox
                checked={selectedUseCases.includes(useCase.id)}
                onCheckedChange={(checked) => onSelectUseCase(useCase.id, checked as boolean)}
                aria-label={`选择用例: ${useCase.title}`}
              />
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="font-medium line-clamp-1 flex items-center">
                  {useCase.title}
                  {useCase.isFeatured && (
                    <Star className="h-4 w-4 ml-2 text-yellow-500 fill-current" />
                  )}
                </div>
                {useCase.description && (
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {useCase.description}
                  </div>
                )}
                {useCase.tags && useCase.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {useCase.tags.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {useCase.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{useCase.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              {useCase.category ? (
                <Badge variant="secondary">{useCase.category}</Badge>
              ) : (
                <span className="text-gray-400">未分类</span>
              )}
            </TableCell>
            <TableCell>
              <Badge className={getDifficultyColor(useCase.difficulty)}>
                {getDifficultyText(useCase.difficulty)}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {useCase.viewCount}
                </div>
                <div className="flex items-center">
                  <Download className="h-3 w-3 mr-1" />
                  {useCase.downloadCount}
                </div>
                <div className="flex items-center">
                  <Heart className="h-3 w-3 mr-1" />
                  {useCase.favoriteCount}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <Badge variant={useCase.isPublished ? 'default' : 'secondary'}>
                  {useCase.isPublished ? '已发布' : '草稿'}
                </Badge>
                {useCase.isFeatured && (
                  <Badge variant="outline" className="text-yellow-600">
                    精选
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>
              {useCase.createdAt ? (
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(useCase.createdAt), {
                    addSuffix: true,
                    locale: zhCN,
                  })}
                </span>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Link href={`/backend/use-cases/${useCase.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/backend/use-cases/edit/${useCase.id}`}>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteUseCase(useCase.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 