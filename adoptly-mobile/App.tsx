import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { Home as HomeIcon, Heart, User, PlusCircle } from 'lucide-react-native';

import { AuthProvider } from './src/context/AuthContext';
import { FavoritesProvider } from './src/context/FavoritesContext';

// 1. Varsayılan (Default) İçe Aktarımlar (Kendi yazdıkların)
import HomeScreen from './src/pages/Home';
import PetDetailScreen from './src/pages/PetDetail';
import ProfileScreen from './src/pages/Profile';

// 2. İsimli (Named) İçe Aktarımlar (Benim az önce sana verdiklerim - Süslü Parantezli)
import { AddPet } from './src/pages/AddPet';
import { Favorites } from './src/pages/Favorites';
import { Login } from './src/pages/Login';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

// Alt Sekmeler (Bottom Navigation)
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF85A1', // Neşeli Pembe
        tabBarInactiveTintColor: '#9CA3AF', // Gri
        tabBarStyle: { paddingBottom: 5, height: 60, borderTopWidth: 0, elevation: 10 },
      }}
    >
      <Tab.Screen name="Ana Sayfa" component={HomeScreen} options={{ tabBarIcon: ({ color }) => <HomeIcon color={color} /> }} />
      <Tab.Screen name="Favoriler" component={Favorites} options={{ tabBarIcon: ({ color }) => <Heart color={color} /> }} />
      <Tab.Screen name="İlan Ekle" component={AddPet} options={{ tabBarIcon: ({ color }) => <PlusCircle color={color} /> }} />
      <Tab.Screen name="Profil" component={ProfileScreen} options={{ tabBarIcon: ({ color }) => <User color={color} /> }} />
    </Tab.Navigator>
  );
}

// Ana Uygulama Çatısı
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
          <>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* Önce Tab menüsü olan sayfalar gelir */}
                <Stack.Screen name="Main" component={TabNavigator} />
                {/* Alt menüsü olmayan (tam ekran) sayfalar burada tanımlanır */}
                <Stack.Screen name="PetDetail" component={PetDetailScreen} />
                <Stack.Screen name="Login" component={Login} />
              </Stack.Navigator>
            </NavigationContainer>
            <Toast />
          </>
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}