/**
 * Use Cases功能模块的类型定义
 */

// 用例接口
export interface UseCaseType {
  id: string;
  title: string;
  titleZh?: string | null;
  
  // n8n.io 相关信息
  n8nAuthor?: string | null;
  originalUrl?: string | null;
  
  // 发布日期信息
  publishedAt?: Date | null;
  publishDateDisplayEn?: string | null;
  publishDateDisplayZh?: string | null;
  
  // 内容
  readme?: string | null;
  readmeZh?: string | null;
  
  // 工作流解读和教程案例
  workflowInterpretation?: string | null;
  workflowInterpretationZh?: string | null;
  workflowTutorial?: string | null;
  workflowTutorialZh?: string | null;
  
  // 工作流 JSON
  workflowJson?: any;
  workflowJsonZh?: any;
  
  // 平台内部使用
  summary?: string | null;
  summaryZh?: string | null;
  coverImageUrl?: string | null;
  
  // 管理信息
  curatorId?: string | null;
  isPublished?: boolean | null;
  
  createdAt?: Date | null;
  updatedAt?: Date | null;
  
  // 兼容旧字段（用于向后兼容）
  description?: string;
  detailedDescription?: string | null;
  workflowExplanation?: string | null;
  aiSummary?: string | null;
  thumbnailUrl?: string | null;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTimeMinutes?: number | null;
  tags?: string[];
  isFeatured?: boolean;
  viewCount?: number;
  downloadCount?: number;
  favoriteCount?: number;
  categories?: UseCaseCategoryType[];
  category?: string | null;
  stats?: {
    views: number;
    favorites: number;
    downloads: number;
  };
}

// 用例分类接口
export interface UseCaseCategoryType {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// 用例统计数据接口
export interface UseCaseStatsType {
  totalUseCases: number;
  publishedUseCases: number;
  totalViews: number;
  totalDownloads: number;
  totalFavorites: number;
  categoriesCount: number;
}

// 用例交互记录接口
export interface UseCaseInteractionType {
  id: string;
  useCaseId: string;
  userId?: string | null;
  userEmail?: string | null;
  type: 'view' | 'download' | 'favorite' | 'share';
  metadata?: any;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date | null;
}

// API响应类型
export interface ApiResponseType<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 分页响应类型
export interface PaginatedResponseType<T> {
  success: boolean;
  data?: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

// 表单数据类型
export interface UseCaseFormDataType {
  title: string;
  description: string;
  detailedDescription?: string;
  workflowJson?: string;
  workflowExplanation?: string;
  aiSummary?: string;
  thumbnailUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTimeMinutes?: number;
  tags?: string[];
  isPublished: boolean;
  isFeatured: boolean;
  categoryIds?: string[];
}

export interface UseCaseCategoryFormDataType {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  order: number;
  isActive: boolean;
}

// 搜索和筛选参数
export interface UseCaseSearchParamsType {
  search?: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  isPublished?: boolean;
  isFeatured?: boolean;
  sortBy?: 'createdAt' | 'viewCount' | 'downloadCount' | 'favoriteCount' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// 用例详情页面数据
export interface UseCaseDetailData extends UseCaseType {
  relatedUseCases?: UseCaseType[];
  userInteraction?: {
    isFavorited: boolean;
    hasDownloaded: boolean;
    hasViewed: boolean;
  };
}

// 用例过滤器接口
export interface UseCaseFiltersType {
  search?: string;
  category?: string;
  industry?: string[];
  difficulty?: string[];
  tags?: string[];
  aiTools?: string[];
  isFeatured?: boolean;
  isPublished?: boolean;
} 



export interface CategoryType {
  id: string;
  name: string;
}
