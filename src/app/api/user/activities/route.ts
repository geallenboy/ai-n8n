import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/drizzle';
import { 
  likes, 
  favorites, 
  shareRecords, 
  viewRecords,
  tutorialSections,
  useCases,
  blogs
} from '@/drizzle/schemas';
import { eq, desc, sql } from 'drizzle-orm';

// 移除Edge Runtime配置，因为与PostgreSQL驱动不兼容
// export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: '需要登录' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'all';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let activities: any[] = [];

    if (type === 'all' || type === 'likes') {
      // 获取点赞记录
      const userLikes = await db.select({
        id: likes.resourceId,
        type: likes.resourceType,
        action: sql<string>`'like'`,
        createdAt: likes.createdAt,
      })
      .from(likes)
      .where(eq(likes.userId, user.id))
      .orderBy(desc(likes.createdAt))
      .limit(limit)
      .offset(offset);

      activities.push(...userLikes.map(item => ({
        ...item,
        action: 'like'
      })));
    }

    if (type === 'all' || type === 'favorites') {
      // 获取收藏记录
      const userFavorites = await db.select({
        id: favorites.resourceId,
        type: favorites.resourceType,
        action: sql<string>`'favorite'`,
        createdAt: favorites.createdAt,
      })
      .from(favorites)
      .where(eq(favorites.userId, user.id))
      .orderBy(desc(favorites.createdAt))
      .limit(limit)
      .offset(offset);

      activities.push(...userFavorites.map(item => ({
        ...item,
        action: 'favorite'
      })));
    }

    if (type === 'all' || type === 'shares') {
      // 获取分享记录
      const userShares = await db.select({
        id: shareRecords.resourceId,
        type: shareRecords.resourceType,
        action: sql<string>`'share'`,
        platform: shareRecords.platform,
        createdAt: shareRecords.createdAt,
      })
      .from(shareRecords)
      .where(eq(shareRecords.userId, user.id))
      .orderBy(desc(shareRecords.createdAt))
      .limit(limit)
      .offset(offset);

      activities.push(...userShares.map(item => ({
        ...item,
        action: 'share'
      })));
    }

    // 按时间排序
    activities.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    // 获取资源详情
    const enrichedActivities = await Promise.all(
      activities.slice(0, limit).map(async (activity) => {
        let resourceDetails = null;
        
        try {
          if (activity.type === 'tutorial') {
            const tutorial = await db.select({
              id: tutorialSections.id,
              title: tutorialSections.title,
              titleZh: tutorialSections.titleZh,
            })
            .from(tutorialSections)
            .where(eq(tutorialSections.id, activity.id))
            .limit(1);
            
            resourceDetails = tutorial[0] || null;
          } else if (activity.type === 'use_case') {
            const useCase = await db.select({
              id: useCases.id,
              title: useCases.title,
              titleZh: useCases.titleZh,
            })
            .from(useCases)
            .where(eq(useCases.id, activity.id))
            .limit(1);
            
            resourceDetails = useCase[0] || null;
          } else if (activity.type === 'blog') {
            const blog = await db.select({
              id: blogs.id,
              title: blogs.title,
              titleZh: blogs.titleZh,
            })
            .from(blogs)
            .where(eq(blogs.id, activity.id))
            .limit(1);
            
            resourceDetails = blog[0] || null;
          }
        } catch (error) {
          console.error('获取资源详情失败:', error);
        }

        return {
          ...activity,
          resource: resourceDetails,
        };
      })
    );

    return NextResponse.json({
      activities: enrichedActivities,
      pagination: {
        page,
        limit,
        hasMore: activities.length > limit,
      },
    });

  } catch (error) {
    console.error('获取用户活动失败:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
} 