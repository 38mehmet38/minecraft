# Android APK Oluşturma Rehberi

Bu rehberde, Minecraft klonunu Android APK dosyasına dönüştürmek için gerekli adımlar açıklanmıştır.

## Gereksinimler

1. **Node.js** - v14 veya daha yükseği
2. **Java Development Kit (JDK)** - v11 veya daha yükseği
3. **Android SDK** - API level 21 veya daha yükseği
4. **Gradle** - Otomatik indirilir
5. **Cordova CLI** - `npm install -g cordova`

## Adım 1: Temel Kurulum

### Node.js Yükleme
```bash
# Ubuntu/Debian
sudo apt-get install nodejs npm

# macOS
brew install node

# Windows
# https://nodejs.org/ adresinden indir
```

### Java Development Kit (JDK) Yükleme
```bash
# Ubuntu/Debian
sudo apt-get install openjdk-11-jdk

# macOS
brew install openjdk@11

# Or using Android Studio's bundled JDK
```

### Android SDK Yükleme
```bash
# Android Studio ile birlikte gelir
# veya komut satırı araçlarını indir:
# https://developer.android.com/studio#command-tools
```

### Ortam Değişkenlerini Ayarlama
```bash
# ~/.bashrc veya ~/.zshrc dosyasına ekle

export ANDROID_SDK_ROOT=$HOME/android-sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
export JAVA_HOME=/usr/lib/jvm/openjdk-11

# Değişiklikleri yükle
source ~/.bashrc
```

### Cordova CLI Yükleme
```bash
npm install -g cordova
```

## Adım 2: Otomatik Kurulum

Tüm işlemleri otomatikleştirmek için:

```bash
# İzin ver
chmod +x build-android.sh

# Çalıştır
./build-android.sh
```

Bu script:
1. Vite projesini derler
2. Cordova Android projesini oluşturur
3. Gerekli platform ve plugin'leri ekler
4. APK dosyasını oluşturur

## Adım 3: Manuel Kurulum

### 3.1 Vite Projesini Derle
```bash
npm run build
```

### 3.2 Cordova Projesini Oluştur
```bash
cordova create minecraft-android com.minecraft.clone MinecraftClone
cd minecraft-android
```

### 3.3 Android Platform Ekle
```bash
cordova platform add android
```

### 3.4 Yapı Dosyalarını Kopyala
```bash
rm -rf www/*
cp -r ../dist/* www/
cp ../index-android.html www/index.html
```

### 3.5 Config.xml Düzenle
`minecraft-android/config.xml` dosyasını düzenle:

```xml
<?xml version='1.0' encoding='utf-8'?>
<widget id="com.minecraft.clone" version="1.0.0">
    <name>Minecraft</name>
    <description>Minecraft Klonu</description>
    <content src="index.html" />
    <access origin="*" />
    
    <preference name="Orientation" value="landscape" />
    <preference name="android-minSdkVersion" value="21" />
    <preference name="android-targetSdkVersion" value="33" />
    
    <plugin name="cordova-plugin-whitelist" spec="1.3.3" />
    <plugin name="cordova-plugin-screen-orientation" spec="~3.0.1" />
</widget>
```

### 3.6 APK Oluştur
```bash
# Debug APK
cordova build android

# Release APK (İmzalı)
cordova build android --release
```

## Adım 4: APK Dosyasını Bul

### Debug APK
```
minecraft-android/platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

### Release APK
```
minecraft-android/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
```

## Adım 5: Release APK İmzalama (İsteğe Bağlı)

Release APK'yı Google Play Store'a yüklemek için imzalamanız gerekir:

### Anahtar Deposu Oluştur
```bash
keytool -genkey -v -keystore minecraft.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias minecraft-key
```

### APK'yı İmzala
```bash
jarsigner -verbose -sigalg SHA256withRSA \
  -digestalg SHA-256 \
  -keystore minecraft.keystore \
  minecraft-android/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk \
  minecraft-key

# APK'yı Optimize Et
zipalign -v 4 app-release-unsigned.apk app-release.apk
```

## Adım 6: APK'yı Telefona Yükle

### USB ile Cihaza Bağla
```bash
adb devices
adb install -r minecraft-android/platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

## Sorun Giderme

### Gradle Sync Hatası
```bash
cd minecraft-android
cordova platform remove android
cordova platform add android@latest
```

### Build Hatası
```bash
# Gradle cache'i temizle
cd minecraft-android
./gradlew clean
cordova build android --release
```

### JDK Bulunamadı
```bash
# Java Home'u ayarla
export JAVA_HOME=/path/to/jdk
cordova build android
```

### Android SDK Bulunamadı
```bash
# Android SDK root'u ayarla
export ANDROID_SDK_ROOT=/path/to/android-sdk
cordova build android
```

## Ek Optimizasyonlar

### Dosya Boyutunu Azalt
```bash
# Cordova projesinde build.gradle düzenle
android {
    bundle {
        density.enableSplit = true
        language.enableSplit = true
    }
}
```

### WebGL Performansı
TouchController.js'de GPU optimizasyonlarını kontrol et:
- Joystick hassasiyetini ayarla
- Dokunma koordinatlarını iyileştir
- Frame rate limitini ayarla

## Google Play Store'a Yükleme

1. Google Play Developer hesabı oluştur
2. Release APK'yı imzala
3. Google Play Console'a giriş yap
4. Yeni uygulama oluştur
5. APK dosyasını yükle
6. Uygulama bilgilerini doldurmadan yayınla

## Özet Komutlar

```bash
# Hepsini bir seferde yapın
chmod +x build-android.sh && ./build-android.sh

# Veya manuel olarak:
npm run build && \
cordova create minecraft-android com.minecraft.clone MinecraftClone && \
cd minecraft-android && \
cordova platform add android && \
rm -rf www/* && cp -r ../dist/* www/ && \
cordova build android --release
```

## Destek

Sorunlar için lütfen aşağıdaki kaynakları kontrol edin:
- Cordova: https://cordova.apache.org/
- Android Studio: https://developer.android.com/studio
- Gradle: https://gradle.org/

İyi oyunlar! 🎮
