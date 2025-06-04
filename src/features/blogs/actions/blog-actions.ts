'use server';

import { db } from '@/drizzle';
import { blogs, blogCategories } from '@/drizzle/schemas/blogs';
import { eq, desc, like, ilike, and, or, inArray, count, isNull, not } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { BlogType, BlogCategoryType, CreateBlogDataType, UpdateBlogDataType } from '../types';

// 博客分类相关操作
export async function getBlogCategories(): Promise<{ success: boolean; data?: BlogCategoryType[]; error?: string }> {
  try {
    const categories = await db.select().from(blogCategories).orderBy(desc(blogCategories.createdAt));
    return { success: true, data: categories };
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return { success: false, error: '获取博客分类失败' };
  }
}

export async function createBlogCategory(data: { 
  name: string; 
  nameZh?: string; 
  description?: string; 
  descriptionZh?: string; 
}): Promise<{ success: boolean; data?: BlogCategoryType; error?: string }> {
  try {
    const [category] = await db.insert(blogCategories).values({
      name: data.name,
      nameZh: data.nameZh,
      description: data.description,
      descriptionZh: data.descriptionZh,
    }).returning();

    revalidatePath('/backend/blogs');
    return { success: true, data: category };
  } catch (error) {
    console.error('Error creating blog category:', error);
    return { success: false, error: '创建博客分类失败' };
  }
}

export async function updateBlogCategory(id: string, data: { 
  name: string; 
  nameZh?: string; 
  description?: string; 
  descriptionZh?: string; 
}): Promise<{ success: boolean; data?: BlogCategoryType; error?: string }> {
  try {
    const [category] = await db.update(blogCategories)
      .set({
        name: data.name,
        nameZh: data.nameZh,
        description: data.description,
        descriptionZh: data.descriptionZh,
        updatedAt: new Date(),
      })
      .where(eq(blogCategories.id, id))
      .returning();

    if (!category) {
      return { success: false, error: '博客分类不存在' };
    }

    revalidatePath('/backend/blogs');
    return { success: true, data: category };
  } catch (error) {
    console.error('Error updating blog category:', error);
    return { success: false, error: '更新博客分类失败' };
  }
}

export async function deleteBlogCategory(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // 检查是否有博客使用此分类
    const blogsWithCategory = await db.select().from(blogs).where(eq(blogs.categoryId, id)).limit(1);
    if (blogsWithCategory.length > 0) {
      return { success: false, error: '该分类下还有博客，无法删除' };
    }

    await db.delete(blogCategories).where(eq(blogCategories.id, id));

    revalidatePath('/backend/blogs');
    return { success: true };
  } catch (error) {
    console.error('Error deleting blog category:', error);
    return { success: false, error: '删除博客分类失败' };
  }
}

// 博客相关操作
export async function getBlogs(params?: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  tags?: string[];
}): Promise<{ success: boolean; data?: { blogs: BlogType[]; total: number; totalPages: number }; error?: string }> {
  try {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = (page - 1) * limit;

    // 构建查询条件
    const conditions = [];

    if (params?.search) {
      conditions.push(
        or(
          ilike(blogs.title, `%${params.search}%`),
          ilike(blogs.titleZh, `%${params.search}%`),
          ilike(blogs.excerpt, `%${params.search}%`),
          ilike(blogs.excerptZh, `%${params.search}%`)
        )
      );
    }

    if (params?.categoryId && params.categoryId !== 'all') {
      if (params.categoryId === 'none') {
        conditions.push(isNull(blogs.categoryId));
      } else {
        conditions.push(eq(blogs.categoryId, params.categoryId));
      }
    }

    if (params?.tags && params.tags.length > 0) {
      // 简化标签查询
      conditions.push(
        or(
          ...params.tags.map(tag => 
            like(blogs.tags, `%"${tag}"%`)
          )
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 获取博客列表
    const blogList = await db.select({
      id: blogs.id,
      url: blogs.url,
      title: blogs.title,
      titleZh: blogs.titleZh,
      excerpt: blogs.excerpt,
      excerptZh: blogs.excerptZh,
      thumbnail: blogs.thumbnail,
      tags: blogs.tags,
      readme: blogs.readme,
      readmeZh: blogs.readmeZh,
      crawledAt: blogs.crawledAt,
      categoryId: blogs.categoryId,
      // 状态管理
      isPublished: blogs.isPublished,
      publishedAt: blogs.publishedAt,
      createdAt: blogs.createdAt,
      updatedAt: blogs.updatedAt,
      category: {
        id: blogCategories.id,
        name: blogCategories.name,
        nameZh: blogCategories.nameZh,
        description: blogCategories.description,
        descriptionZh: blogCategories.descriptionZh,
        createdAt: blogCategories.createdAt,
        updatedAt: blogCategories.updatedAt,
      }
    })
    .from(blogs)
    .leftJoin(blogCategories, eq(blogs.categoryId, blogCategories.id))
    .where(whereClause)
    .orderBy(desc(blogs.createdAt))
    .limit(limit)
    .offset(offset);

    // 获取总数 - 使用简单的count查询
    const totalResult = await db.select({ count: count() }).from(blogs).where(whereClause);
    const total = Number(totalResult[0]?.count) || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        blogs: blogList.map(blog => ({
          ...blog,
          tags: Array.isArray(blog.tags) ? blog.tags : [],
          category: blog.category?.id ? blog.category : null
        })),
        total,
        totalPages
      }
    };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return { success: false, error: '获取博客列表失败' };
  }
}

export async function getBlogById(id: string): Promise<{ success: boolean; data?: BlogType; error?: string }> {
  try {
    const result = await db.select({
      id: blogs.id,
      url: blogs.url,
      title: blogs.title,
      titleZh: blogs.titleZh,
      excerpt: blogs.excerpt,
      excerptZh: blogs.excerptZh,
      thumbnail: blogs.thumbnail,
      tags: blogs.tags,
      readme: blogs.readme,
      readmeZh: blogs.readmeZh,
      crawledAt: blogs.crawledAt,
      categoryId: blogs.categoryId,
      // 兼容旧字段
      summary: blogs.summary,
      content: blogs.content,
      coverImageUrl: blogs.coverImageUrl,
      author: blogs.author,
      estimatedReadTime: blogs.estimatedReadTime,
      // 状态管理
      isPublished: blogs.isPublished,
      publishedAt: blogs.publishedAt,
      createdAt: blogs.createdAt,
      updatedAt: blogs.updatedAt,
      category: {
        id: blogCategories.id,
        name: blogCategories.name,
        nameZh: blogCategories.nameZh,
        description: blogCategories.description,
        descriptionZh: blogCategories.descriptionZh,
        createdAt: blogCategories.createdAt,
        updatedAt: blogCategories.updatedAt,
      }
    })
    .from(blogs)
    .leftJoin(blogCategories, eq(blogs.categoryId, blogCategories.id))
    .where(eq(blogs.id, id))
    .limit(1);

    if (result.length === 0) {
      return { success: false, error: '博客不存在' };
    }

    const blog = result[0];
    return {
      success: true,
      data: {
        ...blog,
        tags: Array.isArray(blog.tags) ? blog.tags : [],
        category: blog.category?.id ? blog.category : null
      }
    };
  } catch (error) {
    console.error('Error fetching blog by id:', error);
    return { success: false, error: '获取博客详情失败' };
  }
}

export async function createBlog(data: CreateBlogDataType): Promise<{ success: boolean; data?: BlogType; error?: string }> {
  try {
    // 检查标题是否已存在
    if (data.title || data.titleZh) {
      const titleCheck = [];
      if (data.title) {
        titleCheck.push(eq(blogs.title, data.title));
      }
      if (data.titleZh) {
        titleCheck.push(eq(blogs.titleZh, data.titleZh));
      }
      
      const existing = await db.select({ id: blogs.id, title: blogs.title, titleZh: blogs.titleZh })
        .from(blogs)
        .where(or(...titleCheck))
        .limit(1);
      
      if (existing.length > 0) {
        const existingBlog = existing[0];
        const conflictTitle = existingBlog.title === data.title ? data.title : 
                            existingBlog.titleZh === data.titleZh ? data.titleZh : '';
        return { success: false, error: `标题"${conflictTitle}"已存在，请使用其他标题` };
      }
    }

    const [blog] = await db.insert(blogs).values({
      url: data.url,
      title: data.title,
      titleZh: data.titleZh,
      excerpt: data.excerpt,
      excerptZh: data.excerptZh,
      thumbnail: data.thumbnail,
      tags: data.tags || [],
      readme: data.readme,
      readmeZh: data.readmeZh,
      crawledAt: data.crawledAt,
      categoryId: data.categoryId,
    }).returning();

    revalidatePath('/backend/blogs');
    return { success: true, data: { ...blog, tags: Array.isArray(blog.tags) ? blog.tags : [] } };
  } catch (error) {
    console.error('Error creating blog:', error);
    return { success: false, error: '创建博客失败' };
  }
}

export async function updateBlog(id: string, data: Partial<CreateBlogDataType>): Promise<{ success: boolean; data?: BlogType; error?: string }> {
  try {
    // 检查标题是否已存在（排除当前博客）
    if (data.title || data.titleZh) {
      const titleCheck = [];
      if (data.title) {
        titleCheck.push(eq(blogs.title, data.title));
      }
      if (data.titleZh) {
        titleCheck.push(eq(blogs.titleZh, data.titleZh));
      }
      
      const existing = await db.select({ id: blogs.id, title: blogs.title, titleZh: blogs.titleZh })
        .from(blogs)
        .where(and(
          or(...titleCheck),
          not(eq(blogs.id, id))
        ))
        .limit(1);
      
      if (existing.length > 0) {
        const existingBlog = existing[0];
        const conflictTitle = existingBlog.title === data.title ? data.title : 
                            existingBlog.titleZh === data.titleZh ? data.titleZh : '';
        return { success: false, error: `标题"${conflictTitle}"已存在，请使用其他标题` };
      }
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (data.url !== undefined) updateData.url = data.url;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.titleZh !== undefined) updateData.titleZh = data.titleZh;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.excerptZh !== undefined) updateData.excerptZh = data.excerptZh;
    if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.readme !== undefined) updateData.readme = data.readme;
    if (data.readmeZh !== undefined) updateData.readmeZh = data.readmeZh;
    if (data.crawledAt !== undefined) updateData.crawledAt = data.crawledAt;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    
    // 支持发布状态更新
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;
    if (data.publishedAt !== undefined) updateData.publishedAt = data.publishedAt;

    const [blog] = await db.update(blogs)
      .set(updateData)
      .where(eq(blogs.id, id))
      .returning();

    if (!blog) {
      return { success: false, error: '博客不存在' };
    }

    revalidatePath('/backend/blogs');
    return { success: true, data: { ...blog, tags: Array.isArray(blog.tags) ? blog.tags : [] } };
  } catch (error) {
    console.error('Error updating blog:', error);
    return { success: false, error: '更新博客失败' };
  }
}

export async function deleteBlog(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await db.delete(blogs).where(eq(blogs.id, id)).returning();
    
    if (result.length === 0) {
      return { success: false, error: '博客不存在' };
    }

    revalidatePath('/backend/blogs');
    return { success: true };
  } catch (error) {
    console.error('Error deleting blog:', error);
    return { success: false, error: '删除博客失败' };
  }
}

export async function deleteBlogs(ids: string[]): Promise<{ success: boolean; error?: string }> {
  try {
    await db.delete(blogs).where(inArray(blogs.id, ids));

    revalidatePath('/backend/blogs');
    return { success: true };
  } catch (error) {
    console.error('Error deleting blogs:', error);
    return { success: false, error: '批量删除博客失败' };
  }
}

// JSON文件上传处理
export async function importBlogsFromJson(jsonData: any[]): Promise<{ success: boolean; data?: { imported: number; skipped: number; errors: string[] }; error?: string }> {
  try {
    const imported: any[] = [];
    const skipped: string[] = [];
    const errors: string[] = [];

    for (let i = 0; i < jsonData.length; i++) {
      const item = jsonData[i];
      
      try {
        // 验证必需字段
        if (!item.title && !item.titleZh) {
          errors.push(`第${i + 1}行: 缺少必需字段 title 或 titleZh`);
          continue;
        }

        // 检查标题是否已存在
        const titleCheck = [];
        if (item.title) {
          titleCheck.push(eq(blogs.title, item.title));
        }
        if (item.titleZh || item.title_zh) {
          titleCheck.push(eq(blogs.titleZh, item.titleZh || item.title_zh));
        }
        
        if (titleCheck.length > 0) {
          const existing = await db.select({ id: blogs.id, title: blogs.title, titleZh: blogs.titleZh })
            .from(blogs)
            .where(or(...titleCheck))
            .limit(1);
          
          if (existing.length > 0) {
            const existingBlog = existing[0];
            const conflictTitle = existingBlog.title === item.title ? item.title : 
                                existingBlog.titleZh === (item.titleZh || item.title_zh) ? (item.titleZh || item.title_zh) : '';
            skipped.push(`第${i + 1}行: 标题"${conflictTitle}"已存在，跳过导入`);
            continue;
          }
        }

        // 检查URL是否已存在（如果有URL）
        if (item.url) {
          const existingUrl = await db.select().from(blogs).where(eq(blogs.url, item.url)).limit(1);
          if (existingUrl.length > 0) {
            skipped.push(`第${i + 1}行: URL ${item.url} 已存在，跳过导入`);
            continue;
          }
        }

        // 处理标签
        let tags: string[] = [];
        if (item.tags) {
          if (Array.isArray(item.tags)) {
            tags = item.tags;
          } else if (typeof item.tags === 'string') {
            tags = item.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
          }
        }

        // 处理爬取时间
        let crawledAt: Date | undefined;
        if (item.crawled_at || item.crawledAt) {
          crawledAt = new Date(item.crawled_at || item.crawledAt);
        }

        // 创建博客
        const [blog] = await db.insert(blogs).values({
          url: item.url,
          title: item.title,
          titleZh: item.titleZh || item.title_zh,
          excerpt: item.excerpt,
          excerptZh: item.excerptZh || item.excerpt_zh,
          thumbnail: item.thumbnail,
          tags,
          readme: item.readme,
          readmeZh: item.readmeZh || item.readme_zh,
          crawledAt,
          categoryId: item.categoryId || item.category_id,
        }).returning();

        imported.push(blog);
      } catch (itemError) {
        console.error(`Error importing item ${i}:`, itemError);
        errors.push(`第${i + 1}行: 导入失败 - ${itemError}`);
      }
    }

    revalidatePath('/backend/blogs');
    return {
      success: true,
      data: {
        imported: imported.length,
        skipped: skipped.length,
        errors: [...skipped, ...errors]
      }
    };
  } catch (error) {
    console.error('Error importing blogs from JSON:', error);
    return { success: false, error: 'JSON导入失败' };
  }
}

// 获取博客统计信息
export async function getBlogStats(): Promise<{ success: boolean; data?: { total: number; byCategory: Record<string, number>; byMonth: Record<string, number> }; error?: string }> {
  try {
    // 总数统计
    const totalResult = await db.select({ count: count() }).from(blogs);
    const total = Number(totalResult[0]?.count) || 0;

    // 按分类统计 - 简化查询
    const categoryStats = await db.select({
      categoryId: blogs.categoryId,
      categoryName: blogCategories.name,
      count: count()
    })
    .from(blogs)
    .leftJoin(blogCategories, eq(blogs.categoryId, blogCategories.id))
    .groupBy(blogs.categoryId, blogCategories.name);

    const byCategory: Record<string, number> = {};
    categoryStats.forEach(stat => {
      const key = stat.categoryName || '未分类';
      byCategory[key] = Number(stat.count) || 0;
    });

    // 按月份统计（暂时返回空对象）
    const byMonth: Record<string, number> = {};

    return {
      success: true,
      data: {
        total,
        byCategory,
        byMonth
      }
    };
  } catch (error) {
    console.error('Error fetching blog stats:', error);
    return { success: false, error: '获取博客统计失败' };
  }
}