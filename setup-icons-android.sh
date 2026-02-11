#!/bin/bash

# Android Android APK İkon Kurulum Scripti
# icon.ico dosyasını PNG'ye dönüştürüp Android'e adapte eder

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     🎮 Minecraft Android İkon Kurulum Scripti             ║"
echo "╚════════════════════════════════════════════════════════════╝"

# Renk tanımları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# İkon dosyasını kontrol et
if [ ! -f "icon.ico" ]; then
    echo -e "${RED}❌ icon.ico dosyası bulunamadı!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ icon.ico dosyası bulundu!${NC}\n"

# ImageMagick yüklü mü kontrol et
if ! command -v convert &> /dev/null; then
    echo -e "${YELLOW}⚠️ ImageMagick yüklü değil, yükleniyor...${NC}"
    apk add imagemagick || apt-get install -y imagemagick || brew install imagemagick
fi

# Cordova projesinin varlığını kontrol et
if [ ! -d "minecraft-android" ]; then
    echo -e "${YELLOW}⚠️ Cordova projesi bulunamadı, oluşturuluyor...${NC}"
    cordova create minecraft-android com.minecraft.clone MinecraftClone
fi

# İkon dizinini oluştur
echo -e "${BLUE}📁 İkon dizini oluşturuluyor...${NC}"
mkdir -p minecraft-android/res/icon/android
mkdir -p minecraft-android/res/screen/android

# İkon boyutları tanımla
declare -A SIZES=(
    ["ldpi"]=36
    ["mdpi"]=48
    ["hdpi"]=72
    ["xhdpi"]=96
    ["xxhdpi"]=144
    ["xxxhdpi"]=192
)

# Ekran splash boyutları (tüm boyutlar için 512x512 kullan)
declare -A SPLASH_SIZES=(
    ["ldpi"]=320x470
    ["mdpi"]=320x470
    ["hdpi"]=480x640
    ["xhdpi"]=720x960
)

echo -e "${BLUE}🎨 İkonlar dönüştürülüyor...${NC}\n"

# İkonları dönüştür
for density in "${!SIZES[@]}"; do
    size=${SIZES[$density]}
    output="minecraft-android/res/icon/android/icon-${size}-${density}.png"
    
    echo -e "${YELLOW}→${NC} Dönüştürülüyor: ${size}x${size} (${density})"
    convert icon.ico -resize ${size}x${size} -background transparent -gravity center -extent ${size}x${size} "$output"
    
    if [ -f "$output" ]; then
        echo -e "${GREEN}  ✓ Oluşturuldu: $output${NC}"
    fi
done

echo ""

# Splash screen oluştur (icon'u kullanarak)
echo -e "${BLUE}🖼️ Splash screen'ler oluşturuluyor...${NC}\n"

for density in "${!SPLASH_SIZES[@]}"; do
    size=${SPLASH_SIZES[$density]}
    output="minecraft-android/res/screen/android/splash-port-${density}.png"
    
    echo -e "${YELLOW}→${NC} Splash oluşturuluyor: ${size} (${density})"
    
    # Splash screen'i oluştur (icon'u ortada, koyu arka plan)
    convert -size ${size} \
        xc:'#1a1a1a' \
        icon.ico -resize 128x128 -gravity center -composite \
        -pointsize 40 -fill white -gravity south -annotate +0+30 "Minecraft Clone" \
        "$output"
    
    if [ -f "$output" ]; then
        echo -e "${GREEN}  ✓ Oluşturuldu: $output${NC}"
    fi
done

echo ""
echo -e "${GREEN}✅ Tüm ikonlar başarıyla oluşturuldu!${NC}\n"

# config.xml dosyasını güncelle
echo -e "${BLUE}⚙️ config.xml güncelleniyor...${NC}"

CONFIG_FILE="minecraft-android/config.xml"

# Eski ikonları kaldır (varsa)
if grep -q "icon src=" "$CONFIG_FILE"; then
    echo -e "${YELLOW}⚠️ Eski ikonlar kaldırılıyor...${NC}"
    sed -i '/<icon src=/d' "$CONFIG_FILE"
    sed -i '/<splash src=/d' "$CONFIG_FILE"
fi

# Yeni ikonları ekle (platform android bölümüne)
if ! grep -q 'android/icon' "$CONFIG_FILE"; then
    # Android bölümünü bul ve ikonları ekle
    sed -i '/<platform name="android">/a\
        <icon src="res/icon/android/icon-36-ldpi.png" density="ldpi" />\
        <icon src="res/icon/android/icon-48-mdpi.png" density="mdpi" />\
        <icon src="res/icon/android/icon-72-hdpi.png" density="hdpi" />\
        <icon src="res/icon/android/icon-96-xhdpi.png" density="xhdpi" />\
        <icon src="res/icon/android/icon-144-xxhdpi.png" density="xxhdpi" />\
        <icon src="res/icon/android/icon-192-xxxhdpi.png" density="xxxhdpi" />\
        <splash src="res/screen/android/splash-port-ldpi.png" density="port-ldpi" />\
        <splash src="res/screen/android/splash-port-mdpi.png" density="port-mdpi" />\
        <splash src="res/screen/android/splash-port-hdpi.png" density="port-hdpi" />\
        <splash src="res/screen/android/splash-port-xhdpi.png" density="port-xhdpi" />' "$CONFIG_FILE"
    
    echo -e "${GREEN}✅ config.xml güncellendi!${NC}"
fi

echo ""
echo -e "${BLUE}══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ İkonlar Başarıyla Hazırlandı!                   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"

echo ""
echo -e "${BLUE}📍 İkon Dosyaları:${NC}"
ls -lh minecraft-android/res/icon/android/*.png | awk '{print "  ✓", $9, "(" $5 ")"}'

echo ""
echo -e "${BLUE}🖼️ Splash Screen Dosyaları:${NC}"
ls -lh minecraft-android/res/screen/android/*.png | awk '{print "  ✓", $9, "(" $5 ")"}'

echo ""
echo -e "${BLUE}🚀 Şimdi APK'yı Derlemek İçin:${NC}"
echo ""
echo -e "  ${YELLOW}cd minecraft-android${NC}"
echo -e "  ${YELLOW}cordova build android --release${NC}"
echo ""

echo -e "${GREEN}İyi oyunlar! 🎮✨${NC}"
