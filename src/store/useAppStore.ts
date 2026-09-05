import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Product,
  Catalogue,
  CartItem,
  SizeRatioConfig,
  Grade,
  AttributeLevelType,
  CustomAttributeFlags,
  UserProfile,
  ActivityLog,
  ToastMessage,
  SystemSettings,
  Review,
  Question,
  UserNotification,
  SelectionRecord
} from '../types';
import { INITIAL_USER_PROFILE, getSavedActiveUser, saveActiveUser } from '../services/firebase';
import { api } from '../services/api';

const DEFAULT_SETTINGS: SystemSettings = {
  general: {
    platformName: 'LUXÉ Merchandise Console',
    currency: 'USD ($)',
    supportEmail: 'support@luxefashion.com',
    itemsPerPage: 12,
  },
  catalogue: {
    defaultGrade: 'A',
    enableAutoDynamicSize: true,
    autoCalculateRatios: true,
    strictIngestionValidation: false,
  },
  images: {
    cloudName: '',
    uploadPreset: '',
    autoWebp: true,
    maxFileSizeMb: 10,
  },
  appearance: {
    theme: 'luxe-classic',
    fontFamily: 'Playfair & Inter',
    compactMode: false,
    showAnimations: true,
  },
  security: {
    enableOAuth: true,
    enforceRBAC: true,
    sessionTimeout: '30 Minutes',
    require2FA: false,
  },
};

interface AppState {
  // User & Auth
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  logout: () => void;

  // System Settings
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;

  // Catalogues & Products
  catalogues: Catalogue[];
  products: Product[];
  detectedSizes: string[];
  uploadCatalogueData: (catalogue: Catalogue, products: Product[], detectedSizes: string[]) => void;
  addProduct: (product: Product) => void;
  updateProductImage: (productId: string, imageUrl: string, imageId?: string) => void;
  deleteProduct: (productId: string) => void;
  deleteCatalogue: (id: string) => void;

  // Cart Management
  cart: CartItem[];
  addToCart: (product: Product, selectedSizes: Record<string, number>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItemQuantity: (cartItemId: string, sizeKey: string, quantity: number) => void;
  clearCart: () => void;

  // Wishlist & User View State
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => void;

  recentlyViewed: string[];
  addRecentlyViewed: (productId: string) => void;

  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'helpfulCount'>) => void;
  voteHelpful: (reviewId: string) => void;

  questions: Question[];
  addQuestion: (productId: string, questionText: string) => void;

  userNotifications: UserNotification[];
  addUserNotification: (title: string, message: string, type?: UserNotification['type']) => void;
  markNotificationRead: (id: string) => void;

  selectionsHistory: SelectionRecord[];
  saveSelection: (title: string, items: CartItem[]) => void;

  // Grade-wise Size Ratio Engine
  ratios: SizeRatioConfig[];
  attributeLevel: AttributeLevelType;
  customAttributes: CustomAttributeFlags;
  setAttributeLevel: (level: AttributeLevelType) => void;
  setCustomAttributes: (flags: CustomAttributeFlags) => void;
  saveRatioConfig: (config: Omit<SizeRatioConfig, 'id' | 'createdAt'>) => void;
  deleteRatioConfig: (id: string) => void;

  // Filters & Search
  filters: {
    grade: Grade | 'ALL';
    brick: string;
    category: string;
    size: string;
    search: string;
  };
  setFilters: (filters: Partial<AppState['filters']>) => void;

  // System & Logs
  activityLogs: ActivityLog[];
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  addActivityLog: (action: string, details: string, type?: ActivityLog['type']) => void;
  resetToSampleData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: getSavedActiveUser(),
      setUser: (user) => {
        saveActiveUser(user);
        set({ user });
      },
      logout: () => {
        saveActiveUser(null);
        set({ user: null });
        get().addToast('Signed Out', 'You have been signed out of LUXÉ Merchandise Console.', 'info');
      },

      catalogues: [],
      products: [],
      detectedSizes: [],

      uploadCatalogueData: (newCatalogue, newProducts, newSizes) => {
        set((state) => {
          // Ensure all products are stamped with this catalogue's id
          const stampedProducts = newProducts.map((p) => ({
            ...p,
            catalogueId: newCatalogue.id,
          }));

          const updatedCatalogues = [newCatalogue, ...state.catalogues.filter((c) => c.id !== newCatalogue.id)];
          const validCatIds = new Set(updatedCatalogues.map((c) => c.id));

          // Only keep products belonging to valid catalogues
          const existingValidProducts = state.products.filter(
            (p) => p.catalogueId && p.catalogueId !== newCatalogue.id && validCatIds.has(p.catalogueId)
          );
          const updatedProducts = [...stampedProducts, ...existingValidProducts];
          const allSizes = Array.from(new Set([...state.detectedSizes, ...newSizes]));

          return {
            catalogues: updatedCatalogues,
            products: updatedProducts,
            detectedSizes: allSizes,
          };
        });

        get().addToast('Catalogue Uploaded', `Successfully imported ${newProducts.length} items from "${newCatalogue.name}".`, 'success');
        get().addActivityLog('Catalogue Upload', `Imported ${newProducts.length} items from ${newCatalogue.fileName}`, 'upload');
      },

      deleteCatalogue: async (id: string) => {
        const target = get().catalogues.find((c) => c.id === id);
        const remainingCatalogues = get().catalogues.filter((c) => c.id !== id);

        // If no catalogues remain in the system, clear all products, cart, wishlist, etc.
        if (remainingCatalogues.length === 0) {
          set({
            catalogues: [],
            products: [],
            detectedSizes: [],
            cart: [],
            wishlist: [],
            recentlyViewed: [],
          });
        } else {
          const validCatIds = new Set(remainingCatalogues.map((c) => c.id));
          set((state) => ({
            catalogues: remainingCatalogues,
            products: state.products.filter(
              (p) => p.catalogueId && p.catalogueId !== id && validCatIds.has(p.catalogueId)
            ),
            cart: state.cart.filter(
              (item) => item.product.catalogueId && item.product.catalogueId !== id && validCatIds.has(item.product.catalogueId)
            ),
            wishlist: state.wishlist.filter((prodId) => {
              const prod = state.products.find((p) => p.id === prodId);
              return prod && prod.catalogueId && prod.catalogueId !== id && validCatIds.has(prod.catalogueId);
            }),
            recentlyViewed: state.recentlyViewed.filter((prodId) => {
              const prod = state.products.find((p) => p.id === prodId);
              return prod && prod.catalogueId && prod.catalogueId !== id && validCatIds.has(prod.catalogueId);
            }),
          }));
        }

        try {
          await api.deleteCatalogue(id);
        } catch (e) {
          // Silent catch for offline mode
        }

        get().addToast(
          'Catalogue & Products Deleted',
          `Deleted "${target?.name || 'Catalogue'}" and removed all associated products.`,
          'info'
        );
        get().addActivityLog(
          'Catalogue Deletion',
          `Deleted catalogue "${target?.name || id}" and removed associated products`,
          'upload'
        );
      },

      addProduct: async (product) => {
        if (get().catalogues.length === 0) {
          get().addToast('No Catalogue Available', 'Please upload an Excel catalogue first before adding products.', 'warning');
          return;
        }

        const activeCatId = product.catalogueId || get().catalogues[0].id;
        const finalProd = { ...product, catalogueId: activeCatId };

        set((state) => ({
          products: [finalProd, ...state.products],
        }));

        try {
          await api.addProduct(finalProd);
        } catch (e) {
          // Silent catch for offline mode
        }

        get().addToast('Product Added', `Added ${product.name} (Grade ${product.grade}) to catalogue.`, 'success');
      },

      updateProductImage: (productId, imageUrl, imageId) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId ? { ...p, imageUrl, imageId } : p
          ),
        }));
        api.updateProduct(productId, { imageUrl, imageId }).catch(() => {});
        get().addToast('Image Updated', 'Product image successfully synced.', 'success');
        get().addActivityLog('Product Image', `Updated image for product ${productId}`, 'product');
      },

      deleteProduct: async (productId) => {
        const prod = get().products.find((p) => p.id === productId);
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
          cart: state.cart.filter((item) => item.productId !== productId),
          wishlist: state.wishlist.filter((id) => id !== productId),
          recentlyViewed: state.recentlyViewed.filter((id) => id !== productId),
        }));

        try {
          await api.deleteProduct(productId);
        } catch (e) {
          // Silent catch for offline mode
        }

        get().addToast('Product Removed', `Product "${prod?.name || 'Item'}" removed from catalogue.`, 'info');
        get().addActivityLog('Product Removed', `Deleted product ${prod?.name || productId}`, 'product');
      },

      // Cart
      cart: [] as CartItem[],

      addToCart: (product, selectedSizes) => {
        const totalQty = Object.values(selectedSizes).reduce((acc, q) => acc + (q || 0), 0);
        if (totalQty <= 0) {
          get().addToast('Select Sizes', 'Please select at least 1 size quantity to add to cart.', 'warning');
          return;
        }

        const cartItemId = `cart-${product.id}-${Date.now()}`;
        const newCartItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          product,
          grade: product.grade,
          sizes: selectedSizes,
          totalQuantity: totalQty,
          addedAt: new Date().toISOString(),
        };

        set((state) => ({
          cart: [newCartItem, ...state.cart],
        }));

        api.addToCart(product.id, selectedSizes).catch(() => {});

        get().addToast('Added to Cart', `Added ${totalQty} units of ${product.name} under Grade ${product.grade}.`, 'success');
        get().addActivityLog('Cart Addition', `Added ${totalQty} units of ${product.name} (Grade ${product.grade}) to cart`, 'cart');
      },

      removeFromCart: (cartItemId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== cartItemId),
        }));
        api.removeFromCart(cartItemId).catch(() => {});
        get().addToast('Item Removed', 'Removed item from cart.', 'info');
      },

      updateCartItemQuantity: (cartItemId, sizeKey, quantity) => {
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.id !== cartItemId) return item;
            const updatedSizes = { ...item.sizes, [sizeKey]: Math.max(0, quantity) };
            const newTotal = Object.values(updatedSizes).reduce((acc, q) => acc + q, 0);
            return {
              ...item,
              sizes: updatedSizes,
              totalQuantity: newTotal,
            };
          }),
        }));
        api.updateCartQuantity(cartItemId, sizeKey, quantity).catch(() => {});
      },

      clearCart: () => {
        set({ cart: [] });
        api.clearCart().catch(() => {});
        get().addToast('Cart Cleared', 'All items removed from cart.', 'info');
      },

      // Size Ratio Configurations
      ratios: [] as SizeRatioConfig[],
      attributeLevel: 'Category',
      customAttributes: {
        brick: true,
        category: true,
        neck: false,
        sleeve: false,
      },

      setAttributeLevel: (attributeLevel) => {
        set({ attributeLevel });
        get().addActivityLog('Ratio Configuration', `Changed attribute grouping level to ${attributeLevel}`, 'ratio');
      },

      setCustomAttributes: (customAttributes) => set({ customAttributes }),

      saveRatioConfig: (config) => {
        const values = Object.values(config.sizeRatios);
        const normalizedRatio = values.length > 0 ? values.join(' : ') : '1 : 1';

        const newRule: SizeRatioConfig = {
          ...config,
          id: `ratio-${Date.now()}`,
          normalizedRatio,
          createdAt: new Date().toISOString(),
        };

        set((state) => {
          const filtered = state.ratios.filter(
            (r) => !(r.grade === config.grade && r.groupKey === config.groupKey && r.attributeLevel === config.attributeLevel)
          );
          return { ratios: [newRule, ...filtered] };
        });

        get().addToast('Ratio Saved', `Saved size ratio for Grade ${config.grade} (${config.groupKey}).`, 'success');
        get().addActivityLog('Ratio Engine', `Configured ${normalizedRatio} ratio for Grade ${config.grade} [${config.groupKey}]`, 'ratio');
      },

      deleteRatioConfig: (id) => {
        set((state) => ({
          ratios: state.ratios.filter((r) => r.id !== id),
        }));
        get().addToast('Ratio Removed', 'Deleted ratio configuration rule.', 'info');
      },

      // Filters
      filters: {
        grade: 'ALL',
        brick: 'ALL',
        category: 'ALL',
        size: 'ALL',
        search: '',
      },

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },

      // System Toast & Activity Logs
      activityLogs: [
        {
          id: 'log-1',
          action: 'System Initialized',
          details: 'LUXÉ Merchandising Platform online. Loaded master catalogue AW2026.',
          user: 'System Engine',
          timestamp: '2026-09-04T10:30:00Z',
          type: 'upload',
        }
      ],
      toasts: [],

      addToast: (title, description, type = 'info') => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        set((state) => ({
          toasts: [...state.toasts, { id, title, description, type }],
        }));

        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }));
        }, 4000);
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      addActivityLog: (action, details, type = 'product') => {
        const user = get().user?.name || 'Alexander Sterling';
        const newLog: ActivityLog = {
          id: `log-${Date.now()}`,
          action,
          details,
          user,
          timestamp: new Date().toISOString(),
          type,
        };
        set((state) => ({
          activityLogs: [newLog, ...state.activityLogs].slice(0, 50),
        }));
      },

      // Settings
      settings: DEFAULT_SETTINGS,
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: {
            general: { ...state.settings.general, ...newSettings.general },
            catalogue: { ...state.settings.catalogue, ...newSettings.catalogue },
            images: { ...state.settings.images, ...newSettings.images },
            appearance: { ...state.settings.appearance, ...newSettings.appearance },
            security: { ...state.settings.security, ...newSettings.security },
          },
        }));
        get().addToast('Settings Updated', 'System preferences saved successfully.', 'success');
      },

      // Wishlist
      wishlist: [],
      addToWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.includes(productId) ? state.wishlist : [...state.wishlist, productId],
        }));
        api.toggleWishlist(productId).catch(() => {});
        get().addToast('Wishlist', 'Added item to your wishlist.', 'success');
      },
      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.filter((id) => id !== productId),
        }));
        api.removeFromWishlist(productId).catch(() => {});
        get().addToast('Wishlist', 'Removed item from your wishlist.', 'info');
      },
      toggleWishlist: (productId) => {
        const exists = get().wishlist.includes(productId);
        if (exists) {
          get().removeFromWishlist(productId);
        } else {
          get().addToWishlist(productId);
        }
      },

      // Recently Viewed
      recentlyViewed: [],
      addRecentlyViewed: (productId) => {
        set((state) => {
          const filtered = state.recentlyViewed.filter((id) => id !== productId);
          return { recentlyViewed: [productId, ...filtered].slice(0, 12) };
        });
      },

      // Customer Reviews
      reviews: [
        {
          id: 'rev-1',
          productId: 'prod-001',
          userId: 'usr-demo-1',
          userName: 'Lady Eleanor Vance',
          rating: 5,
          title: 'Exquisite Silk Texture & Perfect Fit',
          comment: 'The gold embroidery detail is breathtaking. Wore this to a gala and received countless compliments.',
          createdAt: '2026-09-02T14:20:00Z',
          helpfulCount: 14,
        },
        {
          id: 'rev-2',
          productId: 'prod-002',
          userId: 'usr-demo-2',
          userName: 'Charlotte Rose',
          rating: 5,
          title: 'Timeless Elegance',
          comment: 'Lightweight organza fabric with vibrant floral print. True to size.',
          createdAt: '2026-09-03T09:15:00Z',
          helpfulCount: 8,
        },
      ],
      addReview: (reviewData) => {
        const user = get().user;
        const newReview: Review = {
          ...reviewData,
          id: `rev-${Date.now()}`,
          userId: user?.uid || 'usr-guest',
          userName: user?.name || 'Anonymous Merchandiser',
          userPhoto: user?.avatarUrl,
          createdAt: new Date().toISOString(),
          helpfulCount: 0,
        };
        set((state) => ({ reviews: [newReview, ...state.reviews] }));
        api.addReview(reviewData).catch(() => {});
        get().addToast('Review Submitted', 'Thank you for sharing your feedback!', 'success');
      },
      voteHelpful: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
          ),
        }));
        api.voteReviewHelpful(reviewId).catch(() => {});
      },

      // Product Questions & Answers
      questions: [
        {
          id: 'q-1',
          productId: 'prod-001',
          userId: 'usr-demo-3',
          userName: 'Aveline Moreau',
          question: 'Is dry clean required for the silk crepe fabric?',
          answer: 'Yes, professional dry cleaning is recommended to preserve silk luster and hand embroidery.',
          createdAt: '2026-09-01T11:00:00Z',
        },
      ],
      addQuestion: (productId, questionText) => {
        const user = get().user;
        const newQuestion: Question = {
          id: `q-${Date.now()}`,
          productId,
          userId: user?.uid || 'usr-guest',
          userName: user?.name || 'Anonymous User',
          question: questionText,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ questions: [newQuestion, ...state.questions] }));
        get().addToast('Question Posted', 'Your question has been submitted.', 'success');
      },

      // Notifications
      userNotifications: [
        {
          id: 'notif-1',
          title: 'Welcome to LUXÉ Workspace',
          message: 'Explore master catalogues, size ratio engines, and wishlist curation.',
          type: 'info',
          createdAt: new Date().toISOString(),
          read: false,
        },
      ],
      addUserNotification: (title, message, type = 'info') => {
        const newNotif: UserNotification = {
          id: `notif-${Date.now()}`,
          title,
          message,
          type,
          createdAt: new Date().toISOString(),
          read: false,
        };
        set((state) => ({ userNotifications: [newNotif, ...state.userNotifications] }));
      },
      markNotificationRead: (id) => {
        set((state) => ({
          userNotifications: state.userNotifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      // Selection History
      selectionsHistory: [],
      saveSelection: (title, items) => {
        const totalQty = items.reduce((sum, item) => sum + item.totalQuantity, 0);
        const grades = Array.from(new Set(items.map((item) => item.grade)));
        const newRecord: SelectionRecord = {
          id: `LX-${Math.floor(1000 + Math.random() * 9000)}`,
          title,
          itemsCount: items.length,
          grades,
          totalQty,
          createdAt: new Date().toISOString(),
          items,
        };
        set((state) => ({ selectionsHistory: [newRecord, ...state.selectionsHistory] }));
        get().addToast('Selection Saved', `Saved ${items.length} items to Selection History.`, 'success');
      },

      resetToSampleData: () => {
        set({
          catalogues: [],
          products: [],
          detectedSizes: [],
          cart: [],
          ratios: [],
          wishlist: [],
          recentlyViewed: [],
          filters: { grade: 'ALL', brick: 'ALL', category: 'ALL', size: 'ALL', search: '' },
        });
        get().addToast('Data Cleared', 'All catalogue and product data cleared.', 'info');
      },
    }),
    {
      name: 'luxe_studio_v3_storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // If no catalogues exist in storage, purge all products, cart, and sizes
          if (!state.catalogues || state.catalogues.length === 0) {
            state.catalogues = [];
            state.products = [];
            state.cart = [];
            state.detectedSizes = [];
          } else {
            // Keep only products that belong to an existing catalogue
            const validCatalogueIds = new Set(state.catalogues.map((c) => c.id));
            state.products = (state.products || []).filter(
              (p) => p.catalogueId && validCatalogueIds.has(p.catalogueId)
            );
            state.cart = (state.cart || []).filter(
              (item) => item.product?.catalogueId && validCatalogueIds.has(item.product.catalogueId)
            );
          }
        }
      },
      partialize: (state) => ({
        settings: state.settings,
        catalogues: state.catalogues,
        products: state.products,
        detectedSizes: state.detectedSizes,
        cart: state.cart,
        ratios: state.ratios,
        wishlist: state.wishlist,
        recentlyViewed: state.recentlyViewed,
        reviews: state.reviews,
        questions: state.questions,
        userNotifications: state.userNotifications,
        selectionsHistory: state.selectionsHistory,
        attributeLevel: state.attributeLevel,
        customAttributes: state.customAttributes,
        activityLogs: state.activityLogs,
      }),
    }
  )
);

