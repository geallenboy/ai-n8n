/**
 * 通用功能模块统一导出
 */
// 导出类型定义
export type {
  
  ActionResponseType,
  PaginationInfoType
} from './types';

// 导出组件
export { default as PageHeader } from './components/page-header';
export { default as SearchAndFilter } from './components/search-and-filter';
export { default as Pagination } from './components/pagination';
export { default as HeroSection } from './components/hero-section';
export { default as AnimatedGradientText } from './components/animated-gradient-text';
export { ThemeProvider } from './components/theme-provider';
export { N8nWorkflowPreview } from './components/n8n-workflow-preview';
export { Logo } from './components/logo';
export { default as AdvancedMarkdownEditor } from './components/advanced-markdown-editor';
export { default as AdvancedMarkdownRenderer } from './components/advanced-markdown-renderer';
export { AdminTable, commonActions } from './components/admin-table';
export { AdminPagination } from './components/admin-pagination';

// 导出Server Actions
export {
  getFeaturedUseCases,
  getLatestTutorials,
  getLatestBlogs,
  getUseCases,
  getUseCaseCategories,
  getUseCaseStatsForFrontend,
  getBlogsList,
  getBlogsCategories,
  getTutorialSectionsWithModules,
  getUseCaseById,
  getBlogById,
  getTutorialModuleById,
  getDashboardStats,
  getTutorialStatsById,
} from './actions/front-actions';

// 工具函数导出
export { 
  translateToEnglish, 
  translateFieldsToEnglish, 
  handleTranslationWithFeedback,
  processFormDataWithTranslation
} from './utils/translation';

// 时长估算工具函数
export * from './utils/time-estimation';

// 类型导出
export type { TableColumn, TableAction } from './components/admin-table'; 