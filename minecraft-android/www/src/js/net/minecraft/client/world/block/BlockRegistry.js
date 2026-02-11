import Block from "./Block.js";
import CompleteBlockRegistry from "./CompleteBlockRegistry.js";

// İnteraktif bloklar (sadece bunlar custom sınıflar)
import BlockChest from "./type/BlockChest.js";
import BlockDoor from "./type/BlockDoor.js";
import BlockTrapdoor from "./type/BlockTrapdoor.js";
import BlockLever from "./type/BlockLever.js";
import BlockLamp from "./type/BlockLamp.js";
import BlockPiston from "./type/BlockPiston.js";
import BlockHopper from "./type/BlockHopper.js";

export class BlockRegistry {

    static create() {
        // TÜMÜ orijinal Minecraft bloklarını yükle (1,111 blok)
        CompleteBlockRegistry.initializeAllBlocks(BlockRegistry);
        
        // İnteraktif blokları üzerine yaz (özel işlevler için)
        BlockRegistry.CHEST = new BlockChest(1, 1);           // Sandık
        BlockRegistry.DOOR = new BlockDoor(2, 2);             // Kapı
        BlockRegistry.TRAPDOOR = new BlockTrapdoor(3, 3);     // Işık geçidi
        BlockRegistry.LEVER = new BlockLever(4, 4);           // Kaldıraç
        BlockRegistry.LAMP = new BlockLamp(5, 5);             // Lamba
        BlockRegistry.PISTON = new BlockPiston(6, 6);         // Piston
        BlockRegistry.HOPPER = new BlockHopper(7, 7);         // Hopper
        
        console.log(`✅ BlockRegistry başlatıldı: ${CompleteBlockRegistry.getBlockCount()} blok yüklendi`);
    }
}