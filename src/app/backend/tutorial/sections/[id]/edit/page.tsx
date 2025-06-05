'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Layers, Loader2 } from 'lucide-react';
import { getTutorialSectionById, updateTutorialSection } from '@/features/tutorial/actions/tutorial-actions';
import { AdvancedMarkdownEditor } from '@/features/common';
import { toast } from 'sonner';

interface TutorialSection {
  id: string;
  title: string; // 英文标题
  titleZh?: string | null; // 中文标题
  description: string | null; // 英文描述
  descriptionZh?: string | null; // 中文描述
  order: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export default function EditTutorialSectionPage() {
  const params = useParams();
  const router = useRouter();
  const [section, setSection] = useState<TutorialSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', // 英文标题
    titleZh: '', // 中文标题
    description: '', // 英文描述
    descriptionZh: '', // 中文描述
    order: 1,
  });

  useEffect(() => {
    loadSection();
  }, [params.id]);

  const loadSection = async () => {
    try {
      setLoading(true);
      const result = await getTutorialSectionById(params.id as string);
      
      if (result.success && result.data) {
        const sectionData = result.data;
        setSection(sectionData);
        setFormData({
          title: sectionData.title,
          titleZh: sectionData.titleZh || '',
          description: sectionData.description || '',
          descriptionZh: sectionData.descriptionZh || '',
          order: sectionData.order,
        });
      } else {
        toast.error(result.error || '加载教程板块失败');
        router.push('/backend/tutorial/sections');
      }
    } catch (error) {
      console.error('Error loading section:', error);
      toast.error('加载教程板块失败');
      router.push('/backend/tutorial/sections');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!section) return;
    
    try {
      if (!formData.title.trim()) {
        toast.error('请填写板块标题');
        return;
      }

      setSaving(true);
      
      const result = await updateTutorialSection(section.id, formData);
      if (result.success) {
        toast.success('教程板块更新成功');
        router.push('/backend/tutorial/sections');
      } else {
        toast.error(result.error || '更新教程板块失败');
      }
    } catch (error) {
      console.error('Error updating section:', error);
      toast.error('更新教程板块失败');
    } finally {
      setSaving(false);
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

  if (!section) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">教程板块不存在</p>
          <Button onClick={() => router.push('/backend/tutorial/sections')} className="mt-4">
            返回板块列表
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/backend/tutorial/sections')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回列表
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Layers className="h-8 w-8 text-blue-600" />
              编辑教程板块
            </h1>
            <p className="mt-2 text-gray-600">
              编辑板块：{section.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/backend/tutorial/sections')}
          >
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
          <CardDescription>编辑教程板块的基本信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 标题部分 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">英文标题 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Please enter English title"
                required
              />
            </div>
            <div>
              <Label htmlFor="titleZh">中文标题</Label>
              <Input
                id="titleZh"
                value={formData.titleZh}
                onChange={(e) => setFormData({ ...formData, titleZh: e.target.value })}
                placeholder="请输入中文标题"
              />
            </div>
          </div>
          
          {/* 排序 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* 板块描述 */}
      <Card>
        <CardHeader>
          <CardTitle>板块描述</CardTitle>
          <CardDescription>
            使用Markdown格式编写板块描述
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>英文描述</Label>
            <AdvancedMarkdownEditor
              label="板块描述"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="请输入板块描述（支持Markdown格式）..."
              minHeight={200}
              className="w-full"
            />
          </div>
          <div>
            <Label>中文描述</Label>
            <AdvancedMarkdownEditor
              label="板块内容"
              value={formData.descriptionZh}
              onChange={(value) => setFormData({ ...formData, descriptionZh: value })}
              placeholder="请输入板块内容（支持Markdown格式）..."
              minHeight={200}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}