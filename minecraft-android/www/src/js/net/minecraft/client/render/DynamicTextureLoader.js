/**
 * Dinamik Texture Yükleyici
 * 
 * Tüm blok ve item texturelarını dinamik olarak yükler
 */

export class DynamicTextureLoader {
    
    constructor() {
        this.loadedTextures = new Map();
        this.textureCache = new Map();
    }

    /**
     * Blok texturelarını yükle
     */
    async loadBlockTextures() {
        console.log("📦 Blok textureları yükleniyor...");

        const blockTextures = [
            // Temel Bloklar
            "stone", "grass_block_top", "dirt", "cobblestone", "oak_planks",
            "oak_log", "oak_leaves", "water_still", "sand", "gravel",
            "bedrock", "glass", "iron_ore", "torch",
            
            // İnteraktif Bloklar
            "chest_front", "oak_door_bottom", "oak_trapdoor", "lever",
            "redstone_lamp_on", "piston_face", "hopper_outside",
            
            // Biom Blokları
            "acacia_planks", "acacia_leaves", "acacia_log",
            "birch_planks", "birch_leaves", "birch_log",
            "spruce_planks", "spruce_leaves", "spruce_log",
            "jungle_planks", "jungle_leaves", "jungle_log",
            "dark_oak_planks", "dark_oak_leaves", "dark_oak_log",
            "mangrove_planks", "mangrove_leaves", "mangrove_log",
            "bamboo_planks", "bamboo_block",
            
            // Dekoratif Bloklar
            "andesite", "diorite", "granite", "calcite", "tuff",
            "brick", "stone_bricks", "mossy_stone_bricks",
            "prismarine", "prismarine_bricks", "dark_prismarine",
            "sea_lantern", "end_stone", "end_stone_bricks",
            "purpur_block", "obsidian", "crying_obsidian",
            "netherrack", "nether_bricks", "red_nether_bricks",
            "soul_sand", "soul_soil", "crimson_nylium",
            "warped_nylium", "crimson_wood", "warped_wood",
            
            // Ore Blokları
            "coal_ore", "diamond_ore", "emerald_ore", "gold_ore",
            "lapis_ore", "redstone_ore", "copper_ore", "nether_quartz_ore",
            "nether_gold_ore", "ancient_debris", "deepslate_coal_ore",
            
            // Mekanik Blokları
            "furnace_front", "blast_furnace_front", "hopper_outside",
            "dispenser_front", "dropper_front"
        ];

        for (const textureName of blockTextures) {
            await this.loadTexture(`block/${textureName}`);
        }

        console.log(`✅ ${this.loadedTextures.size} blok texture yüklendi`);
        return this.loadedTextures;
    }

    /**
     * Item texturelarını yükle
     */
    async loadItemTextures() {
        console.log("📦 Item textureları yükleniyor...");

        const itemTextures = [
            "diamond", "iron_ingot", "gold_ingot", "emerald",
            "stone", "dirt", "grass_block", "oak_log", "oak_planks",
            "chest", "door", "trapdoor", "lever", "redstone",
            "crafting_table", "furnace", "beacon", "hopper"
        ];

        for (const textureName of itemTextures) {
            await this.loadTexture(`item/${textureName}`);
        }

        console.log(`✅ ${this.loadedTextures.size} item texture yüklendi`);
        return this.loadedTextures;
    }

    /**
     * Tekil texture yükle
     */
    async loadTexture(path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const fullPath = `src/resources/textures/${path}.png`;
            
            img.onload = () => {
                this.loadedTextures.set(path, img);
                resolve(img);
            };
            
            img.onerror = () => {
                console.warn(`⚠️  Texture yüklenemedi: ${fullPath}`);
                resolve(null);
            };
            
            img.src = fullPath;
        });
    }

    /**
     * Tüm textureları yükle
     */
    async loadAllTextures() {
        console.log("🎨 Tüm Minecraft textureları yükleniyor...\n");

        try {
            await this.loadBlockTextures();
            await this.loadItemTextures();

            console.log("\n✨ Texture yükleme tamamlandı!");
            console.log(`📊 Toplam ${this.loadedTextures.size} texture yüklendi\n`);

            return this.loadedTextures;
        } catch (error) {
            console.error("❌ Texture yükleme hatası:", error);
            throw error;
        }
    }

    /**
     * Texture al
     */
    getTexture(path) {
        return this.loadedTextures.get(path) || null;
    }

    /**
     * Yüklü textureları göster
     */
    printLoadedTextures() {
        console.log("\n=== YÜKLÜ TEXTURELER ===");
        let count = 0;
        
        for (const [path, img] of this.loadedTextures) {
            console.log(`${count + 1}. ${path} (${img.width}x${img.height})`);
            count++;
            if (count >= 50) {
                console.log(`... ve ${this.loadedTextures.size - 50} daha`);
                break;
            }
        }
    }
}

export default DynamicTextureLoader;
