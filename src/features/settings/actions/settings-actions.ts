'use server';

import { db } from '@/drizzle';
import { systemSettings } from '@/drizzle/schemas';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export interface SystemSetting {
  key: string;
  value: any;
  description?: string;
  category?: string;
  isPublic?: boolean;
}

export interface SettingsData {
  // 网站基本设置
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;
  
  // 功能设置
  enableRegistration: boolean;
  enableComments: boolean;
  enableNotifications: boolean;
  enableAnalytics: boolean;
  
  // AI设置
  openrouterApiKey: string;
  openrouterModel: string;
  enableAIFeatures: boolean;
  
  // 显示设置
  itemsPerPage: string;
  defaultLanguage: string;
  timezone: string;
}

// 获取所有系统设置
export async function getSystemSettings(): Promise<{ success: boolean; data?: SettingsData; error?: string }> {
  try {
    const settings = await db.select().from(systemSettings);
    
    // 将设置转换为对象格式
    const settingsData: any = {};
    settings.forEach((setting: any) => {
      settingsData[setting.key] = setting.value;
    });

    // 设置默认值
    const defaultSettings: SettingsData = {
      siteName: 'n8n 教程平台',
      siteDescription: '专业的 n8n 自动化教程平台',
      siteUrl: 'https://your-domain.com',
      adminEmail: 'admin@example.com',
      enableRegistration: true,
      enableComments: true,
      enableNotifications: true,
      enableAnalytics: false,
      openrouterApiKey: '',
      openrouterModel: 'anthropic/claude-3.5-sonnet',
      enableAIFeatures: true,
      itemsPerPage: '10',
      defaultLanguage: 'zh-CN',
      timezone: 'Asia/Shanghai',
    };

    // 合并默认值和数据库中的值
    const finalSettings = { ...defaultSettings, ...settingsData };

    return { success: true, data: finalSettings };
  } catch (error) {
    console.error('Error fetching system settings:', error);
    return { success: false, error: '获取系统设置失败' };
  }
}

// 保存系统设置
export async function saveSystemSettings(settingsData: SettingsData): Promise<{ success: boolean; error?: string }> {
  try {
    // 定义设置的分类和描述
    const settingsMeta: Record<string, { category: string; description: string; isPublic?: boolean }> = {
      siteName: { category: 'general', description: '网站名称', isPublic: true },
      siteDescription: { category: 'general', description: '网站描述', isPublic: true },
      siteUrl: { category: 'general', description: '网站URL', isPublic: true },
      adminEmail: { category: 'general', description: '管理员邮箱' },
      enableRegistration: { category: 'features', description: '启用用户注册', isPublic: true },
      enableComments: { category: 'features', description: '启用评论功能', isPublic: true },
      enableNotifications: { category: 'features', description: '启用通知功能' },
      enableAnalytics: { category: 'features', description: '启用数据分析' },
      openrouterApiKey: { category: 'ai', description: 'OpenRouter API密钥' },
      openrouterModel: { category: 'ai', description: 'AI模型选择' },
      enableAIFeatures: { category: 'ai', description: '启用AI功能', isPublic: true },
      itemsPerPage: { category: 'display', description: '每页显示条数', isPublic: true },
      defaultLanguage: { category: 'display', description: '默认语言', isPublic: true },
      timezone: { category: 'display', description: '时区设置', isPublic: true },
    };

    // 逐个保存或更新设置
    for (const [key, value] of Object.entries(settingsData)) {
      const meta = settingsMeta[key];
      if (!meta) continue;

      // 检查设置是否已存在
      const existingSetting = await db.select()
        .from(systemSettings)
        .where(eq(systemSettings.key, key))
        .limit(1);

      if (existingSetting.length > 0) {
        // 更新现有设置
        await db.update(systemSettings)
          .set({
            value: value,
            description: meta.description,
            category: meta.category,
            isPublic: meta.isPublic || false,
            updatedAt: new Date(),
          })
          .where(eq(systemSettings.key, key));
      } else {
        // 创建新设置
        await db.insert(systemSettings).values({
          key,
          value,
          description: meta.description,
          category: meta.category,
          isPublic: meta.isPublic || false,
        });
      }
    }

    revalidatePath('/backend/settings');
    return { success: true };
  } catch (error) {
    console.error('Error saving system settings:', error);
    return { success: false, error: '保存系统设置失败' };
  }
}

// 获取公开设置（前端可访问）
export async function getPublicSettings(): Promise<{ success: boolean; data?: Record<string, any>; error?: string }> {
  try {
    const settings = await db.select()
      .from(systemSettings)
      .where(eq(systemSettings.isPublic, true));
    
    const publicSettings: Record<string, any> = {};
    settings.forEach((setting: any) => {
      publicSettings[setting.key] = setting.value;
    });

    return { success: true, data: publicSettings };
  } catch (error) {
    console.error('Error fetching public settings:', error);
    return { success: false, error: '获取公开设置失败' };
  }
}

// 重置系统设置
export async function resetSystemSettings(): Promise<{ success: boolean; error?: string }> {
  try {
    // 删除所有现有设置
    await db.delete(systemSettings);

    // 重新创建默认设置
    const defaultSettings: SettingsData = {
      siteName: 'n8n 教程平台',
      siteDescription: '专业的 n8n 自动化教程平台',
      siteUrl: 'https://your-domain.com',
      adminEmail: 'admin@example.com',
      enableRegistration: true,
      enableComments: true,
      enableNotifications: true,
      enableAnalytics: false,
      openrouterApiKey: '',
      openrouterModel: 'anthropic/claude-3.5-sonnet',
      enableAIFeatures: true,
      itemsPerPage: '10',
      defaultLanguage: 'zh-CN',
      timezone: 'Asia/Shanghai',
    };

    await saveSystemSettings(defaultSettings);

    revalidatePath('/backend/settings');
    return { success: true };
  } catch (error) {
    console.error('Error resetting system settings:', error);
    return { success: false, error: '重置系统设置失败' };
  }
}