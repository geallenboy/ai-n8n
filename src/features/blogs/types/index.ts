/**
 * 博客功能模块的TypeScript类型定义
 */

/** 博客分类接口 */
export interface BlogCategoryType {
  id: string;
  name: string; // 英文名称
  nameZh?: string | null; // 中文名称
  description?: string | null; // 英文描述
  descriptionZh?: string | null; // 中文描述
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
export interface BlogListType {
  id: string;
  url?: string | null;
  title: string;
  titleZh?: string | null;
  excerpt?: string | null;
  excerptZh?: string | null;
  summary: string | null;
  coverImageUrl: string | null;
  thumbnail?: string | null;
  author: string | null;
  estimatedReadTime?: number | null;
  publishedAt: Date | null;
  categoryName: string | null;
  tags?: string[] | null;
}
/** 博客接口 */
export interface BlogType {
  id: string;
  url: string | null;
  title: string;
  titleZh?: string | null;
  excerpt?: string | null;
  excerptZh?: string | null;
  thumbnail?: string | null;
  tags?: string[];
  readme?: string | null;
  readmeZh?: string | null;
  crawledAt?: Date | null;
  categoryId?: string | null;
  
  // 兼容旧字段
  summary?: string | null;
  content?: string | null;
  coverImageUrl?: string | null;
  author?: string | null;
  estimatedReadTime?: number | null;
  
  // 状态管理
  isPublished?: boolean | null;
  publishedAt?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  category?: BlogCategoryType | null;
  categoryName?: string | null;
}

/** 博客创建数据接口 */
export interface CreateBlogDataType {
  url?: string;
  title: string;
  titleZh?: string;
  excerpt?: string;
  excerptZh?: string;
  thumbnail?: string;
  tags?: string[];
  readme?: string;
  readmeZh?: string;
  crawledAt?: Date;
  categoryId?: string;
  
  // 兼容旧字段
  summary?: string;
  content?: string;
  coverImageUrl?: string;
  author?: string;
  estimatedReadTime?: number;
  
  // 状态管理
  isPublished?: boolean;
  publishedAt?: Date;
}

/** 博客更新数据接口 */
export interface UpdateBlogDataType extends Partial<CreateBlogDataType> {
  id: string;
}

/** 博客查询参数接口 */
export interface BlogQueryParamsType {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  tags?: string[];
}

/** 博客查询结果接口 */
export interface BlogQueryResultType {
  blogs: BlogType[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
}

/** 博客统计信息接口 */
export interface BlogStatsType {
  total: number;
  byCategory: Record<string, number>;
  byMonth: Record<string, number>;
}

/** 博客导入数据接口 */
export interface BlogImportDataType {
  title: string;
  titleZh?: string;
  excerpt?: string;
  excerptZh?: string;
  url?: string;
  thumbnail?: string;
  tags?: string[];
  readme?: string;
  readmeZh?: string;
  categoryName?: string;
}

/** 博客导入结果接口 */
export interface BlogImportResultType {
  imported: number;
  errors: string[];
}

/** 分类创建数据接口 */
export interface CreateCategoryDataType {
  name: string; // 英文名称
  nameZh?: string; // 中文名称
  description?: string; // 英文描述
  descriptionZh?: string; // 中文描述
}

/** 博客管理页面状态接口 */
export interface BlogManagementStateType {
  blogs: BlogType[];
  categories: BlogCategoryType[];
  loading: boolean;
  searchTerm: string;
  selectedCategory: string;
  selectedTags: string[];
  currentPage: number;
  totalPages: number;
  stats: BlogStatsType;
  selectedBlogs: string[];
}

/** 分类表单数据接口 */
export interface CategoryFormDataType {
  name: string; // 英文名称
  nameZh: string; // 中文名称
  description: string; // 英文描述
  descriptionZh: string; // 中文描述
}

/** 导入状态接口 */
export interface ImportStateType {
  file: File | null;
  jsonData: any[];
  importing: boolean;
}

/** Server Action 响应接口 */
export interface ActionResponseType<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 