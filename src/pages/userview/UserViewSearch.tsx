import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter, SlidersHorizontal } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { UserProductCard } from '../../components/userview/UserProductCard';
import { Grade } from '../../types';

export const UserViewSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products } = useAppStore();

  const [selectedGrade, setSelectedGrade] = useState<Grade | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');
  const [searchInput, setSearchInput] = useState(query);

  const filteredProducts = products.filter((p) => {
    const q = query.toLowerCase();
    const matchesQuery = !query || (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.brick.toLowerCase().includes(q) ||
      `grade ${p.grade}`.toLowerCase().includes(q) ||
      p.sizes.some((s) => s.toLowerCase().includes(q))
    );
    const matchesGrade = selectedGrade === 'ALL' || p.grade === selectedGrade;
    return matchesQuery && matchesGrade;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    return 0;
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchInput });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Search Header Bar */}
      <div className="border-b border-luxe-border pb-6 space-y-4">
        <span className="text-[10px] uppercase font-bold tracking-widest text-luxe-muted block">
          SEARCH RESULTS
        </span>
        <h1 className="font-playfair text-3xl font-bold text-luxe-text">
          {query ? `Results for "${query}"` : 'Search All Products'}
        </h1>

        <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
          <SearchIcon className="w-4 h-4 text-luxe-muted absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, category, grade, or size..."
            className="w-full bg-luxe-surface border border-luxe-border rounded-full pl-10 pr-24 py-2 text-xs text-luxe-text focus:border-luxe-dark focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1 px-4 py-1.5 rounded-full bg-luxe-dark text-luxe-bg text-xs font-semibold hover:bg-black transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxe-border pb-4 text-xs">
        <span className="font-mono text-luxe-muted font-bold">
          Found {filteredProducts.length} items
        </span>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-luxe-muted font-semibold">Grade Filter:</span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value as any)}
              className="bg-luxe-surface border border-luxe-border rounded px-3 py-1.5 text-luxe-text font-medium focus:outline-none"
            >
              <option value="ALL">All Grades (A-D)</option>
              <option value="A">Grade A (Premium)</option>
              <option value="B">Grade B (Core)</option>
              <option value="C">Grade C (Standard)</option>
              <option value="D">Grade D (Basic)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-luxe-muted font-semibold">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-luxe-surface border border-luxe-border rounded px-3 py-1.5 text-luxe-text font-medium focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-luxe-border rounded bg-luxe-surface/40 p-8 space-y-3">
          <p className="text-sm font-semibold text-luxe-text">No products match your search query</p>
          <p className="text-xs text-luxe-muted">Try searching with a different term or clear filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {filteredProducts.map((p) => (
            <UserProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
