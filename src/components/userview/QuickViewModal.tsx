import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { Product, Grade } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/formatters';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onViewDetails?: (productId: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onViewDetails,
}) => {
  const { settings, wishlist, toggleWishlist, addToCart, reviews } = useAppStore();
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});
  const [selectedImage, setSelectedImage] = useState<string>('');

  if (!isOpen || !product) return null;

  const currentImage = selectedImage || product.imageUrl || ' ';
  const isWishlisted = wishlist.includes(product.id);
  const productReviews = reviews.filter((r) => r.productId === product.id);
  const avgRating = productReviews.length > 0
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : '4.9';

  const handleSizeQuantityChange = (size: string, qty: number) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [size]: Math.max(0, qty),
    }));
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSizes);
    onClose();
  };

  const totalQty = Object.values(selectedSizes).reduce((acc, q) => acc + (q || 0), 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxe-dark/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-3xl bg-luxe-surface border border-luxe-border rounded-lg shadow-dropdown overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-luxe-surface/80 border border-luxe-border text-luxe-muted hover:text-luxe-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
            {/* Image Section */}
            <div className="md:col-span-6 bg-luxe-bg border-r border-luxe-border p-6 flex flex-col justify-between">
              <div className="aspect-[3/4] w-full rounded border border-luxe-border overflow-hidden bg-gradient-to-b from-luxe-surface to-luxe-bg flex items-center justify-center">
                {product.imageUrl ? (
                  <img src={currentImage || product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center select-none">
                    <span className="font-serif text-3xl font-bold tracking-widest text-luxe-border/80 mb-2">LUXÉ</span>
                    <span className="text-xs uppercase tracking-wider text-luxe-muted font-medium">{product.brick || product.category}</span>
                    <span className="text-[10px] text-luxe-muted/70 mt-1">No preview image</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.imageUrl && (
                <div className="flex gap-2 mt-4">
                  {[product.imageUrl].filter(Boolean).map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(url as string)}
                      className={`w-12 h-14 rounded border overflow-hidden ${currentImage === url ? 'border-luxe-dark ring-1 ring-luxe-dark' : 'border-luxe-border opacity-70'}`}
                    >
                      <img src={url as string} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-luxe-dark text-luxe-bg">
                    Grade {product.grade}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold font-mono">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{avgRating}</span>
                    <span className="text-luxe-muted font-normal">({productReviews.length || 12})</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-widest text-luxe-muted block">{product.category} • {product.brick}</span>
                  <h3 className="font-playfair text-xl font-bold text-luxe-text mt-0.5">{product.name}</h3>
                  <p className="font-mono font-bold text-lg text-luxe-text mt-1">
                    {formatCurrency(product.price || 390, settings?.general?.currency)}
                  </p>
                </div>

                <p className="text-xs text-luxe-muted leading-relaxed line-clamp-3">
                  {product.description || 'Premium couture piece engineered for fashion merchandisers. Grade-wise size breakdown available below.'}
                </p>

                {/* Size Selector */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-luxe-muted block">Select Quantities by Size</span>
                  <div className="grid grid-cols-3 gap-2">
                    {product.sizes.map((sz) => (
                      <div key={sz} className="p-1.5 border border-luxe-border rounded text-center bg-luxe-bg">
                        <span className="text-[10px] font-mono font-bold text-luxe-text block">{sz}</span>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <button
                            onClick={() => handleSizeQuantityChange(sz, (selectedSizes[sz] || 0) - 1)}
                            className="w-5 h-5 rounded bg-luxe-surface border border-luxe-border text-xs font-bold text-luxe-text hover:bg-luxe-dark hover:text-luxe-bg"
                          >
                            -
                          </button>
                          <span className="text-xs font-mono font-bold w-4">{selectedSizes[sz] || 0}</span>
                          <button
                            onClick={() => handleSizeQuantityChange(sz, (selectedSizes[sz] || 0) + 1)}
                            className="w-5 h-5 rounded bg-luxe-surface border border-luxe-border text-xs font-bold text-luxe-text hover:bg-luxe-dark hover:text-luxe-bg"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-luxe-border">
                <div className="flex gap-2">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-2.5 px-4 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart ({totalQty} units)</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-2.5 rounded border transition-colors ${isWishlisted
                        ? 'border-rose-300 bg-rose-50 text-rose-600'
                        : 'border-luxe-border text-luxe-muted hover:text-luxe-text'
                      }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {onViewDetails && (
                  <button
                    onClick={() => onViewDetails(product.id)}
                    className="w-full text-center py-2 text-xs font-semibold text-luxe-muted hover:text-luxe-text transition-colors flex items-center justify-center gap-1"
                  >
                    <span>View Full Product Page</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
