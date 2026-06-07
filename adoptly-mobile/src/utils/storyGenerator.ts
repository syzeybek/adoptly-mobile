// src/utils/storyGenerator.ts

const storyTemplates = [
  // 🎭 Komik & Eğlenceli
  "Merhaba! Ben {name}. Profesyonel bir uyku uzmanı, usta bir mama tadımcısı ve amatör bir sevgi arsızıyım. Özgeçmişimle ilgileniyorsan, hemen başvurunu bekliyorum! 😎🐾",
  "Selamlar! İsmim {name}. Hobilerim arasında camdan dışarıyı izlemek, anlamsızca evin içinde koşturmak ve sahibimin kalbini eritmek var. Birlikte yeni hobiler edinmeye ne dersin? 😻",
  "Hey! Bana {name} derler! Eğer sabahları alarm yerine seni ıslak bir burunla uyandıracak, akşamları da günün stresini unutturacak bir terapist arıyorsan, doğru ilana bakıyorsun! ⏰❤️",

  // 🥺 Duygusal & Sevgi Dolu
  "Merhaba, bana {name} diyorlar. Belki geçmişim biraz zorlu geçti ama içimde kocaman, sevgi dolu bir kalp var. Bana şefkatli kollarını açarsan sana ömür boyu minnettar kalırım. 🥺",
  "Adım {name}. Hayatta tek istediğim yumuşak bir minder ve bana 'iyi ki varsın' diyen bir ses. Eğer o sesi sen çıkarırsan, her sabah güne gülümseyerek başlamanı sağlarım. 🏡",
  "Ben {name}! Biraz utangaç görünebilirim ama bana biraz zaman ve bolca şefkat verirsen, dünyanın en sadık dostu olabilirim. Benim kahramanım olur musun? 🦸‍♂️🐾",

  // ⚡ Enerjik & Oyuncu
  "Ben {name}! Adım kadar tatlı, enerjimle herkesi büyüleyen bir dostum. Eğer evde top peşinde koşacak, seni kapıda heyecanla karşılayacak birini arıyorsan, aradığın kişi tam karşında! 🎾",
  "{name} derler bana! Enerjim hiç bitmez, koşup oynamaya bayılırım. Eğer senin de benim kadar enerjik bir kalbin varsa, harika bir ikili olabiliriz! 🚀",

  // 🌟 Sakin & Uysal
  "Adım {name}. Hayattaki en sevdiğim şey huzurlu bir köşede kestirmek ve güvenilir birinin dizinin dibinde olmak. Dizinde bana da yer var mı? ✨",
  "Selam, ben {name}. Çok gürültüyü sevmem, sakinliği ve huzuru tercih ederim. Eğer sen de kitabını okurken veya dizini izlerken yanında sessizce kıvrılacak bir dost arıyorsan, o benim! 📚💤",
  
  // 💖 Klasik ama Etkili
  "Merhaba! Benim adım {name}. Oyun oynamayı, sevgi dolu kalplere sırnaşmayı çok severim. Eğer bana sıcak bir yuva açarsan, evinin neşesi olmaya söz veriyorum! 🐾",
  "Selam, ben {name}! Başlangıçta biraz sakin olsam da sevgiyi hissettiğim an içimdeki oyuncağı ortaya çıkarırım. Kalbinde bana yer var mı? ❤️"
];

export const generateUniqueStory = (name: string): string => {
  // Rastgele bir şablon seç
  const randomIndex = Math.floor(Math.random() * storyTemplates.length);
  const selectedTemplate = storyTemplates[randomIndex];
  
  // Eğer isim girilmemişse 'Dostumuz' yaz, girilmişse ismi baş harfi büyük olacak şekilde düzelt
  const safeName = name && name.trim() !== "" ? name.trim() : "Dostumuz";
  
  // Şablondaki {name} kısımlarını gerçek isimle değiştir
  return selectedTemplate.replace(/{name}/g, safeName);
};