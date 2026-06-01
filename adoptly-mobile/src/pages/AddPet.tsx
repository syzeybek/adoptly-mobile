import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Background } from '../components/Background';
import { Camera, Type, Info, MapPin, BookOpen, PawPrint } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker'; // Galeriden fotoğraf seçmek için

export const AddPet = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [story, setStory] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();

  // Galeriden Fotoğraf Seçme Fonksiyonu
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Boyutu küçültmek için kaliteyi düşürdük (Max 5MB için iyi bir taktik)
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert("Hata", "İlan vermek için önce giriş yapmalısın! 🐾");
      navigation.navigate('Login');
      return;
    }
    if (!imageUri) {
      Alert.alert("Eksik", "Lütfen dostumuzun bir fotoğrafını seç! 📸");
      return;
    }

    setLoading(true);
    try {
      // 1. Resmi blob formatına çevirip Supabase'e yükleme
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
      const filePath = `pet-images/${fileName}`; 

      const { error: uploadError } = await supabase.storage.from('pets').upload(filePath, blob);
      if (uploadError) throw new Error("Fotoğraf yüklenemedi!");

      const { data: { publicUrl } } = supabase.storage.from('pets').getPublicUrl(filePath);

      // 2. Veriyi Backend'e veya Supabase'e yazma
      const finalStory = story.trim() === '' ? `${name} sevgi dolu yeni bir yuva arıyor.` : story;

      const { error: dbError } = await supabase.from('pets').insert([
        { name, breed, age, location, imageUrl: publicUrl, story: finalStory, user_id: user.id }
      ]);
      if (dbError) throw dbError;
      
      Alert.alert("Başarılı", `${name} başarıyla sisteme eklendi! Yeni yuvası onu bekliyor! 🐾`);
      navigation.navigate('Home'); 
    } catch (error: any) {
      Alert.alert("Hata", error.message || "İlan eklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-transparent">
      <Background />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 40, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
          <View className="bg-white/95 p-8 rounded-[40px] shadow-lg border border-white/50">
            
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-brand-pink/10 rounded-[28px] flex items-center justify-center mb-6">
                <PawPrint color="#FF85A1" size={40} />
              </View>
              <Text className="text-4xl font-black text-gray-900 tracking-tighter mb-2">Yeni İlan Ver</Text>
              <Text className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Bir Dostumuza Yuva Ol</Text>
            </View>

            <View className="space-y-5">
              <View className="flex-row space-x-4">
                <View className="flex-1 space-y-2">
                  <Text className="text-[10px] font-black uppercase text-brand-purple tracking-widest ml-4 opacity-70">İsim</Text>
                  <View className="relative justify-center">
                    <View className="absolute left-4 z-10"><Type color="#9CA3AF" size={18} /></View>
                    <TextInput placeholder="Tarçın" className="w-full pl-12 p-4 rounded-[28px] bg-gray-50 border-2 border-gray-200 font-bold" value={name} onChangeText={setName} />
                  </View>
                </View>
                <View className="flex-1 space-y-2">
                  <Text className="text-[10px] font-black uppercase text-brand-purple tracking-widest ml-4 opacity-70">Cinsi</Text>
                  <View className="relative justify-center">
                    <View className="absolute left-4 z-10"><Info color="#9CA3AF" size={18} /></View>
                    <TextInput placeholder="Tekir" className="w-full pl-12 p-4 rounded-[28px] bg-gray-50 border-2 border-gray-200 font-bold" value={breed} onChangeText={setBreed} />
                  </View>
                </View>
              </View>

              <View className="flex-row space-x-4">
                <View className="flex-1 space-y-2">
                  <Text className="text-[10px] font-black uppercase text-brand-purple tracking-widest ml-4 opacity-70">Yaş</Text>
                  <TextInput placeholder="2 Aylık" className="w-full p-4 rounded-[28px] bg-gray-50 border-2 border-gray-200 font-bold text-center" value={age} onChangeText={setAge} />
                </View>
                <View className="flex-[2] space-y-2">
                  <Text className="text-[10px] font-black uppercase text-brand-purple tracking-widest ml-4 opacity-70">Konum</Text>
                  <View className="relative justify-center">
                    <View className="absolute left-4 z-10"><MapPin color="#9CA3AF" size={18} /></View>
                    <TextInput placeholder="Kadıköy" className="w-full pl-12 p-4 rounded-[28px] bg-gray-50 border-2 border-gray-200 font-bold" value={location} onChangeText={setLocation} />
                  </View>
                </View>
              </View>

              <View className="space-y-2 mt-2">
                <Text className="text-[10px] font-black uppercase text-brand-purple tracking-widest ml-4 opacity-70">Fotoğraf</Text>
                <TouchableOpacity onPress={pickImage} className="relative justify-center">
                  <View className="absolute left-6 z-10"><Camera color="#9CA3AF" size={20} /></View>
                  <View className="w-full pl-16 p-4 rounded-[28px] bg-gray-50 border-2 border-gray-200 justify-center">
                    <Text className={`font-bold ${imageUri ? 'text-brand-purple' : 'text-gray-400'}`}>
                      {imageUri ? "Fotoğraf Seçildi ✅" : "Galeriden Seç"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View className="space-y-2">
                <Text className="text-[10px] font-black uppercase text-brand-purple tracking-widest ml-4 opacity-70">Hikayesi</Text>
                <View className="relative">
                  <View className="absolute left-6 top-5 z-10"><BookOpen color="#9CA3AF" size={20} /></View>
                  <TextInput 
                    multiline 
                    numberOfLines={4} 
                    placeholder="Onu bize anlat..." 
                    className="w-full pl-16 p-4 rounded-[32px] bg-gray-50 border-2 border-gray-200 font-bold min-h-[100px] pt-5" 
                    value={story} 
                    onChangeText={setStory} 
                  />
                </View>
              </View>

              <TouchableOpacity onPress={handleSubmit} disabled={loading} className="w-full bg-brand-pink py-5 rounded-[32px] items-center justify-center mt-6">
                {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-black text-xl">Sisteme Ekle 🐾</Text>}
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};