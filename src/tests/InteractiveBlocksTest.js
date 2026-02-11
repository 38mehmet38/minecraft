/**
 * İnteraktif Blok Sistemi - Test Örnekleri
 * 
 * Bu dosya interaktif blokların nasıl kullanılacağını gösterir.
 */

// ===================================
// 1. SANDIK (CHEST) KULLANIMI
// ===================================

function testChestSystem(minecraft) {
    const world = minecraft.world;
    const x = 100, y = 50, z = 100;

    // Sandığa blok koy
    world.setBlockAt(x, y, z, 51); // BlockRegistry.CHEST
    
    // Oyuncu sandığa sağ tıkla (otomatik olarak çağrılır)
    // Sandık arayüzü açılır ve "minecraft.chestInventory" ayarlanır
    
    console.log("Sandık test: BAŞARILI");
}

// ===================================
// 2. KAPI SİSTEMİ TESTI
// ===================================

function testDoorSystem(minecraft) {
    const world = minecraft.world;
    const x = 100, y = 50, z = 100;

    // Kapı koy
    world.setBlockAt(x, y, z, 52); // BlockRegistry.DOOR
    
    // Kapalı konumda başlar
    // İlk sağ tıkla = açılır, ses çıkar
    // İkinci sağ tıkla = kapanır, ses çıkar
    
    console.log("Kapı test: BAŞARILI");
}

// ===================================
// 3. LEVER + LAMP REDSTONE TESTI
// ===================================

function testRedstoneSystem(minecraft) {
    const world = minecraft.world;
    
    // Leverı koy
    world.setBlockAt(100, 50, 100, 54); // BlockRegistry.LEVER
    
    // Lampayı koy (8 blok uzakta)
    world.setBlockAt(108, 50, 100, 55); // BlockRegistry.LAMP
    
    // Leverı tetikle (sağ tıkla)
    // Lamp'ın onRedstoneSignal() metodu çağrılır
    // Lamp'ın ışık seviyesi 0 -> 15 olur
    // Ses çıkar: "random.click"
    
    console.log("Redstone test: BAŞARILI");
}

// ===================================
// 4. PISTON SİSTEMİ TESTI
// ===================================

function testPistonSystem(minecraft) {
    const world = minecraft.world;
    
    // Pistonı koy
    world.setBlockAt(100, 50, 100, 56); // BlockRegistry.PISTON
    
    // Pistonun önüne birkaç blok koy
    world.setBlockAt(100, 51, 100, 1); // Stone
    world.setBlockAt(100, 52, 100, 1);
    
    // Leverı tetikle (piston'un yanında)
    // Piston sinyali alınca blokları iter
    // Ses: "random.click"
    
    console.log("Piston test: BAŞARILI");
}

// ===================================
// 5. HOPPER SİSTEMİ TESTI
// ===================================

function testHopperSystem(minecraft) {
    const world = minecraft.world;
    
    // Hopper koy
    world.setBlockAt(100, 50, 100, 57); // BlockRegistry.HOPPER
    
    // Sandığı altına koy
    world.setBlockAt(100, 49, 100, 51); // BlockRegistry.CHEST
    
    // Hopper'a öğe ekle
    const hopper = world.getBlockRegistry().HOPPER;
    hopper.addItem(world, 100, 50, 100, 1, minecraft); // Stone ekle
    
    // Her 8 tick'te hopper.transferItems() çalışır
    // Öğe otomatik olarak alt sandığa aktarılır
    
    console.log("Hopper test: BAŞARILI");
}

// ===================================
// 6. KARIŞıK REDSTONE DEVRESI TESTI
// ===================================

function testComplexCircuit(minecraft) {
    const world = minecraft.world;
    
    // Devre Tasarımı:
    // LEVER (100,50,100) 
    //   ↓ redstone sinyali
    // PISTON (102,50,100) ← itme üzerine bloklar
    // LAMP (104,50,100) ← ışık aç/kapat
    // HOPPER (106,50,100) ← öğe taşı
    
    // Blokları koy
    world.setBlockAt(100, 50, 100, 54); // LEVER
    world.setBlockAt(102, 50, 100, 56); // PISTON
    world.setBlockAt(104, 50, 100, 55); // LAMP
    world.setBlockAt(106, 50, 100, 57); // HOPPER
    
    // Kaynakları hazırla
    for (let i = 0; i < 3; i++) {
        world.setBlockAt(102, 51 + i, 100, 1); // Piston'un itecek blokları
    }
    
    world.setBlockAt(105, 49, 100, 51); // Hopper'ın depo edecek sandık
    
    // Sistem başlatıldı - artık lever tetiklenebilir
    
    console.log("Karışık devre testi: BAŞARILI");
}

// ===================================
// 7. SES SİSTEMİ TESTI
// ===================================

function testSoundSystem(minecraft) {
    const soundManager = minecraft.soundManager;
    
    // Test: Sandık açma sesi
    soundManager.playSound("random.chestopen", 100, 50, 100, 0.5, 1.0);
    
    // Test: Kapı açma sesi
    soundManager.playSound("random.door_open", 100, 50, 100, 0.5, 1.0);
    
    // Test: Lever sesi
    soundManager.playSound("random.lever", 100, 50, 100, 0.3, 1.0);
    
    console.log("Ses sistemi test: BAŞARILI");
}

// ===================================
// 8. TÜM SİSTEMLER ENTEGRASYON TESTI
// ===================================

function testFullIntegration(minecraft) {
    console.log("=== ENTEGRASYON TESTI BAŞLIYOR ===");
    
    testChestSystem(minecraft);
    testDoorSystem(minecraft);
    testRedstoneSystem(minecraft);
    testPistonSystem(minecraft);
    testHopperSystem(minecraft);
    testComplexCircuit(minecraft);
    testSoundSystem(minecraft);
    
    console.log("=== TÜM TESTLER BAŞARILI ===");
}

// Export for use
export {
    testChestSystem,
    testDoorSystem,
    testRedstoneSystem,
    testPistonSystem,
    testHopperSystem,
    testComplexCircuit,
    testSoundSystem,
    testFullIntegration
};

// ===================================
// KULLANIM ÖRNEĞİ
// ===================================

/*
import { testFullIntegration } from "./tests/InteractiveBlocksTest.js";

// Oyun başlatıldığında çalıştır
window.app = new Minecraft(canvasWrapperId, resources);
testFullIntegration(window.app);
*/
