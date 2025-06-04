/**
 * Tutorial功能模块的类型定义
 */

// 教程接口
export interface TutorialModuleType {
  id: string;
  title: string;
  titleZh: string | null;
  description: string | null;
  descriptionZh?: string | null;
  content?: string | null;
  contentZh?: string | null;
  videoUrl?: string | null;
  estimatedTimeMinutes?: number | null;
  difficulty?: string;
  prerequisites?: string[] | null;
  learningObjectives?: string[] | null;
  tags?: string[] | null;
  sectionTitle?: string;
  sectionId?: string;
  order?: number;
  isPublished?: boolean | null;
  createdAt?: Date | null;
}

// 教程版块接口
export interface TutorialSectionType {
  id: string;
  title: string; // 英文标题
  titleZh?: string | null; // 中文标题
  description: string | null; // 英文描述
  descriptionZh?: string | null; // 中文描述
  icon?: string | null; 
  color?: string | null;
  difficulty?: string;
  order?: number;
  isActive?: boolean | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  modules?: TutorialModuleType[];
}

// 用户学习进度接口
export interface UserProgressType {
  id: string;
  userId: string;
  moduleId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  timeSpent?: number;
  notes?: string | null;
  rating?: number | null;
  completedAt?: Date | null;
  startedAt?: Date | null;
  updatedAt?: Date | null;
  moduleTitle?: string;
  sectionTitle?: string;
}

// 教程统计数据接口
export interface TutorialStatsType {
  totalSections: number;
  totalModules: number;
  totalProgress: number;
  completedProgress: number;
}

// 用户学习统计接口
export interface UserTutorialStatsType {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
}

// 教程步骤接口
export interface TutorialStepType {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  stepType: 'content' | 'video' | 'exercise' | 'quiz';
  videoUrl?: string | null;
  exerciseData?: any;
  order: number;
  estimatedTimeMinutes: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// 用户步骤进度接口
export interface UserStepProgressType {
  id: string;
  userId: string;
  stepId: string;
  isCompleted: boolean;
  timeSpent: number;
  completedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
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
export interface TutorialSectionFormDataType   {
  title: string;
  description?: string;
  order: number;
  icon?: string;
  color?: string;
  difficulty?: string;
}

export interface TutorialModuleFormDataType {
  sectionId: string;
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  estimatedTimeMinutes?: number;
  order: number;
  difficulty?: string;
  prerequisites?: string[];
  learningObjectives?: string[];
  tags?: string[];
}

export interface UserProgressFormDataType {
  userId: string;
  moduleId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress?: number;
  timeSpent?: number;
  notes?: string;
  rating?: number;
} 





export interface UserProgressData {
  moduleId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  timeSpent: number;
  notes: string | null;
  rating: number | null;
  completedAt: Date | null;
  moduleTitle: string;
  sectionTitle: string;
  estimatedTimeMinutes: number | null;
}

export interface UserStatsType {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
}