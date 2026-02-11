# Minecraft JavaScript Projesi - İnteraktif Blok Sistemi

## Genel Bakış

Bu Minecraft klonu projesi JavaScript'te yazılan kapsamlı bir interaktif blok sistemi içerir. Bloklar, oyuncunun sağ tıklamasıyla etkileşime girebilir ve fiziksel mekanikler simule edebilir.

## İnteraktif Bloklar

### 1. Sandık (Chest) - ID: 51
- **İşlev**: Öğeleri depolama
- **Etkileşim**: Sağ tıkla
- **Ses**: `random.chestopen`, `random.chestclosed`
- **Kutu Boyutu**: 27 slot (3x9)
- **Nasıl Çalışır**: 
  - Tıklandığında sandık arayüzü açılır
  - Oyuncu öğeleri sandığa ekleyebilir/çıkarabilir
  - Kapanırken ses çıkarır

```javascript
// Örnek kullanım
let chest = BlockRegistry.CHEST;
chest.onBlockClicked(world, x, y, z, minecraft);
```

### 2. Kapı (Door) - ID: 52
- **İşlev**: Geçiş engelleme
- **Etkileşim**: Sağ tıkla
- **Ses**: `random.door_open`, `random.door_close`
- **Durum**: Açık/Kapalı
- **Nasıl Çalışır**:
  - Kapı açılırken ses yayar
  - Çarpışma kutusu değişir (açık=küçük, kapalı=tam)
  - Sağ tıkla ile aç/kapat

```javascript
let door = BlockRegistry.DOOR;
door.onBlockClicked(world, x, y, z, minecraft, face);
```

### 3. Tuzak Kapı (Trapdoor) - ID: 53
- **İşlev**: Su geçidi veya platform
- **Etkileşim**: Sağ tıkla
- **Ses**: `random.trapdoor_open`, `random.trapdoor_close`
- **Durumlar**: Açık (1 sıra yüksekliğinde) / Kapalı (tam blok)

### 4. Alet (Lever) - ID: 54
- **İşlev**: Redstone sinyalini tetikle
- **Etkileşim**: Sağ tıkla
- **Ses**: `random.lever`
- **Menzil**: 15 blok
- **Nasıl Çalışır**:
  - Tetiklenince redstone sinyali yayar
  - 15 blok yarıçapı içindeki lampları, pistonları vb. etkileyebilir
  - Sinyal kapama/açmayı değiştirir

```javascript
let lever = BlockRegistry.LEVER;
lever.onBlockClicked(world, x, y, z, minecraft);
```

### 5. Lamba (Lamp) - ID: 55
- **İşlev**: Redstone tarafından kontrol edilen ışık
- **Tetikleyici**: Redstone sinyali
- **Ses**: `random.click`
- **Işık Seviyeleri**: 0 (kapalı) veya 15 (açık)
- **Nasıl Çalışır**:
  - Leve'r sinyalini alınca açılır
  - Işık seviyeleri dinamik olarak güncellenir
  - Oyunun aydınlatma sistemini etkileyebilir

```javascript
let lamp = BlockRegistry.LAMP;
lamp.onRedstoneSignal(world, x, y, z, powered, minecraft);
```

### 6. Pistonlar (Piston) - ID: 56
- **İşlev**: Blokları itme/çekme
- **Tetikleyici**: Redstone sinyali
- **Ses**: `random.click`
- **Menzil**: 12 blok
- **Nasıl Çalışır**:
  - Redstone sinyali alınca genişler
  - Önündeki blokları 12 blok uzağa kadar itebilir
  - Sinyal kesilince geriye çekilir ve blokları geri çeker

```javascript
let piston = BlockRegistry.PISTON;
piston.onRedstoneSignal(world, x, y, z, powered, minecraft);
piston.pushBlocks(world, x, y, z, minecraft);
```

### 7. Hunisi (Hopper) - ID: 57
- **İşlev**: Öğeleri aktarma
- **Etkileşim**: Sağ tıkla açılır
- **Ses**: `random.chestopen`
- **Depolama**: 5 slot
- **Nasıl Çalışır**:
  - Komşu konteynerlere (sandık, diğer huniler) öğe taşır
  - Otomatik olarak her 8 tick'te kontrol eder
  - Taşıyıcı şekilde çalışır (fabrika sistemi yapımında kullanılabilir)

```javascript
let hopper = BlockRegistry.HOPPER;
hopper.addItem(world, x, y, z, itemId, minecraft);
hopper.transferItems(world, x, y, z, minecraft);
```

## Redstone Sistemi

### Temel Konsept

Redstone sistemi Minecraft'ın elektrik sistemi gibi çalışır:

1. **Tetikleyiciler** (Lever): Sinyal üretir
2. **Iletkenleri** (Redstone Ore): Sinyal taşır
3. **Alıcılar** (Lamp, Piston, Door): Sinyale yanıt verir

### Sinyal Yayılması

```javascript
// Lever tetiklenince 15 blok yarıçapında sinyal yayılır
lever.triggerRedstone(world, x, y, z, minecraft);

// Tüm yakındaki bloklar güncellenir
world.getBlockAt(x+dx, y+dy, z+dz).onRedstoneSignal(world, x, y, z, powered, minecraft);
```

### Blokilar Arası Etkileşim

```
LEVER (Triggered)
    ↓
    Emits Signal (15 block radius)
    ↓
LAMP, PISTON, DOOR (Powered)
    ↓
    Change State / Animation
```

## Ses Sistemi

### Programatik Ses Oluşturma

Gerçek ses dosyaları olmadığında, sistem Web Audio API kullanarak programatik olarak sesler oluşturur:

```javascript
// SoundManager.js
generateChestSound(data, sampleRate, isOpen) {
    let freq = isOpen ? 400 : 350;
    let duration = isOpen ? 0.2 : 0.15;
    // Sinüs dalga oluştur
    for (let i = 0; i < length; i++) {
        data[i] = Math.sin(2 * Math.PI * freq * t) * envelope;
    }
}
```

### Ses Dosya Yapısı

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
    ├── grass1.ogg
    ├── stone1.ogg
    └── ...
```

## Entegrasyon

### 1. Blok Etkileşimi

Oyuncu sağ tık (button = 2) yaptığında:

```javascript
// Minecraft.js - onMouseClicked()
if (button === 2) {
    let block = Block.getById(blockId);
    
    if (block.canInteract()) {
        block.onBlockClicked(world, x, y, z, minecraft, face);
    }
}
```

### 2. Ses Yönetimi

```javascript
// SoundManager oluşturulduğunda
this.soundManager = new SoundManager();
this.soundManager.create(this.worldRenderer);

// Ses Çalma
this.soundManager.playSound("random.chestopen", x, y, z, 0.5, 1.0);
```

### 3. Blok Kaydı

```javascript
// BlockRegistry.js
BlockRegistry.create() {
    BlockRegistry.CHEST = new BlockChest(51, 15);
    BlockRegistry.LEVER = new BlockLever(54, 18);
    // ...
}
```

## Genişletme Kılavuzu

### Yeni Blok Ekleme

```javascript
// 1. Yeni blok sınıfı oluştur
export default class BlockCustom extends Block {
    constructor(id, textureSlotId) {
        super(id, textureSlotId);
        this.sound = Block.sounds.wood;
    }
    
    onBlockClicked(world, x, y, z, minecraft, face) {
        // Etkileşim mantığı
        minecraft.soundManager?.playSound("random.click", x, y, z, 0.5, 1.0);
        return true;
    }
}

// 2. BlockRegistry'ye ekle
import BlockCustom from "./type/BlockCustom.js";
// ...
BlockRegistry.CUSTOM = new BlockCustom(58, 22);
```

### Özel Redstone Tepkisi

```javascript
onRedstoneSignal(world, x, y, z, powered, minecraft) {
    if (powered) {
        // Sinyal alındığında
    } else {
        // Sinyal kesildiğinde
    }
}
```

## Performans Notları

- Redstone güncellemeleri her frame gerçekleşmez (güncelleme sırası kullanılır)
- Ses dosyaları lazy-load yapılır (ilk kez kullanılırken)
- Blok durumları Map yapısında saklanır (x,y,z anahtarıyla)

## Bilinen Sınırlamalar

1. Redstone sinyali sadece düz yol izler (çetin arazi desteği yok)
2. Piston sadece aynı yönde blok itebilir
3. Hopper sadece aşağıya düşen öğeleri alır
4. Ses dosyaları .ogg formatı olmalıdır

## Gelecek İyileştirmeler

- [ ] Bloklar arası redstone kablosu
- [ ] Komparatör bloğu (karşılaştırma mantığı)
- [ ] Tekrarlayıcı (sinyal gecikme)
- [ ] Hafıza blokları (On/Off koruması)
- [ ] Oyuncu GUI arayüzü (sandık/hopper)
- [ ] Bünün Minecraft yönetim sistemi

## Derleme Komutu

```bash
npm run build
npm run dev  # Geliştirme sunucusu
```

## Lisans

MIT
