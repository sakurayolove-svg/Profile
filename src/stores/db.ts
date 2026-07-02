import { PageData, FileItem, PageType, PageMeta, ProfileData } from '@/types';

const DB_NAME = 'PersonalWebsiteDB';
const DB_VERSION = 2;

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

        if (!db.objectStoreNames.contains('pages_meta')) {
          db.createObjectStore('pages_meta', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('profile')) {
          db.createObjectStore('profile', { keyPath: 'id' });
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

  async deletePage(type: PageType): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('pages', 'readwrite');
      const request = store.delete(type);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async listPages(): Promise<PageMeta[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('pages_meta');
      const request = store.getAll();
      request.onsuccess = () => {
        const result = request.result as { id: string; data: PageMeta }[];
        resolve(result.map(r => r.data).sort((a, b) => a.order - b.order));
      };
      request.onerror = () => reject(request.error);
    });
  }

  async savePageMeta(meta: PageMeta): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('pages_meta', 'readwrite');
      const request = store.put({ id: meta.id, data: meta });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deletePageMeta(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('pages_meta', 'readwrite');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getProfile(): Promise<ProfileData> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('profile');
      const request = store.get('main');
      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.data);
        } else {
          resolve({
            name: '',
            bio: '',
            email: '',
            location: '',
            avatar: '',
            socials: [],
            siteTitle: '我的网站',
            aboutTitle: '关于我',
          });
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async saveProfile(data: ProfileData): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('profile', 'readwrite');
      const request = store.put({ id: 'main', data });
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
    const pageMetas = await this.listPages();
    const profile = await this.getProfile();

    pages['home'] = await this.getPage('home');
    for (const meta of pageMetas) {
      pages[meta.id] = await this.getPage(meta.id);
    }

    return JSON.stringify({ pages, pageMetas, profile }, null, 2);
  }

  async importAll(jsonStr: string): Promise<void> {
    const data = JSON.parse(jsonStr) as {
      pages?: Record<string, PageData>;
      pageMetas?: PageMeta[];
      profile?: ProfileData;
    };

    if (data.pages) {
      for (const [type, pageData] of Object.entries(data.pages)) {
        await this.savePage(type as PageType, pageData);
      }
    }

    if (data.pageMetas) {
      for (const meta of data.pageMetas) {
        await this.savePageMeta(meta);
      }
    }

    if (data.profile) {
      await this.saveProfile(data.profile);
    }
  }
}

export const db = new Database();
