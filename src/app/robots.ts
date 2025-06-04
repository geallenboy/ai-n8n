import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/backend/',        // 后台管理
          '/api/',           // API 路由
          '/private/',       // 私有页面
          '/_next/',         // Next.js 内部文件
          '/admin/',         // 管理员页面
          '/.well-known/',   // 系统文件
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',       // 禁止 ChatGPT 爬虫
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',       // 禁止 ChatGPT 用户爬虫
      },
      {
        userAgent: 'CCBot',
        disallow: '/',       // 禁止 Common Crawl 爬虫
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',       // 禁止 Anthropic AI 爬虫
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',       // 禁止 Claude 爬虫
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
} 