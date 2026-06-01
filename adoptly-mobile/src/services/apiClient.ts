import axios from 'axios';
// import * as SecureStore from 'expo-secure-store'; // İleride giriş yapma (Auth) sistemini kurduğumuzda burayı açacağız

// ⚠️ DİKKAT: '192.168.1.X' yazan yere kendi bilgisayarının GÜNCEL Wi-Fi IP adresini yazmayı unutma!
const BASE_URL = 'http://172.20.10.3:8080/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 saniye içinde cevap gelmezse isteği iptal et
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🚀 İSTEK (REQUEST) ARAYA GİRİCİSİ - Giden her isteği kontrol eder
apiClient.interceptors.request.use(
  async (config: any) => {
    console.log(`🚀 [API İSTEĞİ]: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    
    // İleride Login/Auth yaptığımızda buraya SecureStore'dan token çekip ekleyeceğiz:
    // const token = await SecureStore.getItemAsync('user_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// ✅ CEVAP (RESPONSE) ARAYA GİRİCİSİ - Gelen her cevabı kontrol eder
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