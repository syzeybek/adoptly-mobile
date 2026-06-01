// src/pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { User as UserIcon, PawPrint, FileText, LogOut, Loader2, Edit2, Trash2 } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'listings' | 'applications'>('listings');
  
  const [applications, setApplications] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login' as never);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: listData } = await supabase.from('pets').select('*').eq('user_id', user.id);
        if (listData) setListings(listData);
        // Not: Başvurularım mantığını Applications ekranına ayırdık ama burada da çizebiliriz.
      } catch (err) {
        console.error("Hata:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Main' as never);
  };

  const handleDeleteListing = (petId: string, petName: string) => {
    Alert.alert(
      "İlanı Sil",
      `${petName} isimli dostumuzun ilanını silmek istediğine emin misin?`,
      [
        { text: "Vazgeç", style: "cancel" },
        { 
          text: "Sil", 
          style: "destructive",
          onPress: async () => {
            try {
              await supabase.from('pets').delete().eq('id', petId);
              setListings(prev => prev.filter(pet => pet.id !== petId));
              Toast.show({ type: 'success', text1: 'Başarılı', text2: 'İlan kaldırıldı.' });
            } catch (err) {
              Toast.show({ type: 'error', text1: 'Hata', text2: 'İlan silinirken bir hata oluştu.' });
            }
          }
        }
      ]
    );
  };

  if (!user) return null;

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      {/* Profil Kartı */}
      <View className="bg-white p-6 rounded-[32px] shadow-sm mb-6 border border-gray-100 flex-col items-center mt-10">
        <View className="w-20 h-20 bg-brand-purple/10 rounded-full items-center justify-center mb-4">
          <UserIcon color="#9B5DE5" size={32} />
        </View>
        <Text className="text-2xl font-black text-gray-900 mb-1">{user.email}</Text>
        <Text className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-6">Kullanıcı Profili</Text>
        
        <TouchableOpacity onPress={handleLogout} className="bg-red-50 py-3 px-6 rounded-2xl flex-row items-center gap-2">
          <LogOut color="#EF4444" size={18} />
          <Text className="text-red-500 font-black">Çıkış Yap</Text>
        </TouchableOpacity>
      </View>

      {/* Sekmeler */}
      <View className="flex-row bg-white rounded-3xl p-1 mb-6 shadow-sm">
        <TouchableOpacity 
          onPress={() => setActiveTab('listings')} 
          className={`flex-1 py-3 rounded-3xl items-center flex-row justify-center gap-2 ${activeTab === 'listings' ? 'bg-gray-100' : ''}`}
        >
          <PawPrint color={activeTab === 'listings' ? '#9B5DE5' : '#9CA3AF'} size={18} />
          <Text className={`font-black ${activeTab === 'listings' ? 'text-brand-purple' : 'text-gray-400'}`}>İlanlarım</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Applications' as never)} // Başvurularımı ayrı sayfaya yolluyoruz
          className={`flex-1 py-3 rounded-3xl items-center flex-row justify-center gap-2`}
        >
          <FileText color="#9CA3AF" size={18} />
          <Text className="font-black text-gray-400">Başvurularım</Text>
        </TouchableOpacity>
      </View>

      {/* İlanlar Listesi */}
      {loading ? (
        <ActivityIndicator size="large" color="#FF85A1" className="mt-10" />
      ) : listings.length === 0 ? (
        <View className="items-center py-16 bg-white rounded-[32px] border-2 border-dashed border-gray-100 mt-4">
          <PawPrint color="#E5E7EB" size={48} className="mb-4" />
          <Text className="text-gray-400 font-bold">Henüz bir ilan açmadın.</Text>
        </View>
      ) : (
        <View className="space-y-4">
          {listings.map((pet) => (
            <View key={pet.id} className="bg-white p-4 rounded-[24px] shadow-sm flex-row items-center justify-between border border-gray-50">
              <View className="flex-row items-center flex-1 pr-4">
                <Image source={{ uri: pet.imageUrl || pet.imageurl }} className="w-16 h-16 rounded-[16px] bg-gray-100" />
                <View className="ml-3">
                  <Text className="font-black text-lg text-gray-900">{pet.name}</Text>
                  <Text className="text-[10px] font-bold text-brand-purple uppercase tracking-widest">{pet.breed}</Text>
                </View>
              </View>
              <View className="flex-row gap-2">
                <TouchableOpacity onPress={() => (navigation as any).navigate('PetDetail', { id: pet.id })} className="p-3 bg-brand-cyan/10 rounded-xl">
                  <Edit2 color="#00BBF9" size={18} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteListing(pet.id, pet.name)} className="p-3 bg-red-50 rounded-xl">
                  <Trash2 color="#EF4444" size={18} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}