import { Catalogue, Product, SizeRatioConfig, CartItem, Review, UserProfile } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://intrakraft-backend.vercel.app/api';

/**
 * Returns authorization headers if token is present
 */
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('luxe_auth_token') || 'demo-token';
  return {
    Authorization: `Bearer ${token}`,
  };
};

const handleResponse = async (res: Response) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || data.error || `HTTP error ${res.status}`);
  }
  // If wrapped in standard ApiResponse { success: true, data: ... }
  return data.data !== undefined ? data.data : data;
};

export const api = {
  // Health Check
  checkHealth: async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },

  // ==========================================
  // AUTH
  // ==========================================
  verifyToken: async (idToken: string): Promise<UserProfile> => {
    const res = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    return handleResponse(res);
  },

  syncUser: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    const res = await fetch(`${API_BASE_URL}/auth/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    return handleResponse(res);
  },

  getMe: async (): Promise<UserProfile> => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(res);
  },

  // ==========================================
  // CATALOGUES
  // ==========================================
  getCatalogues: async (): Promise<Catalogue[]> => {
    const res = await fetch(`${API_BASE_URL}/catalogues`);
    return handleResponse(res);
  },

  uploadCatalogue: async (
    file: File,
    catalogueName?: string,
    uploadedBy?: string
  ): Promise<{ catalogue: Catalogue; products: Product[]; detectedSizes: string[] }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (catalogueName) formData.append('catalogueName', catalogueName);
    if (uploadedBy) formData.append('uploadedBy', uploadedBy);

    const res = await fetch(`${API_BASE_URL}/catalogues/upload`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
      body: formData,
    });
    return handleResponse(res);
  },

  deleteCatalogue: async (id: string): Promise<{ deletedProductsCount: number }> => {
    const res = await fetch(`${API_BASE_URL}/catalogues/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(res);
  },

  // ==========================================
  // PRODUCTS
  // ==========================================
  getProducts: async (filters?: {
    grade?: string;
    brick?: string;
    category?: string;
    search?: string;
  }): Promise<Product[]> => {
    const query = new URLSearchParams();
    if (filters?.grade && filters.grade !== 'ALL') query.set('grade', filters.grade);
    if (filters?.brick && filters.brick !== 'ALL') query.set('brick', filters.brick);
    if (filters?.category && filters.category !== 'ALL') query.set('category', filters.category);
    if (filters?.search) query.set('search', filters.search);

    const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`);
    return handleResponse(res);
  },

  getProductById: async (id: string): Promise<Product> => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    return handleResponse(res);
  },

  addProduct: async (product: Partial<Product>): Promise<Product> => {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(product),
    });
    return handleResponse(res);
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  },

  deleteProduct: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(res);
  },

  // ==========================================
  // LOCAL MEDIA UPLOAD
  // ==========================================
  uploadImage: async (
    file: File
  ): Promise<{ imageUrl: string; imageId: string; format: string; width?: number; height?: number }> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
      body: formData,
    });
    return handleResponse(res);
  },

  // ==========================================
  // RATIO ENGINE
  // ==========================================
  calculateRatio: async (payload: {
    grade?: string;
    attributeLevel?: string;
    groupKey?: string;
    sizeRatios: Record<string, number>;
    totalUnits?: number;
  }): Promise<{
    totalRatioSum: number;
    normalizedRatio: string;
    percentageDistribution: Record<string, number>;
    unitAllocation?: Record<string, number>;
    totalUnits?: number;
    sizes: string[];
    dominantSize?: string;
  }> => {
    const res = await fetch(`${API_BASE_URL}/ratios/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  getRatios: async (grade?: string): Promise<SizeRatioConfig[]> => {
    const url = grade && grade !== 'ALL' ? `${API_BASE_URL}/ratios?grade=${grade}` : `${API_BASE_URL}/ratios`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  addRatio: async (ratio: Omit<SizeRatioConfig, 'id' | 'createdAt'>): Promise<SizeRatioConfig> => {
    const res = await fetch(`${API_BASE_URL}/ratios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(ratio),
    });
    return handleResponse(res);
  },

  deleteRatio: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/ratios/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(res);
  },

  // ==========================================
  // REVIEWS
  // ==========================================
  getReviews: async (productId?: string): Promise<Review[]> => {
    const url = productId ? `${API_BASE_URL}/reviews?productId=${productId}` : `${API_BASE_URL}/reviews`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  addReview: async (review: Omit<Review, 'id' | 'createdAt' | 'helpfulCount'>): Promise<Review> => {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(review),
    });
    return handleResponse(res);
  },

  voteReviewHelpful: async (reviewId: string): Promise<Review> => {
    const res = await fetch(`${API_BASE_URL}/reviews/${reviewId}/helpful`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(res);
  },

  // ==========================================
  // WISHLIST
  // ==========================================
  getWishlist: async (): Promise<{ productIds: string[]; products: Product[] }> => {
    const res = await fetch(`${API_BASE_URL}/wishlist`);
    return handleResponse(res);
  },

  toggleWishlist: async (productId: string): Promise<{ isInWishlist: boolean; wishlist: string[] }> => {
    const res = await fetch(`${API_BASE_URL}/wishlist/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    return handleResponse(res);
  },

  removeFromWishlist: async (productId: string): Promise<string[]> => {
    const res = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // ==========================================
  // CART
  // ==========================================
  getCart: async (): Promise<CartItem[]> => {
    const res = await fetch(`${API_BASE_URL}/cart`);
    return handleResponse(res);
  },

  addToCart: async (productId: string, sizes: Record<string, number>): Promise<CartItem> => {
    const res = await fetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, sizes }),
    });
    return handleResponse(res);
  },

  updateCartQuantity: async (id: string, sizeKey: string, quantity: number): Promise<CartItem> => {
    const res = await fetch(`${API_BASE_URL}/cart/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sizeKey, quantity }),
    });
    return handleResponse(res);
  },

  removeFromCart: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/cart/items/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  clearCart: async (): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  syncCart: async (cart: CartItem[]): Promise<CartItem[]> => {
    const res = await fetch(`${API_BASE_URL}/cart/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart }),
    });
    return handleResponse(res);
  },
};
