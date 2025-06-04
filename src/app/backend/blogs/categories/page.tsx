'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  ArrowLeft,
  Plus, 
  Edit, 
  Trash2, 
  FolderOpen,
  Calendar,
  FileText,
  Eye,
  Languages,
  Search
} from 'lucide-react';
import { 
  getBlogCategories,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory
} from '@/features/blogs/actions/blog-actions';
import { BlogCategoryType, CategoryFormDataType } from '@/features/blogs/types';
import { toast } from 'sonner';

// 翻译函数：通过API调用
const translateToEnglish = async (text: string): Promise<string> => {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        text, 
        targetLanguage: 'en' 
      }),
    });

    const result = await response.json();
    
    if (result.success) {
      return result.translatedText;
    } else {
      console.error('Translation API error:', result.error);
      return text; // 返回原文
    }
  } catch (error) {
    console.error('Translation failed:', error);
    return text; // 返回原文
  }
};

export default function BlogCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<BlogCategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategoryType | null>(null);
  const [viewingCategory, setViewingCategory] = useState<BlogCategoryType | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [translating, setTranslating] = useState(false);
  
  const [formData, setFormData] = useState<CategoryFormDataType>({
    name: '',
    nameZh: '',
    description: '',
    descriptionZh: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const result = await getBlogCategories();
      if (result.success && result.data) {
        setCategories(result.data);
      } else {
        toast.error(result.error || '加载分类失败');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('加载分类失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nameZh.trim()) {
      toast.error('请输入中文分类名称');
      return;
    }

    setSubmitting(true);
    setTranslating(true);
    try {
      // 翻译中文名称和描述为英文
      const translatedName = await translateToEnglish(formData.nameZh);
      const translatedDescription = formData.descriptionZh ? await translateToEnglish(formData.descriptionZh) : '';
      
      setTranslating(false);
      
      const submitData = {
        name: translatedName, // 英文名称（翻译后的）
        nameZh: formData.nameZh, // 中文名称
        description: translatedDescription, // 英文描述（翻译后的）
        descriptionZh: formData.descriptionZh, // 中文描述
      };

      let result;
      if (editingCategory) {
        result = await updateBlogCategory(editingCategory.id, submitData);
      } else {
        result = await createBlogCategory(submitData);
      }

      if (result.success) {
        toast.success(editingCategory ? '分类更新成功' : '分类创建成功');
        setDialogOpen(false);
        resetForm();
        loadCategories();
      } else {
        toast.error(result.error || '操作失败');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('操作失败');
    } finally {
      setSubmitting(false);
      setTranslating(false);
    }
  };

  const handleEdit = (category: BlogCategoryType) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      nameZh: category.nameZh || '',
      description: category.description || '',
      descriptionZh: category.descriptionZh || '',
    });
    setDialogOpen(true);
  };

  const handleView = (category: BlogCategoryType) => {
    setViewingCategory(category);
    setViewDialogOpen(true);
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(`确定要删除分类 "${categoryName}" 吗？删除后相关博客的分类将被移除。`)) {
      return;
    }

    try {
      const result = await deleteBlogCategory(categoryId);
      if (result.success) {
        toast.success('分类删除成功');
        loadCategories();
      } else {
        toast.error(result.error || '删除失败');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('删除失败');
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '',
      nameZh: '', 
      description: '',
      descriptionZh: '' 
    });
    setEditingCategory(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  // 过滤分类
  const filteredCategories = categories.filter(category => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (category.nameZh && category.nameZh.toLowerCase().includes(searchLower)) ||
      (category.name && category.name.toLowerCase().includes(searchLower)) ||
      (category.descriptionZh && category.descriptionZh.toLowerCase().includes(searchLower)) ||
      (category.description && category.description.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/backend/blogs')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回博客管理
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FolderOpen className="h-8 w-8 text-blue-600" />
              博客分类管理
            </h1>
            <p className="mt-2 text-gray-600">
              管理博客分类，组织内容结构。编辑时会自动翻译为英文。
            </p>
          </div>
        </div>
        <Button onClick={openCreateDialog} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          新建分类
        </Button>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总分类数</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">最新创建</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {categories.length > 0 && categories[0].createdAt 
                ? new Date(categories[0].createdAt).toLocaleDateString()
                : '暂无数据'
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">有描述的分类</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.filter(cat => cat.descriptionZh).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>分类列表</CardTitle>
          <CardDescription>
            管理所有博客分类，可以进行增删改查操作
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索分类名称或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>中文名称</TableHead>
                  <TableHead>中文描述</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      正在加载分类...
                    </TableCell>
                  </TableRow>
                ) : filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      {searchTerm ? '没有找到符合条件的分类' : '暂无分类数据'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        {category.nameZh || category.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {category.descriptionZh ? (
                          <div className="max-w-xs truncate" title={category.descriptionZh}>
                            {category.descriptionZh.length > 60 
                              ? `${category.descriptionZh.substring(0, 60)}...` 
                              : category.descriptionZh}
                          </div>
                        ) : (
                          <span className="text-gray-400">无描述</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {category.createdAt 
                          ? new Date(category.createdAt).toLocaleDateString('zh-CN')
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleView(category)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            查看
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEdit(category)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            编辑
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete(category.id, category.nameZh || category.name)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            删除
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              查看分类详情
            </DialogTitle>
            <DialogDescription>
              分类的详细信息和内容预览
            </DialogDescription>
          </DialogHeader>
          
          {viewingCategory && (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      中文信息
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">名称</Label>
                      <p className="text-sm mt-1">{viewingCategory.nameZh || '无中文名称'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">描述</Label>
                      <p className="text-sm mt-1 text-gray-600">
                        {viewingCategory.descriptionZh || '无中文描述'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      英文信息
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">名称</Label>
                      <p className="text-sm mt-1">{viewingCategory.name || '无英文名称'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">描述</Label>
                      <p className="text-sm mt-1 text-gray-600">
                        {viewingCategory.description || '无英文描述'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 其他信息 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">其他信息</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">ID</Label>
                      <p className="text-sm mt-1 font-mono">{viewingCategory.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">创建时间</Label>
                      <p className="text-sm mt-1">
                        {viewingCategory.createdAt 
                          ? new Date(viewingCategory.createdAt).toLocaleString('zh-CN')
                          : '-'
                        }
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">更新时间</Label>
                      <p className="text-sm mt-1">
                        {viewingCategory.updatedAt 
                          ? new Date(viewingCategory.updatedAt).toLocaleString('zh-CN')
                          : '-'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              关闭
            </Button>
            <Button onClick={() => {
              setViewDialogOpen(false);
              if (viewingCategory) {
                handleEdit(viewingCategory);
              }
            }}>
              <Edit className="h-4 w-4 mr-2" />
              编辑
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingCategory ? (
                <>
                  <Edit className="h-5 w-5" />
                  编辑分类
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  新建分类
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? '修改分类信息，系统会自动翻译为英文。'
                : '创建新的分类来组织博客内容，系统会自动翻译为英文。'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="nameZh">中文名称 *</Label>
                <Input
                  id="nameZh"
                  value={formData.nameZh}
                  onChange={(e) => setFormData({ ...formData, nameZh: e.target.value })}
                  placeholder="请输入中文分类名称"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  系统会自动翻译为英文名称
                </p>
              </div>
              
              <div>
                <Label htmlFor="descriptionZh">中文描述</Label>
                <Textarea
                  id="descriptionZh"
                  value={formData.descriptionZh}
                  onChange={(e) => setFormData({ ...formData, descriptionZh: e.target.value })}
                  placeholder="请输入中文描述（可选）"
                  rows={3}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  系统会自动翻译为英文描述
                </p>
              </div>

              {/* 翻译状态 */}
              {translating && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Languages className="h-4 w-4 animate-spin" />
                    <span className="text-sm">正在翻译内容为英文，请稍候...</span>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                取消
              </Button>
              <Button type="submit" disabled={submitting || translating}>
                {translating 
                  ? '翻译中...'
                  : submitting 
                    ? (editingCategory ? '更新中...' : '创建中...')
                    : (editingCategory ? '更新分类' : '创建分类')
                }
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 