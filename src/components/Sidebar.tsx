import React from 'react';
import {
  LayoutDashboard,
  Upload,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  ShieldCheck,
  FileSpreadsheet,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const { cart, ratios, products } = useAppStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.totalQuantity, 0);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      description: 'Merchandising overview & metrics',
    },
    {
      id: 'upload',
      label: 'Catalogue Upload',
      icon: Upload,
      badge: 'Excel',
      description: 'Import & dynamic size parser',
    },
    {
      id: 'products',
      label: 'Products Directory',
      icon: ShoppingBag,
      badge: products.length.toString(),
      description: 'Luxury grid & local media',
    },
    {
      id: 'cart',
      label: 'Cart Studio',
      icon: ShoppingCart,
      badge: totalCartCount > 0 ? totalCartCount.toString() : null,
      description: 'Grade A, B, C, D cart grouping',
    },
    {
      id: 'ratios',
      label: 'Size Ratio Engine',
      icon: SlidersHorizontal,
      badge: `${ratios.length} Rules`,
      description: 'Attribute-level ratio matrix',
    },
    {
      id: 'admin',
      label: 'Admin Panel',
      icon: ShieldCheck,
      badge: null,
      description: 'Catalogue & user controls',
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block bg-luxe-black/60 backdrop-blur-md border-r border-luxe-border/60 min-h-[calc(100vh-65px)] p-4">
      <div className="space-y-6">
        {/* Navigation Group */}
        <div>
          <h3 className="px-3 text-[10px] uppercase font-bold tracking-widest text-luxe-gold/70 mb-3">
            Merchandising Hub
          </h3>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all duration-200 group ${isActive
                      ? 'bg-gradient-to-r from-luxe-gold/20 to-luxe-gold/5 border border-luxe-gold/40 text-luxe-ivory shadow-gold-glow'
                      : 'text-luxe-muted hover:text-luxe-ivory hover:bg-luxe-surface/60 border border-transparent'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-luxe-gold text-luxe-black' : 'bg-luxe-dark group-hover:bg-luxe-surface text-luxe-gold'
                      }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${isActive ? 'text-luxe-ivory' : 'text-luxe-ivory/80 group-hover:text-luxe-ivory'}`}>
                        {item.label}
                      </p>
                      <p className="text-[10px] text-luxe-muted/80 tracking-tight leading-none mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${isActive
                        ? 'bg-luxe-gold text-luxe-black'
                        : 'bg-luxe-surface text-luxe-gold border border-luxe-gold/20'
                      }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Assignment Specs Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-luxe-card to-luxe-dark border border-luxe-borderGold/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Sparkles className="w-16 h-16 text-luxe-gold" />
          </div>
          <div className="flex items-center gap-2 text-luxe-gold mb-2">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Assignment Core</span>
          </div>
          <p className="text-xs text-luxe-ivory/90 leading-relaxed font-medium">
            Grade-Wise Size Ratio Studio
          </p>
          <ul className="mt-2 text-[11px] text-luxe-muted space-y-1 list-disc list-inside">
            <li>Dynamic Size Detection</li>
            <li>Grade A, B, C & D Ratios</li>
            <li>Attribute Level Grouping</li>
            <li>Local Storage & Firestore Sync</li>
          </ul>
        </div>
      </div>
    </aside>
  );
};
