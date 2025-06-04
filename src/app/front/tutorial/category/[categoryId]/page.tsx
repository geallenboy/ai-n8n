import React from 'react';
import { notFound } from 'next/navigation';
import { getTutorialsByCategory, getTutorialSectionById } from '@/features/common/actions/front-actions';
import { TutorialCategoryClient } from '@/features/tutorial';
import SEOHead from '@/components/seo/seo-head';

interface TutorialCategoryPageProps {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ page?: string; difficulty?: string; search?: string }>;
}

export default async function TutorialCategoryPage({ 
  params, 
  searchParams 
}: TutorialCategoryPageProps) {
  const { categoryId } = await params;
  const { page, difficulty, search } = await searchParams;
  
  const currentPage = parseInt(page || '1', 10);
  const pageSize = 12;
  
  // 获取分类信息
  const sectionResult = await getTutorialSectionById(categoryId);
  if (!sectionResult.success || !sectionResult.data) {
    notFound();
  }
  
  const section = sectionResult.data;
  
  // 获取该分类下的教程
  const tutorialsResult = await getTutorialsByCategory(categoryId, {
    page: currentPage,
    pageSize,
    difficulty: difficulty || undefined,
    search: search || undefined
  });
  
  if (!tutorialsResult.success || !tutorialsResult.data) {
    notFound();
  }
  
  const { tutorials, pagination } = tutorialsResult.data;
  
  // 生成SEO数据
  const seoTitle = `${section.titleZh || section.title} - n8n教程分类`;
  const seoDescription = section.descriptionZh || section.description || `学习${section.titleZh || section.title}相关的n8n自动化工作流教程，提升技能水平。`;
  const seoKeywords = [
    'n8n教程',
    section.titleZh || section.title,
    'n8n学习',
    '工作流自动化',
    'API自动化',
    '教程分类',
    'n8n基础',
    'n8n进阶'
  ];

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        url={`/front/tutorial/category/${categoryId}`}
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": section.titleZh || section.title,
          "description": seoDescription,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://ai-n8n.com/front/tutorial/category/${categoryId}`
          },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "首页",
                "item": "https://ai-n8n.com"
              },
              {
                "@type": "ListItem", 
                "position": 2,
                "name": "教程",
                "item": "https://ai-n8n.com/front/tutorial"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": section.titleZh || section.title,
                "item": `https://ai-n8n.com/front/tutorial/category/${categoryId}`
              }
            ]
          },
          "numberOfItems": pagination.total,
          "provider": {
            "@type": "Organization",
            "name": "AI-N8N"
          }
        }}
      />
      <TutorialCategoryClient
        section={section}
        tutorials={tutorials}
        pagination={pagination}
        filters={{
          difficulty: difficulty || '',
          search: search || ''
        }}
      />
    </>
  );
} 