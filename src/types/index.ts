export interface PageItem {
  id: string;
  title: string;
  content: string;
  files: FileItem[];
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'other';
  size: number;
  data: string; // base64 or blob url
  mimeType: string;
  createdAt: number;
}

export interface PageData {
  id: string;
  title: string;
  description: string;
  items: PageItem[];
}

export type PageType = 'home' | 'projects' | 'knowledge' | 'life';

export const PAGE_CONFIG: Record<PageType, { title: string; description: string; icon: string }> = {
  home: { title: '简介', description: '关于我的个人介绍', icon: 'User' },
  projects: { title: '项目', description: '我的项目作品', icon: 'FolderGit' },
  knowledge: { title: '知识', description: '学习笔记与知识整理', icon: 'BookOpen' },
  life: { title: '生活', description: '生活点滴与感悟', icon: 'Coffee' },
};
