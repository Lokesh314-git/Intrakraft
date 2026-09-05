import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ShoppingCart, SlidersHorizontal, User, Heart } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const MobileBottomNav: React.FC<{ isUserView?: boolean }> = ({ isUserView = false }) => {
  const { cart } = useAppStore();
  const totalCartCount = cart.reduce((sum, item) => sum + item.totalQuantity, 0);

  const navItems = isUserView
    ? [
      { to: '/admin/user-view', label: 'Home', icon: LayoutDashboard, exact: true },
      { to: '/admin/user-view/catalogue', label: 'Shop', icon: ShoppingBag },
      { to: '/admin/user-view/cart', label: 'Cart', icon: ShoppingCart, badge: totalCartCount },
      { to: '/admin/user-view/ratios', label: 'Ratios', icon: SlidersHorizontal },
      { to: '/admin/user-view/profile', label: 'Profile', icon: User },
    ]
    : [
      { to: '/admin', label: 'Home', icon: LayoutDashboard, exact: true },
      { to: '/admin/catalogues', label: 'Catalogue', icon: ShoppingBag },
      { to: '/admin/products', label: 'Products', icon: ShoppingBag },
      { to: '/admin/ratios', label: 'Ratios', icon: SlidersHorizontal },
      { to: '/admin/users', label: 'Users', icon: User },
    ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-luxe-bg/95 backdrop-blur-md border-t border-luxe-border lg:hidden px-2 py-1.5">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center w-14 h-11 rounded text-[10px] font-medium transition-colors ${isActive
                  ? 'text-luxe-text font-bold bg-luxe-surface border-b-2 border-luxe-dark'
                  : 'text-luxe-muted hover:text-luxe-text'
                }`
              }
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
              {item.badge && item.badge > 0 ? (
                <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-luxe-dark text-luxe-bg text-[9px] font-bold font-mono flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
