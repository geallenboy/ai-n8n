'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchFilter } from '@/features/common/components/search-filter';
import { 
  BookOpen, 
  Clock, 
  Star, 
  Play,
  Search,
  Filter,
  Users,
  TrendingUp,
  Award,
  Target,
  Sparkles,
  GraduationCap,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Loader2,
  Lightbulb,
  Zap,
  Trophy,
  Grid,
  List,
  ChevronDown,
  X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { getTutorialSectionsWithModules } from '@/features/common';
import { TutorialSectionType, TutorialModuleType } from '@/features/tutorial';
import SEOHead from '@/components/seo/seo-head';

// 难度配置
const difficultyConfig = {
  beginner: {
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    textColor: 'text-green-700 dark:text-green-300',
    borderColor: 'border-green-200 dark:border-green-800'
  },
  intermediate: {
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    textColor: 'text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  advanced: {
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    textColor: 'text-purple-700 dark:text-purple-300',
    borderColor: 'border-purple-200 dark:border-purple-800'
  }
};

// 生成确定性随机值的函数
function generateDeterministicValue(seed: number, multiplier: number, min: number, max: number): number {
  const hash = (seed * multiplier) % 1000;
  return min + (hash % (max - min + 1));
}

export default function TutorialListPage() {
  const t = useTranslations('tutorials');
  const locale = useLocale();
  const [sections, setSections] = useState<TutorialSectionType[]>([]);
  const [filteredSections, setFilteredSections] = useState<TutorialSectionType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 统计数据
  const [stats, setStats] = useState({
    totalTutorials: 0,
    totalSections: 0,
    averageTime: 0,
   
  });

  // 为了适配SearchFilter组件，创建虚拟分类数据
  const difficultyCategories = [
    { id: 'beginner', name: t('difficulty.beginner'), nameZh: t('difficulty.beginner') },
    { id: 'intermediate', name: t('difficulty.intermediate'), nameZh: t('difficulty.intermediate') },
    { id: 'advanced', name: t('difficulty.advanced'), nameZh: t('difficulty.advanced') }
  ];

  useEffect(() => {
    loadTutorialData();
  }, []);

  useEffect(() => {
    filterTutorials();
  }, [searchTerm, selectedDifficulty, selectedFeatures, sections]);

  const loadTutorialData = async () => {
    try {
      const result = await getTutorialSectionsWithModules();
      if (result.success && result.data) {
        setSections(result.data);
        
        // 计算统计数据
        const totalTutorials = result.data.reduce((sum, section) => sum + (section.modules?.length || 0), 0);
        const totalTime = result.data.reduce((sum, section) => 
          sum + (section.modules?.reduce((moduleSum, module) => 
            moduleSum + (module.estimatedTimeMinutes || 30), 0) || 0), 0);
        
        setStats({
          totalTutorials,
          totalSections: result.data.length,
          averageTime: totalTutorials > 0 ? Math.round(totalTime / totalTutorials) : 0,
         
        });
      }
    } catch (error) {
      console.error('Error loading tutorial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTutorials = () => {
    let filtered = sections;

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.map(section => ({
        ...section,
        modules: section.modules?.filter(module => {
          const title = locale === 'zh' ? (module.titleZh || module.title) : module.title;
          const description = locale === 'zh' ? (module.descriptionZh || module.description) : module.description;
          
          return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 (description && description.toLowerCase().includes(searchTerm.toLowerCase()));
        }) || []
      })).filter(section => section.modules && section.modules.length > 0);
    }

    // 难度过滤
    if (selectedDifficulty !== 'all') {
      filtered = filtered.map(section => ({
        ...section,
        modules: section.modules?.filter(module => module.difficulty === selectedDifficulty) || []
      })).filter(section => section.modules && section.modules.length > 0);
    }

    setFilteredSections(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDifficulty('all');
    setSelectedFeatures([]);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: locale === 'zh' ? zhCN : enUS
    });
  };


  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={t('seo.title')}
        description={t('seo.description')}
        image={t('seo.image')}
      />
      {/* 页面头部 */}
      <section className="bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-2 bg-white/10 text-white border-white/20">
              <GraduationCap className="h-4 w-4 mr-2" />
              {t('featured.badge')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
              {t('subtitle')}
            </p>
            
            {/* 特色功能 */}
            <div className="flex flex-wrap justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">{t('features.systematic')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm">{t('features.practical')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm">{t('features.tracking')}</span>
              </div>
            </div>
          </div>

          {/* 统计数据 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <Card className="card-enhanced text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold gradient-text mb-1">{stats.totalTutorials}</div>
                <div className="text-xs text-muted-foreground">{t('stats.tutorials')}</div>
              </CardContent>
            </Card>
            <Card className="card-enhanced text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold gradient-text mb-1">{stats.totalSections}</div>
                <div className="text-xs text-muted-foreground">{t('stats.sections')}</div>
              </CardContent>
            </Card>
            <Card className="card-enhanced text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold gradient-text mb-1">{stats.averageTime}</div>
                <div className="text-xs text-muted-foreground">{t('stats.averageTime')}</div>
              </CardContent>
            </Card>
          
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 搜索和筛选 */}
        <div className="mb-12">
          <SearchFilter
            searchQuery={searchTerm}
            onSearchChange={setSearchTerm}
            categories={difficultyCategories}
            selectedCategory={selectedDifficulty}
            onCategoryChange={setSelectedDifficulty}
            onClearFilters={clearFilters}
            searchPlaceholder={t('filters.searchPlaceholder')}
            allCategoriesText={t('filters.all')}
           
          />
        </div>
       
        {/* 教程内容 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="card-enhanced animate-pulse">
                <div className="aspect-video bg-muted rounded-t-xl"></div>
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-4 bg-muted rounded w-4/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredSections.length === 0 ? (
          <Card className="card-enhanced text-center py-16">
            <CardContent>
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                {t('search.noResults')}
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {searchTerm ? t('search.noResultsFor', { term: searchTerm }) : t('search.tryAdjustFilters')}
              </p>
              <Button onClick={clearFilters} variant="outline">
                {t('filters.clear')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-16">
            {filteredSections.map((section, sectionIndex) => (
              <div key={section.id} className="space-y-8">
                {/* 版块标题 */}
                <div className="text-center">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <h2 className="text-2xl font-bold text-foreground">
                        {locale === 'zh' ? (section.titleZh || section.title) : section.title}
                      </h2>
                      <Badge variant="outline" className="text-primary border-primary/20">
                        {section.modules?.length} {t('tutorial.modules')}
                      </Badge>
                    </div>
                    
                    {/* 查看全部链接 */}
                    <Link href={`/front/tutorial/category/${section.id}`}>
                      <Button variant="outline" size="sm" className="group">
                        {t('actions.viewAll')}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* 教程卡片网格 - 使用案例页面的加载样式 */}
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                      <Card key={index} className="card-enhanced group hover:shadow-xl transition-all duration-300 animate-pulse">
                        <CardHeader className="p-0">
                          <div className="relative">
                            <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-t-lg"></div>
                            <div className="absolute top-4 left-4">
                              <div className="h-6 w-16 bg-white/50 rounded-full"></div>
                            </div>
                            <div className="absolute top-4 right-4">
                              <div className="h-6 w-6 bg-white/50 rounded-full"></div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                            </div>
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : section.modules && section.modules.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {section.modules.map((module, moduleIndex) => {
                      const difficulty = (module.difficulty || 'beginner') as keyof typeof difficultyConfig;
                      const difficultyStyle = difficultyConfig[difficulty];
                      
                      return (
                        <Card key={module.id} className="card-enhanced card-hover group overflow-hidden h-full flex flex-col">
                          {/* 顶部装饰条 */}
                          <div className={`h-2 bg-gradient-to-r ${difficultyStyle.color}`}></div>
                          
                          {/* 推荐标签 */}
                          {moduleIndex < 2 && (
                            <div className="absolute top-6 right-4 z-10">
                              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                {t('featured.recommended')}
                              </Badge>
                            </div>
                          )}

                          <CardHeader className="pb-4">
                            <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                              {locale === 'zh' ? (module.titleZh || module.title) : module.title}
                            </CardTitle>
                          </CardHeader>

                          {/* 弹性内容区域 */}
                          <CardContent className="pt-0 flex-1 flex flex-col">
                            <CardDescription className="line-clamp-3 mb-6 flex-1">
                              {(() => {
                                const description = locale === 'zh' ? (module.descriptionZh || module.description) : module.description;
                                const content = locale === 'zh' ? (module.contentZh || module.content) : module.content;
                                
                                if (description) {
                                  return description.length > 120 ? description.substring(0, 120) + '...' : description;
                                } else if (content) {
                                  return content.length > 120 ? content.substring(0, 120) + '...' : content;
                                } else {
                                  return t('featured.noDescription');
                                }
                              })()}
                            </CardDescription>

                            {/* 操作按钮 - 固定在底部 */}
                            <div className="mt-auto">
                              <Link href={`/front/tutorial/${module.id}`}>
                                <Button className="w-full btn-primary-gradient group/btn">
                                  <Play className="mr-2 h-4 w-4" />
                                  {t('actions.startTutorial')}
                                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                              </Link>
                            </div>
                          </CardContent>

                          {/* 底部装饰 */}
                          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${difficultyStyle.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">此版块暂无教程内容</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 