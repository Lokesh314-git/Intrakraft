import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { Product } from '../types';
import { useAppStore } from '../store/useAppStore';

interface ImageUploadModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ product, isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [customUrl, setCustomUrl] = useState('');

  const { updateProductImage, addToast } = useAppStore();

  if (!isOpen || !product) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (previewUrl) {
      updateProductImage(product.id, previewUrl, `local_${Date.now()}`);
      addToast('Image Updated', `Updated product image for ${product.name}`, 'success');
      onClose();
    } else if (customUrl.trim()) {
      updateProductImage(product.id, customUrl.trim(), `custom_${Date.now()}`);
      addToast('Image Updated', `Updated image URL for ${product.name}`, 'success');
      onClose();
    } else {
      addToast('No Image Selected', 'Please choose an image file or enter an image URL.', 'warning');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxe-dark/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-luxe-surface border border-luxe-border rounded-lg p-6 sm:p-8 shadow-dropdown overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-luxe-muted hover:text-luxe-text transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-luxe-bg border border-luxe-border text-luxe-text">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-playfair text-xl font-bold text-luxe-text">
                Product Image Manager
              </h3>
              <p className="text-xs text-luxe-muted mt-0.5">
                Product: <span className="text-luxe-text font-semibold">{product.name}</span> (Grade {product.grade})
              </p>
            </div>
          </div>

          {/* Local Storage Mode Notice */}
          <div className="p-3 rounded bg-luxe-bg border border-luxe-border mb-5 flex items-center justify-between text-xs">
            <span className="text-luxe-text font-medium">Local Storage Image Engine</span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
              Local Persistent
            </span>
          </div>

          {/* Image Drop Zone */}
          <div className="space-y-4 text-xs">
            <div className="relative border-2 border-dashed border-luxe-border hover:border-luxe-dark rounded-lg p-6 text-center transition-colors bg-luxe-bg/50 group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              {previewUrl || product.imageUrl ? (
                <div className="relative max-h-48 mx-auto overflow-hidden rounded border border-luxe-border">
                  <img
                    src={previewUrl || product.imageUrl}
                    alt="Product Preview"
                    className="h-48 w-full object-cover rounded group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-luxe-dark/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-semibold text-luxe-bg bg-luxe-dark px-3 py-1.5 rounded border border-luxe-border">
                      Click to Select Local Image File
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <ImageIcon className="w-8 h-8 text-luxe-muted mx-auto" />
                  <p className="text-xs font-semibold text-luxe-text">
                    Select product image file from device
                  </p>
                  <p className="text-[11px] text-luxe-muted">
                    Supports PNG, JPG, WEBP (saved directly to local storage)
                  </p>
                </div>
              )}
            </div>

            <div className="text-center text-xs text-luxe-muted font-medium">OR</div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-luxe-muted mb-1.5">
                Image URL Direct Link
              </label>
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-luxe-bg border border-luxe-border rounded px-4 py-2 text-xs text-luxe-text placeholder-luxe-muted focus:border-luxe-dark focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-luxe-border">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded text-xs font-semibold text-luxe-muted hover:text-luxe-text transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              className="flex items-center gap-2 px-5 py-2 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Save Image Locally</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
