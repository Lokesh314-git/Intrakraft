import React from 'react';
import { Clock } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { UserProductCard } from '../../components/userview/UserProductCard';

export const UserViewRecentlyViewed: React.FC = () => {
  const { recentlyViewed, products } = useAppStore();

  const recentProducts = recentlyViewed
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-luxe-border pb-6 space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-widest text-luxe-muted block">
          BROWSING HISTORY
        </span>
        <h1 className="font-playfair text-3xl font-bold text-luxe-text">Recently Viewed Products</h1>
        <p className="text-xs text-luxe-muted">
          Quickly access products you recently inspected in your session.
        </p>
      </div>

      {recentProducts.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-luxe-border rounded bg-luxe-surface p-8 space-y-3">
          <Clock className="w-8 h-8 text-luxe-muted mx-auto" />
          <p className="text-xs text-luxe-muted">You haven't viewed any products yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
          {recentProducts.map((product) => (
            <UserProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
