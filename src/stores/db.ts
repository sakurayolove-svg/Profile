import { PageData, PageItem, FileItem, PageType } from '@/types';

const DB_NAME = 'PersonalWebsiteDB';
const DB_VERSION = 1;

class Database {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('pages')) {
          const pageStore = db.createObjectStore('pages', { keyPath: 'id' });
          pageStore.createIndex('type', 'type', { unique: false });
        }

        if (!db.objectStoreNames.contains('files')) {
          const fileStore = db.createObjectStore('files', { keyPath: 'id' });
          fileStore.createIndex('itemId', 'itemId', { unique: false });
        }
      };
    });
  }

  private getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): IDBObjectStore {
    if (!this.db) throw new Error('Database not initialized');
    const transaction = this.db.transaction([storeName], mode);
    return transaction.objectStore(storeName);
  }

  async getPage(type: PageType): Promise<PageData> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('pages');
      const request = store.get(type);

      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.data);
        } else {
          resolve({
            id: type,
            title: '',
            description: '',
            items: []
          });
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async savePage(type: PageType, data: PageData): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('pages', 'readwrite');
      const request = store.put({ id: type, type, data });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async saveFile(file: FileItem, itemId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('files', 'readwrite');
      const request = store.put({ ...file, itemId });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getFilesByItem(itemId: string): Promise<FileItem[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('files');
      const index = store.index('itemId');
      const request = index.getAll(itemId);

      request.onsuccess = () => {
        const files = request.result.map(f => ({
          id: f.id,
          name: f.name,
          type: f.type,
          size: f.size,
          data: f.data,
          mimeType: f.mimeType,
          createdAt: f.createdAt,
        }));
        resolve(files);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteFile(fileId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('files', 'readwrite');
      const request = store.delete(fileId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async exportAll(): Promise<string> {
    const pages: Record<string, PageData> = {};
    const allTypes: PageType[] = ['home', 'projects', 'knowledge', 'life'];

    for (const type of allTypes) {
      pages[type] = await this.getPage(type);
    }

    return JSON.stringify(pages, null, 2);
  }

  async importAll(jsonStr: string): Promise<void> {
    const data = JSON.parse(jsonStr) as Record<string, PageData>;
    for (const [type, pageData] of Object.entries(data)) {
      await this.savePage(type as PageType, pageData);
    }
  }
}

export const db = new Database();
