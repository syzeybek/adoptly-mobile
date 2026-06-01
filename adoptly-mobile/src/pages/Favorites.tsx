import React from 'react';
import { View, Text, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { PetCard } from '../components/PetCard';
import { Background } from '../components/Background';
import { HeartCrack } from 'lucide-react-native';

// navigation prop'u ile sayfalar arası geçişi sağlıyoruz
export const Favorites = ({ navigation }: any) => {
  const { favorites } = useFavorites();

  return (
    // bg-transparent sayesinde arkadaki mor-pembe gradient görünecek
    <SafeAreaView className="flex-1 bg-transparent">
      <Background />
      
      <View className="px-4 py-8 flex-1">
        <View className="mb-8">
          <Text className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-2">
            Favorilerim
          </Text>
          <Text className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            Kalbinde yer ayırdığın dostlar
          </Text>
        </View>

        {favorites.length === 0 ? (
          // Favori Yoksa (Empty State)
          <View className="bg-white/80 rounded-[48px] p-10 flex-col items-center justify-center flex-1 my-10 shadow-xl border border-white/50">
            <HeartCrack size={64} color="rgba(255, 133, 161, 0.5)" className="mb-6" />
            <Text className="text-2xl font-black text-gray-900 mb-4 tracking-tighter text-center">
              Henüz bir dostu favorilemedin
            </Text>
            <Text className="text-gray-500 font-medium mb-8 text-center">
              Görünüşe göre favori listen şu an boş. Anasayfaya dönüp kalbini çalacak o özel dostu bulabilirsin!
            </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Home')}
              className="bg-brand-pink px-8 py-4 rounded-[28px] shadow-lg flex-row items-center justify-center"
            >
              <Text className="text-white font-black text-lg">Dostları Keşfet 🐾</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Favoriler Varsa Listele
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <PetCard pet={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};