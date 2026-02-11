/**
 * Genişletilmiş Blok Kaydı Sistemi
 * 
 * Tüm Minecraft blokları dinamik olarak kaydedilir
 */

import Block from "./Block.js";

export class ExtendedBlockRegistry {
    
    /**
     * Tüm blokları başlat
     */
    static initializeAllBlocks(BlockRegistry) {
        // Temel Bloklar (zaten var)
        // ID 1-50 aralığı
        
        // Biom Blokları (100-199)
        ExtendedBlockRegistry.registerBiomBlocks(BlockRegistry);
        
        // Dekoratif Bloklar (200-299)
        ExtendedBlockRegistry.registerDecorativeBlocks(BlockRegistry);
        
        // Ore Blokları (300-399)
        ExtendedBlockRegistry.registerOreBlocks(BlockRegistry);
        
        // Mekanizmal Bloklar (400-499)
        ExtendedBlockRegistry.registerMechanicalBlocks(BlockRegistry);
        
        // Redstone Blokları (500-599)
        ExtendedBlockRegistry.registerRedstoneBlocks(BlockRegistry);
        
        console.log("✅ Tüm bloklar başarıyla kaydedildi (" + ExtendedBlockRegistry.getBlockCount(BlockRegistry) + " blok)");
    }

    /**
     * Biom Blokları
     */
    static registerBiomBlocks(BlockRegistry) {
        
        // Ağaç Blokları
        BlockRegistry.ACACIA_PLANKS = new Block(100, 100);
        BlockRegistry.ACACIA_LEAVES = new Block(101, 101);
        BlockRegistry.ACACIA_LOG = new Block(102, 102);
        
        BlockRegistry.BIRCH_PLANKS = new Block(103, 103);
        BlockRegistry.BIRCH_LEAVES = new Block(104, 104);
        BlockRegistry.BIRCH_LOG = new Block(105, 105);
        
        BlockRegistry.SPRUCE_PLANKS = new Block(106, 106);
        BlockRegistry.SPRUCE_LEAVES = new Block(107, 107);
        BlockRegistry.SPRUCE_LOG = new Block(108, 108);
        
        BlockRegistry.JUNGLE_PLANKS = new Block(109, 109);
        BlockRegistry.JUNGLE_LEAVES = new Block(110, 110);
        BlockRegistry.JUNGLE_LOG = new Block(111, 111);
        
        BlockRegistry.DARK_OAK_PLANKS = new Block(112, 112);
        BlockRegistry.DARK_OAK_LEAVES = new Block(113, 113);
        BlockRegistry.DARK_OAK_LOG = new Block(114, 114);
        
        BlockRegistry.MANGROVE_PLANKS = new Block(115, 115);
        BlockRegistry.MANGROVE_LEAVES = new Block(116, 116);
        BlockRegistry.MANGROVE_LOG = new Block(117, 117);
        
        // Bamboo
        BlockRegistry.BAMBOO_PLANKS = new Block(118, 118);
        BlockRegistry.BAMBOO_BLOCK = new Block(119, 119);
        
        // Toprak Blokları
        BlockRegistry.GRASS_BLOCK = new Block(120, 120);
        BlockRegistry.MYCELIUM = new Block(121, 121);
        BlockRegistry.PODZOL = new Block(122, 122);
        
        // Kum Blokları
        BlockRegistry.RED_SAND = new Block(123, 123);
    }

    /**
     * Dekoratif Bloklar
     */
    static registerDecorativeBlocks(BlockRegistry) {
        
        // Taş Varyasyonları
        BlockRegistry.ANDESITE = new Block(200, 200);
        BlockRegistry.DIORITE = new Block(201, 201);
        BlockRegistry.GRANITE = new Block(202, 202);
        BlockRegistry.CALCITE = new Block(203, 203);
        BlockRegistry.TUFF = new Block(204, 204);
        
        // Brick
        BlockRegistry.BRICK = new Block(205, 205);
        BlockRegistry.STONE_BRICKS = new Block(206, 206);
        BlockRegistry.MOSSY_STONE_BRICKS = new Block(207, 207);
        
        // Prismarine
        BlockRegistry.PRISMARINE = new Block(208, 208);
        BlockRegistry.PRISMARINE_BRICKS = new Block(209, 209);
        BlockRegistry.DARK_PRISMARINE = new Block(210, 210);
        BlockRegistry.SEA_LANTERN = new Block(211, 211);
        
        // End
        BlockRegistry.END_STONE = new Block(212, 212);
        BlockRegistry.END_STONE_BRICKS = new Block(213, 213);
        BlockRegistry.PURPUR_BLOCK = new Block(214, 214);
        
        // Obsidian
        BlockRegistry.OBSIDIAN = new Block(215, 215);
        BlockRegistry.CRYING_OBSIDIAN = new Block(216, 216);
        
        // Nether
        BlockRegistry.NETHERRACK = new Block(217, 217);
        BlockRegistry.NETHER_BRICKS = new Block(218, 218);
        BlockRegistry.RED_NETHER_BRICKS = new Block(219, 219);
        BlockRegistry.SOUL_SAND = new Block(220, 220);
        BlockRegistry.SOUL_SOIL = new Block(221, 221);
        
        // Crimson & Warped
        BlockRegistry.CRIMSON_NYLIUM = new Block(222, 222);
        BlockRegistry.WARPED_NYLIUM = new Block(223, 223);
        BlockRegistry.CRIMSON_WOOD = new Block(224, 224);
        BlockRegistry.WARPED_WOOD = new Block(225, 225);
    }

    /**
     * Ore Blokları
     */
    static registerOreBlocks(BlockRegistry) {
        
        // Standart Ore
        BlockRegistry.COAL_ORE = new Block(300, 300);
        BlockRegistry.DIAMOND_ORE = new Block(301, 301);
        BlockRegistry.EMERALD_ORE = new Block(302, 302);
        BlockRegistry.GOLD_ORE = new Block(303, 303);
        BlockRegistry.LAPIS_ORE = new Block(304, 304);
        BlockRegistry.REDSTONE_ORE = new Block(305, 305);
        BlockRegistry.COPPER_ORE = new Block(306, 306);
        
        // Nether Ore
        BlockRegistry.NETHER_QUARTZ_ORE = new Block(307, 307);
        BlockRegistry.NETHER_GOLD_ORE = new Block(308, 308);
        BlockRegistry.ANCIENT_DEBRIS = new Block(309, 309);
        
        // Deepslate Ore
        BlockRegistry.DEEPSLATE_COAL_ORE = new Block(310, 310);
        BlockRegistry.DEEPSLATE_DIAMOND_ORE = new Block(311, 311);
        BlockRegistry.DEEPSLATE_EMERALD_ORE = new Block(312, 312);
        BlockRegistry.DEEPSLATE_GOLD_ORE = new Block(313, 313);
        BlockRegistry.DEEPSLATE_LAPIS_ORE = new Block(314, 314);
        BlockRegistry.DEEPSLATE_REDSTONE_ORE = new Block(315, 315);
        BlockRegistry.DEEPSLATE_COPPER_ORE = new Block(316, 316);
    }

    /**
     * Mekanik Blokları
     */
    static registerMechanicalBlocks(BlockRegistry) {
        
        // Elektrik Aletleri
        BlockRegistry.DISPENSER = new Block(400, 400);
        BlockRegistry.DROPPER = new Block(401, 401);
        BlockRegistry.FURNACE = new Block(402, 402);
        BlockRegistry.BLAST_FURNACE = new Block(403, 403);
        BlockRegistry.SMOKER = new Block(404, 404);
        
        // Depolama
        BlockRegistry.BARREL = new Block(405, 405);
        BlockRegistry.SHULKER_BOX = new Block(406, 406);
        
        // Crusher/Grinder (Mod blokları)
        BlockRegistry.CRUSHER = new Block(407, 407);
        BlockRegistry.PULVERIZER = new Block(408, 408);
    }

    /**
     * Redstone Blokları
     */
    static registerRedstoneBlocks(BlockRegistry) {
        
        BlockRegistry.REPEATER = new Block(500, 500);
        BlockRegistry.COMPARATOR = new Block(501, 501);
        BlockRegistry.REDSTONE_WIRE = new Block(502, 502);
        BlockRegistry.REDSTONE_BLOCK = new Block(503, 503);
        BlockRegistry.OBSERVER = new Block(504, 504);
    }

    /**
     * Blok sayısını göster
     */
    static getBlockCount(BlockRegistry) {
        let count = 0;
        for (let key in BlockRegistry) {
            if (BlockRegistry[key] && typeof BlockRegistry[key].id === 'number') {
                count++;
            }
        }
        return count;
    }
}

export default ExtendedBlockRegistry;
