/**
 * 教程功能模块统一导出
 */

// 导出类型定义
export type {
  TutorialSectionType,
  TutorialModuleType,
  TutorialStepType,
  UserProgressType,
  UserStepProgressType,
  UserTutorialStatsType,
  TutorialSectionFormDataType,
  TutorialModuleFormDataType,
  UserProgressFormDataType,
  PaginatedResponseType,
  ApiResponseType,
  UserStatsType,
  UserProgressData
} from './types';

// 导出Server Actions
export {
  getTutorialSections,
  createTutorialSection,
  updateTutorialSection,
  deleteTutorialSection,
  getTutorialModules,
  createTutorialModule,
  updateTutorialModule,
  deleteTutorialModule,
  getTutorialModuleById,
  updateUserProgress,
  getUserProgress,
  getUserTutorialStats,
  getTutorialStats,
  getTutorialSectionsWithModules,
  // 新增的进度管理功能
  updateUserTutorialProgress,
  getUserTutorialProgress,
  saveUserNotes,
  markTutorialCompleted,
  getUserAllTutorialProgress,
} from './actions/tutorial-actions';

// 导出组件
export { default as TutorialModuleCard } from './components/tutorial-moduleCard';
export { default as FeaturedTutorials } from './components/featured-tutorials';
export { default as TutorialStats } from './components/tutorial-stats';
export { default as TutorialManagementTable } from './components/tutorial-management-table';
export { TutorialCategoryClient } from './components/category-client'; 