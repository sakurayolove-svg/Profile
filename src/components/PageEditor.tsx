import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Globe } from 'lucide-react';
import { PageMeta } from '@/types';
import { usePageData } from '@/hooks/usePageData';
import { SortableList } from './SortableList';

interface PageEditorProps {
  pageType: string;
  pageMeta: PageMeta;
}

export const PageEditor: React.FC<PageEditorProps> = ({ pageType, pageMeta }) => {
  const { pageData, loading, addItem, updateItem, deleteItem, reorderItems, savePage } = usePageData(pageType);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleForm, setTitleForm] = useState({ title: '', description: '' });

  if (loading) return <div style={{ textAlign: 'center', padding: '4em' }}>Loading...</div>;

  const saveTitle = () => {
    if (!pageData) return;
    savePage({ ...pageData, title: titleForm.title, description: titleForm.description });
    setEditingTitle(false);
  };

  const addItemLocal = () => {
    if (!newTitle.trim()) return;
    addItem({
      id: crypto.randomUUID(),
      title: newTitle,
      content: newContent,
      files: [],
      order: pageData?.items.length || 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setNewTitle('');
    setNewContent('');
    setAdding(false);
  };

  return (
    <div id="main" role="main" style={{ paddingTop: '2em' }}>
      <article className="page" itemScope itemType="http://schema.org/CreativeWork" style={{ width: '100%', maxWidth: 900, margin: '0 auto' }}>
        <div className="page__inner-wrap">
          <section className="page__content">
            {editingTitle ? (
              <div className="edit-form" style={{ marginBottom: '1.5em' }}>
                <input value={titleForm.title} onChange={e => setTitleForm(f => ({ ...f, title: e.target.value }))} placeholder="页面标题" />
                <input value={titleForm.description} onChange={e => setTitleForm(f => ({ ...f, description: e.target.value }))} placeholder="页面描述" />
                <div className="edit-actions">
                  <button onClick={() => setEditingTitle(false)} className="btn-secondary">取消</button>
                  <button onClick={saveTitle} className="btn-primary">保存</button>
                </div>
              </div>
            ) : (
              <div onClick={() => { setTitleForm({ title: pageData?.title || pageMeta.title, description: pageData?.description || pageMeta.description }); setEditingTitle(true); }} style={{ cursor: 'pointer', marginBottom: '1.5em' }}>
                <h1>{pageData?.title || pageMeta.title}</h1>
                <p style={{ color: '#7a8288' }}>{pageData?.description || pageMeta.description}</p>
                <span style={{ fontSize: '0.75em', color: '#aaa' }}>点击编辑页面信息</span>
              </div>
            )}

            {!adding && (
              <button onClick={() => setAdding(true)} className="edit-btn" style={{ marginBottom: '1em' }}>
                <Plus size={14} /> 添加条目
              </button>
            )}
            {adding && (
              <div className="edit-form">
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="标题" />
                <textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="内容..." rows={3} />
                <div className="edit-actions">
                  <button onClick={() => setAdding(false)} className="btn-secondary">取消</button>
                  <button onClick={addItemLocal} className="btn-primary" disabled={!newTitle.trim()}>添加</button>
                </div>
              </div>
            )}

            <SortableList
              items={pageData?.items || []}
              onReorder={items => reorderItems(items.map((it, idx) => ({ ...it, order: idx })))}
              renderItem={item => (
                <div className="paper-box">
                  <div className="paper-box-image">
                    {item.files.filter(f => f.type === 'image')[0] ? (
                      <img src={item.files.filter(f => f.type === 'image')[0].data} alt="" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                        <Globe size={32} />
                      </div>
                    )}
                  </div>
                  <div className="paper-box-text">
                    <p>
                      <strong>{item.title}</strong>
                      <span style={{ float: 'right', display: 'flex', gap: 4 }}>
                        <button onClick={() => { const t = prompt('标题', item.title); if (t !== null) updateItem(item.id, { title: t }); }} className="edit-btn"><Edit3 size={12} /></button>
                        <button onClick={() => { if (confirm('确定删除？')) deleteItem(item.id); }} className="edit-btn"><Trash2 size={12} /></button>
                      </span>
                      <br />
                      {item.content}
                    </p>
                  </div>
                </div>
              )}
            />

            {pageData?.items.length === 0 && !adding && <p style={{ color: '#7a8288' }}>还没有内容。</p>}
          </section>
        </div>
      </article>
    </div>
  );
};
