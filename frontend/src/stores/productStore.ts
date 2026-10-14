import { create } from "zustand";
import api from "../api/axiosInstance";
import type { 
  Product, 
  ProductCategory, 
  ProductRequest, 
  PaginatedProducts, 
  ProductFilterParams 
} from "../interfaces/product.interface";

interface ProductState {
  products: Product[];
  categories: ProductCategory[];
  selectedCategory: number | null;
  searchQuery: string;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  minPrice: number | null;
  maxPrice: number | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  loading: boolean;
  categoriesLoading: boolean;
  actionLoading: boolean;
  error: string | null;

  // Actions
  fetchProducts: (params?: Partial<ProductFilterParams>) => Promise<void>;
  fetchCategories: () => Promise<void>;
  setSelectedCategory: (categoryId: number | null) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: string, sortDir?: 'asc' | 'desc') => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  setPage: (page: number) => void;
  getProductById: (id: number) => Promise<Product | null>;
  createProduct: (data: ProductRequest) => Promise<Product>;
  updateProduct: (id: number, data: ProductRequest) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;
  uploadProductImage: (file: File) => Promise<{ fileName: string; imageUrl: string }>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  selectedCategory: null,
  searchQuery: "",
  sortBy: "createdAt",
  sortDir: "desc",
  minPrice: null,
  maxPrice: null,
  currentPage: 0,
  totalPages: 1,
  totalElements: 0,
  pageSize: 12,
  loading: false,
  categoriesLoading: false,
  actionLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ categoriesLoading: true });
    try {
      const response = await api.get<ProductCategory[]>("/products/categories");
      set({ categories: response.data, categoriesLoading: false });
    } catch (err: any) {
      console.error("Kategoriyalarni yuklashda xatolik:", err);
      set({ categoriesLoading: false });
    }
  },

  fetchProducts: async (customParams = {}) => {
    const { 
      selectedCategory, 
      searchQuery, 
      sortBy, 
      sortDir, 
      minPrice, 
      maxPrice, 
      currentPage, 
      pageSize 
    } = get();

    const categoryId = customParams.categoryId !== undefined ? customParams.categoryId : selectedCategory;
    const search = customParams.search !== undefined ? customParams.search : searchQuery;
    const sort = customParams.sortBy || sortBy;
    const dir = customParams.sortDir || sortDir;
    const min = customParams.minPrice !== undefined ? customParams.minPrice : minPrice;
    const max = customParams.maxPrice !== undefined ? customParams.maxPrice : maxPrice;
    const page = customParams.page !== undefined ? customParams.page : currentPage;
    const size = customParams.size !== undefined ? customParams.size : pageSize;

    set({ loading: true, error: null });

    try {
      const params: Record<string, any> = {
        page,
        size,
        sortBy: sort,
        sortDir: dir,
      };

      if (categoryId) params.categoryId = categoryId;
      if (search && search.trim()) params.search = search.trim();
      if (min !== null && min !== undefined) params.minPrice = min;
      if (max !== null && max !== undefined) params.maxPrice = max;

      const response = await api.get<PaginatedProducts>("/products", { params });

      set({
        products: response.data.content,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
        currentPage: response.data.number,
        loading: false,
      });
    } catch (err: any) {
      console.error("Mahsulotlarni yuklashda xatolik:", err);
      set({ 
        error: err.response?.data?.message || "Mahsulotlarni yuklashda xatolik yuz berdi", 
        loading: false 
      });
    }
  },

  setSelectedCategory: (categoryId) => {
    set({ selectedCategory: categoryId, currentPage: 0 });
    get().fetchProducts({ categoryId, page: 0 });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 0 });
    get().fetchProducts({ search: query, page: 0 });
  },

  setSortBy: (sortBy, sortDir = "desc") => {
    set({ sortBy, sortDir, currentPage: 0 });
    get().fetchProducts({ sortBy, sortDir, page: 0 });
  },

  setPriceRange: (min, max) => {
    set({ minPrice: min, maxPrice: max, currentPage: 0 });
    get().fetchProducts({ minPrice: min, maxPrice: max, page: 0 });
  },

  setPage: (page) => {
    set({ currentPage: page });
    get().fetchProducts({ page });
  },

  getProductById: async (id: number) => {
    try {
      const response = await api.get<Product>(`/products/${id}`);
      return response.data;
    } catch (err: any) {
      console.error("Mahsulot ma'lumotini olishda xatolik:", err);
      return null;
    }
  },

  createProduct: async (data: ProductRequest) => {
    set({ actionLoading: true });
    try {
      const response = await api.post<Product>("/products", data);
      set({ actionLoading: false });
      // Ro'yxatni yangilaymiz
      get().fetchProducts();
      get().fetchCategories();
      return response.data;
    } catch (err: any) {
      set({ actionLoading: false });
      throw err;
    }
  },

  updateProduct: async (id: number, data: ProductRequest) => {
    set({ actionLoading: true });
    try {
      const response = await api.put<Product>(`/products/${id}`, data);
      set({ actionLoading: false });
      get().fetchProducts();
      return response.data;
    } catch (err: any) {
      set({ actionLoading: false });
      throw err;
    }
  },

  deleteProduct: async (id: number) => {
    set({ actionLoading: true });
    try {
      await api.delete(`/products/${id}`);
      set({ actionLoading: false });
      get().fetchProducts();
      get().fetchCategories();
    } catch (err: any) {
      set({ actionLoading: false });
      throw err;
    }
  },

  uploadProductImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post<{ fileName: string; imageUrl: string }>("/products/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
}));
