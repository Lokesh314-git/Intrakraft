import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { initFirebaseAuthListener } from './services/firebase';
import { api } from './services/api';

// Layouts
import { AdminLayout } from './components/AdminLayout';
import { UserViewLayout } from './components/UserViewLayout';

// Public / Auth Pages
import { Login } from './pages/public/Login';
import { AuthCallback } from './pages/public/AuthCallback';
import { Forbidden } from './pages/public/Forbidden';
import { NotFound } from './pages/public/NotFound';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CatalogueLibrary } from './pages/admin/catalogues/CatalogueLibrary';
import { UploadCataloguePage } from './pages/admin/catalogues/UploadCataloguePage';
import { CatalogueDetailsPage } from './pages/admin/catalogues/CatalogueDetailsPage';

import { ProductCataloguePage } from './pages/admin/products/ProductCataloguePage';
import { CreateProductPage } from './pages/admin/products/CreateProductPage';
import { ProductDetailsPage } from './pages/admin/products/ProductDetailsPage';
import { EditProductPage } from './pages/admin/products/EditProductPage';

import { UserDirectoryPage } from './pages/admin/users/UserDirectoryPage';
import { UserProfilePage } from './pages/admin/users/UserProfilePage';

import { RatioManagementPage } from './pages/admin/ratios/RatioManagementPage';
import { RatioDetailsPage } from './pages/admin/ratios/RatioDetailsPage';
import { RatioHistoryPage } from './pages/admin/ratios/RatioHistoryPage';
import { RatioStudio } from './pages/RatioStudio';

// User View Pages
import { UserViewDashboard } from './pages/userview/UserViewDashboard';
import { UserViewCatalogue } from './pages/userview/UserViewCatalogue';
import { UserViewProductDetails } from './pages/userview/UserViewProductDetails';
import { UserViewCart } from './pages/userview/UserViewCart';
import { UserViewRatioStudio } from './pages/userview/UserViewRatioStudio';
import { UserViewCreateRatio } from './pages/userview/UserViewCreateRatio';
import { UserViewRatioDetails } from './pages/userview/UserViewRatioDetails';
import { UserViewSavedRatios } from './pages/userview/UserViewSavedRatios';
import { UserViewProfile } from './pages/userview/UserViewProfile';
import { UserViewSearch } from './pages/userview/UserViewSearch';
import { UserViewCategory } from './pages/userview/UserViewCategory';
import { UserViewCollections } from './pages/userview/UserViewCollections';
import { UserViewWishlist } from './pages/userview/UserViewWishlist';
import { UserViewReviews } from './pages/userview/UserViewReviews';
import { UserViewQuestions } from './pages/userview/UserViewQuestions';
import { UserViewRecentlyViewed } from './pages/userview/UserViewRecentlyViewed';
import { UserViewNotifications } from './pages/userview/UserViewNotifications';
import { UserViewOrders } from './pages/userview/UserViewOrders';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAppStore();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  const { setUser } = useAppStore();

  useEffect(() => {
    const unsubscribe = initFirebaseAuthListener((user) => {
      setUser(user);
    });

    // Synchronize catalogues and products with backend store
    api.getCatalogues()
      .then(async (cats) => {
        if (!cats || cats.length === 0) {
          // If no catalogues exist in backend, enforce 0 catalogues and 0 products
          useAppStore.setState({
            catalogues: [],
            products: [],
            cart: [],
            detectedSizes: [],
          });
        } else {
          try {
            const allProducts = await api.getProducts();
            const validCatIds = new Set(cats.map((c) => c.id));
            const validProducts = (allProducts || []).filter(
              (p) => p.catalogueId && validCatIds.has(p.catalogueId)
            );
            const sizes: string[] = Array.from(new Set(validProducts.flatMap((p) => p.sizes || [])));
            useAppStore.setState({
              catalogues: cats,
              products: validProducts,
              detectedSizes: sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL'],
            });
          } catch {
            useAppStore.setState({ catalogues: cats });
          }
        }
      })
      .catch(() => {
        // In offline mode, check existing local store state
        const currentCatalogues = useAppStore.getState().catalogues || [];
        if (currentCatalogues.length === 0) {
          useAppStore.setState({ products: [], cart: [], detectedSizes: [] });
        }
      });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public & Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/403" element={<Forbidden />} />
        <Route path="/404" element={<NotFound />} />

        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Admin Application Routes (/admin/*) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />

          {/* Catalogue Pages */}
          <Route path="catalogues" element={<CatalogueLibrary />} />
          <Route path="catalogues/upload" element={<UploadCataloguePage />} />
          <Route path="catalogues/:id" element={<CatalogueDetailsPage />} />

          {/* Product Pages */}
          <Route path="products" element={<ProductCataloguePage />} />
          <Route path="products/new" element={<CreateProductPage />} />
          <Route path="products/:id" element={<ProductDetailsPage />} />
          <Route path="products/:id/edit" element={<EditProductPage />} />

          {/* User Management Pages */}
          <Route path="users" element={<UserDirectoryPage />} />
          <Route path="users/:id" element={<UserProfilePage />} />

          {/* Ratio Management Pages */}
          <Route path="ratios" element={<RatioManagementPage />} />
          <Route path="ratios/studio" element={<RatioStudio />} />
          <Route path="ratios/:id" element={<RatioDetailsPage />} />
          <Route path="ratios/:id/history" element={<RatioHistoryPage />} />

          {/* User View Embedded inside Admin (/admin/user-view/*) */}
          <Route path="user-view" element={<UserViewLayout />}>
            <Route index element={<UserViewDashboard />} />
            <Route path="catalogue" element={<UserViewCatalogue />} />
            <Route path="search" element={<UserViewSearch />} />
            <Route path="category/:category" element={<UserViewCategory />} />
            <Route path="collections/:collection" element={<UserViewCollections />} />
            <Route path="product/:id" element={<UserViewProductDetails />} />
            <Route path="wishlist" element={<UserViewWishlist />} />
            <Route path="cart" element={<UserViewCart />} />
            <Route path="ratios" element={<RatioStudio />} />
            <Route path="ratios/new" element={<UserViewCreateRatio />} />
            <Route path="ratios/:id" element={<UserViewRatioDetails />} />
            <Route path="saved-ratios" element={<UserViewSavedRatios />} />
            <Route path="reviews" element={<UserViewReviews />} />
            <Route path="questions" element={<UserViewQuestions />} />
            <Route path="recently-viewed" element={<UserViewRecentlyViewed />} />
            <Route path="notifications" element={<UserViewNotifications />} />
            <Route path="orders" element={<UserViewOrders />} />
            <Route path="profile" element={<UserViewProfile />} />
          </Route>
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
