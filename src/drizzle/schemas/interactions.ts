import { pgTable, text, timestamp, uuid, integer, boolean, primaryKey } from 'drizzle-orm/pg-core';
import { useCases } from './useCases';


// 查看记录表 - 记录用户查看案例/博客的次数
export const viewRecords = pgTable('view_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id'), // 改为 text 类型以支持 Clerk 用户 ID
  resourceType: text('resource_type').notNull(), // 'use_case' | 'article'
  resourceId: uuid('resource_id').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// 收藏表 - 用户收藏的案例/博客
export const favorites = pgTable('favorites', {
  userId: text('user_id').notNull(), // 改为 text 类型以支持 Clerk 用户 ID
  resourceType: text('resource_type').notNull(), // 'use_case' | 'article'
  resourceId: uuid('resource_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  // 确保用户不能重复收藏同一个资源
  pk: primaryKey({ columns: [table.userId, table.resourceType, table.resourceId] }),
}));

// 下载记录表 - 记录工作流下载
export const downloadRecords = pgTable('download_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id'), // 改为 text 类型以支持 Clerk 用户 ID
  useCaseId: uuid('use_case_id').notNull().references(() => useCases.id, { onDelete: 'cascade' }),
  downloadType: text('download_type').notNull(), // 'json' | 'workflow'
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// 分享记录表 - 记录分享到社交媒体
export const shareRecords = pgTable('share_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id'), // 改为 text 类型以支持 Clerk 用户 ID
  resourceType: text('resource_type').notNull(), // 'use_case' | 'article'
  resourceId: uuid('resource_id').notNull(),
  platform: text('platform').notNull(), // 'twitter' | 'linkedin' | 'facebook' | 'wechat' | 'weibo' | 'copy_link'
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// 系统操作记录表 - 记录管理员操作
export const systemLogs = pgTable('system_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id'), // 改为 text 类型以支持 Clerk 用户 ID
  action: text('action').notNull(), // 操作类型
  resourceType: text('resource_type'), // 操作的资源类型
  resourceId: uuid('resource_id'), // 操作的资源ID
  details: text('details'), // 操作详情
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// 系统设置表
export const systemSettings = pgTable('system_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').notNull().unique(),
  value: text('value'),
  description: text('description'),
  category: text('category').notNull(), // 'general' | 'email' | 'social' | 'seo' | 'analytics'
  isPublic: boolean('is_public').default(false), // 是否可以在前台访问
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}); 