import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

export const RatioHistoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { ratios, addToast } = useAppStore();
  const navigate = useNavigate();

  const ratioRule = ratios.find((r) => r.id === id) || ratios[0];

  const versions = [
    { version: 'v3 (Current)', updatedBy: 'Alexander Sterling', date: '2026-09-04 10:30', ratio: ratioRule?.normalizedRatio || '1 : 2 : 1', active: true },
    { version: 'v2', updatedBy: 'Claire Dupont', date: '2026-09-03 14:15', ratio: '2 : 2 : 1', active: false },
    { version: 'v1', updatedBy: 'System Engine', date: '2026-09-01 09:00', ratio: '1 : 1 : 1', active: false },
  ];

  const handleRestore = (v: string) => {
    addToast('Version Restored', `Restored size ratio snapshot ${v} for ${ratioRule?.groupKey}`, 'success');
  };

  return (
    <div className="space-y-8 pb-12 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 border-b border-luxe-border pb-6">
        <button
          onClick={() => navigate(`/admin/ratios/${ratioRule?.id}`)}
          className="p-2 rounded border border-luxe-border bg-luxe-surface text-luxe-muted hover:text-luxe-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-luxe-muted block">
            RATIO AUDIT TRAIL
          </span>
          <h1 className="font-playfair text-3xl font-bold text-luxe-text">
            Version History: {ratioRule?.groupKey}
          </h1>
        </div>
      </div>

      <div className="space-y-4">
        {versions.map((ver) => (
          <div
            key={ver.version}
            className={`p-5 rounded border flex items-center justify-between transition-all ${ver.active
                ? 'bg-luxe-surface border-luxe-dark shadow-subtle'
                : 'bg-luxe-surface border-luxe-border'
              }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-luxe-text">{ver.version}</span>
                {ver.active && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-luxe-dark text-luxe-bg">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-luxe-muted">
                Updated by {ver.updatedBy} on {ver.date}
              </p>
              <p className="font-mono text-xs font-bold text-luxe-text pt-1">
                Ratio Snapshot: {ver.ratio}
              </p>
            </div>

            {!ver.active && (
              <button
                onClick={() => handleRestore(ver.version)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-luxe-border text-luxe-text hover:bg-luxe-bg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Snapshot</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
