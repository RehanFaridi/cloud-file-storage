import axios from 'axios';
import { supabase } from './supabase';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export const getFiles = () => API.get('/files');
export const saveFileMetadata = (data) => API.post('/files/metadata', data);
export const getDownloadUrl = (fileId) => API.get(`/files/${fileId}/download`);
export const deleteFile = (fileId) => API.delete(`/files/${fileId}`);
export const shareFile = (fileId, payload) => API.post(`/files/${fileId}/share`, payload);
export const getFileVersions = (fileId) => API.get(`/files/${fileId}/versions`);
