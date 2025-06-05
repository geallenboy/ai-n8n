'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, BookOpen, Loader2, Plus } from 'lucide-react';
import { getTutorialModuleById, updateTutorialModule, getTutorialSections } from '@/features/tutorial/actions/tutorial-actions';
import { AdvancedMarkdownEditor } from '@/features/common';
import { toast } from 'sonner';

interface TutorialModule {
  id: string;
  sectionId: string;
  title: string;
  titleZh?: string | null;
  description: string | null;
  descriptionZh?: string | null;
  content?: string | null;
  contentZh?: string | null;
  videoUrl: string | null;
  estimatedTimeMinutes: number | null;
  order: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  sectionTitle?: string | null;
  learningObjectives?: string[] | null;
  difficulty?: string | null;
}

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

export default function TutorialModuleEditPage() {
  const params = useParams();
  const router = useRouter();
  const [module, setModule] = useState<TutorialModule | null>(null);
  const [sections, setSections] = useState<TutorialSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    sectionId: '',
    titleZh: '',
    descriptionZh: '',
    contentZh: '',
    videoUrl: '',
    estimatedTimeMinutes: 0,
    order: 1,
    difficulty: '',
    learningObjectives: [] as string[],
  });

  useEffect(() => {
    loadModule();
    loadSections();
  }, [params.id]);

  const loadModule = async () => {
    try {
      setLoading(true);
      const result = await getTutorialModuleById(params.id as string);
      if (result.success && result.data) {
        const moduleData = result.data;
        setModule(moduleData);
        setFormData({ 
          sectionId: moduleData.sectionId,
          titleZh: moduleData.titleZh || '',
          descriptionZh: moduleData.descriptionZh || '',
          contentZh: moduleData.contentZh || '',
          videoUrl: moduleData.videoUrl || '',
          estimatedTimeMinutes: moduleData.estimatedTimeMinutes || 0,
          order: moduleData.order,
          difficulty: moduleData.difficulty || '',
          learningObjectives: moduleData.learningObjectives || [],
        });
      } else {
        toast.error(result.error || '加载教程模块失败');
        router.push('/backend/tutorial');
      }
    } catch (error) {
      console.error('Error loading module:', error);
      toast.error('加载教程模块失败');
      router.push('/backend/tutorial');
    } finally {
      setLoading(false);
    }
  };

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

  const handleSave = async () => {
    if (!module) return;
    
    try {
      if (!formData.titleZh.trim()) {
        toast.error('请填写模块标题');
        return;
      }

      if (!formData.sectionId) {
        toast.error('请选择所属版块');
        return;
      }

      setSaving(true);
      
      // 准备需要翻译的字段
      const fieldsToTranslate: Record<string, string> = {};
      if (formData.titleZh.trim()) {
        fieldsToTranslate.title = formData.titleZh;
      }
      if (formData.descriptionZh.trim()) {
        fieldsToTranslate.description = formData.descriptionZh;
      }
      if (formData.contentZh.trim()) {
        fieldsToTranslate.content = formData.contentZh;
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
      const updateData = {
        ...formData,
        // 英文字段（翻译后的）
        title: translatedFields.title ,
        description: translatedFields.description || '',
        content: translatedFields.content || '',
        // 中文字段（原始内容）
        titleZh: formData.titleZh,
        descriptionZh: formData.descriptionZh,
        contentZh: formData.contentZh
      };
      
      const result = await updateTutorialModule(module.id, updateData);
      if (result.success) {
        toast.success('教程模块更新成功');
        router.push('/backend/tutorial');
      } else {
        toast.error(result.error || '更新教程模块失败');
      }
    } catch (error) {
      console.error('Error updating module:', error);
      toast.error('更新教程模块失败');
    } finally {
      setSaving(false);
    }
  };

  const handleObjectivesChange = (objectivesString: string) => {
    const objectives = objectivesString.split('\n').map(obj => obj.trim()).filter(Boolean);
    setFormData({ ...formData, learningObjectives: objectives });
  };

  const handleCancel = () => {
    if (confirm('确定要取消编辑吗？未保存的内容将丢失。')) {
      router.push('/backend/tutorial');
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

  if (!module) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">教程模块不存在</p>
          <Button onClick={() => router.push('/backend/tutorial')} className="mt-4">
            返回教程列表
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
            返回列表
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              编辑教程模块
            </h1>
            <p className="mt-2 text-gray-600">
              编辑教程模块：{module.titleZh}
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
            填写教程模块的基本信息，保存时系统会自动将中文内容翻译成英文
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">模块标题 *</Label>
              <Input
                id="title"
                value={formData.titleZh}
                onChange={(e) => setFormData({ ...formData, titleZh: e.target.value })}
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
                        <span>{section.titleZh}</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="difficulty">难度等级</Label>
              <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="选择难度" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">初级</SelectItem>
                  <SelectItem value="intermediate">中级</SelectItem>
                  <SelectItem value="advanced">高级</SelectItem>
                </SelectContent>
              </Select>
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
            value={formData.descriptionZh}
            onChange={(value) => setFormData({ ...formData, descriptionZh: value })}
            placeholder="请输入模块描述..."
            minHeight={200}
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
            value={formData.contentZh}
            onChange={(value) => setFormData({ ...formData, contentZh: value })}
            placeholder="请输入模块内容..."
            minHeight={500}
          />
        </CardContent>
      </Card>

      {/* 学习目标 */}
      <Card>
        <CardHeader>
          <CardTitle>学习目标</CardTitle>
          <CardDescription>
            设置学习者完成本模块后应达到的目标（每行一个目标）
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="learningObjectives">学习目标</Label>
            <textarea
              id="learningObjectives"
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              value={formData.learningObjectives.join('\n')}
              onChange={(e) => handleObjectivesChange(e.target.value)}
              placeholder="每行输入一个学习目标，例如：&#10;• 理解 N8N 基本概念&#10;• 掌握节点连接方法&#10;• 学会创建简单工作流"
            />
            <p className="text-sm text-gray-500 mt-2">
              每行输入一个学习目标，建议以动词开头，如"理解"、"掌握"、"学会"等
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 