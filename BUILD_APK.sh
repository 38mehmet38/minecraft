#!/bin/bash
# Minecraft APK - Build Script
# Node.js, JDK, Android SDK gerekli

set -e

echo "🔨 APK Derlemesi Başlıyor..."

# Check requirements
which cordova || { echo "Cordova yok: npm install -g cordova"; exit 1; }
which java || { echo "Java yok"; exit 1; }
which gradle || echo "⚠️ Gradle otomatik indirilecek"

cd minecraft-android

# Clean previous builds
./gradlew clean 2>/dev/null || true

# Build release APK
cordova build android --release

echo "✅ Tamamlandı!"
echo "📍 APK: platforms/android/app/build/outputs/apk/release/"
