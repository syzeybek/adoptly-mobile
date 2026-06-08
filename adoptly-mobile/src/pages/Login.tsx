import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Background } from '../components/Background';
import { Mail, Lock, UserPlus, LogIn, User as UserIcon, Calendar, MapPin } from 'lucide-react-native';

export const Login = ({ route, navigation }: any) => {
  const isRegister = route?.params?.isRegister || false;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();

  const handleSubmit = async () => {
    setLoading(true);
    const cleanEmail = email.trim();

    try {
      if (isRegister) {
        await register(cleanEmail, password, { firstName, lastName, age, address });
        Alert.alert("Başarılı", "Aramıza hoş geldin! 🚀");
      } else {
        await login(cleanEmail, password);
        Alert.alert("Başarılı", "Tekrar seni görmek harika! ❤️");
      }
      navigation.navigate('Main');
    } catch (error: any) {
      Alert.alert("Hata", error.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-transparent">
      <Background />
      {/* 🚨 DÜZELTME 1: Web'de ekranı ezmemesi için behavior sadece iOS'ta çalışacak */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 40, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
          <View className="bg-white/95 p-8 rounded-[40px] shadow-lg border border-white/50">
            
            {/* Üst Kısım (Logo ve Başlık) */}
            <View className="items-center mb-8">
              <View className="w-16 h-16 bg-brand-purple/10 rounded-[24px] flex items-center justify-center mb-5">
                {isRegister ? <UserPlus color="#9B5DE5" size={32} /> : <LogIn color="#9B5DE5" size={32} />}
              </View>
              <Text className="text-3xl font-black text-gray-900 tracking-tighter mb-2">
                {isRegister ? "Kaydol" : "Giriş Yap"}
              </Text>
              <Text className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Adoptly Dünyası</Text>
            </View>

            {/* Form Alanı */}
            <View className="flex-col gap-5"> {/* Web uyumu için space-y yerine gap kullanıldı */}
              {isRegister && (
                <>
                  {/* 🚨 DÜZELTME 2: Absolute yerine Flexbox kullanılarak kusursuz hizalama yapıldı */}
                  <View>
                    <Text className="text-[10px] font-black uppercase text-brand-purple tracking-widest ml-4 mb-2 opacity-70">Ad</Text>
                    <View className="flex-row items-center bg-gray-50 border-2 border-gray-100 rounded-[28px] px-5 min-h-[56px]">
                      <UserIcon color="#9CA3AF" size={20} />
                      <TextInput 
                        placeholder="Adınız" 
                        className="flex-1 ml-3 font-bold text-gray-900 py-3" 
                        style={Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}}
                        value={firstName} onChangeText={setFirstName} 
                      />
                    </View>
                  </View>

                  <View>
                    <Text className="text-[10px] font-black uppercase text-brand-purple tracking-widest ml-4 mb-2 opacity-70">Soyad</Text>
                    <View className="flex-row items-center bg-gray-50 border-2 border-gray-100 rounded-[28px] px-5 min-h-[56px]">
                      <UserIcon color="#9CA3AF" size={20} />
                      <TextInput 
                        placeholder="Soyadınız" 
                        className="flex-1 ml-3 font-bold text-gray-900 py-3" 
                        style={Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}}
                        value={lastName} onChangeText={setLastName} 
                      />
                    </View>
                  </View>

                  <View className="flex-row gap-4">
                    <View className="flex-1">
                      <Text className="text-[10px] font-black uppercase text-brand-purple tracking-widest ml-4 mb-2 opacity-70">Yaş</Text>
                      <View className="flex-row items-center bg-gray-50 border-2 border-gray-100 rounded-[28px] px-4 min-h-[56px]">
                        <Calendar color="#9CA3AF" size={18} />
                        <TextInput 
                          keyboardType="numeric" placeholder="18" 
                          className="flex-1 ml-2 font-bold text-gray-900 py-3" 
                          style={Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}}
                          value={age} onChangeText={setAge} 
                        />
                      </View>
                    </View>

                    <View className="flex-[2]">
                      <Text className="text-[10px] font-black uppercase text-brand-purple tracking-widest ml-4 mb-2 opacity-70">Şehir</Text>
                      <View className="flex-row items-center bg-gray-50 border-2 border-gray-100 rounded-[28px] px-4 min-h-[56px]">
                        <MapPin color="#9CA3AF" size={18} />
                        <TextInput 
                          placeholder="Kadıköy" 
                          className="flex-1 ml-2 font-bold text-gray-900 py-3" 
                          style={Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}}
                          value={address} onChangeText={setAddress} 
                        />
                      </View>
                    </View>
                  </View>
                </>
              )}

              <View className="mt-2">
                <Text className="text-[10px] font-black uppercase text-brand-purple tracking-widest ml-4 mb-2 opacity-70">E-Posta</Text>
                <View className="flex-row items-center bg-gray-50 border-2 border-gray-100 rounded-[28px] px-5 min-h-[56px]">
                  <Mail color="#9CA3AF" size={20} />
                  <TextInput 
                    keyboardType="email-address" autoCapitalize="none" 
                    placeholder="merhaba@adoptly.com" 
                    className="flex-1 ml-3 font-bold text-gray-900 py-3" 
                    style={Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}}
                    value={email} onChangeText={setEmail} 
                  />
                </View>
              </View>

              <View>
                <Text className="text-[10px] font-black uppercase text-brand-purple tracking-widest ml-4 mb-2 opacity-70">Şifre</Text>
                <View className="flex-row items-center bg-gray-50 border-2 border-gray-100 rounded-[28px] px-5 min-h-[56px]">
                  <Lock color="#9CA3AF" size={20} />
                  <TextInput 
                    secureTextEntry 
                    placeholder="••••••••" 
                    className="flex-1 ml-3 font-bold text-gray-900 py-3" 
                    style={Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}}
                    value={password} onChangeText={setPassword} 
                  />
                </View>
              </View>

              <TouchableOpacity 
                onPress={handleSubmit} 
                disabled={loading} 
                className="w-full bg-gray-900 py-5 rounded-[28px] items-center justify-center mt-4 shadow-md"
              >
                {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-black text-lg">{isRegister ? "Hemen Başla" : "Pati At 🐾"}</Text>}
              </TouchableOpacity>
            </View>

            <View className="mt-8 items-center">
              <Text className="text-gray-400 font-bold text-xs">{isRegister ? "Hesabın var mı?" : "Hesabın yok mu?"}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login', { isRegister: !isRegister })} className="mt-2 py-2">
                <Text className="text-brand-pink text-[12px] font-black uppercase tracking-widest">{isRegister ? "Giriş Yap" : "Hemen Kaydol"}</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};