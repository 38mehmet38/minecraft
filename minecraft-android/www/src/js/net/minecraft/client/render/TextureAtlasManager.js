export class TextureAtlasManager {
    constructor() {
        this.textureCache = new Map();
        this.blockIdToTexture = new Map();
        this.blockNameToId = new Map();
        this.atlasMap = new Map();
    }

    registerBlockTextures() {
        const allBlockTextures = [
            'acacia_door_bottom', 'acacia_door_top', 'acacia_leaves', 'acacia_log', 'acacia_log_top',
            'acacia_planks', 'acacia_sapling', 'acacia_shelf', 'acacia_trapdoor', 'activator_rail',
            'activator_rail_on', 'allium', 'amethyst_block', 'amethyst_cluster', 'ancient_debris_side',
            'ancient_debris_top', 'andesite', 'anvil', 'anvil_top', 'attached_melon_stem',
            'attached_pumpkin_stem', 'azalea_leaves', 'azalea_plant', 'azalea_side', 'azalea_top',
            'azure_bluet', 'bamboo_block', 'bamboo_block_top', 'bamboo_door_bottom', 'bamboo_door_top',
            'bamboo_fence', 'bamboo_fence_gate', 'bamboo_fence_gate_particle', 'bamboo_fence_particle',
            'bamboo_large_leaves', 'bamboo_mosaic', 'bamboo_planks', 'bamboo_shelf', 'bamboo_singleleaf',
            'bamboo_small_leaves', 'bamboo_stage0', 'bamboo_stalk', 'bamboo_trapdoor', 'barrel_bottom',
            'barrel_side', 'barrel_top', 'barrel_top_open', 'basalt_side', 'basalt_top', 'beacon', 'bedrock'
        ];

        allBlockTextures.forEach((blockName, i) => {
            const blockId = i + 1;
            const texturePath = `/src/resources/textures/block/${blockName}.png`;
            
            this.blockIdToTexture.set(blockId, texturePath);
            this.blockNameToId.set(blockName, blockId);
            this.atlasMap.set(blockId, { name: blockName, path: texturePath });
        });

        const oreBlocks = ['coal_ore', 'iron_ore', 'gold_ore', 'diamond_ore', 'emerald_ore'];
        oreBlocks.forEach((block, idx) => {
            const id = 300 + idx;
            const path = `/src/resources/textures/block/${block}.png`;
            this.blockIdToTexture.set(id, path);
            this.blockNameToId.set(block, id);
            this.atlasMap.set(id, { name: block, path: path });
        });

        console.log(`🎨 Doku Atlas: ${this.blockIdToTexture.size} blok kaydedildi`);
    }

    getTexturePath(blockId) {
        return this.blockIdToTexture.get(blockId) || `/src/resources/textures/block/stone.png`;
    }

    getTexturePathByName(blockName) {
        return `/src/resources/textures/block/${blockName}.png`;
    }

    getTextureId(blockName) {
        return this.blockNameToId.get(blockName) || 0;
    }

    isTextureLoaded(blockId) {
        return this.textureCache.has(blockId);
    }

    setTextureCache(blockId, textureData) {
        this.textureCache.set(blockId, textureData);
    }

    getTextureCache(blockId) {
        return this.textureCache.get(blockId);
    }

    async loadAllTextures() {
        const textures = {};
        const promises = [];

        for (const [id, texture] of this.atlasMap) {
            promises.push(new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    textures[texture.path] = img;
                    this.setTextureCache(id, img);
                    resolve();
                };
                img.onerror = () => {
                    console.warn(`Texture yüklenemedi: ${texture.path}`);
                    resolve();
                };
                img.src = texture.path;
            }));
        }

        await Promise.all(promises);
        return textures;
    }

    printRegistry() {
        console.log("\n=== TEXTURE REGISTRY ===");
        for (const [id, texture] of this.atlasMap) {
            console.log(`${id}\t| ${texture.name}\t| ${texture.path}`);
        }
    }
}

export default TextureAtlasManager;
