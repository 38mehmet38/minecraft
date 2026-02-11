# 🎮 Minecraft Clone - Hızlı Başlangıç Rehberi

## 🚀 Başlama

### 1. Gereksinimler
- Node.js 14+ (npm ile)
- Modern web browser (Chrome, Firefox, Edge)
- ~500MB disk alanı (tüm asset'ler için)

### 2. Kurulum
```bash
# Proje klasörüne gidin
cd /workspaces/minecraft

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Tarayıcıda açın (genellikle http://localhost:5173)
```

### 3. Build (Üretim)
```bash
npm run build
npm run preview
```

## 🎮 Oynanış

### Temel Kontroller
- **WASD** - Hareket et
- **Space** - Zıpla
- **E** - Envanteri aç (varsa)
- **Shift** - Eğil
- **Sol Tık** - Blok koy / İnşa et
- **Sağ Tık** - Blok kur / Etkileşim

### İnteraktif Bloklar

#### 🧱 Sandık (Chest) - ID 51
- **Sağ tık**: Envanteri aç
- **Kapasitesi**: 27 slot
- **Ses**: Açılma/kapanma sesleri

#### 🚪 Kapı (Door) - ID 52
- **Sağ tık**: Açılır/kapanır
- **Özellik**: Çarpışma dinamik olarak değişir
- **Ses**: Açılma/kapanma sesleri

#### 🪜 Işık Geçidi (Trapdoor) - ID 53
- **Sağ tık**: Açılır/kapanır
- **Kullanım**: Giriş deliği veya platform
- **Ses**: Tıklama sesi

#### 🎚️ Kaldıraç (Lever) - ID 54
- **Sağ tık**: Redstone sinyali tetikle
- **Etki Alanı**: 15 blok yarıçapında
- **Ses**: Kaldıraç sesi

#### 💡 Lamba (Lamp) - ID 55
- **Redstone Sinyali Alır**: Evet
- **Işık Seviyesi**: 0-15 (sinyal gücüne göre)
- **Özellik**: Kaldıraç tarafından kontrol edilebilir

#### 🔫 Piston (Piston) - ID 56
- **Redstone Sinyali Alır**: Evet
- **Kapasite**: 12 bloka kadar iter
- **Özellik**: Blokları tamamen haritadan kaydırabilir

#### 🌀 Hopper - ID 57
- **Operasyon**: Otomatik eşya transferi
- **Hız**: Her 8 tiklede bir transfer
- **Kapasitesi**: 5 slot
- **Hedef**: Komşu konteynerler (sandık, hopper, vb.)

## 🎯 Örnek Yapı

### Basit Redstone Devresi
```
[Kaldıraç] -----> [Lamba]
  (54)              (55)
  
Sağ tık kaldıraç → Lamba ışığı açılır
```

### Otomatik Item Transferi
```
[Sandık] 
  (51)
   ↓
[Hopper]
  (57)
   ↓
[Sandık]
  (51)
  
Hopper otomatik olarak items transferi yapar
```

### Dinamik Geçiş
```
Taş - Taş - Taş - Taş
Taş - Işık Geçidi - Taş
Taş - Taş - Taş - Taş
  
Sağ tık → Geçit açılır, içinden geçebilirsiniz
```

## 📚 Blok Listesi

### Temel Bloklar (1-50)
```
Taş, Toprak, Çimen, Kumbaş, Su, Lava, Malı, 
Ağaç, Yaprak, Kum, Çakıl, Kahve Orta, Demir Cevheri, 
Altın Cevheri, Elmas Cevheri, Kömür Cevheri, vb.
```

### İnteraktif Bloklar (51-57)
```
51: Sandık       54: Kaldıraç
52: Kapı         55: Lamba
53: Işık Geçidi  56: Piston
57: Hopper
```

### Biom Blokları (100-199)
```
Acacia, Birch, Spruce, Jungle, Dark Oak, Mangrove Ağaçları
Çeşitli Toprak Türleri ve Bitkileri
```

### Dekoratif Bloklar (200-299)
```
Andesite, Diorite, Granite
Brick, Taş Tuğla, Prismarine
End Taşı, Obsidian, vb.
```

### Ore Blokları (300-399)
```
Kömür Cevheri, Elmas Cevheri, Altın Cevheri,
Nether Kuartz, Ancient Debris,
Deepslate Varyantları, vb.
```

### Mekanik Bloklar (400-499)
```
Fırın, Blast Furnace, Smoker
Hopper, Dispenser, Dropper
Vb. işlevsel bloklar
```

### Redstone Blokları (500-599)
```
Repeater, Comparator, Redstone Wire,
Observer, Redstone Block, vb.
```

## 🔧 Teknik Bilgiler

### Blok ID Sistemi
- **1-50**: Temel bloklar
- **51-57**: İnteraktif bloklar (özel sınıflar)
- **58-99**: Gelecek için ayrılmış
- **100-199**: Biom blokları
- **200-299**: Dekoratif bloklar
- **300-399**: Ore blokları
- **400-499**: Mekanik bloklar
- **500-599**: Redstone blokları
- **600+**: Gelecek extensions için

### Redstone Sistemi
- Kaldıraç sinyali: **15 blok yarıçapında** (Manhattan mesafesi)
- Sinyal gücü: **1-15** (blok türüne göre değişir)
- Güncelleme hızı: **Gerçek zamanlı**

### Envanterler
Sandık ve Hopper'ın envanteri vardır:
- **Sandık**: 27 slot (3x9)
- **Hopper**: 5 slot
- Veri oyun oturumu boyunca saklanır

## 🎨 Özelleştirme

### Yeni Blok Ekleme
```javascript
// src/js/net/minecraft/client/world/block/BlockRegistry.js
BlockRegistry.MY_BLOCK = new Block(600, 600);
```

### Etkileşimli Blok Oluşturma
```javascript
// src/js/net/minecraft/client/world/block/type/BlockMyBlock.js
export default class BlockMyBlock extends Block {
    onBlockClicked(world, x, y, z, minecraft, face) {
        console.log("Blok tıklandı!");
        return true;
    }
}
```

### Yeni Doku Ekleme
```bash
# PNG dosyasını buraya koyun:
src/resources/textures/block/my_texture.png

# BlockRenderer'a tanıt:
# TextureAtlasManager.js'de registerBlockTextures() güncelleyin
```

## 🐛 Sorun Giderme

### "Purple/Magenta Bloklar Görünüyor"
- ✅ ÇÖZÜLDÜ! TextureAtlasManager sistem entegre edildi
- Oyunu yeniden yükleyin (Ctrl+F5)

### "Ses Çalınmıyor"
- DynamicTextureLoader.js'de sesler varsayılan olarak sentetik (Web Audio API)
- .ogg dosyaları /src/resources/ klasörüne eklenebilir
- SoundManager.js otomatik fallback yapıyor

### "Blok Etkileşimi Çalışmıyor"
- Sağ tık (button 2) kullanıyor musunuz?
- Bloğun `canInteract()` methodunu kontrol edin
- Konsolda (F12) hata var mı diye bakın

### "Redstone Sinyali Çalışmıyor"
- Kaldıraç ile başlayın (ID 54)
- Lamba (ID 55) 15 blok içinde olmalı
- Redstone sistemi Manhattan mesafesi kullanıyor

## 📱 Mobil Desteği

Şu anda masaüstü kullanıcıları için tasarlanmıştır.
Mobil desteği gelecekte eklenebilir.

## 🌐 Tarayıcı Uyumluluğu

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Edge 80+
- ✅ Safari 13+

## 💾 Kaydetme Sistemi

Geliştirilme aşamasında:
- Veri oyun oturumu boyunca RAM'de tutulur
- Sayfa yenilenmesi verilerinizi siler
- Gelecekte local storage/database desteklemeyi planlıyoruz

## 📞 Yardım

Sorunlarınız varsa:
1. [INTERACTIVE_BLOCKS_TR.md](INTERACTIVE_BLOCKS_TR.md) - Detaylı rehber
2. [INTERACTIVE_BLOCKS.md](INTERACTIVE_BLOCKS.md) - İngilizce rehber
3. [SYSTEM_INTEGRATION_REPORT.md](SYSTEM_INTEGRATION_REPORT.md) - Teknik rapor
4. [CHANGES_SUMMARY.md](CHANGES_SUMMARY.md) - Değişiklikler

## 🎉 Eğlenceli!

Minecraft Clone'u keyfini çıkarın! 🎮

---
**Son Güncelleme**: Şubat 3, 2025
**Durum**: ✅ HAZIR
