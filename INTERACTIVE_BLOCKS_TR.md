# İnteraktif Blok Sistemi - Türkçe Kullanım Rehberi

## 📋 İçindekiler

1. [Temel Konseptler](#temel-konseptler)
2. [Blok Türleri](#blok-türleri)
3. [Kullanım Örnekleri](#kullanım-örnekleri)
4. [Redstone Sistemi](#redstone-sistemi)
5. [Ses Sistemi](#ses-sistemi)
6. [Sık Sorulan Sorular](#sık-sorulan-sorular)

## 🎮 Temel Konseptler

### İnteraktif Blok Nedir?

İnteraktif bloklar, oyuncunun fare veya dokunmatik arayüz aracılığıyla etkileşime girebileceği bloklar olup, özel fonksiyonları yerine getirirler.

### Sağ Tıkla (Button 2) Etkileşimi

Oyuncu bir bloğa sağ tıkladığında:

```
Oyuncu Sağ Tıkla
    ↓
Minecraft.onMouseClicked(2)
    ↓
Block.onBlockClicked()
    ↓
İşlev Çalışır (Ses, Durum Değişikliği, vb.)
```

### Durum Takibi

Bloklar Harita Konumlarına Göre Durum Tutar:

```javascript
let opened = new Map();  // "100,50,100" -> true/false
let powered = new Map(); // "100,50,100" -> true/false
```

---

## 📦 Blok Türleri

### 1️⃣ SANDIK (Chest) - ID: 51

**Amacı**: Öğeleri depolamak

**Teknik Bilgiler**:
- **Durum**: Açık/Kapalı
- **Depolama**: 27 slot (3×9 ızgara)
- **Çarpışma Kutusu**: 0.0625, 0.0, 0.0625 - 0.9375, 0.875, 0.9375
- **Ses**: 
  - Açılma: `random.chestopen`
  - Kapanma: `random.chestclosed`

**Oyun İçinde Nasıl Çalışır**:

1. Sandığa sağ tıkla
2. Sandık arayüzü açılır (Web GUI)
3. Öğeleri taşı (fare sürükle)
4. Arayüzü kapat

**Kod Örneği**:

```javascript
// Sandık Oluştur
world.setBlockAt(100, 50, 100, 51);

// Sandık Sınıfına Erişim
const ChestBlock = Block.getById(51);

// Sandık Envanterini Kontrol Et
let inventory = ChestBlock.inventory.get("100,50,100");
console.log(inventory); // [item1, item2, ...]
```

---

### 2️⃣ KAPI (Door) - ID: 52

**Amacı**: Alanları ayırmak, geçişi kontrol etmek

**Teknik Bilgiler**:
- **Durum**: Açık/Kapalı
- **Açılış Yönü**: Bloğa tıklanan yüze göre
- **Çarpışma**:
  - Kapalı: 1.0 × 1.0 × 1.0
  - Açık: 0.0625 × 1.0 × 0.1875 (yaklaşık)
- **Ses**:
  - Açılma: `random.door_open` (800Hz → 400Hz)
  - Kapanma: `random.door_close` (400Hz → 200Hz)

**Oyun İçinde Nasıl Çalışır**:

1. Oyuncu kapıya sağ tıklar
2. Kapı açılır/kapanır
3. Oyuncu kapının içinden geçebilir/geçemez
4. Ses çıkar

**Kod Örneği**:

```javascript
// Kapı Koy
world.setBlockAt(100, 50, 100, 52);

// Kapının Açılıp Açılmadığını Kontrol Et
const DoorBlock = Block.getById(52);
let isOpened = DoorBlock.opened.get("100,50,100");

// Programatik Olarak Açma/Kapama
DoorBlock.onBlockClicked(world, 100, 50, 100, minecraft, EnumBlockFace.SOUTH);
```

---

### 3️⃣ TUZAK KAPI (Trapdoor) - ID: 53

**Amacı**: Platform, tuzak, su geçidi

**Özellikleri**:
- Açıldığında 0.1875 yüksekliğinde
- Kapalıyken tam blok (1.0 × 1.0 × 1.0)
- Hızlı açılma/kapanma (ses daha hafif)

**Kullanım Örneği**:

```
┌─────┐
│ ▬ ▬ │  ← Trapdoor Açık (oyuncu geçebilir)
│     │
└─────┘

┌─────┐
│  ▓  │  ← Trapdoor Kapalı (oyuncu geçemez)
│  ▓  │
└─────┘
```

---

### 4️⃣ ALET (Lever) - ID: 54

**Amacı**: Redstone sinyali tetiklemek

**Teknik Bilgiler**:
- **Sinyal Menzili**: 15 blok (Manhattan distance)
- **Durum**: Kapalı (0V) / Açık (15V)
- **Ses**: `random.lever` (700Hz, çabuk)
- **Özellikleri**: Küçük çarpışma kutusu (yanlardan geçilebilir)

**Nasıl Çalışır**:

```
LEVER (açılı pozisyon gösterir)
    ↓ sağ tıkla
Aktif Duruma Geçer
    ↓ redstone sinyali yayılır
15 blok yarıçapı içinde
    ↓
LAMP, PISTON, DOOR vb. tepki verir
```

**Kod Örneği**:

```javascript
// Lever Koy ve Yakında Lamp Koy
world.setBlockAt(100, 50, 100, 54); // Lever
world.setBlockAt(105, 50, 100, 55); // Lamp (5 blok uzak)

// Oyuncu Lever'ı Tıklatınca:
// 1. Lever durum değiştirir
// 2. triggerRedstone() çağrılır
// 3. Lamp'ın onRedstoneSignal(world, x, y, z, true) çağrılır
// 4. Lamp açılır
```

---

### 5️⃣ LAMBA (Lamp) - ID: 55

**Amacı**: Redstone tarafından kontrol edilen ışık kaynağı

**Teknik Bilgiler**:
- **Enerji Kaynağı**: Redstone sinyali
- **Işık Seviyeleri**:
  - Kapalı: 0
  - Açık: 15 (maksimum)
- **Ses**: `random.click` (1000Hz, ses etkisi)

**Işık Seviyesi Sistemi**:

```
Level 0:  Tamamen Karanlık
Level 7:  Orta Aydınlık
Level 15: Güneş Gibi Parlak
```

---

### 6️⃣ PISTON (Piston) - ID: 56

**Amacı**: Blokları itme/çekme mekanikli oyunlar

**Teknik Bilgiler**:
- **Sinyal**: Redstone tarafından kontrol
- **İtme Menzili**: 12 blok
- **Ses**: `random.click` (tetikleme sesi)
- **Mekanik**: İterken / Çekerken hareketli animasyon

**Çalışma Şematik**:

```
Normal Durum:
[P] [B] [B] [B]  ← P: Piston, B: Blok

Redstone Sinyali Alındı:
[P→] [B→] [B→] [B→]  ← Pistonlar Genişler

Sinyal Kesildi:
[P] [B] [B] [B]  ← Geri Çekilir
```

**Kullanım Örneği**:

```javascript
// Piston Koy ve Blokları Hazırla
world.setBlockAt(100, 50, 100, 56); // Piston

// Pistonun Üstüne Bloklar
world.setBlockAt(100, 51, 100, 1); // Stone
world.setBlockAt(100, 52, 100, 1);
world.setBlockAt(100, 53, 100, 1);

// Lever ile Tetikle
world.setBlockAt(102, 50, 100, 54); // Lever

// Oyuncu Lever'ı Tıklatınca
// Piston Blokları Yukarıya Iter
```

---

### 7️⃣ HUNISI (Hopper) - ID: 57

**Amacı**: Bloklar Arası Öğe Transferi (Fabrika Sistemi)

**Teknik Bilgiler**:
- **Depolama**: 5 slot
- **Transfer Hızı**: Her 8 tick
- **Hedefler**: Sandık, Hopper, Hunisi
- **Ses**: `random.click` (transfer sesı)

**Otomatik Transfer Sistemi**:

```
Hopper (Kaynak)
    ↓ her 8 tick
Komşu Konteyner (Hedef)
    - Aşağı (Y-1)
    - Yanlar (X±1, Z±1)
    ↓
Öğe Aktarıldı
```

**Sistem Örneği**:

```
        [S]  ← Spawn (Öğe Kaynağı)
         ↓
        [H]  ← Hopper (Alıcı)
         ↓
    [C] [H] [C]  ← Çoğunlu Huniler
         ↓
    [Sandık] [Sandık]  ← Final Depo
```

---

## 💡 Kullanım Örnekleri

### Örnek 1: Basit Sandık Sistemi

```javascript
// Oyun başlatıldıktan sonra:
const minecraft = window.app;
const world = minecraft.world;

// Sandık Ekle
world.setBlockAt(100, 64, 100, 51);
world.setBlockAt(101, 64, 100, 51);
world.setBlockAt(102, 64, 100, 51);

// Oyuncu sağ tıklainca arayüz açılır
// JavaScript:
minecraft.chestInventory; // Açık sandığın envanteri
```

### Örnek 2: Redstone Lambası Devresi

```javascript
// Lever ve Lamp Koy
world.setBlockAt(50, 64, 50, 54);   // Lever
world.setBlockAt(58, 64, 50, 55);   // Lamp (8 blok uzak)
world.setBlockAt(58, 64, 51, 55);   // Başka Lamp
world.setBlockAt(58, 64, 52, 55);   // Başka Lamp

// Oyuncu Lever'ı Tıklatınca Tüm Lamplar Açılır!
```

### Örnek 3: Piston Kopyacı

```javascript
// Blok Kopyalama Makinesi
world.setBlockAt(0, 64, 0, 56);    // Piston (yukarı doğru)
world.setBlockAt(0, 65, 0, 1);     // Stone (kopyalanacak)
world.setBlockAt(0, 64, 1, 54);    // Lever (tetikleyici)

// Lever'ı Tıklatınca:
// 1. Stone Yukarıya İtilir
// 2. Yeni Stone Oluşturulur (Minecraft'ta kopyalanır)
```

---

## ⚡ Redstone Sistemi

### Temel Kurallar

1. **Tetikleyiciler** Redstone Sinyali Üretir
   - Lever → Sinyali Açar/Kapar

2. **Menzil** 15 Blok Yarıçapı
   - Manhattan Distance Kullanılır
   - İtici Duvarlar Sinyali Engelle(mez)

3. **Alıcılar** Sinyale Tepki Verir
   - Lamp → Açılır/Kapanır
   - Piston → Genişler/Çekilir
   - Door → Açılır/Kapanır

### Sinyal Yayılması Mekanizması

```javascript
// Lever tetiklenince:
lever.triggerRedstone(world, x, y, z, minecraft);

// İçinde:
for (let dx = -15; dx <= 15; dx++) {
    for (let dy = -15; dy <= 15; dy++) {
        for (let dz = -15; dz <= 15; dz++) {
            let block = world.getBlockAt(x+dx, y+dy, z+dz);
            if (block && block.onRedstoneSignal) {
                block.onRedstoneSignal(world, x+dx, y+dy, z+dz, true, minecraft);
            }
        }
    }
}
```

---

## 🔊 Ses Sistemi

### Programatik Ses Oluşturma

Gerçek Ses Dosyası Olmadığında:

```javascript
// SoundManager.generateChestSound()
for (let i = 0; i < sampleLength; i++) {
    let t = i / sampleRate;
    let freq = 400; // Hz (frekans)
    let envelope = Math.exp(-t * 10); // Hızlı Azalma
    data[i] = Math.sin(2 * Math.PI * freq * t) * 0.3 * envelope;
}
```

### Ses Dosya Yapısı

```
src/resources/sound/
├── random/
│   ├── chestopen1.ogg (Sandık Açma)
│   ├── chestclosed1.ogg (Sandık Kapama)
│   ├── door_open1.ogg (Kapı Açma)
│   ├── door_close1.ogg (Kapı Kapama)
│   ├── trapdoor_open1.ogg (Tuzak Kapı Açma)
│   ├── trapdoor_close1.ogg (Tuzak Kapı Kapama)
│   ├── lever1.ogg (Alet Tetikleme)
│   └── click1.ogg (Tıklama Sesi)
└── step/
    └── (Adım Sesleri)
```

---

## ❓ Sık Sorulan Sorular

### S: Ses Dosyaları Nereye Konulur?

**C**: `src/resources/sound/random/` dizinine `.ogg` formatında konulur.

Dosya Adlandırması:
```
random.chestopen → chestopen1.ogg
random.door_open → door_open1.ogg
```

### S: Blok Durum Haritası Nedir?

**C**: `Map()` yapısı, blokların konumuna göre durumunu depolar:

```javascript
this.opened = new Map(); // "x,y,z" -> true/false
this.powered = new Map(); // "x,y,z" -> true/false

// Kullanım:
let key = `100,50,100`;
this.opened.set(key, true);
this.opened.get(key); // true
```

### S: Yeni Blok Nasıl Eklerim?

**C**: 

1. `src/js/net/minecraft/client/world/block/type/` içinde yeni sınıf oluştur
2. `Block` sınıfından genişlet
3. `onBlockClicked()` veya `onRedstoneSignal()` implement et
4. `BlockRegistry.js` içinde kayıt yap

```javascript
export default class BlockCustom extends Block {
    constructor(id, textureSlotId) {
        super(id, textureSlotId);
    }
    
    onBlockClicked(world, x, y, z, minecraft, face) {
        // İşlevler
        return true;
    }
}
```

### S: Redstone Sinyali Engelleme Mümkün mü?

**C**: Şu anda hayır, tüm bloklar sinyali iletir. Gelecek versionda:
- Redstone Kablosu (yanlar direneç)
- Redstone Röle (tek yön)

### S: Hopper Hızı Ayarlanabilir mi?

**C**: Evet, `BlockHopper.onBlockUpdate()` içinde:

```javascript
if (tick >= 8) { // 8 tick = Transfer
    this.transferItems(...);
    this.updateTick.set(key, 0);
}

// Değiştir:
if (tick >= 16) { // Daha yavaş
if (tick >= 4) { // Daha hızlı
```

### S: Piston Kaç Blok İtebilir?

**C**: Şu anda maksimum 12 blok. `BlockPiston.pushBlocks()`:

```javascript
for (let i = 1; i <= 12; i++) { // Burası Değiştirilebilir
```

---

## 📝 Notlar

- Tüm blok işlevleri **sadece oyun içinde etkindir** (debug Konsolu değil)
- Sesler **Web Audio API** ile programatik oluşturulur
- Durum **sunucu-istemci senkronize değildir** (tek oyuncu için)

## 🚀 Gelecek Planlı Özellikleri

- [ ] Oyuncu GUI (Sandık/Hopper Arayüzü)
- [ ] Redstone Kablosu
- [ ] Komparatör (Mantık Kapıları)
- [ ] Ayaklanı İndeks (Tutarı Koru)
- [ ] Çok Oyunculu Senkronizasyon

---

**Soruların Var mı?** Lütfen GitHub Issues'te bildirin!
