import { NextRequest, NextResponse } from 'next/server';
import { createOpenRouterAPI } from '@/lib/openrouter';

// 保留Edge Runtime配置，因为AI路由不使用数据库连接
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, fromLang, toLang, model } = body;

    if (!text || !fromLang || !toLang) {
      return NextResponse.json(
        { error: 'Missing required fields: text, fromLang, toLang' },
        { status: 400 }
      );
    }

    if (!['zh', 'en'].includes(fromLang) || !['zh', 'en'].includes(toLang)) {
      return NextResponse.json(
        { error: 'Invalid language codes. Use "zh" or "en"' },
        { status: 400 }
      );
    }

    const openRouter = createOpenRouterAPI(model);
    const translatedText = await openRouter.translate({ text, fromLang, toLang });

    return NextResponse.json({ 
      success: true, 
      data: { translatedText }
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Translation failed' },
      { status: 500 }
    );
  }
} 