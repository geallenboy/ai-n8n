'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { UseCaseType } from '@/features/use-cases/types';
import UseCaseCardNew from '@/features/use-cases/components/use-case-card-new';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RelatedUseCasesProps {
  useCases: UseCaseType[];
  currentUseCaseId?: string;
  title?: string;
  showViewAll?: boolean;
}

export function RelatedUseCases({ 
  useCases, 
  currentUseCaseId,
  title,
  showViewAll = true 
}: RelatedUseCasesProps) {
  const t = useTranslations('useCases.detail');
  
  // Filter out current use case if provided
  const filteredUseCases = currentUseCaseId 
    ? useCases.filter(useCase => useCase.id !== currentUseCaseId)
    : useCases;

  if (filteredUseCases.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            {title || t('relatedUseCases')}
          </h2>
          <p className="text-muted-foreground">
            {t('exploreMoreCases')}
          </p>
        </div>
        
        {showViewAll && (
          <Button asChild variant="outline">
            <Link href="/use-cases" className="flex items-center gap-2">
              {t('viewAllCases')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      {/* Related Use Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUseCases.slice(0, 3).map((useCase) => (
          <UseCaseCardNew key={useCase.id} useCase={useCase} />
        ))}
      </div>

      {/* Show more button if there are more than 3 related cases */}
      {filteredUseCases.length > 3 && showViewAll && (
        <div className="text-center mt-8">
          <Button asChild variant="ghost">
            <Link href="/use-cases" className="flex items-center gap-2">
              {t('seeMoreRelated')} ({filteredUseCases.length - 3} more)
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}
