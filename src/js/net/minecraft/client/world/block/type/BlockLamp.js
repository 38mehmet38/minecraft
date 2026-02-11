import BoundingBox from "../../../../util/BoundingBox.js";
import Block from "../Block.js";
import BlockRenderType from "../../../../util/BlockRenderType.js";

export default class BlockLamp extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

        this.boundingBox = new BoundingBox(0.0, 0.0, 0.0, 1.0, 1.0, 1.0);

        // Sound
        this.sound = Block.sounds.glass;

        this.powered = new Map(); // Store powered state
    }

    getRenderType() {
        return BlockRenderType.BLOCK;
    }

    canInteract() {
        return false; // Lamps are powered by redstone
    }

    onRedstoneSignal(world, x, y, z, powered, minecraft) {
        let key = `${x},${y},${z}`;
        let wasPowered = this.powered.get(key) || false;

        if (powered && !wasPowered) {
            // Lamp turns on
            this.powered.set(key, true);
            
            // Play power on sound
            minecraft.soundManager?.playSound("random.click", x, y, z, 0.3, 1.0);

            // Update light level
            this.updateLighting(world, x, y, z, minecraft);
        } else if (!powered && wasPowered) {
            // Lamp turns off
            this.powered.set(key, false);
            
            // Play power off sound
            minecraft.soundManager?.playSound("random.click", x, y, z, 0.3, 0.7);

            // Reset lighting
            this.updateLighting(world, x, y, z, minecraft);
        }
    }

    updateLighting(world, x, y, z, minecraft) {
        let key = `${x},${y},${z}`;
        let isPowered = this.powered.get(key) || false;

        if (isPowered) {
            this.lightValue = 15; // Maximum light level
        } else {
            this.lightValue = 0; // No light
        }

        // Trigger world renderer update
        if (minecraft.worldRenderer) {
            minecraft.worldRenderer.updateChunk(Math.floor(x / 16), Math.floor(y / 16), Math.floor(z / 16));
        }
    }

    getLightValue() {
        return this.lightValue || 0;
    }

    isSolid() {
        return true;
    }

    getOpacity() {
        return 1.0;
    }

    getTextureForFace(face) {
        return this.textureSlotId;
    }
}
