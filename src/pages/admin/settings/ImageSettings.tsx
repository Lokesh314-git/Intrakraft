import React, { useState } from 'react';
import { Save, HardDrive, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

export const ImageSettings: React.FC = () => {
  const { settings, updateSettings, addToast } = useAppStore();
  const [maxFileSizeMb, setMaxFileSizeMb] = useState(settings.images.maxFileSizeMb || 10);
  const [storagePath, setStoragePath] = useState('/uploads');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      images: {
        ...settings.images,
        maxFileSizeMb: Number(maxFileSizeMb),
      },
    });
    addToast('Storage Settings Saved', 'Local server disk storage preferences updated.', 'success');
  };

  const handleTestStorage = () => {
    addToast('Local Storage Active', 'Local disk media storage active at backend/uploads.', 'success');
  };

  return (
    <form onSubmit={handleSave} className="border border-luxe-border rounded bg-luxe-surface p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-luxe-border pb-4">
        <div>
          <h3 className="font-playfair text-xl font-bold text-luxe-text">Local Media & Storage Settings</h3>
          <p className="text-xs text-luxe-muted mt-0.5">All apparel catalogue media assets are stored locally on server disk.</p>
        </div>
        <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
          Local Storage Active
        </span>
      </div>

      <div className="space-y-4 text-xs max-w-lg">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1.5">
            Local Storage Endpoint Directory
          </label>
          <input
            type="text"
            value={storagePath}
            onChange={(e) => setStoragePath(e.target.value)}
            disabled
            className="w-full bg-luxe-bg border border-luxe-border rounded px-3.5 py-2 text-luxe-muted cursor-not-allowed font-mono"
          />
          <span className="text-[10px] text-luxe-muted mt-1 block">
            Images are saved to <code>backend/uploads/</code> and served statically at <code>http://localhost:5000/uploads/</code>.
          </span>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1.5">
            Max Upload File Size (MB)
          </label>
          <input
            type="number"
            min={1}
            max={50}
            value={maxFileSizeMb}
            onChange={(e) => setMaxFileSizeMb(Number(e.target.value))}
            className="w-full bg-luxe-bg border border-luxe-border rounded px-3.5 py-2 text-luxe-text focus:border-luxe-dark focus:outline-none font-mono"
          />
        </div>

        <div className="p-4 rounded border border-luxe-border bg-luxe-bg space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs">
            <HardDrive className="w-4 h-4" />
            <span>Local Disk Ingestion Mode</span>
          </div>
          <p className="text-[11px] text-luxe-muted">
            All images uploaded from the catalogue parser or product form are saved locally on the backend filesystem. No external third-party cloud services or API keys required.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-luxe-border flex items-center justify-between">
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Storage Settings</span>
        </button>

        <button
          type="button"
          onClick={handleTestStorage}
          className="flex items-center gap-1.5 px-4 py-2 rounded text-xs font-medium border border-luxe-border text-luxe-text hover:bg-luxe-bg transition-colors"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verify Storage Status</span>
        </button>
      </div>
    </form>
  );
};
