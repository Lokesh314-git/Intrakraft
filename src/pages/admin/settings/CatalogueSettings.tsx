import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { Grade } from '../../../types';

export const CatalogueSettings: React.FC = () => {
  const { settings, updateSettings } = useAppStore();
  const [defaultGrade, setDefaultGrade] = useState<Grade>(settings.catalogue.defaultGrade || 'A');
  const [enableAutoDynamicSize, setEnableAutoDynamicSize] = useState(settings.catalogue.enableAutoDynamicSize);
  const [autoCalculateRatios, setAutoCalculateRatios] = useState(settings.catalogue.autoCalculateRatios);
  const [strictIngestionValidation, setStrictIngestionValidation] = useState(settings.catalogue.strictIngestionValidation);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      catalogue: {
        defaultGrade,
        enableAutoDynamicSize,
        autoCalculateRatios,
        strictIngestionValidation,
      },
    });
  };

  return (
    <form onSubmit={handleSave} className="border border-luxe-border rounded bg-luxe-surface p-6 sm:p-8 space-y-6">
      <div className="border-b border-luxe-border pb-4">
        <h3 className="font-playfair text-xl font-bold text-luxe-text">Catalogue & Size Detection Settings</h3>
        <p className="text-xs text-luxe-muted mt-0.5">Configure automated ingestion, size extraction rules, and validation policies.</p>
      </div>

      <div className="space-y-4 text-xs max-w-lg">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1.5">
            Default Grade Classification Fallback
          </label>
          <select
            value={defaultGrade}
            onChange={(e) => setDefaultGrade(e.target.value as Grade)}
            className="w-full bg-luxe-bg border border-luxe-border rounded px-3.5 py-2 text-luxe-text focus:border-luxe-dark focus:outline-none font-medium"
          >
            <option value="A">Grade A (Premium Line)</option>
            <option value="B">Grade B (Core Essential)</option>
            <option value="C">Grade C (Standard Line)</option>
            <option value="D">Grade D (Outlet/Basic)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="dynamic-size"
            checked={enableAutoDynamicSize}
            onChange={(e) => setEnableAutoDynamicSize(e.target.checked)}
            className="rounded border-luxe-border text-luxe-dark focus:ring-0"
          />
          <label htmlFor="dynamic-size" className="text-luxe-text font-medium cursor-pointer">
            Enable Automatic Dynamic Size Detection on Excel Upload
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="auto-ratio"
            checked={autoCalculateRatios}
            onChange={(e) => setAutoCalculateRatios(e.target.checked)}
            className="rounded border-luxe-border text-luxe-dark focus:ring-0"
          />
          <label htmlFor="auto-ratio" className="text-luxe-text font-medium cursor-pointer">
            Auto-generate Grade Ratio Suggestions on Ingestion
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="strict-val"
            checked={strictIngestionValidation}
            onChange={(e) => setStrictIngestionValidation(e.target.checked)}
            className="rounded border-luxe-border text-luxe-dark focus:ring-0"
          />
          <label htmlFor="strict-val" className="text-luxe-text font-medium cursor-pointer">
            Enforce Strict Column Validation (Name, Category, Price required)
          </label>
        </div>
      </div>

      <div className="pt-4 border-t border-luxe-border">
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Catalogue Settings</span>
        </button>
      </div>
    </form>
  );
};
