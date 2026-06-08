// src/pages/EditPet.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { usePet } from '../hooks/usePets'; // useUpdatePet kaldırıldı çünkü bypass yapıyoruz!
import { supabase } from '../lib/supabase'; // 🚨 BYPASS İÇİN SUPABASE EKLENDİ
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Camera, MapPin, Calendar, Info } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';

export default function EditPetScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  
  const { id } = route.params as { id: string };
  
  const { data: pet, isLoading } = usePet(id);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (pet) {
      // Gelen veriyi güvenli formata çeviriyoruz (TextInput çökmesin diye yaşı string yapıyoruz)
      setFormData({
        ...pet,
        age: pet.age ? pet.age.toString() : ''
      });
    }
  }, [pet]);

  // Fotoğraf Seçme Fonksiyonu
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFormData({ ...formData, imageUrl: result.assets[0].uri });
    }
  };

  // 🚨 BÜYÜK BYPASS: Supabase üzerinden anında güncelleme işlemi
  const handleSubmit = async () => {
    try {
      // 1. Verileri Supabase'in beklediği TAM İSİMLERLE eşleştiriyoruz
      const payload = {
        name: formData.name,
        breed: formData.breed,
        age: parseInt(formData.age) || 0,
        location: formData.location,
        imageUrl: formData.imageUrl || formData.imageurl 
      };

      // 2. Java Backend'i atlayıp doğrudan veritabanına yazıyoruz!
      const { error } = await supabase.from('pets').update(payload).eq('id', id);
      
      if (error) throw error; 

      // 3. Başarılı! React Query hafızasını patlat ve geri dön
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.invalidateQueries({ queryKey: ['pet', id] });
      
      Toast.show({ type: 'success', text1: 'Harika', text2: 'İlan başarıyla güncellendi! ✨' });
      navigation.goBack();

    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Hata', text2: 'Güncelleme başarısız oldu.' });
      console.error("Supabase Güncelleme Hatası:", err);
    }
  };

  if (isLoading || !pet) return <ActivityIndicator className="mt-20" size="large" color="#00BBF9" />;

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      
      {/* Üst Menü */}
      <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center mb-6">
        <ArrowLeft color="#9B5DE5" size={20} />
        <Text className="ml-2 font-black text-brand-purple">Vazgeç</Text>
      </TouchableOpacity>

      <Text className="text-3xl font-black text-gray-900 mb-8 tracking-tighter">İlanı Düzenle</Text>

      {/* Fotoğraf Değiştirme Alanı */}
      <View className="items-center mb-8">
        <TouchableOpacity onPress={pickImage} className="relative">
          <Image 
            source={{ uri: formData.imageUrl || formData.imageurl || 'https://via.placeholder.com/150' }} 
            className="w-32 h-32 rounded-[32px] border-4 border-white shadow-sm bg-gray-200" 
          />
          <View className="absolute -bottom-2 -right-2 bg-brand-cyan p-3 rounded-full border-4 border-gray-50 shadow-sm">
            <Camera color="white" size={20} />
          </View>
        </TouchableOpacity>
        <Text className="text-gray-400 font-bold text-xs mt-4 uppercase tracking-widest">Fotoğrafı Değiştir</Text>
      </View>

      {/* Form Alanları */}
      <View className="space-y-4">
        
        {/* İsim */}
        <View>
          <Text className="text-[10px] font-black uppercase text-brand-purple tracking-widest ml-4 mb-2 opacity-70">İsim</Text>
          <View className="flex-row items-center bg-white border-2 border-gray-100 rounded-[28px] px-5 min-h-[56px]">
            <Info color="#9CA3AF" size={18} />
            <TextInput 
              value={formData.name} onChangeText={(t) => setFormData({...formData, name: t})}
              className="flex-1 ml-3 font-bold text-gray-900 py-3" placeholder="Örn: Luna"
              style={{ outlineStyle: 'none' } as any}
            />
          </View>
        </View>

        {/* Cins */}
        <View>
          <Text className="text-[10px] font-black uppercase text-brand-purple tracking-widest ml-4 mb-2 opacity-70">Cins</Text>
          <View className="flex-row items-center bg-white border-2 border-gray-100 rounded-[28px] px-5 min-h-[56px]">
            <Info color="#9CA3AF" size={18} />
            <TextInput 
              value={formData.breed} onChangeText={(t) => setFormData({...formData, breed: t})}
              className="flex-1 ml-3 font-bold text-gray-900 py-3" placeholder="Örn: Siyam Kedisi"
              style={{ outlineStyle: 'none' } as any}
            />
          </View>
        </View>

        <View className="flex-row gap-4">
          {/* Yaş */}
          <View className="flex-1">
            <Text className="text-[10px] font-black uppercase text-brand-purple tracking-widest ml-4 mb-2 opacity-70">Yaş (Ay)</Text>
            <View className="flex-row items-center bg-white border-2 border-gray-100 rounded-[28px] px-4 min-h-[56px]">
              <Calendar color="#9CA3AF" size={18} />
              <TextInput 
                keyboardType="numeric" value={formData.age} onChangeText={(t) => setFormData({...formData, age: t})}
                className="flex-1 ml-2 font-bold text-gray-900 py-3" placeholder="3"
                style={{ outlineStyle: 'none' } as any}
              />
            </View>
          </View>

          {/* Konum */}
          <View className="flex-[2]">
            <Text className="text-[10px] font-black uppercase text-brand-purple tracking-widest ml-4 mb-2 opacity-70">Konum</Text>
            <View className="flex-row items-center bg-white border-2 border-gray-100 rounded-[28px] px-4 min-h-[56px]">
              <MapPin color="#9CA3AF" size={18} />
              <TextInput 
                value={formData.location} onChangeText={(t) => setFormData({...formData, location: t})}
                className="flex-1 ml-2 font-bold text-gray-900 py-3" placeholder="Örn: İzmir"
                style={{ outlineStyle: 'none' } as any}
              />
            </View>
          </View>
        </View>
        
        {/* Kaydet Butonu */}
        <TouchableOpacity onPress={handleSubmit} className="bg-brand-cyan py-5 rounded-[28px] items-center mt-6 shadow-md">
          <Text className="text-white font-black text-lg">Güncellemeleri Kaydet ✨</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}