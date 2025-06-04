import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/drizzle';
import { shareRecords } from '@/drizzle/schemas';

// 移除Edge Runtime配置，因为与PostgreSQL驱动不兼容
// export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    const body = await request.json();
    const { resourceType, resourceId, platform } = body;

    // 验证参数
    if (!resourceType || !resourceId || !platform) {
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

    const supportedPlatforms = ['twitter', 'linkedin', 'facebook', 'wechat', 'weibo', 'copy_link'];
    if (!supportedPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: '不支持的分享平台' },
        { status: 400 }
      );
    }

    // 获取客户端信息
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // 记录分享行为
    await db.insert(shareRecords).values({
      userId: user?.id || null,
      resourceType,
      resourceId,
      platform,
      ipAddress,
    });

    return NextResponse.json({
      success: true,
      message: '分享记录已保存',
    });

  } catch (error) {
    console.error('记录分享失败:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
} 