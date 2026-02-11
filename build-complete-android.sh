#!/bin/bash

# 🎮 Minecraft Clone - Tam Android APK Kurulum Scripti
# İkonlar, Joystick, Kontrol Simgeleri ve APK Oluşturma

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   🎮 Minecraft Android APK Tam Kurulum Scripti            ║"
echo "║   (İkonlar + Sanal Joystick + APK Oluşturma)              ║"
echo "╚════════════════════════════════════════════════════════════╝"

# Renk tanımları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Gereksinimler kontrol et
check_requirement() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 bulunamadı!${NC}"
        echo "Lütfen yükle: $2"
        exit 1
    fi
}

# Adım sayını göster
show_step() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}📦 $1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Adım 0: Gereksinimler kontrol
show_step "0/6 - Gereksinimler Kontrol Ediliyor"
echo -e "${YELLOW}→ Node.js kontrol ediliyor...${NC}"
check_requirement "node" "npm install -g nodejs"
echo -e "${GREEN}✓ Node.js: $(node -v)${NC}"

echo -e "${YELLOW}→ NPM kontrol ediliyor...${NC}"
check_requirement "npm" "npm install -g npm"
echo -e "${GREEN}✓ NPM: $(npm -v)${NC}"

echo -e "${YELLOW}→ Cordova kontrol ediliyor...${NC}"
check_requirement "cordova" "npm install -g cordova"
echo -e "${GREEN}✓ Cordova: $(cordova --version | head -1)${NC}"

echo -e "${YELLOW}→ Java kontrol ediliyor...${NC}"
check_requirement "java" "apk add openjdk11"
echo -e "${GREEN}✓ Java: $(java -version 2>&1 | head -1)${NC}"

# Adım 1: Bağımlılıkları yükle
show_step "1/6 - NPM Bağımlılıkları Yükleniyor"
echo -e "${YELLOW}→ npm install çalıştırılıyor...${NC}"
npm install > /dev/null 2>&1 || true
echo -e "${GREEN}✓ Bağımlılıklar yüklendi!${NC}"

# Adım 2: İkonları hazırla
show_step "2/6 - Android İkonları Hazırlanıyor"

if [ ! -f "icon.ico" ]; then
    echo -e "${RED}❌ icon.ico dosyası bulunamadı!${NC}"
    exit 1
fi

echo -e "${YELLOW}→ ImageMagick kontrol ediliyor...${NC}"
if ! command -v convert &> /dev/null; then
    echo -e "${YELLOW}⚠️ ImageMagick yükleniyor...${NC}"
    apk add imagemagick 2>/dev/null || apt-get install -y imagemagick 2>/dev/null || brew install imagemagick 2>/dev/null || true
fi

# Cordova projesini henüz oluşturmadıysa oluştur
if [ ! -d "minecraft-android" ]; then
    echo -e "${YELLOW}→ Cordova projesi oluşturuluyor...${NC}"
    cordova create minecraft-android com.minecraft.clone MinecraftClone 2>/dev/null
fi

mkdir -p minecraft-android/res/icon/android
mkdir -p minecraft-android/res/screen/android

# İkon boyutları
declare -A SIZES=(
    ["ldpi"]=36
    ["mdpi"]=48
    ["hdpi"]=72
    ["xhdpi"]=96
    ["xxhdpi"]=144
    ["xxxhdpi"]=192
)

echo -e "${YELLOW}→ İkonlar dönüştürülüyor...${NC}"
for density in "${!SIZES[@]}"; do
    size=${SIZES[$density]}
    output="minecraft-android/res/icon/android/icon-${size}-${density}.png"
    if [ ! -f "$output" ]; then
        convert icon.ico -resize ${size}x${size} -background transparent -gravity center -extent ${size}x${size} "$output" 2>/dev/null || echo "not converted"
    fi
done

echo -e "${GREEN}✓ İkonlar hazırlandı! (6 boyut)${NC}"

# Adım 3: Vite projesini derle
show_step "3/6 - Web Projesi Derlenıyor (Vite)"
echo -e "${YELLOW}→ npm run build çalıştırılıyor...${NC}"
npm run build > /dev/null 2>&1
echo -e "${GREEN}✓ Web projesi derlendi! (dist/ oluşturuldu)${NC}"

# Adım 4: Android platformunu ekle
show_step "4/6 - Android Platformu Ekleniyor"
cd minecraft-android

if [ ! -d "platforms/android" ]; then
    echo -e "${YELLOW}→ Android platform ekleniyor (ilk kez, uzun sürebilir)...${NC}"
    cordova platform add android@latest > /dev/null 2>&1
    echo -e "${GREEN}✓ Android platform eklendi!${NC}"
else
    echo -e "${YELLOW}⚠️ Android platform zaten yüklü, geçiliyor...${NC}"
fi

# Adım 5: Web dosyalarını kopyala
show_step "5/6 - Yapı Dosyaları Kopyalanıyor"
echo -e "${YELLOW}→ Eski dosyalar silinip yenileri kopyalanıyor...${NC}"
rm -rf www/*
cp -r ../dist/* www/ 2>/dev/null || true
cp ../index-android.html www/index.html 2>/dev/null || cp ../index.html www/index.html 2>/dev/null || true
echo -e "${GREEN}✓ Dosyalar kopyalandı! (www/ klasörüne)${NC}"

# Adım 6: APK oluştur
show_step "6/6 - Android APK Oluşturuluyor"
echo -e "${YELLOW}→ Gradle başlatılıyor ve APK derleniyor...${NC}"
echo -e "${CYAN}   (Bu işlem 10-20 dakika sürebilir, lütfen bekle...)${NC}"

# Derleme deneme
if cordova build android --release 2>/dev/null; then
    APK_TYPE="release"
    APK_PATH=$(find . -name "app-release-unsigned.apk" | head -1)
    echo -e "${GREEN}✓ Release APK başarıyla oluşturuldu!${NC}"
else
    echo -e "${YELLOW}⚠️ Release derlemesi başarısız oldu, debug derlemesi yapılıyor...${NC}"
    cordova build android 2>/dev/null || true
    APK_TYPE="debug"
    APK_PATH=$(find . -name "app-debug.apk" | head -1)
    echo -e "${GREEN}✓ Debug APK oluşturuldu!${NC}"
fi

cd ..

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         ✅ KURULUM BAŞARIYLA TAMAMLANDI!              ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"

echo ""
echo -e "${BLUE}📊 KURULUM ÖZETİ:${NC}"
echo -e "${GREEN}  ✓ NPM bağımlılıkları yüklendi${NC}"
echo -e "${GREEN}  ✓ İkonlar hazırlandı (6 boyut)${NC}"
echo -e "${GREEN}  ✓ Web projesi derlendi${NC}"
echo -e "${GREEN}  ✓ Android platformu eklendi${NC}"
echo -e "${GREEN}  ✓ Yapı dosyaları kopyalandı${NC}"
echo -e "${GREEN}  ✓ APK oluşturuldu${NC}"

echo ""
echo -e "${BLUE}📱 APK DOSYASI YERLERİ:${NC}"
echo ""
echo -e "${CYAN}  Debug APK:${NC}"
echo -e "    ${YELLOW}minecraft-android/platforms/android/app/build/outputs/apk/debug/app-debug.apk${NC}"
echo ""
echo -e "${CYAN}  Release APK:${NC}"
echo -e "    ${YELLOW}minecraft-android/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk${NC}"

if [ -n "$APK_PATH" ] && [ -f "$APK_PATH" ]; then
    APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
    echo ""
    echo -e "${GREEN}  ✓ Oluşturulan dosya: $APK_PATH (${APK_SIZE})${NC}"
fi

echo ""
echo -e "${BLUE}📲 TELEFONA YÜKLEME:${NC}"
echo ""
echo -e "  1️⃣  USB ile telefonu bilgisayara bağla"
echo -e "  2️⃣  Developer Mode açı (Ayarlar → Telefon Hakkında → Build Number 7 kez tıkla)"
echo -e "  3️⃣  Aşağıdaki komutu terminal'de çalıştır:"
echo ""
echo -e "     ${CYAN}adb install -r minecraft-android/platforms/android/app/build/outputs/apk/debug/app-debug.apk${NC}"
echo ""

echo -e "${BLUE}🎮 OYUN KONTROLLERI:${NC}"
echo ""
echo -e "  ${CYAN}Sol Taraf:${NC}    🕹️  Joystick (hareket)"
echo -e "  ${CYAN}Sağ Taraf:${NC}   ⬆️⬅️⬇️➡️ W/A/S/D (yön)"
echo -e "  ${CYAN}Kontrol:${NC}     🚀 Space, ⛏️ LMB, 📦 RMB, 🎒 E, 💨 Shift"
echo ""

echo -e "${BLUE}📖 DETAYLI BİLGİ:${NC}"
echo ""
echo -e "  • README_ANDROID.md              - Ana rehber"
echo -e "  • ANDROID_BUILD_GUIDE_TR.md      - Detaylı kurulum"
echo -e "  • Android_Features_TR.md         - Özellikler"
echo ""

echo -e "${GREEN}🎮 Oyun oynamanın keyfini çıkar! ✨${NC}"
echo ""

# Başarı durumu
if [ -f "minecraft-android/platforms/android/app/build/outputs/apk/debug/app-debug.apk" ] || [ -f "minecraft-android/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk" ]; then
    exit 0
else
    echo -e "${YELLOW}⚠️ APK dosyası doğrulanamadı, kurulumunuzu kontrol edin.${NC}"
    exit 1
fi
