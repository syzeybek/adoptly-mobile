// src/lib/supabase.ts
import 'react-native-url-polyfill/auto'; // Bu satır mobilde şart!
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// KENDİ SUPABASE BİLGİLERİNİ BURAYA YAPIŞTIR
const supabaseUrl = 'https://rpugcpclwembabwebrxy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwdWdjcGNsd2VtYmFid2Vicnh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4OTA5NDUsImV4cCI6MjA5MDQ2Njk0NX0.kZ6omuxrT7s8Ua5FHmPubIiyR_yJvi0vlvE8EccFoi0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // Mobilde oturumu açık tutmak için localStorage yerine AsyncStorage kullanıyoruz
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});