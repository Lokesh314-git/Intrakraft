import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, History, Trash2, Download, SlidersHorizontal } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { exportRatioReportPDF } from '../../../services/pdfExporter';

export const RatioManagementPage: React.FC = () => {
  const { ratios, attributeLevel, detectedSizes, deleteRatioConfig } = useAppStore();
  const navigate = useNavigate();
  const [filterGrade, setFilterGrade] = useState('ALL');

  const filteredRatios = ratios.filter((r) => filterGrade === 'ALL' || r.grade === filterGrade);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxe-border pb-6">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-luxe-muted block">
            RATIO ENGINE
          </span>
          <h1 className="font-playfair text-3xl font-bold text-luxe-text">
            Size Ratio Configurations
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => exportRatioReportPDF(ratios, attributeLevel, detectedSizes)}
            className="h-9 px-3.5 rounded text-xs font-medium border border-luxe-border text-luxe-text hover:bg-luxe-surface transition-colors flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-luxe-muted" />
            <span>Export Report PDF</span>
          </button>
          <button
            onClick={() => navigate('/admin/ratios/studio')}
            className="h-9 px-4 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors flex items-center gap-2 shadow-subtle"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Interactive Ratio Studio</span>
          </button>
          <button
            onClick={() => navigate('/admin/user-view/ratios/new')}
            className="h-9 px-3.5 rounded text-xs font-medium border border-luxe-border text-luxe-text hover:bg-luxe-surface transition-colors flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5 text-luxe-muted" />
            <span>Create Rule Form</span>
          </button>
        </div>
      </div>

      <div className="border border-luxe-border rounded overflow-x-auto bg-luxe-surface">
        <table className="w-full text-left text-xs">
          <thead className="bg-luxe-bg border-b border-luxe-border text-luxe-muted uppercase text-[10px] tracking-wider font-bold">
            <tr>
              <th className="py-3 px-4">Grade</th>
              <th className="py-3 px-4">Attribute Level</th>
              <th className="py-3 px-4">Group Key</th>
              <th className="py-3 px-4">Normalized Ratio Output</th>
              <th className="py-3 px-4">Created Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-luxe-border/80 font-sans">
            {filteredRatios.map((r) => (
              <tr key={r.id} className="hover:bg-luxe-bg/60 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-luxe-text">Grade {r.grade}</td>
                <td className="py-3.5 px-4 text-luxe-muted">{r.attributeLevel}</td>
                <td className="py-3.5 px-4 font-bold text-luxe-text">{r.groupKey}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-luxe-text">{r.normalizedRatio}</td>
                <td className="py-3.5 px-4 text-luxe-muted font-mono">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="py-3.5 px-4 text-right space-x-3">
                  <button onClick={() => navigate(`/admin/ratios/${r.id}`)} className="text-xs font-semibold text-luxe-text hover:underline">
                    View →
                  </button>
                  <button onClick={() => navigate(`/admin/ratios/${r.id}/history`)} className="text-xs text-luxe-muted hover:text-luxe-text">
                    History
                  </button>
                  <button onClick={() => deleteRatioConfig(r.id)} className="text-xs text-rose-600 hover:underline">
                    Delete
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
