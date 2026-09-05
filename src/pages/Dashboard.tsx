import React from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  FileSpreadsheet,
  ShoppingCart,
  SlidersHorizontal,
  ArrowUpRight,
  Upload,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  PieChart
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { products, catalogues, cart, ratios, activityLogs, user, resetToSampleData } = useAppStore();

  const totalCartQty = cart.reduce((acc, item) => acc + item.totalQuantity, 0);

  // Grade Counts
  const gradeCounts = {
    A: products.filter(p => p.grade === 'A').length,
    B: products.filter(p => p.grade === 'B').length,
    C: products.filter(p => p.grade === 'C').length,
    D: products.filter(p => p.grade === 'D').length,
  };

  const statCards = [
    {
      id: 'products',
      label: 'Total Products',
      value: products.length,
      icon: Package,
      change: '+16 this week',
      color: 'text-luxe-gold',
      bgColor: 'bg-luxe-gold/10 border-luxe-gold/30',
      action: () => onNavigate('products'),
    },
    {
      id: 'catalogues',
      label: 'Uploaded Catalogues',
      value: catalogues.length,
      icon: FileSpreadsheet,
      change: 'Excel (.xlsx/.xls)',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30',
      action: () => onNavigate('upload'),
    },
    {
      id: 'cart',
      label: 'Cart Items (Grade A-D)',
      value: totalCartQty,
      icon: ShoppingCart,
      change: `${cart.length} product lines`,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10 border-sky-500/30',
      action: () => onNavigate('cart'),
    },
    {
      id: 'ratios',
      label: 'Saved Size Ratios',
      value: ratios.length,
      icon: SlidersHorizontal,
      change: 'Grade-wise rules',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/30',
      action: () => onNavigate('ratios'),
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-luxe-card via-luxe-dark to-luxe-black border border-luxe-borderGold/40 p-6 sm:p-8 overflow-hidden shadow-gold-glow">
        <div className="absolute top-0 right-0 w-96 h-96 bg-luxe-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-luxe-gold/15 text-luxe-gold border border-luxe-gold/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Merchandising Studio Active
              </span>
              <span className="text-xs text-luxe-muted">• {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>

            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-luxe-ivory tracking-wide">
              Welcome, <span className="text-luxe-gold">{user?.name || 'Senior Merchandiser'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-luxe-muted mt-2 max-w-2xl leading-relaxed">
              Manage fashion catalogues, analyze dynamic size variations, group cart orders strictly by Grade A, B, C & D, and build attribute-level size ratio models.
            </p>
          </div>

          {/* Quick Launcher Group */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('upload')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-luxe-gold to-luxe-goldDark text-luxe-black hover:brightness-110 transition-all shadow-gold-glow"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Catalogue Excel</span>
            </button>

            <button
              onClick={() => onNavigate('ratios')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs bg-luxe-surface border border-luxe-borderGold/40 text-luxe-gold hover:bg-luxe-gold/10 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Ratio Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              whileHover={{ y: -4 }}
              onClick={card.action}
              className="cursor-pointer rounded-3xl bg-luxe-card border border-luxe-border/80 p-6 hover:border-luxe-gold/40 transition-all shadow-glass flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl border ${card.bgColor} ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-luxe-muted hover:text-luxe-gold transition-colors" />
              </div>

              <div>
                <span className="text-xs font-semibold text-luxe-muted uppercase tracking-wider block mb-1">
                  {card.label}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-playfair text-3xl font-bold text-luxe-ivory">
                    {card.value}
                  </span>
                  <span className="text-[11px] text-luxe-muted font-medium">
                    {card.change}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Grade Distribution Matrix & Quick Actions (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Grade Distribution Overview */}
          <div className="rounded-3xl bg-luxe-card border border-luxe-border/80 p-6 sm:p-8 shadow-glass">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-playfair text-xl font-bold text-luxe-ivory">
                  Catalogue Grade Breakdown
                </h3>
                <p className="text-xs text-luxe-muted mt-1">
                  Products classified across Grade A, Grade B, Grade C & Grade D
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-luxe-gold/10 text-luxe-gold border border-luxe-gold/30">
                Assignment Core
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { grade: 'A', count: gradeCounts.A, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', label: 'Premium Tier' },
                { grade: 'B', count: gradeCounts.B, color: 'text-luxe-gold', bg: 'bg-luxe-gold/10 border-luxe-gold/30', label: 'Core Tier' },
                { grade: 'C', count: gradeCounts.C, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30', label: 'Volume Tier' },
                { grade: 'D', count: gradeCounts.D, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30', label: 'Optional Tier' },
              ].map((item) => (
                <div key={item.grade} className={`p-4 rounded-2xl border ${item.bg} text-center space-y-1`}>
                  <span className={`text-xs font-bold uppercase tracking-wider block ${item.color}`}>
                    Grade {item.grade}
                  </span>
                  <p className="font-playfair text-2xl font-bold text-luxe-ivory">
                    {item.count} Items
                  </p>
                  <span className="text-[10px] text-luxe-muted block">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Catalogues Loaded List */}
          <div className="rounded-3xl bg-luxe-card border border-luxe-border/80 p-6 sm:p-8 shadow-glass">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-playfair text-xl font-bold text-luxe-ivory">
                  Active Master Catalogues
                </h3>
                <p className="text-xs text-luxe-muted mt-1">
                  Imported Excel files with dynamic size detection
                </p>
              </div>
              <button
                onClick={() => onNavigate('upload')}
                className="text-xs font-bold text-luxe-gold hover:underline"
              >
                + Add Catalogue
              </button>
            </div>

            <div className="space-y-4">
              {catalogues.map((cat) => (
                <div
                  key={cat.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-luxe-surface/60 border border-luxe-border gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-luxe-gold/10 border border-luxe-gold/30 text-luxe-gold">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-luxe-ivory">{cat.name}</h4>
                      <p className="text-xs text-luxe-muted mt-0.5">
                        {cat.fileName} • {cat.totalProducts} Products • Uploaded by {cat.uploadedBy}
                      </p>
                    </div>
                  </div>

                  {/* Detected Sizes Chips */}
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-[10px] uppercase font-bold text-luxe-gold mr-1">Detected Sizes:</span>
                    {cat.detectedSizes.slice(0, 5).map((sz) => (
                      <span key={sz} className="px-2 py-0.5 rounded text-[10px] bg-luxe-dark border border-luxe-border text-luxe-ivory">
                        {sz}
                      </span>
                    ))}
                    {cat.detectedSizes.length > 5 && (
                      <span className="text-[10px] text-luxe-muted font-bold">+{cat.detectedSizes.length - 5} more</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Activity Feed & Demo Data Reset (1 col) */}
        <div className="space-y-8">
          {/* Audit Logs Feed */}
          <div className="rounded-3xl bg-luxe-card border border-luxe-border/80 p-6 shadow-glass">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-luxe-gold" />
                <h3 className="font-playfair text-base font-bold text-luxe-ivory">
                  Audit Activity Feed
                </h3>
              </div>
              <span className="text-[10px] text-luxe-muted font-semibold uppercase">Live Logs</span>
            </div>

            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {activityLogs.slice(0, 8).map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-xs pb-3 border-b border-luxe-border/40 last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-luxe-gold mt-1.5 shrink-0 shadow-gold-glow" />
                  <div className="flex-1">
                    <p className="font-semibold text-luxe-ivory">{log.action}</p>
                    <p className="text-[11px] text-luxe-muted mt-0.5">{log.details}</p>
                    <span className="text-[10px] text-luxe-gold/70 block mt-1">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {log.user}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick System Utilities */}
          <div className="rounded-3xl bg-gradient-to-b from-luxe-card to-luxe-dark border border-luxe-borderGold/30 p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-luxe-gold">
              Interview Evaluation Tools
            </h4>
            <p className="text-xs text-luxe-muted leading-relaxed">
              Reset state back to initial sample apparel catalogue anytime to re-test Excel upload, cart grouping, or size ratios.
            </p>
            <button
              onClick={resetToSampleData}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-luxe-surface border border-luxe-border text-luxe-ivory hover:border-luxe-gold hover:text-luxe-gold transition-all"
            >
              Reset to Luxury Sample Catalogue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
