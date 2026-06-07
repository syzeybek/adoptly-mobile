import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native'; // 👈 Cihaz kontrolü eklendi

const BASE_URL = 'https://adoptly-mobilbackend.onrender.com';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 120000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🚀 İSTEK (REQUEST) ARAYA GİRİCİSİ - Akıllı Versiyon
apiClient.interceptors.request.use(
  async (config: any) => {
    // 👇 KRİTİK HAMLE: Akıllı Kasa Kontrolü
    let token = null;
    if (Platform.OS === 'web') {
      token = localStorage.getItem('user_token'); // Web ise tarayıcı kasasına bak
    } else {
      token = await SecureStore.getItemAsync('user_token'); // Mobil ise şifreli kasaya bak
    }
    
    console.log(`🚀 [API İSTEĞİ]: ${config.method?.toUpperCase()} ${config.url}`);
    
    // Sadece GET "olmayan" işlemlerde (POST, DELETE vb.) kimliği göster!
    if (token && config.method?.toUpperCase() !== 'GET') {
      console.log(`🔑 [KART GÖSTERİLDİ]: Yeni işlem yapıldığı için token eklendi.`);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log(`👀 [KART GİZLENDİ]: GET (Okuma) işlemi olduğu için kapıdan anonim geçiliyor.`);
    }
    
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// ✅ CEVAP (RESPONSE) ARAYA GİRİCİSİ
apiClient.interceptors.response.use(
  (response: any) => {
    console.log(`✅ [API CEVABI] - Durum: ${response.status}`);
    return response;
  },
  (error: any) => {
    console.error(`❌ [API HATASI]:`, error.message);
    return Promise.reject(error);
  }
);