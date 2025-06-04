import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { BlogCategoryType } from '../types';

interface BlogFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  categories: BlogCategoryType[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export default function BlogFilters({
  searchTerm,
  selectedCategory,
  categories,
  onSearchChange,
  onCategoryChange
}: BlogFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>筛选和搜索</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜索博客标题、内容..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有分类</SelectItem>
             
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.nameZh}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 