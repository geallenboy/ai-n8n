'use server';

import { db } from '@/drizzle';
import { useCases, useCaseCategories, useCaseToCategoryLinks } from '@/drizzle/schemas/useCases';
import { eq, desc, like, and, or, inArray, count, not } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// 案例Schema
const useCaseSchema = z.object({
  title: z.string().min(1),
  titleZh: z.string().optional(),
  n8nAuthor: z.string().optional(),
  originalUrl: z.string().url().optional().or(z.literal('')),
  publishedAt: z.date().optional(),
  publishDateDisplayEn: z.string().optional(),
  publishDateDisplayZh: z.string().optional(),
  readme: z.string().optional(),
  readmeZh: z.string().optional(),
  workflowInterpretation: z.string().optional(),
  workflowInterpretationZh: z.string().optional(),
  workflowTutorial: z.string().optional(),
  workflowTutorialZh: z.string().optional(),
  workflowJson: z.any().optional(),
  workflowJsonZh: z.any().optional(),
  summary: z.string().optional(),
  summaryZh: z.string().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  curatorId: z.string().uuid().optional(),
  isPublished: z.boolean().default(false),
});

const useCaseCategorySchema = z.object({
  name: z.string().min(1),
  nameZh: z.string().optional(),
  description: z.string().optional(),
  descriptionZh: z.string().optional(),
});

// 案例分类操作
export async function createUseCaseCategory(data: z.infer<typeof useCaseCategorySchema>) {
  try {
    const validatedData = useCaseCategorySchema.parse(data);

    
    const categoryData = {
      ...validatedData,

    };
    
    const [category] = await db.insert(useCaseCategories).values(validatedData).returning();
    revalidatePath('/admin/use-cases');
    return { success: true, data: category };
  } catch (error) {
    console.error('Error creating use case category:', error);
    return { success: false, error: 'Failed to create use case category' };
  }
}

export async function getUseCaseCategories() {
  try {
    const categories = await db.select().from(useCaseCategories).orderBy(useCaseCategories.name);
    return { success: true, data: categories };
  } catch (error) {
    console.error('Error fetching use case categories:', error);
    return { success: false, error: 'Failed to fetch use case categories' };
  }
}

export async function updateUseCaseCategory(id: string, data: Partial<z.infer<typeof useCaseCategorySchema>>) {
  try {
    const updateData = { ...data, updatedAt: new Date() };
    const [category] = await db.update(useCaseCategories)
      .set(updateData)
      .where(eq(useCaseCategories.id, id))
      .returning();
    
    if (!category) {
      return { success: false, error: 'Category not found' };
    }
    
    revalidatePath('/admin/use-cases');
    return { success: true, data: category };
  } catch (error) {
    console.error('Error updating use case category:', error);
    return { success: false, error: 'Failed to update use case category' };
  }
}

export async function deleteUseCaseCategory(id: string) {
  try {
    const [deletedCategory] = await db.delete(useCaseCategories)
      .where(eq(useCaseCategories.id, id))
      .returning();
    
    if (!deletedCategory) {
      return { success: false, error: 'Category not found' };
    }
    
    revalidatePath('/admin/use-cases');
    return { success: true, data: deletedCategory };
  } catch (error) {
    console.error('Error deleting use case category:', error);
    return { success: false, error: 'Failed to delete use case category' };
  }
}

// 案例操作
export async function createUseCase(data: z.infer<typeof useCaseSchema>, categoryIds?: string[]) {
  try {
    const validatedData = useCaseSchema.parse(data);
    
    // 检查标题是否已存在
    if (validatedData.title || validatedData.titleZh) {
      const titleCheck = [];
      if (validatedData.title) {
        titleCheck.push(eq(useCases.title, validatedData.title));
      }
      if (validatedData.titleZh) {
        titleCheck.push(eq(useCases.titleZh, validatedData.titleZh));
      }
      
      const existing = await db.select({ id: useCases.id, title: useCases.title, titleZh: useCases.titleZh })
        .from(useCases)
        .where(or(...titleCheck))
        .limit(1);
      
      if (existing.length > 0) {
        const existingUseCase = existing[0];
        const conflictTitle = existingUseCase.title === validatedData.title ? validatedData.title : 
                            existingUseCase.titleZh === validatedData.titleZh ? validatedData.titleZh : '';
        return { success: false, error: `案例标题"${conflictTitle}"已存在，请使用其他标题` };
      }
    }
    
    const [useCase] = await db.insert(useCases).values(validatedData).returning();
    
    // 关联分类
    if (categoryIds && categoryIds.length > 0) {
      const categoryLinks = categoryIds.map(categoryId => ({
        useCaseId: useCase.id,
        categoryId
      }));
      await db.insert(useCaseToCategoryLinks).values(categoryLinks);
    }
    
    revalidatePath('/admin/use-cases');
    revalidatePath('/use-cases');
    return { success: true, data: useCase };
  } catch (error) {
    console.error('Error creating use case:', error);
    return { success: false, error: 'Failed to create use case' };
  }
}

export async function getUseCases(page = 1, limit = 10, search?: string, categoryId?: string) {
  try {
    const offset = (page - 1) * limit;
    
    let query = db.select({
      id: useCases.id,
      title: useCases.title,
      titleZh: useCases.titleZh,
      summary: useCases.summary,
      summaryZh: useCases.summaryZh,
      readme: useCases.readme,
      readmeZh: useCases.readmeZh,
      workflowInterpretation: useCases.workflowInterpretation,
      workflowInterpretationZh: useCases.workflowInterpretationZh,
      workflowTutorial: useCases.workflowTutorial,
      workflowTutorialZh: useCases.workflowTutorialZh,
      workflowJson: useCases.workflowJson,
      workflowJsonZh: useCases.workflowJsonZh,
      coverImageUrl: useCases.coverImageUrl,
      n8nAuthor: useCases.n8nAuthor,
      originalUrl: useCases.originalUrl,
      isPublished: useCases.isPublished,
      publishedAt: useCases.publishedAt,
      createdAt: useCases.createdAt,
      updatedAt: useCases.updatedAt,
    }).from(useCases);
    
    const conditions = [];
    
    if (search) {
      conditions.push(
        or(
          like(useCases.title, `%${search}%`),
          like(useCases.titleZh, `%${search}%`),
          like(useCases.summary, `%${search}%`),
          like(useCases.summaryZh, `%${search}%`)
        )
      );
    }
    
    if (categoryId) {
      // 需要通过关联表查询
      const useCaseIds = await db.select({ useCaseId: useCaseToCategoryLinks.useCaseId })
        .from(useCaseToCategoryLinks)
        .where(eq(useCaseToCategoryLinks.categoryId, categoryId));
      
      if (useCaseIds.length > 0) {
        conditions.push(inArray(useCases.id, useCaseIds.map(item => item.useCaseId)));
      } else {
        // 如果没有找到相关案例，返回空结果
        return {
          success: true,
          data: [],
          pagination: { page, limit, total: 0, totalPages: 0 }
        };
      }
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    const [useCaseList, totalCount] = await Promise.all([
      query.limit(limit).offset(offset).orderBy(desc(useCases.createdAt)),
      db.select({ count: count() }).from(useCases).where(conditions.length > 0 ? and(...conditions) : undefined)
    ]);
    
    return {
      success: true,
      data: useCaseList,
      pagination: {
        page,
        limit,
        total: totalCount[0].count,
        totalPages: Math.ceil(totalCount[0].count / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching use cases:', error);
    return { success: false, error: 'Failed to fetch use cases' };
  }
}

export async function getUseCaseById(id: string) {
  try {
    const [useCase] = await db.select().from(useCases).where(eq(useCases.id, id));
    
    if (!useCase) {
      return { success: false, error: 'Use case not found' };
    }
    
    // 获取关联的分类
    const categories = await db.select({
      id: useCaseCategories.id,
      name: useCaseCategories.name,
      nameZh: useCaseCategories.nameZh,
   
    }).from(useCaseCategories)
    .innerJoin(useCaseToCategoryLinks, eq(useCaseCategories.id, useCaseToCategoryLinks.categoryId))
    .where(eq(useCaseToCategoryLinks.useCaseId, id));
    
    return { success: true, data: { ...useCase, categories } };
  } catch (error) {
    console.error('Error fetching use case:', error);
    return { success: false, error: 'Failed to fetch use case' };
  }
}

export async function updateUseCase(id: string, data: Partial<z.infer<typeof useCaseSchema>>, categoryIds?: string[]) {
  try {
    // 检查标题是否已存在（排除当前案例）
    if (data.title || data.titleZh) {
      const titleCheck = [];
      if (data.title) {
        titleCheck.push(eq(useCases.title, data.title));
      }
      if (data.titleZh) {
        titleCheck.push(eq(useCases.titleZh, data.titleZh));
      }
      
      const existing = await db.select({ id: useCases.id, title: useCases.title, titleZh: useCases.titleZh })
        .from(useCases)
        .where(and(
          or(...titleCheck),
          not(eq(useCases.id, id))
        ))
        .limit(1);
      
      if (existing.length > 0) {
        const existingUseCase = existing[0];
        const conflictTitle = existingUseCase.title === data.title ? data.title : 
                            existingUseCase.titleZh === data.titleZh ? data.titleZh : '';
        return { success: false, error: `案例标题"${conflictTitle}"已存在，请使用其他标题` };
      }
    }
    
    const updateData = { ...data, updatedAt: new Date() };
    const [useCase] = await db.update(useCases)
      .set(updateData)
      .where(eq(useCases.id, id))
      .returning();
    
    if (!useCase) {
      return { success: false, error: 'Use case not found' };
    }
    
    // 更新分类关联
    if (categoryIds !== undefined) {
      // 删除现有关联
      await db.delete(useCaseToCategoryLinks).where(eq(useCaseToCategoryLinks.useCaseId, id));
      
      // 添加新关联
      if (categoryIds.length > 0) {
        const categoryLinks = categoryIds.map(categoryId => ({
          useCaseId: id,
          categoryId
        }));
        await db.insert(useCaseToCategoryLinks).values(categoryLinks);
      }
    }
    
    revalidatePath('/admin/use-cases');
    revalidatePath('/use-cases');
    return { success: true, data: useCase };
  } catch (error) {
    console.error('Error updating use case:', error);
    return { success: false, error: 'Failed to update use case' };
  }
}

export async function deleteUseCase(id: string) {
  try {
    const [deletedUseCase] = await db.delete(useCases)
      .where(eq(useCases.id, id))
      .returning();
    
    if (!deletedUseCase) {
      return { success: false, error: 'Use case not found' };
    }
    
    revalidatePath('/admin/use-cases');
    revalidatePath('/use-cases');
    return { success: true, data: deletedUseCase };
  } catch (error) {
    console.error('Error deleting use case:', error);
    return { success: false, error: 'Failed to delete use case' };
  }
}

export async function toggleUseCasePublishStatus(id: string) {
  try {
    const [useCase] = await db.select().from(useCases).where(eq(useCases.id, id));
    if (!useCase) {
      return { success: false, error: 'Use case not found' };
    }
    
    const updateData = {
      isPublished: !useCase.isPublished,
      publishedAt: !useCase.isPublished ? new Date() : null,
      updatedAt: new Date()
    };
    
    const [updatedUseCase] = await db.update(useCases)
      .set(updateData)
      .where(eq(useCases.id, id))
      .returning();
    
    revalidatePath('/admin/use-cases');
    revalidatePath('/use-cases');
    return { success: true, data: updatedUseCase };
  } catch (error) {
    console.error('Error toggling use case publish status:', error);
    return { success: false, error: 'Failed to toggle use case publish status' };
  }
}

export async function getPublishedUseCases(page = 1, limit = 10, categoryId?: string) {
  try {
    const offset = (page - 1) * limit;
    
    const conditions = [eq(useCases.isPublished, true)];
    
    if (categoryId) {
      const useCaseIds = await db.select({ useCaseId: useCaseToCategoryLinks.useCaseId })
        .from(useCaseToCategoryLinks)
        .where(eq(useCaseToCategoryLinks.categoryId, categoryId));
      
      if (useCaseIds.length > 0) {
        conditions.push(inArray(useCases.id, useCaseIds.map(item => item.useCaseId)));
      } else {
        return { success: true, data: [] };
      }
    }
    
    const useCaseList = await db.select({
      id: useCases.id,
      title: useCases.title,
      titleZh: useCases.titleZh,
      summary: useCases.summary,
      summaryZh: useCases.summaryZh,
      coverImageUrl: useCases.coverImageUrl,
      publishedAt: useCases.publishedAt,
    }).from(useCases)
    .where(and(...conditions))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(useCases.publishedAt));
    
    return { success: true, data: useCaseList };
  } catch (error) {
    console.error('Error fetching published use cases:', error);
    return { success: false, error: 'Failed to fetch published use cases' };
  }
}

export async function getUseCaseStats(): Promise<{ success: boolean; data?: { total: number; published: number; draft: number; byCategory: Record<string, number> }; error?: string }> {
  try {
    // 总数统计
    const totalResult = await db.select({ count: count() }).from(useCases);
    const total = Number(totalResult[0]?.count) || 0;

    // 已发布统计
    const publishedResult = await db.select({ count: count() }).from(useCases).where(eq(useCases.isPublished, true));
    const published = Number(publishedResult[0]?.count) || 0;

    // 草稿统计
    const draft = total - published;

    // 按分类统计
    const categoryStats = await db.select({
      categoryId: useCaseToCategoryLinks.categoryId,
      categoryName: useCaseCategories.name,
      count: count()
    })
    .from(useCaseToCategoryLinks)
    .leftJoin(useCaseCategories, eq(useCaseToCategoryLinks.categoryId, useCaseCategories.id))
    .leftJoin(useCases, eq(useCaseToCategoryLinks.useCaseId, useCases.id))
    .groupBy(useCaseToCategoryLinks.categoryId, useCaseCategories.name);

    const byCategory: Record<string, number> = {};
    categoryStats.forEach(stat => {
      const key = stat.categoryName || '未分类';
      byCategory[key] = Number(stat.count) || 0;
    });

    return {
      success: true,
      data: {
        total,
        published,
        draft,
        byCategory
      }
    };
  } catch (error) {
    console.error('Error fetching use case stats:', error);
    return { success: false, error: '获取案例统计失败' };
  }
}

// JSON数据导入Schema
const importUseCaseSchema = z.object({
  url: z.string().url().optional(),
  title: z.string().min(1),
  author: z.string().optional(),
  publish_date: z.string().optional(),
  publish_date_absolute: z.string().optional(),
  categories: z.array(z.object({
    name: z.string().min(1)
  })).optional(),
  workflow_json: z.string().optional(),
  readme: z.string().optional(),
  crawled_at: z.string().optional(),
  readme_zh: z.string().optional(),
  title_zh: z.string().optional(),
  publish_date_zh: z.string().optional(),
  workflow_json_zh: z.string().optional(),
});

// 批量导入案例
export async function importUseCasesFromJson(jsonData: string) {
  try {
    const data = JSON.parse(jsonData);
    const useCaseArray = Array.isArray(data) ? data : [data];
    
    const results = [];
    const skipped = [];
    const errors = [];
    
    for (const item of useCaseArray) {
      try {
        const validatedData = importUseCaseSchema.parse(item);
        
        // 检查标题是否已存在
        if (validatedData.title || validatedData.title_zh) {
          const titleCheck = [];
          if (validatedData.title) {
            titleCheck.push(eq(useCases.title, validatedData.title));
          }
          if (validatedData.title_zh) {
            titleCheck.push(eq(useCases.titleZh, validatedData.title_zh));
          }
          
          const existing = await db.select({ id: useCases.id, title: useCases.title, titleZh: useCases.titleZh })
            .from(useCases)
            .where(or(...titleCheck))
            .limit(1);
          
          if (existing.length > 0) {
            const existingUseCase = existing[0];
            const conflictTitle = existingUseCase.title === validatedData.title ? validatedData.title : 
                                existingUseCase.titleZh === validatedData.title_zh ? validatedData.title_zh : '';
            skipped.push({
              item: validatedData.title || validatedData.title_zh || 'Unknown',
              error: `标题"${conflictTitle}"已存在，跳过导入`
            });
            continue;
          }
        }
        
        // 检查URL是否已存在（如果有URL）
        if (validatedData.url) {
          const existingUrl = await db.select().from(useCases).where(eq(useCases.originalUrl, validatedData.url)).limit(1);
          if (existingUrl.length > 0) {
            skipped.push({
              item: validatedData.title || validatedData.title_zh || 'Unknown',
              error: `URL "${validatedData.url}" 已存在，跳过导入`
            });
            continue;
          }
        }
        
        // 处理分类
        const categoryIds: string[] = [];
        if (validatedData.categories && validatedData.categories.length > 0) {
          for (const categoryData of validatedData.categories) {
            // 查找或创建分类
            const category = await db.select()
              .from(useCaseCategories)
              .where(eq(useCaseCategories.name, categoryData.name))
              .limit(1);
            
            if (category.length === 0) {
              // 创建新分类
              const categorySlug = categoryData.name.toLowerCase()
                .replace(/[^a-z0-9\u4e00-\u9fff]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '') || `category-${Date.now()}`;
              
              const [newCategory] = await db.insert(useCaseCategories).values({
                name: categoryData.name
              }).returning();
              
              categoryIds.push(newCategory.id);
            } else {
              categoryIds.push(category[0].id);
            }
          }
        }
        
        // 创建案例
        const useCaseData = {
          title: validatedData.title,
          titleZh: validatedData.title_zh,
          summary: validatedData.readme ? validatedData.readme.substring(0, 500) : undefined,
          summaryZh: validatedData.readme_zh ? validatedData.readme_zh.substring(0, 500) : undefined,
          readme: validatedData.readme,
          readmeZh: validatedData.readme_zh,
          workflowJson: validatedData.workflow_json ? JSON.parse(validatedData.workflow_json) : undefined,
          workflowJsonZh: validatedData.workflow_json_zh ? JSON.parse(validatedData.workflow_json_zh) : undefined,
          n8nAuthor: validatedData.author,
          originalUrl: validatedData.url,
          publishDateDisplayEn: validatedData.publish_date,
          publishDateDisplayZh: validatedData.publish_date_zh,
          publishedAt: validatedData.publish_date_absolute ? new Date(validatedData.publish_date_absolute) : undefined,
          isPublished: false, // 默认不发布，需要手动审核
        };
        
        const [useCase] = await db.insert(useCases).values(useCaseData).returning();
        
        // 关联分类
        if (categoryIds.length > 0) {
          const categoryLinks = categoryIds.map(categoryId => ({
            useCaseId: useCase.id,
            categoryId
          }));
          await db.insert(useCaseToCategoryLinks).values(categoryLinks);
        }
        
        results.push(useCase);
      } catch (itemError) {
        console.error('Error importing item:', itemError);
        errors.push({
          item: item.title || item.title_zh || 'Unknown',
          error: itemError instanceof Error ? itemError.message : 'Unknown error'
        });
      }
    }
    
    revalidatePath('/admin/use-cases');
    revalidatePath('/use-cases');
    
    return {
      success: true,
      data: {
        imported: results.length,
        skipped: skipped.length,
        errors: [...skipped, ...errors],
        results
      }
    };
  } catch (error) {
    console.error('Error importing use cases from JSON:', error);
    return { success: false, error: 'JSON导入失败' };
  }
}

// 批量操作函数
export async function bulkPublishUseCases(useCaseIds: string[]) {
  try {
    if (useCaseIds.length === 0) {
      return { success: false, error: 'No use cases selected' };
    }

    const [updated] = await db.update(useCases)
      .set({ 
        isPublished: true, 
        publishedAt: new Date(),
        updatedAt: new Date() 
      })
      .where(inArray(useCases.id, useCaseIds))
      .returning({ id: useCases.id });

    revalidatePath('/admin/use-cases');
    revalidatePath('/use-cases');
    return { success: true, data: { updatedCount: useCaseIds.length } };
  } catch (error) {
    console.error('Error bulk publishing use cases:', error);
    return { success: false, error: 'Failed to bulk publish use cases' };
  }
}

export async function bulkUnpublishUseCases(useCaseIds: string[]) {
  try {
    if (useCaseIds.length === 0) {
      return { success: false, error: 'No use cases selected' };
    }

    await db.update(useCases)
      .set({ 
        isPublished: false, 
        publishedAt: null,
        updatedAt: new Date() 
      })
      .where(inArray(useCases.id, useCaseIds));

    revalidatePath('/admin/use-cases');
    revalidatePath('/use-cases');
    return { success: true, data: { updatedCount: useCaseIds.length } };
  } catch (error) {
    console.error('Error bulk unpublishing use cases:', error);
    return { success: false, error: 'Failed to bulk unpublish use cases' };
  }
}

export async function bulkDeleteUseCases(useCaseIds: string[]) {
  try {
    if (useCaseIds.length === 0) {
      return { success: false, error: 'No use cases selected' };
    }

    // 先删除关联的分类链接
    await db.delete(useCaseToCategoryLinks)
      .where(inArray(useCaseToCategoryLinks.useCaseId, useCaseIds));

    // 然后删除案例
    await db.delete(useCases)
      .where(inArray(useCases.id, useCaseIds));

    revalidatePath('/admin/use-cases');
    revalidatePath('/use-cases');
    return { success: true, data: { deletedCount: useCaseIds.length } };
  } catch (error) {
    console.error('Error bulk deleting use cases:', error);
    return { success: false, error: 'Failed to bulk delete use cases' };
  }
} 