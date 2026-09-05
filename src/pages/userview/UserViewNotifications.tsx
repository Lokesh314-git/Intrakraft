import React from 'react';
import { Bell, Check, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const UserViewNotifications: React.FC = () => {
  const { userNotifications, markNotificationRead } = useAppStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-3xl mx-auto">
      <div className="border-b border-luxe-border pb-6 space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-widest text-luxe-muted block">
          SYSTEM ALERTS
        </span>
        <h1 className="font-playfair text-3xl font-bold text-luxe-text">User Notifications</h1>
        <p className="text-xs text-luxe-muted">
          Workspace notifications for ratio updates, catalogue ingestion, and wishlist updates.
        </p>
      </div>

      <div className="space-y-3">
        {userNotifications.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-luxe-border rounded bg-luxe-surface p-8">
            <p className="text-xs text-luxe-muted">No notifications right now.</p>
          </div>
        ) : (
          userNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 rounded border cursor-pointer transition-all flex items-start gap-3 ${
                n.read ? 'bg-luxe-surface border-luxe-border opacity-75' : 'bg-luxe-surface border-luxe-dark shadow-subtle'
              }`}
            >
              <div className="mt-0.5">{getIcon(n.type)}</div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-luxe-text">{n.title}</h4>
                  <span className="text-[10px] text-luxe-muted font-mono">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-xs text-luxe-muted">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
