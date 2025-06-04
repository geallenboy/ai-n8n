'use client';

import React from 'react';
import { UseCaseFiltersType } from '@/features/use-cases/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X, Filter } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface UseCaseFiltersProps {
  filters: UseCaseFiltersType;
  onFiltersChange: (filters: UseCaseFiltersType) => void;
  onClearFilters: () => void;
  resultCount: number;
}

const industryOptions = [
  '客户服务',
  '数据处理', 
  '营销自动化',
  '电商',
  '金融',
  '教育',
  '医疗',
  '制造业'
];

const scenarioOptions = [
  '数据处理',
  '客户服务',
  '营销自动化',
  '运维监控',
  '内容生成',
  '报告自动化',
  'API集成'
];

const difficultyOptions = [
  { value: 'beginner', label: '初级' },
  { value: 'intermediate', label: '中级' },
  { value: 'advanced', label: '高级' }
];

const aiToolOptions = [
  'OpenAI GPT',
  'Google AI',
  'Azure AI',
  'ChatGPT',
  'Claude',
  'Gemini'
];

const UseCaseFiltersComponent: React.FC<UseCaseFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  resultCount
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleFilterChange = (key: keyof UseCaseFiltersType, value: string | string[]) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleCheckboxChange = (key: keyof UseCaseFiltersType, value: string, checked: boolean) => {
    const currentValues = (filters[key] as string[]) || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(item => item !== value);
    
    handleFilterChange(key, newValues);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value
  );

  return (
    <div className="w-full">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-center gap-2"
        >
          <Filter className="w-4 h-4" />
          筛选 ({resultCount} 个结果)
        </Button>
      </div>

      {/* Filter Panel */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <Filter className="w-5 h-5" />
                筛选条件
              </CardTitle>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4 mr-1" />
                  清除
                </Button>
              )}
            </div>
            <div className="text-sm text-gray-400">
              找到 {resultCount} 个案例
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm font-medium text-gray-300">
                搜索
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="搜索案例标题、描述或标签..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Industry Filter */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                <Label className="text-sm font-medium text-gray-300">
                  行业分类 {filters.industry && filters.industry.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {filters.industry.length}
                    </Badge>
                  )}
                </Label>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-2">
                {industryOptions.map((industry) => (
                  <div key={industry} className="flex items-center space-x-2">
                    <Checkbox
                      id={`industry-${industry}`}
                      checked={(filters.industry || []).includes(industry)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('industry', industry, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`industry-${industry}`}
                      className="text-sm text-gray-300 cursor-pointer"
                    >
                      {industry}
                    </Label>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Difficulty Filter */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                <Label className="text-sm font-medium text-gray-300">
                  难度级别 {filters.difficulty && filters.difficulty.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {filters.difficulty.length}
                    </Badge>
                  )}
                </Label>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-2">
                {difficultyOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`difficulty-${option.value}`}
                      checked={(filters.difficulty || []).includes(option.value)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('difficulty', option.value, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`difficulty-${option.value}`}
                      className="text-sm text-gray-300 cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* AI Tools Filter */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                <Label className="text-sm font-medium text-gray-300">
                  AI工具 {filters.aiTools && filters.aiTools.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {filters.aiTools.length}
                    </Badge>
                  )}
                </Label>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-2">
                {aiToolOptions.map((tool) => (
                  <div key={tool} className="flex items-center space-x-2">
                    <Checkbox
                      id={`aitool-${tool}`}
                      checked={(filters.aiTools || []).includes(tool)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('aiTools', tool, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`aitool-${tool}`}
                      className="text-sm text-gray-300 cursor-pointer"
                    >
                      {tool}
                    </Label>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UseCaseFiltersComponent;
