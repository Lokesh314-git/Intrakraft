import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { Grade } from '../../../types';

export const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addProduct, addToast } = useAppStore();
  const navigate = useNavigate();

  const existing = products.find((p) => p.id === id) || products[0];

  const [name, setName] = useState(existing?.name || '');
  const [grade, setGrade] = useState<Grade>(existing?.grade || 'A');
  const [brick, setBrick] = useState(existing?.brick || 'Apparel');
  const [category, setCategory] = useState(existing?.category || 'Dresses');
  const [sizes, setSizes] = useState(existing?.sizes.join(', ') || 'S, M, L');
  const [price, setPrice] = useState(existing?.price?.toString() || '450');
  const [isDirty, setIsDirty] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (existing) {
      existing.name = name;
      existing.grade = grade;
      existing.brick = brick;
      existing.category = category;
      existing.sizes = sizes.split(',').map((s) => s.trim()).filter(Boolean);
      existing.price = parseFloat(price) || 390;
    }
    addToast('Product Updated', `Saved changes to ${name}`, 'success');
    setIsDirty(false);
    navigate(`/admin/products/${existing?.id}`);
  };

  return (
    <div className="space-y-8 pb-12 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 border-b border-luxe-border pb-6">
        <button
          onClick={() => navigate(`/admin/products/${existing?.id}`)}
          className="p-2 rounded border border-luxe-border bg-luxe-surface text-luxe-muted hover:text-luxe-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-luxe-muted block">
            PRODUCT EDITOR
          </span>
          <h1 className="font-playfair text-3xl font-bold text-luxe-text">
            Edit {existing?.name}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSave} onChange={() => setIsDirty(true)} className="border border-luxe-border rounded bg-luxe-surface p-6 sm:p-8 space-y-6">
        {isDirty && (
          <div className="p-3 rounded bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Unsaved Changes Detected</span>
          </div>
        )}

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1.5">
              Product Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-luxe-bg border border-luxe-border rounded px-3.5 py-2 text-luxe-text focus:border-luxe-dark focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1.5">
              Grade
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value as Grade)}
              className="w-full bg-luxe-bg border border-luxe-border rounded px-3.5 py-2 text-luxe-text focus:border-luxe-dark focus:outline-none font-medium"
            >
              <option value="A">Grade A</option>
              <option value="B">Grade B</option>
              <option value="C">Grade C</option>
              <option value="D">Grade D</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1.5">
              Sizes (Comma Separated)
            </label>
            <input
              type="text"
              value={sizes}
              onChange={(e) => setSizes(e.target.value)}
              className="w-full bg-luxe-bg border border-luxe-border rounded px-3.5 py-2 text-luxe-text focus:border-luxe-dark focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-luxe-border">
          <button type="button" onClick={() => navigate('/admin/products')} className="px-4 py-2 text-xs font-medium text-luxe-muted hover:text-luxe-text">
            Cancel
          </button>
          <button type="submit" className="flex items-center gap-2 px-5 py-2 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors">
            <Save className="w-3.5 h-3.5" />
            <span>Save Product Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
