import React from 'react';
import { ShoppingBag, Upload, User as UserIcon, Crown, LogOut } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface NavbarProps {
  onOpenAuth: () => void;
  onNavigate: (page: string) => void;
  activePage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onNavigate, activePage }) => {
  const { user, cart, logout } = useAppStore();

  const totalCartItems = cart.reduce((sum, item) => sum + item.totalQuantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-luxe-surface border-b border-luxe-border px-4 lg:px-8 py-3.5 shadow-subtle">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 group text-left"
        >
          <div className="w-9 h-9 rounded bg-luxe-dark text-luxe-bg flex items-center justify-center font-playfair font-bold text-lg uppercase tracking-widest">
            L
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-playfair text-xl tracking-wider text-luxe-text font-bold">
                LUXÉ
              </span>
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-luxe-bg text-luxe-muted border border-luxe-border font-medium">
                MERCHANDISE
              </span>
            </div>
          </div>
        </button>

        {/* Quick Navigation Shortcuts */}
        <nav className="hidden md:flex items-center gap-1 bg-luxe-bg p-1 rounded border border-luxe-border">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${activePage === 'dashboard'
                ? 'bg-luxe-surface text-luxe-text border border-luxe-border shadow-subtle'
                : 'text-luxe-muted hover:text-luxe-text'
              }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('products')}
            className={`px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${activePage === 'products'
                ? 'bg-luxe-surface text-luxe-text border border-luxe-border shadow-subtle'
                : 'text-luxe-muted hover:text-luxe-text'
              }`}
          >
            Products
          </button>
          <button
            onClick={() => onNavigate('ratios')}
            className={`px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${activePage === 'ratios'
                ? 'bg-luxe-surface text-luxe-text border border-luxe-border shadow-subtle'
                : 'text-luxe-muted hover:text-luxe-text'
              }`}
          >
            Ratio Studio
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('upload')}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded border border-luxe-border text-xs font-semibold text-luxe-text hover:bg-luxe-bg transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-luxe-muted" />
            <span>Upload Catalogue</span>
          </button>

          <button
            onClick={() => onNavigate('cart')}
            className="relative flex items-center gap-2 px-3.5 py-1.5 rounded border border-luxe-border bg-luxe-surface text-xs font-semibold text-luxe-text hover:bg-luxe-bg transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-luxe-muted" />
            <span className="hidden sm:inline">Cart</span>
            {totalCartItems > 0 && (
              <span className="w-4 h-4 rounded-full bg-luxe-dark text-luxe-bg text-[10px] font-bold font-mono flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-bold text-luxe-text leading-none">{user.name}</span>
                <span className="text-[10px] text-luxe-muted mt-0.5">{user.role}</span>
              </div>
              <div className="relative group">
                <button className="w-8 h-8 rounded-full border border-luxe-border p-0.5 bg-luxe-dark text-luxe-bg font-bold font-mono text-xs flex items-center justify-center overflow-hidden">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </button>

                <div className="absolute right-0 top-full mt-2 w-52 rounded border border-luxe-border bg-luxe-surface p-2 shadow-dropdown opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-3 py-2 border-b border-luxe-border">
                    <p className="text-xs font-bold text-luxe-text">{user.name}</p>
                    <p className="text-[11px] text-luxe-muted truncate font-mono">{user.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded transition-colors mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
