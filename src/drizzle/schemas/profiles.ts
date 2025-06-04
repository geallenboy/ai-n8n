import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // 关联到 auth.users(id)
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}); 