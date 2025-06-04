import { getUserByEmail } from '@/features/users/actions/user-actions';

// 检查用户是否为管理员
export async function checkIsAdmin(email: string): Promise<boolean> {
  try {
    const result = await getUserByEmail(email);
    // 确保result存在且success为true
    if (result && result.success && result.data) {
      return result.data.isAdmin || false;
    }
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// 获取当前用户信息
export async function getCurrentUser(email: string) {
  try {
    const result = await getUserByEmail(email);
    // 确保result存在且success为true
    if (result && result.success && result.data) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// 权限检查装饰器
export function requireAdmin() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      // 这里需要根据你的认证系统来获取当前用户
      // 示例：从session、JWT token等获取用户信息
      const userEmail = 'current-user-email'; // 需要替换为实际的用户获取逻辑
      
      const isAdmin = await checkIsAdmin(userEmail);
      if (!isAdmin) {
        throw new Error('Unauthorized: Admin access required');
      }
      
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

// 用户角色枚举
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

// 权限检查函数
export function hasPermission(userRole: string, requiredRole: UserRole): boolean {
  if (requiredRole === UserRole.ADMIN) {
    return userRole === 'admin';
  }
  return true; // 普通用户权限
} 