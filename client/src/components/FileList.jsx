import React from 'react';
import { Download, Trash2, Share2, History, FileText } from 'lucide-react';
import { getDownloadUrl, deleteFile } from '../services/api';

export default function FileList({ files, onRefresh, onOpenShare, onOpenVersions }) {
  const handleDownload = async (fileId) => {
    try {
      const { data } = await getDownloadUrl(fileId);
      window.open(data.downloadUrl, '_blank');
    } catch {
      alert('Could not generate download link');
    }
  };

  const handleDelete = async (fileId) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    try {
      await deleteFile(fileId);
      onRefresh();
    } catch {
      alert('Delete failed');
    }
  };

  if (!files.length) {
    return <p style={{ textAlign: 'center', color: '#64748b' }}>No files found in your vault.</p>;
  }

  return (
    <div style={{ overflowX: 'auto', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#475569', background: '#f8fafc' }}>
            <th style={{ padding: '12px' }}>Name</th>
            <th style={{ padding: '12px' }}>Size</th>
            <th style={{ padding: '12px' }}>Date</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#64748b" /> {file.file_name}
              </td>
              <td style={{ padding: '12px' }}>{(file.size_bytes / (1024 * 1024)).toFixed(2)} MB</td>
              <td style={{ padding: '12px' }}>{new Date(file.created_at).toLocaleDateString()}</td>
              <td style={{ padding: '12px', textAlign: 'right' }}>
                <button onClick={() => handleDownload(file.id)} title="Download" style={{ margin: '0 4px', cursor: 'pointer', background: 'none', border: 'none' }}><Download size={18} color="#2563eb" /></button>
                <button onClick={() => onOpenShare(file)} title="Share" style={{ margin: '0 4px', cursor: 'pointer', background: 'none', border: 'none' }}><Share2 size={18} color="#16a34a" /></button>
                <button onClick={() => onOpenVersions(file)} title="Version History" style={{ margin: '0 4px', cursor: 'pointer', background: 'none', border: 'none' }}><History size={18} color="#d97706" /></button>
                <button onClick={() => handleDelete(file.id)} title="Delete" style={{ margin: '0 4px', cursor: 'pointer', background: 'none', border: 'none' }}><Trash2 size={18} color="#dc2626" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
