'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

import { ArrowLeft, Save, Lightbulb, FileText, BookOpen, Sparkles, Code } from 'lucide-react';
import { createUseCase } from '@/features/use-cases/actions/usecase-actions';
import { toast } from 'sonner';
import { AdvancedMarkdownEditor } from '@/features/common';
import N8nWorkflowPreview from '@/features/common/components/n8n-workflow-preview';

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

export default function CreateUseCasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titleZh.trim()) {
      toast.error('请输入中文案例标题');
      return;
    }

    setLoading(true);
    try {
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

      const result = await createUseCase(finalFormData);
      if (result.success) {
        toast.success('案例创建成功');
        router.push('/backend/use-cases');
      } else {
        toast.error(result.error || '创建案例失败');
      }
    } catch (error) {
      console.error('Error creating use case:', error);
      toast.error('创建案例失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm('确定要取消创建吗？未保存的内容将丢失。')) {
      router.push('/backend/use-cases');
    }
  };

  return (
    <div className="container mx-auto py-6 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Lightbulb className="h-8 w-8 text-blue-600" />
              创建新案例
            </h1>
            <p className="mt-2 text-gray-600">
              填写中文案例信息，系统将自动翻译为英文
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? '创建中...' : '创建案例'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-6">
        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>
              填写案例的基本信息，系统会自动将中文翻译为英文
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
                required
              />
            </div>

            <div className="grid grid-cols-1  gap-4">
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
                <Label htmlFor="coverImageUrl">封面图片URL（可选）</Label>
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
              <Label htmlFor="isPublished">立即发布</Label>
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
              填写案例的中文摘要，系统会自动翻译为英文
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdvancedMarkdownEditor
              label="案例摘要"
              value={formData.summaryZh}
              onChange={(value) => setFormData({ ...formData, summaryZh: value })}
              placeholder="请输入中文摘要（将自动翻译为英文）..."
              height={300}
            />
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
              填写案例的中文详细说明，系统会自动翻译为英文
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
              填写中文工作流解读，系统会自动翻译为英文
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdvancedMarkdownEditor
              label="工作流解读"
              value={formData.workflowInterpretationZh}
              onChange={(value) => setFormData({ ...formData, workflowInterpretationZh: value })}
              placeholder="请输入中文工作流解读（将自动翻译为英文）..."
              height={400}
            />
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
              填写中文工作流教程，系统会自动翻译为英文
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdvancedMarkdownEditor
              label="工作流教程"
              value={formData.workflowTutorialZh}
              onChange={(value) => setFormData({ ...formData, workflowTutorialZh: value })}
              placeholder="请输入中文工作流教程（将自动翻译为英文）..."
              height={400}
            />
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
              上传工作流JSON配置文件
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
      </form>
    </div>
  );
} 