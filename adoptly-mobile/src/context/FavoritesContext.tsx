import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message'; // Web'deki react-hot-toast yerine

interface FavoritesContextType {
  favorites: any[];
  toggleFavorite: (pet: any) => void;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<any[]>([]);

  // 1. AsyncStorage'dan verileri asenkron olarak çek
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const saved = await AsyncStorage.getItem('adoptly_favorites');
        if (saved) {
          setFavorites(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Favoriler yüklenirken hata:", error);
      }
    };
    loadFavorites();
  }, []);

  // 2. Favorites stateti her değiştiğinde AsyncStorage'a asenkron yaz
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem('adoptly_favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error("Favoriler kaydedilirken hata:", error);
      }
    };
    // Sadece ilk yüklemeden sonra kaydetmek için (opsiyonel optimizasyon)
    saveFavorites();
  }, [favorites]);

  const toggleFavorite = (pet: any) => {
    const exists = favorites.find((fav) => fav.id === pet.id);
    
    if (exists) {
      setFavorites((prev) => prev.filter((fav) => fav.id !== pet.id));
      Toast.show({ type: 'error', text1: 'Bilgi', text2: `${pet.name} favorilerden çıkarıldı 💔` });
    } else {
      setFavorites((prev) => [...prev, pet]);
      Toast.show({ type: 'success', text1: 'Harika!', text2: `${pet.name} favorilerine eklendi! ❤️` });
    }
  };

  const isFavorite = (id: number) => favorites.some((fav) => fav.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
  return context;
};