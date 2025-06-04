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
import { Edit, Trash2, Eye, Clock, PlayCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import type { TutorialModuleType } from '../types';

/**
 * 教程管理表格组件
 * 用于显示教程模块列表并提供编辑、删除等操作
 */
interface TutorialManagementTableProps {
  /** 教程模块列表数据 */
  modules: TutorialModuleType[];
  /** 选中的模块ID列表 */
  selectedModules: string[];
  /** 是否正在加载 */
  loading: boolean;
  /** 选择模块的回调函数 */
  onSelectModule: (moduleId: string, checked: boolean) => void;
  /** 全选/取消全选的回调函数 */
  onSelectAll: (checked: boolean) => void;
  /** 删除模块的回调函数 */
  onDeleteModule: (moduleId: string) => void;
}

export default function TutorialManagementTable({
  modules,
  selectedModules,
  loading,
  onSelectModule,
  onSelectAll,
  onDeleteModule,
}: TutorialManagementTableProps) {
  const isAllSelected = modules.length > 0 && selectedModules.length === modules.length;

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">暂无教程模块</div>
        <p className="text-gray-400 mt-2">点击"创建模块"开始添加内容</p>
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
          <TableHead>章节</TableHead>
          <TableHead>时长</TableHead>
          <TableHead>创建时间</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {modules.map((module) => (
          <TableRow key={module.id}>
            <TableCell>
              <Checkbox
                checked={selectedModules.includes(module.id)}
                onCheckedChange={(checked) => onSelectModule(module.id, checked as boolean)}
                aria-label={`选择模块: ${module.title}`}
              />
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="font-medium line-clamp-1">
                  {module.title}
                </div>
                {module.description && (
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {module.description}
                  </div>
                )}
                {module.videoUrl && (
                  <div className="flex items-center text-xs text-blue-600">
                    <PlayCircle className="h-3 w-3 mr-1" />
                    包含视频
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              {module.sectionTitle ? (
                <Badge variant="outline">{module.sectionTitle}</Badge>
              ) : (
                <span className="text-gray-400">未分配</span>
              )}
            </TableCell>
            <TableCell>
              {module.estimatedTimeMinutes ? (
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  {module.estimatedTimeMinutes} 分钟
                </div>
              ) : (
                <span className="text-gray-400">未设置</span>
              )}
            </TableCell>
            <TableCell>
              {module.createdAt ? (
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(module.createdAt), {
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
                <Link href={`/backend/tutorial/modules/${module.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/backend/tutorial/modules/${module.id}/edit`}>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteModule(module.id)}
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