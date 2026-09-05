import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, Package, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ProductCard } from '../components/ProductCard';
import { Grade } from '../types';

export const Products: React.FC = () => {
  const { products, catalogues, detectedSizes, filters, setFilters } = useAppStore();

  const validCatalogueIds = useMemo(() => new Set(catalogues.map(c => c.id)), [catalogues]);
  const activeProducts = useMemo(() => {
    if (catalogues.length === 0) return [];
    return products.filter(p => p.catalogueId && validCatalogueIds.has(p.catalogueId));
  }, [catalogues, products, validCatalogueIds]);

  // Extract unique Bricks & Categories dynamically
  const uniqueBricks = useMemo(() => {
    return Array.from(new Set(activeProducts.map((p) => p.brick))).filter(Boolean);
  }, [activeProducts]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(activeProducts.map((p) => p.category))).filter(Boolean);
  }, [activeProducts]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    if (catalogues.length === 0) return [];
    return activeProducts.filter((p) => {
      // Grade filter
      if (filters.grade !== 'ALL' && p.grade !== filters.grade) return false;
      // Brick filter
      if (filters.brick !== 'ALL' && p.brick !== filters.brick) return false;
      // Category filter
      if (filters.category !== 'ALL' && p.category !== filters.category) return false;
      // Size filter
      if (filters.size !== 'ALL' && !p.sizes.includes(filters.size)) return false;
      // Search filter
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesGrade = p.grade.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        const matchesBrick = p.brick.toLowerCase().includes(query);
        if (!matchesName && !matchesGrade && !matchesCategory && !matchesBrick) return false;
      }
      return true;
    });
  }, [products, filters]);

  const gradeTabs: { id: Grade | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'All Grades' },
    { id: 'A', label: 'Grade A' },
    { id: 'B', label: 'Grade B' },
    { id: 'C', label: 'Grade C' },
    { id: 'D', label: 'Grade D' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Global Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-luxe-ivory">
            Luxury Apparel Directory
          </h1>
          <p className="text-xs text-luxe-muted mt-1">
            Displaying {filteredProducts.length} of {products.length} products across Grades A, B, C & D
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-luxe-gold absolute left-3.5 top-3" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            placeholder="Search Product Name, Grade, Category..."
            className="w-full bg-luxe-surface border border-luxe-borderGold/40 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-luxe-ivory placeholder-luxe-muted/60 focus:border-luxe-gold focus:outline-none transition-colors shadow-sm"
          />
        </div>
      </div>

      {/* Grade Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {gradeTabs.map((tab) => {
          const isActive = filters.grade === tab.id;
          const count = tab.id === 'ALL' ? products.length : products.filter(p => p.grade === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setFilters({ grade: tab.id })}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${isActive
                  ? 'bg-luxe-gold text-luxe-black shadow-gold-glow'
                  : 'bg-luxe-card border border-luxe-border text-luxe-muted hover:text-luxe-ivory hover:border-luxe-gold/40'
                }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-luxe-black/20 text-luxe-black' : 'bg-luxe-surface text-luxe-gold'
                }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Attribute Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-luxe-card border border-luxe-border/80">
        <div className="flex items-center gap-2 text-luxe-gold text-xs font-bold mr-2">
          <Filter className="w-4 h-4" />
          <span>Filters:</span>
        </div>

        {/* Brick Dropdown */}
        <select
          value={filters.brick}
          onChange={(e) => setFilters({ brick: e.target.value })}
          className="bg-luxe-surface border border-luxe-border rounded-xl px-3 py-2 text-xs text-luxe-ivory focus:border-luxe-gold focus:outline-none"
        >
          <option value="ALL">All Bricks</option>
          {uniqueBricks.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        {/* Category Dropdown */}
        <select
          value={filters.category}
          onChange={(e) => setFilters({ category: e.target.value })}
          className="bg-luxe-surface border border-luxe-border rounded-xl px-3 py-2 text-xs text-luxe-ivory focus:border-luxe-gold focus:outline-none"
        >
          <option value="ALL">All Categories</option>
          {uniqueCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Dynamic Size Dropdown */}
        <select
          value={filters.size}
          onChange={(e) => setFilters({ size: e.target.value })}
          className="bg-luxe-surface border border-luxe-border rounded-xl px-3 py-2 text-xs text-luxe-ivory focus:border-luxe-gold focus:outline-none"
        >
          <option value="ALL">All Detected Sizes</option>
          {detectedSizes.map((sz) => (
            <option key={sz} value={sz}>
              Size: {sz}
            </option>
          ))}
        </select>

        {/* Clear Filters */}
        {(filters.grade !== 'ALL' || filters.brick !== 'ALL' || filters.category !== 'ALL' || filters.size !== 'ALL' || filters.search) && (
          <button
            onClick={() => setFilters({ grade: 'ALL', brick: 'ALL', category: 'ALL', size: 'ALL', search: '' })}
            className="text-xs text-rose-400 hover:underline ml-auto font-medium"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-luxe-card border border-luxe-border/80 p-12 text-center space-y-3">
          <Package className="w-12 h-12 text-luxe-gold/50 mx-auto" />
          <h3 className="font-playfair text-xl font-bold text-luxe-ivory">
            No Products Found
          </h3>
          <p className="text-xs text-luxe-muted max-w-sm mx-auto">
            No items matched your filter criteria. Try clearing search keywords or selecting a different Grade.
          </p>
        </div>
      )}
    </div>
  );
};
