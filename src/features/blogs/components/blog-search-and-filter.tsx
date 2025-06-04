'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Tag } from 'lucide-react';
import type { BlogCategoryType } from '../types';

/**
 * 博客搜索和筛选组件
 * 提供搜索、分类筛选、标签筛选等功能
 */
interface BlogSearchAndFilterProps {
  /** 搜索关键词 */
  searchTerm: string;
  /** 选中的分类ID */
  selectedCategory: string;
  /** 选中的标签列表 */
  selectedTags: string[];
  /** 分类列表 */
  categories: BlogCategoryType[];
  /** 可用标签列表 */
  availableTags: string[];
  /** 搜索变化回调 */
  onSearchChange: (term: string) => void;
  /** 分类变化回调 */
  onCategoryChange: (categoryId: string) => void;
  /** 标签变化回调 */
  onTagsChange: (tags: string[]) => void;
  /** 重置筛选回调 */
  onReset: () => void;
}

export default function BlogSearchAndFilter({
  searchTerm,
  selectedCategory,
  selectedTags,
  categories,
  availableTags,
  onSearchChange,
  onCategoryChange,
  onTagsChange,
  onReset,
}: BlogSearchAndFilterProps) {
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(tagInput.trim());
    }
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedTags.length > 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          搜索和筛选
        </h3>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onReset}>
            <X className="h-4 w-4 mr-1" />
            重置
          </Button>
        )}
      </div>

      {/* 搜索框 */}
      <div className="space-y-2">
        <Label htmlFor="search">搜索博客</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="search"
            type="text"
            placeholder="搜索标题、摘要..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 分类筛选 */}
        <div className="space-y-2">
          <Label htmlFor="category">分类</Label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger id="category">
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有分类</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 标签筛选 */}
        <div className="space-y-2">
          <Label htmlFor="tags">标签</Label>
          <div className="space-y-2">
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="tags"
                type="text"
                placeholder="输入标签名称..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                className="pl-10"
              />
            </div>
            
            {/* 常用标签快速选择 */}
            {availableTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {availableTags.slice(0, 10).map((tag) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => handleAddTag(tag)}
                    disabled={selectedTags.includes(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 已选标签 */}
      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <Label>已选标签</Label>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemoveTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 