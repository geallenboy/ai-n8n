'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Clock,
  Users,
  PlayCircle,
  BarChart3,
  GraduationCap,
  Database,
  Layers
} from 'lucide-react';
import { 
  getTutorialModules,
  getTutorialSections,
  deleteTutorialModule,

} from '@/features/tutorial/actions/tutorial-actions';
import { toast } from 'sonner';


interface TutorialModule {
  id: string;
  sectionId: string;
  title: string;
  titleZh: string | null;
  description: string | null;
  descriptionZh: string | null;
  videoUrl: string | null;
  estimatedTimeMinutes: number | null;
  order: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  sectionTitle?: string | null;
}

interface TutorialSection {
  id: string;
  title: string;
  titleZh?: string | null;
  description: string | null;
  descriptionZh?: string | null;
  order: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export default function TutorialModulesPage() {
  const router = useRouter();
  const [modules, setModules] = useState<TutorialModule[]>([]);
  const [sections, setSections] = useState<TutorialSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  

  // Load data
  useEffect(() => {
    loadData();
  }, [currentPage, searchTerm, selectedSection]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [modulesResult, sectionsResult] = await Promise.all([
        getTutorialModules(selectedSection === 'all' ? undefined : selectedSection, currentPage, 10, searchTerm || undefined),
        getTutorialSections()
      ]);

      if (modulesResult.success && modulesResult.data) {
        setModules(modulesResult.data);
        if (modulesResult.pagination) {
          setTotalPages(modulesResult.pagination.totalPages);
        }
      }

      if (sectionsResult.success && sectionsResult.data) {
        setSections(sectionsResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteModule = async (id: string) => {
    if (!confirm('确定要删除这个教程管理吗？')) return;
    
    try {
      const result = await deleteTutorialModule(id);
      if (result.success) {
        toast.success('教程管理删除成功');
        loadData();
      } else {
        toast.error(result.error || '删除失败');
      }
    } catch (error) {
      console.error('Error deleting module:', error);
      toast.error('删除失败');
    }
  };



  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">教程管理</h1>
          <p className="text-muted-foreground">管理教程版块和教程内容</p>
        </div>
        <div className="flex gap-2">
          
          <Button 
            variant="outline"
            onClick={() => router.push('/backend/tutorial/sections')}
          >
            <Layers className="h-4 w-4 mr-2" />
            教程板块
          </Button>
          
          <Button onClick={() => router.push('/backend/tutorial/create')}>
            <Plus className="h-4 w-4 mr-2" />
            新建教程
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总版块数</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sections.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总教程数</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modules.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">有视频模块</CardTitle>
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {modules.filter(m => m.videoUrl).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均时长</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {modules.length > 0 
                ? Math.round(modules.reduce((acc, m) => acc + (m.estimatedTimeMinutes || 0), 0) / modules.length)
                : 0
              } 分钟
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索教程标题或描述..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="选择教程版块" />
              </SelectTrigger>
                              <SelectContent>
                  <SelectItem value="all">所有教程版块</SelectItem>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.titleZh}
                    </SelectItem>
                  ))}
                </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Modules Table */}
      <Card>
        <CardHeader>
          <CardTitle>教程列表</CardTitle>
          <CardDescription>
            管理所有教程的内容和设置
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">加载中...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>标题</TableHead>
                  <TableHead>版块</TableHead>
                  <TableHead>时长</TableHead>
                  <TableHead>排序</TableHead>
                  <TableHead>视频</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((module) => (
                  <TableRow key={module.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{module.titleZh}</div>
                        <div className="text-sm text-muted-foreground">
                          {module.descriptionZh}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {module.sectionTitle || '未知版块'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {module.estimatedTimeMinutes ? (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {module.estimatedTimeMinutes} 分钟
                        </div>
                      ) : (
                        <span className="text-muted-foreground">未设置</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{module.order}</Badge>
                    </TableCell>
                    <TableCell>
                      {module.videoUrl ? (
                        <Badge variant="default">
                          <PlayCircle className="h-3 w-3 mr-1" />
                          有视频
                        </Badge>
                      ) : (
                        <Badge variant="outline">无视频</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {module.createdAt ? (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(module.createdAt).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">未知</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/front/tutorial/${module.id}`)}
                          title="查看详情"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/backend/tutorial/${module.id}/edit`)}
                          title="编辑"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteModule(module.id)}
                          title="删除"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                上一页
              </Button>
              <span className="flex items-center px-4">
                第 {currentPage} 页，共 {totalPages} 页
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                下一页
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

     
    </div>
  );
} 