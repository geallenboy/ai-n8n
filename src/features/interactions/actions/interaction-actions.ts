"use server";

import { db } from '@/drizzle';
import { viewRecords, favorites, downloadRecords, shareRecords } from '@/drizzle/schemas/interactions';
import { eq, and, count, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

// 获取客户端 IP 和 User Agent
async function getClientInfo() {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
  const userAgent = headersList.get('user-agent') || 'unknown';
  return { ip, userAgent };
}

// 记录查看次数
export async function recordView(resourceType: 'use_case' | 'blog', resourceId: string, userId?: string) {
  try {
    const { ip, userAgent } = await getClientInfo();
    
    await db.insert(viewRecords).values({
      userId: userId || null,
      resourceType,
      resourceId,
      ipAddress: ip,
      userAgent,
    });

    return { success: true };
  } catch (error) {
    console.error('Error recording view:', error);
    return { success: false, error: 'Failed to record view' };
  }
}

// 获取查看次数
export async function getViewCount(resourceType: 'use_case' | 'blog', resourceId: string) {
  try {
    const result = await db
      .select({ count: count() })
      .from(viewRecords)
      .where(and(
        eq(viewRecords.resourceType, resourceType),
        eq(viewRecords.resourceId, resourceId)
      ));

    return { success: true, count: result[0]?.count || 0 };
  } catch (error) {
    console.error('Error getting view count:', error);
    return { success: false, error: 'Failed to get view count', count: 0 };
  }
}

// 切换收藏状态
export async function toggleFavorite(resourceType: 'use_case' | 'blog', resourceId: string, userId: string) {
  try {
    // 检查是否已收藏
    const existing = await db
      .select()
      .from(favorites)
      .where(and(
        eq(favorites.userId, userId),
        eq(favorites.resourceType, resourceType),
        eq(favorites.resourceId, resourceId)
      ))
      .limit(1);

    if (existing.length > 0) {
      // 取消收藏
      await db
        .delete(favorites)
        .where(and(
          eq(favorites.userId, userId),
          eq(favorites.resourceType, resourceType),
          eq(favorites.resourceId, resourceId)
        ));
      
      revalidatePath('/front/dashboard');
      return { success: true, isFavorited: false };
    } else {
      // 添加收藏
      await db.insert(favorites).values({
        userId,
        resourceType,
        resourceId,
      });
      
      revalidatePath('/front/dashboard');
      return { success: true, isFavorited: true };
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return { success: false, error: 'Failed to toggle favorite' };
  }
}

// 检查是否已收藏
export async function checkIsFavorited(resourceType: 'use_case' | 'blog', resourceId: string, userId?: string) {
  if (!userId) return { success: true, isFavorited: false };

  try {
    const result = await db
      .select()
      .from(favorites)
      .where(and(
        eq(favorites.userId, userId),
        eq(favorites.resourceType, resourceType),
        eq(favorites.resourceId, resourceId)
      ))
      .limit(1);

    return { success: true, isFavorited: result.length > 0 };
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return { success: false, error: 'Failed to check favorite status', isFavorited: false };
  }
}

// 获取收藏数量
export async function getFavoriteCount(resourceType: 'use_case' | 'blog', resourceId: string) {
  try {
    const result = await db
      .select({ count: count() })
      .from(favorites)
      .where(and(
        eq(favorites.resourceType, resourceType),
        eq(favorites.resourceId, resourceId)
      ));

    return { success: true, count: result[0]?.count || 0 };
  } catch (error) {
    console.error('Error getting favorite count:', error);
    return { success: false, error: 'Failed to get favorite count', count: 0 };
  }
}

// 记录下载
export async function recordDownload(useCaseId: string, downloadType: 'json' | 'workflow', userId?: string) {
  try {
    const { ip, userAgent } = await getClientInfo();
    
    await db.insert(downloadRecords).values({
      userId: userId || null,
      useCaseId,
      downloadType,
      ipAddress: ip,
      userAgent,
    });

    return { success: true };
  } catch (error) {
    console.error('Error recording download:', error);
    return { success: false, error: 'Failed to record download' };
  }
}

// 获取下载次数
export async function getDownloadCount(useCaseId: string) {
  try {
    const result = await db
      .select({ count: count() })
      .from(downloadRecords)
      .where(eq(downloadRecords.useCaseId, useCaseId));

    return { success: true, count: result[0]?.count || 0 };
  } catch (error) {
    console.error('Error getting download count:', error);
    return { success: false, error: 'Failed to get download count', count: 0 };
  }
}

// 记录分享
export async function recordShare(
  resourceType: 'use_case' | 'blog', 
  resourceId: string, 
  platform: 'twitter' | 'linkedin' | 'facebook' | 'wechat' | 'weibo' | 'copy_link',
  userId?: string
) {
  try {
    const { ip } = await getClientInfo();
    
    await db.insert(shareRecords).values({
      userId: userId || null,
      resourceType,
      resourceId,
      platform,
      ipAddress: ip,
    });

    return { success: true };
  } catch (error) {
    console.error('Error recording share:', error);
    return { success: false, error: 'Failed to record share' };
  }
}

// 获取用户收藏列表
export async function getUserFavorites(userId: string, resourceType?: 'use_case' | 'blog') {
  try {
    const whereConditions = resourceType 
      ? and(
          eq(favorites.userId, userId),
          eq(favorites.resourceType, resourceType)
        )
      : eq(favorites.userId, userId);

    const result = await db
      .select({
        resourceType: favorites.resourceType,
        resourceId: favorites.resourceId,
        createdAt: favorites.createdAt,
      })
      .from(favorites)
      .where(whereConditions)
      .orderBy(sql`${favorites.createdAt} DESC`);

    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting user favorites:', error);
    return { success: false, error: 'Failed to get user favorites', data: [] };
  }
}

// 获取资源统计信息
export async function getResourceStats(resourceType: 'use_case' | 'blog', resourceId: string) {
  try {
    const [viewCount, favoriteCount] = await Promise.all([
      getViewCount(resourceType, resourceId),
      getFavoriteCount(resourceType, resourceId),
    ]);

    let downloadCount = { success: true, count: 0 };
    if (resourceType === 'use_case') {
      downloadCount = await getDownloadCount(resourceId);
    }

    return {
      success: true,
      stats: {
        views: viewCount.count,
        favorites: favoriteCount.count,
        downloads: downloadCount.count,
      }
    };
  } catch (error) {
    console.error('Error getting resource stats:', error);
    return {
      success: false,
      error: 'Failed to get resource stats',
      stats: { views: 0, favorites: 0, downloads: 0 }
    };
  }
} 