import React, { useState } from 'react';
import { X, Plus, Trash2, FolderGit, BookOpen, Coffee, Briefcase, Star, Heart, Code, FileText } from 'lucide-react';
import { usePages } from '@/hooks/usePages';

import { db } from '@/stores/db';

const iconOptions = [
  { name: 'FolderGit', icon: FolderGit },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'Coffee', icon: Coffee },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Star', icon: Star },
  { name: 'Heart', icon: Heart },
  { name: 'Code', icon: Code },
  { name: 'FileText', icon: FileText },
];

interface PageManagerProps {
  onClose: () => void;
}

export const PageManager: React.FC<PageManagerProps> = ({ onClose }) => {
  const { pages, addPage, deletePage } = usePages();
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIcon, setNewIcon] = useState('FolderGit');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});

  const checkItems = async (id: string) => {
    const data = await db.getPage(id);
    setItemCounts(prev => ({ ...prev, [id]: data.items.length }));
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    await deletePage(deletingId);
    setDeletingId(null);
  };

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    const id = newTitle.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (!id || pages.some(p => p.id === id)) {
      alert('页面标识已存在');
      return;
    }
    await addPage({ id, title: newTitle.trim(), description: newDesc.trim(), icon: newIcon, order: pages.length });
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 style={{ margin: 0 }}>管理页面</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <div className="modal-body">
          <div style={{ marginBottom: '1.5em' }}>
            {pages.map(page => {
              const Icon = iconOptions.find(i => i.name === page.icon)?.icon || FolderGit;
              return (
                <div key={page.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5em', background: '#f8f9fa', marginBottom: 6, borderRadius: 3 }}>
                  <Icon size={18} />
                  <div style={{ flex: 1 }}>
                    <strong>{page.title}</strong>
                    <div style={{ fontSize: '0.85em', color: '#7a8288' }}>{page.description || '无描述'}</div>
                  </div>
                  <button onClick={() => checkItems(page.id)} className="edit-btn"><Trash2 size={14} /></button>
                </div>
              );
            })}
          </div>
          <div style={{ borderTop: '1px solid #f2f3f3', paddingTop: '1em' }}>
            <h4 style={{ marginTop: 0 }}>新增页面</h4>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="页面标题" style={{ marginBottom: 8 }} />
            <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="页面描述（可选）" style={{ marginBottom: 8 }} />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
              {iconOptions.map(({ name, icon: Icon }) => (
                <button key={name} onClick={() => setNewIcon(name)} style={{ padding: 6, border: newIcon === name ? '2px solid #224b8d' : '1px solid #ddd', borderRadius: 3 }}>
                  <Icon size={18} />
                </button>
              ))}
            </div>
            <button onClick={handleAdd} className="btn-primary" disabled={!newTitle.trim()}><Plus size={14} /> 添加页面</button>
          </div>
        </div>
      </div>

      {deletingId && (
        <div className="modal-overlay" style={{ zIndex: 110 }}>
          <div className="modal" style={{ maxWidth: 360 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>确认删除？</h3>
            </div>
            <div className="modal-body">
              <p>{itemCounts[deletingId] > 0 ? `该页面包含 ${itemCounts[deletingId]} 条内容，删除后无法恢复。` : '该页面为空，删除后无法恢复。'}</p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setDeletingId(null)} className="btn-secondary">取消</button>
              <button onClick={confirmDelete} className="btn-primary" style={{ background: '#c0392b' }}>删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
