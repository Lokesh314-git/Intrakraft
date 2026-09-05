import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { Grade } from '../../../types';
import { uploadProductImage } from '../../../services/storage';

export const CreateProductPage: React.FC = () => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<Grade>('A');
  const [brick, setBrick] = useState('Couture Apparel');
  const [category, setCategory] = useState('Dresses');
  const [neck, setNeck] = useState('V-Neck');
  const [sleeve, setSleeve] = useState('Short Sleeve');
  const [sizesInput, setSizesInput] = useState('S, M, L, XL');
  const [price, setPrice] = useState('450');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { addProduct, addToast } = useAppStore();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    let finalImageUrl = ' ';
    let imageId: string | undefined;

    try {
      if (selectedFile) {
        const uploadResult = await uploadProductImage(selectedFile);
        finalImageUrl = uploadResult.imageUrl;
        imageId = uploadResult.imageId;
      }

      const parsedSizes = sizesInput.split(',').map((s) => s.trim()).filter(Boolean);

      addProduct({
        id: `prod-custom-${Date.now()}`,
        name: name.trim(),
        grade,
        brick,
        category,
        neck,
        sleeve,
        sizes: parsedSizes.length > 0 ? parsedSizes : ['S', 'M', 'L'],
        price: parseFloat(price) || 390,
        imageUrl: finalImageUrl,
        imageId,
        description: description.trim() || `${category} crafted with fine materials.`,
        createdAt: new Date().toISOString(),
      });

      navigate('/admin/products');
    } catch (err: any) {
      addToast('Error', err.message || 'Failed to create product', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 border-b border-luxe-border pb-6">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 rounded border border-luxe-border bg-luxe-surface text-luxe-muted hover:text-luxe-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-luxe-muted block">
            PRODUCT CREATION
          </span>
          <h1 className="font-playfair text-3xl font-bold text-luxe-text">
            Create New Product
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="border border-luxe-border rounded bg-luxe-surface p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1.5">
              Product Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Silk Monogram Evening Gown"
              className="w-full bg-luxe-bg border border-luxe-border rounded px-3.5 py-2 text-xs text-luxe-text focus:border-luxe-dark focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1.5">
              Grade Classification
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value as Grade)}
              className="w-full bg-luxe-bg border border-luxe-border rounded px-3.5 py-2 text-xs text-luxe-text focus:border-luxe-dark focus:outline-none font-medium"
            >
              <option value="A">Grade A (Premium Tier)</option>
              <option value="B">Grade B (Core Tier)</option>
              <option value="C">Grade C (Volume Tier)</option>
              <option value="D">Grade D (Optional Tier)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1.5">
              Brick
            </label>
            <input
              type="text"
              required
              value={brick}
              onChange={(e) => setBrick(e.target.value)}
              placeholder="e.g. Couture Apparel"
              className="w-full bg-luxe-bg border border-luxe-border rounded px-3.5 py-2 text-xs text-luxe-text focus:border-luxe-dark focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1.5">
              Category
            </label>
            <input
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Dresses"
              className="w-full bg-luxe-bg border border-luxe-border rounded px-3.5 py-2 text-xs text-luxe-text focus:border-luxe-dark focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1.5">
              Available Sizes (Comma Separated)
            </label>
            <input
              type="text"
              required
              value={sizesInput}
              onChange={(e) => setSizesInput(e.target.value)}
              placeholder="e.g. 4-5Y, 5-6Y, 7-8Y or S, M, L, XL"
              className="w-full bg-luxe-bg border border-luxe-border rounded px-3.5 py-2 text-xs text-luxe-text focus:border-luxe-dark focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1.5">
              Price ($ USD)
            </label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="450"
              className="w-full bg-luxe-bg border border-luxe-border rounded px-3.5 py-2 text-xs text-luxe-text focus:border-luxe-dark focus:outline-none font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1.5">
            Product Image (Local Server Storage)
          </label>
          <div className="border border-dashed border-luxe-border rounded-lg p-4 text-center bg-luxe-bg relative">
            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="h-32 mx-auto rounded object-cover border border-luxe-border" />
            ) : (
              <div className="py-4 space-y-1">
                <UploadCloud className="w-6 h-6 text-luxe-muted mx-auto" />
                <p className="text-xs font-medium text-luxe-text">Click to upload product image file</p>
                <p className="text-[11px] text-luxe-muted">Direct local server storage integration</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-luxe-border">
          <button type="button" onClick={() => navigate('/admin/products')} className="px-4 py-2 text-xs font-medium text-luxe-muted hover:text-luxe-text">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{loading ? 'Saving...' : 'Save Product Record'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
