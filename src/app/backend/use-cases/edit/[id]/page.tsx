'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';


import { 
  ArrowLeft, 
  Save, 
  Eye,
  FileText,
  Code,
  BookOpen,
  Lightbulb,
  Sparkles,
  Loader2
} from 'lucide-react';
import { 
  getUseCaseById, 
  updateUseCase,
  getUseCaseCategories
} from '@/features/use-cases/actions/usecase-actions';
import { toast } from 'sonner';
import { AdvancedMarkdownEditor } from '@/features/common';
import N8nWorkflowPreview from '@/features/common/components/n8n-workflow-preview';

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
  categories?: Array<{
    id: string;
    name: string;
    nameZh: string | null;
  }>;
}

interface Category {
  id: string;
  name: string;
  nameZh: string | null;
  description: string | null;
  descriptionZh: string | null;
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

export default function EditUseCasePage() {
  const router = useRouter();
  const params = useParams();
  const useCaseId = params.id as string;

  const [useCase, setUseCase] = useState<UseCase | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  
  // AI分析状态
  const [aiLoading, setAiLoading] = useState({
    summary: false,
    interpretation: false,
    tutorial: false
  });

  const [formData, setFormData] = useState({
    title: '',
    titleZh: '',
    summary: '',
    summaryZh: '',
    readme: '',
    readmeZh: '',
    workflowInterpretation: '',
    workflowInterpretationZh: '',
    workflowTutorial: '',
    workflowTutorialZh: '',
    workflowJson: null as any,
    workflowJsonZh: null as any,
    coverImageUrl: '',
    n8nAuthor: '',
    originalUrl: '',
    isPublished: false,
  });

  useEffect(() => {
    loadUseCase();
    loadCategories();
  }, [useCaseId]);

  const loadUseCase = async () => {
    try {
      setLoading(true);
      const result = await getUseCaseById(useCaseId);
      if (result.success && result.data) {
        const data = result.data;
        setUseCase(data);
        setFormData({
          title: data.title || '',
          titleZh: data.titleZh || '',
          summary: data.summary || '',
          summaryZh: data.summaryZh || '',
          readme: data.readme || '',
          readmeZh: data.readmeZh || '',
          workflowInterpretation: data.workflowInterpretation || '',
          workflowInterpretationZh: data.workflowInterpretationZh || '',
          workflowTutorial: data.workflowTutorial || '',
          workflowTutorialZh: data.workflowTutorialZh || '',
          workflowJson: data.workflowJson,
          workflowJsonZh: data.workflowJsonZh,
          coverImageUrl: data.coverImageUrl || '',
          n8nAuthor: data.n8nAuthor || '',
          originalUrl: data.originalUrl || '',
          isPublished: data.isPublished || false,
        });
        setSelectedCategoryIds(data.categories?.map(cat => cat.id) || []);
      } else {
        toast.error('案例不存在或加载失败');
        router.push('/backend/use-cases');
      }
    } catch (error) {
      console.error('Error loading use case:', error);
      toast.error('加载案例失败');
      router.push('/backend/use-cases');
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

  const handleSave = async () => {
    if (!formData.titleZh.trim()) {
      toast.error('请输入中文案例标题');
      return;
    }

    // 确认保存操作
    const confirmSave = confirm('确定要保存案例修改吗？系统将自动翻译中文内容为英文。');
    if (!confirmSave) {
      return;
    }

    try {
      setSaving(true);
      
      // 准备需要翻译的中文字段
      const fieldsToTranslate: Record<string, string> = {};
      if (formData.titleZh) fieldsToTranslate.title = formData.titleZh;
      if (formData.summaryZh) fieldsToTranslate.summary = formData.summaryZh;
      if (formData.readmeZh) fieldsToTranslate.readme = formData.readmeZh;
      if (formData.workflowInterpretationZh) fieldsToTranslate.workflowInterpretation = formData.workflowInterpretationZh;
      if (formData.workflowTutorialZh) fieldsToTranslate.workflowTutorial = formData.workflowTutorialZh;

      // 使用DeepSeek翻译中文内容为英文
      let translatedFields: Record<string, string> = {};
      if (Object.keys(fieldsToTranslate).length > 0) {
        try {
          translatedFields = await translateFieldsToEnglish(fieldsToTranslate);
          toast.success('内容已自动翻译为英文');
        } catch (error) {
          console.error('Translation failed:', error);
          toast.warning('自动翻译失败，将使用中文内容');
          // 翻译失败时使用中文内容作为英文内容
          translatedFields = fieldsToTranslate;
        }
      }

      // 合并翻译后的数据
      const finalFormData = {
        ...formData,
        ...translatedFields
      };
      
      const result = await updateUseCase(useCaseId, finalFormData, selectedCategoryIds);
      
      if (result.success) {
        toast.success('案例更新成功');
        router.push('/backend/use-cases');
      } else {
        toast.error(result.error || '更新案例失败');
      }
    } catch (error) {
      console.error('Error updating use case:', error);
      toast.error('更新案例失败');
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategoryIds(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // AI分析功能
  const handleAISummaryGeneration = async () => {
    if (!formData.readme && !formData.readmeZh) {
      toast.error('请先填写详细说明内容');
      return;
    }

    setAiLoading(prev => ({ ...prev, summary: true }));
    try {
      const content = formData.readme || formData.readmeZh || '';
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'summary',
          content
        })
      });

      const result = await response.json();
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          summary: result.data.summary,
          summaryZh: result.data.summaryZh
        }));
        toast.success('AI摘要生成成功');
      } else {
        toast.error(result.error || 'AI摘要生成失败');
      }
    } catch (error) {
      console.error('AI summary generation error:', error);
      toast.error('AI摘要生成失败');
    } finally {
      setAiLoading(prev => ({ ...prev, summary: false }));
    }
  };

  const handleAIWorkflowInterpretation = async () => {
    if (!formData.workflowJsonZh) {
      toast.error('请先填写工作流JSON');
      return;
    }

    setAiLoading(prev => ({ ...prev, interpretation: true }));
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'workflow_interpretation',
          content: formData.readmeZh || formData.readme || '',
          workflowJson: formData.workflowJsonZh
        })
      });

      const result = await response.json();
      console.log('AI工作流解读响应:', result);
      
      if (result.success && result.data) {
        console.log('更新前的formData:', formData.workflowInterpretationZh);
        
        // 清理AI生成的内容，移除可能导致解析问题的字符
        const cleanContent = (content: string) => {
          if (!content) return '';
          return content
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .replace(/\u0000/g, '')
            .replace(/\ufffd/g, '')
            .trim();
        };
        
        setFormData(prev => {
          const newData = {
            ...prev,
            workflowInterpretation: cleanContent(result.data.workflowInterpretation || ''),
            workflowInterpretationZh: cleanContent(result.data.workflowInterpretationZh || '')
          };
          console.log('更新后的formData:', newData);
          return newData;
        });
        
        toast.success('AI工作流解读生成成功');
      } else {
        console.error('AI生成失败:', result);
        toast.error(result.error || 'AI工作流解读生成失败');
      }
    } catch (error) {
      console.error('AI workflow interpretation error:', error);
      toast.error(`AI工作流解读生成失败: ${error instanceof Error ? error.message : '网络错误'}`);
    } finally {
      setAiLoading(prev => ({ ...prev, interpretation: false }));
    }
  };

  const handleAITutorialGeneration = async () => {
    if (!formData.workflowJsonZh) {
      toast.error('请先填写工作流JSON');
      return;
    }

    setAiLoading(prev => ({ ...prev, tutorial: true }));
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'workflow_tutorial',
          content: formData.readmeZh || '',
          workflowJson: formData.workflowJsonZh
        })
      });

      const result = await response.json();
      console.log('AI工作流教程响应:', result);
      
      if (result.success && result.data) {
        console.log('更新前的formData:', formData.workflowTutorialZh);
        
        // 清理AI生成的内容，移除可能导致解析问题的字符
        const cleanContent = (content: string) => {
          if (!content) return '';
          return content
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .replace(/\u0000/g, '')
            .replace(/\ufffd/g, '')
            .trim();
        };
        
        setFormData(prev => {
          const newData = {
            ...prev,
            workflowTutorial: cleanContent(result.data.workflowTutorial || ''),
            workflowTutorialZh: cleanContent(result.data.workflowTutorialZh || '')
          };
          console.log('更新后的formData:', newData);
          return newData;
        });
        
        toast.success('AI教程案例生成成功');
      } else {
        console.error('AI生成失败:', result);
        toast.error(result.error || 'AI教程案例生成失败');
      }
    } catch (error) {
      console.error('AI tutorial generation error:', error);
      toast.error(`AI教程案例生成失败: ${error instanceof Error ? error.message : '网络错误'}`);
    } finally {
      setAiLoading(prev => ({ ...prev, tutorial: false }));
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

  if (!useCase) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">案例不存在</h1>
          <Button onClick={() => router.push('/backend/use-cases')}>
            返回案例列表
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/backend/use-cases')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回列表
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">编辑案例</h1>
            <p className="text-gray-600">修改案例信息和内容</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {useCase.isPublished && (
            <Button 
              variant="outline"
              onClick={() => window.open(`/front/use-cases/${useCase.id}`, '_blank')}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              预览
            </Button>
          )}
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? '保存中...' : '保存'}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              基本信息
            </CardTitle>
            <CardDescription>
              编辑中文案例信息，系统会自动翻译为英文
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="titleZh">案例标题 *</Label>
              <Input
                id="titleZh"
                value={formData.titleZh}
                onChange={(e) => setFormData({ ...formData, titleZh: e.target.value })}
                placeholder="请输入中文标题（将自动翻译为英文）"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="n8nAuthor">案例作者</Label>
                <Input
                  id="n8nAuthor"
                  value={formData.n8nAuthor}
                  onChange={(e) => setFormData({ ...formData, n8nAuthor: e.target.value })}
                  placeholder="请输入案例作者"
                />
              </div>
              <div>
                <Label htmlFor="coverImageUrl">封面图片URL</Label>
                <Input
                  id="coverImageUrl"
                  value={formData.coverImageUrl}
                  onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                  placeholder="请输入封面图片URL"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="originalUrl">原始链接</Label>
              <Input
                id="originalUrl"
                value={formData.originalUrl}
                onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
                placeholder="请输入原始链接"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isPublished"
                checked={formData.isPublished}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
              />
              <Label htmlFor="isPublished">发布状态</Label>
            </div>

            {/* 分类选择 */}
            <div>
              <Label className="text-sm font-medium mb-2 block">案例分类</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={selectedCategoryIds.includes(category.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleCategoryToggle(category.id)}
                  >
                    {category.nameZh || category.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 案例摘要 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              案例摘要
            </CardTitle>
            <CardDescription>
              编辑中文案例摘要，系统会自动翻译为英文
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="summaryZh">案例摘要</Label>
              <Textarea
                id="summaryZh"
                value={formData.summaryZh}
                onChange={(e) => setFormData({ ...formData, summaryZh: e.target.value })}
                placeholder="请输入中文摘要（将自动翻译为英文）..."
                rows={6}
                className="resize-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAISummaryGeneration}
                disabled={aiLoading.summary || (!formData.readmeZh && !formData.readme)}
                className="flex items-center gap-2"
              >
                {aiLoading.summary ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                AI生成摘要
              </Button>
              <span className="text-xs text-gray-500">
                基于详细说明内容自动生成摘要
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 详细说明 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              详细说明
            </CardTitle>
            <CardDescription>
              编辑中文详细说明，系统会自动翻译为英文
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdvancedMarkdownEditor
              label="详细说明"
              value={formData.readmeZh}
              onChange={(value) => setFormData({ ...formData, readmeZh: value })}
              placeholder="请输入中文详细说明（将自动翻译为英文）..."
              height={400}
            />
          </CardContent>
        </Card>

        {/* 工作流解读 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              工作流解读
            </CardTitle>
            <CardDescription>
              编辑中文工作流解读，系统会自动翻译为英文
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AdvancedMarkdownEditor
              label="工作流解读"
              value={formData.workflowInterpretationZh}
              onChange={(value) => setFormData({ ...formData, workflowInterpretationZh: value })}
              placeholder="请输入中文工作流解读（将自动翻译为英文）..."
              height={400}
            />
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAIWorkflowInterpretation}
                disabled={aiLoading.interpretation || !formData.workflowJsonZh}
                className="flex items-center gap-2"
              >
                {aiLoading.interpretation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Lightbulb className="h-4 w-4" />
                )}
                AI生成工作流解读
              </Button>
              <span className="text-xs text-gray-500">
                基于详细说明和工作流JSON自动生成解读
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 工作流教程 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              工作流教程
            </CardTitle>
            <CardDescription>
              编辑中文工作流教程，系统会自动翻译为英文
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AdvancedMarkdownEditor
              label="工作流教程"
              value={formData.workflowTutorialZh}
              onChange={(value) => setFormData({ ...formData, workflowTutorialZh: value })}
              placeholder="请输入中文工作流教程（将自动翻译为英文）..."
              height={400}
            />
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAITutorialGeneration}
                disabled={aiLoading.tutorial || !formData.workflowJsonZh}
                className="flex items-center gap-2"
              >
                {aiLoading.tutorial ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <BookOpen className="h-4 w-4" />
                )}
                AI生成工作流教程
              </Button>
              <span className="text-xs text-gray-500">
                基于详细说明和工作流JSON自动生成教程
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 工作流配置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              工作流配置
            </CardTitle>
            <CardDescription>
              编辑工作流JSON配置文件
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="workflowJsonZh">工作流 JSON</Label>
              <Textarea
                id="workflowJsonZh"
                value={formData.workflowJsonZh ? JSON.stringify(formData.workflowJsonZh, null, 2) : ''}
                onChange={(e) => {
                  try {
                    const parsed = e.target.value ? JSON.parse(e.target.value) : null;
                    setFormData({ ...formData, workflowJsonZh: parsed });
                  } catch {
                    // Invalid JSON, keep the text for editing
                  }
                }}
                placeholder="请输入工作流JSON数据"
                className="font-mono text-sm"
                rows={10}
              />
            </div>
            
            {/* 工作流预览 */}
            {formData.workflowJsonZh && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">工作流预览</h3>
                <N8nWorkflowPreview
                  workflowJson={formData.workflowJsonZh}
                  title="工作流预览"
                  description="基于工作流JSON的可视化预览"
                  height={400}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 