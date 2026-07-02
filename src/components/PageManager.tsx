import React, { useState } from 'react';
import { X, Plus, Trash2, FolderGit, BookOpen, Coffee, Briefcase, Star, Heart, Code, FileText } from 'lucide-react';
import { usePages } from '@/hooks/usePages';
import { PageMeta } from '@/types';
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
    if (!id) return;
    if (pages.some(p => p.id === id)) {
      alert('页面标识已存在，请使用不同的标题');
      return;
    }

    const page: PageMeta = {
      id,
      title: newTitle.trim(),
      description: newDesc.trim(),
      icon: newIcon,
      order: pages.length,
    };
    await addPage(page);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">管理页面</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-3 mb-6">
            {pages.map(page => {
              const Icon = iconOptions.find(i => i.name === page.icon)?.icon || FolderGit;
              return (
                <div key={page.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Icon className="w-5 h-5 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{page.title}</p>
                    <p className="text-sm text-gray-500 truncate">{page.description || '无描述'}</p>
                  </div>
                  <button
                    onClick={() => checkItems(page.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">新增页面</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="页面标题，如：论文"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="页面描述（可选）"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
              <div className="flex gap-2 flex-wrap">
                {iconOptions.map(({ name, icon: Icon }) => (
                  <button
                    key={name}
                    onClick={() => setNewIcon(name)}
                    className={`p-2 rounded-lg border transition-colors ${
                      newIcon === name
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 hover:border-gray-300 text-gray-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
              <button
                onClick={handleAdd}
                disabled={!newTitle.trim()}
                className="w-full py-2 bg-primary text-white rounded-lg flex items-center justify-center gap-2
                         disabled:opacity-50 hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> 添加页面
              </button>
            </div>
          </div>
        </div>
      </div>

      {deletingId && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">确认删除页面？</h3>
            <p className="text-gray-600 mb-4">
              {itemCounts[deletingId] > 0
                ? `该页面包含 ${itemCounts[deletingId]} 条内容，删除后无法恢复。`
                : '该页面为空，删除后无法恢复。'}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
