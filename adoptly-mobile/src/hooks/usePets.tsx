import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// 👇 İŞTE BÜTÜN DÜĞÜMÜ ÇÖZECEK SATIR BU
import { apiClient } from '../services/apiClient'; 

// 🐾 1. TÜM İLANLARI ÇEK (Ana Sayfa İçin)
export const usePets = () => {
  return useQuery({
    queryKey: ['pets'],
    queryFn: async () => {
      console.log("🔍 1. ADIM: usePets tetiklendi, gerçek apiClient kullanılıyor!");
      // 💡 DÜZELTİLDİ: Sadece /animals yerine /api/animals yazıldı
      const response = await apiClient.get('/api/animals');
      return response.data.reverse(); 
    },
  });
};

// 🐾 2. TEK BİR İLANI ÇEK (Detay Sayfası İçin)
export const usePet = (id: string | undefined) => {
  return useQuery({
    queryKey: ['pet', id],
    queryFn: async () => {
      if (!id) return null;
      // 💡 DÜZELTİLDİ: /api/ eklendi
      const response = await apiClient.get(`/api/animals/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// 🐾 3. KULLANICIYA ÖZEL İLANLARI ÇEK (Profil Sayfası İçin)
export const useMyPets = (email: string | undefined) => {
  return useQuery({
    queryKey: ['my-pets', email],
    queryFn: async () => {
      if (!email) return [];
      // 💡 DÜZELTİLDİ: /api/ eklendi
      const response = await apiClient.get('/api/animals');
      const myPets = response.data.filter((pet: any) => pet.ownerEmail === email);
      return myPets.reverse();
    },
    enabled: !!email,
  });
};

// 🐾 4. YENİ İLAN EKLE
export const useAddPet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newPet: any) => {
      // 💡 DÜZELTİLDİ: /api/ eklendi
      const response = await apiClient.post('/api/animals', newPet);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.invalidateQueries({ queryKey: ['my-pets'] });
    },
  });
};

// 🐾 5. İLANI GÜNCELLE
export const useUpdatePet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedPet: any) => {
      // 💡 DÜZELTİLDİ: /api/ eklendi
      const response = await apiClient.put(`/api/animals/${updatedPet.id}`, updatedPet);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.invalidateQueries({ queryKey: ['pet', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['my-pets'] });
    },
  });
};

// 🐾 6. İLANI SİL
export const useDeletePet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      // 💡 DÜZELTİLDİ: /api/ eklendi
      await apiClient.delete(`/api/animals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.invalidateQueries({ queryKey: ['my-pets'] });
    },
  });
};