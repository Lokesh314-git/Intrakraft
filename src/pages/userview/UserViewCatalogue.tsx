import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ProductCard } from '../../components/ProductCard';
import { Grade } from '../../types';

export const UserViewCatalogue: React.FC = () => {
  const { products, catalogues, detectedSizes } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  const validCatalogueIds = useMemo(() => new Set(catalogues.map(c => c.id)), [catalogues]);
  const activeProducts = useMemo(() => {
    if (catalogues.length === 0) return [];
    return products.filter(p => p.catalogueId && validCatalogueIds.has(p.catalogueId));
  }, [catalogues, products, validCatalogueIds]);

  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'ALL';
  const initialSearch = queryParams.get('q') || '';

  const [search, setSearch] = useState(initialSearch);
  const [selectedGrade, setSelectedGrade] = useState<Grade | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSize, setSelectedSize] = useState('ALL');
  const [sortBy, setSortBy] = useState<'recommended' | 'name' | 'priceAsc' | 'priceDesc'>('recommended');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const qCat = queryParams.get('category');
    const qSearch = queryParams.get('q');
    if (qCat) setSelectedCategory(qCat);
    if (qSearch) setSearch(qSearch);
  }, [location.search]);

  const uniqueCategories = useMemo(
    () => Array.from(new Set(activeProducts.map((p) => p.category))).filter(Boolean),
    [activeProducts]
  );

  const filteredProducts = useMemo(() => {
    if (catalogues.length === 0) return [];
    let result = activeProducts.filter((p) => {
      if (selectedGrade !== 'ALL' && p.grade !== selectedGrade) return false;
      if (selectedCategory !== 'ALL' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      if (selectedSize !== 'ALL' && !p.sizes.includes(selectedSize)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q) && !p.brick.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });

    if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'priceAsc') {
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'priceDesc') {
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return result;
  }, [products, selectedGrade, selectedCategory, selectedSize, search, sortBy]);

  return (
    <div className="space-y-8 pb-16">
      {/* Category / Search Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxe-border pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-luxe-muted block">
            {selectedCategory !== 'ALL' ? `CATEGORY: ${selectedCategory.toUpperCase()}` : 'FULL CATALOGUE'}
          </span>
          <h1 className="font-playfair text-3xl font-bold text-luxe-text">
            {selectedCategory !== 'ALL' ? selectedCategory : 'Apparel Merchandise Directory'}
          </h1>
          <p className="text-xs text-luxe-muted mt-1 font-mono">
            Displaying {filteredProducts.length} items from catalogue index
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden h-9 px-4 rounded border border-luxe-border text-xs font-semibold text-luxe-text flex items-center justify-center gap-2 bg-luxe-surface"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filter & Sort ({filteredProducts.length})</span>
        </button>
      </div>

      {/* Desktop Commerce Filter Toolbar */}
      <div className="hidden lg:flex flex-wrap items-center justify-between gap-4 border-b border-luxe-border pb-4 text-xs font-medium">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-luxe-muted absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-luxe-surface border border-luxe-border rounded pl-9 pr-3 py-1.5 text-xs text-luxe-text focus:border-luxe-dark focus:outline-none"
            />
          </div>

          {/* Grade Selector */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value as any)}
            className="bg-luxe-surface border border-luxe-border rounded px-3 py-1.5 text-xs text-luxe-text focus:border-luxe-dark focus:outline-none font-medium"
          >
            <option value="ALL">All Grades</option>
            <option value="A">Grade A</option>
            <option value="B">Grade B</option>
            <option value="C">Grade C</option>
            <option value="D">Grade D</option>
          </select>

          {/* Category Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-luxe-surface border border-luxe-border rounded px-3 py-1.5 text-xs text-luxe-text focus:border-luxe-dark focus:outline-none font-medium"
          >
            <option value="ALL">All Categories</option>
            {uniqueCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Size Selector */}
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="bg-luxe-surface border border-luxe-border rounded px-3 py-1.5 text-xs text-luxe-text focus:border-luxe-dark focus:outline-none font-medium"
          >
            <option value="ALL">All Sizes</option>
            {detectedSizes.map((sz) => (
              <option key={sz} value={sz}>
                Size {sz}
              </option>
            ))}
          </select>

          {(selectedCategory !== 'ALL' || selectedGrade !== 'ALL' || selectedSize !== 'ALL' || search) && (
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedGrade('ALL');
                setSelectedSize('ALL');
                setSearch('');
                navigate('/admin/user-view/catalogue');
              }}
              className="text-[11px] text-rose-600 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-luxe-muted text-[11px]">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-luxe-surface border border-luxe-border rounded px-3 py-1.5 text-xs text-luxe-text font-semibold focus:border-luxe-dark focus:outline-none"
          >
            <option value="recommended">Recommended</option>
            <option value="name">Product Name (A-Z)</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Discovery Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-8">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 max-w-sm mx-auto border border-luxe-border rounded bg-luxe-surface p-8">
          <h3 className="font-playfair text-lg font-bold text-luxe-text">No Products Found</h3>
          <p className="text-xs text-luxe-muted">
            No items matched your selected filters or search query.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSelectedGrade('ALL');
              setSelectedSize('ALL');
              setSearch('');
            }}
            className="px-4 py-2 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Mobile Filter Bottom Sheet Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-luxe-dark/40 backdrop-blur-sm lg:hidden">
          <div className="bg-luxe-surface border-t border-luxe-border rounded-t-xl p-6 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-luxe-border pb-3">
              <h3 className="font-playfair text-lg font-bold text-luxe-text">Filter & Sort Catalogue</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-luxe-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1">
                  Grade Classification
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value as any)}
                  className="w-full bg-luxe-bg border border-luxe-border rounded px-3 py-2 text-xs text-luxe-text font-medium"
                >
                  <option value="ALL">All Grades</option>
                  <option value="A">Grade A</option>
                  <option value="B">Grade B</option>
                  <option value="C">Grade C</option>
                  <option value="D">Grade D</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-luxe-bg border border-luxe-border rounded px-3 py-2 text-xs text-luxe-text font-medium"
                >
                  <option value="ALL">All Categories</option>
                  {uniqueCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-luxe-bg border border-luxe-border rounded px-3 py-2 text-xs text-luxe-text font-semibold"
                >
                  <option value="recommended">Recommended</option>
                  <option value="name">Product Name (A-Z)</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors"
            >
              Apply Filters ({filteredProducts.length} Results)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
