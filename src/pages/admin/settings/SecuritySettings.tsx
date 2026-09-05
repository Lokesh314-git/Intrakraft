import React, { useState } from 'react';
import { Save, ShieldCheck } from 'lucide-react';
import { isFirebaseConfigured } from '../../../services/firebase';
import { useAppStore } from '../../../store/useAppStore';

export const SecuritySettings: React.FC = () => {
  const { settings, updateSettings, addToast } = useAppStore();
  const [enableOAuth, setEnableOAuth] = useState(settings.security.enableOAuth ?? true);
  const [enforceRBAC, setEnforceRBAC] = useState(settings.security.enforceRBAC ?? true);
  const [sessionTimeout, setSessionTimeout] = useState(settings.security.sessionTimeout || '30 Minutes');
  const [require2FA, setRequire2FA] = useState(settings.security.require2FA ?? false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      security: {
        enableOAuth,
        enforceRBAC,
        sessionTimeout,
        require2FA,
      },
    });
  };

  return (
    <form onSubmit={handleSave} className="border border-luxe-border rounded bg-luxe-surface p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-luxe-border pb-4">
        <div>
          <h3 className="font-playfair text-xl font-bold text-luxe-text">Authentication & Security Settings</h3>
          <p className="text-xs text-luxe-muted mt-0.5">Firebase SDK authentication policies, role permissions, and access controls.</p>
        </div>
        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isFirebaseConfigured ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-luxe-bg text-luxe-muted border border-luxe-border'
          }`}>
          {isFirebaseConfigured ? 'Firebase SDK Active' : 'Demo Auth Engine'}
        </span>
      </div>

      <div className="space-y-4 text-xs max-w-lg">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="enable-oauth"
            checked={enableOAuth}
            onChange={(e) => setEnableOAuth(e.target.checked)}
            className="rounded border-luxe-border text-luxe-dark focus:ring-0"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="enforce-rbac"
            checked={enforceRBAC}
            onChange={(e) => setEnforceRBAC(e.target.checked)}
            className="rounded border-luxe-border text-luxe-dark focus:ring-0"
          />
          <label htmlFor="enforce-rbac" className="text-luxe-text font-medium cursor-pointer">
            Enforce Merchandising Role-Based Access Control (RBAC)
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="require-2fa"
            checked={require2FA}
            onChange={(e) => setRequire2FA(e.target.checked)}
            className="rounded border-luxe-border text-luxe-dark focus:ring-0"
          />
          <label htmlFor="require-2fa" className="text-luxe-text font-medium cursor-pointer">
            Require 2-Factor Authentication for Admin & Catalog Modifications
          </label>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1.5">
            Session Timeout / Inactivity Auto Logout
          </label>
          <select
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(e.target.value)}
            className="w-full bg-luxe-bg border border-luxe-border rounded px-3.5 py-2 text-luxe-text focus:border-luxe-dark focus:outline-none font-medium"
          >
            <option value="15 Minutes">15 Minutes</option>
            <option value="30 Minutes">30 Minutes</option>
            <option value="1 Hour">1 Hour</option>
            <option value="Never">Never (Persist Session)</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-luxe-border flex items-center justify-between">
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Security Settings</span>
        </button>

        <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>RBAC Enforcement: {enforceRBAC ? 'Active' : 'Disabled'}</span>
        </div>
      </div>
    </form>
  );
};
