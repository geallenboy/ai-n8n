import { MetadataRoute } from 'next'
import { db } from '@/drizzle'
import { blogs, useCases, tutorialSections, tutorialModules } from '@/drizzle/schemas'
import { eq } from 'drizzle-orm'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  try {
    // 获取动态内容
    const [blogPosts, useCasesList, tutorialSectionsList, tutorialModulesList] = await Promise.all([
      db.select({
        url: blogs.url,
        updatedAt: blogs.updatedAt,
        isPublished: blogs.isPublished,
      }).from(blogs).where(eq(blogs.isPublished, true)),
      
      db.select({
        id: useCases.id,
        updatedAt: useCases.updatedAt,
        isPublished: useCases.isPublished,
      }).from(useCases).where(eq(useCases.isPublished, true)),
      
      db.select({
        id: tutorialSections.id,
        updatedAt: tutorialSections.updatedAt,
        isActive: tutorialSections.isActive,
      }).from(tutorialSections).where(eq(tutorialSections.isActive, true)),
      
      db.select({
        id: tutorialModules.id,
        updatedAt: tutorialModules.updatedAt,
        isPublished: tutorialModules.isPublished,
      }).from(tutorialModules).where(eq(tutorialModules.isPublished, true)),
    ])

    const sitemap: MetadataRoute.Sitemap = [
      // 静态页面
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/front/blogs`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/front/use-cases`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/front/tutorials`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/front/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/front/pricing`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      
      // 博客文章
      ...blogPosts.filter(post => post.url).map((post) => ({
        url: `${baseUrl}/front/blogs/${post.url}`,
        lastModified: post.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
      
      // 用例页面
      ...useCasesList.map((useCase) => ({
        url: `${baseUrl}/front/use-cases/${useCase.id}`,
        lastModified: useCase.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
      
      // 教程分类
      ...tutorialSectionsList.map((section) => ({
        url: `${baseUrl}/front/tutorials/${section.id}`,
        lastModified: section.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
      
      // 教程模块
      ...tutorialModulesList.map((module) => ({
        url: `${baseUrl}/front/tutorials/modules/${module.id}`,
        lastModified: module.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
    ]

    return sitemap
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // 返回基本的sitemap
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ]
  }
} 