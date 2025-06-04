'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';


interface SearchAndFilterProps {
  searchPlaceholder?: string;
  categories?: Array<{
    id: string;
    name: string;
  }>;
  onSearch: (query: string) => void;
  onCategoryChange?: (categoryId: string) => void;
  showCategoryFilter?: boolean;
}

export default function SearchAndFilter({
  searchPlaceholder = "搜索...",
  categories = [],
  onSearch,
  onCategoryChange,
  showCategoryFilter = true
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // 实时搜索
    onSearch(value);
  };

  return (
    <div className=" p-6 rounded-lg shadow-sm border mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* 搜索框 */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        {/* 分类筛选 */}
        {showCategoryFilter && categories.length > 0 && (
          <div className="md:w-48">
            <Select onValueChange={onCategoryChange}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
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
        )}
      </div>
    </div>
  );
} 