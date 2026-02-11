#!/usr/bin/env python3
"""
Minecraft Blok Otomatik Oluşturucu
Tüm texture dosyalarından blok sınıfları oluşturur
"""

import os
import subprocess

# Blok textureları dizini
BLOCK_DIR = "/workspaces/minecraft/src/resources/textures/block/"
OUTPUT_DIR = "/workspaces/minecraft/src/js/net/minecraft/client/world/block/type/"

# Özel bloklar (zaten oluşturulmuş)
SPECIAL_BLOCKS = {
    "chest": "BlockChest",
    "door": "BlockDoor",
    "trapdoor": "BlockTrapdoor", 
    "lever": "BlockLever",
    "lamp": "BlockLamp",
    "piston": "BlockPiston",
    "hopper": "BlockHopper",
    "stone": "BlockStone",
    "grass": "BlockGrass",
    "dirt": "BlockDirt",
    "log": "BlockLog",
    "leaves": "BlockLeave",
    "water": "BlockWater",
    "sand": "BlockSand",
    "torch": "BlockTorch",
    "wood": "BlockWood",
    "bedrock": "BlockBedrock",
    "glass": "BlockGlass",
    "gravel": "BlockGravel",
    "cobblestone": "BlockCobblestone",
    "iron_ore": "BlockIronOre"
}

def get_texture_files():
    """Tüm PNG texture dosyalarını al"""
    files = []
    for f in os.listdir(BLOCK_DIR):
        if f.endswith(".png") and not f.endswith(".mcmeta"):
            texture_name = f.replace(".png", "")
            files.append(texture_name)
    return sorted(set(files))

def is_special_block(name):
    """Bloğun özel olup olmadığını kontrol et"""
    for key in SPECIAL_BLOCKS:
        if key in name.lower():
            return True
    return False

def generate_block_template(texture_name, block_id):
    """Blok template'i oluştur"""
    
    class_name = "Block" + "".join(word.capitalize() for word in texture_name.split("_"))
    
    template = f'''import Block from "../Block.js";

export default class {class_name} extends Block {{

    constructor(id, textureSlotId) {{
        super(id, textureSlotId);

        // Ses ayarları
        this.sound = Block.sounds.stone; // İhtiyaca göre değiştir

        this.boundingBox = {{
            minX: 0.0, minY: 0.0, minZ: 0.0,
            maxX: 1.0, maxY: 1.0, maxZ: 1.0
        }};
    }}

    getRenderType() {{
        return BlockRenderType.BLOCK;
    }}

    getTextureForFace(face) {{
        return this.textureSlotId;
    }}

    getLightValue() {{
        return 0;
    }}

    isSolid() {{
        return true;
    }}

    getOpacity() {{
        return 1.0;
    }}

    canInteract() {{
        return false;
    }}
}}
'''
    
    return class_name, template

# Tüm textureları al
textures = get_texture_files()

print(f"✅ Toplam {len(textures)} blok texture bulundu")

# İstatistikler
special_count = 0
new_count = 0
excluded_count = 0

# Özel blokları filtrele
new_blocks = []
for texture in textures:
    if is_special_block(texture):
        special_count += 1
    elif any(x in texture.lower() for x in ["door", "trapdoor", "button", "pane", "glass", "slab", "stairs", "wall", "fence", "gate", "hanging_sign", "sign", "rail", "chain", "powder", "stained", "stem", "candle", "cauldron", "campfire"]):
        excluded_count += 1
    else:
        new_blocks.append(texture)
        new_count += 1

print(f"\n📊 İstatistikler:")
print(f"   - Özel Bloklar: {special_count}")
print(f"   - Yeni Bloklar: {new_count}")
print(f"   - Hariç Tutulanlar: {excluded_count}")

# İlk 50 yeni blok listesi
print(f"\n🆕 İlk 50 Yeni Blok:")
for i, block in enumerate(new_blocks[:50], 1):
    print(f"   {i}. {block}")

print(f"\n✅ Blok listesi hazır!")
