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
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Tag, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Search,
  Eye
} from 'lucide-react';
import { 
  getUseCaseCategories,
  createUseCaseCategory,
  updateUseCaseCategory,
  deleteUseCaseCategory
} from '@/features/use-cases/actions/usecase-actions';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  nameZh: string | null;
  description: string | null;
  descriptionZh: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// 翻译函数：通过API调用
const translateFieldsToEnglish = async (fields: Record<string, string>): Promise<Record<string, string>> => {
  const results: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(fields)) {
    if (value && value.trim()) {
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            text: value, 
            targetLanguage: 'en' 
          }),
        });

        const result = await response.json();
        
        if (result.success) {
          results[key] = result.translatedText;
        } else {
          console.error('Translation API error:', result.error);
          results[key] = value; // 返回原文
        }
      } catch (error) {
        console.error(`Translation failed for field ${key}:`, error);
        results[key] = value; // 返回原文
      }
    } else {
      results[key] = value;
    }
  }
  
  return results;
};

export default function UseCaseCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
  
  const [formData, setFormData] = useState({
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
      const result = await getUseCaseCategories();
      if (result.success && result.data) {
        setCategories(result.data);
      } else {
        toast.error('加载分类列表失败');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('加载分类列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!formData.nameZh.trim()) {
      toast.error('请输入中文分类名称');
      return;
    }

    try {
      // 准备需要翻译的中文字段
      const fieldsToTranslate: Record<string, string> = {};
      if (formData.nameZh) fieldsToTranslate.name = formData.nameZh;
      if (formData.descriptionZh) fieldsToTranslate.description = formData.descriptionZh;

      // 使用DeepSeek翻译中文内容为英文
      let translatedFields: Record<string, string> = {};
      if (Object.keys(fieldsToTranslate).length > 0) {
        try {
          translatedFields = await translateFieldsToEnglish(fieldsToTranslate);
          toast.success('内容已自动翻译为英文');
        } catch (error) {
          console.error('Translation failed:', error);
          toast.warning('自动翻译失败，将使用中文内容');
          translatedFields = fieldsToTranslate;
        }
      }

      // 合并翻译后的数据
      const finalFormData = {
        ...formData,
        ...translatedFields
      };

      const result = await createUseCaseCategory(finalFormData);
      if (result.success) {
        toast.success('分类创建成功');
        setIsCreateDialogOpen(false);
        resetForm();
        loadCategories();
      } else {
        toast.error(result.error || '创建分类失败');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('创建分类失败');
    }
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      nameZh: category.nameZh || '',
      description: category.description || '',
      descriptionZh: category.descriptionZh || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleViewCategory = (category: Category) => {
    setViewingCategory(category);
    setIsViewDialogOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;
    
    if (!formData.nameZh.trim()) {
      toast.error('请输入中文分类名称');
      return;
    }

    // 确认保存操作
    const confirmSave = confirm('确定要保存分类修改吗？系统将自动翻译中文内容为英文。');
    if (!confirmSave) {
      return;
    }

    try {
      // 准备需要翻译的中文字段
      const fieldsToTranslate: Record<string, string> = {};
      if (formData.nameZh) fieldsToTranslate.name = formData.nameZh;
      if (formData.descriptionZh) fieldsToTranslate.description = formData.descriptionZh;

      // 使用DeepSeek翻译中文内容为英文
      let translatedFields: Record<string, string> = {};
      if (Object.keys(fieldsToTranslate).length > 0) {
        try {
          translatedFields = await translateFieldsToEnglish(fieldsToTranslate);
          toast.success('内容已自动翻译为英文');
        } catch (error) {
          console.error('Translation failed:', error);
          toast.warning('自动翻译失败，将使用中文内容');
          translatedFields = fieldsToTranslate;
        }
      }

      // 合并翻译后的数据
      const finalFormData = {
        ...formData,
        ...translatedFields
      };

      const result = await updateUseCaseCategory(selectedCategory.id, finalFormData);
      if (result.success) {
        toast.success('分类更新成功');
        setIsEditDialogOpen(false);
        resetForm();
        loadCategories();
      } else {
        toast.error(result.error || '更新分类失败');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('更新分类失败');
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!confirm(`确定要删除分类"${categoryName}"吗？此操作不可撤销。`)) {
      return;
    }

    try {
      const result = await deleteUseCaseCategory(categoryId);
      if (result.success) {
        toast.success('分类删除成功');
        loadCategories();
      } else {
        toast.error(result.error || '删除分类失败');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('删除分类失败');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameZh: '',
      description: '',
      descriptionZh: '',
    });
    setSelectedCategory(null);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.nameZh && category.nameZh.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto py-6 ">
      <div className="space-y-6 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/backend/use-cases')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              返回案例管理
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Tag className="h-8 w-8 text-blue-600" />
                案例分类管理
              </h1>
              <p className="mt-2 text-gray-600">
                管理案例分类，组织和分类自动化案例
              </p>
            </div>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                添加分类
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>创建案例分类</DialogTitle>
                <DialogDescription>
                  创建新的案例分类，系统会自动翻译中文为英文
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="createNameZh">分类名称 *</Label>
                  <Input
                    id="createNameZh"
                    value={formData.nameZh}
                    onChange={(e) => setFormData({ ...formData, nameZh: e.target.value })}
                    placeholder="请输入中文分类名称（将自动翻译为英文）"
                  />
                </div>
                <div>
                  <Label htmlFor="createDescriptionZh">分类描述</Label>
                  <Textarea
                    id="createDescriptionZh"
                    value={formData.descriptionZh}
                    onChange={(e) => setFormData({ ...formData, descriptionZh: e.target.value })}
                    placeholder="请输入中文分类描述（将自动翻译为英文）"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleCreateCategory}>
                  创建分类
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>


        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>分类列表</CardTitle>
            <CardDescription>
              共 {filteredCategories.length} 个分类
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                   
                    <TableHead className="w-1/4">中文名称</TableHead>
                    <TableHead className="w-1/3">描述</TableHead>
                    <TableHead className="w-1/6">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                     
                      <TableCell>
                        {category.nameZh ? (
                          <Badge variant="secondary">{category.nameZh}</Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">未设置</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {category.descriptionZh || category.description ? (
                            <p className="text-sm text-gray-600 truncate">
                              {category.descriptionZh || category.description}
                            </p>
                          ) : (
                            <span className="text-gray-400 text-sm">无描述</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewCategory(category)}
                            title="查看分类"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCategory(category)}
                            title="编辑分类"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id, category.nameZh || category.name)}
                            className="text-red-600 hover:text-red-700"
                            title="删除分类"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {!loading && filteredCategories.length === 0 && (
              <div className="text-center py-8">
                <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无分类</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? '没有找到匹配的分类' : '还没有创建任何分类'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    创建第一个分类
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Category Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
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
                        <Tag className="h-4 w-4" />
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
                        <Tag className="h-4 w-4" />
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
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                关闭
              </Button>
              <Button onClick={() => {
                setIsViewDialogOpen(false);
                if (viewingCategory) {
                  handleEditCategory(viewingCategory);
                }
              }}>
                <Edit className="h-4 w-4 mr-2" />
                编辑
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>编辑案例分类</DialogTitle>
              <DialogDescription>
                修改分类信息，系统会自动翻译中文为英文
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editNameZh">分类名称 *</Label>
                <Input
                  id="editNameZh"
                  value={formData.nameZh}
                  onChange={(e) => setFormData({ ...formData, nameZh: e.target.value })}
                  placeholder="请输入中文分类名称（将自动翻译为英文）"
                />
              </div>
              <div>
                <Label htmlFor="editDescriptionZh">分类描述</Label>
                <Textarea
                  id="editDescriptionZh"
                  value={formData.descriptionZh}
                  onChange={(e) => setFormData({ ...formData, descriptionZh: e.target.value })}
                  placeholder="请输入中文分类描述（将自动翻译为英文）"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleUpdateCategory}>
                保存更改
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 