import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, UploadCloud, Trash2 } from 'lucide-react';
import { Product, Grade } from '../types';
import { ImageUploadModal } from './ImageUploadModal';
import { QuickAddCartModal } from './QuickAddCartModal';

interface ProductCardProps {
  product: Product;
  onDelete?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const getGradeStyle = (grade: Grade) => {
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
      <div className="group relative flex flex-col justify-between space-y-2 sm:space-y-3">
        {/* Editorial Product Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-b from-luxe-surface to-luxe-bg border border-luxe-border rounded flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center select-none">
              <span className="font-serif text-2xl font-bold tracking-widest text-luxe-border/80 mb-1">LUXÉ</span>
              <span className="text-[10px] uppercase tracking-wider text-luxe-muted font-medium">{product.brick || product.category}</span>
            </div>
          )}

          {/* Top Grade Tag */}
          <div className="absolute top-2 left-2 flex items-center gap-1">
            <span className={`px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest rounded ${getGradeStyle(product.grade)}`}>
              Grade {product.grade}
            </span>
          </div>

          {/* Action Buttons (Local Image & Delete) */}
          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
            {onDelete && (
              <button
                onClick={() => onDelete(product.id)}
                className="p-1 sm:p-1.5 rounded bg-red-600 text-white hover:bg-red-700 transition-all shadow-md"
                title="Delete Product"
              >
                <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsImageModalOpen(true)}
            className="absolute bottom-2 right-2 p-1 sm:p-1.5 rounded bg-luxe-surface/90 border border-luxe-border text-luxe-text hover:bg-luxe-dark hover:text-luxe-bg transition-all opacity-0 group-hover:opacity-100"
            title="Upload image to Local Storage"
          >
            <UploadCloud className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>

        {/* Product Details */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-luxe-muted">
            <span className="uppercase tracking-wider font-medium truncate max-w-[65%]">{product.category}</span>
            <span className="font-mono font-semibold text-luxe-text text-xs sm:text-xs">${product.price || 390}</span>
          </div>

          <h3 className="font-playfair text-xs sm:text-base font-bold text-luxe-text line-clamp-1 group-hover:text-luxe-muted transition-colors leading-tight">
            {product.name}
          </h3>

          {/* Sizes */}
          <div className="flex flex-wrap gap-0.5 sm:gap-1 pt-0.5">
            {product.sizes.slice(0, 4).map((sz) => (
              <span key={sz} className="text-[9px] sm:text-[10px] font-mono text-luxe-muted px-1 sm:px-1.5 py-0.2 bg-luxe-surface border border-luxe-border/80 rounded">
                {sz}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-[9px] font-mono text-luxe-muted px-1 py-0.2">
                +{product.sizes.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Minimal Add to Cart Button */}
        <button
          onClick={() => setIsCartModalOpen(true)}
          className="w-full py-1.5 sm:py-2 px-2 sm:px-3 rounded text-[11px] sm:text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>Add to Cart</span>
        </button>
      </div>

      <ImageUploadModal product={product} isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} />
      <QuickAddCartModal product={product} isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} />
    </>
  );
};
