import { useState, useEffect, useCallback } from 'react';
import { PageMeta, DEFAULT_PAGES } from '@/types';
import { db } from '@/stores/db';

export function usePages() {
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPages = useCallback(async () => {
    await db.init();
    const stored = await db.listPages();
    if (stored.length > 0) {
      setPages(stored);
    } else {
      for (const page of DEFAULT_PAGES) {
        await db.savePageMeta(page);
      }
      setPages([...DEFAULT_PAGES]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  const addPage = useCallback(async (page: PageMeta) => {
    await db.savePageMeta(page);
    setPages(prev => [...prev, page].sort((a, b) => a.order - b.order));
  }, []);

  const deletePage = useCallback(async (id: string) => {
    await db.deletePage(id);
    await db.deletePageMeta(id);
    setPages(prev => prev.filter(p => p.id !== id));
  }, []);

  const updatePage = useCallback(async (page: PageMeta) => {
    await db.savePageMeta(page);
    setPages(prev => prev.map(p => p.id === page.id ? page : p).sort((a, b) => a.order - b.order));
  }, []);

  return { pages, loading, addPage, deletePage, updatePage, refresh: loadPages };
}
