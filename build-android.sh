#!/bin/bash

# Build Vite project first
echo "📦 Vite projesi derleniyorum..."
npm run build

# Create Cordova project if not exists
if [ ! -d "minecraft-android" ]; then
    echo "📱 Cordova Android projesi oluşturuluyor..."
    cordova create minecraft-android com.minecraft.clone MinecraftClone
fi

cd minecraft-android

# Add Android platform if not exists
if [ ! -d "platforms/android" ]; then
    echo "🎯 Android platformu ekleniyor..."
    cordova platform add android@latest
fi

# Copy built files to www
echo "📁 Yapı dosyaları kopyalanıyor..."
rm -rf www/*
cp -r ../dist/* www/

# Create config.xml if needed
if [ ! -f "config.xml" ]; then
    echo "⚙️ config.xml oluşturuluyor..."
    cat > config.xml << 'EOF'
<?xml version='1.0' encoding='utf-8'?>
<widget id="com.minecraft.clone" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name>Minecraft</name>
    <description>Türkler tarafından geliştirilmiş Minecraft klonu</description>
    <author email="dev@example.com" href="https://example.com">Developer</author>
    <content src="index.html" />
    <access origin="*" />
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />
    <allow-intent href="tel:*" />
    <allow-intent href="sms:*" />
    <allow-intent href="mailto:*" />
    <allow-intent href="geo:*" />
    <preference name="ScrollEnabled" value="false" />
    <preference name="android-minSdkVersion" value="19" />
    <preference name="android-targetSdkVersion" value="33" />
    <preference name="Orientation" value="landscape" />
    <plugin name="cordova-plugin-whitelist" spec="1.3.3" />
    <plugin name="cordova-plugin-device" spec="2.0.2" />
    <plugin name="cordova-plugin-dialogs" spec="2.0.1" />
</widget>
EOF
fi

# Build APK
echo "🔨 Android APK oluşturuluyor..."
cordova build android --release

echo "✅ APK hazır! Dosya konumu: minecraft-android/platforms/android/app/build/outputs/apk/release/"
