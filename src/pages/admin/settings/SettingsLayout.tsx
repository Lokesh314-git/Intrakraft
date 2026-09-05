import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Settings, Sliders, Image, Palette, Shield } from 'lucide-react';

export const SettingsLayout: React.FC = () => {
  const sections = [
    { to: '/admin/settings/general', label: 'General', icon: Settings },
    { to: '/admin/settings/catalogue', label: 'Catalogue Engine', icon: Sliders },
    { to: '/admin/settings/images', label: 'Local Media Storage', icon: Image },
    { to: '/admin/settings/appearance', label: 'Appearance', icon: Palette },
    { to: '/admin/settings/security', label: 'Security & Auth', icon: Shield },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-luxe-border pb-6">
        <span className="text-[10px] uppercase tracking-widest font-bold text-luxe-muted block">
          SYSTEM PREFERENCES
        </span>
        <h1 className="font-playfair text-3xl font-bold text-luxe-text">
          System Settings
        </h1>
        <p className="text-xs text-luxe-muted mt-1">
          Configure workspace parameters, local storage, and security policies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 space-y-1">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <NavLink
                key={s.to}
                to={s.to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors ${isActive
                    ? 'bg-luxe-surface text-luxe-text border-l-2 border-luxe-dark font-semibold shadow-subtle'
                    : 'text-luxe-muted hover:text-luxe-text hover:bg-luxe-surface/60'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5 text-luxe-muted shrink-0" />
                <span>{s.label}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="lg:col-span-9">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
