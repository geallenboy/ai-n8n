import React from 'react';
import { getLatestTutorials } from '@/features/common';
import FeaturedTutorialsUI from './featured-tutorials-ui';

interface FeaturedTutorialsProps {
  locale: string;
}

export default async function FeaturedTutorials({ locale }: FeaturedTutorialsProps) {
  const result = await getLatestTutorials();
  
  // Convert null to undefined for sectionTitle
  const tutorialsData = result.success && result.data ? 
    result.data.map(tutorial => ({
      ...tutorial,
      sectionTitle: tutorial.sectionTitle || undefined,
    })) : [];
  
  return <FeaturedTutorialsUI locale={locale} tutorials={tutorialsData} />;
} 