import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, SafeAreaView, Modal, Pressable, Platform } from 'react-native'; // 👈 Platform modülü eklendi
import { usePets } from '../hooks/usePets';
import { PetCard } from '../components/PetCard';
import { Background } from '../components/Background';
import { Search, PawPrint, SlidersHorizontal } from 'lucide-react-native';

export default function Home() {
  const { data: pets, isLoading } = usePets();
  
  // Arama ve Filtre State'leri
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Hepsi');
  const [selectedBreed, setSelectedBreed] = useState('Hepsi');
  
  // Modal (Filtre Paneli) Görünürlüğü
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Benzersiz şehir ve cinsleri bulma
  const { uniqueLocations, uniqueBreeds } = useMemo(() => {
    if (!pets) return { uniqueLocations: [], uniqueBreeds: [] };
    const locations = Array.from(new Set(pets.map((p: any) => p.location))).filter(Boolean);
    const breeds = Array.from(new Set(pets.map((p: any) => p.breed))).filter(Boolean);
    return { uniqueLocations: locations, uniqueBreeds: breeds };
  }, [pets]);

  // Filtreleme Algoritması
  const filteredPets = useMemo(() => {
    if (!pets) return [];
    return pets.filter((pet: any) => {
      const matchSearch = (pet.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchLocation = selectedLocation === 'Hepsi' || pet.location === selectedLocation;
      const matchBreed = selectedBreed === 'Hepsi' || pet.breed === selectedBreed;
      return matchSearch && matchLocation && matchBreed;
    });
  }, [pets, searchTerm, selectedLocation, selectedBreed]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FF85A1" />
      </SafeAreaView>
    );
  }

  const hasActiveFilters = selectedLocation !== 'Hepsi' || selectedBreed !== 'Hepsi';

  return (
    <SafeAreaView className="flex-1">
      <Background />
      
      {/* Üst Arama ve Filtre Çubuğu */}
      <View className="px-4 pt-6 pb-2">
        <View className="flex-row items-center gap-3">
          {/* Arama Kutusu */}
          <View className="flex-1 flex-row items-center bg-white rounded-[32px] px-4 py-3 shadow-sm border border-gray-100">
            <Search color="#9CA3AF" size={20} />
            <TextInput
              className="flex-1 ml-3 font-bold text-gray-800"
              placeholder="İsim ara..."
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>

          {/* Filtre Açma Butonu */}
          <TouchableOpacity 
            onPress={() => setIsFilterVisible(true)}
            className={`p-3 rounded-full shadow-sm border ${hasActiveFilters ? 'bg-brand-pink border-brand-pink' : 'bg-white border-gray-100'}`}
          >
            <SlidersHorizontal color={hasActiveFilters ? "white" : "#9B5DE5"} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* İlan Listesi */}
      <FlatList
        data={filteredPets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PetCard pet={item} />}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View className="items-center py-24 px-8 mt-10 bg-white/40 rounded-[40px] border-2 border-dashed border-gray-200 mx-4">
            <View className="bg-gray-100 w-20 h-20 rounded-full items-center justify-center mb-4">
              <PawPrint color="#D1D5DB" size={32} />
            </View>
            <Text className="text-center font-black text-gray-400 text-lg uppercase tracking-widest">
              Aradığın kriterlerde bir dost bulamadık 😿
            </Text>
          </View>
        )}
      />

      {/* ALTTAN AÇILAN FİLTRE PANELİ (MODAL) */}
      <Modal visible={isFilterVisible} animationType="slide" transparent={true}>
        {/* Arka planı koyulaştıran alan (Web'de ortalamak için items-center eklendi) */}
        <Pressable 
          className="flex-1 bg-black/40 justify-end items-center" 
          onPress={() => setIsFilterVisible(false)}
        >
          
          {/* İçerik Paneli (Web platformunda 470px genişliğe kelepçelendi) */}
          <Pressable 
            style={{ width: '100%', maxWidth: Platform.OS === 'web' ? 470 : undefined }}
            className="bg-white rounded-t-[40px] p-6 pb-12 shadow-2xl"
          >
            <View className="w-16 h-1.5 bg-gray-200 rounded-full self-center mb-6" />
            
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-black text-gray-900">Filtrele</Text>
              {hasActiveFilters && (
                <TouchableOpacity onPress={() => { setSelectedLocation('Hepsi'); setSelectedBreed('Hepsi'); setIsFilterVisible(false); }}>
                  <Text className="text-red-500 font-bold">Temizle</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Şehir Seçimi */}
            <Text className="font-bold text-gray-400 mb-3 ml-2 uppercase tracking-widest text-xs">Şehir</Text>
            <FlatList 
              horizontal showsHorizontalScrollIndicator={false} className="mb-6"
              data={['Hepsi', ...uniqueLocations]}
              renderItem={({item}) => (
                <TouchableOpacity 
                  onPress={() => setSelectedLocation(item as string)}
                  className={`px-5 py-3 rounded-full mr-3 border ${selectedLocation === item ? 'bg-brand-pink border-brand-pink' : 'bg-gray-50 border-gray-100'}`}
                >
                  <Text className={`font-bold ${selectedLocation === item ? 'text-white' : 'text-gray-600'}`}>{item as string}</Text>
                </TouchableOpacity>
              )}
            />

            {/* Cins Seçimi */}
            <Text className="font-bold text-gray-400 mb-3 ml-2 uppercase tracking-widest text-xs">Cins</Text>
            <FlatList 
              horizontal showsHorizontalScrollIndicator={false} className="mb-8"
              data={['Hepsi', ...uniqueBreeds]}
              renderItem={({item}) => (
                <TouchableOpacity 
                  onPress={() => setSelectedBreed(item as string)}
                  className={`px-5 py-3 rounded-full mr-3 border ${selectedBreed === item ? 'bg-brand-purple border-brand-purple' : 'bg-gray-50 border-gray-100'}`}
                >
                  <Text className={`font-bold ${selectedBreed === item ? 'text-white' : 'text-gray-600'}`}>{item as string}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity 
              onPress={() => setIsFilterVisible(false)}
              className="bg-gray-900 py-5 rounded-[32px] items-center"
            >
              <Text className="text-white font-black text-lg">Sonuçları Göster</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
}