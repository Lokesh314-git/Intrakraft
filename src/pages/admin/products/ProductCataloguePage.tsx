import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Grid, List, Eye, Edit3, Trash2 } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { ProductCard } from '../../../components/ProductCard';
import { Grade } from '../../../types';

export const ProductCataloguePage: React.FC = () => {
  const { products, catalogues, deleteProduct } = useAppStore();
  const navigate = useNavigate();

  // If there are no catalogues, products are strictly empty
  const validCatalogueIds = useMemo(() => new Set(catalogues.map(c => c.id)), [catalogues]);
  const activeProducts = useMemo(() => {
    if (catalogues.length === 0) return [];
    return products.filter(p => p.catalogueId && validCatalogueIds.has(p.catalogueId));
  }, [catalogues, products, validCatalogueIds]);

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [search, setSearch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<Grade | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const uniqueCategories = useMemo(() => Array.from(new Set(activeProducts.map(p => p.category))).filter(Boolean), [activeProducts]);

  const filteredProducts = useMemo(() => {
    if (catalogues.length === 0) return [];
    return activeProducts.filter((p) => {
      if (selectedGrade !== 'ALL' && p.grade !== selectedGrade) return false;
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [catalogues.length, activeProducts, selectedGrade, selectedCategory, search]);

  const handleDeleteProduct = (id: string, name?: string) => {
    if (window.confirm(`Are you sure you want to delete product "${name || 'this item'}"?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxe-border pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-luxe-muted">
            COLLECTION
          </span>
          <h1 className="font-playfair text-3xl font-bold text-luxe-text">
            Product Directory
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center border border-luxe-border rounded bg-luxe-surface p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-luxe-dark text-luxe-bg' : 'text-luxe-muted'}`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'table' ? 'bg-luxe-dark text-luxe-bg' : 'text-luxe-muted'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => navigate('/admin/products/new')}
            className="flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Product</span>
          </button>
        </div>
      </div>

      {/* Minimal Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-luxe-muted absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-luxe-surface border border-luxe-border rounded pl-9 pr-3 py-1.5 text-xs text-luxe-text focus:border-luxe-dark focus:outline-none"
          />
        </div>

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

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-luxe-surface border border-luxe-border rounded px-3 py-1.5 text-xs text-luxe-text focus:border-luxe-dark focus:outline-none font-medium"
        >
          <option value="ALL">All Categories</option>
          {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-luxe-border rounded bg-luxe-surface/40 p-8 space-y-3">
          <p className="text-sm font-semibold text-luxe-text">
            {catalogues.length === 0 ? 'No Catalogues Uploaded Yet' : 'No products in catalogue'}
          </p>
          <p className="text-xs text-luxe-muted max-w-sm mx-auto">
            {catalogues.length === 0
              ? 'Please upload an Excel catalogue spreadsheet (.xlsx or .xls) to populate your merchandising directory.'
              : 'Upload an Excel catalogue file or create a new product to populate your merchandising directory.'}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => navigate('/admin/catalogues/upload')}
              className="px-4 py-2 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors"
            >
              Upload Catalogue Excel
            </button>
            {catalogues.length > 0 && (
              <button
                onClick={() => navigate('/admin/products/new')}
                className="px-4 py-2 rounded text-xs font-medium border border-luxe-border text-luxe-text hover:bg-luxe-surface transition-colors"
              >
                Create Product Manually
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onDelete={(id) => handleDeleteProduct(id, p.name)}
            />
          ))}
        </div>
      ) : (
        <div className="border-t border-luxe-border overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-luxe-border text-luxe-muted uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="py-3 pr-4">Product Name</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Brick</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Sizes</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxe-border/60 font-sans">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-luxe-surface/60 transition-colors">
                  <td className="py-3 pr-4 font-bold text-luxe-text">{p.name}</td>
                  <td className="py-3 px-4 font-mono font-bold text-xs">Grade {p.grade}</td>
                  <td className="py-3 px-4 text-luxe-muted">{p.brick}</td>
                  <td className="py-3 px-4 text-luxe-text">{p.category}</td>
                  <td className="py-3 px-4 text-luxe-muted">{p.sizes.join(', ')}</td>
                  <td className="py-3 px-4 font-mono font-bold text-luxe-text">${p.price || 390}</td>
                  <td className="py-3 pl-4 text-right space-x-2">
                    <button onClick={() => navigate(`/admin/products/${p.id}`)} className="p-1 text-luxe-muted hover:text-luxe-text" title="View Spec">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => navigate(`/admin/products/${p.id}/edit`)} className="p-1 text-luxe-muted hover:text-luxe-text" title="Edit Product">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteProduct(p.id, p.name)} className="p-1 text-red-500 hover:text-red-700 transition-colors" title="Delete Product">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
