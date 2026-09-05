import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2, Copy } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const UserViewRatioDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { ratios, deleteRatioConfig, addToast } = useAppStore();
  const navigate = useNavigate();

  const rule = ratios.find((r) => r.id === id) || ratios[0];

  const handleDuplicate = () => {
    addToast('Ratio Duplicated', `Created copy of ${rule?.groupKey} rule.`, 'success');
  };

  const handleDelete = () => {
    if (rule) deleteRatioConfig(rule.id);
    navigate('/admin/user-view/saved-ratios');
  };

  return (
    <div className="space-y-8 pb-12 max-w-3xl mx-auto">
      <div className="flex items-center justify-between border-b border-luxe-border pb-6">
        <button
          onClick={() => navigate('/admin/user-view/saved-ratios')}
          className="flex items-center gap-2 text-xs font-semibold text-luxe-muted hover:text-luxe-text transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Saved Ratios</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDuplicate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-luxe-border text-luxe-text hover:bg-luxe-surface transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate</span>
          </button>
          <button
            onClick={() => navigate('/admin/user-view/ratios/new')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Ratio</span>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded border border-luxe-border text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete Rule"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="border border-luxe-border rounded bg-luxe-surface p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-luxe-muted block">
            GRADE {rule?.grade} CONFIGURATION
          </span>
          <h1 className="font-playfair text-3xl font-bold text-luxe-text">{rule?.groupKey}</h1>
          <p className="text-xs text-luxe-muted mt-1">Attribute Level: {rule?.attributeLevel}</p>
        </div>

        <div className="p-4 rounded border border-luxe-border bg-luxe-bg font-mono text-center space-y-1">
          <span className="text-[10px] text-luxe-muted uppercase tracking-widest block font-sans font-bold">
            Normalized Proportions
          </span>
          <span className="text-2xl font-bold text-luxe-text">{rule?.normalizedRatio}</span>
        </div>
      </div>
    </div>
  );
};
