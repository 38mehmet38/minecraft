# 🎮 Minecraft Android Sürümü - Rehber

## ✨ Eklenen Özellikler

### 1. 🕹️ Sanal Joystick
- **Konum**: Ekranın sol alt köşesi
- **Kullanım**: Oyuncu hareketini kontrol etmek için joystick'i hareket ettir
- **İşlevler**:
  - **Yukarı**: İleri hareket (W)
  - **Aşağı**: Geri hareket (S)
  - **Sol**: Sol hareket (A)
  - **Sağ**: Sağ hareket (D)

### 2. 🎯 Kontrol Simgeleri ile Tuşlar
Ekranın sağ altında, kullanım amaçlarına göre simgelerle işaretlenmiş kontrol tuşları bulunmaktadır:

#### Üst Sıra:
- **⬆️ W (İleri Hareket)** - Karakteri ileri doğru hareket ettirir
- **⬅️ A (Sol Hareket)** - Karakteri sola hareket ettirir
- **🚀 SEKTME (Space)** - Karakteri zıplatır

#### Orta Sıra:
- **🎒 E (Envanteri Aç)** - Oyuncu envanterini açar
- **⬇️ S (Geri Hareket)** - Karakteri geri hareket ettirir
- **➡️ D (Sağ Hareket)** - Karakteri sağa hareket ettirir

#### Alt Sıra:
- **⛏️ LMB (Sol Fare Butonu)** - Blok kırmak / Saldırmak
- **📦 RMB (Sağ Fare Butonu)** - Blok yerleştirmek / Etkileşim
- **💨 KOŞU (Shift)** - Yapışkan bir şekilde hareket ettirir

### 3. 🎮 Fare Kontrolü
- **Sağ Taraf**: Sağ tarafın herhangi bir yerine dokunup hareket ettirerek oyuncu bakmak açısını değiştir
- **Dokunma Hassasiyeti**: Sistem otomatik olarak uyumludur

## 📱 Mobil Optimizasyonlar

### Performans
- ✅ Düşük gecikme süresi joystick
- ✅ Optimize edilmiş ekran oranı (landscape)
- ✅ Düşük RAM kullanımı
- ✅ 60 FPS hedeflenen performans

### UI/UX
- ✅ Dokunmatik arayüz
- ✅ Yarı transparan kontrol paneli
- ✅ Renk değişikliği geri bildirimi
- ✅ Responsif buton ölçeği

## 🚀 Android'de Başlama

### Android APK Oluşturma

#### Hızlı Yöntem (Otomatik)
```bash
# İzin ver
chmod +x build-android.sh

# Çalıştır
./build-android.sh
```

#### Manuel Yöntem
Bkz: `ANDROID_BUILD_GUIDE_TR.md`

### Cihaza Yükleme
```bash
# USB ile telefonu bilgisayara bağla
adb install -r minecraft-android/platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

## 🎮 Oyun Kontrolleri Özet

| Tuş | Simge | İşlev |
|-----|-------|-------|
| W | ⬆️ | İleri Hareket |
| A | ⬅️ | Sol Hareket |
| S | ⬇️ | Geri Hareket |
| D | ➡️ | Sağ Hareket |
| Space | 🚀 | Zıplama |
| E | 🎒 | Envanter |
| LMB | ⛏️ | Kırma/Saldırı |
| RMB | 📦 | Yerleştirme |
| Shift | 💨 | Koşu |
| Joystick | 🕹️ | Hareket ve Görüş |

## 📊 Teknik Bilgiler

### Ekran Yönlendirmesi
- **Sünger**: Landscape (Yatay)
- **Çözünürlük Desteği**: 720p - 4K

### Minimum Gereksinimler
- **Android Sürümü**: 5.0 (API 21) ve üzeri
- **RAM**: 512 MB minimum, 2 GB önerilen
- **GPU**: Mali, Adreno veya Qualcomm Snapdragon

### WebGL Özellikleri
- ✅ WebGL 2.0 desteği
- ✅ Gölgeleme desteği
- ✅ Dinamik doku yükleme

## 🛠️ Özelleştirme

### Joystick Hassasiyetini Değiştir
`src/js/net/minecraft/mobile/TouchController.js` dosyasında:
```javascript
const sensitivity = 3; // Değeri artır/azalt
```

### Kontrol Butonları Yeniden Düzenle
`TouchController.js`'deki `createButton()` metodunu düzenle:
- Buton ölçüğü: `width: 50px; height: 50px;`
- Buton rengini: `background: rgba(...)`
- İkon simgelerini: `button.textContent = '🎯';`

### Ekran Oranını Değiştir
`index-android.html`'de:
```html
<preference name="Orientation" value="landscape" /> <!-- veya "portrait" -->
```

## 🐛 Yaygın Sorunlar

### Sorun: Joystick Çalışmıyor
**Çözüm**: TouchController'ın mobil cihaz olarak algılandığından emin ol
```javascript
console.log(gameWindow.mobileDevice); // true olmalı
```

### Sorun: Kontrol Simgeleri Görünmüyor
**Çözüm**: Emoji fontları yüklü olduğundan emin ol
- Android 5.0+: Dahili emoji desteği
- Fallback fontlar: Noto Sans

### Sorun: Performans Düşük
**Çözüm**:
1. WebGL ayarlarını kontrol et
2. Joystick hassasiyetini azalt
3. Grafik kalitesini düşür

## 📝 Dosya Yapısı

```
minecraft/
├── src/js/net/minecraft/mobile/
│   └── TouchController.js         # Sanal Joystick + Kontroller
├── index-android.html              # Android optimize HTML
├── build-android.sh                # APK oluşturma scripti
├── ANDROID_BUILD_GUIDE_TR.md       # Detaylı kurulum rehberi
└── Android_Features_TR.md          # Bu dosya
```

## 🎯 Gelecek Geliştirmeler

- [ ] İsteğe bağlı kontrol düzeni
- [ ] Joystick boyutu özelleştirmesi
- [ ] Sesli kontrol desteği
- [ ] Ctrl+Shift kombinasyonları
- [ ] Gamepad desteği

## 📞 Destek

Sorunlar için:
1. Konsolu kontrol et: `adb logcat | grep minecraft`
2. Hata mesajlarını oku
3. `ANDROID_BUILD_GUIDE_TR.md`'deki sorun giderme bölümüne bak

## 📄 Lisans

Bu Android sürümü, orijinal MIT lisansı altında dağıtılmaktadır.

---

**Geliştirici**: Türk Minecraft Komunal
**Sürüm**: 1.0.0 (Android)
**Güncelleme**: 2026

Oyun oynamanın keyfini çıkar! 🎮✨
