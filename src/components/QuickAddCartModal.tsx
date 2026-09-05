import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Product, Grade } from '../types';
import { useAppStore } from '../store/useAppStore';

interface QuickAddCartModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddCartModal: React.FC<QuickAddCartModalProps> = ({ product, isOpen, onClose }) => {
  const [sizeQuantities, setSizeQuantities] = useState<Record<string, number>>({});
  const { addToCart } = useAppStore();

  if (!isOpen || !product) return null;

  const handleQuantityChange = (size: string, delta: number) => {
    setSizeQuantities((prev) => {
      const current = prev[size] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [size]: next };
    });
  };

  const totalUnits = Object.values(sizeQuantities).reduce((a, b) => a + b, 0);

  const handleAddToCart = () => {
    addToCart(product, sizeQuantities);
    setSizeQuantities({});
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxe-dark/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="relative w-full max-w-lg bg-luxe-surface border border-luxe-border rounded-lg p-6 shadow-dropdown overflow-hidden space-y-6"
        >
          <button onClick={onClose} className="absolute top-5 right-5 text-luxe-muted hover:text-luxe-text p-1">
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4 border-b border-luxe-border pb-4">
            <div className="w-16 h-20 rounded overflow-hidden border border-luxe-border shrink-0 bg-luxe-bg">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-luxe-muted block">
                Grade {product.grade} • {product.category}
              </span>
              <h3 className="font-playfair text-lg font-bold text-luxe-text">{product.name}</h3>
              <p className="text-xs font-mono font-bold text-luxe-text mt-0.5">${product.price || 390}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold text-luxe-text">
              <span>Select Size Quantities</span>
              <span className="text-luxe-muted font-mono">Total Units: {totalUnits}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto">
              {product.sizes.map((sz) => {
                const qty = sizeQuantities[sz] || 0;
                return (
                  <div key={sz} className="flex items-center justify-between p-2.5 rounded border border-luxe-border bg-luxe-bg text-xs">
                    <span className="font-mono font-semibold">{sz}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleQuantityChange(sz, -1)} className="w-6 h-6 rounded bg-luxe-surface border border-luxe-border flex items-center justify-center text-luxe-text hover:bg-luxe-bg">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-4 text-center font-bold font-mono">{qty}</span>
                      <button onClick={() => handleQuantityChange(sz, 1)} className="w-6 h-6 rounded bg-luxe-dark text-luxe-bg flex items-center justify-center font-bold">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-luxe-border">
            <button onClick={onClose} className="px-4 py-2 text-xs font-medium text-luxe-muted">Cancel</button>
            <button
              onClick={handleAddToCart}
              disabled={totalUnits === 0}
              className="flex items-center gap-2 px-5 py-2 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black disabled:opacity-50 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add {totalUnits > 0 ? `${totalUnits} Units` : ''} to Grade {product.grade} Cart</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
