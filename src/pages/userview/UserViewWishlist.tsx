import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/formatters';

export const UserViewWishlist: React.FC = () => {
  const { wishlist, products, removeFromWishlist, addToCart, settings } = useAppStore();
  const navigate = useNavigate();

  const wishlistedProducts = wishlist
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-luxe-border pb-6 space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-widest text-luxe-muted block">
          PERSONAL CURATION
        </span>
        <h1 className="font-playfair text-3xl font-bold text-luxe-text">My Saved Wishlist</h1>
        <p className="text-xs text-luxe-muted">
          Keep track of your favorite apparel items and move them directly into grade carts.
        </p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-luxe-border rounded bg-luxe-surface p-8 space-y-4">
          <Heart className="w-10 h-10 text-luxe-muted mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-luxe-text">Your Wishlist is Empty</h3>
            <p className="text-xs text-luxe-muted">Explore the catalogue and click the heart icon on any item to save it here.</p>
          </div>
          <button
            onClick={() => navigate('/admin/user-view/catalogue')}
            className="px-6 py-2.5 bg-luxe-dark text-luxe-bg rounded text-xs font-semibold hover:bg-black transition-colors"
          >
            Browse Product Catalogue
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistedProducts.map((product) => (
            <div key={product.id} className="border border-luxe-border rounded bg-luxe-surface p-4 flex gap-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-24 h-32 object-cover rounded border border-luxe-border shrink-0 cursor-pointer"
                onClick={() => navigate(`/admin/user-view/product/${product.id}`)}
              />

              <div className="flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-luxe-dark text-luxe-bg">
                    Grade {product.grade}
                  </span>
                  <h4
                    onClick={() => navigate(`/admin/user-view/product/${product.id}`)}
                    className="font-playfair font-bold text-sm text-luxe-text line-clamp-1 cursor-pointer hover:text-luxe-muted mt-1"
                  >
                    {product.name}
                  </h4>
                  <p className="text-[10px] text-luxe-muted uppercase">{product.category}</p>
                  <p className="font-mono font-bold text-xs text-luxe-text mt-1">
                    {formatCurrency(product.price || 390, settings?.general?.currency)}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-luxe-border/60">
                  <button
                    onClick={() => {
                      const firstSize = product.sizes[0] || 'S';
                      addToCart(product, { [firstSize]: 1 });
                    }}
                    className="flex-1 py-1.5 px-3 rounded text-[11px] font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors flex items-center justify-center gap-1"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Move to Cart</span>
                  </button>

                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="p-1.5 rounded border border-luxe-border text-luxe-muted hover:text-rose-600 hover:border-rose-300 transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
