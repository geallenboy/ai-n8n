import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  jsonb,
  integer,
} from 'drizzle-orm/pg-core';


export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  fullName: varchar('full_name', { length: 255 }),
  avatar: varchar('avatar', { length: 500 }),
  bio: text('bio'),
  skillLevel: varchar('skill_level', { length: 50 }).$type<'beginner' | 'intermediate' | 'advanced'>().default('beginner'),
  preferences: jsonb('preferences').$type<{
    language: string;
    theme: string;
    notifications: {
      email: boolean;
      push: boolean;
      comments: boolean;
      newTutorials: boolean;
    };
    learningGoals: string[];
  }>(),
  totalLearningTime: integer('total_learning_time').default(0), // 改为整数类型，单位可以是秒或分钟
  isActive: boolean('is_active').default(true),
  isAdmin: boolean('is_admin').default(false), // 管理员标识
  provider: varchar('provider', { length: 50 }).default('email'), // 登录方式：email, google, github等
  providerId: varchar('provider_id', { length: 255 }), // 第三方登录ID
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User =  typeof users.$inferSelect;

