// useProfile.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8080';

interface Profile {
  name: string;
  email: string;
  avatar: string;
  idRole: number;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchProfile = async () => {
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
    };

    fetchProfile();
  }, []); // Chỉ chạy khi component mount

  return { profile, error, loading };
};