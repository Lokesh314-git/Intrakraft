export type Grade = 'A' | 'B' | 'C' | 'D';

export interface Product {
  id: string;
  name: string;
  grade: Grade;
  brick: string;
  category: string;
  neck?: string;
  sleeve?: string;
  sizes: string[];
  imageUrl?: string;
  imageId?: string;
  price?: number;
  description?: string;
  createdAt: string;
  catalogueId?: string;
}

export interface Catalogue {
  id: string;
  name: string;
  fileName: string;
  uploadedBy: string;
  uploadDate: string;
  totalProducts: number;
  gradesCount: Record<Grade, number>;
  detectedSizes: string[];
  status: 'Processing' | 'Completed' | 'Failed';
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  grade: Grade;
  sizes: Record<string, number>; // e.g. { "4-5Y": 10, "5-6Y": 20 }
  totalQuantity: number;
  addedAt: string;
}

export type AttributeLevelType = 
  | 'Brick' 
  | 'Category' 
  | 'Brick + Category' 
  | 'Brick + Neck' 
  | 'Brick + Sleeve' 
  | 'Custom Combination';

export interface CustomAttributeFlags {
  brick: boolean;
  category: boolean;
  neck: boolean;
  sleeve: boolean;
}

export interface SizeRatioConfig {
  id: string;
  userId: string;
  grade: Grade;
  attributeLevel: AttributeLevelType;
  groupKey: string; // e.g. "Dresses", "Apparel > Tops", "Apparel (V-Neck)"
  sizeRatios: Record<string, number>; // e.g. { "4-5Y": 1, "5-6Y": 2, "7-8Y": 1 }
  normalizedRatio: string; // "1 : 2 : 1"
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  company: string;
  role: 'Merchandising Lead' | 'Product Merchandiser' | 'Buyer' | 'Admin';
  avatarUrl?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  user: string;
  timestamp: string;
  type: 'upload' | 'cart' | 'ratio' | 'product' | 'auth';
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface SystemSettings {
  general: {
    platformName: string;
    currency: 'USD ($)' | 'EUR (€)' | 'GBP (£)' | 'INR (₹)';
    supportEmail: string;
    itemsPerPage: number;
  };
  catalogue: {
    defaultGrade: Grade;
    enableAutoDynamicSize: boolean;
    autoCalculateRatios: boolean;
    strictIngestionValidation: boolean;
  };
  images: {
    cloudName: string;
    uploadPreset: string;
    autoWebp: boolean;
    maxFileSizeMb: number;
  };
  appearance: {
    theme: 'luxe-classic' | 'obsidian-gold' | 'midnight-slate' | 'rose-silk';
    fontFamily: 'Playfair & Inter' | 'Cinzel & Roboto' | 'Plus Jakarta Sans';
    compactMode: boolean;
    showAnimations: boolean;
  };
  security: {
    enableOAuth: boolean;
    enforceRBAC: boolean;
    sessionTimeout: string;
    require2FA: boolean;
    firebaseApiKey?: string;
    firebaseAuthDomain?: string;
  };
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  title: string;
  comment: string;
  imageUrls?: string[];
  createdAt: string;
  helpfulCount: number;
}

export interface Question {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  question: string;
  answer?: string;
  createdAt: string;
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'ratio' | 'wishlist';
  createdAt: string;
  read: boolean;
}

export interface SelectionRecord {
  id: string;
  title: string;
  itemsCount: number;
  grades: Grade[];
  totalQty: number;
  createdAt: string;
  items: CartItem[];
}

