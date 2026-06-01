import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import * as SecureStore from 'expo-secure-store'; // Güvenli Kasa Eklendi

import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, userData?: any) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Ziyaretçi kartını (Token) kasaya kaydeden veya silen muhafız fonksiyon
  const handleTokenStorage = async (session: Session | null) => {
    if (session?.access_token) {
      // Supabase bir token verdiyse bunu kasaya kilitle (apiClient buradan okuyacak)
      await SecureStore.setItemAsync('user_token', session.access_token);
    } else {
      // Oturum yoksa kasayı boşalt
      await SecureStore.deleteItemAsync('user_token');
    }
  };

  useEffect(() => {
    // 1. İlk açılışta mevcut oturumu kontrol et
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      handleTokenStorage(session);
      setLoading(false);
    });

    // 2. Kullanıcı giriş yaptığında, çıkış yaptığında veya token yenilendiğinde otomatik tetiklenir
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      handleTokenStorage(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const register = async (email: string, password: string, userData?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData?.firstName,
          last_name: userData?.lastName,
          age: userData?.age,
          address: userData?.address,
        }
      }
    });
    
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // Çıkış yapıldığında üstteki onAuthStateChange otomatik tetiklenip kasayı boşaltacaktır
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};