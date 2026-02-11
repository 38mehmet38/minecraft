# Minecraft Clone - Android Mobil Sürüm

Türkler tarafından geliştirilmiş, **Android'de oynanabilen** Minecraft klonu!

## 🎮 Yeni Özellikler (Android Sürümü)

### ✨ Sanal Joystick
- **Konum**: Ekranın sol alt köşesi
- **İşlev**: Oyuncu hareketini kontrol etmek için joystick'i sürükle
- Hassas ve yumuşak kontrol sistemi
- Desteklenen harekeler: İleri, Geri, Sol, Sağ, Diagonel

### 🎯 Kontrol Simgeleri
Ekranın sağ alt köşesinde kontrol tuşları, kullanım amaçlarına göre simgelerle işaretlenmiştir:

| Simge | Tuş | İşlev |
|-------|-----|-------|
| ⬆️ | W | İleri Hareket |
| ⬅️ | A | Sol Hareket |
| ⬇️ | S | Geri Hareket |
| ➡️ | D | Sağ Hareket |
| 🚀 | Space | Zıplama |
| 🎒 | E | Envanter |
| ⛏️ | LMB | Kırma/Saldırı |
| 📦 | RMB | Yerleştirme |
| 💨 | Shift | Koşu |

### 📱 Mobil Optimizasyonlar
- ✅ Landscape mode desteği
- ✅ Dokunmatik kontrol sistemi
- ✅ WebGL 2.0 desteği
- ✅ Düşük gecikme süresi (Low Latency)
- ✅ Android 5.0+ desteği
- ✅ Çoklu çözünürlük desteği

## 📦 Kurulum

### Android APK Hızlı Kurulum

```bash
# 1. Repository'yi klonla
git clone <repo-url>
cd minecraft

# 2. Otomatik setupı çalıştır
chmod +x setup-android.sh
./setup-android.sh
```

Bu script:
- ✅ Tüm bağımlılıkları yükler
- ✅ Vite projesini derler
- ✅ Cordova projesini ayarlar
- ✅ APK dosyasını oluşturur

### Android APK Manuel Kurulum

Detaylı adımlar için bkz: [ANDROID_BUILD_GUIDE_TR.md](./ANDROID_BUILD_GUIDE_TR.md)

```bash
# Gereksinimler
npm install
npm install -g cordova

# Derleme
npm run build
cordova create minecraft-android com.minecraft.clone MinecraftClone
cd minecraft-android
cordova platform add android
cordova build android --release
```

### PC/Mac/Linux Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Web sunucusu başlat
npm run dev

# Build et
npm run build
```

## 🚀 Cihaza Yükleme

### USB ile Yükleme
```bash
# Telefonu bağla ve ADB'yi etkinleştir (Developer mode)
adb install -r minecraft-android/platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

### Manual (QR Code)
1. APK dosyasını telefona kopyala
2. Dosya yöneticisinden aç
3. Yükle ve Aç

## 🎮 Oyun Kontrolleri

### Hareketi Kontrol Et
- **Sol Taraf**: Joystick ile hareketi kontrol et
- **İleri**: Joystick'i yukarı sürükle
- **Geri**: Joystick'i aşağı sürükle
- **Sol/Sağ**: Joystick'i sol/sağa sürükle

### Görüşü Kontrol Et
- **Sağ Taraf**: Sağ tarafın herhangi bir yerine dokunup hareket ettirerek görüş açısını değiştir

### Eylemleri Gerçekleştir
- **W Butonu**: İleri hareket
- **LMB Butonu (⛏️)**: Blok kırma / Saldırma
- **RMB Butonu (📦)**: Blok yerleştirme / Etkileşim
- **E Butonu (🎒)**: Envanteri açma

## 📁 Proje Yapısı

```
minecraft/
├── src/
│   ├── js/
│   │   ├── Start.js              # Ana başlangıç dosyası
│   │   └── net/minecraft/
│   │       ├── client/
│   │       │   ├── Minecraft.js   # Ana oyun sınıfı
│   │       │   └── GameWindow.js  # Pencere yönetimi
│   │       └── mobile/
│   │           └── TouchController.js  # 🆕 Sanal Joystick + Kontroller
│   └── resources/
│       ├── terrain/               # Blok dokuları
│       ├── textures/              # Oyun dokuları
│       └── gui/                   # Arayüz öğeleri
├── libraries/                      # Harici JS kütüphaneleri
├── index.html                      # Web sürümü
├── index-android.html              # 🆕 Android sürümü
├── style.css                       # Stiller
├── package.json                    # Node.js konfigurasyonu
├── vite.config.js                  # Vite konfigurasyonu
├── setup-android.sh                # 🆕 Android otomatik kurulum
├── build-android.sh                # 🆕 Android manual kurulum
├── ANDROID_BUILD_GUIDE_TR.md       # 🆕 Detaylı rehber
└── Android_Features_TR.md          # 🆕 Özellikler rehberi
```

## 🔧 Teknoloji Stack

- **3D Engine**: Three.js 0.128
- **Build Tool**: Vite 5.0
- **Mobile Framework**: Apache Cordova 12
- **WebGL**: WebGL 2.0
- **Input System**: Native Touch Events + Custom Joystick

## 📊 Sistem Gereksinimleri

### Android
- **Minimum Android**: 5.0 (API 21)
- **Önerilen Android**: 8.0 (API 26)+
- **RAM**: 512 MB minimum, 2 GB önerilen
- **GPU**: Mali-G71 veya daha yüksek
- **Depolama**: 100 MB (APK)

### Web/PC
- **Browser**: Chrome, Firefox, Safari, Edge (Modern sürümler)
- **WebGL 2.0**: Gerekli
- **RAM**: 4 GB önerilen

## 🎯 Özellikler

### Oyun Mekanikleri
- ✅ Sonsuz dünya oluşturma
- ✅ Blok yerleştirme ve kırma
- ✅ Envanter sistemi
- ✅ Yaratılış ve Hayatta Kalma modları
- ✅ Dinamik aydınlatma
- ✅ Gece/Gündüz döngüsü
- ✅ Yer Titremesi ve Partikeller
- ✅ Yapı Modu (Creative Inventory)

### Kontroller
- ✅ Sanal Joystick (Mobil)
- ✅ Dokunmatik Butonlar (Mobil)
- ✅ Fare Kontrolü (PC)
- ✅ Klavye Desteği (PC)
- ✅ Gamepad Desteği (Planlı)

### Veri Tabanı
- ✅ 100+ Blok Türü
- ✅ Dinamik Doku Yükleme
- ✅ Oyuncu Verileri Kaydetme
- ✅ Ayarlar Kalıcılığı

## 🐛 Bilinen Sorunlar

### Android
- Düşük-uç cihazlarda (Mali-400) performans düşüş olabilir
- Joystick hassasiyeti ekran boyutuna göre değişebilir

### Web
- WebGL 2.0 olmayan tarayıcılarda çalışmaz

## 🚧 Gelecek Geliştirmeler

- [ ] Multiplayer desteği (WebSocket)
- [ ] Gamepad desteği
- [ ] Ses efektleri (Audio Context)
- [ ] Harita kaydetme/yükleme
- [ ] Mods desteği
- [ ] İsteğe bağlı kontrol düzeni
- [ ] Veri senkronizasyonu (Cloud Save)

## 📝 Lisans

MIT License - Özgürce kullanabilirsin!

## 👥 Katkıda Bulun

Pull request'ler karşılanır!

1. Repository'yi fork et
2. Feature branch oluştur (`git checkout -b feature/AmazingFeature`)
3. Değişiklikleri commit et (`git commit -m 'Add AmazingFeature'`)
4. Branch'i push et (`git push origin feature/AmazingFeature`)
5. Pull Request aç

## 📞 İletişim

Sorular ve öneriler için issue açabilirsin.

## 🙏 Teşekkür

- Three.js - WebGL 3D kütüphanesi
- Vite - Modern build aracı
- Apache Cordova - Mobil framework
- Minecraft - Esinlenme kaynağı

---

**Geliştirildi**: Türk Geliştirici Komunası
**Sürüm**: 1.0.0
**Güncelleme**: 2026

**Oyunun Tadını Çıkar! 🎮✨**
