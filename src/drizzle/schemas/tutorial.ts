import { pgTable, text, timestamp, uuid, integer, boolean, unique, jsonb } from 'drizzle-orm/pg-core';

// 教程版块表 (基础、进阶、高级)
export const tutorialSections = pgTable('tutorial_sections', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(), // 英文标题
  titleZh: text('title_zh'), // 中文标题
  description: text('description'), // 英文描述
  descriptionZh: text('description_zh'), // 中文描述
  icon: text('icon').default('BookOpen'), // 图标名称
  color: text('color').default('blue'), // 主题颜色
  difficulty: text('difficulty').notNull().default('beginner'), // 'beginner', 'intermediate', 'advanced'
  order: integer('order').notNull().unique(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// 教程模块表
export const tutorialModules = pgTable('tutorial_modules', {
  id: uuid('id').primaryKey().defaultRandom(),
  sectionId: uuid('section_id').notNull().references(() => tutorialSections.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  titleZh: text('title_zh'),
  description: text('description'),
  descriptionZh: text('description_zh'),
  content: text('content'), // Markdown 格式
  contentZh: text('content_zh'), // Markdown 格式
  videoUrl: text('video_url'), // 可选字段
  estimatedTimeMinutes: integer('estimated_time_minutes'),
  difficulty: text('difficulty').notNull().default('beginner'), // 'beginner', 'intermediate', 'advanced'
  prerequisites: jsonb('prerequisites').$type<string[]>().default([]), // 前置要求的模块ID
  learningObjectives: jsonb('learning_objectives').$type<string[]>().default([]), // 学习目标
  tags: jsonb('tags').$type<string[]>().default([]), // 标签
  order: integer('order').notNull(),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  sectionOrderUnique: unique().on(table.sectionId, table.order),
}));

// 用户教程进度表
export const userTutorialProgress = pgTable('user_tutorial_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(), // 改为text类型存储email
  moduleId: uuid('module_id').notNull().references(() => tutorialModules.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('not_started'), // 'not_started', 'in_progress', 'completed'
  progress: integer('progress').default(0), // 进度百分比 0-100
  timeSpent: integer('time_spent').default(0), // 花费时间（分钟）
  notes: text('notes'), // 用户笔记
  rating: integer('rating'), // 用户评分 1-5
  completedAt: timestamp('completed_at', { withTimezone: true }),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  userModuleUnique: unique().on(table.userId, table.moduleId),
}));

// 教程步骤表（将每个模块分解为具体步骤）
export const tutorialSteps = pgTable('tutorial_steps', {
  id: uuid('id').primaryKey().defaultRandom(),
  moduleId: uuid('module_id').notNull().references(() => tutorialModules.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  titleZh: text('title_zh'),
  contentZh: text('content_zh'), // Markdown 格式 
  content: text('content').notNull(), // Markdown 格式
  stepType: text('step_type').notNull().default('content'), // 'content', 'video', 'exercise', 'quiz'
  videoUrl: text('video_url'),
  exerciseData: jsonb('exercise_data'), // 练习数据
  order: integer('order').notNull(),
  estimatedTimeMinutes: integer('estimated_time_minutes').default(5),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  moduleOrderUnique: unique().on(table.moduleId, table.order),
}));

// 用户步骤进度表
export const userStepProgress = pgTable('user_step_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(), // 改为text类型存储email
  stepId: uuid('step_id').notNull().references(() => tutorialSteps.id, { onDelete: 'cascade' }),
  isCompleted: boolean('is_completed').default(false),
  timeSpent: integer('time_spent').default(0), // 花费时间（分钟）
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  userStepUnique: unique().on(table.userId, table.stepId),
})); 