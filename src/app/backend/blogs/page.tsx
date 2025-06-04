'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Loader2,
  Send,
  SquareX
} from 'lucide-react';
import { 
  getBlogs, 
  deleteBlog, 
  getBlogCategories,
  createBlogCategory,
  getBlogStats,
  importBlogsFromJson,
  updateBlog
} from '@/features/blogs/actions/blog-actions';
import {
  BlogType,
  BlogCategoryType,
  BlogStatsType,
  CategoryFormDataType,
  ImportStateType,
  BlogImportResultType
} from '@/features/blogs/types';
import {
  BlogStatsCards,
  BlogFilters,
  CreateCategoryDialog,
  ImportBlogsDialog,
  BlogPagination
} from '@/features/blogs/components';
import { toast } from 'sonner';

export default function BlogsManagePage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [categories, setCategories] = useState<BlogCategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<BlogStatsType>({ total: 0, byCategory: {}, byMonth: {} });
  
  // Dialog states
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  
  // Form states
  const [categoryFormData, setCategoryFormData] = useState<CategoryFormDataType>({
    name: '',
    nameZh: '',
    description: '',
    descriptionZh: '',
  });
  
  const [importData, setImportData] = useState<ImportStateType>({
    file: null,
    jsonData: [],
    importing: false,
  });

  useEffect(() => {
    loadBlogs();
    loadCategories();
    loadStats();
  }, [currentPage, searchTerm, selectedCategory, selectedTags]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const result = await getBlogs({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        categoryId: selectedCategory === 'all' ? undefined : selectedCategory,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      });
      
      if (result.success && result.data) {
        setBlogs(result.data.blogs);
        setTotalPages(result.data.totalPages);
      } else {
        console.error('Error fetching blogs:', result.error);
        toast.error(result.error || '加载博客失败');
        setBlogs([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
      toast.error('数据库连接失败，请检查数据库配置');
      setBlogs([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const result = await getBlogCategories();
      if (result.success && result.data) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadStats = async () => {
    try {
      const result = await getBlogStats();
      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm('确定要删除这篇博客吗？此操作不可撤销。')) {
      return;
    }

    try {
      const result = await deleteBlog(blogId);
      if (result.success) {
        toast.success('博客删除成功');
        loadBlogs();
        loadStats();
      } else {
        toast.error(result.error || '删除博客失败');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('删除博客失败');
    }
  };

  const handleCreateCategory = async () => {
    try {
      if (!categoryFormData.nameZh) {
        toast.error('请输入分类名称');
        return;
      }

      const result = await createBlogCategory(categoryFormData);
      if (result.success) {
        toast.success('分类创建成功');
        setIsCategoryDialogOpen(false);
        setCategoryFormData({ name: '', nameZh: '', description: '', descriptionZh: '' });
        loadCategories();
      } else {
        toast.error(result.error || '创建分类失败');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('创建分类失败');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      toast.error('请选择JSON文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        if (!Array.isArray(jsonData)) {
          throw new Error('JSON文件格式不正确，应该是一个数组');
        }
        setImportData(prev => ({
          ...prev,
          file,
          jsonData
        }));
      } catch (error) {
        console.error('Error parsing JSON:', error);
        toast.error('JSON文件格式错误');
      }
    };
    reader.readAsText(file);
  };

  const handleImportBlogs = async () => {
    if (!importData.jsonData.length) {
      toast.error('请先选择要导入的JSON文件');
      return;
    }

    try {
      setImportData(prev => ({ ...prev, importing: true }));
      const result = await importBlogsFromJson(importData.jsonData);
      if (result.success) {
        toast.success(`成功导入 ${result.data?.imported || 0} 篇博客`);
        setIsImportDialogOpen(false);
        setImportData({ file: null, jsonData: [], importing: false });
        loadBlogs();
        loadStats();
      } else {
        toast.error(result.error || '导入失败');
      }
    } catch (error) {
      console.error('Error importing blogs:', error);
      toast.error('导入失败');
    } finally {
      setImportData(prev => ({ ...prev, importing: false }));
    }
  };

  const handlePublishBlog = async (blogId: string, currentStatus: boolean) => {
    const action = currentStatus ? '取消发布' : '发布';
    
    if (!confirm(`确定要${action}这篇博客吗？`)) {
      return;
    }

    try {
      const updateData = {
        isPublished: !currentStatus,
        publishedAt: !currentStatus ? new Date() : undefined,
      };

      const result = await updateBlog(blogId, updateData);
      if (result.success) {
        toast.success(`博客${action}成功`);
        loadBlogs();
        loadStats();
      } else {
        toast.error(result.error || `${action}失败`);
      }
    } catch (error) {
      console.error(`Error ${action} blog:`, error);
      toast.error(`${action}失败`);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-600" />
            博客管理
          </h1>
          <p className="mt-2 text-gray-600">
            管理系统博客，包括创建、编辑和批量导入
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => router.push('/backend/blogs/categories')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            分类管理
          </Button>

          <ImportBlogsDialog
            isOpen={isImportDialogOpen}
            onOpenChange={setIsImportDialogOpen}
            importState={importData}
            onFileUpload={handleFileUpload}
            onImport={handleImportBlogs}
          />
          
          <Button 
            onClick={() => router.push('/backend/blogs/create')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            添加博客
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <BlogStatsCards
        stats={stats}
        categories={categories}
        currentPageCount={blogs.length}
      />

      {/* Filters */}
      <BlogFilters
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        categories={categories}
        onSearchChange={handleSearch}
        onCategoryChange={handleCategoryFilter}
      />

      {/* Blogs Table */}
      <Card>
        <CardHeader>
          <CardTitle>博客列表</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              暂无博客数据
            </div>
          ) : (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div key={blog.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-4">
                    {blog.thumbnail && (
                      <img
                        src={blog.thumbnail}
                        alt={blog.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {blog.titleZh || blog.title}
                            </h3>
                            {blog.isPublished ? (
                              <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
                                已发布
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">
                                未发布
                              </Badge>
                            )}
                          </div>
                          {blog.titleZh && (
                            <p className="text-gray-600 truncate">{blog.titleZh}</p>
                          )}
                          {blog.excerptZh && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {blog.excerptZh}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            {blog.category && (
                              <Badge variant="secondary">{blog.category.nameZh }</Badge>
                            )}
                            {blog.isPublished && blog.publishedAt && (
                              <span>发布于: {new Date(blog.publishedAt).toLocaleDateString()}</span>
                            )}
                            {blog.crawledAt && (
                              <span>爬取于: {new Date(blog.crawledAt).toLocaleDateString()}</span>
                            )}
                            <span>创建于: {new Date(blog.createdAt!).toLocaleDateString()}</span>
                          </div>
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {blog.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {blog.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{blog.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant={blog.isPublished ? "outline" : "default"}
                            size="sm"
                            onClick={() => handlePublishBlog(blog.id, blog.isPublished || false)}
                            title={blog.isPublished ? "取消发布" : "发布博客"}
                            className={blog.isPublished ? "text-orange-600 hover:text-orange-700" : "bg-green-600 hover:bg-green-700 text-white"}
                          >
                            {blog.isPublished ? (
                              <SquareX className="h-4 w-4" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                          {blog.url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(blog.url!, '_blank')}
                              title="访问原文"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/backend/blogs/${blog.id}`)}
                            title="查看详情"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/backend/blogs/${blog.id}/edit`)}
                            title="编辑博客"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBlog(blog.id)}
                            title="删除博客"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <BlogPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}