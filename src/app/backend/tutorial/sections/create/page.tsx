'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';
import { createTutorialSection } from '@/features/tutorial/actions/tutorial-actions';
import { toast } from 'sonner';
import { AdvancedMarkdownEditor } from '@/features/common';

export default function CreateTutorialSectionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('请输入板块标题');
      return;
    }

    setLoading(true);
    try {
      const result = await createTutorialSection(formData);
      if (result.success) {
        toast.success('教程管理创建成功');
        router.push('/backend/tutorial');
      } else {
        toast.error(result.error || '创建教程管理失败');
      }
    } catch (error) {
      console.error('Error creating tutorial section:', error);
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
              创建新的教程管理来组织教程管理
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? '创建中...' : '创建板块'}
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
                <Label htmlFor="title">板块标题 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="请输入板块标题"
                  required
                />
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

        {/* 板块描述 */}
        <Card>
          <CardHeader>
            <CardTitle>板块描述</CardTitle>
            <CardDescription>
              使用Markdown格式编写板块描述
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdvancedMarkdownEditor
              label="板块描述"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="请输入板块描述..."
              minHeight={300}
            />
          </CardContent>
        </Card>
      </form>
    </div>
  );
}