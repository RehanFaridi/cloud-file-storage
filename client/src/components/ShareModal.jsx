import React, { useState } from 'react';
import { shareFile } from '../services/api';
import { X } from 'lucide-react';

export default function ShareModal({ file, onClose }) {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleShare = async (e) => {
    e.preventDefault();
    try {
      await shareFile(file.id, { email });
      setMsg(`Permissions granted to ${email}`);
      setEmail('');
    } catch {
      alert('Sharing failed');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', width: '380px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Share Resource</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Resource: {file.file_name}</p>
        <form onSubmit={handleShare}>
          <input
            type="email"
            placeholder="Collaborator email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '12px 0', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
          />
          <button type="submit" style={{ width: '100%', padding: '8px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Grant Access
          </button>
        </form>
        {msg && <p style={{ color: '#16a34a', fontSize: '0.85rem', marginTop: '8px' }}>{msg}</p>}
      </div>
    </div>
  );
}
