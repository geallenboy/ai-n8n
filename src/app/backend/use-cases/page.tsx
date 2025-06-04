'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
  Calendar,
  Tag,
  ToggleLeft,
  ToggleRight,
  Globe,
  User,
  FileText,
  CheckCircle,
  Clock,
  PieChart
} from 'lucide-react';
import { 
  getUseCases, 
  deleteUseCase, 
  toggleUseCasePublishStatus,
  getUseCaseCategories,
  createUseCaseCategory,
  importUseCasesFromJson,
  getUseCaseStats
} from '@/features/use-cases/actions/usecase-actions';
import { toast } from 'sonner';

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

export default function UseCasesManagePage() {
  const router = useRouter();
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<{ total: number; published: number; draft: number; byCategory: Record<string, number> }>({ 
    total: 0, 
    published: 0, 
    draft: 0, 
    byCategory: {} 
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState('');
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
 
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    nameZh: '',
    description: '',
    descriptionZh: '',
  });

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
                  <FileText className="h-4 w-4" />
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
                    <div className="flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <div className="text-lg font-medium">或</div>
                        <div className="text-sm">手动输入JSON数据</div>
                      </div>
                    </div>
                  </div>
        
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总案例数</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                系统中的所有案例
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已发布</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
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
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.draft}</div>
              <p className="text-xs text-muted-foreground">
                待发布的案例
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">分类数</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
              <p className="text-xs text-muted-foreground">
                可用分类数量
              </p>
            </CardContent>
          </Card>
        </div>
                  <div>
                    <Label htmlFor="jsonData">JSON数据</Label>
                    <Textarea
                      id="jsonData"
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                      placeholder="请输入JSON数据，支持单个对象或对象数组..."
                      className="min-h-64 font-mono text-sm"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    <p><strong>支持的字段：</strong></p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li><code>title</code> (必需) - 英文标题</li>
                      <li><code>title_zh</code> - 中文标题</li>
                      <li><code>url</code> - 原始链接</li>
                      <li><code>author</code> - 作者</li>
                      <li><code>publish_date</code> - 发布日期显示</li>
                      <li><code>publish_date_absolute</code> - 发布日期 (YYYY-MM-DD)</li>
                      <li><code>categories</code> - 分类数组，格式：数组对象包含name字段</li>
                      <li><code>workflow_json</code> - 工作流JSON字符串</li>
                      <li><code>readme</code> - 英文说明</li>
                      <li><code>readme_zh</code> - 中文说明</li>
                    </ul>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleImportJson}>
                    导入数据
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          
            
            <Button 
              variant="outline"
              onClick={() => router.push('/backend/use-cases/categories')}
              className="flex items-center gap-2"
            >
              <Tag className="h-4 w-4" />
              管理分类
            </Button>
            
            <Button 
              onClick={() => router.push('/backend/use-cases/create')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              添加案例
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>搜索和筛选</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                  <SelectItem value="all">全部分类</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.nameZh || category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Use Cases Table */}
        <Card>
          <CardHeader>
            <CardTitle>案例列表</CardTitle>
            <CardDescription>
              共 {useCases.length} 个案例
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
                    <TableHead className="w-2/5">案例标题</TableHead>
                    <TableHead className="w-1/6">作者</TableHead>
                    <TableHead className="w-1/6">状态</TableHead>
                    <TableHead className="w-1/6">发布时间</TableHead>
                    <TableHead className="w-1/6">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {useCases.map((useCase) => (
                    <TableRow key={useCase.id}>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          {useCase.coverImageUrl && (
                            <img 
                              src={useCase.coverImageUrl} 
                              alt={useCase.title}
                              className="w-16 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {useCase.titleZh || ""}
                            </div>
                           
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {useCase.n8nAuthor ? (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{useCase.n8nAuthor}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">未知</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={useCase.isPublished ? "default" : "secondary"} className="flex items-center gap-1 w-fit">
                          {useCase.isPublished ? (
                            <>
                              <Eye className="h-3 w-3" />
                              已发布
                            </>
                          ) : (
                            <>
                              <Edit className="h-3 w-3" />
                              草稿
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {useCase.publishedAt 
                            ? new Date(useCase.publishedAt).toLocaleDateString('zh-CN')
                            : '未发布'
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
                            onClick={() => handleTogglePublish(useCase.id)}
                          >
                            {useCase.isPublished ? (
                              <ToggleLeft className="h-4 w-4" />
                            ) : (
                              <ToggleRight className="h-4 w-4" />
                            )}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="text-sm text-gray-500">
                  第 {currentPage} 页，共 {totalPages} 页 · 显示 {useCases.length} 个案例
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    首页
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    上一页
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    下一页
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    末页
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 