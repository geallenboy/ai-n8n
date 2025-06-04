interface DeepSeekConfig {
  apiKey: string;
  model: string;
}

interface TranslationRequest {
  text: string;
  fromLang: 'zh' | 'en';
  toLang: 'zh' | 'en';
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class DeepSeekAPI {
  private config: DeepSeekConfig;

  constructor(config: DeepSeekConfig) {
    this.config = config;
  }

  private async makeRequest(messages: Array<{ role: string; content: string }>): Promise<string> {
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          temperature: 0.3,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
      }

      const data: DeepSeekResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('DeepSeek API request failed:', error);
      throw error;
    }
  }

  async translate({ text, fromLang, toLang }: TranslationRequest): Promise<string> {
    const langMap = {
      zh: '中文',
      en: '英文'
    };

    const messages = [
      {
        role: 'system',
        content: `你是一个专业的翻译助手。请将用户提供的${langMap[fromLang]}文本准确翻译成${langMap[toLang]}。保持原文的语气、风格和专业术语的准确性。对于技术文档、教程内容、博客文章等，请确保术语翻译的一致性和准确性。只返回翻译结果，不要添加任何解释或说明。`
      },
      {
        role: 'user',
        content: `请将以下文本从${langMap[fromLang]}翻译成${langMap[toLang]}：\n\n${text}`
      }
    ];

    return await this.makeRequest(messages);
  }

  // 批量翻译多个字段
  async translateFields(fields: Record<string, string>, fromLang: 'zh' | 'en' = 'zh', toLang: 'zh' | 'en' = 'en'): Promise<Record<string, string>> {
    const results: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(fields)) {
      if (value && value.trim()) {
        try {
          results[key] = await this.translate({ text: value, fromLang, toLang });
        } catch (error) {
          console.error(`Translation failed for field ${key}:`, error);
          results[key] = value; // 翻译失败时使用原文
        }
      } else {
        results[key] = value;
      }
    }
    
    return results;
  }
}

// 获取配置的辅助函数
export function getDeepSeekConfig(): DeepSeekConfig {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not configured');
  }

  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

  return { apiKey, model };
}

// 导出API实例
export function createDeepSeekAPI(model?: string): DeepSeekAPI {
  const config = getDeepSeekConfig();
  if (model) {
    config.model = model;
  }
  return new DeepSeekAPI(config);
}

// 通用翻译函数，用于在其他模块中调用
export async function translateToEnglish(text: string): Promise<string> {
  try {
    const deepSeek = createDeepSeekAPI();
    return await deepSeek.translate({ text, fromLang: 'zh', toLang: 'en' });
  } catch (error) {
    console.error('Translation to English failed:', error);
    return text; // 翻译失败时返回原文
  }
}

// 批量翻译函数
export async function translateFieldsToEnglish(fields: Record<string, string>): Promise<Record<string, string>> {
  try {
    const deepSeek = createDeepSeekAPI();
    return await deepSeek.translateFields(fields, 'zh', 'en');
  } catch (error) {
    console.error('Batch translation to English failed:', error);
    return fields; // 翻译失败时返回原始字段
  }
} 