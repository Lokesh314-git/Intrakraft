import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BookmarkCheck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const UserViewRatioStudio: React.FC = () => {
  const { ratios } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxe-border pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-luxe-muted block">
            RATIO ENGINE STUDIO
          </span>
          <h1 className="font-playfair text-3xl font-bold text-luxe-text">Grade-Wise Size Ratio Studio</h1>
          <p className="text-xs text-luxe-muted mt-1">Configure, calculate, and export size ratio models for Grades A, B, C & D.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/user-view/saved-ratios')}
            className="h-9 px-3.5 rounded text-xs font-medium border border-luxe-border text-luxe-text hover:bg-luxe-surface transition-colors flex items-center gap-2"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-luxe-muted" />
            <span>Saved Ratios</span>
          </button>
          <button
            onClick={() => navigate('/admin/user-view/ratios/new')}
            className="h-9 px-4 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Ratio Rule</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-playfair text-lg font-bold text-luxe-text border-b border-luxe-border pb-3">
          Active Ratio Configurations ({ratios.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ratios.map((r) => (
            <div
              key={r.id}
              onClick={() => navigate(`/admin/user-view/ratios/${r.id}`)}
              className="cursor-pointer p-5 rounded border border-luxe-border bg-luxe-surface hover:bg-luxe-bg transition-colors space-y-2.5 group"
            >
              <div className="flex justify-between text-xs font-semibold">
                <span className="font-mono text-xs font-bold text-luxe-text">Grade {r.grade}</span>
                <span className="text-luxe-muted text-[11px]">{r.attributeLevel}</span>
              </div>
              <h4 className="font-playfair text-base font-bold text-luxe-text group-hover:text-luxe-muted transition-colors">
                {r.groupKey}
              </h4>
              <p className="font-mono text-xs font-bold text-luxe-text pt-2 border-t border-luxe-border">
                Ratio: {r.normalizedRatio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
