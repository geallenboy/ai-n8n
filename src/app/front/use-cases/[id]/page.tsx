import { notFound } from 'next/navigation';
import { getUseCaseById } from '@/features/common';
import { getResourceStats, recordView, checkIsFavorited } from '@/features/interactions';
import { auth } from '@clerk/nextjs/server';
import { UseCaseDetailClient } from '@/features/use-cases/components/client';
import SEOHead from '@/components/seo/seo-head';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UseCaseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { userId } = await auth();
  
  const result = await getUseCaseById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const useCase = result.data;

  // 生成SEO数据
  const seoTitle = `${useCase.titleZh || useCase.title} - n8n案例`;
  const seoDescription = useCase.summaryZh || useCase.summary || `探索${useCase.titleZh || useCase.title}的n8n自动化解决方案，学习实用的工作流案例。`;
  const seoKeywords = [
    'n8n案例',
    'n8n工作流',
    useCase.titleZh || useCase.title,
    '自动化案例',
    'API集成案例',
    '工作流模板',
    '实用案例'
  ];

  // 记录查看次数
  if (userId) {
    await recordView('use_case', id, userId);
  } else {
    await recordView('use_case', id);
  }

  // 获取统计信息
  const statsResult = await getResourceStats('use_case', id);
  const stats = statsResult.success ? statsResult.stats : { views: 0, favorites: 0, downloads: 0 };

  // 检查是否已收藏
  const favoriteResult = await checkIsFavorited('use_case', id, userId || undefined);
  const isFavorited = favoriteResult.success ? favoriteResult.isFavorited : false;

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        url={`/front/use-cases/${id}`}
        type="article"
        image={useCase.coverImageUrl || undefined}
        publishedTime={useCase.publishedAt?.toISOString()}
        modifiedTime={useCase.updatedAt?.toISOString()}
        author={useCase.n8nAuthor || "AI-N8N Team"}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          "headline": useCase.titleZh || useCase.title,
          "description": seoDescription,
          "image": useCase.coverImageUrl,
          "author": {
            "@type": "Person",
            "name": useCase.n8nAuthor || "AI-N8N Team"
          },
          "publisher": {
            "@type": "Organization",
            "name": "AI-N8N",
            "logo": {
              "@type": "ImageObject",
              "url": "https://ai-n8n.com/images/logo.png"
            }
          },
          "datePublished": useCase.publishedAt?.toISOString(),
          "dateModified": useCase.updatedAt?.toISOString(),
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://ai-n8n.com/front/use-cases/${id}`
          },
          "articleSection": "UseCase",
          "keywords": seoKeywords.join(", "),
          "about": {
            "@type": "Thing",
            "name": "n8n工作流自动化"
          }
        }}
      />
      <UseCaseDetailClient 
        useCase={useCase}
        stats={stats}
        isFavorited={isFavorited}
        userId={userId}
        id={id}
      />
    </>
  );
} 