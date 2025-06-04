/**
 * 通用管理表格组件
 * 支持搜索、分页、操作按钮等常用功能
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Plus,
  Eye, 
  Edit, 
  Trash2,
  Send,
  SquareX
} from 'lucide-react';

export interface TableColumn<T = any> {
  key: string;
  title: string;
  width?: string;
  render?: (value: any, record: T) => React.ReactNode;
}

export interface TableAction<T = any> {
  key: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: (record: T) => void;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  className?: string;
  condition?: (record: T) => boolean;
}

interface AdminTableProps<T = any> {
  title: string;
  description?: string;
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  loading?: boolean;
  searchable?: boolean;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  emptyText?: string;
  emptyIcon?: React.ReactNode;
  showCreateButton?: boolean;
  createButtonText?: string;
  onCreateClick?: () => void;
  extraHeaderActions?: React.ReactNode;
}

export function AdminTable<T extends Record<string, any>>({
  title,
  description,
  data,
  columns,
  actions = [],
  loading = false,
  searchable = true,
  searchTerm = '',
  onSearchChange,
  searchPlaceholder = '搜索...',
  emptyText = '暂无数据',
  emptyIcon,
  showCreateButton = true,
  createButtonText = '添加',
  onCreateClick,
  extraHeaderActions,
}: AdminTableProps<T>) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && (
              <CardDescription className="mt-2">{description}</CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2">
            {extraHeaderActions}
            {showCreateButton && onCreateClick && (
              <Button onClick={onCreateClick} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {createButtonText}
              </Button>
            )}
          </div>
        </div>
        
        {searchable && onSearchChange && (
          <div className="flex items-center gap-2 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8">
            {emptyIcon && <div className="flex justify-center mb-4">{emptyIcon}</div>}
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无数据</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? '没有找到匹配的结果' : emptyText}
            </p>
            {!searchTerm && showCreateButton && onCreateClick && (
              <Button onClick={onCreateClick}>
                <Plus className="h-4 w-4 mr-2" />
                {createButtonText}
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key} className={column.width}>
                    {column.title}
                  </TableHead>
                ))}
                {actions.length > 0 && (
                  <TableHead className="w-32">操作</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((record, index) => (
                <TableRow key={record.id || index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render 
                        ? column.render(record[column.key], record)
                        : renderDefaultCell(record[column.key])
                      }
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {actions
                          .filter(action => !action.condition || action.condition(record))
                          .map((action) => {
                            const IconComponent = action.icon;
                            return (
                              <Button
                                key={action.key}
                                variant={action.variant || "outline"}
                                size="sm"
                                onClick={() => action.onClick(record)}
                                title={action.title}
                                className={action.className}
                              >
                                <IconComponent className="h-4 w-4" />
                              </Button>
                            );
                          })}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// 默认单元格渲染函数
function renderDefaultCell(value: any): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-gray-400 text-sm">-</span>;
  }
  
  if (typeof value === 'boolean') {
    return (
      <Badge variant={value ? "default" : "outline"}>
        {value ? '是' : '否'}
      </Badge>
    );
  }
  
  if (typeof value === 'string' && value.length > 50) {
    return (
      <div className="max-w-xs">
        <p className="text-sm truncate" title={value}>
          {value}
        </p>
      </div>
    );
  }
  
  return value?.toString() || '';
}

// 常用的操作按钮配置
export const commonActions = {
  view: (onClick: (record: any) => void): TableAction => ({
    key: 'view',
    title: '查看',
    icon: Eye,
    onClick,
    variant: 'outline'
  }),
  
  edit: (onClick: (record: any) => void): TableAction => ({
    key: 'edit',
    title: '编辑',
    icon: Edit,
    onClick,
    variant: 'outline'
  }),
  
  delete: (onClick: (record: any) => void): TableAction => ({
    key: 'delete',
    title: '删除',
    icon: Trash2,
    onClick,
    variant: 'outline',
    className: 'text-red-600 hover:text-red-700'
  }),
  
  publish: (onClick: (record: any) => void): TableAction => ({
    key: 'publish',
    title: '发布',
    icon: Send,
    onClick,
    variant: 'default',
    className: 'bg-green-600 hover:bg-green-700 text-white',
    condition: (record) => !record.isPublished
  }),
  
  unpublish: (onClick: (record: any) => void): TableAction => ({
    key: 'unpublish',
    title: '取消发布',
    icon: SquareX,
    onClick,
    variant: 'outline',
    className: 'text-orange-600 hover:text-orange-700',
    condition: (record) => record.isPublished
  })
}; 