'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Edit, 
  ExternalLink,
  Calendar,
  Tag,
  Globe,
  FileText,
  Loader2
} from 'lucide-react';
import { getBlogById } from '@/features/blogs/actions/blog-actions';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { BlogType } from '@/features/blogs';


export default function BlogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;

  const [blog, setBlog] = useState<BlogType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadBlog();
  }, [blogId]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      const result = await getBlogById(blogId);
      
      if (result.success && result.data) {
        setBlog(result.data);
      } else {
        toast.error(result.error || '博客不存在');
        router.push('/backend/blogs');
      }
    } catch (error) {
      console.error('Error loading blog:', error);
      toast.error('加载博客失败');
      router.push('/backend/blogs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>加载中...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">博客不存在</h1>
          <Button onClick={() => router.push('/backend/blogs')}>
            返回博客列表
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/backend/blogs')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回列表
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">博客详情</h1>
            <p className="text-gray-600">查看博客的详细信息和内容</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {blog.url && (
            <Button 
              variant="outline"
              onClick={() => window.open(blog.url!, '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              访问原文
            </Button>
          )}
          <Button 
            onClick={() => router.push(`/backend/blogs/${blog.id}/edit`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            编辑博客
          </Button>
        </div>
      </div>

      {/* Blog Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            {blog.thumbnail && (
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{blog.title}</CardTitle>
              {blog.titleZh && (
                <CardDescription className="text-lg mb-2">{blog.titleZh}</CardDescription>
              )}
              {blog.excerpt && (
                <p className="text-gray-600 mb-3">{blog.excerpt}</p>
              )}
              {blog.excerptZh && (
                <p className="text-gray-600 mb-3">{blog.excerptZh}</p>
              )}
              
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {blog.category && (
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    <Badge variant="secondary">{blog.category.name}</Badge>
                  </div>
                )}
                {blog.crawledAt && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <span>爬取于: {new Date(blog.crawledAt).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>创建于: {new Date(blog.createdAt!).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Tags */}
              {blog.tags&&blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {blog.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Content Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>博客内容</CardTitle>
          <CardDescription>
            查看博客的详细内容和说明
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                概览
              </TabsTrigger>
              <TabsTrigger value="readme" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                英文内容
              </TabsTrigger>
              <TabsTrigger value="readme-zh" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                中文内容
              </TabsTrigger>
              <TabsTrigger value="raw" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                原始数据
              </TabsTrigger>
            </TabsList>

            {/* 概览 Tab */}
            <TabsContent value="overview" className="mt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">基本信息</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>标题:</strong> {blog.title}</div>
                      {blog.titleZh && <div><strong>中文标题:</strong> {blog.titleZh}</div>}
                      {blog.url && (
                        <div>
                          <strong>原文链接:</strong> 
                          <a href={blog.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                            {blog.url}
                          </a>
                        </div>
                      )}
                      {blog.category && <div><strong>分类:</strong> {blog.category.name}</div>}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">统计信息</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>标签数量:</strong> {blog.tags&&blog.tags.length}</div>
                      <div><strong>英文内容:</strong> {blog.readme ? '有' : '无'}</div>
                      <div><strong>中文内容:</strong> {blog.readmeZh ? '有' : '无'}</div>
                      <div><strong>缩略图:</strong> {blog.thumbnail ? '有' : '无'}</div>
                    </div>
                  </div>
                </div>

                {(blog.excerpt || blog.excerptZh) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">摘要</h3>
                    {blog.excerpt && (
                      <div className="mb-3">
                        <h4 className="font-medium mb-2">英文摘要:</h4>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded">{blog.excerpt}</p>
                      </div>
                    )}
                    {blog.excerptZh && (
                      <div>
                        <h4 className="font-medium mb-2">中文摘要:</h4>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded">{blog.excerptZh}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* 英文内容 Tab */}
            <TabsContent value="readme" className="mt-6">
              {blog.readme ? (
                <div className="prose max-w-none">
                  <ReactMarkdown>
                    {blog.readme}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  暂无英文内容
                </div>
              )}
            </TabsContent>

            {/* 中文内容 Tab */}
            <TabsContent value="readme-zh" className="mt-6">
              {blog.readmeZh ? (
                <div className="prose max-w-none">
                  <ReactMarkdown>
                    {blog.readmeZh}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  暂无中文内容
                </div>
              )}
            </TabsContent>

            {/* 原始数据 Tab */}
            <TabsContent value="raw" className="mt-6">
              <div className="bg-gray-50 p-4 rounded-lg overflow-auto">
                <pre className="text-sm">
                  {JSON.stringify(blog, null, 2)}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 