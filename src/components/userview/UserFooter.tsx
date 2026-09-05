import React from 'react';
import { NavLink } from 'react-router-dom';
import { Crown, Sparkles, ShieldCheck, Heart, ShoppingBag } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const UserFooter: React.FC = () => {
  const { settings } = useAppStore();
  const brandTitle = settings?.general?.platformName || 'LUXÉ Merchandise';

  return (
    <footer className="bg-luxe-surface border-t border-luxe-border mt-16 text-luxe-text font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-playfair text-2xl font-bold tracking-widest uppercase text-luxe-text">
                LUXÉ
              </span>
              <span className="text-[9px] text-luxe-muted uppercase tracking-widest border-l border-luxe-border pl-2 font-medium">
                COUTURE MERCHANDISING
              </span>
            </div>
            <p className="text-xs text-luxe-muted leading-relaxed max-w-sm">
              Precision fashion merchandising, grade-wise size allocation ratios, and curated catalogue ingestion for modern luxury apparel.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-luxe-muted">
              <span>{settings?.general?.currency || 'USD ($)'} Display</span>
              <span>•</span>
              <span>Local Storage Active</span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-luxe-muted">Storefront</h4>
            <ul className="space-y-2 text-xs text-luxe-muted font-medium">
              <li><NavLink to="/admin/user-view" className="hover:text-luxe-text transition-colors">Home</NavLink></li>
              <li><NavLink to="/admin/user-view/catalogue" className="hover:text-luxe-text transition-colors">Catalogue</NavLink></li>
              <li><NavLink to="/admin/user-view/collections/new-arrivals" className="hover:text-luxe-text transition-colors">New Arrivals</NavLink></li>
              <li><NavLink to="/admin/user-view/collections/trending" className="hover:text-luxe-text transition-colors">Trending Lines</NavLink></li>
            </ul>
          </div>

          {/* Ratio Workbench & Account */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-luxe-muted">Merchandising Studio</h4>
            <ul className="space-y-2 text-xs text-luxe-muted font-medium">
              <li><NavLink to="/admin/user-view/ratios" className="hover:text-luxe-text transition-colors">Ratio Engine Studio</NavLink></li>
              <li><NavLink to="/admin/user-view/saved-ratios" className="hover:text-luxe-text transition-colors">Saved Size Rules</NavLink></li>
              <li><NavLink to="/admin/user-view/orders" className="hover:text-luxe-text transition-colors">Selection History</NavLink></li>
              <li><NavLink to="/admin/user-view/cart" className="hover:text-luxe-text transition-colors">Cart Grouping</NavLink></li>
            </ul>
          </div>

          {/* Customer & Curation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-luxe-muted">Customer & Curation</h4>
            <ul className="space-y-2 text-xs text-luxe-muted font-medium">
              <li><NavLink to="/admin/user-view/wishlist" className="hover:text-luxe-text transition-colors">Curated Wishlist</NavLink></li>
              <li><NavLink to="/admin/user-view/reviews" className="hover:text-luxe-text transition-colors">Customer Reviews</NavLink></li>
              <li><NavLink to="/admin/user-view/questions" className="hover:text-luxe-text transition-colors">Product Q&A</NavLink></li>
              <li><NavLink to="/admin/user-view/recently-viewed" className="hover:text-luxe-text transition-colors">Recently Viewed</NavLink></li>
              <li><NavLink to="/admin/user-view/notifications" className="hover:text-luxe-text transition-colors">System Notifications</NavLink></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-luxe-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-luxe-muted">
          <p>© 2026 {brandTitle}. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <NavLink to="/admin" className="font-semibold text-luxe-text hover:underline">
              Admin Console →
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};
