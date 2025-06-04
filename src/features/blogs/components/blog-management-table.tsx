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
import { Edit, Trash2, Eye, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import type { BlogType } from '../types';

/**
 * 博客管理表格组件
 * 用于显示博客列表并提供编辑、删除等操作
 */
interface BlogManagementTableProps {
  /** 博客列表数据 */
  blogs: BlogType[];
  /** 选中的博客ID列表 */
  selectedBlogs: string[];
  /** 是否正在加载 */
  loading: boolean;
  /** 选择博客的回调函数 */
  onSelectBlog: (blogId: string, checked: boolean) => void;
  /** 全选/取消全选的回调函数 */
  onSelectAll: (checked: boolean) => void;
  /** 删除博客的回调函数 */
  onDeleteBlog: (blogId: string) => void;
}

export default function BlogManagementTable({
  blogs,
  selectedBlogs,
  loading,
  onSelectBlog,
  onSelectAll,
  onDeleteBlog,
}: BlogManagementTableProps) {
  const isAllSelected = blogs.length > 0 && selectedBlogs.length === blogs.length;
  const isIndeterminate = selectedBlogs.length > 0 && selectedBlogs.length < blogs.length;

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">暂无博客数据</div>
        <p className="text-gray-400 mt-2">点击"创建博客"开始添加内容</p>
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
          <TableHead>标签</TableHead>
          <TableHead>创建时间</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {blogs.map((blog) => (
          <TableRow key={blog.id}>
            <TableCell>
              <Checkbox
                checked={selectedBlogs.includes(blog.id)}
                onCheckedChange={(checked) => onSelectBlog(blog.id, checked as boolean)}
                aria-label={`选择博客: ${blog.titleZh || blog.title}`}
              />
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="font-medium line-clamp-1">
                  {blog.titleZh || blog.title}
                </div>
                {blog.excerptZh || blog.excerpt ? (
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {blog.excerptZh || blog.excerpt}
                  </div>
                ) : null}
                {blog.url && (
                  <Link
                    href={blog.url}
                    target="_blank"
                    className="text-xs text-blue-600 hover:underline flex items-center"
                  >
                    原文链接
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                )}
              </div>
            </TableCell>
            <TableCell>
              {blog.category ? (
                <Badge variant="secondary">{blog.category.name}</Badge>
              ) : (
                <span className="text-gray-400">未分类</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {(blog.tags || []).slice(0, 3).map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {(blog.tags || []).length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{(blog.tags || []).length - 3}
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>
              {blog.createdAt ? (
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(blog.createdAt), {
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
                <Link href={`/backend/blogs/${blog.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/backend/blogs/${blog.id}/edit`}>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteBlog(blog.id)}
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