'use server';

import { db } from '@/drizzle';
import { users } from '@/drizzle/schemas/users';
import { blogs } from '@/drizzle/schemas/blogs';
import { useCases } from '@/drizzle/schemas/useCases';
import { tutorialSections, tutorialModules, userTutorialProgress } from '@/drizzle/schemas/tutorial';
import { eq, desc, gte, sql } from 'drizzle-orm';

// 获取仪表盘总览数据
export async function getDashboardOverview() {
  try {
    // 并行获取所有统计数据
    const [
      totalUsers,
      activeUsers,
      adminUsers,
      totalBlogs,
      publishedBlogs,
      totalUseCases,
      publishedUseCases,
      totalSections,
      totalModules,
      totalProgress,
      completedProgress
    ] = await Promise.all([
      // 用户统计
      db.select({ count: sql<number>`count(*)` }).from(users),
      db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.isActive, true)),
      db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.isAdmin, true)),
      
      // 博客统计
      db.select({ count: sql<number>`count(*)` }).from(blogs),
      db.select({ count: sql<number>`count(*)` }).from(blogs).where(eq(blogs.isPublished, true)),
      
      // 案例统计
      db.select({ count: sql<number>`count(*)` }).from(useCases),
      db.select({ count: sql<number>`count(*)` }).from(useCases).where(eq(useCases.isPublished, true)),
      
      // 教程管理统计
      db.select({ count: sql<number>`count(*)` }).from(tutorialSections),
      db.select({ count: sql<number>`count(*)` }).from(tutorialModules),
      db.select({ count: sql<number>`count(*)` }).from(userTutorialProgress),
      db.select({ count: sql<number>`count(*)` }).from(userTutorialProgress).where(eq(userTutorialProgress.status, 'completed'))
    ]);

    return {
      success: true,
      data: {
        users: {
          total: totalUsers[0].count,
          active: activeUsers[0].count,
          admins: adminUsers[0].count,
          inactive: totalUsers[0].count - activeUsers[0].count
        },
        blogs: {
          total: totalBlogs[0].count,
          published: publishedBlogs[0].count,
          drafts: totalBlogs[0].count - publishedBlogs[0].count
        },
        useCases: {
          total: totalUseCases[0].count,
          published: publishedUseCases[0].count,
          drafts: totalUseCases[0].count - publishedUseCases[0].count
        },
        tutorial: {
          totalSections: totalSections[0].count,
          totalModules: totalModules[0].count,
          totalProgress: totalProgress[0].count,
          completedProgress: completedProgress[0].count,
          completionRate: totalProgress[0].count > 0 ? (completedProgress[0].count / totalProgress[0].count) * 100 : 0
        }
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    return { success: false, error: 'Failed to fetch dashboard overview' };
  }
}

// 获取最近活动数据
export async function getRecentActivity() {
  try {
    // 获取最近的用户注册
    const recentUsers = await db.select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      createdAt: users.createdAt,
      type: sql<string>`'user'`
    }).from(users)
    .orderBy(desc(users.createdAt))
    .limit(5);

    // 获取最近发布的博客
    const recentBlogs = await db.select({
      id: blogs.id,
      title: blogs.title,
      publishedAt: blogs.publishedAt,
      type: sql<string>`'blog'`
    }).from(blogs)
    .where(eq(blogs.isPublished, true))
    .orderBy(desc(blogs.publishedAt))
    .limit(5);

    // 获取最近发布的案例
    const recentUseCases = await db.select({
      id: useCases.id,
      title: useCases.title,
      publishedAt: useCases.publishedAt,
      type: sql<string>`'usecase'`
    }).from(useCases)
    .where(eq(useCases.isPublished, true))
    .orderBy(desc(useCases.publishedAt))
    .limit(5);

    // 获取最近的教程进度
    const recentProgress = await db.select({
      id: userTutorialProgress.id,
      userId: userTutorialProgress.userId,
      status: userTutorialProgress.status,
      completedAt: userTutorialProgress.completedAt,
      moduleTitle: tutorialModules.title,
      type: sql<string>`'progress'`
    }).from(userTutorialProgress)
    .innerJoin(tutorialModules, eq(userTutorialProgress.moduleId, tutorialModules.id))
    .where(eq(userTutorialProgress.status, 'completed'))
    .orderBy(desc(userTutorialProgress.completedAt))
    .limit(5);

    return {
      success: true,
      data: {
        recentUsers,
        recentBlogs,
        recentUseCases,
        recentProgress
      }
    };
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return { success: false, error: 'Failed to fetch recent activity' };
  }
}

// 获取增长趋势数据（最近30天）
export async function getGrowthTrends() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      userGrowth,
      blogGrowth,
      useCaseGrowth,
      progressGrowth
    ] = await Promise.all([
      // 用户增长
      db.select({ count: sql<number>`count(*)` })
        .from(users)
        .where(gte(users.createdAt, thirtyDaysAgo)),
      
      // 博客增长
      db.select({ count: sql<number>`count(*)` })
        .from(blogs)
        .where(gte(blogs.createdAt, thirtyDaysAgo)),
      
      // 案例增长
      db.select({ count: sql<number>`count(*)` })
        .from(useCases)
        .where(gte(useCases.createdAt, thirtyDaysAgo)),
      
      // 教程进度增长
      db.select({ count: sql<number>`count(*)` })
        .from(userTutorialProgress)
        .where(gte(userTutorialProgress.startedAt, thirtyDaysAgo))
    ]);

    return {
      success: true,
      data: {
        userGrowth: userGrowth[0].count,
        blogGrowth: blogGrowth[0].count,
        useCaseGrowth: useCaseGrowth[0].count,
        progressGrowth: progressGrowth[0].count
      }
    };
  } catch (error) {
    console.error('Error fetching growth trends:', error);
    return { success: false, error: 'Failed to fetch growth trends' };
  }
}

// 获取热门内容
export async function getPopularContent() {
  try {
    // 获取最受欢迎的博客（按发布时间排序，实际项目中可以按浏览量等指标）
    const popularBlogs = await db.select({
      id: blogs.id,
      title: blogs.title,
      publishedAt: blogs.publishedAt,
    }).from(blogs)
    .where(eq(blogs.isPublished, true))
    .orderBy(desc(blogs.publishedAt))
    .limit(10);

    // 获取最受欢迎的案例
    const popularUseCases = await db.select({
      id: useCases.id,
      title: useCases.title,
      publishedAt: useCases.publishedAt,
    }).from(useCases)
    .where(eq(useCases.isPublished, true))
    .orderBy(desc(useCases.publishedAt))
    .limit(10);

    // 获取最受欢迎的教程管理（按完成人数排序）
    const popularModules = await db.select({
      moduleId: tutorialModules.id,
      title: tutorialModules.title,
      completedCount: sql<number>`count(*)`
    }).from(tutorialModules)
    .leftJoin(userTutorialProgress, eq(tutorialModules.id, userTutorialProgress.moduleId))
    .where(eq(userTutorialProgress.status, 'completed'))
    .groupBy(tutorialModules.id, tutorialModules.title)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

    return {
      success: true,
      data: {
        popularBlogs,
        popularUseCases,
        popularModules
      }
    };
  } catch (error) {
    console.error('Error fetching popular content:', error);
    return { success: false, error: 'Failed to fetch popular content' };
  }
}

// 获取系统健康状态
export async function getSystemHealth() {
  try {
    // 检查数据库连接
    const dbCheck = await db.select({ count: sql<number>`count(*)` }).from(users).limit(1);
    
    // 获取系统基本信息
    const systemInfo = {
      database: dbCheck ? 'healthy' : 'error',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      platform: process.platform
    };

    return {
      success: true,
      data: systemInfo
    };
  } catch (error) {
    console.error('Error fetching system health:', error);
    return { 
      success: false, 
      error: 'Failed to fetch system health',
      data: {
        database: 'error',
        uptime: 0,
        memory: process.memoryUsage(),
        version: process.version,
        platform: process.platform
      }
    };
  }
} 