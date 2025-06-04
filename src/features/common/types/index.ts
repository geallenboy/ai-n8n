
export interface PaginationInfoType {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ActionResponseType<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 