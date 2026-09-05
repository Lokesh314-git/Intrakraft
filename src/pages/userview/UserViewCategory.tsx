import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, SlidersHorizontal } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { UserProductCard } from '../../components/userview/UserProductCard';
import { Grade } from '../../types';

export const UserViewCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const decodedCategory = decodeURIComponent(category || '');
  const { products } = useAppStore();
  const navigate = useNavigate();

  const [selectedGrade, setSelectedGrade] = useState<Grade | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');

  const categoryProducts = products.filter((p) => {
    const matchesCategory = p.category.toLowerCase() === decodedCategory.toLowerCase();
    const matchesGrade = selectedGrade === 'ALL' || p.grade === selectedGrade;
    return matchesCategory && matchesGrade;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Category Hero Banner */}
      <div className="relative rounded overflow-hidden bg-luxe-dark text-luxe-bg p-8 sm:p-12 space-y-3">
        <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-luxe-bg text-luxe-dark inline-block">
          CATEGORY CURATION
        </span>
        <h1 className="font-playfair text-3xl sm:text-5xl font-bold">{decodedCategory}</h1>
        <p className="text-xs sm:text-sm text-luxe-bg/80 max-w-xl leading-relaxed">
          Explore curated {decodedCategory.toLowerCase()} styles ingested from master apparel catalogues with Grade A-D classification.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxe-border pb-4 text-xs">
        <span className="font-mono text-luxe-muted font-bold">
          Showing {categoryProducts.length} items in {decodedCategory}
        </span>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-luxe-muted font-semibold">Grade:</span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value as any)}
              className="bg-luxe-surface border border-luxe-border rounded px-3 py-1.5 text-luxe-text font-medium focus:outline-none"
            >
              <option value="ALL">All Grades (A-D)</option>
              <option value="A">Grade A (Premium)</option>
              <option value="B">Grade B (Core)</option>
              <option value="C">Grade C (Standard)</option>
              <option value="D">Grade D (Outlet)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-luxe-muted font-semibold">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-luxe-surface border border-luxe-border rounded px-3 py-1.5 text-luxe-text font-medium focus:outline-none"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {categoryProducts.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-luxe-border rounded bg-luxe-surface/40 p-8 space-y-3">
          <p className="text-sm font-semibold text-luxe-text">No items found under {decodedCategory}</p>
          <button
            onClick={() => navigate('/admin/user-view/catalogue')}
            className="px-4 py-2 bg-luxe-dark text-luxe-bg rounded text-xs font-semibold"
          >
            Browse Full Catalogue
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {categoryProducts.map((p) => (
            <UserProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
