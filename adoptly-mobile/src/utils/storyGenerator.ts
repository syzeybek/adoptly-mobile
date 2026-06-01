// src/utils/storyGenerator.ts

const storyTemplates = [
  "Merhaba! Benim adım {name}. Oyun oynamayı, sevgi dolu kalplere sırnaşmayı çok severim. Eğer bana sıcak bir yuva açarsan, evinin neşesi olmaya söz veriyorum! 🐾",
  "Ben {name}! Biraz utangaç görünebilirim ama bana biraz zaman ve bolca mama verirsen, dünyanın en sadık dostu olabilirim. Beni ailene katmak ister misin? ❤️",
  "{name} derler bana! Enerjim hiç bitmez, koşup oynamaya bayılırım. Eğer senin de benim kadar enerjik bir kalbin varsa, harika bir ikili olabiliriz! 🏡",
  "Adım {name}. Hayattaki en sevdiğim şey huzurlu bir köşede kestirmek ve güvenilir birinin dizinin dibinde olmak. Belki o kişi sensindir? ✨",
  "Selam, ben {name}! Başlangıçta biraz sakin olsam da sevgiyi hissettiğim an içimdeki oyuncağı ortaya çıkarırım. Kalbinde bana yer var mı? 🐱🐶"
];

export const generateUniqueStory = (name: string): string => {
  // Rastgele bir şablon seç
  const randomIndex = Math.floor(Math.random() * storyTemplates.length);
  const selectedTemplate = storyTemplates[randomIndex];
  
  // Eğer isim girilmemişse 'Dostumuz' yaz, girilmişse ismi kullan
  const safeName = name ? name.trim() : "Dostumuz";
  
  // Şablondaki {name} kısımlarını gerçek isimle değiştir
  return selectedTemplate.replace(/{name}/g, safeName);
};