# 🎮 Android APK Oluşturma - Hızlı Başlangıç

Bu rehberde, **icon.ico** dosyasını kullanarak Android APK dosyasını lokal bilgisayarınızda nasıl oluşturacağınızı öğreneceksiniz.

## 🚀 En Hızlı Yol (Bir Komut)

### Lokal Bilgisayarda İlk Kurulum

```bash
# 1. Repository'yi klonla
git clone <repo-url>
cd minecraft

# 2. Tek komutla her şeyi yap!
bash build-complete-android.sh
```

Bu komut otomatik olarak:
- ✅ Tüm bağımlılıkları yükler
- ✅ `icon.ico` dosyasını Android'e uyarlar (6 boyut)
- ✅ Web projesini Vite ile derler
- ✅ Cordova Android projesini ayarlar
- ✅ APK dosyasını oluşturur

## 📦 Gereksinimler

### Windows/Mac/Linux Kurulumu

#### 1. **Node.js & NPM**
```bash
# Windows: https://nodejs.org/ adresinden indir
# Mac: brew install node
# Linux: apt-get install nodejs npm
#        apk add nodejs npm (Alpine)

node -v  # v16+
npm -v   # 8+
```

#### 2. **Java Development Kit (JDK)**
```bash
# Windows: https://www.oracle.com/java/
# Mac: brew install openjdk@11
# Linux: apt-get install openjdk-11-jdk
#        apk add openjdk11

java -version
```

#### 3. **Android SDK**
```bash
# Seçenek A: Android Studio kurun
# https://developer.android.com/studio

# Seçenek B: Komut satırı araçlarını kurun
# https://developer.android.com/studio#downloads
# "Command line tools only" seçeneğini seç
```

#### 4. **Cordova CLI**
```bash
npm install -g cordova

cordova --version  # 12+
```

#### 5. **ImageMagick** (İikon dönüştürme için)
```bash
# Windows: https://imagemagick.org/
# Mac: brew install imagemagick
# Linux: apt-get install imagemagick
#        apk add imagemagick

convert -version
```

## 🔧 Ortam Değişkenlerini Ayarlama

### Linux/Mac (bash/zsh)
```bash
# ~/.bashrc veya ~/.zshrc dosyasına ekle:

export ANDROID_SDK_ROOT=$HOME/android-sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
export JAVA_HOME=/usr/lib/jvm/openjdk-11  # Yolunuzu kontrol edin

# Değişiklikleri uygula:
source ~/.bashrc
```

### Windows (Command Prompt)
```cmd
setx ANDROID_SDK_ROOT C:\Users\YourName\AppData\Local\Android\Sdk
setx JAVA_HOME "C:\Program Files\Java\jdk-11"
setx PATH "%PATH%;%ANDROID_SDK_ROOT%\cmdline-tools\latest\bin;%ANDROID_SDK_ROOT%\platform-tools"
```

## 📲 Adım Adım Kurulum

### 1. Bilgisayarında Proje Klon'u Yap
```bash
git clone <repo-url>
cd minecraft
```

### 2. Bağımlılıkları Yükle
```bash
npm install
```

### 3. İkonları Hazırla
```bash
# Eğer sadece ikonları hazırlamak istersen:
bash setup-icons-android.sh
```

### 4. Web Projesini Derle
```bash
npm run build
# dist/ klasörü oluşturulur
```

### 5. Android Projesini Oluştur
```bash
cordova create minecraft-android com.minecraft.clone MinecraftClone
cd minecraft-android
cordova platform add android
cd ..
```

### 6. APK'yi Derle ve Oluştur
```bash
cd minecraft-android
cordova build android --release
cd ..
```

### 7. APK Dosyasını Bul
```bash
# Debug APK:
minecraft-android/platforms/android/app/build/outputs/apk/debug/app-debug.apk

# Release APK:
minecraft-android/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
```

## 📱 APK'yi Telefona Yükle

### USB ile Yükleme
```bash
# 1. Telefonu USB ile bilgisayara bağla
# 2. Developer Mode'u açılı olduğundan emin ol (Ayarlar > Telefon Hakkında > Build Number 7 kez tıkla)
# 3. Terminal'de:

adb install -r minecraft-android/platforms/android/app/build/outputs/apk/debug/app-debug.apk

# Yükleme tamamlandıktan sonra telefonda "Minecraft" uygulaması görünür
```

### Manuel Yükleme
```bash
# 1. APK dosyasını telefona kopyala (USB ile)
# 2. Dosya yöneticisinde aç
# 3. "Yükle" ve "Aç" butonlarını tıkla
```

## 🎮 Oyun Kontrolleri Test Etme

### Sanal Joystick
- Sol alt köşede gri joystick
- Dokunup sürükleyerek hareket et

### Kontrol Butonları
- Sağ alt köşede 9 buton
- Her buton emojisi var (⬆️⬅️⬇️➡️ 🚀 🎒 ⛏️ 📦 💨)

### Test Adımları
1. Oyuna giriş yap
2. W/A/S/D tuşlarını test et (hareket)
3. Space'i test et (zıplama)
4. Blok kırma/yerleştirme test et
5. Joystick ile görüş açısını değiştir

## 🐛 Sorun Giderme

### Problem: "command not found: node"
**Çözüm**: Node.js kurmadığını kontrol et
```bash
node -v  # Kurulu değilse
npm install -g nodejs  # Kur
```

### Problem: "android-sdk not found"
**Çözüm**: `ANDROID_SDK_ROOT` ortam değişkenini kontrol et
```bash
echo $ANDROID_SDK_ROOT  # Boş ise
export ANDROID_SDK_ROOT=~/android-sdk  # Ayarla
```

### Problem: Gradle sync hatası
**Çözüm**: Cache'i temizle ve yeniden deneyin
```bash
cd minecraft-android
./gradlew clean
cordova build android --release
```

### Problem: APK boyutu çok büyük
**Çözüm**: Temel kaynakları optimize et
```bash
# Cordova projesinde build.gradle düzenle:
android {
    bundle {
        density.enableSplit = true
        abi.enableSplit = true
    }
}
```

### Problem: İkonlar görünmüyor
**Çözüm**: `res/icon/` klasörünü kontrol et
```bash
ls -la minecraft-android/res/icon/android/
# Sonuç: 6 PNG dosyası (ldpi, mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
```

## 📊 Dosya Yapısı

```
minecraft/
├── icon.ico                          # 👈 İkon dosyası (kullanılacak)
├── index-android.html                # Android HTML
├── build-complete-android.sh         # Tam kurulum scripti ⭐
├── setup-icons-android.sh            # İkon kurulum scripti
├── package.json                      # NPM bağımlılıkları
├── src/
│   └── js/net/minecraft/mobile/
│       └── TouchController.js        # Sanal Joystick + Butonlar
└── minecraft-android/                # Oluşturulacak (Cordova)
    ├── platforms/
    │   └── android/
    │       └── app/build/outputs/apk/
    │           ├── debug/
    │           │   └── app-debug.apk  ⭐ (Telefona yükle)
    │           └── release/
    │               └── app-release-unsigned.apk
    ├── res/
    │   ├── icon/android/              # İkonlar (6 boyut)
    │   └── screen/android/            # Splash screen'ler
    └── config.xml                     # Cordova konfigürasyonu
```

## 🚀 Google Play Store'a Yükleme

### Release APK İmzalama
```bash
# 1. Anahtar deposu oluştur (ilk kez)
keytool -genkey -v -keystore minecraft.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias minecraft-key

# 2. APK'yı imzala
jarsigner -verbose -sigalg SHA256withRSA \
  -digestalg SHA-256 \
  -keystore minecraft.keystore \
  app-release-unsigned.apk \
  minecraft-key

# 3. Optimize et
zipalign -v 4 app-release-unsigned.apk app-release.apk
```

### Google Play Store'a Yükle
1. [Google Play Console](https://play.google.com/console) aç
2. Yeni uygulama oluştur
3. APK dosyasını yükle
4. Uygulama bilgilerini doldurmadan yayınla

## 📚 Kullanılan Teknolojiler

- **Build**: Vite 5.0
- **3D Engine**: Three.js 0.128
- **Mobile Framework**: Apache Cordova 12
- **İkon Dönüştürme**: ImageMagick
- **Derleme**: Gradle & Android Build Tools

## ✅ Başarı Göstergeleri

Kurulum başarılı ise:
- ✅ `npm install` bağımlılıkları yükledi
- ✅ `npm run build` dist/ klasörü oluşturdu
- ✅ `cordova create` minecraft-android/ oluşturdu
- ✅ `cordova platform add android` platform ekledi
- ✅ `cordova build android` APK oluşturdu
- ✅ `adb install` telefona yükledi
- ✅ Oyun açılıp Joystick/Butonlar çalışıyor

## 📞 Yardım

**Sorun mu yaşıyorsun?**
1. Yukarıda "Sorun Giderme" bölümünü kontrol et
2. İlgili rehberi oku:
   - `README_ANDROID.md` - Genel bilgi
   - `ANDROID_BUILD_GUIDE_TR.md` - Detaylı kurulum
   - `Android_Features_TR.md` - Oyun kontrolleri

## 🎉 Başladığında

```bash
# Tek komutla hepsini yap:
bash build-complete-android.sh

# Veya manuel adım adım:
npm install
npm run build
cordova create minecraft-android com.minecraft.clone MinecraftClone
cd minecraft-android
cordova platform add android
cordova build android --release
```

**APK dosyası hazır! Oyun oynamanın keyfini çıkar! 🎮✨**

---

**Sürüm**: 1.0.0  
**Güncelleme**: 2026/02/11  
**Durum**: ✅ Hazır Üretim
