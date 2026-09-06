import React, { useEffect, useState } from 'react';
import { getFileVersions } from '../services/api';
import { X, Download } from 'lucide-react';

export default function VersionModal({ file, onClose }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFileVersions(file.id)
      .then(({ data }) => setVersions(data.versions || []))
      .catch(() => alert('Could not fetch versions'))
      .finally(() => setLoading(false));
  }, [file.id]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', width: '450px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Version History</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>File: {file.file_name}</p>

        {loading ? (
          <p>Loading historical revisions...</p>
        ) : versions.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No revisions found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, maxHeight: '220px', overflowY: 'auto' }}>
            {versions.map((ver) => (
              <li key={ver.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Revision v{ver.version_number}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(ver.created_at).toLocaleString()}</div>
                </div>
                {ver.downloadUrl && (
                  <a href={ver.downloadUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2563eb', textDecoration: 'none', fontSize: '0.85rem' }}>
                    <Download size={14} /> Download
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
