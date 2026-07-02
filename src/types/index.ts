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
  data: string;
  mimeType: string;
  createdAt: number;
}

export interface PageData {
  id: string;
  title: string;
  description: string;
  items: PageItem[];
}

export interface PageMeta {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export type PageType = string;

export const DEFAULT_PAGES: PageMeta[] = [
  { id: 'projects', title: '项目', description: '我的项目作品', icon: 'FolderGit', order: 0 },
  { id: 'knowledge', title: '知识', description: '学习笔记与知识整理', icon: 'BookOpen', order: 1 },
  { id: 'life', title: '生活', description: '生活点滴与感悟', icon: 'Coffee', order: 2 },
];

export interface ProfileData {
  name: string;
  bio: string;
  email: string;
  location: string;
  avatar: string;
  socials: SocialLink[];
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}
