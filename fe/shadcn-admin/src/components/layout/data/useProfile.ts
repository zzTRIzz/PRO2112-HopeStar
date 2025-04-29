// useProfile.ts
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8080';

interface Profile {
  name: string;
  email: string;
  avatar: string;
  idRole: number;
  birthDate: string | null;
  gender: boolean | null;
  phone: string | null;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const jwt = Cookies.get('jwt');
    if (jwt) {
      try {
        const response = await axios.get(`${API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        setProfile(response.data);
        setError(null);
      } catch (err) {
        setError('Lỗi khi lấy thông tin người dùng');
        console.error('Lỗi khi lấy thông tin người dùng:', err);
      }
    } else {
      setError('Không có token JWT');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, []); // Chỉ chạy khi component mount

  // Provide refetch function to allow manual refreshing of profile data
  const refetch = useCallback(() => {
    return fetchProfile();
  }, [fetchProfile]);

  return { profile, error, loading, refetch };
};