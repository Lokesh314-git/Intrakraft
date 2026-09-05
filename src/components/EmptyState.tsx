import React from 'react';
import { PackageSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
  icon?: React.ElementType;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  actionLink,
  onAction,
  icon: Icon = PackageSearch,
}) => {
  return (
    <div className="rounded-3xl bg-luxe-card border border-luxe-border/80 p-12 text-center space-y-4 max-w-md mx-auto my-8">
      <div className="w-14 h-14 rounded-2xl bg-luxe-gold/10 border border-luxe-gold/30 flex items-center justify-center mx-auto text-luxe-gold shadow-gold-glow">
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <h3 className="font-playfair text-xl font-bold text-luxe-ivory">{title}</h3>
        <p className="text-xs text-luxe-muted mt-1 leading-relaxed">{description}</p>
      </div>

      {actionText && (
        <div className="pt-2">
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-luxe-gold to-luxe-goldDark text-luxe-black shadow-gold-glow hover:brightness-110 transition-all"
            >
              {actionText}
            </Link>
          ) : onAction ? (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-luxe-gold to-luxe-goldDark text-luxe-black shadow-gold-glow hover:brightness-110 transition-all"
            >
              {actionText}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};
