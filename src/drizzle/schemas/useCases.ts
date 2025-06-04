import { pgTable, text, timestamp, uuid, boolean, jsonb, primaryKey } from 'drizzle-orm/pg-core';

// 案例场景分类表
export const useCaseCategories = pgTable('use_case_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  nameZh: text('name_zh').unique(),
  description: text('description'),
  descriptionZh: text('description_zh'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// 案例场景主表
export const useCases = pgTable('use_cases', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  titleZh: text('title_zh'),
  
  // n8n.io 相关信息
  n8nAuthor: text('n8n_author'),
  originalUrl: text('original_url').unique(),
  
  // 发布日期信息
  publishedAt: timestamp('published_at', { withTimezone: true }),
  publishDateDisplayEn: text('publish_date_display_en'),
  publishDateDisplayZh: text('publish_date_display_zh'),
  
  // 内容
  readme: text('readme'), // Markdown 格式
  readmeZh: text('readme_zh'), // Markdown 格式
  
  // 新增字段：工作流解读和教程案例
  workflowInterpretation: text('workflow_interpretation'), // 工作流解读，Markdown 格式
  workflowInterpretationZh: text('workflow_interpretation_zh'), // 工作流解读中文版，Markdown 格式
  workflowTutorial: text('workflow_tutorial'), // 工作流教程案例，Markdown 格式
  workflowTutorialZh: text('workflow_tutorial_zh'), // 工作流教程案例中文版，Markdown 格式
  
  // 工作流 JSON
  workflowJson: jsonb('workflow_json'),
  workflowJsonZh: jsonb('workflow_json_zh'),
  
  // 平台内部使用
  summary: text('summary'),
  summaryZh: text('summary_zh'),
  coverImageUrl: text('cover_image_url'),
  
  // 管理信息
  curatorId: uuid('curator_id'), // 关联到 profiles(id)
  isPublished: boolean('is_published').default(false),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// 案例场景与分类的关联表 (多对多)
export const useCaseToCategoryLinks = pgTable('use_case_to_category_links', {
  useCaseId: uuid('use_case_id').notNull().references(() => useCases.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').notNull().references(() => useCaseCategories.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.useCaseId, table.categoryId] }),
})); 