import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, Package } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const displayImages = (images || []).filter(Boolean);

  if (displayImages.length === 0) {
    return (
      <div className="relative aspect-[3/4] w-full rounded border border-luxe-border bg-gradient-to-b from-luxe-surface to-luxe-bg/60 flex flex-col items-center justify-center text-center p-6 select-none">
        <div className="w-16 h-16 rounded-full bg-luxe-border/40 flex items-center justify-center mb-3">
          <Package className="w-8 h-8 text-luxe-muted" />
        </div>
        <p className="text-base font-serif font-semibold text-luxe-text">{productName}</p>
        <span className="text-xs text-luxe-muted mt-1 tracking-wider uppercase">No image preview available</span>
      </div>
    );
  }

  const currentImage = displayImages[selectedIndex] || displayImages[0];

  return (
    <div className="space-y-4">
      {/* Main Image Display with Hover Zoom */}
      <div className="relative aspect-[3/4] w-full rounded border border-luxe-border bg-luxe-surface overflow-hidden group">
        <img
          src={currentImage}
          alt={productName}
          className={`w-full h-full object-cover transition-transform duration-500 cursor-zoom-in ${
            isZoomed ? 'scale-150' : 'group-hover:scale-105'
          }`}
          onClick={() => setIsLightboxOpen(true)}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
        />

        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-3 right-3 p-2 rounded-full bg-luxe-surface/90 border border-luxe-border text-luxe-text hover:bg-luxe-dark hover:text-luxe-bg transition-all opacity-0 group-hover:opacity-100 shadow-subtle"
          title="Full Screen Lightbox"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {displayImages.length > 1 && (
          <>
            <button
              onClick={() => setSelectedIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-luxe-surface/80 text-luxe-text border border-luxe-border hover:bg-luxe-dark hover:text-luxe-bg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedIndex((prev) => (prev + 1) % displayImages.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-luxe-surface/80 text-luxe-text border border-luxe-border hover:bg-luxe-dark hover:text-luxe-bg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`w-16 h-20 rounded border overflow-hidden shrink-0 transition-all ${
                selectedIndex === idx ? 'border-luxe-dark ring-2 ring-luxe-dark' : 'border-luxe-border opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 text-white hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
          <img src={currentImage} alt={productName} className="max-w-full max-h-[90vh] object-contain rounded" />
        </div>
      )}
    </div>
  );
};
