import { UseCaseType, UseCaseFiltersType } from '@/features/use-cases/types';

// Mock data for demonstration - in a real app, this would come from an API or database
let mockUseCases: UseCaseType[] = [];

export function setUseCases(useCases: UseCaseType[]) {
  mockUseCases = useCases;
}

export function getFilteredUseCases(filters: UseCaseFiltersType): UseCaseType[] {
  let filtered = [...mockUseCases];

  // Search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(useCase => 
      useCase.title.toLowerCase().includes(searchTerm) ||
      (useCase.summary && useCase.summary.toLowerCase().includes(searchTerm)) ||
      (useCase.n8nAuthor && useCase.n8nAuthor.toLowerCase().includes(searchTerm))
    );
  }

  // Category filter
  if (filters.category && filters.category.length > 0) {
    filtered = filtered.filter(useCase => 
      useCase.category && filters.category!.includes(useCase.category)
    );
  }

  // Difficulty filter
  if (filters.difficulty && filters.difficulty.length > 0) {
    filtered = filtered.filter(useCase => 
      useCase.difficulty && filters.difficulty!.includes(useCase.difficulty)
    );
  }

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(useCase => 
      useCase.tags && useCase.tags.length > 0 && 
      filters.tags!.some(tag => useCase.tags!.includes(tag))
    );
  }

  // Featured filter
  if (filters.isFeatured !== undefined) {
    filtered = filtered.filter(useCase => useCase.isFeatured === filters.isFeatured);
  }

  // Published filter
  if (filters.isPublished !== undefined) {
    filtered = filtered.filter(useCase => useCase.isPublished === filters.isPublished);
  }

  return filtered;
}

export function getPaginatedUseCases(useCases: UseCaseType[], page: number, limit: number) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = useCases.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: useCases.length,
      totalPages: Math.ceil(useCases.length / limit)
    }
  };
}

export function getAllCategories(): string[] {
  const categories = new Set<string>();
  mockUseCases.forEach(useCase => {
    if (useCase.category) {
      categories.add(useCase.category);
    }
  });
  return Array.from(categories);
}

export function getAllTags(): string[] {
  // For now, return empty array since tags aren't in the UseCase interface
  return [];
}

export function getAllAiTools(): string[] {
  // For now, return empty array since aiTools aren't in the UseCase interface
  return [];
}