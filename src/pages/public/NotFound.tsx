import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-luxe-bg flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-14 h-14 rounded border border-luxe-border bg-luxe-surface flex items-center justify-center text-luxe-muted">
        <Compass className="w-7 h-7" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-[10px] font-bold uppercase tracking-widest text-luxe-muted">
          404 PAGE NOT FOUND
        </span>
        <h1 className="font-playfair text-3xl font-bold text-luxe-text">
          Page Does Not Exist
        </h1>
        <p className="text-xs text-luxe-muted leading-relaxed">
          The requested URL path was not found in LUXÉ Merchandise Console. Please verify the URL or return to safety.
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
