import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/admin');
    }, 1000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-luxe-bg flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-12 h-12 rounded bg-luxe-dark text-luxe-bg flex items-center justify-center font-playfair font-bold text-xl uppercase tracking-widest">
        L
      </div>

      <div className="space-y-1">
        <h2 className="font-playfair text-2xl font-bold text-luxe-text">
          Authenticating...
        </h2>
        <p className="text-[11px] text-luxe-muted tracking-widest uppercase font-semibold">
          Preparing your workspace...
        </p>
      </div>

      <RefreshCw className="w-5 h-5 text-luxe-muted animate-spin" />
    </div>
  );
};
