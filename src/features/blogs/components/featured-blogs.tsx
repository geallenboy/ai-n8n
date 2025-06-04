import React from 'react';
import { getLatestBlogs } from '@/features/common';
import FeaturedBlogsUI from './featured-blogs-ui';

interface FeaturedBlogsProps {
  locale: string;
}

export default async function FeaturedBlogs({ locale }: FeaturedBlogsProps) {
  const result = await getLatestBlogs();
  
  const blogs = result.success && result.data ? result.data : [];
  
  return <FeaturedBlogsUI locale={locale} blogs={blogs} />;
} 