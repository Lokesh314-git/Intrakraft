import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

export const UserDirectoryPage: React.FC = () => {
  const { user, cart, ratios } = useAppStore();
  const navigate = useNavigate();

  const userList = [
    {
      uid: user?.uid || 'usr-merchandiser-01',
      name: user?.name || 'Alexander Sterling',
      email: user?.email || 'a.sterling@louisvuitton.com',
      company: user?.company || 'LVMH Merchandising',
      role: user?.role || 'Merchandising Lead',
      avatarUrl: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      status: 'Active',
      createdAt: '2026-09-01',
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-luxe-border pb-6">
        <span className="text-[10px] uppercase tracking-widest font-bold text-luxe-muted block">
          USER MANAGEMENT
        </span>
        <h1 className="font-playfair text-3xl font-bold text-luxe-text">
          User Directory
        </h1>
        <p className="text-xs text-luxe-muted mt-1">
          Manage team members, role permissions, and active merchandising sessions.
        </p>
      </div>

      <div className="border border-luxe-border rounded overflow-x-auto bg-luxe-surface">
        <table className="w-full text-left text-xs">
          <thead className="bg-luxe-bg border-b border-luxe-border text-luxe-muted uppercase text-[10px] tracking-wider font-bold">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Cart Lines</th>
              <th className="py-3 px-4">Ratios</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-luxe-border/80 font-sans">
            {userList.map((u) => (
              <tr key={u.uid} className="hover:bg-luxe-bg/60 transition-colors">
                <td className="py-3.5 px-4 font-bold text-luxe-text flex items-center gap-3">
                  <img src={u.avatarUrl} alt={u.name} className="w-7 h-7 rounded-full object-cover border border-luxe-border" />
                  <span>{u.name}</span>
                </td>
                <td className="py-3.5 px-4 text-luxe-muted font-mono">{u.email}</td>
                <td className="py-3.5 px-4 text-luxe-text">{u.company}</td>
                <td className="py-3.5 px-4 font-semibold text-luxe-text">{u.role}</td>
                <td className="py-3.5 px-4 font-mono">{cart.length} lines</td>
                <td className="py-3.5 px-4 font-mono">{ratios.length} rules</td>
                <td className="py-3.5 px-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    {u.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => navigate(`/admin/users/${u.uid}`)}
                    className="text-xs font-semibold text-luxe-text hover:underline"
                  >
                    View →
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
