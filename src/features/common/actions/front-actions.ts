'use server';

import { db } from '@/drizzle';
import { useCases, useCaseCategories, blogs, blogCategories, tutorialModules, tutorialSections } from '@/drizzle/schemas';
import { eq, desc, asc, like, and, or, count } from 'drizzle-orm';

// 获取精选案例（首页展示6条）
export async function getFeaturedUseCases() {
  try {
    const result = await db
      .select({
        id: useCases.id,
        title: useCases.title,
        titleZh: useCases.titleZh,
        summary: useCases.summary,
        summaryZh: useCases.summaryZh,
        coverImageUrl: useCases.coverImageUrl,
        publishedAt: useCases.publishedAt,
      })
      .from(useCases)
      .where(eq(useCases.isPublished, true))
      .orderBy(desc(useCases.publishedAt))
      .limit(6);

    return { success: true, data: result };
  } catch (error) {
    console.error('Error fetching featured use cases:', error);
    return { success: false, error: 'Failed to fetch featured use cases' };
  }
}

// 获取最新教程（教程管理）
export async function getLatestTutorials() {
  try {
    const result = await db
      .select({
        id: tutorialModules.id,
        title: tutorialModules.title,
        titleZh: tutorialModules.titleZh,
        description: tutorialModules.description,
        descriptionZh: tutorialModules.descriptionZh,
        content: tutorialModules.content,
        contentZh: tutorialModules.contentZh,
        estimatedTimeMinutes: tutorialModules.estimatedTimeMinutes,
        sectionTitle: tutorialSections.title,
        createdAt: tutorialModules.createdAt,
      })
      .from(tutorialModules)
      .leftJoin(tutorialSections, eq(tutorialModules.sectionId, tutorialSections.id))
      .orderBy(desc(tutorialModules.createdAt))
      .limit(6);

    return { success: true, data: result };
  } catch (error) {
    console.error('Error fetching latest tutorials:', error);
    return { success: false, error: 'Failed to fetch latest tutorials' };
  }
}

// 获取最新博客（首页展示）
export async function getLatestBlogs() {
  try {
    const result = await db
      .select({
        id: blogs.id,
        url: blogs.url,
        title: blogs.title,
        titleZh: blogs.titleZh,
        excerpt: blogs.excerpt,
        excerptZh: blogs.excerptZh,
        summary: blogs.summary,
        coverImageUrl: blogs.coverImageUrl,
        author: blogs.author,
        publishedAt: blogs.publishedAt,
        categoryName: blogCategories.name,
      })
      .from(blogs)
      .leftJoin(blogCategories, eq(blogs.categoryId, blogCategories.id))
      .where(eq(blogs.isPublished, true))
      .orderBy(desc(blogs.publishedAt))
      .limit(6);

    return { success: true, data: result };
  } catch (error) {
    console.error('Error fetching latest blogs:', error);
    return { success: false, error: 'Failed to fetch latest blogs' };
  }
}

// 获取案例列表（带分页和筛选）
export async function getUseCases(page = 1, limit = 12, search?: string, categoryId?: string) {
  try {
    const offset = (page - 1) * limit;
    const conditions = [eq(useCases.isPublished, true)];

    if (search) {
      conditions.push(
        or(
          like(useCases.title, `%${search}%`),
          like(useCases.titleZh, `%${search}%`)
        )!
      );
    }

    let caseList, totalCount;

    if (categoryId) {
      // 通过关联表查询特定分类的案例
      const { useCaseToCategoryLinks } = await import('@/drizzle/schemas/useCases');
      
      // 先获取该分类下的案例ID
      const categoryUseCaseIds = await db
        .select({ useCaseId: useCaseToCategoryLinks.useCaseId })
        .from(useCaseToCategoryLinks)
        .where(eq(useCaseToCategoryLinks.categoryId, categoryId));
      
      const useCaseIds = categoryUseCaseIds.map(item => item.useCaseId);
      
      if (useCaseIds.length === 0) {
        return {
          success: true,
          data: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0
          }
        };
      }

      // 添加分类条件
      conditions.push(
        (await import('drizzle-orm')).inArray(useCases.id, useCaseIds)
      );

      [caseList, totalCount] = await Promise.all([
        db
          .select({
            id: useCases.id,
            title: useCases.title,
            titleZh: useCases.titleZh,
            summary: useCases.summary,
            summaryZh: useCases.summaryZh,
            coverImageUrl: useCases.coverImageUrl,
            publishedAt: useCases.publishedAt,
            n8nAuthor: useCases.n8nAuthor,
          })
          .from(useCases)
          .where(and(...conditions))
          .orderBy(desc(useCases.publishedAt))
          .limit(limit)
          .offset(offset),
        
        db
          .select({ count: count() })
          .from(useCases)
          .where(and(...conditions))
      ]);
    } else {
      [caseList, totalCount] = await Promise.all([
        db
          .select({
            id: useCases.id,
            title: useCases.title,
            titleZh: useCases.titleZh,
            summary: useCases.summary,
            summaryZh: useCases.summaryZh,
            coverImageUrl: useCases.coverImageUrl,
            publishedAt: useCases.publishedAt,
            n8nAuthor: useCases.n8nAuthor,
          })
          .from(useCases)
          .where(and(...conditions))
          .orderBy(desc(useCases.publishedAt))
          .limit(limit)
          .offset(offset),
        
        db
          .select({ count: count() })
          .from(useCases)
          .where(and(...conditions))
      ]);
    }

    return {
      success: true,
      data: caseList,
      pagination: {
        page,
        limit,
        total: totalCount[0].count,
        totalPages: Math.ceil(totalCount[0].count / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching use cases:', error);
    return { success: false, error: 'Failed to fetch use cases' };
  }
}

// 获取案例分类
export async function getUseCaseCategories() {
  try {
    const result = await db
      .select()
      .from(useCaseCategories)
      .orderBy(asc(useCaseCategories.name));

    return { success: true, data: result };
  } catch (error) {
    console.error('Error fetching use case categories:', error);
    return { success: false, error: 'Failed to fetch use case categories' };
  }
}

// 获取博客列表（带分页和筛选）
export async function getBlogsList(page = 1, limit = 12, search?: string, categoryId?: string) {
  try {
    const offset = (page - 1) * limit;
    const conditions = [eq(blogs.isPublished, true)];

    if (search) {
      conditions.push(
        or(
          like(blogs.title, `%${search}%`),
          like(blogs.titleZh, `%${search}%`),
          like(blogs.summary, `%${search}%`),
          like(blogs.excerpt, `%${search}%`),
          like(blogs.excerptZh, `%${search}%`)
        )!
      );
    }

    if (categoryId) {
      conditions.push(eq(blogs.categoryId, categoryId));
    }

    const [blogList, totalCount] = await Promise.all([
      db
        .select({
          id: blogs.id,
          url: blogs.url,
          title: blogs.title,
          titleZh: blogs.titleZh,
          excerpt: blogs.excerpt,
          excerptZh: blogs.excerptZh,
          summary: blogs.summary,
          coverImageUrl: blogs.coverImageUrl,
          author: blogs.author,
          estimatedReadTime: blogs.estimatedReadTime,
          publishedAt: blogs.publishedAt,
          categoryName: blogCategories.name,
          tags: blogs.tags,
        })
        .from(blogs)
        .leftJoin(blogCategories, eq(blogs.categoryId, blogCategories.id))
        .where(and(...conditions))
        .orderBy(desc(blogs.publishedAt))
        .limit(limit)
        .offset(offset),
      
      db
        .select({ count: count() })
        .from(blogs)
        .where(and(...conditions))
    ]);

    return {
      success: true,
      data: blogList,
      pagination: {
        page,
        limit,
        total: totalCount[0].count,
        totalPages: Math.ceil(totalCount[0].count / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return { success: false, error: 'Failed to fetch blogs' };
  }
}

// 获取博客分类
export async function getBlogsCategories() {
  try {
    const result = await db
      .select()
      .from(blogCategories)
      .orderBy(asc(blogCategories.name));

    return { success: true, data: result };
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return { success: false, error: 'Failed to fetch blog categories' };
  }
}

// 获取教程版块与模块列表（用于首页和教程页面）
export async function getTutorialSectionsWithModules() {
  try {
    const sections = await db
      .select({
        id: tutorialSections.id,
        title: tutorialSections.title,
        titleZh: tutorialSections.titleZh,
        description: tutorialSections.description,
        descriptionZh: tutorialSections.descriptionZh,
        icon: tutorialSections.icon,
        color: tutorialSections.color,
        difficulty: tutorialSections.difficulty,
        order: tutorialSections.order,
        isActive: tutorialSections.isActive,
        createdAt: tutorialSections.createdAt,
        updatedAt: tutorialSections.updatedAt,
      })
      .from(tutorialSections)
      .orderBy(asc(tutorialSections.order));

    const sectionsWithModules = await Promise.all(
      sections.map(async (section) => {
        const modules = await db
          .select({
            id: tutorialModules.id,
            title: tutorialModules.title,
            titleZh: tutorialModules.titleZh,
            description: tutorialModules.description,
            descriptionZh: tutorialModules.descriptionZh,
            estimatedTimeMinutes: tutorialModules.estimatedTimeMinutes,
            difficulty: tutorialModules.difficulty,
            tags: tutorialModules.tags,
            learningObjectives: tutorialModules.learningObjectives,
            isPublished: tutorialModules.isPublished,
            order: tutorialModules.order,
          })
          .from(tutorialModules)
          .where(eq(tutorialModules.sectionId, section.id))
          .orderBy(asc(tutorialModules.order));

        return {
          ...section,
          modules
        };
      })
    );

    return { success: true, data: sectionsWithModules };
  } catch (error) {
    console.error('Error fetching tutorial sections with modules:', error);
    return { success: false, error: 'Failed to fetch tutorial sections with modules' };
  }
}

// 获取单个案例详情
export async function getUseCaseById(id: string) {
  try {
    const [useCase] = await db
      .select()
      .from(useCases)
      .where(and(eq(useCases.id, id), eq(useCases.isPublished, true)));

    if (!useCase) {
      return { success: false, error: 'Use case not found' };
    }

    return { success: true, data: useCase };
  } catch (error) {
    console.error('Error fetching use case:', error);
    return { success: false, error: 'Failed to fetch use case' };
  }
}

// 获取单个博客详情
export async function getBlogById(id: string) {
  try {
    const [blog] = await db
      .select({
        id: blogs.id,
        url: blogs.url,
        title: blogs.title,
        titleZh: blogs.titleZh,
        excerpt: blogs.excerpt,
        excerptZh: blogs.excerptZh,
        summary: blogs.summary,
        content: blogs.content,
        readme: blogs.readme,
        readmeZh: blogs.readmeZh,
        coverImageUrl: blogs.coverImageUrl,
        thumbnail: blogs.thumbnail,
        author: blogs.author,
        estimatedReadTime: blogs.estimatedReadTime,
        tags: blogs.tags,
        publishedAt: blogs.publishedAt,
        crawledAt: blogs.crawledAt,
        categoryName: blogCategories.name,
      })
      .from(blogs)
      .leftJoin(blogCategories, eq(blogs.categoryId, blogCategories.id))
      .where(and(eq(blogs.id, id), eq(blogs.isPublished, true)));

    if (!blog) {
      return { success: false, error: 'blog not found' };
    }

    return { success: true, data: blog };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return { success: false, error: 'Failed to fetch blog' };
  }
}

// 获取教程管理详情
export async function getTutorialModuleById(id: string) {
  try {
    const [module] = await db
      .select({
        id: tutorialModules.id,
        title: tutorialModules.title,
        titleZh: tutorialModules.titleZh,
        description: tutorialModules.description,
        descriptionZh: tutorialModules.descriptionZh,
        content: tutorialModules.content,
        contentZh: tutorialModules.contentZh,
        videoUrl: tutorialModules.videoUrl,
        estimatedTimeMinutes: tutorialModules.estimatedTimeMinutes,
        difficulty: tutorialModules.difficulty,
        prerequisites: tutorialModules.prerequisites,
        learningObjectives: tutorialModules.learningObjectives,
        tags: tutorialModules.tags,
        order: tutorialModules.order,
        isPublished: tutorialModules.isPublished,
        sectionTitle: tutorialSections.title,
        sectionId: tutorialModules.sectionId,
      })
      .from(tutorialModules)
      .leftJoin(tutorialSections, eq(tutorialModules.sectionId, tutorialSections.id))
      .where(eq(tutorialModules.id, id));

    if (!module) {
      return { success: false, error: 'Tutorial module not found' };
    }

    return { success: true, data: module };
  } catch (error) {
    console.error('Error fetching tutorial module:', error);
    return { success: false, error: 'Failed to fetch tutorial module' };
  }
}

// 获取仪表盘统计数据
export async function getDashboardStats() {
  try {
    const [
      totalUseCases,
      totalBlogs,
      totalTutorials,
      publishedUseCases,
      publishedBlogs,
      recentUseCases,
      recentBlogs,
      recentTutorials
    ] = await Promise.all([
      // 总案例数
      db.select({ count: count() }).from(useCases),
      // 总博客数
      db.select({ count: count() }).from(blogs),
      // 总教程数
      db.select({ count: count() }).from(tutorialModules),
      // 已发布案例数
      db.select({ count: count() }).from(useCases).where(eq(useCases.isPublished, true)),
      // 已发布博客数
      db.select({ count: count() }).from(blogs).where(eq(blogs.isPublished, true)),
      // 最近案例
      db.select({
        id: useCases.id,
        title: useCases.title,
        titleZh: useCases.titleZh,
        publishedAt: useCases.publishedAt,
        createdAt: useCases.createdAt
      })
      .from(useCases)
      .where(eq(useCases.isPublished, true))
      .orderBy(desc(useCases.publishedAt))
      .limit(5),
      // 最近博客
      db.select({
        id: blogs.id,
        title: blogs.title,
        publishedAt: blogs.publishedAt,
        author: blogs.author
      })
      .from(blogs)
      .where(eq(blogs.isPublished, true))
      .orderBy(desc(blogs.publishedAt))
      .limit(5),
      // 最近教程
      db.select({
        id: tutorialModules.id,
        title: tutorialModules.title,
        createdAt: tutorialModules.createdAt,
        estimatedTimeMinutes: tutorialModules.estimatedTimeMinutes
      })
      .from(tutorialModules)
      .orderBy(desc(tutorialModules.createdAt))
      .limit(5)
    ]);

    return {
      success: true,
      data: {
        stats: {
          totalUseCases: totalUseCases[0].count,
          totalBlogs: totalBlogs[0].count,
          totalTutorials: totalTutorials[0].count,
          publishedUseCases: publishedUseCases[0].count,
          publishedBlogs: publishedBlogs[0].count
        },
        recent: {
          useCases: recentUseCases,
          blogs: recentBlogs,
          tutorials: recentTutorials
        }
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { success: false, error: 'Failed to fetch dashboard stats' };
  }
}

// 获取案例统计信息
export async function getUseCaseStatsForFrontend() {
  try {
    // 获取已发布案例总数
    const totalResult = await db.select({ count: count() }).from(useCases).where(eq(useCases.isPublished, true));
    const total = Number(totalResult[0]?.count) || 0;

    // 获取分类数量
    const { useCaseCategories } = await import('@/drizzle/schemas/useCases');
    const categoriesResult = await db.select({ count: count() }).from(useCaseCategories);
    const categories = Number(categoriesResult[0]?.count) || 0;

    // 模拟总下载量（基于案例数量和时间的确定性算法）
    const baseDownloads = total * 150; // 每个案例平均150次下载
    const timeBonus = Math.floor((Date.now() - new Date('2023-01-01').getTime()) / (1000 * 60 * 60 * 24)) * 5; // 每天增加5次下载
    const totalDownloads = baseDownloads + timeBonus;

    return {
      success: true,
      data: {
        total,
        categories,
        totalDownloads
      }
    };
  } catch (error) {
    console.error('Error fetching use case stats:', error);
    return { success: false, error: 'Failed to fetch use case stats' };
  }
}

// 获取教程统计信息
export async function getTutorialStatsById(tutorialId: string): Promise<{ success: boolean; data?: { views: number; likes: number; completions: number; rating: number }; error?: string }> {
  try {
    // 这里使用确定性算法生成统计数据，基于教程ID
    const baseViews = tutorialId.charCodeAt(0) * 17 + tutorialId.charCodeAt(1 % tutorialId.length) * 23;
    const baseLikes = tutorialId.charCodeAt(0) * 7 + tutorialId.charCodeAt(2 % tutorialId.length) * 11;
    const baseCompletions = tutorialId.charCodeAt(0) * 13 + tutorialId.charCodeAt(3 % tutorialId.length) * 19;
    const baseRating = (tutorialId.charCodeAt(0) * 3 + tutorialId.charCodeAt(4 % tutorialId.length) * 5) % 20 + 35; // 3.5-5.0之间

    const views = (baseViews % 1500) + 500; // 500-2000之间
    const likes = (baseLikes % 250) + 50;   // 50-300之间
    const completions = (baseCompletions % 700) + 100; // 100-800之间
    const rating = parseFloat((baseRating / 10).toFixed(1)); // 转换为3.5-5.0的评分

    return {
      success: true,
      data: {
        views,
        likes,
        completions,
        rating
      }
    };
  } catch (error) {
    console.error('Error getting tutorial stats:', error);
    return {
      success: false,
      error: '获取教程统计失败'
    };
  }
}

// 获取教程分章节信息
export async function getTutorialSectionById(sectionId: string) {
  try {
    const result = await db
      .select()
      .from(tutorialSections)
      .where(eq(tutorialSections.id, sectionId))
      .limit(1);
    
    if (result.length === 0) {
      return { success: false, error: 'Section not found' };
    }
    
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error fetching tutorial section:', error);
    return { success: false, error: 'Failed to fetch tutorial section' };
  }
}

// 按分类获取教程列表
export async function getTutorialsByCategory(
  sectionId: string, 
  options: {
    page?: number;
    pageSize?: number;
    difficulty?: string;
    search?: string;
  } = {}
) {
  try {
    const { page = 1, pageSize = 12, difficulty, search } = options;
    const offset = (page - 1) * pageSize;
    
    // 构建查询条件
    let whereConditions = [eq(tutorialModules.sectionId, sectionId)];
    
    if (difficulty && difficulty !== 'all') {
      whereConditions.push(eq(tutorialModules.difficulty, difficulty));
    }
    
    if (search) {
      const searchCondition = or(
        like(tutorialModules.title, `%${search}%`),
        like(tutorialModules.titleZh, `%${search}%`),
        like(tutorialModules.description, `%${search}%`),
        like(tutorialModules.descriptionZh, `%${search}%`)
      );
      if (searchCondition) {
        whereConditions.push(searchCondition);
      }
    }
    
    // 获取教程列表
    const tutorials = await db
      .select()
      .from(tutorialModules)
      .where(whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0])
      .orderBy(desc(tutorialModules.createdAt))
      .limit(pageSize)
      .offset(offset);
    
    // 获取总数
    const totalResult = await db
      .select({ count: count() })
      .from(tutorialModules)
      .where(whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0]);
    
    const total = totalResult[0]?.count || 0;
    const totalPages = Math.ceil(total / pageSize);
    
    return {
      success: true,
      data: {
        tutorials,
        pagination: {
          page,
          pageSize,
          total,
          totalPages
        }
      }
    };
  } catch (error) {
    console.error('Error fetching tutorials by category:', error);
    return { success: false, error: 'Failed to fetch tutorials by category' };
  }
} 