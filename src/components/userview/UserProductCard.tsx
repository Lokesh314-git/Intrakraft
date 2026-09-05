import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product, Grade } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/formatters';
import { QuickViewModal } from './QuickViewModal';

interface UserProductCardProps {
  product: Product;
}

export const UserProductCard: React.FC<UserProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { settings, wishlist, toggleWishlist, reviews } = useAppStore();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const productReviews = reviews.filter((r) => r.productId === product.id);
  const avgRating = productReviews.length > 0
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : '4.8';

  const getGradeBadge = (grade: Grade) => {
    switch (grade) {
      case 'A': return 'bg-luxe-dark text-luxe-bg';
      case 'B': return 'bg-luxe-surface border border-luxe-border text-luxe-text';
      case 'C': return 'bg-luxe-bg border border-luxe-border text-luxe-muted';
      case 'D': return 'bg-luxe-bg border border-luxe-border text-luxe-muted';
      default: return 'bg-luxe-surface text-luxe-text';
    }
  };

  return (
    <>
      <div className="group relative flex flex-col justify-between space-y-2.5">
        {/* Product Image Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-b from-luxe-surface to-luxe-bg border border-luxe-border rounded flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
              onClick={() => navigate(`/admin/user-view/product/${product.id}`)}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div 
              className="w-full h-full flex flex-col items-center justify-center p-4 text-center cursor-pointer select-none"
              onClick={() => navigate(`/admin/user-view/product/${product.id}`)}
            >
              <span className="font-serif text-2xl font-bold tracking-widest text-luxe-border/80 mb-1">LUXÉ</span>
              <span className="text-[10px] uppercase tracking-wider text-luxe-muted font-medium">{product.brick || product.category}</span>
            </div>
          )}

          {/* Top Grade Tag */}
          <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded ${getGradeBadge(product.grade)}`}>
              Grade {product.grade}
            </span>
          </div>

          {/* Top Right Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`absolute top-2 right-2 p-1.5 rounded-full bg-luxe-surface/90 border border-luxe-border transition-all z-10 ${isWishlisted ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-luxe-muted hover:text-luxe-text'
              }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Quick View Button on Hover */}
          <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="w-full py-1.5 rounded bg-luxe-surface/95 border border-luxe-border text-[11px] font-semibold text-luxe-text hover:bg-luxe-dark hover:text-luxe-bg transition-colors flex items-center justify-center gap-1.5 shadow-subtle"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-luxe-muted">
            <span className="uppercase tracking-wider font-medium truncate max-w-[65%]">{product.category}</span>
            <div className="flex items-center gap-0.5 font-mono text-[10px] text-amber-500 font-semibold">
              <Star className="w-3 h-3 fill-current" />
              <span>{avgRating}</span>
            </div>
          </div>

          <h3
            onClick={() => navigate(`/admin/user-view/product/${product.id}`)}
            className="font-playfair text-sm font-bold text-luxe-text line-clamp-1 hover:text-luxe-muted cursor-pointer transition-colors leading-tight"
          >
            {product.name}
          </h3>

          <div className="flex items-center justify-between pt-0.5">
            <span className="font-mono font-bold text-xs text-luxe-text">
              {formatCurrency(product.price || 390, settings?.general?.currency)}
            </span>
            <span className="text-[10px] font-mono text-luxe-muted">
              {product.sizes.length} sizes
            </span>
          </div>
        </div>
      </div>

      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onViewDetails={(id) => {
          setIsQuickViewOpen(false);
          navigate(`/admin/user-view/product/${id}`);
        }}
      />
    </>
  );
};
