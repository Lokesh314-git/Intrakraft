import React, { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, Eye, ArrowRight, FileSpreadsheet, SlidersHorizontal, Clock } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const AdminDashboard: React.FC = () => {
  const { products, catalogues, cart, ratios, activityLogs, user } = useAppStore();
  const navigate = useNavigate();

  // If there are no catalogues, products must strictly be 0
  const validCatalogueIds = useMemo(() => new Set(catalogues.map(c => c.id)), [catalogues]);
  const activeProducts = useMemo(() => {
    if (catalogues.length === 0) return [];
    return products.filter(p => p.catalogueId && validCatalogueIds.has(p.catalogueId));
  }, [catalogues, products, validCatalogueIds]);

  // Self-heal: If catalogues is 0 and products is non-empty in stale store, purge it
  useEffect(() => {
    if (catalogues.length === 0 && products.length > 0) {
      useAppStore.setState({ products: [], cart: [], detectedSizes: [] });
    }
  }, [catalogues.length, products.length]);

  const totalCartQty = catalogues.length === 0 ? 0 : cart.reduce((acc, item) => acc + item.totalQuantity, 0);

  const metrics = [
    { label: 'PRODUCTS', value: activeProducts.length, link: '/admin/products', trend: catalogues.length === 0 ? 'No catalogue' : '+12 this month' },
    { label: 'CATALOGUES', value: catalogues.length, link: '/admin/catalogues', trend: catalogues.length === 0 ? 'Upload needed' : 'Active Master' },
    { label: 'RATIOS', value: ratios.length, link: '/admin/ratios', trend: 'Grade Rules' },
    { label: 'CART ITEMS', value: totalCartQty, link: '/admin/user-view/cart', trend: `${catalogues.length === 0 ? 0 : cart.length} lines` },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Requirement #7 & #8: Page Hero Section & Hierarchy */}
      <div className="space-y-4 border-b border-luxe-border pb-6">
        <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-luxe-muted block">
          OVERVIEW
        </span>
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-luxe-text leading-tight">
          Good morning, {user?.name.split(' ')[0] || 'Alexander'}.
        </h1>
        <p className="text-xs text-luxe-muted max-w-xl leading-relaxed">
          A concise summary of your catalogue, products and ratio activity.
        </p>

        {/* Action Buttons (Only ONE primary button dominant) */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => navigate('/admin/catalogues/upload')}
            className="h-10 px-4 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-all shadow-subtle flex items-center gap-2"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Catalogue</span>
          </button>
          <button
            onClick={() => navigate('/admin/products/new')}
            className="h-10 px-4 rounded text-xs font-medium border border-luxe-border text-luxe-text hover:bg-luxe-surface transition-colors flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5 text-luxe-muted" />
            <span>Add Product</span>
          </button>
          <button
            onClick={() => navigate('/admin/user-view')}
            className="h-10 px-3 rounded text-xs font-medium text-luxe-muted hover:text-luxe-text transition-colors flex items-center gap-1.5 ml-2"
          >
            <span>Open User View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Requirement #9 & #10: KPI Metrics Section (4 Columns with subtle dividers) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-luxe-border pb-8">
        {metrics.map((m, idx) => (
          <div
            key={m.label}
            onClick={() => navigate(m.link)}
            className={`cursor-pointer px-4 sm:px-6 py-2 space-y-1 group ${idx !== 0 ? 'border-l border-luxe-border' : 'pl-0'
              }`}
          >
            <div className="font-playfair text-4xl sm:text-5xl font-bold text-luxe-text group-hover:text-luxe-muted transition-colors leading-none">
              {m.value < 10 ? `0${m.value}` : m.value}
            </div>
            <div className="space-y-0.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-luxe-muted block">
                {m.label}
              </span>
              <span className="text-[11px] text-luxe-lightMuted font-mono block">
                {m.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Overview Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-12 space-y-10">
          {/* Recent Catalogue Imports */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-luxe-border pb-3">
              <h3 className="font-playfair text-lg font-bold text-luxe-text">
                RECENT CATALOGUE IMPORTS
              </h3>
              <button
                onClick={() => navigate('/admin/catalogues')}
                className="text-xs font-medium text-luxe-muted hover:text-luxe-text transition-colors"
              >
                View all →
              </button>
            </div>

            {catalogues.length === 0 ? (
              <div className="py-6 text-center border border-dashed border-luxe-border rounded bg-luxe-surface/40">
                <p className="text-xs font-medium text-luxe-muted">No catalogues uploaded yet.</p>
                <button
                  onClick={() => navigate('/admin/catalogues/upload')}
                  className="mt-2 text-xs font-semibold text-luxe-text hover:underline"
                >
                  + Upload Excel Catalogue
                </button>
              </div>
            ) : (
              <div className="divide-y divide-luxe-border">
                {catalogues.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => navigate(`/admin/catalogues/${cat.id}`)}
                    className="cursor-pointer py-3.5 flex items-center justify-between group hover:bg-luxe-surface/40 px-2 -mx-2 rounded transition-colors"
                  >
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-luxe-text group-hover:text-luxe-muted transition-colors">
                        {cat.name}
                      </h4>
                      <p className="text-[11px] text-luxe-muted font-mono">
                        {cat.totalProducts} products • {cat.detectedSizes.slice(0, 5).join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                        {cat.status}
                      </span>
                      <span className="text-[11px] text-luxe-lightMuted font-mono">
                        {new Date(cat.uploadDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Size Ratio Rules */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-luxe-border pb-3">
              <h3 className="font-playfair text-lg font-bold text-luxe-text">
                ACTIVE SIZE RATIO RULES
              </h3>
              <button
                onClick={() => navigate('/admin/ratios')}
                className="text-xs font-medium text-luxe-muted hover:text-luxe-text transition-colors"
              >
                Manage ratios →
              </button>
            </div>

            {ratios.length === 0 ? (
              <div className="py-6 text-center border border-dashed border-luxe-border rounded bg-luxe-surface/40">
                <p className="text-xs font-medium text-luxe-muted">No active ratio rules configured.</p>
                <button
                  onClick={() => navigate('/admin/ratios')}
                  className="mt-2 text-xs font-semibold text-luxe-text hover:underline"
                >
                  + Configure Size Ratio Rules
                </button>
              </div>
            ) : (
              <div className="divide-y divide-luxe-border">
                {ratios.slice(0, 4).map((r) => (
                  <div
                    key={r.id}
                    onClick={() => navigate(`/admin/ratios/${r.id}`)}
                    className="cursor-pointer py-3 flex items-center justify-between group hover:bg-luxe-surface/40 px-2 -mx-2 rounded transition-colors"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-luxe-muted">
                        GRADE {r.grade} • {r.attributeLevel}
                      </span>
                      <h4 className="text-xs font-bold text-luxe-text group-hover:text-luxe-muted transition-colors">
                        {r.groupKey}
                      </h4>
                    </div>
                    <span className="font-mono text-xs font-bold text-luxe-text">
                      {r.normalizedRatio}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
