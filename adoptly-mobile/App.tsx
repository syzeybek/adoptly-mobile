import React from 'react';
import { View, Platform, StyleSheet } from 'react-native'; // 👈 Sihirli melezleme araçları eklendi
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { Home as HomeIcon, Heart, User, PlusCircle } from 'lucide-react-native';
//@ts-ignore
import './global.css';

import { AuthProvider } from './src/context/AuthContext';
import { FavoritesProvider } from './src/context/FavoritesContext';

import HomeScreen from './src/pages/Home';
import PetDetailScreen from './src/pages/PetDetail';
import ProfileScreen from './src/pages/Profile';
import ApplicationsScreen from './src/pages/Applications'; 

import { AddPet } from './src/pages/AddPet';
import { Favorites } from './src/pages/Favorites';
import { Login } from './src/pages/Login';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

// Alt Sekmeler
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF85A1',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: { paddingBottom: 5, height: 60, borderTopWidth: 0, elevation: 10 },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Ana Sayfa', tabBarIcon: ({ color }) => <HomeIcon color={color} /> }} />
      <Tab.Screen name="Favorites" component={Favorites} options={{ title: 'Favoriler', tabBarIcon: ({ color }) => <Heart color={color} /> }} />
      <Tab.Screen name="AddPet" component={AddPet} options={{ title: 'İlan Ekle', tabBarIcon: ({ color }) => <PlusCircle color={color} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil', tabBarIcon: ({ color }) => <User color={color} /> }} />
    </Tab.Navigator>
  );
}

// Ana Uygulama Çatısı
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
          {/* 👇 SİHİRLİ SANAL ÇERÇEVE BAŞLIYOR 👇 */}
          <View style={Platform.OS === 'web' ? styles.webBackground : styles.mobileContainer}>
            <View style={Platform.OS === 'web' ? styles.webAppFrame : styles.mobileContainer}>
              
              <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="Main" component={TabNavigator} />
                  <Stack.Screen name="PetDetail" component={PetDetailScreen} />
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="Applications" component={ApplicationsScreen} />
                </Stack.Navigator>
              </NavigationContainer>
              <Toast />

            </View>
          </View>
          {/* 👆 SİHİRLİ SANAL ÇERÇEVE BİTİYOR 👆 */}
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// 📱 MELEZLEME STİLLERİ: Telefon ve Bilgisayarın ayrıldığı yer
const styles = StyleSheet.create({
  webBackground: {
    flex: 1,
    backgroundColor: '#E5E7EB', // Bilgisayardayken arkadaki devasa boşluklar şık bir gri olsun
    alignItems: 'center', // Çerçeveyi monitörün tam ortasına hizala
  },
  webAppFrame: {
    width: '100%',
    maxWidth: 450, // 🚨 SİHİR BURADA: Monitör ne kadar büyük olursa olsun 450 piksellik bir iPhone boyutu çiz
    flex: 1,
    backgroundColor: '#FFFFFF', // Çerçevenin içi (uygulama) beyaz
    shadowColor: '#000', // Çerçeveye telefon gibi 3 boyutlu bir gölge ver
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
    overflow: 'hidden',
  },
  mobileContainer: {
    flex: 1, // Telefondaysa hiçbir şeye karışma, tam ekran çalışmaya devam et
  }
});