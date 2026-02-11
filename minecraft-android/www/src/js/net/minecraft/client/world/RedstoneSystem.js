/**
 * Redstone Sistemi - İnteraktif Blok Komponentler
 * 
 * Bu sistem Minecraft'taki redstone mekanikleri simule eder.
 * Leverler ve diğer tetikleyiciler sinyali yayar, 
 * ve lampa, pistonlar vb. buna yanıt verir.
 */

export class RedstoneSystem {
    
    constructor(minecraft) {
        this.minecraft = minecraft;
        this.redstoneNetwork = new Map(); // Network registry
        this.updateQueue = [];
        this.powered = new Map(); // Track powered blocks
    }

    /**
     * Redstone sinyalini yayar
     */
    broadcastSignal(world, sourceX, sourceY, sourceZ, powered, radius = 15) {
        let updates = [];

        // Sinyal alanında tüm blokları kontrol et
        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dz = -radius; dz <= radius; dz++) {
                    let targetX = sourceX + dx;
                    let targetY = sourceY + dy;
                    let targetZ = sourceZ + dz;

                    let blockId = world.getBlockAt(targetX, targetY, targetZ);
                    let block = require('./Block.js').default.getById(blockId);

                    if (block && block.onRedstoneSignal) {
                        updates.push({
                            block: block,
                            x: targetX,
                            y: targetY,
                            z: targetZ,
                            powered: powered
                        });
                    }
                }
            }
        }

        return updates;
    }

    /**
     * Redstone sinyalini işle
     */
    updateRedstoneState(block, x, y, z, powered, minecraft) {
        if (block.onRedstoneSignal) {
            block.onRedstoneSignal(minecraft.world, x, y, z, powered, minecraft);
        }
    }

    /**
     * Redstone ağını güncelle
     */
    updateNetwork() {
        while (this.updateQueue.length > 0) {
            let update = this.updateQueue.shift();
            this.updateRedstoneState(
                update.block,
                update.x,
                update.y,
                update.z,
                update.powered,
                this.minecraft
            );
        }
    }

    /**
     * Sinyal uzaklığını hesapla
     */
    calculateSignalDistance(source, target) {
        let dx = Math.abs(source.x - target.x);
        let dy = Math.abs(source.y - target.y);
        let dz = Math.abs(source.z - target.z);

        return dx + dy + dz; // Manhattan distance
    }

    /**
     * Sinyal geçerse kontrol et (redstone erken seviye)
     */
    canSignalPass(world, fromX, fromY, fromZ, toX, toY, toZ) {
        // Basit kontrol - engelli olmayan bloklar sinyali iletir
        let blockId = world.getBlockAt(toX, toY, toZ);
        
        // Redstone, lever, lamp vb. sinyali iletir
        let conductiveBlocks = [50, 51, 52, 53, 54, 55, 56, 57];
        
        return blockId === 0 || conductiveBlocks.includes(blockId);
    }
}

export default RedstoneSystem;
