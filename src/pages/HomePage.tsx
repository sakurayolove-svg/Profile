import React, { useState } from 'react';
import { MapPin, Mail, Github, Globe, Linkedin, Twitter, Link as LinkIcon, Edit3, Check, X, Plus, Trash2 } from 'lucide-react';
import { FileItem } from '@/types';
import { usePageData } from '@/hooks/usePageData';
import { useProfile } from '@/hooks/useProfile';
import { FileUploader } from '@/components/FileUploader';
import { ImageViewer } from '@/components/ImageViewer';
import { SortableList } from '@/components/SortableList';

const socialIcons: Record<string, React.ElementType> = {
  Github, Linkedin, Twitter, Globe,
};

function getSocialIcon(name: string) {
  return socialIcons[name] || LinkIcon;
}

export const HomePage: React.FC = () => {
  const { pageData, loading, addItem, updateItem, deleteItem, reorderItems } = usePageData('home');
  const { profile, loading: profileLoading, saveProfile } = useProfile();

  const [editingProfile, setEditingProfile] = useState(false);
  const [adding, setAdding] = useState(false);
  const [viewingImage, setViewingImage] = useState(false);

  const [form, setForm] = useState({
    name: '', bio: '', about: '', email: '', location: '', avatar: '', siteTitle: '', aboutTitle: '',
  });
  const [socials, setSocials] = useState<{ id: string; name: string; url: string; icon: string }[]>([]);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  if (loading || profileLoading) {
    return <div style={{ textAlign: 'center', padding: '4em' }}>Loading...</div>;
  }

  const items = pageData?.items || [];

  const startEdit = () => {
    setForm({
      name: profile.name,
      bio: profile.bio,
      about: profile.about,
      email: profile.email,
      location: profile.location,
      avatar: profile.avatar,
      siteTitle: profile.siteTitle,
      aboutTitle: profile.aboutTitle,
    });
    setSocials(profile.socials.length ? profile.socials : [{ id: crypto.randomUUID(), name: '', url: '', icon: 'Globe' }]);
    setEditingProfile(true);
  };

  const save = () => {
    saveProfile({
      ...form,
      siteTitle: form.siteTitle.trim() || '魔术师小站',
      aboutTitle: form.aboutTitle.trim() || 'About Me',
      socials: socials.filter(s => s.name.trim() && s.url.trim()),
    });
    setEditingProfile(false);
  };

  const onAvatar = (files: FileItem[]) => {
    if (files[0]) setForm(f => ({ ...f, avatar: files[0].data }));
  };

  const addSocial = () => setSocials([...socials, { id: crypto.randomUUID(), name: '', url: '', icon: 'Globe' }]);
  const updateSocial = (i: number, k: string, v: string) => {
    const copy = [...socials];
    copy[i] = { ...copy[i], [k]: v };
    setSocials(copy);
  };
  const removeSocial = (i: number) => setSocials(socials.filter((_, idx) => idx !== i));

  const addItemLocal = () => {
    if (!newTitle.trim()) return;
    addItem({
      id: crypto.randomUUID(),
      title: newTitle,
      content: newContent,
      files: [],
      order: items.length,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setNewTitle('');
    setNewContent('');
    setAdding(false);
  };

  return (
    <div id="main" role="main">
      <div className="sidebar sticky">
        <div itemScope itemType="http://schema.org/Person" className="profile_box">
          {editingProfile ? (
            <div className="edit-form" style={{ textAlign: 'left' }}>
              {form.avatar ? (
                <div style={{ textAlign: 'center', position: 'relative' }}>
                  <img src={form.avatar} alt="" className="author__avatar" />
                  <button onClick={() => setForm(f => ({ ...f, avatar: '' }))} style={{ position: 'absolute', top: 0, right: 0 }}>×</button>
                </div>
              ) : (
                <FileUploader onUpload={onAvatar} />
              )}
              <input value={form.siteTitle} onChange={e => setForm(f => ({ ...f, siteTitle: e.target.value }))} placeholder="Site title" />
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" />
              <input value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Bio" />
              <textarea value={form.about} onChange={e => setForm(f => ({ ...f, about: e.target.value }))} placeholder="About me content" rows={3} />
              <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" />
              <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Location" />
              <input value={form.aboutTitle} onChange={e => setForm(f => ({ ...f, aboutTitle: e.target.value }))} placeholder="About section title" />
              {socials.map((s, i) => (
                <div key={s.id} style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                  <input value={s.name} onChange={e => updateSocial(i, 'name', e.target.value)} placeholder="Name" style={{ flex: 1 }} />
                  <input value={s.url} onChange={e => updateSocial(i, 'url', e.target.value)} placeholder="URL" style={{ flex: 2 }} />
                  <button onClick={() => removeSocial(i)}><X size={14} /></button>
                </div>
              ))}
              <button onClick={addSocial} className="btn-secondary" style={{ width: '100%', marginBottom: 8 }}>+ Social</button>
              <div className="edit-actions">
                <button onClick={() => setEditingProfile(false)} className="btn-secondary"><X size={14} /> Cancel</button>
                <button onClick={save} className="btn-primary"><Check size={14} /> Save</button>
              </div>
            </div>
          ) : (
            <>
              <div className="author__avatar" onClick={() => profile.avatar && setViewingImage(true)} style={{ cursor: profile.avatar ? 'pointer' : 'default' }}>
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} />
                ) : (
                  <div style={{ width: 150, height: 150, borderRadius: '50%', background: '#224b8d', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, margin: '0 auto' }}>
                    {profile.name?.[0] || '我'}
                  </div>
                )}
              </div>
              <div className="author__content">
                <h3 className="author__name">{profile.name || 'Your Name'}</h3>
                <p className="author__bio">{profile.bio || 'Your bio...'}</p>
              </div>
              <div className="author__urls-wrapper">
                <ul className="author__urls social-icons">
                  {profile.location && <li><MapPin size={14} /> {profile.location}</li>}
                  {profile.email && <li><Mail size={14} /> {profile.email}</li>}
                  {profile.socials.map((s, i) => {
                    const Icon = getSocialIcon(s.icon);
                    return <li key={i}><a href={s.url} target="_blank" rel="noreferrer"><Icon size={14} /> {s.name}</a></li>;
                  })}
                </ul>
              </div>
              <button onClick={startEdit} className="edit-btn" style={{ marginTop: '1em' }}>
                <Edit3 size={14} /> 编辑资料
              </button>
            </>
          )}
        </div>
      </div>

      <article className="page" itemScope itemType="http://schema.org/CreativeWork">
        <div className="page__inner-wrap">
          <section className="page__content">
            <p><span className="anchor" id="about-me"></span></p>
            <h2 id="about-me">{profile.aboutTitle || 'About Me'}</h2>
            <p>{profile.about || 'Write something about yourself...'}</p>

            <h2>动态</h2>
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
              items={items}
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

            {items.length === 0 && !adding && <p style={{ color: '#7a8288' }}>还没有内容。</p>}
          </section>
        </div>
      </article>

      {viewingImage && profile.avatar && (
        <ImageViewer files={[{ id: 'avatar', name: 'avatar', type: 'image', size: 0, data: profile.avatar, mimeType: 'image/*', createdAt: Date.now() }]} onClose={() => setViewingImage(false)} />
      )}
    </div>
  );
};
