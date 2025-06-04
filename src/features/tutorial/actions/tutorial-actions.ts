'use server';

import { db } from '@/drizzle';
import { tutorialSections, tutorialModules, userTutorialProgress } from '@/drizzle/schemas/tutorial';
import { eq, asc, like, and, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// 教程版块Schema
const tutorialSectionSchema = z.object({
  title: z.string().min(1), // 英文标题
  titleZh: z.string().optional(), // 中文标题
  description: z.string().optional(), // 英文描述
  descriptionZh: z.string().optional(), // 中文描述
  order: z.number().int().min(1),
});

// 教程管理Schema
const tutorialModuleSchema = z.object({
  sectionId: z.string().uuid(),
  title: z.string().min(1),
  titleZh: z.string().optional(),
  description: z.string().optional(),
  descriptionZh: z.string().optional(),
  content: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  estimatedTimeMinutes: z.number().int().min(1).optional(),
  order: z.number().int().min(1),
});

// 用户教程进度Schema
const userProgressSchema = z.object({
  userId: z.string().email(),
  moduleId: z.string().uuid(),
  status: z.enum(['not_started', 'in_progress', 'completed']).default('not_started'),
});

// 教程版块操作
export async function createTutorialSection(data: z.infer<typeof tutorialSectionSchema>) {
  try {
    const validatedData = tutorialSectionSchema.parse(data);
    const [section] = await db.insert(tutorialSections).values(validatedData).returning();
    revalidatePath('/admin/tutorial');
    revalidatePath('/tutorial');
    return { success: true, data: section };
  } catch (error) {
    console.error('Error creating tutorial section:', error);
    return { success: false, error: 'Failed to create tutorial section' };
  }
}

export async function getTutorialSections() {
  try {
    const sections = await db.select({
      id: tutorialSections.id,
      title: tutorialSections.title,
      titleZh: tutorialSections.titleZh,
      description: tutorialSections.description,
      descriptionZh: tutorialSections.descriptionZh,
      icon: tutorialSections.icon,
      color: tutorialSections.color,
      difficulty: tutorialSections.difficulty,
      order: tutorialSections.order,
      isActive: tutorialSections.isActive,
      createdAt: tutorialSections.createdAt,
      updatedAt: tutorialSections.updatedAt,
    }).from(tutorialSections).orderBy(asc(tutorialSections.order));
    return { success: true, data: sections };
  } catch (error) {
    console.error('Error fetching tutorial sections:', error);
    return { success: false, error: 'Failed to fetch tutorial sections' };
  }
}

export async function getTutorialSectionById(id: string) {
  try {
    const [section] = await db.select({
      id: tutorialSections.id,
      title: tutorialSections.title,
      titleZh: tutorialSections.titleZh,
      description: tutorialSections.description,
      descriptionZh: tutorialSections.descriptionZh,
      icon: tutorialSections.icon,
      color: tutorialSections.color,
      difficulty: tutorialSections.difficulty,
      order: tutorialSections.order,
      isActive: tutorialSections.isActive,
      createdAt: tutorialSections.createdAt,
      updatedAt: tutorialSections.updatedAt,
    }).from(tutorialSections).where(eq(tutorialSections.id, id));
    if (!section) {
      return { success: false, error: 'Tutorial section not found' };
    }
    return { success: true, data: section };
  } catch (error) {
    console.error('Error fetching tutorial section:', error);
    return { success: false, error: 'Failed to fetch tutorial section' };
  }
}

export async function updateTutorialSection(id: string, data: Partial<z.infer<typeof tutorialSectionSchema>>) {
  try {
    const updateData = { ...data, updatedAt: new Date() };
    const [section] = await db.update(tutorialSections)
      .set(updateData)
      .where(eq(tutorialSections.id, id))
      .returning();
    
    if (!section) {
      return { success: false, error: 'Tutorial section not found' };
    }
    
    revalidatePath('/admin/tutorial');
    revalidatePath('/tutorial');
    return { success: true, data: section };
  } catch (error) {
    console.error('Error updating tutorial section:', error);
    return { success: false, error: 'Failed to update tutorial section' };
  }
}

export async function deleteTutorialSection(id: string) {
  try {
    const [deletedSection] = await db.delete(tutorialSections)
      .where(eq(tutorialSections.id, id))
      .returning();
    
    if (!deletedSection) {
      return { success: false, error: 'Tutorial section not found' };
    }
    
    revalidatePath('/admin/tutorial');
    revalidatePath('/tutorial');
    return { success: true, data: deletedSection };
  } catch (error) {
    console.error('Error deleting tutorial section:', error);
    return { success: false, error: 'Failed to delete tutorial section' };
  }
}

// 教程管理操作
export async function createTutorialModule(data: z.infer<typeof tutorialModuleSchema>) {
  try {
    const validatedData = tutorialModuleSchema.parse(data);
    const [module] = await db.insert(tutorialModules).values(validatedData).returning();
    revalidatePath('/admin/tutorial');
    revalidatePath('/tutorial');
    return { success: true, data: module };
  } catch (error) {
    console.error('Error creating tutorial module:', error);
    return { success: false, error: 'Failed to create tutorial module' };
  }
}

export async function getTutorialModules(sectionId?: string, page = 1, limit = 10, search?: string) {
  try {
    const offset = (page - 1) * limit;
    
    let query = db.select({
      id: tutorialModules.id,
      sectionId: tutorialModules.sectionId,
      title: tutorialModules.title,
      titleZh: tutorialModules.titleZh,
      description: tutorialModules.description,
      descriptionZh: tutorialModules.descriptionZh,
      videoUrl: tutorialModules.videoUrl,
      estimatedTimeMinutes: tutorialModules.estimatedTimeMinutes,
      order: tutorialModules.order,
      createdAt: tutorialModules.createdAt,
      updatedAt: tutorialModules.updatedAt,
      sectionTitle: tutorialSections.titleZh,
    }).from(tutorialModules)
    .leftJoin(tutorialSections, eq(tutorialModules.sectionId, tutorialSections.id));
    
    const conditions = [];
    
    if (sectionId) {
      conditions.push(eq(tutorialModules.sectionId, sectionId));
    }
    
    if (search) {
      conditions.push(
        or(
          like(tutorialModules.title, `%${search}%`),
          like(tutorialModules.description, `%${search}%`)
        )
      );
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    const [moduleList, totalCount] = await Promise.all([
      query.limit(limit).offset(offset).orderBy(asc(tutorialModules.order)),
      db.select({ count: tutorialModules.id }).from(tutorialModules)
    ]);
    
    return {
      success: true,
      data: moduleList,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching tutorial modules:', error);
    return { success: false, error: 'Failed to fetch tutorial modules' };
  }
}

export async function getTutorialModuleById(id: string) {
  try {
    const [module] = await db.select({
      id: tutorialModules.id,
      sectionId: tutorialModules.sectionId,
      title: tutorialModules.title,
      titleZh: tutorialModules.titleZh,
      description: tutorialModules.description,
      descriptionZh: tutorialModules.descriptionZh,
      content: tutorialModules.content,
      contentZh: tutorialModules.contentZh,
      videoUrl: tutorialModules.videoUrl,
      estimatedTimeMinutes: tutorialModules.estimatedTimeMinutes,
      difficulty: tutorialModules.difficulty,
      prerequisites: tutorialModules.prerequisites,
      learningObjectives: tutorialModules.learningObjectives,
      tags: tutorialModules.tags,
      order: tutorialModules.order,
      isPublished: tutorialModules.isPublished,
      createdAt: tutorialModules.createdAt,
      updatedAt: tutorialModules.updatedAt,
      sectionTitle: tutorialSections.title,
    }).from(tutorialModules)
    .leftJoin(tutorialSections, eq(tutorialModules.sectionId, tutorialSections.id))
    .where(eq(tutorialModules.id, id));
    
    if (!module) {
      return { success: false, error: 'Tutorial module not found' };
    }
    
    return { success: true, data: module };
  } catch (error) {
    console.error('Error fetching tutorial module:', error);
    return { success: false, error: 'Failed to fetch tutorial module' };
  }
}
export async function updateTutorialModule(id: string, data: Partial<z.infer<typeof tutorialModuleSchema>>) {
  try {
    const updateData = { ...data, updatedAt: new Date() };
    const [module] = await db.update(tutorialModules)
      .set(updateData)
      .where(eq(tutorialModules.id, id))
      .returning();
    
    if (!module) {
      return { success: false, error: 'Tutorial module not found' };
    }
    
    revalidatePath('/admin/tutorial');
    revalidatePath('/tutorial');
    return { success: true, data: module };
  } catch (error) {
    console.error('Error updating tutorial module:', error);
    return { success: false, error: 'Failed to update tutorial module' };
  }
}

export async function deleteTutorialModule(id: string) {
  try {
    const [deletedModule] = await db.delete(tutorialModules)
      .where(eq(tutorialModules.id, id))
      .returning();
    
    if (!deletedModule) {
      return { success: false, error: 'Tutorial module not found' };
    }
    
    revalidatePath('/admin/tutorial');
    revalidatePath('/tutorial');
    return { success: true, data: deletedModule };
  } catch (error) {
    console.error('Error deleting tutorial module:', error);
    return { success: false, error: 'Failed to delete tutorial module' };
  }
}

// 获取教程版块及其模块（用于前台展示）
export async function getTutorialSectionsWithModules() {
  try {
    const sections = await db.select().from(tutorialSections).orderBy(asc(tutorialSections.order));
    
    const sectionsWithModules = await Promise.all(
      sections.map(async (section) => {
        console.log(section,"section");
        const modules = await db.select({
          id: tutorialModules.id,
          title: tutorialModules.title,
          titleZh: tutorialModules.titleZh,
          description: tutorialModules.description,
          descriptionZh: tutorialModules.descriptionZh,
          estimatedTimeMinutes: tutorialModules.estimatedTimeMinutes,
          order: tutorialModules.order,
          
        }).from(tutorialModules)
        .where(eq(tutorialModules.sectionId, section.id))
        .orderBy(asc(tutorialModules.order));
        
        return {
          ...section,
          modules
        };
      })
    );
    
    return { success: true, data: sectionsWithModules };
  } catch (error) {
    console.error('Error fetching tutorial sections with modules:', error);
    return { success: false, error: 'Failed to fetch tutorial sections with modules' };
  }
}

// 用户教程进度操作
export async function updateUserProgress(data: z.infer<typeof userProgressSchema>) {
  try {
    const validatedData = userProgressSchema.parse(data);
    
    // 检查是否已存在记录
    const [existingProgress] = await db.select()
      .from(userTutorialProgress)
      .where(and(
        eq(userTutorialProgress.userId, validatedData.userId),
        eq(userTutorialProgress.moduleId, validatedData.moduleId)
      ));
    
    let progress;
    if (existingProgress) {
      // 更新现有记录
      const updateData = {
        status: validatedData.status,
        completedAt: validatedData.status === 'completed' ? new Date() : null,
        updatedAt: new Date()
      };
      
      [progress] = await db.update(userTutorialProgress)
        .set(updateData)
        .where(eq(userTutorialProgress.id, existingProgress.id))
        .returning();
    } else {
      // 创建新记录
      const insertData = {
        ...validatedData,
        completedAt: validatedData.status === 'completed' ? new Date() : null,
        startedAt: new Date()
      };
      
      [progress] = await db.insert(userTutorialProgress).values(insertData).returning();
    }
    
    revalidatePath('/tutorial');
    return { success: true, data: progress };
  } catch (error) {
    console.error('Error updating user progress:', error);
    return { success: false, error: 'Failed to update user progress' };
  }
}

export async function getUserProgress(userId: string, moduleId?: string) {
  try {
    const conditions = [eq(userTutorialProgress.userId, userId)];
    
    if (moduleId) {
      conditions.push(eq(userTutorialProgress.moduleId, moduleId));
    }
    
    const progress = await db.select({
      id: userTutorialProgress.id,
      userId: userTutorialProgress.userId,
      moduleId: userTutorialProgress.moduleId,
      status: userTutorialProgress.status,
      completedAt: userTutorialProgress.completedAt,
      startedAt: userTutorialProgress.startedAt,
      moduleTitle: tutorialModules.title,
      moduleTitleZh: tutorialModules.titleZh,
      moduleDescription: tutorialModules.description,
      moduleDescriptionZh: tutorialModules.descriptionZh,
      sectionTitle: tutorialSections.title,

    }).from(userTutorialProgress)
    .innerJoin(tutorialModules, eq(userTutorialProgress.moduleId, tutorialModules.id))
    .innerJoin(tutorialSections, eq(tutorialModules.sectionId, tutorialSections.id))
    .where(and(...conditions));
    
    return { success: true, data: progress };
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return { success: false, error: 'Failed to fetch user progress' };
  }
}

export async function getUserTutorialStats(userId: string) {
  try {
    const totalModulesResult = await db.select({ count: tutorialModules.id }).from(tutorialModules);
    const completedModulesResult = await db.select({ count: userTutorialProgress.id })
      .from(userTutorialProgress)
      .where(and(
        eq(userTutorialProgress.userId, userId),
        eq(userTutorialProgress.status, 'completed')
      ));
    const inProgressModulesResult = await db.select({ count: userTutorialProgress.id })
      .from(userTutorialProgress)
      .where(and(
        eq(userTutorialProgress.userId, userId),
        eq(userTutorialProgress.status, 'in_progress')
      ));
    
    const total = totalModulesResult.length;
    const completed = completedModulesResult.length;
    const inProgress = inProgressModulesResult.length;
    
    return {
      success: true,
      data: {
        total,
        completed,
        inProgress,
        notStarted: total - completed - inProgress
      }
    };
  } catch (error) {
    console.error('Error fetching user tutorial stats:', error);
    return { success: false, error: 'Failed to fetch user tutorial stats' };
  }
}

export async function getTutorialStats() {
  try {
    const totalSectionsResult = await db.select().from(tutorialSections);
    const totalModulesResult = await db.select().from(tutorialModules);
    const totalProgressResult = await db.select().from(userTutorialProgress);
    const completedProgressResult = await db.select()
      .from(userTutorialProgress)
      .where(eq(userTutorialProgress.status, 'completed'));
    
    return {
      success: true,
      data: {
        totalSections: totalSectionsResult.length,
        totalModules: totalModulesResult.length,
        totalProgress: totalProgressResult.length,
        completedProgress: completedProgressResult.length
      }
    };
  } catch (error) {
    console.error('Error fetching tutorial stats:', error);
    return { success: false, error: 'Failed to fetch tutorial stats' };
  }
}

// 更新用户教程进度（包含笔记）
export async function updateUserTutorialProgress(data: {
  userId: string;
  moduleId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress?: number;
  timeSpent?: number;
  notes?: string;
  rating?: number;
}) {
  try {
    // 检查是否已存在记录
    const [existingProgress] = await db.select()
      .from(userTutorialProgress)
      .where(and(
        eq(userTutorialProgress.userId, data.userId),
        eq(userTutorialProgress.moduleId, data.moduleId)
      ));
    
    let progress;
    if (existingProgress) {
      // 更新现有记录
      const updateData = {
        status: data.status,
        progress: data.progress ?? existingProgress.progress,
        timeSpent: data.timeSpent ?? existingProgress.timeSpent,
        notes: data.notes ?? existingProgress.notes,
        rating: data.rating ?? existingProgress.rating,
        completedAt: data.status === 'completed' ? new Date() : existingProgress.completedAt,
        updatedAt: new Date()
      };
      
      [progress] = await db.update(userTutorialProgress)
        .set(updateData)
        .where(eq(userTutorialProgress.id, existingProgress.id))
        .returning();
    } else {
      // 创建新记录
      const insertData = {
        userId: data.userId,
        moduleId: data.moduleId,
        status: data.status,
        progress: data.progress ?? 0,
        timeSpent: data.timeSpent ?? 0,
        notes: data.notes ?? '',
        rating: data.rating ?? null,
        completedAt: data.status === 'completed' ? new Date() : null,
        startedAt: new Date()
      };
      
      [progress] = await db.insert(userTutorialProgress).values(insertData).returning();
    }
    
    revalidatePath('/front/tutorial');
    return { success: true, data: progress };
  } catch (error) {
    console.error('Error updating user tutorial progress:', error);
    return { success: false, error: 'Failed to update user tutorial progress' };
  }
}

// 获取用户特定模块的进度和笔记
export async function getUserTutorialProgress(userId: string, moduleId: string) {
  try {
    const [progress] = await db.select()
      .from(userTutorialProgress)
      .where(and(
        eq(userTutorialProgress.userId, userId),
        eq(userTutorialProgress.moduleId, moduleId)
      ));
    
    return { 
      success: true, 
      data: progress || {
        status: 'not_started',
        progress: 0,
        timeSpent: 0,
        notes: '',
        rating: null
      }
    };
  } catch (error) {
    console.error('Error fetching user tutorial progress:', error);
    return { success: false, error: 'Failed to fetch user tutorial progress' };
  }
}

// 保存用户学习笔记
export async function saveUserNotes(userId: string, moduleId: string, notes: string) {
  try {
    const result = await updateUserTutorialProgress({
      userId,
      moduleId,
      status: 'in_progress', // 如果在做笔记，至少表示开始学习了
      notes
    });
    
    return result;
  } catch (error) {
    console.error('Error saving user notes:', error);
    return { success: false, error: 'Failed to save user notes' };
  }
}

// 标记教程模块完成
export async function markTutorialCompleted(userId: string, moduleId: string, timeSpent: number = 0, rating?: number) {
  try {
    const result = await updateUserTutorialProgress({
      userId,
      moduleId,
      status: 'completed',
      progress: 100,
      timeSpent,
      rating
    });
    
    return result;
  } catch (error) {
    console.error('Error marking tutorial completed:', error);
    return { success: false, error: 'Failed to mark tutorial completed' };
  }
}

// 获取用户所有教程进度
export async function getUserAllTutorialProgress(userId: string) {
  try {
    const progressList = await db.select({
      id: userTutorialProgress.id,
      userId: userTutorialProgress.userId,
      moduleId: userTutorialProgress.moduleId,
      status: userTutorialProgress.status,
      progress: userTutorialProgress.progress,
      timeSpent: userTutorialProgress.timeSpent,
      notes: userTutorialProgress.notes,
      rating: userTutorialProgress.rating,
      completedAt: userTutorialProgress.completedAt,
      startedAt: userTutorialProgress.startedAt,
      updatedAt: userTutorialProgress.updatedAt,
      moduleTitle: tutorialModules.title,
      moduleDescription: tutorialModules.description,
      sectionTitle: tutorialSections.title,
      sectionId: tutorialSections.id,
      estimatedTimeMinutes: tutorialModules.estimatedTimeMinutes
    })
    .from(userTutorialProgress)
    .innerJoin(tutorialModules, eq(userTutorialProgress.moduleId, tutorialModules.id))
    .innerJoin(tutorialSections, eq(tutorialModules.sectionId, tutorialSections.id))
    .where(eq(userTutorialProgress.userId, userId))
    .orderBy(tutorialSections.order, tutorialModules.order);
    
    return { success: true, data: progressList };
  } catch (error) {
    console.error('Error fetching user all tutorial progress:', error);
    return { success: false, error: 'Failed to fetch user all tutorial progress' };
  }
} 