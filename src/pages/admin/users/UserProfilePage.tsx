import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

export const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, cart, ratios, activityLogs } = useAppStore();
  const navigate = useNavigate();

  const [tab, setTab] = useState<'profile' | 'activity' | 'cart' | 'ratios'>('profile');

  const profileUser = user || {
    uid: 'usr-merchandiser-01',
    name: 'Alexander Sterling',
    email: 'a.sterling@louisvuitton.com',
    company: 'LVMH Merchandising Group',
    role: 'Merchandising Lead',
    createdAt: '2026-09-01T08:00:00Z',
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-3 border-b border-luxe-border pb-6">
        <button
          onClick={() => navigate('/admin/users')}
          className="p-2 rounded border border-luxe-border bg-luxe-surface text-luxe-muted hover:text-luxe-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-luxe-muted block">
            USER PROFILE
          </span>
          <h1 className="font-playfair text-3xl font-bold text-luxe-text">
            {profileUser.name}
          </h1>
        </div>
      </div>

      <div className="flex border-b border-luxe-border gap-6 text-xs font-semibold">
        {(['profile', 'activity', 'cart', 'ratios'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2.5 uppercase tracking-wider text-[11px] transition-colors ${tab === t
                ? 'border-b-2 border-luxe-dark text-luxe-text font-bold'
                : 'text-luxe-muted hover:text-luxe-text'
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="border border-luxe-border rounded bg-luxe-surface p-6 space-y-4 max-w-xl">
          <div className="flex items-center gap-4 border-b border-luxe-border pb-6">
            <div className="w-12 h-12 rounded-full bg-luxe-dark text-luxe-bg flex items-center justify-center font-bold text-lg font-mono">
              {profileUser.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-playfair text-xl font-bold text-luxe-text">{profileUser.name}</h3>
              <p className="text-xs text-luxe-muted font-medium mt-0.5">{profileUser.role}</p>
            </div>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-luxe-border/60 pb-2"><span className="text-luxe-muted">Email</span><span className="font-bold text-luxe-text">{profileUser.email}</span></div>
            <div className="flex justify-between border-b border-luxe-border/60 pb-2"><span className="text-luxe-muted">Company</span><span className="font-bold text-luxe-text">{profileUser.company}</span></div>
            <div className="flex justify-between"><span className="text-luxe-muted">User ID</span><span className="font-mono text-luxe-text">{profileUser.uid}</span></div>
          </div>
        </div>
      )}

      {tab === 'cart' && (
        <div className="border border-luxe-border rounded bg-luxe-surface p-6 space-y-3">
          <h3 className="font-playfair text-lg font-bold text-luxe-text">User Cart Manifest ({cart.length} Items)</h3>
          <div className="divide-y divide-luxe-border text-xs">
            {cart.map((item) => (
              <div key={item.id} className="py-2.5 flex justify-between">
                <span className="font-bold text-luxe-text">{item.product.name} (Grade {item.grade})</span>
                <span className="font-mono font-bold text-luxe-text">{item.totalQuantity} Units</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'ratios' && (
        <div className="border border-luxe-border rounded bg-luxe-surface p-6 space-y-3">
          <h3 className="font-playfair text-lg font-bold text-luxe-text">User Saved Ratios ({ratios.length} Rules)</h3>
          <div className="divide-y divide-luxe-border text-xs">
            {ratios.map((r) => (
              <div key={r.id} className="py-2.5 flex justify-between">
                <span className="font-bold text-luxe-text">Grade {r.grade} — {r.groupKey}</span>
                <span className="font-mono font-bold text-luxe-text">{r.normalizedRatio}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'activity' && (
        <div className="border border-luxe-border rounded bg-luxe-surface p-6 space-y-3">
          <h3 className="font-playfair text-lg font-bold text-luxe-text">Recent User Activity</h3>
          <div className="divide-y divide-luxe-border text-xs">
            {activityLogs.map((log) => (
              <div key={log.id} className="py-2.5">
                <p className="font-bold text-luxe-text">{log.action}</p>
                <p className="text-[11px] text-luxe-muted">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
