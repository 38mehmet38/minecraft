#!/bin/bash

# Android Kurulum Scripti
# Bu script, Minecraft klonunun Android APK dosyasında derlemesine yardımcı olur

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Minecraft Android APK Kurulum Scripti                 ║"
echo "║     (Sanal Joystick + Kontrol Simgeleri ile)              ║"
echo "╚════════════════════════════════════════════════════════════╝"

# Renk tanımları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Gereksinimler kontrol et
check_requirement() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 bulunamadı!${NC}"
        echo "Kurulum: $2"
        exit 1
    fi
}

echo -e "${BLUE}📋 Gereksinimler kontrol ediliyor...${NC}"
check_requirement "node" "npm install -g nodejs"
check_requirement "npm" "npm install -g npm"
check_requirement "cordova" "npm install -g cordova"
check_requirement "java" "apk add openjdk11"

echo -e "${GREEN}✅ Tüm gereksinimler mevcut!${NC}\n"

# Adım 1: Dependensies yükle
echo -e "${BLUE}📦 1/6 NPM bağımlılıkları yükleniyor...${NC}"
npm install || echo -e "${YELLOW}⚠️ Zaten yüklü olabilir${NC}"
echo -e "${GREEN}✅ Tamamlandı!${NC}\n"

# Adım 2: Vite projesini derle
echo -e "${BLUE}📦 2/6 Vite projesi derleniyorum...${NC}"
npm run build
echo -e "${GREEN}✅ Tamamlandı!${NC}\n"

# Adım 3: Cordova projesini oluştur
echo -e "${BLUE}📦 3/6 Cordova Android projesi oluşturuluyor...${NC}"
if [ ! -d "minecraft-android" ]; then
    cordova create minecraft-android com.minecraft.clone MinecraftClone
    echo -e "${GREEN}✅ Proje oluşturuldu!${NC}"
else
    echo -e "${YELLOW}⚠️ Proje zaten var, geçiliyor...${NC}"
fi
echo ""

# Adım 4: Android platformunu ekle
echo -e "${BLUE}📦 4/6 Android platformu ekleniyor...${NC}"
cd minecraft-android
if [ ! -d "platforms/android" ]; then
    cordova platform add android@latest
    echo -e "${GREEN}✅ Platform eklendi!${NC}"
else
    echo -e "${YELLOW}⚠️ Platform zaten yüklü, geçiliyor...${NC}"
fi
echo ""

# Adım 5: Yapı dosyalarını kopyala
echo -e "${BLUE}📦 5/6 Önceki yapı dosyaları silinip yenileri yükleniyor...${NC}"
rm -rf www/*
cp -r ../dist/* www/
cp ../index-android.html www/index.html 2>/dev/null || cp ../index.html www/index.html
echo -e "${GREEN}✅ Dosyalar kopyalandı!${NC}\n"

# Adım 6: APK oluştur
echo -e "${BLUE}📦 6/6 Android APK oluşturuluyor...${NC}"
echo "Bu işlem 10-20 dakika sürebilir..."

if cordova build android --release 2>/dev/null; then
    echo -e "${GREEN}✅ Release APK hazır!${NC}"
    RELEASE_APK=$(find . -name "app-release-unsigned.apk" | head -1)
    if [ -f "$RELEASE_APK" ]; then
        echo -e "${GREEN}📍 Dosya Yolu: $RELEASE_APK${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ Release derlemesi başarısız, Debug APK oluşturuluyor...${NC}"
    cordova build android
    echo -e "${GREEN}✅ Debug APK hazır!${NC}"
    DEBUG_APK=$(find . -name "app-debug.apk" | head -1)
    if [ -f "$DEBUG_APK" ]; then
        echo -e "${GREEN}📍 Dosya Yolu: $DEBUG_APK${NC}"
    fi
fi

cd ..

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          ✅ Kurulum Başarıyla Tamamlandı!            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"

echo ""
echo "📱 APK DOSYASI YERLERI:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Release:  minecraft-android/platforms/android/app/build/outputs/apk/release/"
echo "  Debug:    minecraft-android/platforms/android/app/build/outputs/apk/debug/"
echo ""

echo "📲 CIHAZA YÜKLEME:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  1. USB ile telefonu bilgisayara bağla"
echo "  2. Aşağıdaki komutu çalıştır:"
echo ""
echo "     ${BLUE}adb install -r minecraft-android/platforms/android/app/build/outputs/apk/debug/app-debug.apk${NC}"
echo ""

echo "🎮 ÖZELLIKLER:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✨ Sanal Joystick (Sol Alt Köşe)"
echo "  ✨ Kontrol Simgeleri (Sağ Alt Köşe)"
echo "  ✨ Android Optimize Edilmiş"
echo "  ✨ Dokunmatik Kontrol Sistemi"
echo "  ✨ Full Landscape Desteği"
echo ""

echo "📖 DETAYLI REHBER YE BAK:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  • ANDROID_BUILD_GUIDE_TR.md     (Detaylı yapı rehberi)"
echo "  • Android_Features_TR.md         (Özellik açıklaması)"
echo ""

echo -e "${GREEN}Oyun oynamanın keyfini çıkar! 🎮✨${NC}"
