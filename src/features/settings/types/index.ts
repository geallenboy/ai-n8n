/**
 * 设置功能模块的TypeScript类型定义
 */

/** 系统设置接口 */
export interface SystemSettings {
  id: string;
  siteName: string;
  siteDescription?: string | null;
  siteUrl?: string | null;
  siteLogo?: string | null;
  siteFavicon?: string | null;
  contactEmail?: string | null;
  supportEmail?: string | null;
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    discord?: string;
  } | null;
  seoSettings?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    ogImage?: string;
  } | null;
  emailSettings?: {
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPassword?: string;
    fromEmail?: string;
    fromName?: string;
  } | null;
  analyticsSettings?: {
    googleAnalyticsId?: string;
    googleTagManagerId?: string;
    hotjarId?: string;
  } | null;
  maintenanceMode?: boolean;
  registrationEnabled?: boolean;
  emailVerificationRequired?: boolean;
  maxFileUploadSize?: number;
  allowedFileTypes?: string[];
  createdAt: Date | null;
  updatedAt: Date | null;
}

/** 用户设置接口 */
export interface UserSettings {
  id: string;
  userId: string;
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
  dateFormat?: string;
  timeFormat?: '12h' | '24h';
  notifications?: {
    email?: {
      newsletter?: boolean;
      updates?: boolean;
      security?: boolean;
      marketing?: boolean;
    };
    push?: {
      enabled?: boolean;
      updates?: boolean;
      mentions?: boolean;
    };
    inApp?: {
      enabled?: boolean;
      sound?: boolean;
    };
  } | null;
  privacy?: {
    profileVisibility?: 'public' | 'private' | 'friends';
    showEmail?: boolean;
    showActivity?: boolean;
    allowMessages?: boolean;
  } | null;
  preferences?: {
    autoSave?: boolean;
    compactMode?: boolean;
    showTutorials?: boolean;
    defaultView?: string;
  } | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

/** 系统设置更新数据接口 */
export interface UpdateSystemSettingsData {
  siteName?: string;
  siteDescription?: string;
  siteUrl?: string;
  siteLogo?: string;
  siteFavicon?: string;
  contactEmail?: string;
  supportEmail?: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    discord?: string;
  };
  seoSettings?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    ogImage?: string;
  };
  emailSettings?: {
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPassword?: string;
    fromEmail?: string;
    fromName?: string;
  };
  analyticsSettings?: {
    googleAnalyticsId?: string;
    googleTagManagerId?: string;
    hotjarId?: string;
  };
  maintenanceMode?: boolean;
  registrationEnabled?: boolean;
  emailVerificationRequired?: boolean;
  maxFileUploadSize?: number;
  allowedFileTypes?: string[];
}

/** 用户设置更新数据接口 */
export interface UpdateUserSettingsData {
  userId: string;
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
  dateFormat?: string;
  timeFormat?: '12h' | '24h';
  notifications?: {
    email?: {
      newsletter?: boolean;
      updates?: boolean;
      security?: boolean;
      marketing?: boolean;
    };
    push?: {
      enabled?: boolean;
      updates?: boolean;
      mentions?: boolean;
    };
    inApp?: {
      enabled?: boolean;
      sound?: boolean;
    };
  };
  privacy?: {
    profileVisibility?: 'public' | 'private' | 'friends';
    showEmail?: boolean;
    showActivity?: boolean;
    allowMessages?: boolean;
  };
  preferences?: {
    autoSave?: boolean;
    compactMode?: boolean;
    showTutorials?: boolean;
    defaultView?: string;
  };
}

/** 设置分类接口 */
export interface SettingsCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  order: number;
  settings: SettingsField[];
}

/** 设置字段接口 */
export interface SettingsField {
  id: string;
  key: string;
  name: string;
  description?: string;
  type: 'text' | 'email' | 'number' | 'boolean' | 'select' | 'textarea' | 'file' | 'json';
  value?: any;
  defaultValue?: any;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: Array<{ label: string; value: any }>;
  };
  category: string;
  order: number;
}

/** Server Action 响应接口 */
export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 