import { useState, useEffect, useCallback } from 'react';
import { ProfileData } from '@/types';
import { db } from '@/stores/db';

const defaultProfile: ProfileData = {
  name: '',
  bio: '',
  email: '',
  location: '',
  avatar: '',
  socials: [],
  siteTitle: '我的网站',
  aboutTitle: '关于我',
};

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.init().then(() => {
      db.getProfile().then(data => {
        setProfile(data);
        setLoading(false);
      });
    });
  }, []);

  const saveProfile = useCallback(async (data: ProfileData) => {
    await db.saveProfile(data);
    setProfile(data);
  }, []);

  return { profile, loading, saveProfile };
}
