import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { Home as HomeIcon, Heart, User, PlusCircle } from 'lucide-react-native';
//@ts-ignore
import './global.css';
import { LogBox } from 'react-native';

import { AuthProvider } from './src/context/AuthContext';
import { FavoritesProvider } from './src/context/FavoritesContext';

import HomeScreen from './src/pages/Home';
import PetDetailScreen from './src/pages/PetDetail';
import ProfileScreen from './src/pages/Profile';
import ApplicationsScreen from './src/pages/Applications'; 

import { AddPet } from './src/pages/AddPet';
import { Favorites } from './src/pages/Favorites';
import { Login } from './src/pages/Login';
import EditPetScreen from './src/pages/EditPet';

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

LogBox.ignoreAllLogs(true);
// Ana Uygulama Çatısı
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
          {/* 👇 SİHİRLİ SANAL SİMÜLATÖR BAŞLIYOR 👇 */}
          <View style={Platform.OS === 'web' ? styles.webBackground : styles.mobileContainer}>
            
            {/* 1. KATMAN: Fiziksel Telefon Kasası */}
            <View style={Platform.OS === 'web' ? styles.webPhoneBody : styles.mobileContainer}>
              
              {/* 2. KATMAN: Uygulamanın İçeriği (Sanal Ekran) */}
              <View style={Platform.OS === 'web' ? styles.webScreenWrapper : styles.mobileContainer}>
                
                {/* 🚨 EK DETAY: Sanal Telefon Çentiği (Notch) */}
                {Platform.OS === 'web' && <View style={styles.webNotch} />}

                <NavigationContainer>
                  <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Main" component={TabNavigator} />
                    <Stack.Screen name="PetDetail" component={PetDetailScreen} />
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Applications" component={ApplicationsScreen} />
                    <Stack.Screen name="EditPet" component={EditPetScreen} />
                  </Stack.Navigator>
                </NavigationContainer>
                <Toast />

              </View>
            </View>
            {/* 👆 SİHİRLİ SANAL SİMÜLATÖR BİTİYOR 👆 */}
          </View>
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// 📱 MELEZLEME VE SİMÜLATÖR STİLLERİ
const styles = StyleSheet.create({
  webBackground: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Bilgisayardayken arkadaki boşluklar açık gri olsun
    alignItems: 'center', // Simülatörü tam monitörün ortasına hizala
    justifyContent: 'center', // Dikeyde de ortalayalım, havada asılı kalsın
  },
  
  // 🐋 FİZİKSEL TELEFON KASASI
  webPhoneBody: {
    width: '100%',
    maxWidth: 470, // Ekran 450px, kasamız ondan biraz daha kalın (bezels)
    height: '100%',
    maxHeight: 900, // Simülatörün dikeyde çok uzamaması için sınır koyalım
    flex: 1,
    backgroundColor: '#1F2937', // Fiziksel Kasa Rengi: Uzay Grisi
    borderRadius: 50, // Çok yuvarlak köşeler (iPhone simülatörü gibi)
    borderWidth: 10, // Kasa kalınlığı
    borderColor: '#000', // Kasanın en dış metal çerçevesi
    shadowColor: '#000', // Çok gerçekçi 3 boyutlu gölge
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 20,
    overflow: 'hidden', // İçerik kasanın dışına taşmasın
    alignItems: 'center', // İçeriği ortala
  },

  // 🐋 SANAL EKRAN SARMALAYICISI (Uygulamanın Oynadığı Yer)
  webScreenWrapper: {
    width: '100%', // Kasanın içini kapla
    flex: 1,
    backgroundColor: '#FFFFFF', // Ekranın içi beyaz
    borderRadius: 35, // Ekranın kendi köşeleri de yuvarlak olsun (ama kasadan az)
    overflow: 'hidden', // Uygulama ekranın köşelerinden blede yapmasın
  },

  // 🐋 SANAL TELEFON ÇENTİĞİ (NOTCH)
  webNotch: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ translateX: -75 }], // 150px genişliğin yarısı kadar geri çek
    width: 150,
    height: 30,
    backgroundColor: '#000', // Siyah çentik
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    zIndex: 9999, // Uygulama içeriğinin en tepesinde kalsın
  },

  mobileContainer: {
    flex: 1, // Telefondaysa hiçbir şeye karışma, tam ekran çalışmaya devam et
  }
});