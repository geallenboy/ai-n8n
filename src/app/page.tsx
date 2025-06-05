'use client';

import React, { useEffect, useState } from "react";
import { HeroSection } from "@/features/common";
import { Content } from "@/features/home";
import { useLocale } from 'next-intl';
import { getDashboardStats, getFeaturedUseCases, getLatestTutorials, getLatestBlogs } from "@/features/common";
import { UseCaseType } from "@/features/use-cases";
import { TutorialModuleType } from "@/features/tutorial";
import { BlogType } from "@/features/blogs";
import { Navigation,Footer } from "@/features/layout";

interface StatsType {
  totalUseCases: number;
  totalBlogs: number;
  totalTutorials: number;
  publishedUseCases: number;
  publishedBlogs: number;
}

interface PageData {
  stats: StatsType | null;
  useCases: UseCaseType[];
  tutorials: TutorialModuleType[];
  blogs: BlogType[];
}

export default function HomePage() {
  const locale = useLocale();
  const [data, setData] = useState<PageData>({
    stats: null,
    useCases: [],
    tutorials: [],
    blogs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsResult, useCasesResult, tutorialsResult, blogsResult] = await Promise.all([
          getDashboardStats(),
          getFeaturedUseCases(),
          getLatestTutorials(),
          getLatestBlogs()
        ]);

        // Convert null to undefined for sectionTitle in tutorials
        const tutorialsData = tutorialsResult.success ? 
          (tutorialsResult.data || []).map(tutorial => ({
            ...tutorial,
            sectionTitle: tutorial.sectionTitle || undefined,
          })) : [];

        setData({
          stats: statsResult.success && statsResult.data ? statsResult.data.stats : null,
          useCases: useCasesResult.success ? (useCasesResult.data || []) : [],
          tutorials: tutorialsData,
          blogs: blogsResult.success ? (blogsResult.data || []) : []
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]); // 依赖locale，当语言切换时重新获取数据

  return (
    <main className="min-h-screen">
        <Navigation />
        <HeroSection />
        <Content 
            locale={locale}
            stats={data.stats}
            useCases={data.useCases}
            tutorials={data.tutorials}
            blogs={data.blogs}
        />
        
        <Footer />
    </main>
  );
}
