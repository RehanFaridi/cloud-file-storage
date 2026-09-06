import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import ShareModal from './components/ShareModal';
import VersionModal from './components/VersionModal';
import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { getFiles } from './services/api';

export default function App() {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [activeShareFile, setActiveShareFile] = useState(null);
  const [activeVersionFile, setActiveVersionFile] = useState(null);

  const fetchFiles = async () => {
    if (!user) return;
    try {
      const { data } = await getFiles();
      setFiles(data.files || []);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [user]);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'sans-serif' }}>
      <Navbar />
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
        {user ? (
          <>
            <FileUpload onUploadSuccess={fetchFiles} />
            <FileList
              files={files}
              onRefresh={fetchFiles}
              onOpenShare={(f) => setActiveShareFile(f)}
              onOpenVersions={(f) => setActiveVersionFile(f)}
            />
            {activeShareFile && <ShareModal file={activeShareFile} onClose={() => setActiveShareFile(null)} />}
            {activeVersionFile && <VersionModal file={activeVersionFile} onClose={() => setActiveVersionFile(null)} />}
          </>
        ) : (
          <AuthModal />
        )}
      </main>
    </div>
  );
}
