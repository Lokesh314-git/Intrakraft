import React, { useState, useEffect } from 'react';
import { Save, Check } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

export const AppearanceSettings: React.FC = () => {
  const { settings, updateSettings } = useAppStore();
  const [theme, setTheme] = useState(settings.appearance.theme || 'luxe-classic');
  const [fontFamily, setFontFamily] = useState(settings.appearance.fontFamily || 'Playfair & Inter');
  const [compactMode, setCompactMode] = useState(settings.appearance.compactMode || false);
  const [showAnimations, setShowAnimations] = useState(settings.appearance.showAnimations ?? true);

  const themes = [
    {
      id: 'luxe-classic',
      name: 'Classic LUXÉ Off-White',
      desc: 'Warm Off-White (#F7F6F2) & Deep Charcoal (#111111)',
      previewBg: '#F7F6F2',
      previewDark: '#111111',
    },
    {
      id: 'obsidian-gold',
      name: 'Dark Obsidian & Gold',
      desc: 'Deep Black (#0F0F10) & Champagne Gold Accents (#D4AF37)',
      previewBg: '#0F0F10',
      previewDark: '#D4AF37',
    },
    {
      id: 'midnight-slate',
      name: 'Midnight Slate & Emerald',
      desc: 'Slate Dark (#0F172A) & Emerald (#10B981)',
      previewBg: '#0F172A',
      previewDark: '#10B981',
    },
    {
      id: 'rose-silk',
      name: 'Rose Gold & Cashmere',
      desc: 'Soft Rose (#FAF5F5) & Burgundy (#881337)',
      previewBg: '#FAF5F5',
      previewDark: '#881337',
    },
  ];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      appearance: {
        theme: theme as any,
        fontFamily: fontFamily as any,
        compactMode,
        showAnimations,
      },
    });
  };

  return (
    <form onSubmit={handleSave} className="border border-luxe-border rounded bg-luxe-surface p-6 sm:p-8 space-y-6">
      <div className="border-b border-luxe-border pb-4">
        <h3 className="font-playfair text-xl font-bold text-luxe-text">Appearance & Styling</h3>
        <p className="text-xs text-luxe-muted mt-0.5">Global design system, color palettes, typography, and density.</p>
      </div>

      <div className="space-y-6 text-xs max-w-lg">
        {/* Theme Palette Cards */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-2">
            Luxury Theme Palette
          </label>
          <div className="space-y-2.5">
            {themes.map((t) => (
              <div
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={`p-3.5 rounded border cursor-pointer flex items-center justify-between transition-all ${
                  theme === t.id
                    ? 'border-luxe-dark bg-luxe-surface shadow-subtle ring-1 ring-luxe-dark'
                    : 'border-luxe-border bg-luxe-bg/60 hover:bg-luxe-bg'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border border-luxe-border flex items-center justify-center overflow-hidden shrink-0">
                    <span className="w-1/2 h-full inline-block" style={{ backgroundColor: t.previewBg }} />
                    <span className="w-1/2 h-full inline-block" style={{ backgroundColor: t.previewDark }} />
                  </div>
                  <div>
                    <p className="font-bold text-luxe-text">{t.name}</p>
                    <p className="text-[10px] text-luxe-muted">{t.desc}</p>
                  </div>
                </div>

                {theme === t.id && (
                  <span className="px-2 py-0.5 rounded text-[9px] bg-luxe-dark text-luxe-bg font-bold uppercase tracking-wider flex items-center gap-1">
                    <Check className="w-3 h-3" /> Active
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Font Family */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1.5">
            Typography Pairing
          </label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value as any)}
            className="w-full bg-luxe-bg border border-luxe-border rounded px-3.5 py-2 text-luxe-text focus:border-luxe-dark focus:outline-none font-medium"
          >
            <option value="Playfair & Inter">Playfair Display & Inter (Editorial Luxury)</option>
            <option value="Cinzel & Roboto">Cormorant Garamond & Manrope (High Couture)</option>
            <option value="Plus Jakarta Sans">Inter & Plus Jakarta Sans (Modern Clean)</option>
          </select>
        </div>

        {/* Dense / Compact Mode */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="compact-mode"
            checked={compactMode}
            onChange={(e) => setCompactMode(e.target.checked)}
            className="rounded border-luxe-border text-luxe-dark focus:ring-0"
          />
          <label htmlFor="compact-mode" className="text-luxe-text font-medium cursor-pointer">
            Enable Compact Grid & Table Padding
          </label>
        </div>

        {/* Motion Animations */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="show-anim"
            checked={showAnimations}
            onChange={(e) => setShowAnimations(e.target.checked)}
            className="rounded border-luxe-border text-luxe-dark focus:ring-0"
          />
          <label htmlFor="show-anim" className="text-luxe-text font-medium cursor-pointer">
            Show Smooth Interface Motion & Micro-animations
          </label>
        </div>
      </div>

      <div className="pt-4 border-t border-luxe-border">
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Appearance</span>
        </button>
      </div>
    </form>
  );
};
