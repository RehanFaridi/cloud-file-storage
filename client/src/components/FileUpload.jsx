import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { saveFileMetadata } from '../services/api';
import { UploadCloud, Loader2 } from 'lucide-react';

export default function FileUpload({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to upload.');

      const storagePath = `${user.id}/${Date.now()}-${file.name}`;

      // 1. Direct upload into Supabase Storage
      const { error: uploadErr } = await supabase.storage
        .from('vault-files')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadErr) throw uploadErr;

      // 2. Save metadata in Supabase DB via server
      await saveFileMetadata({
        fileName: file.name,
        storagePath: storagePath,
        mimeType: file.type,
        sizeBytes: file.size,
      });

      onUploadSuccess();
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  return (
    <div style={{ margin: '2rem 0', border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '2rem', textAlign: 'center', background: '#f8fafc' }}>
      <label style={{ cursor: uploading ? 'not-allowed' : 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        {uploading ? <Loader2 size={36} className="animate-spin" color="#2563eb" /> : <UploadCloud size={36} color="#2563eb" />}
        <span style={{ fontWeight: 600, color: '#334155' }}>
          {uploading ? 'Storing in Supabase...' : 'Click or drop files here to upload'}
        </span>
        <input type="file" onChange={handleFileChange} disabled={uploading} style={{ display: 'none' }} />
      </label>
    </div>
  );
}
