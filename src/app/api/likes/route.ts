import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/drizzle';
import { likes } from '@/drizzle/schemas';
import { eq, and, sql } from 'drizzle-orm';

// 移除Edge Runtime配置，因为与PostgreSQL驱动不兼容
// export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: '需要登录才能点赞' },
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

    // 检查是否已经点赞
    const existingLike = await db.select().from(likes)
      .where(and(
        eq(likes.userId, user.id),
        eq(likes.resourceType, resourceType),
        eq(likes.resourceId, resourceId)
      ))
      .limit(1);

    if (existingLike.length > 0) {
      // 取消点赞
      await db.delete(likes)
        .where(and(
          eq(likes.userId, user.id),
          eq(likes.resourceType, resourceType),
          eq(likes.resourceId, resourceId)
        ));

      return NextResponse.json({
        success: true,
        action: 'unliked',
        message: '已取消点赞',
      });
    } else {
      // 添加点赞
      await db.insert(likes).values({
        userId: user.id,
        resourceType,
        resourceId,
      });

      return NextResponse.json({
        success: true,
        action: 'liked',
        message: '点赞成功',
      });
    }

  } catch (error: any) {
    console.error('点赞操作失败:', error);
    console.error('Error details:', {
      message: error?.message || 'Unknown error',
      stack: error?.stack || 'No stack trace',
      name: error?.name || 'Unknown error type'
    });
    return NextResponse.json(
      { error: '服务器错误，请稍后重试', details: error?.message || 'Unknown error' },
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

    // 获取点赞总数
    const likeCount = await db.select({ count: sql<number>`count(*)` })
      .from(likes)
      .where(and(
        eq(likes.resourceType, resourceType),
        eq(likes.resourceId, resourceId)
      ));

    let isLiked = false;
    
    // 如果提供了用户ID，检查用户是否已点赞
    if (userId) {
      const userLike = await db.select().from(likes)
        .where(and(
          eq(likes.userId, userId),
          eq(likes.resourceType, resourceType),
          eq(likes.resourceId, resourceId)
        ))
        .limit(1);
      
      isLiked = userLike.length > 0;
    }

    return NextResponse.json({
      count: likeCount[0]?.count || 0,
      isLiked,
    });

  } catch (error: any) {
    console.error('获取点赞信息失败:', error);
    console.error('Error details:', {
      message: error?.message || 'Unknown error',
      stack: error?.stack || 'No stack trace',
      name: error?.name || 'Unknown error type'
    });
    return NextResponse.json(
      { error: '服务器错误', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
} 