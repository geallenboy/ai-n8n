import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/drizzle';
import { userSubscriptions, subscriptionPlans } from '@/drizzle/schemas';
import { eq } from 'drizzle-orm';

// 移除Edge Runtime配置，因为与PostgreSQL驱动不兼容
// export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 查询用户当前订阅
    const subscription = await db
      .select({
        id: userSubscriptions.id,
        planId: userSubscriptions.planId,
        status: userSubscriptions.status,
        currentPeriodStart: userSubscriptions.currentPeriodStart,
        currentPeriodEnd: userSubscriptions.currentPeriodEnd,
        cancelAtPeriodEnd: userSubscriptions.cancelAtPeriodEnd,
        planName: subscriptionPlans.name,
        planNameZh: subscriptionPlans.nameZh,
        maxUseCases: subscriptionPlans.maxUseCases,
        maxTutorials: subscriptionPlans.maxTutorials,
        maxBlogs: subscriptionPlans.maxBlogs,
      })
      .from(userSubscriptions)
      .leftJoin(subscriptionPlans, eq(userSubscriptions.planId, subscriptionPlans.id))
      .where(eq(userSubscriptions.userId, userId))
      .orderBy(userSubscriptions.createdAt)
      .limit(1);

    if (subscription.length === 0) {
      // 用户没有订阅，返回免费版信息
      return NextResponse.json({
        subscription: null,
        plan: {
          name: 'Free',
          nameZh: '免费版',
          maxUseCases: 10,
          maxTutorials: 5,
          maxBlogs: 3,
        }
      });
    }

    return NextResponse.json({
      subscription: subscription[0]
    });

  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 