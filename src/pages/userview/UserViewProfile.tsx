import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const UserViewProfile: React.FC = () => {
  const { user, setUser, addToast } = useAppStore();

  const [name, setName] = useState(user?.name || 'Alexander Sterling');
  const [company, setCompany] = useState(user?.company || 'LVMH Merchandising Group');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setUser({ ...user, name, company });
    }
    addToast('Profile Updated', 'Saved user profile changes.', 'success');
  };

  return (
    <div className="space-y-8 pb-12 max-w-xl mx-auto">
      <div className="border-b border-luxe-border pb-6">
        <span className="text-[10px] uppercase tracking-widest font-bold text-luxe-muted block">
          USER PROFILE
        </span>
        <h1 className="font-playfair text-3xl font-bold text-luxe-text">My Profile</h1>
        <p className="text-xs text-luxe-muted mt-1">Manage user information and merchandising credentials.</p>
      </div>

      <form onSubmit={handleSave} className="border border-luxe-border rounded bg-luxe-surface p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 border-b border-luxe-border pb-6">
          <div className="w-14 h-14 rounded-full bg-luxe-dark text-luxe-bg font-mono font-bold text-xl flex items-center justify-center overflow-hidden">
            {user?.avatarUrl ? <img src={user.avatarUrl} alt={name} className="w-full h-full object-cover" /> : name.charAt(0)}
          </div>
          <div>
            <h3 className="font-playfair text-xl font-bold text-luxe-text">{name}</h3>
            <p className="text-xs text-luxe-muted font-medium mt-0.5">{user?.role || 'Merchandising Lead'}</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-luxe-bg border border-luxe-border rounded px-3.5 py-2 text-luxe-text focus:border-luxe-dark focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1.5">
              Work Email
            </label>
            <input
              type="email"
              disabled
              value={user?.email || 'a.sterling@louisvuitton.com'}
              className="w-full bg-luxe-bg/60 border border-luxe-border rounded px-3.5 py-2 text-luxe-muted cursor-not-allowed font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-luxe-muted mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-luxe-bg border border-luxe-border rounded px-3.5 py-2 text-luxe-text focus:border-luxe-dark focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-between text-luxe-muted border-t border-luxe-border">
            <span>Account Created:</span>
            <span className="font-bold text-luxe-text">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
