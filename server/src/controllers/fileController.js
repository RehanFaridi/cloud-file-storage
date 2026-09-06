import { supabaseAdmin } from '../config/supabase.js';

const BUCKET = process.env.SUPABASE_BUCKET_NAME || 'vault-files';

// 1. Save metadata & create initial version
export const saveMetadata = async (req, res) => {
  try {
    const { fileName, storagePath, mimeType, sizeBytes } = req.body;

    // Check if file with same name exists for this user to trigger versioning
    const { data: existingFile } = await supabaseAdmin
      .from('files')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('file_name', fileName)
      .single();

    if (existingFile) {
      // Calculate current version count
      const { count } = await supabaseAdmin
        .from('file_versions')
        .select('*', { count: 'exact', head: true })
        .eq('file_id', existingFile.id);

      const nextVersion = (count || 0) + 2;

      // Update primary file pointer
      const { data: updatedFile, error: updateErr } = await supabaseAdmin
        .from('files')
        .update({
          storage_path: storagePath,
          size_bytes: sizeBytes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingFile.id)
        .select()
        .single();

      if (updateErr) throw updateErr;

      // Insert into versions table
      await supabaseAdmin.from('file_versions').insert([
        {
          file_id: existingFile.id,
          storage_path: storagePath,
          version_number: nextVersion,
          size_bytes: sizeBytes,
        },
      ]);

      return res.status(200).json({ message: 'New version uploaded', file: updatedFile });
    }

    // New file insert
    const { data: newFile, error: insertErr } = await supabaseAdmin
      .from('files')
      .insert([
        {
          user_id: req.user.id,
          file_name: fileName,
          storage_path: storagePath,
          mime_type: mimeType,
          size_bytes: sizeBytes,
        },
      ])
      .select()
      .single();

    if (insertErr) throw insertErr;

    // Add version 1 entry
    await supabaseAdmin.from('file_versions').insert([
      {
        file_id: newFile.id,
        storage_path: storagePath,
        version_number: 1,
        size_bytes: sizeBytes,
      },
    ]);

    res.status(201).json({ message: 'File created successfully', file: newFile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. List user files
export const listFiles = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('files')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ files: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Generate secure download signed URL from Supabase Storage
export const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: file, error } = await supabaseAdmin
      .from('files')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !file) return res.status(404).json({ error: 'File not found' });
    if (file.user_id !== req.user.id && !file.is_public) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(file.storage_path, 3600); // 1 hour validity

    if (signErr) throw signErr;
    res.status(200).json({ downloadUrl: signed.signedUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Delete file from Supabase Storage & DB
export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: file, error } = await supabaseAdmin
      .from('files')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !file) return res.status(404).json({ error: 'File not found' });
    if (file.user_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    // Remove from Supabase Storage
    await supabaseAdmin.storage.from(BUCKET).remove([file.storage_path]);

    // Delete row (cascades to file_versions and file_shares)
    await supabaseAdmin.from('files').delete().eq('id', id);

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Share file access
export const shareFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const { data, error } = await supabaseAdmin
      .from('file_shares')
      .insert([{ file_id: id, shared_with_email: email, permission: 'view' }])
      .select();

    if (error) throw error;
    res.status(200).json({ message: 'Access granted', share: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Get versions list
export const getVersions = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: versions, error } = await supabaseAdmin
      .from('file_versions')
      .select('*')
      .eq('file_id', id)
      .order('version_number', { ascending: false });

    if (error) throw error;

    // Attach signed download URLs for each version
    const versionsWithUrls = await Promise.all(
      versions.map(async (v) => {
        const { data: signed } = await supabaseAdmin.storage
          .from(BUCKET)
          .createSignedUrl(v.storage_path, 3600);
        return {
          ...v,
          downloadUrl: signed?.signedUrl || null,
        };
      })
    );

    res.status(200).json({ versions: versionsWithUrls });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
