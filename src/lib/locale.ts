'use server';

import { cookies } from 'next/headers';
import { Locale, defaultLocale } from '@/translate/i18n/config';

// 使用cookie作为服务端存储，客户端将使用localStorage
const COOKIE_NAME = 'NEXT_LOCALE';

export async function getUserLocale(): Promise<Locale> {
  return (await cookies()).get(COOKIE_NAME)?.value as Locale || defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(COOKIE_NAME, locale);
}
