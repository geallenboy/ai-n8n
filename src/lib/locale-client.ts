'use client';

import { Locale, defaultLocale } from '@/translate/i18n/config';

const LOCALE_KEY = 'NEXT_LOCALE';

export function getClientLocale(): Locale {
  if (typeof window === 'undefined') {
    return defaultLocale;
  }
  
  try {
    const stored = localStorage.getItem(LOCALE_KEY);
    return (stored as Locale) || defaultLocale;
  } catch {
    return defaultLocale;
  }
}

export function setClientLocale(locale: Locale): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(LOCALE_KEY, locale);
    // 同时更新cookie以保持服务端同步
    document.cookie = `${LOCALE_KEY}=${locale}; path=/; max-age=${60 * 60 * 24 * 7}`;
    
    // 使用router.push刷新页面，而不是强制刷新
    // 在支持的环境中使用router.push，否则回退到window.location.reload
    if (typeof window !== 'undefined') {
      // 触发自定义事件，让组件监听并更新
      window.dispatchEvent(new CustomEvent('localeChange', { detail: locale }));
      
      // 延迟刷新以确保事件被处理
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  } catch (error) {
    console.error('Failed to set locale:', error);
  }
} 