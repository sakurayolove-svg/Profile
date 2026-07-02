import { useState, useEffect, useCallback } from 'react';
import { PageData, PageItem, PageType } from '@/types';
import { db } from '@/stores/db';

export function usePageData(pageType: PageType) {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    db.init().then(() => {
      db.getPage(pageType).then(data => {
        setPageData(data);
        setLoading(false);
      });
    });
  }, [pageType]);

  const savePage = useCallback(async (data: PageData) => {
    await db.savePage(pageType, data);
    setPageData(data);
  }, [pageType]);

  const addItem = useCallback(async (item: PageItem) => {
    if (!pageData) return;
    const newData = {
      ...pageData,
      items: [...pageData.items, item].sort((a, b) => a.order - b.order)
    };
    await savePage(newData);
  }, [pageData, savePage]);

  const updateItem = useCallback(async (itemId: string, updates: Partial<PageItem>) => {
    if (!pageData) return;
    const newData = {
      ...pageData,
      items: pageData.items.map(item => 
        item.id === itemId ? { ...item, ...updates, updatedAt: Date.now() } : item
      )
    };
    await savePage(newData);
  }, [pageData, savePage]);

  const deleteItem = useCallback(async (itemId: string) => {
    if (!pageData) return;
    const newData = {
      ...pageData,
      items: pageData.items.filter(item => item.id !== itemId)
    };
    await savePage(newData);
  }, [pageData, savePage]);

  const reorderItems = useCallback(async (items: PageItem[]) => {
    if (!pageData) return;
    const newData = { ...pageData, items };
    await savePage(newData);
  }, [pageData, savePage]);

  return {
    pageData,
    loading,
    savePage,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
  };
}
