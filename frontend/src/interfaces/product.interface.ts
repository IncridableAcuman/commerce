export interface ProductCategory {
  id: number;
  name: string;
  description?: string;
  productCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  title: string;
  content: string;
  price: number;
  imageUrl?: string;
  stock: number;
  rating: number;
  categoryId?: number;
  categoryName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  title: string;
  content: string;
  price: number;
  imageUrl?: string;
  stock?: number;
  categoryId?: number;
}

export interface CategoryRequest {
  name: string;
  description?: string;
}

export interface ProductFilterParams {
  categoryId?: number | null;
  search?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface PaginatedProducts {
  content: Product[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
