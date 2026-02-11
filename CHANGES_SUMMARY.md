# 📋 Minecraft JavaScript Projesi - Değişiklik Özeti

**Tarih**: 3 Şubat 2026  
**Versiyon**: 1.1.8 → 1.2.0  
**Dil**: JavaScript (ES6+)

---

## ✨ Yeni Eklenmiş Özellikler

### 1. İnteraktif Blok Sistemi

Oyuncunun sağ tıklaması (button 2) ile etkileşim kurabilen 7 yeni blok türü:

#### Bloklar:
| Blok | ID | Açıklama | İşlev |
|------|----|----|-------|
| Sandık (Chest) | 51 | Öğe Depolama | 27 slot envanteri |
| Kapı (Door) | 52 | Geçişi Kontrol | Açılır/Kapanır |
| Tuzak Kapı | 53 | Platform Mekanizması | Hızlı Aç/Kapa |
| Alet (Lever) | 54 | Redstone Tetikleyici | Sinyal Yayılır |
| Lamba (Lamp) | 55 | Redstone Alıcı | Işık Kontrolü |
| Piston (Piston) | 56 | Blok İtme Mekanizması | Otomatik İtme |
| Hunisi (Hopper) | 57 | Öğe Transferi | Fabrika Sistemi |

### 2. Redstone Sistemi

**Tetikleme Mekanizması**:
- Lever tetiklenince 15 blok menzilinde redstone sinyali yayılır
- Lamp, Piston, Door vb. sinyale yanıt verir
- Otomatik sinyal yayılması ve durum senkronizasyonu

**Sinyal Özelikleri**:
```
POWERED STATE: 15V (Açık)
UNPOWERED STATE: 0V (Kapalı)
BROADCAST RANGE: 15 blocks (Manhattan Distance)
```

### 3. Ses Sistemi Iyileştirmeleri

#### Programatik Ses Oluşturma
- Gerçek ses dosyası olmadığında Web Audio API kullanarak sesler oluşturur
- Her blok türü için benzersiz ses profili:
  - Sandık: 350-400 Hz (Tahta sesi)
  - Kapı: Frekans Sweep (800Hz → 400Hz)
  - Piston/Lever: Hızlı Click (700-1000 Hz)

#### Ses Dosya Yapısı
```
src/resources/sound/
├── random/
│   ├── chestopen1.ogg
│   ├── chestclosed1.ogg
│   ├── door_open1.ogg
│   ├── door_close1.ogg
│   ├── trapdoor_open1.ogg
│   ├── trapdoor_close1.ogg
│   ├── lever1.ogg
│   └── click1.ogg
└── step/
    └── [Existing step sounds]
```

---

## 📁 Yeni Dosyalar

### Blok Sınıfları
```
src/js/net/minecraft/client/world/block/type/
├── BlockChest.js       (27 slot envanteri)
├── BlockDoor.js        (Dinamik çarpışma kutusu)
├── BlockTrapdoor.js    (Hafif açılış mekanizması)
├── BlockLever.js       (Redstone tetikleme)
├── BlockLamp.js        (Redstone alıcı, ışık kontrolü)
├── BlockPiston.js      (Blok itme mekanizması)
└── BlockHopper.js      (Otomatik öğe transferi)
```

### Sistem Dosyaları
```
src/js/net/minecraft/client/sound/
├── InteractiveBlockSounds.js  (Ses yapılandırması)
└── SoundManager.js            (Iyileştirildi)

src/js/net/minecraft/client/world/
└── RedstoneSystem.js          (Redstone ağı yönetimi)
```

### Dokümantasyon
```
├── INTERACTIVE_BLOCKS.md      (İngilizce Teknik Belgeler)
├── INTERACTIVE_BLOCKS_TR.md   (Türkçe Kullanım Rehberi)
└── CHANGES_SUMMARY.md         (Bu Dosya)
```

### Test Dosyaları
```
src/tests/
└── InteractiveBlocksTest.js   (Test Örnekleri)
```

---

## 🔧 Değiştirilen Dosyalar

### 1. `Block.js`
```diff
+ onBlockClicked(world, x, y, z, minecraft, face)
+ // Blok tıklaması için callback
```

### 2. `BlockRegistry.js`
```diff
+ import BlockChest, BlockDoor, BlockTrapdoor, BlockLever, BlockLamp, BlockPiston, BlockHopper
+ BlockRegistry.CHEST = new BlockChest(51, 15);
+ BlockRegistry.DOOR = new BlockDoor(52, 16);
+ BlockRegistry.TRAPDOOR = new BlockTrapdoor(53, 17);
+ BlockRegistry.LEVER = new BlockLever(54, 18);
+ BlockRegistry.LAMP = new BlockLamp(55, 19);
+ BlockRegistry.PISTON = new BlockPiston(56, 20);
+ BlockRegistry.HOPPER = new BlockHopper(57, 21);
```

### 3. `Minecraft.js`
```diff
// onMouseClicked() Metodu Iyileştirildi
- // Blok yerleştirme sadece
+ // Blok yerleştirme + Blok etkileşimi
+ if (interactBlock.canInteract()) {
+     interactBlock.onBlockClicked(world, x, y, z, minecraft, face);
+ }
```

### 4. `SoundManager.js`
```diff
+ import InteractiveBlockSounds
+ loadSoundPool("random.chestopen")
+ loadSoundPool("random.door_open")
+ // ... tüm yeni sesler
+ 
+ createProceduralSound(sound, path)
+ generateProceduralAudio(soundType, data, sampleRate)
+ generateChestSound(), generateDoorSound() // vb.
```

### 5. `GameWindow.js`
- Değişiklik yok (Var olan Fare Tıklaması Sistemi Kullanılıyor)

---

## 🎯 İşlevsellik Akışı

### Sandık Açılması
```
Oyuncu Sağ Tıkla
→ Minecraft.onMouseClicked(2)
→ Block.getById(51).onBlockClicked()
→ minecraft.chestInventory = [...]
→ SoundManager.playSound("random.chestopen")
→ GUI Açılır
```

### Lever Tetikleme + Lamp Açılması
```
Oyuncu Sağ Tıkla Lever
→ BlockLever.onBlockClicked()
→ BlockLever.triggerRedstone()
→ Menzil içinde tüm blokları kontrol et
→ BlockLamp.onRedstoneSignal(powered: true)
→ BlockLamp.lightValue = 15
→ WorldRenderer güncelle
→ SoundManager.playSound("random.click")
```

### Piston İtme Mekanizması
```
Lever Tetiklenir
→ BlockPiston.onRedstoneSignal()
→ BlockPiston.pushBlocks()
→ Öndeki blokları kontrol et
→ Boş alana blok taşı
→ Animasyon çalıştır
→ SoundManager.playSound("random.click")
```

---

## 📊 Sistem Mimarisi

```
┌─────────────────────────────────────────┐
│         Minecraft (Ana Sınıf)          │
├─────────────────────────────────────────┤
│  - soundManager: SoundManager            │
│  - worldRenderer: WorldRenderer          │
│  - world: World                          │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴─────────┐
       │                 │
   ┌───▼──────┐    ┌────▼─────┐
   │  Bloklar  │    │  Sesler   │
   ├──────────┤    ├───────────┤
   │ Chest    │    │ Procedural│
   │ Door     │    │ Audio API │
   │ Lever    │    │ Synthesis │
   │ Lamp     │    │ (Web)     │
   │ Piston   │    │           │
   │ Hopper   │    │           │
   └──────────┘    └───────────┘
         │              
    ┌────▼──────────┐
    │ Redstone Sys  │
    ├───────────────┤
    │ Signal Emit   │
    │ Broadcasting  │
    │ 15 Block Rad  │
    └───────────────┘
```

---

## ⚙️ Teknik Gereksinimler

### Minimum Tarayıcı Desteği
- **Web Audio API**: Chrome 14+, Firefox 25+, Safari 6+, Edge 12+
- **ES6+**: Tüm Modern Tarayıcılar
- **Three.js**: v0.128.0+ (Var olanı kullanır)

### Performans Notları
- Redstone güncellemeleri: O(1) (Blok başına)
- Sinyal Yayılması: O(n³) burada n = 15 (Menzil)
- Ses Oluşturma: Real-time (Lazy-load)

---

## 🧪 Test Edildi

✅ Sandık Açılması/Kapatılması  
✅ Kapı Mekanizması  
✅ Lever Tetikleme (15 blok menzili)  
✅ Lamp Redstone Alıcı  
✅ Piston Blok İtme  
✅ Hopper Otomatik Transferi  
✅ Ses Sistemi (Programatik + Dosya)  
✅ Blok Kaydı ve Registry  

---

## 🐛 Bilinen Sorunlar / Sınırlamalar

| Sorun | Durum | Notlar |
|-------|-------|--------|
| Redstone İletkenlik | Planlı | Kablosu yapılması gerek |
| Oyuncu GUI Arayüzü | Planlı | HTML/CSS Arayüzü eklenmeli |
| Ağ Senkronizasyonu | Planlı | Çok oyunculu destek yok |
| Ses Dosyası Yükleme | Çalışıyor | Uygun olmayan dosyalar skip edilir |
| Piston Yönü | Sabit | Şu an yukarı doğru |

---

## 🚀 Gelecek Geliştirmeler

### Kısa Vadeli
- [ ] Redstone Kablosu Bloğu
- [ ] Komparatör Bloğu (Mantık)
- [ ] Tekrarlayıcı Bloğu (Gecikme)

### Orta Vadeli
- [ ] Oyuncu GUI (Sandık/Hopper Arayüzü)
- [ ] Dispenser Bloku (Öğe Atma)
- [ ] Gözlemci Bloku (Algılayıcı)

### Uzun Vadeli
- [ ] Çok Oyunculu Senkronizasyon
- [ ] Sunucu-İstemci Mimarisi
- [ ] Redstone Benzeri Ağ Protokolü

---

## 📚 Kullanım Rehberleri

1. **Teknik Belgeler**: [INTERACTIVE_BLOCKS.md](./INTERACTIVE_BLOCKS.md)
2. **Türkçe Rehber**: [INTERACTIVE_BLOCKS_TR.md](./INTERACTIVE_BLOCKS_TR.md)
3. **Test Örnekleri**: [InteractiveBlocksTest.js](./src/tests/InteractiveBlocksTest.js)

---

## 📞 İletişim & Destek

- **Issue Bildirimi**: GitHub Issues
- **Geliştirici**: Minecraft JavaScript Klonu Takımı
- **Lisans**: MIT

---

**Versiyon Tarihi**: 3 Şubat 2026  
**Son Güncelleme**: İnteraktif Blok Sistemi v1.0 Tamamlandı
