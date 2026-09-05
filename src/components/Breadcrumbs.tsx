import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0 || location.pathname === '/login') return null;

  return (
    <nav className="flex items-center gap-1.5 text-[11px] text-luxe-muted py-2 mb-2 overflow-x-auto scrollbar-none font-medium">
      <Link
        to="/admin"
        className="hover:text-luxe-text transition-colors shrink-0"
      >
        Admin
      </Link>

      {pathnames.map((name, index) => {
        // Skip 'admin' since we already output 'Admin' as root
        if (name.toLowerCase() === 'admin' && index === 0) return null;

        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        const formattedName = name
          .replace(/-/g, ' ')
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase());

        return (
          <React.Fragment key={routeTo}>
            <span className="text-luxe-border text-[10px]">/</span>
            {isLast ? (
              <span className="text-luxe-text font-semibold truncate max-w-[180px] sm:max-w-xs">
                {formattedName}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-luxe-text transition-colors shrink-0 truncate max-w-[140px]"
              >
                {formattedName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
