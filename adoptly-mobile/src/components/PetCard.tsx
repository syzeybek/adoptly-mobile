// src/components/PetCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MapPin, Heart } from 'lucide-react-native';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import Toast from 'react-native-toast-message';

export const PetCard = ({ pet }: { pet: any }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();
  const navigation = useNavigation();
  const favorited = isFavorite(pet.id);

  const handleFavoriteClick = () => {
    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: 'Favorilere eklemek için önce giriş yapmalısın! 🐾',
      });
      (navigation as any).navigate('Login');
      return;
    }
    toggleFavorite(pet);
  };

  const handleCardPress = () => {
    (navigation as any).navigate('PetDetail', { id: pet.id });
  };

  return (
    <Pressable 
      onPress={handleCardPress}
      className="bg-white rounded-[32px] overflow-hidden shadow-sm flex flex-col mx-4 my-2 border border-brand-pink/20"
    >
      <TouchableOpacity 
        onPress={handleFavoriteClick}
        className={`absolute top-6 right-6 z-20 p-3 rounded-2xl ${
          favorited ? 'bg-red-500' : 'bg-white/90'
        }`}
        style={{ elevation: 5 }} 
      >
        <Heart 
          size={20} 
          color={favorited ? "white" : "#FF85A1"} 
          fill={favorited ? "white" : "transparent"} 
        />
      </TouchableOpacity>

      {/* 🚨 KESİN ÇÖZÜM: Tailwind sınıfları yerine saf Style kullanıldı */}
      <View className="w-full p-3 pb-0">
        <View style={{ width: '100%', height: 260, borderRadius: 24, overflow: 'hidden', backgroundColor: '#F9FAFB' }}>
          <Image 
            source={{ uri: pet.imageUrl || pet.imageurl || pet.image_url }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>
      </View>
      
      <View className="p-6 flex flex-col flex-1">
        <Text className="text-3xl font-black text-gray-900 mb-3 tracking-tighter" numberOfLines={1}>
          {pet.name}
        </Text>
        
        <View className="flex-row flex-wrap items-center mb-2 gap-2">
          {pet.age ? (
            <View className="px-3 py-1 bg-brand-yellow/20 rounded-xl">
              <Text className="text-yellow-600 text-[10px] font-black uppercase tracking-widest">
                {pet.age}
              </Text>
            </View>
          ) : null}
          
          {pet.breed ? (
            <View className="px-3 py-1 bg-brand-cyan/15 rounded-xl">
              <Text className="text-cyan-700 text-[10px] font-black uppercase tracking-widest">
                {pet.breed}
              </Text>
            </View>
          ) : null}
        </View>

        <View className="flex-row items-center mt-auto pt-4 gap-1.5">
          <MapPin size={18} color="#FF85A1" />
          <Text className="text-gray-500 text-xs font-bold uppercase tracking-tight" numberOfLines={1}>
            {pet.location}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};