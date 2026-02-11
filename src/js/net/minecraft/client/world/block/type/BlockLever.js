import BoundingBox from "../../../../util/BoundingBox.js";
import Block from "../Block.js";
import BlockRenderType from "../../../../util/BlockRenderType.js";

export default class BlockLever extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

        this.boundingBox = new BoundingBox(0.3125, 0.1875, 0.3125, 0.6875, 0.8125, 0.6875);

        // Sound
        this.sound = Block.sounds.wood;

        this.activated = new Map(); // Store activated state
    }

    getRenderType() {
        return BlockRenderType.BLOCK;
    }

    canInteract() {
        return true;
    }

    onBlockClicked(world, x, y, z, minecraft) {
        let key = `${x},${y},${z}`;
        let isActivated = this.activated.get(key) || false;

        if (!isActivated) {
            // Activate lever
            this.activated.set(key, true);
            
            // Play activate sound
            minecraft.soundManager?.playSound("random.lever", x, y, z, 0.3, 1.0);

            // Trigger nearby redstone mechanisms
            this.triggerRedstone(world, x, y, z, minecraft);
        } else {
            // Deactivate lever
            this.activated.set(key, false);
            
            // Play deactivate sound
            minecraft.soundManager?.playSound("random.lever", x, y, z, 0.3, 1.0);

            // Reset nearby redstone mechanisms
            this.resetRedstone(world, x, y, z, minecraft);
        }

        return true;
    }

    triggerRedstone(world, x, y, z, minecraft) {
        // Trigger redstone signals to nearby blocks
        // This could trigger pistons, doors, lamps, etc.
        let radius = 15; // Redstone signal radius

        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dz = -radius; dz <= radius; dz++) {
                    let checkX = x + dx;
                    let checkY = y + dy;
                    let checkZ = z + dz;

                    let blockId = world.getBlockAt(checkX, checkY, checkZ);
                    let block = Block.getById(blockId);

                    // Check if block responds to redstone
                    if (block && block.onRedstoneSignal) {
                        block.onRedstoneSignal(world, checkX, checkY, checkZ, true, minecraft);
                    }
                }
            }
        }
    }

    resetRedstone(world, x, y, z, minecraft) {
        let radius = 15;

        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dz = -radius; dz <= radius; dz++) {
                    let checkX = x + dx;
                    let checkY = y + dy;
                    let checkZ = z + dz;

                    let blockId = world.getBlockAt(checkX, checkY, checkZ);
                    let block = Block.getById(blockId);

                    if (block && block.onRedstoneSignal) {
                        block.onRedstoneSignal(world, checkX, checkY, checkZ, false, minecraft);
                    }
                }
            }
        }
    }

    getTextureForFace(face) {
        return this.textureSlotId;
    }

    getLightValue() {
        return 0;
    }

    isSolid() {
        return false;
    }

    getOpacity() {
        return 0.0;
    }
}
