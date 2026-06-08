 Mobil Frontend Görevleri

**Mobile Front-end Demo Videosu:** [Link buraya eklenecek](https://example.com)

## 1. Hayvan İlanı Oluşturma Ekranı

* **API Endpoint:** `POST /api/animals`
* **Görev:** Kullanıcıların sisteme yeni bir sahiplendirme ilanı eklemesi için mobil ekran tasarımı ve implementasyonu.
* **UI Bileşenleri:**
* Fotoğraf ekleme/değiştirme butonu (Kamera ikonlu yuvarlak alan)
* İsim (name) input alanı
* Cins (breed) input alanı
* Yaş (age) input alanı 
* Konum (location) input alanı
* "İlanı Ekle" / "Kaydet" butonu


* **Form Validasyonu:**
* Yaş (age) bilgisinin veritabanına gönderilirken String'den Integer formuna (parseInt) çevrilmesi.
* Form verilerinde (FormData) eksik alan kontrolü.


* **Kullanıcı Deneyimi:**
* **Ziyaretçi Kalkanı (Guest Shield):** Giriş yapmayan kullanıcıların bu ekrana erişiminin engellenmesi ve şık bir "Aramıza Katıl" bilgilendirme UI'ı sunulması.
* Cihaz galerisinden görsel seçimi ve anlık önizleme (Image Placeholder).
* Kayıt esnasında "Loading" durumu.


* **Teknik Detaylar:**
* `expo-image-picker` entegrasyonu.
* İşlem sonrası `queryClient.invalidateQueries` tetiklenerek React Query önbelleğinin temizlenmesi ve yeni ilanın ana sayfada anında belirmesi.



## 2. İlanları Listeleme Ekranı (Ana Sayfa)

* **API Endpoint:** `GET /api/animals`
* **Görev:** Sistemdeki tüm sahiplendirilebilir hayvanların genel listesine performanslı bir şekilde erişilmesi.
* **UI Bileşenleri:**
* Üst gezinme ve arama barı
* Pet Card bileşenleri (Yuvarlatılmış köşeler, Evcil hayvan fotoğrafı, İsim, Cins ve Renk etiketleri)
* Alt Navigasyon (Bottom Tab Bar) menüsü


* **Kullanıcı Deneyimi:**
* **Ziyaretçi Modu:** İlan listesinin anonim (giriş yapmamış) ziyaretçilere tamamen açık bırakılması.
* Veriler yüklenirken ekranda `ActivityIndicator` (Yükleniyor animasyonu) gösterimi.
* Veri bulunamadığında kullanıcı dostu "Empty State" (Üzgün kedi ikonu ve bilgilendirme metni).


* **Teknik Detaylar:**
* Platform: React Native (Expo) - NativeWind V2.
* Büyük listelerin belleği (RAM) yormadan çizilebilmesi için `FlatList` mimarisi.
* Veri çekimi ve yönetimi için `useQuery` (TanStack) kullanılması.



## 3. İlan Detaylarını Görüntüleme Ekranı

* **API Endpoint:** `GET /api/animals/{animalId}`
* **Görev:** Seçilen belirli bir hayvanın tüm detaylı bilgilerine ulaşılmasını sağlayan tam ekran tasarımı.
* **UI Bileşenleri:**
* Tam sayfa / Geniş evcil hayvan fotoğrafı (Header Hero Image)
* Sol üst köşede Geri Dön (ArrowLeft) butonu
* İsim, Cins, Yaş ve Konum bilgisi kartları
* Detaylı açıklama (Description) metin bloğu
* "Sahiplenmek İstiyorum" ana aksiyon (Call to Action) butonu


* **Kullanıcı Deneyimi:**
* Akıcı ekran geçişleri ve okunabilir geniş tipografi hiyerarşisi.
* Geri dön butonuyla önceki liste (scroll) konumunun korunması.


* **Teknik Detaylar:**
* Navigasyon yönlendirmesi ile `id` bilgisinin Route Parametreleri üzerinden aktarılması.
* Detay verisinin `usePet(id)` özel hook'u ile backend'den çekilmesi.



## 4. İlan Bilgilerini Güncelleme Ekranı

* **API Endpoint:** `PUT /api/animals/{animalId}` 
* **Görev:** Mevcut bir hayvan ilanının tüm bilgilerinin ve fotoğrafının düzenlenmesini sağlayan form ekranı.
* **UI Bileşenleri:**
* Mevcut verilerle önceden doldurulmuş (Pre-filled) input alanları.
* Fotoğraf değiştirme önizleme modülü.
* Geri dön (Vazgeç) butonu.
* "Güncellemeleri Kaydet ✨" butonu.


* **Form Validasyonu:**
* Veritabanı şema eşleşmesi.


* **Kullanıcı Deneyimi:**
* İlan bilgilerinin sıfırdan girilmesine gerek kalmadan anında düzenlenebilmesi.
* İşlem sonrası "Harika! İlan güncellendi" Toast bildirimi.


* **Teknik Detaylar:**
* Optimistic Invalidation: Hem liste (`['pets']`) hem de tekil ilan (`['pet', id]`) önbelleklerinin aynı anda patlatılarak verinin anında senkronize edilmesi.



## 5. İlan Kaldırma (Silme) Akışı

* **API Endpoint:** `DELETE /api/animals/{animalId}` 
* **Görev:** Bir ilanın sistemden kalıcı olarak silinmesi için güvenli UI akışının sağlanması.
* **UI Bileşenleri:**
* Profil sayfasındaki ilan kartları üzerinde yer alan kırmızı renkli "Çöp Kutusu" (Sil) ikonu.
* Onay Dialog'u (Alert modalı).


* **Kullanıcı Deneyimi:**
* Yıkıcı eylemler (Destructive actions) için kırmızı uyarı renklerinin kullanımı.
* Kazara silmeleri engellemek için "Emin misin?" çift onay mekanizması.
* İptal seçeneğinin her zaman erişilebilir olması.


* **Akış Adımları:**
1. Profil ekranında tıklanması.
2. İşlemi onaylama Dialog penceresinin açılması.
3. "Sil" seçildiğinde arka planda veritabanından kalıcı silinmesi.
4. İlanın ekrandaki listeden anında kaybolması.


* **Teknik Detaylar:**
* React Native `Alert.alert` API kullanımı.
* Frontend State üzerinden Optimistic Update (`setListings(prev => prev.filter(...))`) ile sunucu yanıtı beklemeden UI temizliği.



## 6. Sahiplenme Başvurusu Yapma

* **API Endpoint:** `POST /api/applications`
* **Görev:** Kayıtlı kullanıcıların hayvan sahiplenmek için form doldurup başvuru talebi iletmesi.
* **UI Bileşenleri:**
* İlan detayındaki "Sahiplen" butonu.
* İletişim bilgileri form alanları.


* **Kullanıcı Deneyimi:**
* Sadece giriş yapmış (Oturumu açık) kullanıcıların başvuru yapabilmesi.
* Giriş yapmayan kullanıcıların başvuruya tıkladığında Login ekranına zarifçe yönlendirilmesi.


* **Teknik Detaylar:**
* `AuthContext` üzerinden mevcut `user` durumunun kontrol edilmesi.
* Payload oluşturularak Axios ile POST isteği gönderilmesi.



## 7. Başvuruları Listeleme Ekranı

* **API Endpoint:** `GET /api/applications/my`
* **Görev:** Kullanıcının geçmiş başvurularını ve bu başvuruların durumlarını tek ekranda takip etmesi.
* **UI Bileşenleri:**
* Profil ekranında yatay sekmeler (İlanlarım / Başvurularım toggle menüsü).
* Başvuru detay kartları.
* Durum etiketleri (Onaylandı, Bekliyor, Reddedildi).


* **Kullanıcı Deneyimi:**
* Sayfa yenilemeye gerek kalmadan `activeTab` ile ilanlar ve başvurular arasında sekme (Tab) geçişi.
* Durumlara göre renkli etiketlendirme (Görsel hiyerarşi).


* **Teknik Detaylar:**
* Tek sayfa (Single Page) içinde State management ile görünüm render işlemleri.
* Sunucudan `user_id` bazlı filtreleme ile verilerin getirilmesi.



## 8. Hayvan Filtreleme ve Arama Mekanizması

* **API Endpoint:** `GET /api/animals/search` (Client-Side Memory Filtering)
* **Görev:** Kullanıcıların tür, şehir ve isme göre daraltma yapabilmesi.
* **UI Bileşenleri:**
* Kelime bazlı canlı arama inputu (Search Bar).
* Ayarlar/Filtre ikonu.
* Alttan açılan Bottom Sheet (Modal) Filtre Paneli.
* Şehir ve Cins seçimi için yatay (Horizontal) FlatList chipleri.


* **Kullanıcı Deneyimi:**
* Aktif bir filtre devredeyken filtre ikonunun renk değiştirerek (Mor/Pembe) kullanıcıya görsel geri bildirim vermesi.
* Modal dışına (siyah saydam alana) tıklanarak hızlıca kapatılabilmesi.


* **Teknik Detaylar:**
* **Performans Algoritması:** Sunucuya sürekli istek atmak yerine, çekilen tüm ilanlar içerisinden benzersiz şehir ve türlerin `useMemo` kancası ile frontend'de (Client-Side) ayrıştırılması ve filtrelenmesi.
* **Web Kelepçelemesi (Portal Fix):** Web ortamında Modal'ın tüm monitöre yayılmasını engellemek amacıyla `Platform.OS === 'web'` kontrolü ile 470px'lik akıllı sınırlar (Max-Width Constraint) konulması.



## 9. Üye Olma (Kayıt) Ekranı

* **API Endpoint:** `POST /api/auth/register`
* **Görev:** Yeni kullanıcı hesaplarının oluşturulması.
* **UI Bileşenleri:**
* Ad, Soyad, Yaş ve Şehir input alanları.
* Email ve Şifre input alanları.
* İkonlu (Lucide) input tasarımları.
* Ekranı Login moduna geçiren "Hesabın var mı?" butonu.


* **Form Validasyonu:**
* Giriş verilerinin `trim()` ile gereksiz boşluklardan arındırılması.
* Form gönderme anında uygulamanın `loading` state'ine alınması.


* **Kullanıcı Deneyimi:**
* Klavyenin inputları kapatmasını engelleyen `KeyboardAvoidingView` koruması (iOS 'padding' ayarı ile).
* Şık UI/UX geçişleri için yatay ve dikey Flexbox hizalamaları.


* **Teknik Detaylar:**
* Supabase Auth entegrasyonu.
* Web tarayıcılarında inputlara tıklandığında beliren varsayılan çerçevenin `outlineStyle: 'none'` ile kaldırılarak Native (Mobil) hissinin korunması.



## 10. Giriş Yapma Ekranı

* **API Endpoint:** `POST /api/auth/login`
* **Görev:** Kayıtlı kullanıcıların e-posta ve şifreleriyle güvenli erişim sağlaması.
* **UI Bileşenleri:**
* E-posta ve şifre kutuları.
* "Pati At 🐾" onay butonu.


* **Kullanıcı Deneyimi:**
* Şifre girişinde karakterlerin gizlenmesi (`secureTextEntry`).
* Hatalı girişlerde uyarı bildirimleri.


* **Akış Adımları:**
1. Login sayfasında bilgilerin girilmesi.
2. Başarılı doğrulama sonrası `AuthContext`'in tetiklenmesi.
3. Ana sayfa sekmesine (`Main`) pürüzsüz yönlendirme.


* **Teknik Detaylar:**
* **Token Yönetimi:** `SecureStore` (Expo) kullanılarak JWT Token'ın cihazın güvenli hafızasında saklanması.
* **Axios Interceptor:** Token'ın yakalanıp uygulama içindeki tüm kapalı API isteklerinin `Headers` kısmına (Bearer Authentication) otomatik olarak enjekte edilmesi.
