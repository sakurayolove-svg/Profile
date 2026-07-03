import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Download, Upload, Plus } from 'lucide-react';
import { db } from '@/stores/db';
import { PageMeta } from '@/types';
import { useProfileContext } from '@/contexts/ProfileContext';
import { PageManager } from './PageManager';

interface LayoutProps {
  children: React.ReactNode;
  pages: PageMeta[];
}

export const Layout: React.FC<LayoutProps> = ({ children, pages }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showPageManager, setShowPageManager] = useState(false);
  const { profile } = useProfileContext();
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
    try {
      await db.importAll(await file.text());
      window.location.reload();
    } catch {
      alert('导入失败');
    }
  };

  const navItems = [
    { path: '/', label: profile.siteTitle || '魔术师小站' },
    ...pages.map(p => ({ path: `/${p.id}`, label: p.title })),
  ];

  return (
    <div>
      <header className="masthead">
        <div className="masthead__inner-wrap">
          <div className="masthead__menu">
            <nav className="greedy-nav">
              <ul className="visible-links">
                {navItems.map(item => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path} className={isActive ? 'masthead__menu-item masthead__menu-item--lg' : 'masthead__menu-item'}>
                      <Link to={item.path} onClick={() => setShowSettings(false)} style={{ color: isActive ? '#224b8d' : undefined }}>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#494e52' }}
                >
                  <Settings size={18} />
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {showSettings && (
        <div className="settings-menu">
          <button onClick={handleExport}><Download size={14} style={{ marginRight: 6 }} /> 导出备份</button>
          <label>
            <Upload size={14} style={{ marginRight: 6 }} /> 导入备份
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button onClick={() => { setShowPageManager(true); setShowSettings(false); }}>
            <Plus size={14} style={{ marginRight: 6 }} /> 管理页面
          </button>
        </div>
      )}

      {children}

      {showPageManager && <PageManager onClose={() => setShowPageManager(false)} />}
    </div>
  );
};
