import React from 'react';
import { getFeaturedUseCases } from '@/features/common';
import FeaturedUseCasesUI from './featured-use-cases-ui';
import { getUserLocale } from '@/lib/locale';

export default async function FeaturedUseCases() {
  const result = await getFeaturedUseCases();
  const locale = await getUserLocale();
  const useCases = result.success && result.data ? result.data : [];
  
  return <FeaturedUseCasesUI useCases={useCases} locale={locale} />;
} 