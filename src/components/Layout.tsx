import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  User, FolderGit, BookOpen, Coffee, Menu, X, 
  Download, Upload, Settings 
} from 'lucide-react';
import { db } from '@/stores/db';

const navItems = [
  { path: '/', label: '简介', icon: User },
  { path: '/projects', label: '项目', icon: FolderGit },
  { path: '/knowledge', label: '知识', icon: BookOpen },
  { path: '/life', label: '生活', icon: Coffee },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const location = useLocation();

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

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="text-xl font-bold text-gray-900">
              我的网站
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                              transition-colors
                              ${isActive 
                                ? 'bg-primary/10 text-primary' 
                                : 'text-gray-600 hover:bg-gray-100'
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
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {showSettings && (
          <div className="absolute right-4 top-14 w-64 bg-white rounded-xl shadow-lg 
                        border border-gray-200 p-4 z-50">
            <h3 className="font-semibold text-gray-900 mb-3">数据管理</h3>
            <div className="space-y-2">
              <button
                onClick={handleExport}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 
                         hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                导出备份
              </button>
              <label className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 
                              hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                导入备份
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                            transition-colors
                            ${isActive 
                              ? 'bg-primary/10 text-primary' 
                              : 'text-gray-600 hover:bg-gray-50'
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

      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
