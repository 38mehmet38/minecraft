#!/usr/bin/env python3
"""
Tüm Minecraft bloklarını otomatik olarak oluştur
1,111+ blok dokusu için tanımlar oluşturur
"""

import os
import json

# Blok texture klasörü
block_dir = "/workspaces/minecraft/src/resources/textures/block/"

# Tüm benzersiz blok adlarını al
blocks = set()
for file in os.listdir(block_dir):
    if file.endswith(".png") and not file.endswith(".mcmeta"):
        block_name = file.replace(".png", "")
        blocks.add(block_name)

# Blokları sırala
blocks = sorted(list(blocks))

print(f"📊 Toplam {len(blocks)} benzersiz blok bulundu")
print(f"\n✅ Blok Listesi (İlk 50):")
for i, block in enumerate(blocks[:50]):
    print(f"{i+1}. {block}")

# JavaScript code oluştur
js_code = """import Block from "./Block.js";

/**
 * Tüm Minecraft Bloklarını Dinamik Yükleme Sistemi
 * 1,111+ orijinal Minecraft bloğu
 */
export class CompleteBlockRegistry {
    /**
     * Tüm blokları kaydet
     */
    static initializeAllBlocks(BlockRegistry) {
        const blocks = {
"""

# Blok ID'lerini ata
for i, block_name in enumerate(blocks, start=1):
    block_id = i
    texture_id = i
    
    # Camel case'e dönüştür
    camel_case = block_name
    camel_case = camel_case.replace('_', ' ').title().replace(' ', '')
    
    # UPPER_CASE'e dönüştür
    upper_case = block_name.upper()
    
    js_code += f'            "{upper_case}": new Block({block_id}, {texture_id}),\n'
    
    if i % 100 == 0:
        print(f"📈 {i} blok işlendi...")

js_code += """        };
        
        // BlockRegistry'ye ekle
        Object.entries(blocks).forEach(([name, block]) => {
            BlockRegistry[name] = block;
        });
        
        console.log(`✅ ${Object.keys(blocks).length} blok başarıyla kaydedildi`);
        return BlockRegistry;
    }
    
    /**
     * Blok sayısını al
     */
    static getBlockCount() {
        return """ + str(len(blocks)) + """;
    }
}

export default CompleteBlockRegistry;
"""

# JavaScript dosyasını kaydet
output_file = "/workspaces/minecraft/src/js/net/minecraft/client/world/block/CompleteBlockRegistry.js"
with open(output_file, 'w') as f:
    f.write(js_code)

print(f"\n✅ Blok tanımları kaydedildi: {output_file}")
print(f"📄 Satır sayısı: {len(js_code.split(chr(10)))}")
print(f"🧱 Toplam blok: {len(blocks)}")

# JSON format bloklarını kaydet (referans için)
with open("/workspaces/minecraft/scripts/all_blocks.json", 'w') as f:
    json.dump({
        "total": len(blocks),
        "blocks": blocks
    }, f, indent=2)

print(f"✅ JSON referansı kaydedildi: /workspaces/minecraft/scripts/all_blocks.json")
