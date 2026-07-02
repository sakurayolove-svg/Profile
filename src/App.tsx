import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { KnowledgePage } from '@/pages/KnowledgePage';
import { LifePage } from '@/pages/LifePage';
import { db } from '@/stores/db';

function App() {
  useEffect(() => {
    db.init().catch(console.error);
  }, []);

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/knowledge" element={<KnowledgePage />} />
          <Route path="/life" element={<LifePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
