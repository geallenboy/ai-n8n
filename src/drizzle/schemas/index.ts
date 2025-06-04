// 导出所有数据库表和模式
export * from './users';
export * from './profiles';
export * from './tutorial';
export * from './useCases';
export * from './blogs';
export * from './interactions';
export * from './contact';
export * from './likes';
export * from './payments';

// 重新导入所有表用于 schema 导出
import { users } from './users';
import { profiles } from './profiles';
import { tutorialSections, tutorialModules, userTutorialProgress } from './tutorial';
import { useCaseCategories, useCases, useCaseToCategoryLinks } from './useCases';
import { blogCategories, blogs } from './blogs';
import { viewRecords, favorites, downloadRecords, shareRecords, systemLogs, systemSettings } from './interactions';
import { contactMessages } from './contact';
import { likes } from './likes';
import { subscriptionPlans, userSubscriptions, paymentRecords, userUsageLimits } from './payments';

// 导出表的集合，用于 Drizzle 配置
export const schema = {
  // 用户相关
  users,
  profiles,
  
  // 教程
  tutorialSections,
  tutorialModules,
  userTutorialProgress,
  
  // 案例
  useCaseCategories,
  useCases,
  useCaseToCategoryLinks,
  
  // 博客
  blogCategories,
  blogs,
  
  // 用户交互
  viewRecords,
  favorites,
  downloadRecords,
  shareRecords,
  likes,
  systemLogs,
  systemSettings,
  
  // 联系我们
  contactMessages,
  
  // 支付相关
  subscriptionPlans,
  userSubscriptions,
  paymentRecords,
  userUsageLimits,
};
