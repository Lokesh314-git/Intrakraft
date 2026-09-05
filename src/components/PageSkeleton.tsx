import React from 'react';

export const PageSkeleton: React.FC<{ type?: 'table' | 'cards' | 'details' | 'form' }> = ({ type = 'cards' }) => {
  if (type === 'table') {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-luxe-surface/60 rounded-xl w-1/3" />
        <div className="rounded-3xl bg-luxe-card border border-luxe-border p-6 space-y-4">
          <div className="h-10 bg-luxe-surface rounded-xl w-full" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-luxe-surface/40 rounded-xl w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'form') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-luxe-surface/60 rounded-xl w-1/2" />
        <div className="rounded-3xl bg-luxe-card border border-luxe-border p-8 space-y-6">
          <div className="h-10 bg-luxe-surface rounded-xl w-full" />
          <div className="h-10 bg-luxe-surface rounded-xl w-full" />
          <div className="h-24 bg-luxe-surface rounded-xl w-full" />
          <div className="h-12 bg-luxe-gold/20 rounded-xl w-1/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-8 bg-luxe-surface/60 rounded-xl w-1/4" />
        <div className="h-10 bg-luxe-surface/60 rounded-xl w-32" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 rounded-3xl bg-luxe-card border border-luxe-border p-6 space-y-4">
            <div className="h-32 bg-luxe-surface/60 rounded-2xl" />
            <div className="h-4 bg-luxe-surface/80 rounded w-3/4" />
            <div className="h-4 bg-luxe-surface/40 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
};
