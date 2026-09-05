import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Package, FileSpreadsheet, Users, Trash2, RefreshCw, Sparkles, Database } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const Admin: React.FC = () => {
  const { products, catalogues, ratios, user, deleteProduct, resetToSampleData, activityLogs } = useAppStore();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-luxe-gold/15 text-luxe-gold border border-luxe-gold/30">
              Admin & Data Control Center
            </span>
          </div>
          <h1 className="font-playfair text-3xl font-bold text-luxe-ivory">
            Merchandising Administration
          </h1>
          <p className="text-xs text-luxe-muted mt-1">
            Manage catalogue records, local images, user profiles, and Firestore dataset structures.
          </p>
        </div>

        <button
          onClick={resetToSampleData}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-luxe-surface border border-luxe-borderGold/40 text-luxe-gold hover:bg-luxe-gold/10 transition-all shadow-sm shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset Sample Catalogue</span>
        </button>
      </div>

      {/* Database Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-luxe-card border border-luxe-border/80 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-luxe-gold/10 text-luxe-gold border border-luxe-gold/30">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-luxe-muted font-bold uppercase tracking-wider block">Firestore Products</span>
            <span className="font-playfair text-2xl font-bold text-luxe-ivory">{products.length}</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-luxe-card border border-luxe-border/80 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-luxe-muted font-bold uppercase tracking-wider block">Uploaded Catalogues</span>
            <span className="font-playfair text-2xl font-bold text-luxe-ivory">{catalogues.length}</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-luxe-card border border-luxe-border/80 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-luxe-muted font-bold uppercase tracking-wider block">Size Ratio Rules</span>
            <span className="font-playfair text-2xl font-bold text-luxe-ivory">{ratios.length}</span>
          </div>
        </div>
      </div>

      {/* Catalogue Records Table */}
      <div className="rounded-3xl bg-luxe-card border border-luxe-border/80 p-6 sm:p-8 space-y-4 shadow-glass">
        <h3 className="font-playfair text-xl font-bold text-luxe-ivory">
          Active Master Catalogues
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-luxe-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-luxe-surface text-luxe-gold uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="p-3">Catalogue Name</th>
                <th className="p-3">File Name</th>
                <th className="p-3">Uploaded By</th>
                <th className="p-3">Total Products</th>
                <th className="p-3">Detected Sizes</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxe-border/60 bg-luxe-card">
              {catalogues.map((cat) => (
                <tr key={cat.id} className="hover:bg-luxe-surface/40 transition-colors">
                  <td className="p-3 font-semibold text-luxe-ivory">{cat.name}</td>
                  <td className="p-3 text-luxe-muted">{cat.fileName}</td>
                  <td className="p-3 text-luxe-ivory/90">{cat.uploadedBy}</td>
                  <td className="p-3 font-bold text-luxe-gold">{cat.totalProducts}</td>
                  <td className="p-3 text-luxe-muted">{cat.detectedSizes.slice(0, 4).join(', ')}...</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {cat.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
