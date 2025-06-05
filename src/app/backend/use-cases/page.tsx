'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Lightbulb, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  Clock,
  Upload,
  Loader2,
  FolderOpen
} from 'lucide-react';
import { 
  getUseCases, 
  deleteUseCase, 
  toggleUseCasePublishStatus,
  getUseCaseCategories,
  importUseCasesFromJson,
  getUseCaseStats,
  bulkDeleteUseCases,
  bulkPublishUseCases,
  bulkUnpublishUseCases
} from '@/features/use-cases/actions/usecase-actions';
import { toast } from 'sonner';
import {Pagination} from '@/features/common';

interface UseCase {
  id: string;
  title: string;
  titleZh: string | null;
  summary: string | null;
  summaryZh: string | null;
  readme: string | null;
  readmeZh: string | null;
  workflowInterpretation: string | null;
  workflowInterpretationZh: string | null;
  workflowTutorial: string | null;
  workflowTutorialZh: string | null;
  workflowJson: any;
  workflowJsonZh: any;
  coverImageUrl: string | null;
  n8nAuthor: string | null;
  originalUrl: string | null;
  isPublished: boolean | null;
  publishedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface Category {
  id: string;
  name: string;
  nameZh: string | null;
  description: string | null;
  descriptionZh: string | null;
}

interface UseCaseStats {
  total: number;
  published: number;
  draft: number;
  byCategory: Record<string, number>;
}

export default function UseCasesManagePage() {
  const router = useRouter();
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<UseCaseStats>({ 
    total: 0, 
    published: 0, 
    draft: 0, 
    byCategory: {} 
  });
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState('');
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
 

  useEffect(() => {
    loadUseCases();
    loadCategories();
    loadStats();
  }, [currentPage, searchTerm, selectedCategory]);

  const loadUseCases = async () => {
    try {
      setLoading(true);
      const result = await getUseCases(currentPage, 10, searchTerm, selectedCategory === 'all' ? undefined : selectedCategory);
      if (result.success && result.data) {
        setUseCases(result.data);
        if (result.pagination) {
          setTotalPages(result.pagination.totalPages);
          setTotalCount(result.pagination.total || 0);
        }
      } else {
        toast.error('加载案例列表失败');
      }
    } catch (error) {
      console.error('Error loading use cases:', error);
      toast.error('加载案例列表失败');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const result = await getUseCaseCategories();
      if (result.success && result.data) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadStats = async () => {
    try {
      const result = await getUseCaseStats();
      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // 批量操作相关函数
  const handleSelectAll = () => {
    if (selectedIds.length === useCases.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(useCases.map(useCase => useCase.id));
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleBulkPublish = async () => {
    if (selectedIds.length === 0) {
      toast.error('请选择要发布的案例');
      return;
    }

    if (!confirm(`确定要发布 ${selectedIds.length} 个案例吗？`)) {
      return;
    }

    try {
      setBulkLoading(true);
      const result = await bulkPublishUseCases(selectedIds);
      if (result.success) {
        toast.success(`成功发布 ${selectedIds.length} 个案例`);
        setSelectedIds([]);
        loadUseCases();
        loadStats();
      } else {
        toast.error(result.error || '批量发布失败');
      }
    } catch (error) {
      console.error('Error bulk publishing:', error);
      toast.error('批量发布失败');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkUnpublish = async () => {
    if (selectedIds.length === 0) {
      toast.error('请选择要取消发布的案例');
      return;
    }

    if (!confirm(`确定要取消发布 ${selectedIds.length} 个案例吗？`)) {
      return;
    }

    try {
      setBulkLoading(true);
      const result = await bulkUnpublishUseCases(selectedIds);
      if (result.success) {
        toast.success(`成功取消发布 ${selectedIds.length} 个案例`);
        setSelectedIds([]);
        loadUseCases();
        loadStats();
      } else {
        toast.error(result.error || '批量取消发布失败');
      }
    } catch (error) {
      console.error('Error bulk unpublishing:', error);
      toast.error('批量取消发布失败');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error('请选择要删除的案例');
      return;
    }

    if (!confirm(`确定要删除 ${selectedIds.length} 个案例吗？此操作不可撤销。`)) {
      return;
    }

    try {
      setBulkLoading(true);
      const result = await bulkDeleteUseCases(selectedIds);
      if (result.success) {
        toast.success(`成功删除 ${selectedIds.length} 个案例`);
        setSelectedIds([]);
        loadUseCases();
        loadStats();
      } else {
        toast.error(result.error || '批量删除失败');
      }
    } catch (error) {
      console.error('Error bulk deleting:', error);
      toast.error('批量删除失败');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleDeleteUseCase = async (useCaseId: string) => {
    if (!confirm('确定要删除这个案例吗？此操作不可撤销。')) {
      return;
    }

    try {
      const result = await deleteUseCase(useCaseId);
      if (result.success) {
        toast.success('案例删除成功');
        loadUseCases();
      } else {
        toast.error(result.error || '删除案例失败');
      }
    } catch (error) {
      console.error('Error deleting use case:', error);
      toast.error('删除案例失败');
    }
  };

  const handleTogglePublish = async (useCaseId: string) => {
    try {
      const result = await toggleUseCasePublishStatus(useCaseId);
      if (result.success) {
        toast.success('案例状态更新成功');
        loadUseCases();
      } else {
        toast.error(result.error || '更新案例状态失败');
      }
    } catch (error) {
      console.error('Error toggling use case status:', error);
      toast.error('更新案例状态失败');
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleImportJson = async () => {
    if (!importData.trim()) {
      toast.error('请输入JSON数据');
      return;
    }

    try {
      const result = await importUseCasesFromJson(importData);
      if (result.success && result.data) {
        const errorsCount = Array.isArray(result.data.errors) ? result.data.errors.length : 0;
        toast.success(`成功导入 ${result.data.imported} 个案例${errorsCount > 0 ? `，${errorsCount} 个失败` : ''}`);
        setIsImportDialogOpen(false);
        setImportData('');
        loadUseCases();
        loadCategories();
        loadStats();
      } else {
        toast.error(result.error || '导入失败');
      }
    } catch (error) {
      console.error('Error importing JSON:', error);
      toast.error('导入失败');
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const jsonFiles = fileArray.filter(file => file.name.endsWith('.json'));
    
    if (jsonFiles.length === 0) {
      toast.error('请选择JSON文件');
      return;
    }

    try {
      let totalImported = 0;
      let totalErrors = 0;

      for (const file of jsonFiles) {
        const text = await file.text();
        const result = await importUseCasesFromJson(text);
        
        if (result.success && result.data) {
          totalImported += result.data.imported;
          const errorsCount = Array.isArray(result.data.errors) ? result.data.errors.length : 0;
          totalErrors += errorsCount;
        } else {
          totalErrors++;
          console.error(`Error importing file ${file.name}:`, result.error);
        }
      }

      toast.success(`成功导入 ${totalImported} 个案例${totalErrors > 0 ? `，${totalErrors} 个失败` : ''}`);
      setIsImportDialogOpen(false);
      setUploadFiles([]);
      loadUseCases();
      loadCategories();
      loadStats();
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('文件处理失败');
    }
  };

  return (
    <div className="container mx-auto py-6 ">
      <div className="space-y-6 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <Lightbulb className="h-8 w-8 text-blue-600" />
              案例管理
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-200">
              管理系统案例，包括创建、编辑和批量导入
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  批量导入
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>批量导入案例</DialogTitle>
                  <DialogDescription>
                    可以通过JSON数据或上传文件的方式批量导入案例
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fileUpload">上传JSON文件</Label>
                      <Input
                        id="fileUpload"
                        type="file"
                        multiple
                        accept=".json"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 mt-1">支持多个JSON文件同时上传</p>
                    </div>
                    <div>
                      <Label>或者直接粘贴JSON数据</Label>
                      <Textarea
                        value={importData}
                        onChange={(e) => setImportData(e.target.value)}
                        placeholder='[{"title": "案例标题", "summary": "案例摘要", ...}]'
                        className="h-32"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleImportJson} disabled={!importData.trim()}>
                    导入数据
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button 
              onClick={() => router.push('/backend/use-cases/create')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              创建案例
            </Button>
          </div>
        </div>

        {/* 统计信息卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总案例数</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                所有案例总数
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已发布</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.published}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.published / stats.total) * 100) : 0}% 发布率
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">草稿</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.draft}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.draft / stats.total) * 100) : 0}% 待发布
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">分类数</CardTitle>
              <FolderOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
              <p className="text-xs text-muted-foreground">
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-xs"
                  onClick={() => router.push('/backend/use-cases/categories')}
                >
                  管理分类
                </Button>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 搜索和过滤 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
              <Input
                placeholder="搜索案例标题或摘要..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={handleCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有分类</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.nameZh || category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* 批量操作按钮 */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="mr-2">
                已选择 {selectedIds.length} 项
              </Badge>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleBulkPublish}
                disabled={bulkLoading}
              >
                {bulkLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                批量发布
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleBulkUnpublish}
                disabled={bulkLoading}
              >
                {bulkLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                批量取消发布
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={handleBulkDelete}
                disabled={bulkLoading}
              >
                {bulkLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                批量删除
              </Button>
            </div>
          )}
        </div>

        {/* Cases Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>案例列表</CardTitle>
               
              </div>
            </div>
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
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedIds.length === useCases.length && useCases.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-1/3">标题</TableHead>
                    <TableHead className="w-1/4">摘要</TableHead>
                    <TableHead className="w-24">状态</TableHead>
                    <TableHead className="w-32">发布时间</TableHead>
                    <TableHead className="w-32">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {useCases.map((useCase) => (
                    <TableRow key={useCase.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(useCase.id)}
                          onCheckedChange={() => handleSelectItem(useCase.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-sm">
                            {useCase.titleZh || '无标题'}
                          </p>
                          
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-600 truncate">
                            {useCase.summaryZh || '无摘要'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={useCase.isPublished ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => handleTogglePublish(useCase.id)}
                        >
                          {useCase.isPublished ? '已发布' : '草稿'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          {useCase.publishedAt ? 
                            new Date(useCase.publishedAt).toLocaleDateString('zh-CN') : 
                            '-'
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/backend/use-cases/${useCase.id}`)}
                            title="查看详情"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/backend/use-cases/edit/${useCase.id}`)}
                            title="编辑案例"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUseCase(useCase.id)}
                            className="text-red-600 hover:text-red-700"
                            title="删除案例"
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

            {!loading && useCases.length === 0 && (
              <div className="text-center py-8">
                <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无案例</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || selectedCategory !== 'all' 
                    ? '没有找到匹配的案例' 
                    : '还没有创建任何案例'
                  }
                </p>
                <Button onClick={() => router.push('/backend/use-cases/create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  创建第一个案例
                </Button>
              </div>
            )}

            {/* 分页 */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 