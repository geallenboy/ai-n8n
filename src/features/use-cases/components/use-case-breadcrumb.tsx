'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { UseCaseType } from '../types';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home, ChevronRight } from 'lucide-react';

interface UseCaseBreadcrumbProps {
  useCase: UseCaseType;
  showHome?: boolean;
  maxLength?: number;
}

export function UseCaseBreadcrumb({ 
  useCase, 
  showHome = true,
  maxLength = 50 
}: UseCaseBreadcrumbProps) {
  const t = useTranslations('useCases.breadcrumb');
  
  const truncateText = (text: string, maxLen: number) => {
    if (text.length <= maxLen) return text;
    return text.substring(0, maxLen) + '...';
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home */}
        {showHome && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  {t('home')}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
          </>
        )}
        
        {/* Use Cases */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/use-cases">
              {t('useCases')}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>
        
        {/* Category */}
        {useCase.category && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/use-cases?category=${encodeURIComponent(useCase.category)}`}>
                  {useCase.category}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
          </>
        )}
        
        {/* Current Page */}
        <BreadcrumbItem>
          <BreadcrumbPage className="max-w-xs sm:max-w-md lg:max-w-lg">
            {truncateText(useCase.title, maxLength)}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
