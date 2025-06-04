'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Label } from '@/components/ui/label';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Layers,
  ArrowUpDown,
  MoreHorizontal,
  Languages
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  getTutorialSections,
  createTutorialSection,
  updateTutorialSection,
  deleteTutorialSection
} from '@/features/tutorial/actions/tutorial-actions';
import { toast } from 'sonner';
import { AdvancedMarkdownEditor } from '@/features/common';

interface TutorialSection {
  id: string;
  title: string; // 英文标题
  titleZh?: string | null; // 中文标题
  description: string | null; // 英文描述
  descriptionZh?: string | null; // 中文描述
  order: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  _count?: {
    modules: number;
  };
}

interface SectionFormData {
  titleZh: string; // 中文标题
  descriptionZh: string; // 中文描述
  order: number;
}

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

export default function TutorialSectionsPage() {
  const router = useRouter();
  const [sections, setSections] = useState<TutorialSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<TutorialSection | null>(null);
  const [viewingSection, setViewingSection] = useState<TutorialSection | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [translating, setTranslating] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState<SectionFormData>({
    titleZh: '', // 中文标题
    descriptionZh: '', // 中文描述
    order: 1,
  });

  // Load data
  useEffect(() => {
    loadData();
  }, [currentPage, searchTerm]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await getTutorialSections();
      if (result.success && result.data) {
        // Filter by search term if provided
        let filteredSections = result.data;
        if (searchTerm) {
          filteredSections = result.data.filter(section => 
            (section.titleZh && section.titleZh.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (section.descriptionZh && section.descriptionZh.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        }
        setSections(filteredSections);
      }
    } catch (error) {
      console.error('Error loading sections:', error);
      toast.error('加载板块数据失败');
    } finally {
      setLoading(false);
    }
  };

  // CRUD handlers
  const handleCreate = async () => {
    if (!formData.titleZh.trim()) {
      toast.error('请输入中文标题');
      return;
    }

    setSubmitting(true);
    setTranslating(true);
    try {
      // 翻译中文标题和描述为英文
      const translatedTitle = await translateToEnglish(formData.titleZh);
      const translatedDescription = formData.descriptionZh ? await translateToEnglish(formData.descriptionZh) : '';
      
      setTranslating(false);
      
      const createData = {
        title: translatedTitle, // 英文标题（翻译后的）
        titleZh: formData.titleZh, // 中文标题
        description: translatedDescription, // 英文描述（翻译后的）
        descriptionZh: formData.descriptionZh, // 中文描述
        order: formData.order,
      };
      
      const result = await createTutorialSection(createData);
      if (result.success) {
        toast.success('教程板块创建成功');
        setIsDialogOpen(false);
        resetForm();
        loadData();
      } else {
        toast.error(result.error || '创建失败');
      }
    } catch (error) {
      console.error('Error creating section:', error);
      toast.error('创建失败');
    } finally {
      setSubmitting(false);
      setTranslating(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingSection || !formData.titleZh.trim()) {
      toast.error('请输入中文标题');
      return;
    }
    
    setSubmitting(true);
    setTranslating(true);
    try {
      // 翻译中文标题和描述为英文
      const translatedTitle = await translateToEnglish(formData.titleZh);
      const translatedDescription = formData.descriptionZh ? await translateToEnglish(formData.descriptionZh) : '';
      
      setTranslating(false);
      
      const updateData = {
        title: translatedTitle, // 英文标题（翻译后的）
        titleZh: formData.titleZh, // 中文标题
        description: translatedDescription, // 英文描述（翻译后的）
        descriptionZh: formData.descriptionZh, // 中文描述
        order: formData.order,
      };
      
      const result = await updateTutorialSection(editingSection.id, updateData);
      if (result.success) {
        toast.success('教程板块更新成功');
        setIsDialogOpen(false);
        setEditingSection(null);
        resetForm();
        loadData();
      } else {
        toast.error(result.error || '更新失败');
      }
    } catch (error) {
      console.error('Error updating section:', error);
      toast.error('更新失败');
    } finally {
      setSubmitting(false);
      setTranslating(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`确定要删除板块 "${title}" 吗？此操作不可撤销，该板块下的所有教程也将被删除。`)) {
      return;
    }
    
    try {
      const result = await deleteTutorialSection(id);
      if (result.success) {
        toast.success('教程板块删除成功');
        loadData();
      } else {
        toast.error(result.error || '删除失败');
      }
    } catch (error) {
      console.error('Error deleting section:', error);
      toast.error('删除失败');
    }
  };

  const resetForm = () => {
    setFormData({
      titleZh: '',
      descriptionZh: '',
      order: 1,
    });
  };

  const openDialog = (section?: TutorialSection) => {
    if (section) {
      setEditingSection(section);
      setFormData({
        titleZh: section.titleZh || '',
        descriptionZh: section.descriptionZh || '',
        order: section.order,
      });
    } else {
      setEditingSection(null);
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const openViewDialog = (section: TutorialSection) => {
    setViewingSection(section);
    setIsViewDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSection) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Layers className="h-8 w-8 text-blue-600" />
              教程板块管理
            </h1>
            <p className="mt-2 text-gray-600">
              管理教程板块，组织教程内容结构。编辑时会自动翻译为英文。
            </p>
          </div>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          新建板块
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>板块列表</CardTitle>
          <CardDescription>
            管理所有教程板块，可以进行增删改查操作
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索板块标题或描述..."
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
                  <TableHead>排序</TableHead>
                  <TableHead>中文标题</TableHead>
                  <TableHead>中文描述</TableHead>
                  <TableHead>教程数量</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      正在加载...
                    </TableCell>
                  </TableRow>
                ) : sections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {searchTerm ? '没有找到符合条件的板块' : '暂无教程板块'}
                    </TableCell>
                  </TableRow>
                ) : (
                  sections.map((section) => (
                    <TableRow key={section.id}>
                      <TableCell>
                        <Badge variant="outline">{section.order}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {section.titleZh || section.title}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {section.descriptionZh ? (
                          <div className="max-w-xs truncate" title={section.descriptionZh}>
                            {section.descriptionZh.length > 50 
                              ? `${section.descriptionZh.substring(0, 50)}...` 
                              : section.descriptionZh}
                          </div>
                        ) : (
                          <span className="text-gray-400">无描述</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          {section._count?.modules || 0}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {section.createdAt 
                          ? new Date(section.createdAt).toLocaleDateString('zh-CN')
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openViewDialog(section)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            查看
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openDialog(section)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            编辑
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete(section.id, section.titleZh || section.title)}
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
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              查看板块详情
            </DialogTitle>
            <DialogDescription>
              板块的详细信息和内容预览
            </DialogDescription>
          </DialogHeader>
          
          {viewingSection && (
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
                      <Label className="text-sm font-medium text-gray-600">标题</Label>
                      <p className="text-sm mt-1">{viewingSection.titleZh || '无中文标题'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">描述</Label>
                      <p className="text-sm mt-1 text-gray-600">
                        {viewingSection.descriptionZh || '无中文描述'}
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
                      <Label className="text-sm font-medium text-gray-600">标题</Label>
                      <p className="text-sm mt-1">{viewingSection.title || '无英文标题'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">描述</Label>
                      <p className="text-sm mt-1 text-gray-600">
                        {viewingSection.description || '无英文描述'}
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">排序</Label>
                      <p className="text-sm mt-1">{viewingSection.order}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">教程数量</Label>
                      <p className="text-sm mt-1">{viewingSection._count?.modules || 0}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">创建时间</Label>
                      <p className="text-sm mt-1">
                        {viewingSection.createdAt 
                          ? new Date(viewingSection.createdAt).toLocaleString('zh-CN')
                          : '-'
                        }
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">更新时间</Label>
                      <p className="text-sm mt-1">
                        {viewingSection.updatedAt 
                          ? new Date(viewingSection.updatedAt).toLocaleString('zh-CN')
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
              if (viewingSection) {
                openDialog(viewingSection);
              }
            }}>
              <Edit className="h-4 w-4 mr-2" />
              编辑
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingSection ? (
                <>
                  <Edit className="h-5 w-5" />
                  编辑教程板块
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  创建教程板块
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {editingSection 
                ? '修改板块信息，系统会自动翻译为英文，更新后所有相关教程都会受到影响。'
                : '创建新的教程板块来组织教程内容，系统会自动翻译为英文。'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-6">
              {/* 标题部分 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="titleZh">中文标题 *</Label>
                  <Input
                    id="titleZh"
                    value={formData.titleZh}
                    onChange={(e) => setFormData({ ...formData, titleZh: e.target.value })}
                    placeholder="请输入中文标题"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    系统会自动翻译为英文标题
                  </p>
                </div>
                <div>
                  <Label htmlFor="order">排序顺序</Label>
                  <Input
                    id="order"
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                    placeholder="1"
                  />
                </div>
              </div>
              
              {/* 描述部分 */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="descriptionZh">中文描述</Label>
                  <Textarea
                    id="descriptionZh"
                    value={formData.descriptionZh}
                    onChange={(e) => setFormData({ ...formData, descriptionZh: e.target.value })}
                    placeholder="请输入中文描述..."
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    系统会自动翻译为英文描述
                  </p>
                </div>
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
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button type="submit" disabled={submitting || translating}>
                {translating 
                  ? '翻译中...'
                  : submitting 
                    ? (editingSection ? '更新中...' : '创建中...')
                    : (editingSection ? '更新板块' : '创建板块')
                }
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}