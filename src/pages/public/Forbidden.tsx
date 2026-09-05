import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const Forbidden: React.FC = () => {
  return (
    <div className="min-h-screen bg-luxe-bg flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-14 h-14 rounded border border-luxe-border bg-luxe-surface flex items-center justify-center text-rose-600">
        <ShieldAlert className="w-7 h-7" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600">
          ACCESS RESTRICTED
        </span>
        <h1 className="font-playfair text-3xl font-bold text-luxe-text">
          403 — Unauthorized Space
        </h1>
        <p className="text-xs text-luxe-muted leading-relaxed">
          You don't have permission to access this merchandising space. Contact your administrator or return to the main console.
        </p>
      </div>

      <Link
        to="/admin"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};
