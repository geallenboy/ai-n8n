/**
 * 用户功能模块的TypeScript类型定义
 */

/** 用户角色枚举 */
export type UserRoleType = 'admin' | 'user' | 'moderator';

/** 用户状态枚举 */
export type UserStatusType = 'active' | 'inactive' | 'suspended' | 'pending';

/** 用户接口 */
export interface UserType {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  role: UserRoleType;
  status: UserStatusType;
  emailVerified?: boolean;
  lastLoginAt?: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  profile?: UserProfileType | null;
}

/** 用户资料接口 */
export interface UserProfileType {
  id: string;
  userId: string;
  bio?: string | null;
  website?: string | null;
  location?: string | null;
  company?: string | null;
  jobTitle?: string | null;
  skills?: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  } | null;
  preferences?: {
    language?: string;
    timezone?: string;
    notifications?: {
      email?: boolean;
      push?: boolean;
    };
  } | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

/** 用户创建数据接口 */
export interface CreateUserDataType {
  email: string;
  name: string;
  password: string;
  role?: UserRoleType;
  status?: UserStatusType;
  avatar?: string;
}

/** 用户更新数据接口 */
export interface UpdateUserDataType {
  id: string;
  email?: string;
  name?: string;
  role?: UserRoleType;
  status?: UserStatusType;
  avatar?: string;
  emailVerified?: boolean;
}

/** 用户查询参数接口 */
export interface UserQueryParamsType {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRoleType;
  status?: UserStatusType;
  sortBy?: 'name' | 'email' | 'createdAt' | 'lastLoginAt';
  sortOrder?: 'asc' | 'desc';
}

/** 用户查询结果接口 */
export interface UserQueryResultType {
  users: UserType[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
}

/** 用户统计信息接口 */
export interface UserStatsType {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  roleDistribution: {
    admin: number;
    user: number;
    moderator: number;
  };
  statusDistribution: {
    active: number;
    inactive: number;
    suspended: number;
    pending: number;
  };
}

/** 用户活动日志接口 */
export interface UserActivityType {
  id: string;
  userId: string;
  action: string;
  description: string;
  metadata?: Record<string, any> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date | null;
  user?: Pick<UserType, 'id' | 'name' | 'email'> | null;
}

/** Server Action 响应接口 */
export interface ActionResponseType<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 