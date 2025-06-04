import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import { getBlogById } from '@/features/common/actions/front-actions';
import BlogDetailClient from '@/features/blogs/components/client';
import SEOHead from '@/components/seo/seo-head';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { userId } = await auth();
  
  const result = await getBlogById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const blog = result.data;

  // 生成SEO数据
  const seoTitle = `${blog.titleZh || blog.title} - n8n博客`;
  const seoDescription = blog.excerptZh || blog.excerpt || blog.summary || `阅读关于${blog.titleZh || blog.title}的最新n8n资讯，了解工作流自动化的最新动态。`;
  const seoKeywords = [
    'n8n博客',
    'n8n资讯',
    blog.titleZh || blog.title,
    '自动化资讯',
    'n8n新闻',
    '工作流动态',
    'API自动化新闻'
  ];

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        url={`/front/blogs/${id}`}
        type="article"
        publishedTime={blog.publishedAt?.toISOString()}
        author={blog.author || "AI-N8N Team"}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": blog.titleZh || blog.title,
          "description": seoDescription,
          "author": {
            "@type": "Person",
            "name": blog.author || "AI-N8N Team"
          },
          "publisher": {
            "@type": "Organization",
            "name": "AI-N8N",
            "logo": {
              "@type": "ImageObject",
              "url": "https://ai-n8n.com/images/logo.png"
            }
          },
          "datePublished": blog.publishedAt?.toISOString(),
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://ai-n8n.com/front/blogs/${id}`
          },
          "articleSection": "Blog",
          "keywords": seoKeywords.join(", "),
          "about": {
            "@type": "Thing",
            "name": "n8n工作流自动化"
          }
        }}
      />
      <BlogDetailClient 
        blog={blog}
        blogId={id}
      />
    </>
  );
} 