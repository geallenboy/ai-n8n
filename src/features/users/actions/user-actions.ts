'use server';

import { db } from '@/drizzle';
import { users } from '@/drizzle/schemas/users';
import { eq, desc, like, and, or, count } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// 用户Schema
const userCreateSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().email(),
  isActive: z.boolean().default(true),
  isAdmin: z.boolean().default(false),
  provider: z.string().default('email'),
  providerId: z.string().optional(),
});

const userUpdateSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().email().optional(),
  isActive: z.boolean().optional(),
  isAdmin: z.boolean().optional(),
  provider: z.string().optional(),
  providerId: z.string().optional(),
});

// 创建用户
export async function createUser(data: z.infer<typeof userCreateSchema>) {
  try {
    const validatedData = userCreateSchema.parse(data);
    const [user] = await db.insert(users).values(validatedData).returning();
    revalidatePath('/admin/users');
    return { success: true, data: user };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: 'Failed to create user' };
  }
}

// 获取所有用户（分页）
export async function getUsers(page = 1, limit = 10, search?: string) {
  try {
    const offset = (page - 1) * limit;
    
    const whereConditions = [];
    
    if (search) {
      whereConditions.push(
        or(
          like(users.fullName, `%${search}%`),
          like(users.email, `%${search}%`)
        )
      );
    }
    
    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;
    
    const [userList, totalCountResult] = await Promise.all([
      db.select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        isActive: users.isActive,
        isAdmin: users.isAdmin,
        provider: users.provider,
        providerId: users.providerId,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      }).from(users)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(users.createdAt)),
      
      db.select({ count: count() }).from(users).where(whereClause)
    ]);
    
    const totalCount = totalCountResult[0]?.count || 0;
    
    return {
      success: true,
      data: userList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, error: 'Failed to fetch users' };
  }
}

// 根据ID获取用户
export async function getUserById(id: string) {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return { success: true, data: user };
  } catch (error) {
    console.error('Error fetching user:', error);
    return { success: false, error: 'Failed to fetch user' };
  }
}

// 根据邮箱获取用户
export async function getUserByEmail(email: string) {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return { success: true, data: user };
  } catch (error) {
    console.error('Error fetching user:', error);
    return { success: false, error: 'Failed to fetch user' };
  }
}

// 更新用户
export async function updateUser(id: string, data: z.infer<typeof userUpdateSchema>) {
  try {
    const validatedData = userUpdateSchema.parse(data);
    const updateData = { ...validatedData, updatedAt: new Date() };
    
    const [user] = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    revalidatePath('/admin/users');
    return { success: true, data: user };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: 'Failed to update user' };
  }
}

// 删除用户
export async function deleteUser(id: string) {
  try {
    const [deletedUser] = await db.delete(users)
      .where(eq(users.id, id))
      .returning();
    
    if (!deletedUser) {
      return { success: false, error: 'User not found' };
    }
    
    revalidatePath('/admin/users');
    return { success: true, data: deletedUser };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: 'Failed to delete user' };
  }
}

// 切换用户激活状态
export async function toggleUserActiveStatus(id: string) {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    const [updatedUser] = await db.update(users)
      .set({ 
        isActive: !user.isActive,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    
    revalidatePath('/admin/users');
    return { success: true, data: updatedUser };
  } catch (error) {
    console.error('Error toggling user active status:', error);
    return { success: false, error: 'Failed to toggle user active status' };
  }
}

// 切换用户管理员状态
export async function toggleUserAdminStatus(id: string) {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    const [updatedUser] = await db.update(users)
      .set({ 
        isAdmin: !user.isAdmin,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    
    revalidatePath('/admin/users');
    return { success: true, data: updatedUser };
  } catch (error) {
    console.error('Error toggling user admin status:', error);
    return { success: false, error: 'Failed to toggle user admin status' };
  }
}

// 获取用户统计信息
export async function getUserStats() {
  try {
    const [totalUsers] = await db.select({ count: count() }).from(users);
    const [activeUsers] = await db.select({ count: count() }).from(users).where(eq(users.isActive, true));
    const [adminUsers] = await db.select({ count: count() }).from(users).where(eq(users.isAdmin, true));
    
    return {
      success: true,
      data: {
        total: totalUsers.count,
        active: activeUsers.count,
        inactive: totalUsers.count - activeUsers.count,
        admins: adminUsers.count
      }
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return { success: false, error: 'Failed to fetch user stats' };
  }
}

// 创建或更新用户（用于第三方登录）
export async function upsertUser(data: {
  email: string;
  fullName?: string;
  provider: string;
  providerId: string;
}) {
  try {
    // 先检查用户是否存在
    const [existingUser] = await db.select().from(users).where(eq(users.email, data.email));
    
    if (existingUser) {
      // 更新现有用户
      const [updatedUser] = await db.update(users)
        .set({
          fullName: data.fullName || existingUser.fullName,
          provider: data.provider,
          providerId: data.providerId,
          updatedAt: new Date()
        })
        .where(eq(users.id, existingUser.id))
        .returning();
      
      return { success: true, data: updatedUser, isNew: false };
    } else {
      // 创建新用户
      const [newUser] = await db.insert(users).values({
        email: data.email,
        fullName: data.fullName,
        provider: data.provider,
        providerId: data.providerId,
        isActive: true,
        isAdmin: false,
      }).returning();
      
      return { success: true, data: newUser, isNew: true };
    }
  } catch (error) {
    console.error('Error upserting user:', error);
    return { success: false, error: 'Failed to upsert user' };
  }
} 