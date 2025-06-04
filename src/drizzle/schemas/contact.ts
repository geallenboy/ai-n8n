import {
  pgTable,
  uuid,
  text,
  timestamp,
  varchar,
  boolean,
  integer,
} from 'drizzle-orm/pg-core';

// 联系我们消息表
export const contactMessages = pgTable('contact_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 200 }).notNull(),
  message: text('message').notNull(),
  status: varchar('status', { length: 20 }).default('pending').$type<'pending' | 'read' | 'replied' | 'closed'>(),
  userId: text('user_id'), // 如果是登录用户发送的
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  isSpam: boolean('is_spam').default(false),
  replyCount: integer('reply_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert; 