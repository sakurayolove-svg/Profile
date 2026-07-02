import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  User, FolderGit, BookOpen, Coffee, Menu, X, 
  Download, Upload, Settings, Plus
} from 'lucide-react';
import { db } from '@/stores/db';
import { PageMeta, ProfileData } from '@/types';
import { PageManager } from './PageManager';

const iconMap: Record<string, React.ElementType> = {
  User,
  FolderGit,
  BookOpen,
  Coffee,
};

function getIcon(iconName: string) {
  return iconMap[iconName] || FolderGit;
}

interface LayoutProps {
  children: React.ReactNode;
  pages: PageMeta[];
}

const defaultProfile: ProfileData = {
  name: '',
  bio: '',
  email: '',
  location: '',
  avatar: '',
  socials: [],
  siteTitle: '我的网站',
  aboutTitle: '关于我',
};

export const Layout: React.FC<LayoutProps> = ({ children, pages }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPageManager, setShowPageManager] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const location = useLocation();

  useEffect(() => {
    db.init().then(() => {
      db.getProfile().then(setProfile);
    });
  }, []);

  const handleExport = async () => {
    const data = await db.exportAll();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `website-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    try {
      await db.importAll(text);
      window.location.reload();
    } catch (error) {
      alert('导入失败，请检查文件格式');
    }
  };

  const navItems = [
    { path: '/', label: 'Homepage', icon: User },
    ...pages.map(p => ({ path: `/${p.id}`, label: p.title, icon: getIcon(p.icon) })),
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="text-lg font-bold text-gray-900 hover:no-underline">
              {profile.siteTitle || '我的网站'}
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium
                              transition-colors hover:no-underline
                              ${isActive 
                                ? 'text-primary' 
                                : 'text-text hover:text-primary'
                              }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-text hover:bg-gray-100 rounded transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-text hover:bg-gray-100 rounded"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {showSettings && (
          <div className="absolute right-4 top-12 w-56 bg-white rounded shadow-lg 
                        border border-gray-200 p-3 z-50 text-sm">
            <div className="space-y-1">
              <button
                onClick={handleExport}
                className="w-full flex items-center gap-2 px-3 py-2 text-text 
                         hover:bg-gray-50 rounded transition-colors"
              >
                <Download className="w-4 h-4" />
                导出备份
              </button>
              <label className="w-full flex items-center gap-2 px-3 py-2 text-text 
                              hover:bg-gray-50 rounded transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                导入备份
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => {
                  setShowPageManager(true);
                  setShowSettings(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-text 
                         hover:bg-gray-50 rounded transition-colors"
              >
                <Plus className="w-4 h-4" />
                管理页面
              </button>
            </div>
          </div>
        )}
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-border">
          <div className="px-4 py-2 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium
                            transition-colors hover:no-underline
                            ${isActive 
                              ? 'text-primary' 
                              : 'text-text hover:text-primary'
                            }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>

      {showPageManager && (
        <PageManager onClose={() => setShowPageManager(false)} />
      )}
    </div>
  );
};
