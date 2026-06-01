// src/pages/Applications.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { ClipboardList, Clock, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react-native';

export default function ApplicationsScreen() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!user) return;
    const fetchApps = async () => {
      const { data } = await supabase.from('applications').select(`id, status, created_at, pets (*)`).eq('user_id', user.id);
      if (data) setApplications(data);
      setLoading(false);
    };
    fetchApps();
  }, [user]);

  const getStatusIcon = (status: string) => {
    if (status === 'Onaylandı') return <CheckCircle2 size={16} color="#15803d" />;
    if (status === 'Reddedildi') return <XCircle size={16} color="#b91c1c" />;
    return <Clock size={16} color="#b45309" />; // pending
  };

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6 bg-white self-start p-3 rounded-full shadow-sm">
        <ArrowLeft color="#1F2937" size={20} />
      </TouchableOpacity>

      <View className="flex-row items-center gap-4 mb-10">
        <View className="p-4 bg-brand-cyan/10 rounded-[24px]">
          <ClipboardList color="#00BBF9" size={32} />
        </View>
        <View>
          <Text className="text-3xl font-black text-gray-900">Başvurularım</Text>
          <Text className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Sahiplenme sürecin</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00BBF9" />
      ) : applications.length === 0 ? (
        <View className="bg-white p-10 rounded-[40px] items-center border-2 border-dashed border-gray-100 mt-4">
          <Text className="text-6xl mb-4 opacity-50">🐾</Text>
          <Text className="text-gray-400 font-black text-center mb-6">Henüz bir dostumuz için başvuru yapmamışsın.</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Ana Sayfa' as never)} className="bg-brand-purple py-4 px-8 rounded-full">
            <Text className="text-white font-black text-sm">İlk adımı at ❤️</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="space-y-4">
          {applications.map((app) => (
            <View key={app.id} className="bg-white p-4 rounded-[28px] shadow-sm flex-row items-center border border-gray-50">
              <Image source={{ uri: app.pets?.imageUrl }} className="w-20 h-20 rounded-[20px] bg-gray-100" />
              <View className="flex-1 ml-4">
                <Text className="text-xl font-black text-gray-900">{app.pets?.name}</Text>
                <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {new Date(app.created_at).toLocaleDateString('tr-TR')}
                </Text>
                
                {/* Status Badge */}
                <View className={`mt-2 self-start flex-row items-center gap-1 px-3 py-1.5 rounded-lg ${
                  app.status === 'Onaylandı' ? 'bg-green-100' : app.status === 'Reddedildi' ? 'bg-red-100' : 'bg-orange-100'
                }`}>
                  {getStatusIcon(app.status)}
                  <Text className={`font-black text-[10px] uppercase tracking-widest ${
                    app.status === 'Onaylandı' ? 'text-green-700' : app.status === 'Reddedildi' ? 'text-red-700' : 'text-orange-700'
                  }`}>
                    {app.status === 'pending' ? 'Beklemede' : app.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}