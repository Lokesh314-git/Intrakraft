import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, History } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

export const RatioDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { ratios, detectedSizes } = useAppStore();
  const navigate = useNavigate();

  const ratioRule = ratios.find((r) => r.id === id) || ratios[0];

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-luxe-border pb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/ratios')} className="p-1.5 rounded border border-luxe-border text-luxe-muted hover:text-luxe-text">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-luxe-muted">RATIO SPECIFICATION</span>
            <h1 className="font-playfair text-2xl font-bold text-luxe-text">{ratioRule?.groupKey} Ratio</h1>
          </div>
        </div>

        <button onClick={() => navigate(`/admin/ratios/${ratioRule?.id}/history`)} className="flex items-center gap-2 px-3 py-1.5 rounded border border-luxe-border text-xs font-medium text-luxe-text hover:bg-luxe-surface">
          <History className="w-3.5 h-3.5" />
          <span>Version History</span>
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center text-xs border-b border-luxe-border pb-4">
          <div>
            <span className="text-luxe-muted block">Attribute Level</span>
            <span className="font-semibold text-luxe-text">{ratioRule?.attributeLevel}</span>
          </div>
          <div className="text-right">
            <span className="text-luxe-muted block">Primary Grade</span>
            <span className="font-mono font-bold text-luxe-text">Grade {ratioRule?.grade}</span>
          </div>
        </div>

        {/* Requirement #17 Spreadsheet Ratio Table */}
        <div className="space-y-3">
          <h3 className="font-playfair text-lg font-bold text-luxe-text">Multi-Grade Size Allocation Matrix</h3>

          <div className="border border-luxe-border rounded overflow-x-auto bg-luxe-surface">
            <table className="w-full text-center text-xs">
              <thead className="bg-luxe-bg border-b border-luxe-border text-luxe-muted uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="p-3 text-left">Grade</th>
                  {detectedSizes.slice(0, 5).map(sz => <th key={sz} className="p-3">{sz}</th>)}
                  <th className="p-3 text-right">Normalized Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxe-border/80 font-mono text-xs">
                {['A', 'B', 'C', 'D'].map(g => (
                  <tr key={g} className={g === ratioRule?.grade ? 'bg-luxe-accentLight/60 font-bold' : ''}>
                    <td className="p-3.5 text-left font-bold font-sans text-luxe-text">GRADE {g}</td>
                    {detectedSizes.slice(0, 5).map(sz => (
                      <td key={sz} className="p-3.5 text-luxe-text">
                        {g === ratioRule?.grade ? (ratioRule?.sizeRatios[sz] ?? 1) : (g === 'A' ? 2 : 1)}
                      </td>
                    ))}
                    <td className="p-3.5 text-right font-bold text-luxe-text">
                      {g === ratioRule?.grade ? ratioRule?.normalizedRatio : '1 : 2 : 1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
