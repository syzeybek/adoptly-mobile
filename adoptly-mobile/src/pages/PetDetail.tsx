import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { usePet } from '../hooks/usePets';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { MapPin, Calendar, Dna, ArrowLeft, Heart, MessageSquareQuote } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

export default function PetDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { id } = route.params as { id: string };
  const { data: pet, isLoading } = usePet(id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#FF85A1" />
      </View>
    );
  }

  if (!pet) return null;

  const handleAdoptAction = async () => {
    if (!user) {
      Toast.show({ type: 'error', text1: 'Hata', text2: 'Başvuruda bulunmak için giriş yapmalısın! ❤️' });
      navigation.navigate('Login' as never);
      return;
    }
    try {
      const { error } = await supabase.from('applications').insert([{ user_id: user.id, pet_id: pet.id }]);
      if (error && error.code === '23505') {
        Toast.show({ type: 'error', text1: 'Uyarı', text2: 'Bu dostumuz için zaten bir başvurunuz var! 🐾' });
      } else if (!error) {
        Toast.show({ type: 'success', text1: 'Harika!', text2: 'Başvurunuz alındı! Pati selamı iletildi! ❤️' });
      }
    } catch (e) {
       Toast.show({ type: 'error', text1: 'Hata', text2: 'Başvuru sırasında bir hata oluştu.' });
    }
  };

  const pImg = pet.imageUrl || pet.imageurl;

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      {/* Görsel ve Üst Menü */}
      <View className="relative h-[400px] w-full">
        <Image source={{ uri: pImg }} className="absolute w-full h-full" resizeMode="cover" />
        
        {/* Geri Dön Butonu */}
        <TouchableOpacity 
          className="absolute top-12 left-4 bg-white/80 p-3 rounded-full"
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
      </View>

      {/* İçerik Alanı (Yukarı taşan tasarım) */}
      <View className="flex-1 bg-white rounded-t-[48px] -mt-12 px-6 pt-10 pb-8">
        <View className="bg-brand-cyan/10 self-start px-4 py-2 rounded-full mb-4">
          <Text className="text-brand-cyan font-black text-[10px] uppercase tracking-widest">Sahiplenilmeyi Bekliyor</Text>
        </View>
        
        <Text className="text-5xl font-black text-gray-900 mb-6">{pet.name}</Text>

        {/* ✨ DÜZELTME: Bilgi Grid'i ✨ */}
        <View className="flex-row justify-between mb-8 gap-3">
          <View className="flex-1 bg-gray-50 py-4 px-2 rounded-[24px] items-center overflow-hidden">
            <Dna color="#9B5DE5" size={24} className="mb-2" />
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cinsi</Text>
            {/* Tek satıra sığmaya ve gerekirse küçülmeye zorlanan metin */}
            <Text 
              className="font-black text-gray-800 mt-1 w-full text-center" 
              numberOfLines={1} 
              adjustsFontSizeToFit 
              minimumFontScale={0.5}
            >
              {pet.breed}
            </Text>
          </View>
          
          <View className="flex-1 bg-gray-50 py-4 px-2 rounded-[24px] items-center overflow-hidden">
            <Calendar color="#FEE440" size={24} className="mb-2" />
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Yaşı</Text>
            <Text 
              className="font-black text-gray-800 mt-1 w-full text-center" 
              numberOfLines={1} 
              adjustsFontSizeToFit 
              minimumFontScale={0.5}
            >
              {pet.age}
            </Text>
          </View>

          <View className="flex-1 bg-gray-50 py-4 px-2 rounded-[24px] items-center overflow-hidden">
            <MapPin color="#FF85A1" size={24} className="mb-2" />
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Konum</Text>
            <Text 
              className="font-black text-gray-800 mt-1 w-full text-center" 
              numberOfLines={1} 
              adjustsFontSizeToFit 
              minimumFontScale={0.5}
            >
              {pet.location}
            </Text>
          </View>
        </View>

        {/* Hikaye */}
        <View className="bg-brand-pink/10 p-6 rounded-[32px] mb-8">
          <MessageSquareQuote color="#FF85A1" size={32} className="mb-2 opacity-50" />
          <Text className="text-gray-600 font-medium leading-relaxed">
            {pet.story || 'Bize anlatacak çok şeyi var ama önce sana alışması lazım!'}
          </Text>
        </View>

        {/* Başvuru Butonu */}
        <TouchableOpacity 
          className="bg-gray-900 py-6 rounded-[32px] items-center shadow-xl"
          onPress={handleAdoptAction}
        >
          <Text className="text-white font-black text-xl">Beni Ailene Kat 🏠</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}