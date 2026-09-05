import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const UserViewSavedRatios: React.FC = () => {
  const { ratios, deleteRatioConfig } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxe-border pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-luxe-muted block">
            SAVED CONFIGURATIONS
          </span>
          <h1 className="font-playfair text-3xl font-bold text-luxe-text">Saved Size Ratios</h1>
          <p className="text-xs text-luxe-muted mt-1">Configured grade-wise proportions saved in your workspace.</p>
        </div>

        <button
          onClick={() => navigate('/admin/user-view/ratios/new')}
          className="h-9 px-4 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Ratio</span>
        </button>
      </div>

      <div className="border border-luxe-border rounded overflow-x-auto bg-luxe-surface">
        <table className="w-full text-left text-xs">
          <thead className="bg-luxe-bg border-b border-luxe-border text-luxe-muted uppercase text-[10px] tracking-wider font-bold">
            <tr>
              <th className="py-3 px-4">Name / Group</th>
              <th className="py-3 px-4">Grouping Level</th>
              <th className="py-3 px-4">Grade</th>
              <th className="py-3 px-4">Proportions</th>
              <th className="py-3 px-4">Updated</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-luxe-border/80 font-sans">
            {ratios.map((r) => (
              <tr key={r.id} className="hover:bg-luxe-bg/60 transition-colors">
                <td className="py-3.5 px-4 font-bold text-luxe-text">{r.groupKey}</td>
                <td className="py-3.5 px-4 text-luxe-muted">{r.attributeLevel}</td>
                <td className="py-3.5 px-4 font-mono font-bold">Grade {r.grade}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-luxe-text">{r.normalizedRatio}</td>
                <td className="py-3.5 px-4 text-luxe-muted font-mono">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button
                    onClick={() => navigate(`/admin/user-view/ratios/${r.id}`)}
                    className="p-1 text-luxe-muted hover:text-luxe-text"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteRatioConfig(r.id)}
                    className="p-1 text-rose-600 hover:text-rose-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
