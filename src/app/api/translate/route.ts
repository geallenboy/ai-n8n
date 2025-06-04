import { NextRequest, NextResponse } from 'next/server';
import { createDeepSeekAPI } from '@/lib/deepseek';

// 保留Edge Runtime配置，因为翻译路由不使用数据库连接
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, targetLanguage = 'en' } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Missing required field: text' },
        { status: 400 }
      );
    }

    // 如果目标语言是英文，从中文翻译到英文
    const fromLang = 'zh';
    const toLang = targetLanguage;

    if (!['zh', 'en'].includes(fromLang) || !['zh', 'en'].includes(toLang)) {
      return NextResponse.json(
        { error: 'Invalid language codes. Use "zh" or "en"' },
        { status: 400 }
      );
    }

    try {
      const deepSeek = createDeepSeekAPI();
      const translatedText = await deepSeek.translate({ text, fromLang, toLang });

      return NextResponse.json({ 
        success: true, 
        translatedText
      });
    } catch (translationError) {
      console.error('Translation service error:', translationError);
      // 如果翻译失败，返回原文
      return NextResponse.json({
        success: true,
        translatedText: text
      });
    }
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Translation failed' },
      { status: 500 }
    );
  }
} 