import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// 👇 İŞTE BÜTÜN DÜĞÜMÜ ÇÖZECEK SATIR BU (Kendi klasör yapına göre yolunu ayarla)
import { apiClient } from '../services/apiClient'; 

// 🐾 1. TÜM İLANLARI ÇEK (Ana Sayfa İçin)
export const usePets = () => {
  return useQuery({
    queryKey: ['pets'],
    queryFn: async () => {
      console.log("🔍 1. ADIM: usePets tetiklendi, gerçek apiClient kullanılıyor!");
      const response = await apiClient.get('/animals');
      // Spring Boot listeyi en eskiden yeniye yollayabilir, mobilde tersine çevirelim (en yeni en üstte)
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
      const response = await apiClient.get(`/animals/${id}`);
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
      const response = await apiClient.get('/animals');
      // Backend'den gelen veriyi frontend'de email'e göre filtreliyoruz
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
      const response = await apiClient.post('/animals', newPet);
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
      const response = await apiClient.put(`/animals/${updatedPet.id}`, updatedPet);
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
      await apiClient.delete(`/animals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.invalidateQueries({ queryKey: ['my-pets'] });
    },
  });
};