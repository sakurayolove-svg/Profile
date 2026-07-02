import React, { useState } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { PageItem, PageMeta } from '@/types';
import { usePageData } from '@/hooks/usePageData';
import { EditableCard } from './EditableCard';
import { SortableList } from './SortableList';

interface PageEditorProps {
  pageType: string;
  pageMeta: PageMeta;
}

export const PageEditor: React.FC<PageEditorProps> = ({ pageType, pageMeta }) => {
  const { pageData, loading, addItem, updateItem, deleteItem, reorderItems, savePage } = usePageData(pageType);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editPageTitle, setEditPageTitle] = useState('');
  const [editPageDesc, setEditPageDesc] = useState('');

  const handleAddItem = () => {
    if (!newTitle.trim()) return;

    const newItem: PageItem = {
      id: crypto.randomUUID(),
      title: newTitle,
      content: newContent,
      files: [],
      order: pageData?.items.length || 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    addItem(newItem);
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  const handleSavePageInfo = () => {
    if (!pageData) return;
    savePage({
      ...pageData,
      title: editPageTitle,
      description: editPageDesc,
    });
    setIsEditingTitle(false);
  };

  const startEditPageInfo = () => {
    if (!pageData) return;
    setEditPageTitle(pageData.title || pageMeta.title);
    setEditPageDesc(pageData.description || pageMeta.description);
    setIsEditingTitle(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-4">
        {isEditingTitle ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editPageTitle}
              onChange={(e) => setEditPageTitle(e.target.value)}
              placeholder="页面标题"
              className="w-full text-2xl font-bold border-b border-gray-300 
                       focus:border-primary focus:outline-none py-1 bg-transparent"
            />
            <input
              type="text"
              value={editPageDesc}
              onChange={(e) => setEditPageDesc(e.target.value)}
              placeholder="页面描述"
              className="w-full text-gray-500 border-b border-gray-200 
                       focus:border-gray-400 focus:outline-none py-1 bg-transparent"
            />
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSavePageInfo}
                className="px-4 py-2 bg-primary text-white rounded 
                         flex items-center gap-1 hover:bg-blue-800 transition-colors"
              >
                <Check className="w-4 h-4" /> 保存
              </button>
              <button
                onClick={() => setIsEditingTitle(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded 
                         flex items-center gap-1 transition-colors"
              >
                <X className="w-4 h-4" /> 取消
              </button>
            </div>
          </div>
        ) : (
          <div onClick={startEditPageInfo} className="cursor-pointer group">
            <h1 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">
              {pageData?.title || pageMeta.title}
            </h1>
            <p className="text-gray-500 mt-1">
              {pageData?.description || pageMeta.description}
            </p>
            <p className="text-xs text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              点击编辑页面信息
            </p>
          </div>
        )}
      </div>

      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded 
                   text-gray-500 hover:border-primary hover:text-primary 
                   transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          添加新条目
        </button>
      ) : (
        <div className="bg-white border border-border p-5 space-y-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="标题"
            className="w-full text-lg font-bold border-b border-gray-300 
                     focus:border-primary focus:outline-none py-1 bg-transparent"
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="内容描述..."
            rows={3}
            className="w-full resize-none border border-gray-300 rounded p-3 focus:border-primary 
                     focus:outline-none text-text"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setIsAdding(false);
                setNewTitle('');
                setNewContent('');
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded 
                       flex items-center gap-1 transition-colors"
            >
              <X className="w-4 h-4" /> 取消
            </button>
            <button
              onClick={handleAddItem}
              disabled={!newTitle.trim()}
              className="px-4 py-2 bg-primary text-white rounded 
                       flex items-center gap-1 hover:bg-blue-800 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" /> 添加
            </button>
          </div>
        </div>
      )}

      <SortableList
        items={pageData?.items || []}
        onReorder={(items) => reorderItems(items.map((item, idx) => ({ ...item, order: idx })))}
        renderItem={(item) => (
          <EditableCard
            item={item}
            onUpdate={updateItem}
            onDelete={deleteItem}
          />
        )}
      />

      {pageData?.items.length === 0 && !isAdding && (
        <div className="text-center py-16 text-text-light">
          <p>还没有内容，点击上方按钮添加第一条记录</p>
        </div>
      )}
    </div>
  );
};
