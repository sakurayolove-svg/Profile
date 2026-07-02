import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { PageEditor } from '@/components/PageEditor';
import { db } from '@/stores/db';
import { PageMeta, DEFAULT_PAGES } from '@/types';

function App() {
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.init().catch(console.error);
  }, []);

  useEffect(() => {
    const load = async () => {
      await db.init();
      let stored = await db.listPages();
      if (stored.length === 0) {
        for (const page of DEFAULT_PAGES) {
          await db.savePageMeta(page);
        }
        stored = DEFAULT_PAGES;
      }
      setPages(stored);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <HashRouter>
      <Layout pages={pages}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {pages.map(page => (
            <Route
              key={page.id}
              path={`/${page.id}`}
              element={<PageEditor pageType={page.id} pageMeta={page} />}
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
