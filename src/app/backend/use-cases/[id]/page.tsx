'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Edit,
  Eye,
  FileText,
  Code,
  BookOpen,
  Lightbulb,
  Sparkles,
  Calendar,
  User,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { 
  getUseCaseById
} from '@/features/use-cases/actions/usecase-actions';
import { toast } from 'sonner';
import { AdvancedMarkdownRenderer } from '@/features/common';
import N8nWorkflowPreview from '@/features/common/components/n8n-workflow-preview';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// Dynamically import markdown viewer to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

const MarkdownPreview = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
  { ssr: false }
);

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
  categories?: Array<{
    id: string;
    name: string;
    nameZh: string | null;
  }>;
}

export default function UseCaseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const useCaseId = params.id as string;
  
  const [useCase, setUseCase] = useState<UseCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    if (useCaseId) {
      loadUseCase();
    }
  }, [useCaseId]);

  const loadUseCase = async () => {
    try {
      setLoading(true);
      const result = await getUseCaseById(useCaseId);
      if (result.success && result.data) {
        setUseCase(result.data);
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
            返回列表
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
            <h1 className="text-2xl font-bold text-gray-900">案例详情</h1>
            <p className="text-gray-600">查看案例的详细信息</p>
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
              前台预览
            </Button>
          )}
          <Button 
            onClick={() => router.push(`/backend/use-cases/edit/${useCase.id}`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            编辑案例
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
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">英文标题</h3>
                <p className="text-gray-700">{useCase.title}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">中文标题</h3>
                <p className="text-gray-700">{useCase.titleZh || '未设置'}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">作者</h3>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{useCase.n8nAuthor || '未知'}</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">发布状态</h3>
                <Badge variant={useCase.isPublished ? "default" : "secondary"}>
                  {useCase.isPublished ? '已发布' : '未发布'}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">创建时间</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>
                    {useCase.createdAt ? formatDistanceToNow(new Date(useCase.createdAt), {
                      addSuffix: true,
                      locale: zhCN
                    }) : '未知'}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">更新时间</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>
                    {useCase.updatedAt ? formatDistanceToNow(new Date(useCase.updatedAt), {
                      addSuffix: true,
                      locale: zhCN
                    }) : '未知'}
                  </span>
                </div>
              </div>
            </div>

            {useCase.originalUrl && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">原始链接</h3>
                  <a 
                    href={useCase.originalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {useCase.originalUrl}
                  </a>
                </div>
              </>
            )}

            {useCase.categories && useCase.categories.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">分类</h3>
                  <div className="flex flex-wrap gap-2">
                    {useCase.categories.map((category) => (
                      <Badge key={category.id} variant="outline">
                        {category.nameZh || category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* 封面图片 */}
            {useCase.coverImageUrl && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">封面图片</h3>
                  <img
                    src={useCase.coverImageUrl}
                    alt={useCase.titleZh || useCase.title}
                    className="w-full max-w-md h-auto rounded-lg border"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Tab切换内容区域 */}
        <Card>
          <CardHeader>
            <CardTitle>案例详细内容</CardTitle>
            <CardDescription>
              查看案例的详细信息、工作流解读和教程等内容
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="summary" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  案例摘要
                </TabsTrigger>
                <TabsTrigger value="readme" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  详细说明
                </TabsTrigger>
                <TabsTrigger value="interpretation" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  工作流解读
                </TabsTrigger>
                <TabsTrigger value="tutorial" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  工作流教程
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  工作流预览
                </TabsTrigger>
              </TabsList>

              {/* 案例摘要 Tab */}
              <TabsContent value="summary" className="mt-6">
                {(useCase.summary || useCase.summaryZh) ? (
                  <div className="space-y-6">
                    {useCase.summaryZh && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">中文摘要</h3>
                        <AdvancedMarkdownRenderer 
                          content={useCase.summaryZh}
                          className="prose prose-lg max-w-none"
                        />
                      </div>
                    )}
                    {useCase.summary && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">英文摘要</h3>
                        <AdvancedMarkdownRenderer 
                          content={useCase.summary}
                          className="prose prose-lg max-w-none"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    暂无案例摘要内容
                  </div>
                )}
              </TabsContent>

              {/* 详细说明 Tab */}
              <TabsContent value="readme" className="mt-6">
                {(useCase.readme || useCase.readmeZh) ? (
                  <div className="space-y-6">
                    {useCase.readmeZh && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">中文详细说明</h3>
                        <AdvancedMarkdownRenderer 
                          content={useCase.readmeZh}
                          className="prose prose-lg max-w-none"
                        />
                      </div>
                    )}
                    {useCase.readme && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">英文详细说明</h3>
                        <AdvancedMarkdownRenderer 
                          content={useCase.readme}
                          className="prose prose-lg max-w-none"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    暂无详细说明内容
                  </div>
                )}
              </TabsContent>

              {/* 工作流解读 Tab */}
              <TabsContent value="interpretation" className="mt-6">
                {(useCase.workflowInterpretation || useCase.workflowInterpretationZh) ? (
                  <div className="space-y-6">
                    {useCase.workflowInterpretationZh && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">中文工作流解读</h3>
                        <AdvancedMarkdownRenderer 
                          content={useCase.workflowInterpretationZh}
                          className="prose prose-lg max-w-none"
                        />
                      </div>
                    )}
                    {useCase.workflowInterpretation && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">英文工作流解读</h3>
                        <AdvancedMarkdownRenderer 
                          content={useCase.workflowInterpretation}
                          className="prose prose-lg max-w-none"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    暂无工作流解读内容
                  </div>
                )}
              </TabsContent>

              {/* 工作流教程 Tab */}
              <TabsContent value="tutorial" className="mt-6">
                {(useCase.workflowTutorial || useCase.workflowTutorialZh) ? (
                  <div className="space-y-6">
                    {useCase.workflowTutorialZh && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">中文工作流教程</h3>
                        <AdvancedMarkdownRenderer 
                          content={useCase.workflowTutorialZh}
                          className="prose prose-lg max-w-none"
                        />
                      </div>
                    )}
                    {useCase.workflowTutorial && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">英文工作流教程</h3>
                        <AdvancedMarkdownRenderer 
                          content={useCase.workflowTutorial}
                          className="prose prose-lg max-w-none"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    暂无工作流教程内容
                  </div>
                )}
              </TabsContent>

              {/* 工作流预览 Tab */}
              <TabsContent value="preview" className="mt-6">
                {(useCase.workflowJson || useCase.workflowJsonZh) ? (
                  <div className="space-y-6">
                    {useCase.workflowJsonZh && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">中文工作流</h3>
                        <N8nWorkflowPreview
                          workflowJson={useCase.workflowJsonZh}
                          title="中文工作流预览"
                          description="基于中文版本的工作流数据生成的可视化预览"
                          height={500}
                        />
                      </div>
                    )}
                    {useCase.workflowJson && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">英文工作流</h3>
                        <N8nWorkflowPreview
                          workflowJson={useCase.workflowJson}
                          title="英文工作流预览"
                          description="基于英文版本的工作流数据生成的可视化预览"
                          height={500}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    暂无工作流预览内容
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
