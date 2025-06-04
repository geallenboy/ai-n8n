import {
  pgTable,
  uuid,
  text,
  timestamp,
  primaryKey,
} from 'drizzle-orm/pg-core';

// 点赞表 - 用户对教程、案例、博客的点赞
export const likes = pgTable('likes', {
  userId: text('user_id').notNull(), // Clerk 用户 ID
  resourceType: text('resource_type').notNull(), // 'tutorial' | 'use_case' | 'blog'
  resourceId: uuid('resource_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  // 确保用户不能重复点赞同一个资源
  pk: primaryKey({ columns: [table.userId, table.resourceType, table.resourceId] }),
}));

export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert; 