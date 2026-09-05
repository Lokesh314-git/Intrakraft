import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

export const GeneralSettings: React.FC = () => {
  const { settings, updateSettings } = useAppStore();
  const [platformName, setPlatformName] = useState(settings.general.platformName);
  const [currency, setCurrency] = useState(settings.general.currency);
  const [supportEmail, setSupportEmail] = useState(settings.general.supportEmail || 'support@luxefashion.com');
  const [itemsPerPage, setItemsPerPage] = useState(settings.general.itemsPerPage || 12);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      general: {
        platformName,
        currency: currency as any,
        supportEmail,
        itemsPerPage: Number(itemsPerPage),
      },
    });
    document.title = platformName;
  };

  return (
    <form onSubmit={handleSave} className="border border-luxe-border rounded bg-luxe-surface p-6 sm:p-8 space-y-6">
      <div className="border-b border-luxe-border pb-4">
        <h3 className="font-playfair text-xl font-bold text-luxe-text">General Settings</h3>
        <p className="text-xs text-luxe-muted mt-0.5">Manage platform identification, currency formatting, and pagination.</p>
      </div>

      <div className="space-y-4 text-xs max-w-lg">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1.5">
            Platform Brand Title
          </label>
          <input
            type="text"
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
            className="w-full bg-luxe-bg border border-luxe-border rounded px-3.5 py-2 text-luxe-text focus:border-luxe-dark focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1.5">
            Display Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as any)}
            className="w-full bg-luxe-bg border border-luxe-border rounded px-3.5 py-2 text-luxe-text focus:border-luxe-dark focus:outline-none font-medium"
          >
            <option value="USD ($)">USD ($)</option>
            <option value="EUR (€)">EUR (€)</option>
            <option value="GBP (£)">GBP (£)</option>
            <option value="INR (₹)">INR (₹)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1.5">
            Support / Contact Email
          </label>
          <input
            type="email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            className="w-full bg-luxe-bg border border-luxe-border rounded px-3.5 py-2 text-luxe-text focus:border-luxe-dark focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1.5">
            Default Catalogue Grid Limit
          </label>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="w-full bg-luxe-bg border border-luxe-border rounded px-3.5 py-2 text-luxe-text focus:border-luxe-dark focus:outline-none font-medium"
          >
            <option value={12}>12 Items Per Page</option>
            <option value={24}>24 Items Per Page</option>
            <option value={48}>48 Items Per Page</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-luxe-border">
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save General Settings</span>
        </button>
      </div>
    </form>
  );
};
