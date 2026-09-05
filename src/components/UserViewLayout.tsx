import React, { useState, useMemo } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  ShoppingCart,
  Heart,
  User,
  SlidersHorizontal,
  BookmarkCheck,
  Bell,
  Clock,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { MobileBottomNav } from './MobileBottomNav';
import { ToastContainer } from './ToastContainer';
import { UserFooter } from './userview/UserFooter';
import { useAppStore } from '../store/useAppStore';
import { formatCurrency } from '../utils/formatters';

export const UserViewLayout: React.FC = () => {
  const { cart, products, catalogues, wishlist, userNotifications, settings, user, logout } = useAppStore();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.totalQuantity, 0);
  const unreadNotifCount = userNotifications.filter((n) => !n.read).length;

  // Dynamic Categories extracted from Products & Catalogues
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => { if (p.category) set.add(p.category); });
    catalogues.forEach((c) => { if (c.detectedSizes) set.add('Apparel'); });
    return Array.from(set);
  }, [products, catalogues]);

  // Live Search Suggestions Filter
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return products
      .filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brick.toLowerCase().includes(q) ||
        `grade ${p.grade}`.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [searchQuery, products]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/user-view/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
    }
  };

  const navLinks = [
    { to: '/admin/user-view', label: 'Home', exact: true },
    { to: '/admin/user-view/catalogue', label: 'Catalogue' },
    { to: '/admin/user-view/wishlist', label: 'Wishlist', badge: wishlist.length > 0 ? `${wishlist.length}` : null },
    { to: '/admin/user-view/cart', label: 'Cart', badge: totalCartCount > 0 ? `${totalCartCount}` : null },
    { to: '/admin/user-view/ratios', label: 'Ratio Studio' },
    { to: '/admin/user-view/saved-ratios', label: 'Saved Ratios' },
    { to: '/admin/user-view/orders', label: 'Selection History' },
    { to: '/admin/user-view/profile', label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-luxe-bg text-luxe-text font-sans flex flex-col pb-16 lg:pb-0">
      {/* Top Banner Notice */}
      <div className="bg-luxe-accentLight border-b border-luxe-border px-4 py-1.5 text-center text-[11px] text-luxe-text font-medium flex items-center justify-center gap-3">
        <span>MERCHANDISER COMMERCE MODE — End-user catalogue & ratio workspace active.</span>
        <button
          onClick={() => navigate('/admin')}
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-luxe-dark text-luxe-bg text-[10px] font-semibold hover:bg-black transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Return to Admin Console</span>
        </button>
      </div>

      {/* Main Commerce Header */}
      <header className="sticky top-0 z-40 bg-luxe-surface border-b border-luxe-border shadow-subtle">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
          {/* Left Logo */}
          <NavLink to="/admin/user-view" className="flex items-center gap-2 shrink-0">
            <span className="font-playfair text-xl font-bold tracking-widest text-luxe-text uppercase">
              LUXÉ
            </span>
            <span className="text-[9px] text-luxe-muted uppercase tracking-widest border-l border-luxe-border pl-2 font-medium hidden sm:inline">
              MERCHANDISE
            </span>
          </NavLink>

          {/* Center Search Input with Predictive Suggestions */}
          <div className="relative flex-1 max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-luxe-muted absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search products, categories, bricks, grades (A-D), sizes..."
                className="w-full bg-luxe-bg border border-luxe-border rounded-full pl-10 pr-4 py-2 text-xs text-luxe-text focus:border-luxe-dark focus:bg-luxe-surface focus:outline-none transition-all"
              />
            </form>

            {/* Live Search Suggestions Dropdown */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-luxe-surface border border-luxe-border rounded-lg shadow-dropdown p-2 z-50 divide-y divide-luxe-border/60">
                {searchSuggestions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      navigate(`/admin/user-view/product/${item.id}`);
                      setIsSearchFocused(false);
                    }}
                    className="p-2 hover:bg-luxe-bg cursor-pointer flex items-center justify-between rounded transition-colors text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img src={item.imageUrl} alt={item.name} className="w-8 h-10 object-cover rounded border border-luxe-border" />
                      <div>
                        <p className="font-bold text-luxe-text">{item.name}</p>
                        <p className="text-[10px] text-luxe-muted">Grade {item.grade} • {item.category}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs text-luxe-text">
                      {formatCurrency(item.price || 390, settings?.general?.currency)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-4 shrink-0 text-xs font-medium">
            <NavLink
              to="/admin/user-view/notifications"
              className="relative text-luxe-muted hover:text-luxe-text transition-colors p-1"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </NavLink>

            <NavLink
              to="/admin/user-view/wishlist"
              className="relative flex items-center gap-1.5 text-luxe-muted hover:text-luxe-text transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden md:inline">Wishlist</span>
              {wishlist.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold font-mono flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/admin/user-view/cart"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-luxe-dark text-luxe-bg hover:bg-black transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Cart</span>
              {totalCartCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-luxe-bg text-luxe-dark text-[10px] font-bold font-mono flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </NavLink>

            {/* Account Menu */}
            <div className="relative">
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="flex items-center gap-1.5 text-luxe-text hover:opacity-80 transition-opacity"
              >
                <div className="w-7 h-7 rounded-full bg-luxe-dark text-luxe-bg font-bold font-mono text-xs flex items-center justify-center overflow-hidden border border-luxe-border">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0) || 'M'
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-luxe-muted hidden sm:inline" />
              </button>

              {isAccountMenuOpen && (
                <div
                  onMouseLeave={() => setIsAccountMenuOpen(false)}
                  className="absolute right-0 top-full mt-2 w-48 rounded border border-luxe-border bg-luxe-surface p-1 shadow-dropdown text-xs z-50 space-y-0.5"
                >
                  <div className="px-3 py-2 border-b border-luxe-border">
                    <p className="font-bold text-luxe-text">{user?.name || 'Merchandiser'}</p>
                    <p className="text-[10px] text-luxe-muted truncate font-mono">{user?.email || 'guest@luxe.com'}</p>
                  </div>

                  <NavLink to="/admin/user-view/profile" onClick={() => setIsAccountMenuOpen(false)} className="flex items-center gap-2 px-3 py-1.5 hover:bg-luxe-bg rounded text-luxe-text">
                    <User className="w-3.5 h-3.5 text-luxe-muted" /> Profile
                  </NavLink>
                  <NavLink to="/admin/user-view/wishlist" onClick={() => setIsAccountMenuOpen(false)} className="flex items-center gap-2 px-3 py-1.5 hover:bg-luxe-bg rounded text-luxe-text">
                    <Heart className="w-3.5 h-3.5 text-luxe-muted" /> Wishlist ({wishlist.length})
                  </NavLink>
                  <NavLink to="/admin/user-view/orders" onClick={() => setIsAccountMenuOpen(false)} className="flex items-center gap-2 px-3 py-1.5 hover:bg-luxe-bg rounded text-luxe-text">
                    <Clock className="w-3.5 h-3.5 text-luxe-muted" /> Selection History
                  </NavLink>
                  <NavLink to="/admin/user-view/saved-ratios" onClick={() => setIsAccountMenuOpen(false)} className="flex items-center gap-2 px-3 py-1.5 hover:bg-luxe-bg rounded text-luxe-text">
                    <BookmarkCheck className="w-3.5 h-3.5 text-luxe-muted" /> Saved Ratios
                  </NavLink>

                  <div className="pt-1 border-t border-luxe-border">
                    <button
                      onClick={() => {
                        logout();
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sub-Header Commerce Category Bar */}
        <div className="border-t border-luxe-border px-4 sm:px-8 bg-luxe-surface overflow-x-auto scrollbar-none">
          <div className="max-w-[1400px] mx-auto flex items-center gap-6 py-2 text-xs font-semibold uppercase tracking-wider text-luxe-muted">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) =>
                  `shrink-0 pb-1 border-b-2 transition-colors flex items-center gap-1 ${
                    isActive ? 'border-luxe-dark text-luxe-text font-bold' : 'border-transparent hover:text-luxe-text'
                  }`
                }
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-1.5 py-0.2 rounded-full bg-luxe-dark text-luxe-bg text-[9px] font-mono font-bold">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}

            <div className="h-4 w-px bg-luxe-border shrink-0" />

            {/* Dynamic Categories */}
            {categories.slice(0, 6).map((cat) => (
              <NavLink
                key={cat}
                to={`/admin/user-view/category/${encodeURIComponent(cat)}`}
                className="shrink-0 text-luxe-muted hover:text-luxe-text text-[11px] font-normal transition-colors lowercase tracking-normal capitalize"
              >
                {cat}
              </NavLink>
            ))}
          </div>
        </div>
      </header>

      {/* Main Commerce Body Canvas */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-6">
        <Breadcrumbs />
        <Outlet />
      </main>

      <UserFooter />
      <MobileBottomNav isUserView={true} />
      <ToastContainer />
    </div>
  );
};
