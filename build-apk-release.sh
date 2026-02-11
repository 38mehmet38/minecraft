#!/bin/bash

# ╔════════════════════════════════════════════════════════════╗
# ║    Minecraft Android APK - Yayın Hazırlığı Scripti       ║
# ║    (Icon.ico ile)                                          ║
# ╚════════════════════════════════════════════════════════════╝

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ANDROID_DIR="$PROJECT_DIR/minecraft-android"
WWW_DIR="$ANDROID_DIR/www"
RES_DIR="$ANDROID_DIR/res"

echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  Minecraft Android APK - Yayın Hazırlığı                  ║${NC}"
echo -e "${CYAN}║  🚀 Release APK Oluşturma Süreci                          ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 1. Dosya kontrolü
echo -e "${BLUE}📋 1/5 Sistem kontrol ediliyor...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js bulunamadı!${NC}"
    echo "Kontrol: node --version"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm bulunamadı!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version)${NC}"
echo -e "${GREEN}✅ npm $(npm --version)${NC}"
echo ""

# 2. NPM bağımlılıkları
echo -e "${BLUE}📦 2/5 Bağımlılıklar yükleniyor...${NC}"
if [ ! -d "node_modules" ]; then
    npm install
else
    echo -e "${YELLOW}⚠️ node_modules zaten var, geçiliyor${NC}"
fi
echo -e "${GREEN}✅ Bağımlılıklar hazır${NC}"
echo ""

# 3. Vite Build
echo -e "${BLUE}📦 3/5 Vite web projesi derleniyyor...${NC}"
npm run build
echo -e "${GREEN}✅ Web dosyaları derlenmiştir${NC}"
echo ""

# 4. Cordova Yapısı Hazırlık
echo -e "${BLUE}📦 4/5 Cordova Android yapısı hazırlanıyor...${NC}"

# İçeriği temizle ve yeniden oluştur
rm -rf "$WWW_DIR"/*
mkdir -p "$WWW_DIR"

# Web dosyalarını kopyala
cp -r dist/* "$WWW_DIR/" 2>/dev/null || echo -e "${YELLOW}⚠️ dist dosyaları kopyalanamadı${NC}"
cp index-android.html "$WWW_DIR/index.html" 2>/dev/null || cp index.html "$WWW_DIR/index.html"
cp cordova-config.xml "$ANDROID_DIR/config.xml" 2>/dev/null || echo -e "${YELLOW}⚠️ config.xml hazırlanıyor${NC}"

echo -e "${GREEN}✅ Cordova yapısı hazırlandı${NC}"
echo ""

# 5. Icon Kurulumu
echo -e "${BLUE}📦 5/5 Icon dosyaları ayarlanıyor...${NC}"

if [ -f "$PROJECT_DIR/icon.ico" ]; then
    cp "$PROJECT_DIR/icon.ico" "$RES_DIR/icon.ico"
    echo -e "${GREEN}✅ icon.ico kopyalandı${NC}"
fi

if [ -f "$PROJECT_DIR/src/resources/favicon.ico" ]; then
    cp "$PROJECT_DIR/src/resources/favicon.ico" "$RES_DIR/favicon.ico"
    echo -e "${GREEN}✅ favicon.ico kopyalandı${NC}"
fi

if [ -f "$PROJECT_DIR/src/resources/gui/icons.png" ]; then
    mkdir -p "$RES_DIR/icon/android"
    cp "$PROJECT_DIR/src/resources/gui/icons.png" "$RES_DIR/icon/android/icon.png"
    echo -e "${GREEN}✅ PNG icon kopyalandı${NC}"
fi

echo ""

# Özet
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║        ✅ Hazırlık Tamamlandı!                        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${MAGENTA}📍 SONRAKI ADIMLAR:${NC}"
echo ""

if command -v cordova &> /dev/null; then
    echo "1️⃣ Android platform ekle:"
    echo -e "   ${CYAN}cd minecraft-android${NC}"
    echo -e "   ${CYAN}cordova platform add android${NC}"
    echo ""
    echo "2️⃣ Release APK derle:"
    echo -e "   ${CYAN}cordova build android --release${NC}"
    echo ""
else
    echo "1️⃣ Cordova yükle:"
    echo -e "   ${CYAN}npm install -g cordova${NC}"
    echo ""
    echo "2️⃣ Android platform ekle:"
    echo -e "   ${CYAN}cd minecraft-android && cordova platform add android${NC}"
    echo ""
    echo "3️⃣ Release APK derle:"
    echo -e "   ${CYAN}cordova build android --release${NC}"
    echo ""
fi

echo -e "${MAGENTA}📁 APK DOSYA KONUMLARI:${NC}"
echo ""
echo -e "   ${CYAN}Debug APK:${NC}"
echo "   minecraft-android/platforms/android/app/build/outputs/apk/debug/"
echo ""
echo -e "   ${CYAN}Release APK:${NC}"
echo "   minecraft-android/platforms/android/app/build/outputs/apk/release/"
echo ""

echo -e "${MAGENTA}🎮 YÜKLEMEDİR:${NC}"
echo ""
echo "   USB ile telefonu bağla ve şu komutu çalıştır:"
echo -e "   ${CYAN}adb install -r minecraft-android/platforms/android/app/build/outputs/apk/debug/app-debug.apk${NC}"
echo ""

echo -e "${MAGENTA}📚 YÖNETİCİ:${NC}"
echo ""
echo "   • ${CYAN}README_ANDROID.md${NC} - Başlama rehberi"
echo "   • ${CYAN}ANDROID_BUILD_GUIDE_TR.md${NC} - Detaylı rehber"
echo "   • ${CYAN}Android_Features_TR.md${NC} - Özellikler"
echo "   • ${CYAN}setup-android.sh${NC} - Otomatik kurulum"
echo ""

echo -e "${GREEN}🎉 Bon courage! Başarılar! 🎮✨${NC}"
echo ""
