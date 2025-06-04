import { pgTable, text, timestamp, uuid, boolean, integer, jsonb } from 'drizzle-orm/pg-core';

// 博客分类表
export const blogCategories = pgTable('blog_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(), // 英文名称
  nameZh: text('name_zh'), // 中文名称
  description: text('description'), // 英文描述
  descriptionZh: text('description_zh'), // 中文描述
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// 博客表 - 更新为支持新的字段结构
export const blogs = pgTable('blogs', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id').references(() => blogCategories.id, { onDelete: 'set null' }),
  
  // 基本信息
  url: text('url').unique(), // 原始URL
  title: text('title').notNull(), // 英文标题
  titleZh: text('title_zh'), // 中文标题
  excerpt: text('excerpt'), // 英文摘要
  excerptZh: text('excerpt_zh'), // 中文摘要
  thumbnail: text('thumbnail'), // 缩略图URL
  
  // 标签 - 使用jsonb存储数组
  tags: jsonb('tags').$type<string[]>().default([]),
  
  // 内容 - 支持大量文本
  readme: text('readme'), // 英文内容，Markdown格式
  readmeZh: text('readme_zh'), // 中文内容，Markdown格式
  
  // 爬取信息
  crawledAt: timestamp('crawled_at', { withTimezone: true }), // 爬取时间
  
  // 兼容旧字段
  summary: text('summary'), // 保留旧的摘要字段
  content: text('content'), // 保留旧的内容字段
  coverImageUrl: text('cover_image_url'), // 保留旧的封面图片字段
  author: text('author'), // 作者
  estimatedReadTime: integer('estimated_read_time'), // 预计阅读时间（分钟）
  
  // 状态管理
  isPublished: boolean('is_published').default(false),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}); 