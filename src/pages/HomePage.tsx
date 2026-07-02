import React, { useState } from 'react';
import { Mail, MapPin, Edit3, Check, X, Plus, Trash2, Github, Globe, Linkedin, Twitter, Link as LinkIcon } from 'lucide-react';
import { PageItem, FileItem } from '@/types';
import { usePageData } from '@/hooks/usePageData';
import { useProfile } from '@/hooks/useProfile';
import { FileUploader } from '@/components/FileUploader';
import { ImageViewer } from '@/components/ImageViewer';
import { SortableList } from '@/components/SortableList';

const socialIcons: Record<string, React.ElementType> = {
  Github,
  Linkedin,
  Twitter,
  Globe,
};

function getSocialIcon(name: string) {
  return socialIcons[name] || LinkIcon;
}

export const HomePage: React.FC = () => {
  const { pageData, loading, addItem, updateItem, deleteItem, reorderItems } = usePageData('home');
  const { profile, loading: profileLoading, saveProfile } = useProfile();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [viewingImage, setViewingImage] = useState(false);

  const [profileName, setProfileName] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileLocation, setProfileLocation] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [socials, setSocials] = useState<{ id: string; name: string; url: string; icon: string }[]>([]);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const contentItems = pageData?.items || [];

  const startEditProfile = () => {
    setProfileName(profile.name);
    setProfileBio(profile.bio);
    setProfileEmail(profile.email);
    setProfileLocation(profile.location);
    setProfileAvatar(profile.avatar);
    setSocials(profile.socials.length > 0 ? profile.socials : [{ id: crypto.randomUUID(), name: '', url: '', icon: 'Globe' }]);
    setIsEditingProfile(true);
  };

  const saveProfileData = () => {
    const validSocials = socials.filter(s => s.name.trim() && s.url.trim());
    saveProfile({
      name: profileName,
      bio: profileBio,
      email: profileEmail,
      location: profileLocation,
      avatar: profileAvatar,
      socials: validSocials,
    });
    setIsEditingProfile(false);
  };

  const handleAvatarUpload = (files: FileItem[]) => {
    if (files.length > 0) {
      setProfileAvatar(files[0].data);
    }
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

  const addSocial = () => {
    setSocials([...socials, { id: crypto.randomUUID(), name: '', url: '', icon: 'Globe' }]);
  };

  const updateSocial = (index: number, field: string, value: string) => {
    const updated = [...socials];
    updated[index] = { ...updated[index], [field]: value };
    setSocials(updated);
  };

  const removeSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Left Sidebar */}
      <aside className="md:w-72 md:shrink-0">
        <div className="md:sticky md:top-24 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {isEditingProfile ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                {profileAvatar ? (
                  <div className="relative w-28 h-28">
                    <img src={profileAvatar} alt="avatar" className="w-28 h-28 rounded-full object-cover" />
                    <button
                      onClick={() => setProfileAvatar('')}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-28 h-28">
                    <FileUploader onUpload={handleAvatarUpload} />
                  </div>
                )}
              </div>

              <input
                value={profileName}
                onChange={e => setProfileName(e.target.value)}
                placeholder="姓名"
                className="w-full text-center text-xl font-bold border-b focus:border-primary focus:outline-none"
              />
              <input
                value={profileBio}
                onChange={e => setProfileBio(e.target.value)}
                placeholder="简介 / 职位"
                className="w-full text-center text-sm text-gray-600 border-b focus:border-primary focus:outline-none"
              />
              <input
                value={profileEmail}
                onChange={e => setProfileEmail(e.target.value)}
                placeholder="邮箱"
                className="w-full text-sm border-b focus:border-primary focus:outline-none"
              />
              <input
                value={profileLocation}
                onChange={e => setProfileLocation(e.target.value)}
                placeholder="地点"
                className="w-full text-sm border-b focus:border-primary focus:outline-none"
              />

              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500">社交链接</p>
                {socials.map((social, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      value={social.name}
                      onChange={e => updateSocial(idx, 'name', e.target.value)}
                      placeholder="名称"
                      className="flex-1 min-w-0 text-sm border rounded px-2 py-1 focus:border-primary focus:outline-none"
                    />
                    <input
                      value={social.url}
                      onChange={e => updateSocial(idx, 'url', e.target.value)}
                      placeholder="链接"
                      className="flex-[2] min-w-0 text-sm border rounded px-2 py-1 focus:border-primary focus:outline-none"
                    />
                    <button onClick={() => removeSocial(idx)} className="text-gray-400 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button onClick={addSocial} className="text-sm text-primary hover:underline">
                  + 添加链接
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={saveProfileData} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg flex items-center justify-center gap-1">
                  <Check className="w-4 h-4" /> 保存
                </button>
                <button onClick={() => setIsEditingProfile(false)} className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center justify-center gap-1">
                  <X className="w-4 h-4" /> 取消
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div
                className="relative w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-primary to-purple-500 
                         flex items-center justify-center text-white text-3xl font-bold cursor-pointer group"
                onClick={() => profile.avatar && setViewingImage(true)}
              >
                {profile.avatar ? (
                  <img src={profile.avatar} alt="" className="w-28 h-28 rounded-full object-cover" />
                ) : (
                  profile.name?.[0] || '我'
                )}
                <button
                  onClick={startEditProfile}
                  className="absolute -bottom-1 -right-1 p-1.5 bg-white text-gray-600 rounded-full shadow-md
                           opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <h1 className="mt-4 text-2xl font-bold text-gray-900">
                {profile.name || '你的名字'}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {profile.bio || '介绍一下自己...'}
              </p>

              <div className="mt-4 space-y-2 text-sm text-gray-500">
                {profile.email && (
                  <div className="flex items-center justify-center gap-1">
                    <Mail className="w-4 h-4" /> {profile.email}
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center justify-center gap-1">
                    <MapPin className="w-4 h-4" /> {profile.location}
                  </div>
                )}
              </div>

              {profile.socials.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {profile.socials.map((social, idx) => {
                    const Icon = getSocialIcon(social.icon);
                    return (
                      <a
                        key={idx}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Icon className="w-3.5 h-3.5 inline-block mr-1" />
                        {social.name}
                      </a>
                    );
                  })}
                </div>
              )}

              <button
                onClick={startEditProfile}
                className="mt-6 w-full py-2 text-sm text-primary border border-primary/30 rounded-lg
                         hover:bg-primary/5 transition-colors"
              >
                编辑资料
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">关于我</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
            {profile.bio || '这里可以写一段自我介绍...'}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">动态</h2>
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
      </div>

      {viewingImage && profile.avatar && (
        <ImageViewer files={[{ id: 'avatar', name: 'avatar', type: 'image', size: 0, data: profile.avatar, mimeType: 'image/*', createdAt: Date.now() }]} onClose={() => setViewingImage(false)} />
      )}
    </div>
  );
};
