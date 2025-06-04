'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchFilter } from '@/features/common/components/search-filter';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { useTranslations, useLocale } from 'next-intl';
import { 
  Download,
  Star,
  Clock,
  Target,
  Search,
  Filter,
  TrendingUp,
  FileText,
  Play,
  ArrowRight,
  Zap,
} from 'lucide-react';

import {Pagination, getUseCases, getUseCaseCategories, getUseCaseStatsForFrontend, PaginationInfoType } from '@/features/common';
import { useUser } from '@clerk/nextjs';
import { UseCaseType } from '@/features/use-cases';

interface CategoryType {
  id: string;
  name: string;
  nameZh: string | null;
  description: string | null;
  descriptionZh: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export default function UseCasesPage() {
  const { user } = useUser();
  const t = useTranslations('useCases');
  const locale = useLocale();
  const dateLocale = locale === 'zh' ? zhCN : enUS;
  const [useCases, setUseCases] = useState<UseCaseType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [stats, setStats] = useState({ total: 0, categories: 0, totalDownloads: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pagination, setPagination] = useState<PaginationInfoType>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  // 获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getUseCaseCategories();
      if (result.success && result.data) {
        setCategories(result.data);
      }
    };
    fetchCategories();
  }, []);

  // 获取统计数据
  useEffect(() => {
    const fetchStats = async () => {
      const result = await getUseCaseStatsForFrontend();
      if (result.success && result.data) {
        setStats(result.data);
      }
    };
    fetchStats();
  }, []);

  // 获取案例数据
  const fetchUseCases = async (page = 1, search = '', categoryId = '') => {
    setLoading(true);
    try {
      const result = await getUseCases(
        page, 
        pagination.limit, 
        search || undefined, 
        categoryId === 'all' ? undefined : categoryId
      );
      if (result.success && result.data && result.pagination) {
        setUseCases(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error('Error fetching use cases:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和搜索/筛选变化时重新获取数据
  useEffect(() => {
    fetchUseCases(1, searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId || 'all');
  };

  const handlePageChange = (page: number) => {
    fetchUseCases(page, searchQuery, selectedCategory);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 页面头部 */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-2 bg-white/10 text-white border-white/20">
              <Target className="h-4 w-4 mr-2" />
              {t('page.header.badge')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('page.header.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
              {t('page.header.description')}
            </p>
            <div className="flex items-center justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">{t('page.header.features.verified')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm">{t('page.header.features.ready')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm">{t('page.header.features.updated')}</span>
              </div>
            </div>
          </div>

          {/* 统计信息 - 移到页面头部 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <Card className="card-enhanced text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold gradient-text mb-1">{stats.total}</div>
                <div className="text-xs text-muted-foreground">{t('page.stats.featured')}</div>
              </CardContent>
            </Card>
            <Card className="card-enhanced text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold gradient-text mb-1">{stats.categories}</div>
                <div className="text-xs text-muted-foreground">{t('page.stats.categories')}</div>
              </CardContent>
            </Card>
            <Card className="card-enhanced text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold gradient-text mb-1">{stats.totalDownloads}</div>
                <div className="text-xs text-muted-foreground">{t('page.stats.downloads')}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 搜索和筛选 */}
        <div className="mb-12">
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            categories={categories.map(cat => ({
              id: cat.id,
              name: cat.name,
              nameZh: cat.nameZh || cat.name
            }))}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            onClearFilters={clearFilters}
            searchPlaceholder={t('page.search.placeholder')}
            allCategoriesText={t('filters.all')}
          />
        </div>

        {/* 案例列表 */}
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
        ) : useCases.length === 0 ? (
          <Card className="card-enhanced text-center py-16">
            <CardContent>
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                {t('page.empty.title')}
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {t('page.empty.description')}
              </p>
              <Button onClick={clearFilters} variant="outline">
                {t('page.empty.reset')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* 案例网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {useCases.map((useCase) => (
                <Card key={useCase.id} className="card-enhanced card-hover group overflow-hidden h-full flex flex-col">
                  {/* 案例封面 */}
                  {useCase.coverImageUrl && (
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={useCase.coverImageUrl}
                        alt={locale === 'zh' ? (useCase.titleZh || useCase.title) : useCase.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      {useCase.isFeatured && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            {t('page.card.recommended')}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      {useCase.category && (
                        <Badge variant="secondary" className="text-xs">
                          {useCase.category}
                        </Badge>
                      )}
                      {useCase.difficulty && (
                        <Badge variant="outline" className="text-xs">
                          {useCase.difficulty}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                      {locale === 'zh' ? (useCase.titleZh || useCase.title) : useCase.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0 flex-1 flex flex-col">
                    <CardDescription className="line-clamp-3 mb-6 flex-1">
                      {(() => {
                        const summary = locale === 'zh' ? (useCase.summaryZh || useCase.summary) : useCase.summary;
                        if (summary) {
                          return summary.length > 120 ? summary.substring(0, 120) + '...' : summary;
                        }
                        return t('featured.noDescription');
                      })()}
                    </CardDescription>

                    {/* 元信息 */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                      <div className="flex items-center space-x-4">
                        {useCase.n8nAuthor && (
                          <div className="flex items-center">
                            <span className="text-xs">{useCase.n8nAuthor}</span>
                          </div>
                        )}
                        {useCase.publishedAt && (
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span className="text-xs">
                              {formatDistanceToNow(new Date(useCase.publishedAt), {
                                addSuffix: true,
                                locale: dateLocale
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="mt-auto">
                      <Link href={`/front/use-cases/${useCase.id}`}>
                        <Button className="w-full btn-primary-gradient group/btn">
                          <Play className="mr-2 h-4 w-4" />
                          {t('page.card.viewDetails')}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 分页 */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}