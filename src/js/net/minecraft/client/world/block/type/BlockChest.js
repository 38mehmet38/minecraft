import BoundingBox from "../../../../util/BoundingBox.js";
import Block from "../Block.js";
import BlockRenderType from "../../../../util/BlockRenderType.js";

export default class BlockChest extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

        this.boundingBox = new BoundingBox(0.0625, 0.0, 0.0625, 0.9375, 0.875, 0.9375);

        // Sound
        this.sound = Block.sounds.wood;

        this.opened = new Map(); // Store opened state: "x,y,z" -> true/false
    }

    getRenderType() {
        return BlockRenderType.BLOCK;
    }

    canInteract() {
        return true;
    }

    onBlockClicked(world, x, y, z, minecraft) {
        let key = `${x},${y},${z}`;
        let isOpened = this.opened.get(key) || false;

        if (!isOpened) {
            // Open chest
            this.opened.set(key, true);
            
            // Play open sound
            minecraft.soundManager?.playSound("random.chestopen", x, y, z, 0.5, 1.0);
            
            // Open chest inventory GUI
            this.openChestInventory(minecraft);
        } else {
            // Close chest
            this.opened.set(key, false);
            
            // Play close sound
            minecraft.soundManager?.playSound("random.chestclosed", x, y, z, 0.5, 1.0);
        }

        return true;
    }

    openChestInventory(minecraft) {
        // Create chest inventory with 27 slots (3x9)
        let inventory = [];
        for (let i = 0; i < 27; i++) {
            inventory.push(0); // Empty slots
        }

        // Store in minecraft for GUI display
        minecraft.chestInventory = inventory;
        minecraft.chestOpen = true;

        // Trigger GUI update if needed
        if (minecraft.ingameOverlay) {
            minecraft.ingameOverlay.updateChestDisplay(inventory);
        }
    }

    closeChestInventory(minecraft) {
        minecraft.chestOpen = false;
        minecraft.chestInventory = null;
    }

    getTextureForFace(face) {
        // Different texture for front of chest
        return this.textureSlotId;
    }

    getLightValue() {
        return 0;
    }

    isSolid() {
        return true;
    }

    getOpacity() {
        return 1.0;
    }
}
