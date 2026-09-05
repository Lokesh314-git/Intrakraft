import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSpreadsheet,
  ShoppingBag,
  Users,
  SlidersHorizontal,
  Settings,
  Eye,
  User,
  LogOut
} from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { MobileBottomNav } from './MobileBottomNav';
import { ToastContainer } from './ToastContainer';
import { useAppStore } from '../store/useAppStore';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  highlight?: boolean;
  badge?: string | null;
}

export const AdminLayout: React.FC = () => {
  const { user, logout, ratios } = useAppStore();
  const navigate = useNavigate();

  const navGroups: { title: string; items: NavItem[] }[] = [
    {
      title: 'NAVIGATION',
      items: [
        { to: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
        { to: '/admin/catalogues', label: 'Catalogue', icon: FileSpreadsheet },
        { to: '/admin/products', label: 'Products', icon: ShoppingBag },
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        { to: '/admin/users', label: 'Users', icon: Users },
        { to: '/admin/ratios', label: 'Ratios', icon: SlidersHorizontal, badge: ratios.length > 0 ? `${ratios.length}` : null },
        { to: '/admin/user-view', label: 'User View Mode', icon: Eye, highlight: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-luxe-bg text-luxe-text font-sans flex flex-col pb-16 lg:pb-0">
      {/* Requirement #4: Minimal Top Header (Height: 64px) */}
      <header className="sticky top-0 z-40 h-16 bg-luxe-bg/90 backdrop-blur-md border-b border-luxe-border px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <NavLink to="/admin" className="flex items-center gap-2">
            <span className="font-playfair text-lg font-bold tracking-widest text-luxe-text uppercase">
              LUXÉ
            </span>
            <span className="text-[10px] text-luxe-muted uppercase tracking-widest border-l border-luxe-border pl-2 font-medium">
              MERCHANDISE CONSOLE
            </span>
          </NavLink>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/user-view')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-luxe-text hover:bg-luxe-surface border border-luxe-border transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-luxe-muted" />
            <span className="hidden sm:inline">Open User View</span>
          </button>

          {user && (
            <div className="flex items-center gap-2.5 pl-3 border-l border-luxe-border">
              <span className="text-xs font-medium text-luxe-text hidden sm:inline">{user.name}</span>
              <div className="w-7 h-7 rounded-full bg-luxe-dark text-luxe-bg flex items-center justify-center text-xs font-bold font-mono">
                {user.name.charAt(0)}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Requirement #2 & #3 & #5: 12-Column Responsive Layout System & Compact Sidebar */}
      <div className="flex-1 flex max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Compact Refined Sidebar (220px) */}
        <aside className="w-[220px] shrink-0 hidden lg:flex flex-col justify-between min-h-[calc(100vh-120px)] border-r border-luxe-border pr-6">
          <div className="space-y-6">
            {navGroups.map((group) => (
              <div key={group.title}>
                <span className="text-[9px] uppercase font-bold tracking-[0.15em] text-luxe-muted block mb-2">
                  {group.title}
                </span>
                <nav className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.exact}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${isActive
                            ? 'bg-luxe-surface text-luxe-text border-l-2 border-luxe-dark font-semibold shadow-subtle'
                            : item.highlight
                              ? 'text-luxe-text hover:bg-luxe-surface border border-luxe-border/80'
                              : 'text-luxe-muted hover:text-luxe-text hover:bg-luxe-surface/60'
                          }`
                        }
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 shrink-0 text-luxe-muted" />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-luxe-border text-luxe-text">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-luxe-border space-y-0.5">
            <NavLink
              to="/admin/users/me"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded text-xs text-luxe-muted hover:text-luxe-text transition-colors"
            >
              <User className="w-3.5 h-3.5 text-luxe-muted" />
              <span>Profile Settings</span>
            </NavLink>
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-xs text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>

      <MobileBottomNav isUserView={false} />
      <ToastContainer />
    </div>
  );
};
