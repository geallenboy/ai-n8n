'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  Save, 
  FileText,
  Loader2
} from 'lucide-react';
import { getBlogById, updateBlog, getBlogCategories } from '@/features/blogs/actions/blog-actions';
import { BlogCategoryType } from '@/features/blogs/types';
import { AdvancedMarkdownEditor } from '@/features/common';
import { toast } from 'sonner';
import CoverImageUpload from '@/components/ui/cover-image-upload';

interface Blog {
  id: string;
  url: string | null;
  title: string;
  titleZh?: string | null;
  excerpt?: string | null;
  excerptZh?: string | null;
  thumbnail?: string | null;
  tags?: string[];
  readme?: string | null;
  readmeZh?: string | null;
  crawledAt?: Date | null;
  categoryId?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  category?: {
    id: string;
    name: string;
    description?: string | null;
  } | null;
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

export default function BlogEditPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [categories, setCategories] = useState<BlogCategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    titleZh: '',
    excerpt: '',
    excerptZh: '',
    thumbnail: '',
    tags: [] as string[],
    readme: '',
    readmeZh: '',
    crawledAt: '',
    categoryId: 'none',
    coverImageUrl: '',
  });

  useEffect(() => {
    loadBlog();
    loadCategories();
  }, [params.id]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      const result = await getBlogById(params.id as string);
      if (result.success && result.data) {
        const blogData = result.data;
        setBlog(blogData);
        setFormData({
          url: blogData.url || '',
          title:  blogData.title, // 优先显示中文标题
          titleZh: blogData.titleZh||'',
          excerpt: blogData.excerpt || '',
          excerptZh: blogData.excerptZh|| '',
          thumbnail: blogData.thumbnail || '',
          tags: blogData.tags || [],
          readme: blogData.readme || '',
          readmeZh: blogData.readmeZh || '',
          crawledAt: blogData.crawledAt ? new Date(blogData.crawledAt).toISOString().slice(0, 16) : '',
          categoryId: blogData.categoryId || 'none',
          coverImageUrl: blogData.coverImageUrl || '',
        });
      } else {
        toast.error(result.error || '加载博客失败');
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

  const handleSave = async () => {
    if (!blog) return;
    
    try {
      if (!formData.url || !formData.title) {
        toast.error('请填写URL和标题');
        return;
      }

      setSaving(true);
      
      // 准备需要翻译的字段
      const fieldsToTranslate: Record<string, string> = {};
      if (formData.titleZh.trim()) {
        fieldsToTranslate.title = formData.titleZh; // 中文内容翻译为英文
      }
      if (formData.excerptZh.trim()) {
        fieldsToTranslate.excerpt = formData.excerptZh; // 中文内容翻译为英文
      }
      if (formData.readmeZh.trim()) {
        fieldsToTranslate.readme = formData.readmeZh; // 中文内容翻译为英文
      }

      // 调用DeepSeek API进行翻译
      let translatedFields: Record<string, string> = {};
      if (Object.keys(fieldsToTranslate).length > 0) {
        try {
          translatedFields = await translateFieldsToEnglish(fieldsToTranslate);
        } catch (error) {
          console.error('Translation failed:', error);
          toast.error('翻译失败，将保存中文内容');
          // 翻译失败时使用中文内容作为英文内容
          translatedFields = fieldsToTranslate;
        }
      }

      const updateData = {
        ...formData,
        // 英文字段（翻译后的）
        title: translatedFields.title,
        excerpt: translatedFields.excerpt || '',
        readme: translatedFields.readme || '',
        // 中文字段（原始内容）
        titleZh: formData.titleZh,
        excerptZh: formData.excerptZh,
        readmeZh: formData.readmeZh,
        crawledAt: formData.crawledAt ? new Date(formData.crawledAt) : undefined,
        categoryId: formData.categoryId === 'none' ? undefined : formData.categoryId,
        coverImageUrl: formData.coverImageUrl || '',
      };

      const result = await updateBlog(blog.id, updateData);
      if (result.success) {
        toast.success('博客更新成功');
        router.push(`/backend/blogs/${blog.id}`);
      } else {
        toast.error(result.error || '更新博客失败');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('更新博客失败');
    } finally {
      setSaving(false);
    }
  };

  const handleTagsChange = (tagString: string) => {
    const tags = tagString.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData({ ...formData, tags });
  };

  const handleCancel = () => {
    if (confirm('确定要取消编辑吗？未保存的内容将丢失。')) {
      router.push(`/backend/blogs/${blog?.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">博客不存在</p>
          <Button onClick={() => router.push('/backend/blogs')} className="mt-4">
            返回博客列表
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回详情
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              编辑博客
            </h1>
            <p className="mt-2 text-gray-600">
              修改博客信息和内容，保存时系统会自动将中文内容翻译成英文
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                更新中...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                保存更改
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
          <CardDescription>
            编辑博客的基本信息
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="url">博客URL *</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com/blog-post"
              />
            </div>
            <div>
              <CoverImageUpload
                value={formData.coverImageUrl || formData.thumbnail || ''}
                onChange={(url) => setFormData({ ...formData, coverImageUrl: url, thumbnail: url })}
                label="封面图片"
                description="为博客添加封面图片，支持拖拽上传或URL输入"
                placeholder="请输入封面图片URL或上传图片"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">博客标题 *</Label>
              <Input
                id="title"
                value={formData.titleZh}
                onChange={(e) => setFormData({ ...formData, titleZh: e.target.value })}
                placeholder="请输入博客标题"
              />
            </div>
            <div>
              <Label htmlFor="categoryId">分类</Label>
              <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">无分类</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.nameZh}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="excerpt">博客摘要</Label>
            <Textarea
              id="excerpt"
              value={formData.excerptZh}
              onChange={(e) => setFormData({ ...formData, excerptZh: e.target.value })}
              placeholder="请输入博客摘要"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="tags">标签（用逗号分隔）</Label>
            <Input
              id="tags"
              value={formData.tags.join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="例如：技术, 教程, n8n"
            />
          </div>

          <div>
            <Label htmlFor="crawledAt">发布时间</Label>
            <Input
              id="crawledAt"
              type="datetime-local"
              value={formData.crawledAt}
              onChange={(e) => setFormData({ ...formData, crawledAt: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* 博客内容 */}
      <Card>
        <CardHeader>
          <CardTitle>博客内容</CardTitle>
          <CardDescription>
            使用Markdown格式编写博客内容
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="w-full">
            <AdvancedMarkdownEditor
              label="博客内容"
              value={formData.readmeZh}
              onChange={(value) => setFormData({ ...formData, readmeZh: value })}
              placeholder="请输入博客内容（支持Markdown格式）..."
              minHeight={600}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 