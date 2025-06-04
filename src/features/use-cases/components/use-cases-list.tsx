'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { UseCaseType, UseCaseFiltersType } from '@/features/use-cases/types';
import { getFilteredUseCases, getPaginatedUseCases } from '@/lib/data';
import UseCaseCardNew from '@/features/use-cases/components/use-case-card-new';
import { Pagination } from '@/features/use-cases/components/pagination';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface UseCasesListProps {
  useCases: UseCaseType[];
  currentPage: number;
  filters: UseCaseFiltersType;
}

export function UseCasesList({ useCases, currentPage, filters }: UseCasesListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('useCases');
  
  const [filteredUseCases, setFilteredUseCases] = useState<UseCaseType[]>([]);
  const [paginatedData, setPaginatedData] = useState<{
    data: UseCaseType[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>({ data: [], pagination: { page: 1, limit: 9, total: 0, totalPages: 0 } });
  
  const itemsPerPage = 9;

  useEffect(() => {
    const filtered = getFilteredUseCases(filters);
    setFilteredUseCases(filtered);
    
    const paginated = getPaginatedUseCases(filtered, currentPage, itemsPerPage);
    setPaginatedData(paginated);
  }, [useCases, filters, currentPage]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/use-cases?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/use-cases');
  };

  const hasActiveFilters = filters.search || 
    (filters.difficulty && filters.difficulty.length > 0) ||
    (filters.aiTools && filters.aiTools.length > 0) ||
    (filters.tags && filters.tags.length > 0) ||
    (filters.industry && filters.industry.length > 0);

  if (paginatedData.data.length === 0 && hasActiveFilters) {
    return (
      <div className="text-center py-12">
        <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{t('page.noResults')}</h3>
        <p className="text-muted-foreground mb-6">{t('page.tryOtherFilters')}</p>
        <Button onClick={clearFilters} variant="outline">
          <X className="mr-2 h-4 w-4" />
          {t('page.clearFilters')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results count and active filters */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {paginatedData.data.length} of {paginatedData.pagination.total} use cases
        </p>
        {hasActiveFilters && (
          <Button onClick={clearFilters} variant="ghost" size="sm">
            <X className="mr-2 h-4 w-4" />
            {t('page.clearFilters')}
          </Button>
        )}
      </div>

      {/* Use Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedData.data.map((useCase) => (
          <UseCaseCardNew key={useCase.id} useCase={useCase} />
        ))}
      </div>

      {/* Pagination */}
      {paginatedData.pagination.totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <Pagination
            currentPage={paginatedData.pagination.page}
            totalPages={paginatedData.pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
