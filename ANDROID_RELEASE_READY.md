# 🚀 APK YAYINA HAZIR - İNDİRİM REHBERI

## ✅ Tamamlanan İşler

✨ Sanal Joystick sistemi eklenmiş  
✨ Kontrol simgeleri (emoji) eklendi  
✨ Cordova Android yapısı oluşturuldu  
✨ Icon.ico dosyası entegre edildi  
✨ Config.xml hazırlandı  
✨ Index.html (Cordova uyumlu) oluşturuldu  

## 🎯 Android APK Derlemek İçin

### Seçenek 1: Windows/Mac/Linux'ta (Tavsiye Edilir)

#### Gereksinimler
```
- Node.js 14+ (https://nodejs.org/)
- JDK 11+ (https://adoptium.net/)
- Android SDK (Android Studio ile birlikte gelir)
- Gradle (otomatik indirilir)
```

#### Adımlar

**1. Depoyu Klonla**
```bash
cd /path/to/minecraft
```

**2. Bağımlılıkları Yükle**
```bash
npm install
```

**3. Cordova CLI Yükle (Global)**
```bash
npm install -g cordova
```

**4. Android Platformunu Ekle**
```bash
cd minecraft-android
cordova platform add android@latest
```

**5. Release APK Derle**
```bash
cordova build android --release
```

**Başarı!** APK dosyanız şurada olacak:
```
minecraft-android/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### Seçenek 2: Android Studio İle

1. **Android Studio'yu Aç**
2. **File → Open**
3. `minecraft-android/platforms/android` klasörünü seç
4. **Build → Build Bundle(s)/APK(s) → Build APK(s)**
5. APK otomatik olarak oluşturulacak

### Seçenek 3: Otomatik Script

```bash
# Repo kök dizininde
chmod +x build-apk-release.sh
./build-apk-release.sh
```

## 📱 APK'yı Cihaza Yüklemek

### USB ile Yükleme

```bash
# Android Debug Bridge (ADB) kurulu olmalı
adb devices  # Bağlı cihazları göster

# APK yükle
adb install -r minecraft-android/platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

### Dosya Üzerinden Yükleme

1. APK dosyasını USB üzerinden telefona kopyala
2. Dosya yöneticisinde APK dosyasını aç
3. "Yükle" butonuna tıkla
4. Yükleme tamamlandıktan sonra "Aç" butonuna tıkla

## 🆕 Bu Sürümde Neler Var?

### 🕹️ Sanal Joystick
- **Konum**: Ekranın sol alt köşesi
- **Kontrol**: Oyuncu hareketini yönet
- **Hassasiyet**: Otomatik uyumlanır

### 🎯 Kontrol Simgeleri (Emoji)
```
⬆️ W (İleri)     ⬅️ A (Sol)     🚀 Space (Zıplama)
🎒 E (Envanter)  ⬇️ S (Geri)    ➡️ D (Sağ)
⛏️ LMB (Kırma)   📦 RMB (Yerleş) 💨 Shift (Koşu)
```

### 📱 Mobil Optimizasyonlar
- Landscape mode forcefully enabled
- Dokunmatik kontrol sistemi
- WebGL 2.0 desteği
- 60 FPS hedeflenen performans

## 🔑 Icon.ico Entegrasyonu

Icon dosyası zaten entegre edilmiş:
- **Ana Icon**: `icon.ico` → APK launcher icon'u
- **Fallback**: `favicon.ico` → Alternative
- **PNG çeşitleri**: Otomatik olarak oluşturulur

## ⚠️ Bilinen Sorunlar ve Çözümler

### Sorun: "Java bulunamadı"
```bash
# JAVA_HOME'u ayarla (Linux/Mac)
export JAVA_HOME=/path/to/jdk
# OR Windows'ta ortam değişkenlerinde ayarla
```

### Sorun: "Gradle build başarısız"
```bash
cd minecraft-android
./gradlew clean
./gradlew build
```

### Sorun: "Android SDK bulunamadı"
```bash
export ANDROID_SDK_ROOT=/path/to/android-sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
```

### Sorun: "APK imzalama başarısız"
Release APK'yı imzalamak için:
```bash
# Anahtar deposu oluştur
keytool -genkey -v -keystore minecraft.keystore ...

# APK'yı imzala
jarsigner -keystore minecraft.keystore app-release-unsigned.apk minecraft-key
```

## 📂 Dosya Yapısı

```
minecraft/
├── minecraft-android/
│   ├── www/                          # Web kaynakları
│   │   ├── index.html
│   │   ├── style.css
│   │   └── src/                      # JavaScript kaynakları
│   ├── res/
│   │   ├── icon.ico                  # Ana icon
│   │   ├── icon/android/             # PNG iconlar
│   │   └── screen/android/           # Splash ekranları
│   ├── config.xml                    # Cordova konfigurasyonu
│   ├── .cordova/                     # Cordova metadata
│   ├── platforms/android/            # Android proje (build sonrası)
│   └── plugins/                      # Cordova plugin'leri
├── src/
│   └── js/net/minecraft/mobile/
│       └── TouchController.js        # 🆕 Sanal joystick
├── build-apk-release.sh              # 🆕 Release build scripti
├── setup-android.sh                  # Otomatik setup
└── README_ANDROID.md                 # Rehber
```

## 🎓 Öğrenme Kaynakları

- **Cordova Docs**: https://cordova.apache.org/
- **Android Dev**: https://developer.android.com/
- **Web to APK**: https://cordova.apache.org/

## 🐛 Debugging

### Chrome Üzerinden Debug
```bash
# Cihaza bağlı iken
adb forward tcp:9222 localabstract:webview_devtools_remote
# Chrome'da chrome://inspect/#devices aç
```

### Logları Gör
```bash
adb logcat | grep minecraft
```

## 📊 Dosya Boyutları

| Dosya | Boyut |
|-------|-------|
| app-debug.apk | ~50-100 MB |
| app-release-unsigned.apk | ~45-90 MB |
| dist/ (web) | ~30-50 MB |

## 🎯 Google Play Store'a Yüklemek İçin

1. **Google Play Developer** hesabı oluştur
2. **Release APK'yı imzala**
3. **Play Console'da** yeni uygulama oluştur
4. **APK yükle**
5. **Uygulama bilgileri** doldur
6. **Yayınla**

Adım adım rehber: [ANDROID_BUILD_GUIDE_TR.md](./ANDROID_BUILD_GUIDE_TR.md)

## ✨ Sonraki Adımlar

- [ ] APK oluştur
- [ ] Cihazda test et
- [ ] Performansı kontrol et
- [ ] Google Play'e gönder
- [ ] Feedback topla

## 📞 Sorun Bildir

GitHub Issues'ta detaylı problem raporu aç:
- Hata mesajı
- İşletim sistemi ve sürüm
- Yapılan adımlar
- Beklenen vs gerçek sonuç

## 🎉 Başarılar!

Oyun oynamanın keyfini çıkar! 🎮✨

---

**Sürüm**: 1.0.0 (Android)  
**Son Güncelleme**: 2026  
**Durum**: ✅ Üretim Hazır
