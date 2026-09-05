import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

export const ActivityLogPage: React.FC = () => {
  const { activityLogs } = useAppStore();
  const [filterType, setFilterType] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredLogs = activityLogs.filter((log) => {
    if (filterType !== 'ALL' && log.type !== filterType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!log.action.toLowerCase().includes(q) && !log.details.toLowerCase().includes(q) && !log.user.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-luxe-border pb-6 space-y-1">
        <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-luxe-muted block">
          AUDIT & SECURITY
        </span>
        <h1 className="font-playfair text-3xl font-bold text-luxe-text">Activity & Audit Trail</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-luxe-muted absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action or details..."
            className="w-full bg-luxe-surface border border-luxe-border rounded pl-9 pr-3 py-1.5 text-xs text-luxe-text focus:border-luxe-dark focus:outline-none"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-luxe-surface border border-luxe-border rounded px-3 py-1.5 text-xs text-luxe-text font-medium focus:border-luxe-dark focus:outline-none"
        >
          <option value="ALL">All Categories</option>
          <option value="upload">CATALOGUE_UPLOAD</option>
          <option value="product">PRODUCT_CREATE / UPDATE</option>
          <option value="cart">CART_ADD / REMOVE</option>
          <option value="ratio">RATIO_CREATE / UPDATE</option>
          <option value="auth">USER_AUTH / LOGIN</option>
        </select>
      </div>

      <div className="border border-luxe-border rounded overflow-x-auto bg-luxe-surface">
        <table className="w-full text-left text-xs">
          <thead className="bg-luxe-bg border-b border-luxe-border text-luxe-muted uppercase text-[10px] tracking-wider font-bold">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Entity Details</th>
              <th className="py-3 px-4">IP / Session</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-luxe-border/80 font-sans">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-luxe-bg/60 transition-colors">
                <td className="py-3.5 px-4 font-mono text-luxe-muted">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="py-3.5 px-4 font-bold text-luxe-text">{log.user}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-luxe-text uppercase">{log.action}</td>
                <td className="py-3.5 px-4 text-luxe-text">{log.details}</td>
                <td className="py-3.5 px-4 font-mono text-[10px] text-luxe-muted">192.168.1.42 (TLS v1.3)</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
