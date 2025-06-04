'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search,  X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { BlogCategoryType } from '@/features/blogs';


interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories?: BlogCategoryType[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onClearFilters: () => void;
  searchPlaceholder?: string;
  allCategoriesText?: string;

  showCategories?: boolean;
  className?: string;
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  categories = [],
  selectedCategory,
  onCategoryChange,
  onClearFilters,
  searchPlaceholder,
  allCategoriesText,
  showCategories = true,
  className = ""
}: SearchFilterProps) {
  const locale = useLocale();
  const t = useTranslations('common.search');

  // 使用传入的文案或默认多语言文案
  const placeholder = searchPlaceholder || t('placeholder');
  const allCategoriesLabel = allCategoriesText || t('allCategories');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 搜索框 */}
      <div className="max-w-2xl mx-auto">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <Input
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 pr-4 h-14 text-base bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20 dark:border-gray-700/50 rounded-2xl shadow-lg focus:shadow-xl transition-all duration-300 placeholder:text-muted-foreground/70"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted rounded-full"
                aria-label={t('clearSearch')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 分类筛选 */}
      {showCategories && (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => onCategoryChange('all')}
              className="h-10 px-6 rounded-full transition-all duration-200 hover:scale-105"
            >
              {allCategoriesLabel}
            </Button>
            
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => onCategoryChange(category.id)}
                className="h-10 px-6 rounded-full transition-all duration-200 hover:scale-105"
              >
                {locale === 'zh' ? category.nameZh : category.name}
              </Button>
            ))}
          </div>

          
        </div>
      )}
    </div>
  );
} 