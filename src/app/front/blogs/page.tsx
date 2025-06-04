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
  Clock, 
  User,
  ArrowRight,
  Eye,
  MessageCircle,
  Star,
  Bookmark,
  Search,
  TrendingUp,
  FileText,
  Sparkles,
  PenTool,
  Calendar,
  Play,
  BookOpen,
  Filter,
  BarChart3
} from 'lucide-react';

import {Pagination, getBlogsList, getBlogsCategories, PaginationInfoType } from '@/features/common';

import { useUser } from '@clerk/nextjs';
import { BlogListType, BlogCategoryType } from '@/features/blogs';

export default function BlogsPage() {
  const { user } = useUser();
  const t = useTranslations('blogs');
  const locale = useLocale();
  const dateLocale = locale === 'zh' ? zhCN : enUS;
  const [blogs, setBlogs] = useState<BlogListType[]>([]);
  const [categories, setCategories] = useState<BlogCategoryType[]>([]);
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
      const result = await getBlogsCategories();
      if (result.success && result.data) {
        setCategories(result.data);
      }
    };
    fetchCategories();
  }, []);

  // 获取博客数据
  const fetchBlogs = async (page = 1, search = '', categoryId = '') => {
    setLoading(true);
    try {
      const result = await getBlogsList(
        page, 
        pagination.limit, 
        search || undefined, 
        categoryId === 'all' ? undefined : categoryId
      );
      if (result.success && result.data && result.pagination) {
        setBlogs(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和搜索/筛选变化时重新获取数据
  useEffect(() => {
    fetchBlogs(1, searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId || 'all');
  };

  const handlePageChange = (page: number) => {
    fetchBlogs(page, searchQuery, selectedCategory);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 页面头部 */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <Badge className="mb-4 px-4 py-2 bg-white/10 text-white border-white/20">
              <PenTool className="h-4 w-4 mr-2" />
              {t('page.header.badge')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('page.header.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-purple-100">
              {t('page.header.description')}
            </p>
            
            {/* 统计信息移到头部 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{pagination.total}</div>
                <div className="text-sm text-white/80">{t('page.stats.articles')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Filter className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{categories.length}</div>
                <div className="text-sm text-white/80">{t('page.stats.categories')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {blogs.length ? Math.floor(Math.random() * 50000) + 10000 : 0}
                </div>
                <div className="text-sm text-white/80">{t('page.stats.views')}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">{t('page.header.features.fresh')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm">{t('page.header.features.expert')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm">{t('page.header.features.community')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 搜索和筛选 */}
        <div className="mb-12">
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            onClearFilters={clearFilters}
            searchPlaceholder={t('page.search.placeholder')}
            allCategoriesText={t('filters.all')}
           
          />
        </div>

        {/* 博客列表 */}
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
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : blogs.length === 0 ? (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => {
                const title = locale === 'zh' ? blog.titleZh || blog.title : blog.title;
                const summary = locale === 'zh' ? blog.excerptZh || blog.excerpt : blog.excerpt;
                
                return (
                  <Card key={blog.id} className="card-enhanced card-hover group overflow-hidden h-full flex flex-col">
                    {/* 卡片头部图片区域 */}
                    <div className="relative aspect-video bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950/50 dark:to-purple-950/50 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
                      <div className="absolute right-4 top-4">
                        {index < 3 && (
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            {t('page.card.featured')}
                          </Badge>
                        )}
                      </div>
                   
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <BookOpen className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>

                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        {blog.categoryName && (
                          <Badge variant="secondary" className="text-xs">
                            {blog.categoryName}
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          <span>{Math.floor(Math.random() * 1000) + 100}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {title}
                      </CardTitle>
                    </CardHeader>

                    {/* 弹性内容区域 */}
                    <CardContent className="pt-0 flex-1 flex flex-col">
                      <CardDescription className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                        {summary || t('featured.noDescription')}
                      </CardDescription>

                      {/* 作者和时间信息 */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-6">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{blog.author || t('page.card.anonymous')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            <span>{Math.floor(Math.random() * 20)}</span>
                          </div>
                        </div>
                      </div>

                      {/* 时间信息 */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-6">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {blog.publishedAt && formatDistanceToNow(new Date(blog.publishedAt), { 
                              addSuffix: true, 
                              locale: dateLocale 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{Math.floor(Math.random() * 10) + 3} {t('page.card.readTime')}</span>
                        </div>
                      </div>

                      {/* 操作按钮 - 固定在底部 */}
                      <div className="mt-auto">
                        <Link href={`/front/blogs/${blog.id}`}>
                          <Button className="w-full btn-primary-gradient group/btn">
                            <Play className="mr-2 h-4 w-4" />
                            {t('page.card.readMore')}
                            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* 分页 */}
            {pagination.totalPages > 1 && (
              <div className="mt-12">
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