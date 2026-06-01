import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PawPrint, Cat, Dog, Rabbit, Fish, Bird, Heart } from 'lucide-react-native';

export const Background = () => {
  return (
    // Arka plan renk geçişi (Playful Mor'dan Neşeli Pembe'ye)
    <LinearGradient
      colors={['#9B5DE5', '#FF85A1']} 
      style={StyleSheet.absoluteFillObject} // Tüm ekranı kaplar ve en arkaya atar
    >
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        
        {/* ÜST BÖLÜM */}
        <View className="absolute top-[5%] left-[8%]"><Cat size={24} color="rgba(255,255,255,0.2)" /></View>
        <View className="absolute top-[15%] left-[35%]"><Bird size={20} color="rgba(255,255,255,0.1)" /></View>
        <View className="absolute top-[10%] right-[15%]"><Dog size={35} color="rgba(255,255,255,0.2)" /></View>
        <View className="absolute top-[25%] right-[5%]"><PawPrint size={18} color="rgba(255,255,255,0.2)" /></View>
        <View className="absolute top-[18%] left-[20%]"><Heart size={15} fill="rgba(255,255,255,0.1)" color="rgba(255,255,255,0.1)" /></View>

        {/* ORTA BÖLÜM */}
        <View className="absolute top-[45%] left-[5%]"><Rabbit size={32} color="rgba(255,255,255,0.2)" /></View>
        <View className="absolute top-[40%] right-[25%]"><Fish size={26} color="rgba(255,255,255,0.1)" /></View>
        <View className="absolute top-[55%] left-[25%]"><PawPrint size={22} color="rgba(255,255,255,0.1)" /></View>
        <View className="absolute top-[50%] right-[10%]"><Cat size={28} color="rgba(255,255,255,0.2)" /></View>
        <View className="absolute top-[35%] left-[45%]"><Bird size={30} color="rgba(255,255,255,0.1)" /></View>

        {/* ALT BÖLÜM */}
        <View className="absolute bottom-[10%] left-[12%]"><Dog size={34} color="rgba(255,255,255,0.2)" /></View>
        <View className="absolute bottom-[20%] right-[15%]"><Rabbit size={30} color="rgba(255,255,255,0.2)" /></View>
        <View className="absolute bottom-[15%] left-[40%]"><PawPrint size={24} color="rgba(255,255,255,0.1)" /></View>
        <View className="absolute bottom-[25%] left-[20%]"><Fish size={22} color="rgba(255,255,255,0.2)" /></View>
        <View className="absolute bottom-[5%] right-[40%]"><Heart size={18} fill="rgba(255,255,255,0.1)" color="rgba(255,255,255,0.1)" /></View>

        {/* EKSTRA SERPİŞTİRMELER */}
        <View className="absolute top-[75%] left-[10%]"><PawPrint size={16} color="rgba(255,255,255,0.1)" /></View>
        <View className="absolute top-[30%] right-[45%]"><Bird size={18} color="rgba(255,255,255,0.1)" /></View>
        <View className="absolute bottom-[40%] right-[5%]"><PawPrint size={20} color="rgba(255,255,255,0.1)" /></View>
        <View className="absolute top-[60%] right-[40%]"><Rabbit size={25} color="rgba(255,255,255,0.1)" /></View>
        
      </View>
    </LinearGradient>
  );
};