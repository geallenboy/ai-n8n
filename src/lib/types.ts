// Common types used across the application

export interface UseCase {
  id: string;
  title: string;
  titleZh: string | null;
  n8nAuthor: string | null;
  originalUrl: string | null;
  publishedAt: Date | null;
  publishDateDisplayEn: string | null;
  publishDateDisplayZh: string | null;
  readme: string | null;
  readmeZh: string | null;
  workflowInterpretation: string | null;
  workflowInterpretationZh: string | null;
  workflowTutorial: string | null;
  workflowTutorialZh: string | null;
  workflowJson: any;
  workflowJsonZh: any;
  summary: string | null;
  summaryZh: string | null;
  coverImageUrl: string | null;
  curatorId: string | null;
  isPublished: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  category?: string | null;
  stats?: {
    views: number;
    favorites: number;
    downloads: number;
  };
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Blog {
  id: string;
  url: string | null;
  title: string;
  titleZh?: string | null;
  excerpt?: string | null;
  excerptZh?: string | null;
  thumbnail?: string | null;
  tags: string[];
  readme?: string | null;
  readmeZh?: string | null;
  crawledAt?: Date | null;
  categoryId?: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  category?: Category | null;
}

export interface BlogCategory {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  category: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentItem {
  id: string;
  title: string;
  summary?: string;
  slug: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Tutorial {
  id: string;
  title: string;
  shortDescription: string;
  slug: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  averageRating: number;
  estimatedTime: number;
  completions: number;
  sections: any[];
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}