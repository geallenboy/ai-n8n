import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/drizzle';
import { contactMessages } from '@/drizzle/schemas';
import { eq, desc } from 'drizzle-orm';
import { Resend } from 'resend';

// 安全初始化 Resend 客户端
let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    const body = await request.json();
    const { name, email, subject, message, company, phone } = body;

    // 基本验证
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: '所有字段都是必填的' },
        { status: 400 }
      );
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '邮箱格式不正确' },
        { status: 400 }
      );
    }

    // 获取客户端信息
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // 保存到数据库
    const [newMessage] = await db.insert(contactMessages).values({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      userId: user?.id || null,
      ipAddress,
      userAgent,
    }).returning();

    // 发送邮件（如果配置了 RESEND_API_KEY）
    if (process.env.RESEND_API_KEY && resend) {
      try {
        // 发送给管理员的邮件
        const adminEmailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
              新的联系消息 - ${subject}
            </h2>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">联系人信息</h3>
              <p><strong>姓名:</strong> ${name}</p>
              <p><strong>邮箱:</strong> ${email}</p>
              ${company ? `<p><strong>公司/组织:</strong> ${company}</p>` : ''}
              ${phone ? `<p><strong>电话:</strong> ${phone}</p>` : ''}
              <p><strong>主题:</strong> ${subject}</p>
            </div>

            <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">消息内容</h3>
              <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>

            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #6b7280;">技术信息</h4>
              <p style="font-size: 12px; color: #6b7280;">
                <strong>消息ID:</strong> ${newMessage.id}<br>
                <strong>IP地址:</strong> ${ipAddress}<br>
                <strong>提交时间:</strong> ${new Date().toLocaleString('zh-CN')}<br>
                ${user ? `<strong>用户ID:</strong> ${user.id}` : '<strong>状态:</strong> 匿名用户'}
              </p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #6b7280; font-size: 12px;">
                此邮件由 AI n8n 平台自动发送 | 
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ai-n8n.com'}" style="color: #2563eb;">访问平台</a>
              </p>
            </div>
          </div>
        `;

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'contact@ai-n8n.com',
          to: [process.env.RESEND_TO_EMAIL || 'admin@ai-n8n.com'],
          subject: `[AI n8n] 新联系消息: ${subject}`,
          html: adminEmailContent,
        });

        // 发送给用户的确认邮件
        const userEmailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin-bottom: 10px;">AI n8n</h1>
              <p style="color: #6b7280;">自动化工作流解决方案</p>
            </div>

            <h2 style="color: #374151;">感谢您的联系！</h2>
            
            <p style="line-height: 1.6; color: #374151;">
              亲爱的 ${name}，
            </p>
            
            <p style="line-height: 1.6; color: #374151;">
              我们已经收到您的消息，感谢您对 AI n8n 平台的关注和支持。我们的团队会仔细查看您的咨询，并在24小时内给您回复。
            </p>

            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">您的消息详情</h3>
              <p><strong>主题:</strong> ${subject}</p>
              <p><strong>提交时间:</strong> ${new Date().toLocaleString('zh-CN')}</p>
              <p><strong>消息ID:</strong> ${newMessage.id}</p>
            </div>

            <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1e40af;">在等待回复期间</h3>
              <p style="margin-bottom: 10px; color: #374151;">您可以：</p>
              <ul style="color: #374151; line-height: 1.6;">
                <li>浏览我们的 <a href="${process.env.NEXT_PUBLIC_APP_URL}/front/tutorials" style="color: #2563eb;">教程中心</a> 学习 n8n 自动化技能</li>
                <li>查看 <a href="${process.env.NEXT_PUBLIC_APP_URL}/front/use-cases" style="color: #2563eb;">案例库</a> 获取实用的自动化方案</li>
                <li>阅读我们的 <a href="${process.env.NEXT_PUBLIC_APP_URL}/front/blogs" style="color: #2563eb;">技术博客</a> 了解最新趋势</li>
              </ul>
            </div>

            <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #166534;">
                <strong>💡 小贴士:</strong> 如果您有紧急技术问题，可以访问我们的 
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/front/about" style="color: #15803d;">帮助中心</a> 
                查看常见问题解答。
              </p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #6b7280; font-size: 14px;">
                祝您工作愉快！<br>
                AI n8n 团队
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
                如需帮助，请访问 <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #2563eb;">ai-n8n.com</a> 
                或回复此邮件
              </p>
            </div>
          </div>
        `;

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@ai-n8n.com',
          to: [email],
          subject: '感谢您联系 AI n8n - 我们已收到您的消息',
          html: userEmailContent,
        });

        console.log('邮件发送成功');
      } catch (emailError) {
        console.error('邮件发送失败:', emailError);
        // 即使邮件发送失败，也不影响主要流程，只记录错误
      }
    } else {
      console.warn('RESEND_API_KEY 未配置，跳过邮件发送');
    }

    return NextResponse.json({
      success: true,
      message: '消息发送成功，我们会尽快回复您！',
      id: newMessage.id,
    });

  } catch (error) {
    console.error('发送联系消息失败:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    
    // 只有管理员可以查看所有消息
    if (!user) {
      return NextResponse.json(
        { error: '需要登录' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const status = url.searchParams.get('status');

    const offset = (page - 1) * limit;

    // 如果指定了状态，添加筛选条件
    let messages;
    if (status && ['pending', 'read', 'replied', 'closed'].includes(status)) {
      messages = await db.select().from(contactMessages)
        .where(eq(contactMessages.status, status as any))
        .orderBy(desc(contactMessages.createdAt))
        .limit(limit)
        .offset(offset);
    } else {
      messages = await db.select().from(contactMessages)
        .orderBy(desc(contactMessages.createdAt))
        .limit(limit)
        .offset(offset);
    }

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        hasMore: messages.length === limit,
      },
    });

  } catch (error) {
    console.error('获取联系消息失败:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
} 