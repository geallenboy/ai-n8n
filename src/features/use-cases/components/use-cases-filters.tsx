'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { UseCaseFiltersType } from '@/features/use-cases/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, ChevronDown, X } from 'lucide-react';

interface UseCasesFiltersProps {
  categories: string[];
  tags: string[];
  aiTools: string[];
  initialFilters: UseCaseFiltersType;
}

export function UseCasesFilters({ 
  categories, 
  tags, 
  aiTools, 
  initialFilters 
}: UseCasesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('useCases.filters');
  
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || '');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>(
    initialFilters.difficulty || []
  );
  const [selectedAiTools, setSelectedAiTools] = useState<string[]>(
    initialFilters.aiTools || []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialFilters.tags || []
  );
  const [selectedCategory, setSelectedCategory] = useState<string[]>(
    initialFilters.industry || []
  );
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const difficulties = ['beginner', 'intermediate', 'advanced'];

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('search', searchQuery);
    if (selectedDifficulty.length > 0) params.set('difficulty', selectedDifficulty.join(','));
    if (selectedAiTools.length > 0) params.set('aiTools', selectedAiTools.join(','));
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
    if (selectedCategory.length > 0) params.set('category', selectedCategory.join(','));
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    router.push(`/use-cases?${params.toString()}`);
  }, [searchQuery, selectedDifficulty, selectedAiTools, selectedTags, selectedCategory, router]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateURL();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [updateURL]);

  const handleDifficultyChange = (difficulty: string, checked: boolean) => {
    setSelectedDifficulty(prev => 
      checked 
        ? [...prev, difficulty]
        : prev.filter(d => d !== difficulty)
    );
  };

  const handleAiToolChange = (tool: string, checked: boolean) => {
    setSelectedAiTools(prev => 
      checked 
        ? [...prev, tool]
        : prev.filter(t => t !== tool)
    );
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    setSelectedTags(prev => 
      checked 
        ? [...prev, tag]
        : prev.filter(t => t !== tag)
    );
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategory(prev => 
      checked 
        ? [...prev, category]
        : prev.filter(c => c !== category)
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty([]);
    setSelectedAiTools([]);
    setSelectedTags([]);
    setSelectedCategory([]);
    router.push('/use-cases');
  };

  const activeFiltersCount = 
    (searchQuery ? 1 : 0) +
    selectedDifficulty.length +
    selectedAiTools.length +
    selectedTags.length +
    selectedCategory.length;

  return (
    <div className="bg-background border rounded-lg p-6">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filters Toggle */}
      <div className="flex items-center justify-between mb-4">
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="p-0 h-auto font-semibold">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Industry/Category Filter */}
              <div>
                <h4 className="font-medium mb-3">{t('industry')}</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategory.includes(category)}
                        onCheckedChange={(checked) => 
                          handleCategoryChange(category, checked as boolean)
                        }
                      />
                      <label 
                        htmlFor={`category-${category}`}
                        className="text-sm cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <h4 className="font-medium mb-3">{t('difficulty')}</h4>
                <div className="space-y-2">
                  {difficulties.map((difficulty) => (
                    <div key={difficulty} className="flex items-center space-x-2">
                      <Checkbox
                        id={`difficulty-${difficulty}`}
                        checked={selectedDifficulty.includes(difficulty)}
                        onCheckedChange={(checked) => 
                          handleDifficultyChange(difficulty, checked as boolean)
                        }
                      />
                      <label 
                        htmlFor={`difficulty-${difficulty}`}
                        className="text-sm cursor-pointer capitalize"
                      >
                        {t(difficulty as 'beginner' | 'intermediate' | 'advanced')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Tools Filter */}
              <div>
                <h4 className="font-medium mb-3">{t('aiTools')}</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {aiTools.map((tool) => (
                    <div key={tool} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tool-${tool}`}
                        checked={selectedAiTools.includes(tool)}
                        onCheckedChange={(checked) => 
                          handleAiToolChange(tool, checked as boolean)
                        }
                      />
                      <label 
                        htmlFor={`tool-${tool}`}
                        className="text-sm cursor-pointer"
                      >
                        {tool}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              <div>
                <h4 className="font-medium mb-3">{t('tags')}</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {tags.slice(0, 10).map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={(checked) => 
                          handleTagChange(tag, checked as boolean)
                        }
                      />
                      <label 
                        htmlFor={`tag-${tag}`}
                        className="text-sm cursor-pointer"
                      >
                        {tag}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {activeFiltersCount > 0 && (
          <Button onClick={clearAllFilters} variant="outline" size="sm">
            <X className="mr-2 h-4 w-4" />
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {searchQuery}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSearchQuery('')}
              />
            </Badge>
          )}
          {selectedDifficulty.map((difficulty) => (
            <Badge key={difficulty} variant="secondary" className="flex items-center gap-1">
              {t(difficulty as 'beginner' | 'intermediate' | 'advanced')}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleDifficultyChange(difficulty, false)}
              />
            </Badge>
          ))}
          {selectedAiTools.map((tool) => (
            <Badge key={tool} variant="secondary" className="flex items-center gap-1">
              {tool}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleAiToolChange(tool, false)}
              />
            </Badge>
          ))}
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleTagChange(tag, false)}
              />
            </Badge>
          ))}
          {selectedCategory.map((category) => (
            <Badge key={category} variant="secondary" className="flex items-center gap-1">
              {category}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleCategoryChange(category, false)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
