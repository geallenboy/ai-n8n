'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, BookOpen, Plus } from 'lucide-react';
import { createTutorialModule, getTutorialSections } from '@/features/tutorial/actions/tutorial-actions';
import { toast } from 'sonner';
import { AdvancedMarkdownEditor } from '@/features/common';

interface TutorialSection {
  id: string;
  title: string;
  titleZh?: string | null;
  description: string | null;
  descriptionZh?: string | null;
  order: number;
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

export default function CreateTutorialModulePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<TutorialSection[]>([]);
  const [formData, setFormData] = useState({
    sectionId: '',
    title: '',
    description: '',
    content: '',
    videoUrl: '',
    estimatedTimeMinutes: 0,
    order: 1,
  });

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const result = await getTutorialSections();
      if (result.success && result.data) {
        setSections(result.data);
      }
    } catch (error) {
      console.error('Error loading sections:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('请输入模块标题');
      return;
    }

    if (!formData.sectionId) {
      toast.error('请选择教程管理');
      return;
    }

    setLoading(true);
    try {
      // 准备需要翻译的字段
      const fieldsToTranslate: Record<string, string> = {};
      if (formData.title.trim()) {
        fieldsToTranslate.title = formData.title; // 中文内容翻译为英文
      }
      if (formData.description.trim()) {
        fieldsToTranslate.description = formData.description; // 中文内容翻译为英文
      }
      if (formData.content.trim()) {
        fieldsToTranslate.content = formData.content; // 中文内容翻译为英文
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

      // 合并表单数据和翻译结果
      const submitData = {
        ...formData,
        // 英文字段（翻译后的）
        title: translatedFields.title || formData.title,
        description: translatedFields.description || '',
        content: translatedFields.content || '',
        // 中文字段（原始内容）
        titleZh: formData.title,
        descriptionZh: formData.description,
        contentZh: formData.content
      };

      const result = await createTutorialModule(submitData);
      if (result.success) {
        toast.success('教程管理创建成功');
        router.push('/backend/tutorial');
      } else {
        toast.error(result.error || '创建教程管理失败');
      }
    } catch (error) {
      console.error('Error creating tutorial module:', error);
      toast.error('创建教程管理失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm('确定要取消创建吗？未保存的内容将丢失。')) {
      router.push('/backend/tutorial');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              创建教程管理
            </h1>
            <p className="mt-2 text-gray-600">
              创建新的教程管理内容，保存时系统会自动将中文内容翻译成英文
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? '创建中...' : '创建模块'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>
              填写教程管理的基本信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">模块标题 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="请输入模块标题"
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="sectionId">所属板块 *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/backend/tutorial/sections/create')}
                    className="text-xs h-6 px-2"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    新建板块
                  </Button>
                </div>
                <Select value={formData.sectionId} onValueChange={(value) => setFormData({ ...formData, sectionId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择教程板块" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{section.title}</span>
                          <span className="text-xs text-muted-foreground ml-2">排序: {section.order}</span>
                        </div>
                      </SelectItem>
                    ))}
                    {sections.length === 0 && (
                      <SelectItem value="no-sections" disabled>
                        暂无板块，请先创建板块
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {sections.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    暂无可用板块，请先 
                    <button 
                      type="button"
                      onClick={() => router.push('/backend/tutorial/sections/create')}
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      创建板块
                    </button>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="videoUrl">视频链接（可选）</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="请输入视频链接"
                />
              </div>
              <div>
                <Label htmlFor="estimatedTimeMinutes">预计教程时间（分钟）</Label>
                <Input
                  id="estimatedTimeMinutes"
                  type="number"
                  min="0"
                  value={formData.estimatedTimeMinutes}
                  onChange={(e) => setFormData({ ...formData, estimatedTimeMinutes: parseInt(e.target.value) || 0 })}
                  placeholder="请输入预计教程时间"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="order">排序顺序</Label>
              <Input
                id="order"
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                placeholder="请输入排序顺序"
              />
            </div>
          </CardContent>
        </Card>

        {/* 模块描述 */}
        <Card>
          <CardHeader>
            <CardTitle>模块描述</CardTitle>
            <CardDescription>
              简要描述模块内容和教程目标
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdvancedMarkdownEditor
              label="模块描述"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="请输入模块描述..."
              height={200}
            />
          </CardContent>
        </Card>

        {/* 模块内容 */}
        <Card>
          <CardHeader>
            <CardTitle>模块内容</CardTitle>
            <CardDescription>
              使用Markdown格式编写详细的教程内容
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdvancedMarkdownEditor
              label="模块内容"
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="请输入模块内容..."
              height={500}
            />
          </CardContent>
        </Card>
      </form>
    </div>
  );
} 