import React from 'react';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getTutorialModuleById } from '@/features/common';
import TutorialDetailClient from '@/features/tutorial/components/client';
import SEOHead from '@/components/seo/seo-head';

interface TutorialDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TutorialDetailPage({ params }: TutorialDetailPageProps) {
  const { id } = await params;
  const { userId } = await auth();
  
  const result = await getTutorialModuleById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const tutorial = result.data;

  // 生成SEO数据
  const seoTitle = `${tutorial.titleZh || tutorial.title} - n8n教程`;
  const seoDescription = tutorial.descriptionZh || tutorial.description || `学习${tutorial.titleZh || tutorial.title}，掌握n8n自动化工作流技能。`;
  const seoKeywords = [
    'n8n教程',
    'n8n学习',
    tutorial.titleZh || tutorial.title,
    '工作流自动化',
    'API自动化',
    '教程指南',
    ...(tutorial.tags || [])
  ];

  // 转换数据以符合组件期望的类型
  const tutorialData = {
    ...tutorial,
    sectionTitle: tutorial.sectionTitle || undefined,
  };

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        url={`/front/tutorial/${id}`}
        type="article"
        tags={tutorial.tags || undefined}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          "headline": tutorial.titleZh || tutorial.title,
          "description": seoDescription,
          "author": {
            "@type": "Organization",
            "name": "AI-N8N"
          },
          "publisher": {
            "@type": "Organization",
            "name": "AI-N8N",
            "logo": {
              "@type": "ImageObject",
              "url": "https://ai-n8n.com/images/logo.png"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://ai-n8n.com/front/tutorial/${id}`
          },
          "articleSection": "Tutorial",
          "keywords": seoKeywords.join(", "),
          "educationalLevel": tutorial.difficulty || "beginner",
          "timeRequired": `PT${tutorial.estimatedTimeMinutes || 30}M`,
          "learningResourceType": "Tutorial"
        }}
      />
      <TutorialDetailClient tutorial={tutorialData} />
    </>
  );
} 