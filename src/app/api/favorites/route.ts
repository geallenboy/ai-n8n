import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/drizzle';
import { favorites } from '@/drizzle/schemas';
import { eq, and, sql } from 'drizzle-orm';

// 移除Edge Runtime配置，因为与PostgreSQL驱动不兼容
// export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: '需要登录才能收藏' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { resourceType, resourceId } = body;

    // 验证参数
    if (!resourceType || !resourceId) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    if (!['tutorial', 'use_case', 'blog'].includes(resourceType)) {
      return NextResponse.json(
        { error: '不支持的资源类型' },
        { status: 400 }
      );
    }

    // 检查是否已经收藏
    const existingFavorite = await db.select().from(favorites)
      .where(and(
        eq(favorites.userId, user.id),
        eq(favorites.resourceType, resourceType),
        eq(favorites.resourceId, resourceId)
      ))
      .limit(1);

    if (existingFavorite.length > 0) {
      // 取消收藏
      await db.delete(favorites)
        .where(and(
          eq(favorites.userId, user.id),
          eq(favorites.resourceType, resourceType),
          eq(favorites.resourceId, resourceId)
        ));

      return NextResponse.json({
        success: true,
        action: 'unfavorited',
        message: '已取消收藏',
      });
    } else {
      // 添加收藏
      await db.insert(favorites).values({
        userId: user.id,
        resourceType,
        resourceId,
      });

      return NextResponse.json({
        success: true,
        action: 'favorited',
        message: '收藏成功',
      });
    }

  } catch (error) {
    console.error('收藏操作失败:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const resourceType = url.searchParams.get('resourceType');
    const resourceId = url.searchParams.get('resourceId');
    const userId = url.searchParams.get('userId');

    if (!resourceType || !resourceId) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 获取收藏总数
    const favoriteCount = await db.select({ count: sql<number>`count(*)` })
      .from(favorites)
      .where(and(
        eq(favorites.resourceType, resourceType),
        eq(favorites.resourceId, resourceId)
      ));

    let isFavorited = false;
    
    // 如果提供了用户ID，检查用户是否已收藏
    if (userId) {
      const userFavorite = await db.select().from(favorites)
        .where(and(
          eq(favorites.userId, userId),
          eq(favorites.resourceType, resourceType),
          eq(favorites.resourceId, resourceId)
        ))
        .limit(1);
      
      isFavorited = userFavorite.length > 0;
    }

    return NextResponse.json({
      count: favoriteCount[0]?.count || 0,
      isFavorited,
    });

  } catch (error) {
    console.error('获取收藏信息失败:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
} 