'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, 
  Clock, 
  Star, 
  ArrowLeft,
  Search,
  Users,
  Play,
  ArrowRight,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Target,
  Lightbulb,
  Zap,
  Trophy,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { TutorialModuleType, TutorialSectionType } from '@/features/tutorial';

interface TutorialCategoryClientProps {
  section: TutorialSectionType;
  tutorials: TutorialModuleType[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters: {
    difficulty: string;
    search: string;
  };
}

// 难度配置
const difficultyOptions = {
  all: { label: '全部难度', icon: BookOpen, color: 'bg-gray-100 text-gray-700' },
  beginner: { label: '初级', icon: Lightbulb, color: 'bg-green-100 text-green-700' },
  intermediate: { label: '中级', icon: Zap, color: 'bg-blue-100 text-blue-700' },
  advanced: { label: '高级', icon: Trophy, color: 'bg-purple-100 text-purple-700' }
};

// 排序选项
const sortOptions = [
  { value: 'latest', label: '最新发布' },
  { value: 'popular', label: '最受欢迎' },
  { value: 'difficulty_asc', label: '难度：简单到困难' },
  { value: 'difficulty_desc', label: '难度：困难到简单' },
  { value: 'duration_asc', label: '时长：短到长' },
  { value: 'duration_desc', label: '时长：长到短' }
];

export function TutorialCategoryClient({ 
  section, 
  tutorials, 
  pagination,
  filters 
}: TutorialCategoryClientProps) {
  const t = useTranslations('tutorials');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [selectedDifficulty, setSelectedDifficulty] = useState(filters.difficulty || 'all');
  const [sortBy, setSortBy] = useState('latest');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // 更新URL参数
  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (newFilters.search !== undefined) {
      if (newFilters.search) {
        current.set('search', newFilters.search);
      } else {
        current.delete('search');
      }
    }
    
    if (newFilters.difficulty !== undefined) {
      if (newFilters.difficulty && newFilters.difficulty !== 'all') {
        current.set('difficulty', newFilters.difficulty);
      } else {
        current.delete('difficulty');
      }
    }
    
    // 重置到第一页
    current.delete('page');
    
    const search = current.toString();
    const query = search ? `?${search}` : '';
    
    router.push(`/front/tutorial/category/${section.id}${query}`);
  };

  // 处理搜索
  const handleSearch = () => {
    updateFilters({ search: searchTerm });
  };

  // 处理难度筛选
  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    updateFilters({ difficulty });
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('page', page.toString());
    router.push(`/front/tutorial/category/${section.id}?${current.toString()}`);
  };

  // 渲染分页组件
  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {pages.map((page) => (
          <Button
            key={page}
            variant={page === pagination.page ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 页面头部 */}
      <div className="bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-8">
            {/* 面包屑导航 */}
            <div className="flex items-center justify-center space-x-2 text-white/80 mb-6">
              <Link href="/front" className="hover:text-white transition-colors">
                首页
              </Link>
              <span>/</span>
              <Link href="/front/tutorial" className="hover:text-white transition-colors">
                教程
              </Link>
              <span>/</span>
              <span className="text-white font-medium">
                {locale === 'zh' ? (section.titleZh || section.title) : section.title}
              </span>
            </div>
            
            <Badge className="mb-4 px-4 py-2 bg-white/10 text-white border-white/20">
              <BookOpen className="h-4 w-4 mr-2" />
              教程分类
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {locale === 'zh' ? (section.titleZh || section.title) : section.title}
            </h1>
            
            {section.description && (
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
                {locale === 'zh' ? (section.descriptionZh || section.description) : section.description}
              </p>
            )}
            
            {/* 统计信息 */}
            <div className="flex items-center justify-center space-x-8 text-white/90">
              <div className="text-center">
                <div className="text-3xl font-bold">{pagination.total}</div>
                <div className="text-sm">教程总数</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{Math.floor(pagination.total * 0.8)}</div>
                <div className="text-sm">已完成学习</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">4.8</div>
                <div className="text-sm">平均评分</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 工具栏 */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          {/* 搜索框 */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索教程..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
          </div>

          {/* 筛选器 */}
          <div className="flex items-center space-x-4">
            {/* 难度筛选 */}
            <Select value={selectedDifficulty} onValueChange={handleDifficultyChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="难度" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(difficultyOptions).map(([key, option]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center space-x-2">
                      <option.icon className="h-4 w-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 排序 */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="排序" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 视图切换 */}
            <div className="flex rounded-lg border border-border p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 教程列表 */}
        {tutorials.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">暂无教程</h3>
            <p className="text-muted-foreground">该分类下暂时没有教程，请尝试其他分类或稍后再来。</p>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 mb-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {tutorials.map((tutorial, index) => {
                const difficultyKey = (tutorial.difficulty || 'beginner') as keyof typeof difficultyOptions;
                const difficultyConfig = difficultyOptions[difficultyKey];
                const DifficultyIcon = difficultyConfig.icon;

                return (
                  <Card key={tutorial.id} className={`card-enhanced card-hover group ${
                    viewMode === 'list' ? 'flex flex-row' : 'h-full flex flex-col'
                  }`}>
                    {viewMode === 'grid' ? (
                      // 网格视图
                      <>
                        <div className="h-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>
                        
                        <CardHeader className="relative pb-4 flex-shrink-0">
                          <div className="flex items-center justify-between mb-3">
                            <Badge className={difficultyConfig.color}>
                              <DifficultyIcon className="h-3 w-3 mr-1" />
                              {difficultyConfig.label}
                            </Badge>
                            {index < 3 && (
                              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                推荐
                              </Badge>
                            )}
                          </div>
                          
                          <CardTitle className="text-xl line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-200">
                            {locale === 'zh' ? (tutorial.titleZh || tutorial.title) : tutorial.title}
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="pt-0 flex-1 flex flex-col">
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>{tutorial.estimatedTimeMinutes || 30} 分钟</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4" />
                                <span>{Math.floor(Math.random() * 100) + 50}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-auto">
                            <Link href={`/front/tutorial/${tutorial.id}`}>
                              <Button className="w-full btn-primary-gradient group/btn">
                                <Play className="mr-2 h-4 w-4" />
                                开始学习
                                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </>
                    ) : (
                      // 列表视图
                      <CardContent className="p-6 flex items-center space-x-6 w-full">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Badge className={difficultyConfig.color}>
                              <DifficultyIcon className="h-3 w-3 mr-1" />
                              {difficultyConfig.label}
                            </Badge>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                            {locale === 'zh' ? (tutorial.titleZh || tutorial.title) : tutorial.title}
                          </h3>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{tutorial.estimatedTimeMinutes || 30} 分钟</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{Math.floor(Math.random() * 100) + 50} 人学习</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0">
                          <Link href={`/front/tutorial/${tutorial.id}`}>
                            <Button className="btn-primary-gradient group/btn">
                              <Play className="mr-2 h-4 w-4" />
                              开始学习
                              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* 分页 */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
} 