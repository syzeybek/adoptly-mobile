// src/pages/EditPet.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { usePet, useUpdatePet } from '../hooks/usePets';
import { ArrowLeft } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

export default function EditPetScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id: string };
  
  const { data: pet, isLoading } = usePet(id);
  const updatePetMutation = useUpdatePet();
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (pet) setFormData(pet);
  }, [pet]);

  const handleSubmit = () => {
    updatePetMutation.mutate(formData, {
      onSuccess: () => {
        Toast.show({ type: 'success', text1: 'Harika', text2: 'Değişiklikler kaydedildi! ✨' });
        navigation.goBack();
      }
    });
  };

  if (isLoading || !pet) return <ActivityIndicator className="mt-20" size="large" color="#00BBF9" />;

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center mb-6">
        <ArrowLeft color="#9B5DE5" size={20} />
        <Text className="ml-2 font-black text-brand-purple">Vazgeç</Text>
      </TouchableOpacity>

      <Text className="text-3xl font-black text-gray-900 mb-6">İlanı Düzenle</Text>

      <View className="space-y-4">
        <TextInput 
          value={formData.name} onChangeText={(t) => setFormData({...formData, name: t})}
          className="bg-white p-4 rounded-[20px] font-bold border border-gray-100" placeholder="İsim"
        />
        <TextInput 
          value={formData.breed} onChangeText={(t) => setFormData({...formData, breed: t})}
          className="bg-white p-4 rounded-[20px] font-bold border border-gray-100" placeholder="Cinsi"
        />
        {/* Diğer inputlar da AddPet'teki gibi eklenebilir... */}
        
        <TouchableOpacity onPress={handleSubmit} className="bg-brand-cyan py-5 rounded-[28px] items-center mt-4 shadow-md">
          <Text className="text-white font-black text-lg">Güncellemeleri Kaydet ✨</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}