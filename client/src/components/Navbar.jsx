import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Cloud, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb' }}>
        <Cloud size={28} /> CloudVault
      </div>
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '0.9rem', color: '#4b5563' }}>{user.email}</span>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', border: '1px solid #ef4444', background: '#fff', color: '#ef4444', borderRadius: '6px', cursor: 'pointer' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </header>
  );
}
