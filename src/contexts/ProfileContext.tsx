import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ProfileData } from '@/types';
import { db } from '@/stores/db';

const defaultProfile: ProfileData = {
  name: '',
  bio: '',
  about: '',
  email: '',
  location: '',
  avatar: '',
  socials: [],
  siteTitle: '魔术师小站',
  aboutTitle: 'About Me',
};

interface ProfileContextValue {
  profile: ProfileData;
  loading: boolean;
  saveProfile: (data: ProfileData) => Promise<void>;
  refresh: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue>({
  profile: defaultProfile,
  loading: true,
  saveProfile: async () => {},
  refresh: async () => {},
});

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    await db.init();
    const data = await db.getProfile();
    setProfile(data);
  }, []);

  useEffect(() => {
    refresh().then(() => setLoading(false));
  }, [refresh]);

  const saveProfile = useCallback(async (data: ProfileData) => {
    await db.saveProfile(data);
    setProfile(data);
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, loading, saveProfile, refresh }}>
      {children}
    </ProfileContext.Provider>
  );
};

export function useProfileContext() {
  return useContext(ProfileContext);
}
