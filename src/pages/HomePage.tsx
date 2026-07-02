import React, { useState } from 'react';
import { Mail, MapPin, Edit3, Check, X, Plus, Trash2 } from 'lucide-react';
import { FileItem, PageItem } from '@/types';
import { usePageData } from '@/hooks/usePageData';
import { FileUploader } from '@/components/FileUploader';
import { ImageViewer } from '@/components/ImageViewer';
import { SortableList } from '@/components/SortableList';

export const HomePage: React.FC = () => {
  const { pageData, loading, addItem, updateItem, deleteItem, reorderItems } = usePageData('home');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [viewingImage, setViewingImage] = useState(false);

  const [profileName, setProfileName] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileLocation, setProfileLocation] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const profile = pageData?.items.find(i => i.title === '__profile__');
  const contentItems = pageData?.items.filter(i => i.title !== '__profile__') || [];

  const parseProfile = () => {
    if (!profile) return { name: '', bio: '', email: '', location: '', avatar: '' };
    const parts = profile.content.split('\n');
    return {
      name: parts[0] || '',
      bio: parts[1] || '',
      email: parts[2] || '',
      location: parts[3] || '',
      avatar: profile.files[0]?.data || '',
    };
  };

  const p = parseProfile();

  const startEditProfile = () => {
    setProfileName(p.name);
    setProfileBio(p.bio);
    setProfileEmail(p.email);
    setProfileLocation(p.location);
    setProfileAvatar(p.avatar);
    setIsEditingProfile(true);
  };

  const saveProfile = () => {
    const content = [profileName, profileBio, profileEmail, profileLocation]
      .filter(Boolean).join('\n');

    const avatarFile = profileAvatar ? {
      id: 'avatar',
      name: 'avatar',
      type: 'image' as const,
      size: 0,
      data: profileAvatar,
      mimeType: 'image/*',
      createdAt: Date.now(),
    } : undefined;

    if (profile) {
      updateItem(profile.id, {
        title: '__profile__',
        content,
        files: avatarFile ? [avatarFile] : [],
      });
    } else {
      addItem({
        id: crypto.randomUUID(),
        title: '__profile__',
        content,
        files: avatarFile ? [avatarFile] : [],
        order: -1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
    setIsEditingProfile(false);
  };

  const handleAddItem = () => {
    if (!newTitle.trim()) return;
    const newItem: PageItem = {
      id: crypto.randomUUID(),
      title: newTitle,
      content: newContent,
      files: [],
      order: contentItems.length,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    addItem(newItem);
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  const handleAvatarUpload = (files: FileItem[]) => {
    if (files.length > 0) {
      setProfileAvatar(files[0].data);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        {isEditingProfile ? (
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="shrink-0">
                {profileAvatar ? (
                  <div className="relative w-24 h-24">
                    <img src={profileAvatar} alt="avatar" className="w-24 h-24 rounded-full object-cover" />
                    <button 
                      onClick={() => setProfileAvatar('')}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24">
                    <FileUploader onUpload={handleAvatarUpload} />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <input
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  placeholder="姓名"
                  className="w-full text-2xl font-bold border-b focus:border-primary focus:outline-none"
                />
                <input
                  value={profileBio}
                  onChange={e => setProfileBio(e.target.value)}
                  placeholder="简介"
                  className="w-full text-gray-600 border-b focus:border-primary focus:outline-none"
                />
                <div className="flex gap-4">
                  <input
                    value={profileEmail}
                    onChange={e => setProfileEmail(e.target.value)}
                    placeholder="邮箱"
                    className="flex-1 text-sm border-b focus:border-primary focus:outline-none"
                  />
                  <input
                    value={profileLocation}
                    onChange={e => setProfileLocation(e.target.value)}
                    placeholder="地点"
                    className="flex-1 text-sm border-b focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={saveProfile} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-1">
                <Check className="w-4 h-4" /> 保存
              </button>
              <button onClick={() => setIsEditingProfile(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-1">
                <X className="w-4 h-4" /> 取消
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-6 group">
            <div 
              className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-500 
                       flex items-center justify-center text-white text-3xl font-bold shrink-0 cursor-pointer"
              onClick={() => p.avatar && setViewingImage(true)}
            >
              {p.avatar ? (
                <img src={p.avatar} alt="" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                p.name?.[0] || pageData?.title?.[0] || '我'
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {p.name || pageData?.title || '你的名字'}
              </h1>
              <p className="text-gray-500 mt-1">
                {p.bio || pageData?.description || '介绍一下自己...'}
              </p>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                {p.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" /> {p.email}
                  </span>
                )}
                {p.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {p.location}
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={startEditProfile}
              className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-all"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">详细内容</h2>
          {!isAdding && (
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> 添加
            </button>
          )}
        </div>

        {isAdding && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
            <input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="标题"
              className="w-full text-lg font-semibold border-b focus:border-primary focus:outline-none"
            />
            <textarea
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              placeholder="内容..."
              rows={3}
              className="w-full resize-none border rounded-lg p-3 focus:border-primary focus:outline-none"
            />
            <div className="flex gap-2">
              <button onClick={handleAddItem} disabled={!newTitle.trim()} className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50">
                添加
              </button>
              <button onClick={() => { setIsAdding(false); setNewTitle(''); setNewContent(''); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                取消
              </button>
            </div>
          </div>
        )}

        <SortableList
          items={contentItems}
          onReorder={(items) => reorderItems(items.map((item, idx) => ({ ...item, order: idx })))}
          renderItem={(item) => (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => {
                    const newTitle = prompt('标题', item.title);
                    if (newTitle !== null) updateItem(item.id, { title: newTitle });
                  }} className="p-1.5 text-gray-400 hover:text-primary rounded">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => {
                    if (confirm('确定删除？')) deleteItem(item.id);
                  }} className="p-1.5 text-gray-400 hover:text-red-500 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {item.content && (
                <p className="mt-2 text-gray-600 whitespace-pre-wrap">{item.content}</p>
              )}
            </div>
          )}
        />

        {contentItems.length === 0 && !isAdding && (
          <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
            还没有内容，点击添加按钮创建
          </div>
        )}
      </div>

      {viewingImage && profile?.files[0] && (
        <ImageViewer files={profile.files} onClose={() => setViewingImage(false)} />
      )}
    </div>
  );
};
