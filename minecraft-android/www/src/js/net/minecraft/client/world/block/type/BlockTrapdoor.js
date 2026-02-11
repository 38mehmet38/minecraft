import BoundingBox from "../../../../util/BoundingBox.js";
import Block from "../Block.js";
import BlockRenderType from "../../../../util/BlockRenderType.js";

export default class BlockTrapdoor extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

        this.boundingBox = new BoundingBox(0.0, 0.0, 0.0, 1.0, 0.1875, 1.0);

        // Sound
        this.sound = Block.sounds.wood;

        this.opened = new Map(); // Store opened state
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
            // Open trapdoor
            this.opened.set(key, true);
            
            // Play open sound
            minecraft.soundManager?.playSound("random.trapdoor_open", x, y, z, 0.5, 1.0);

            // Update bounding box
            this.boundingBox = new BoundingBox(0.0, 0.0, 0.0, 1.0, 1.0, 0.1875);
        } else {
            // Close trapdoor
            this.opened.set(key, false);
            
            // Play close sound
            minecraft.soundManager?.playSound("random.trapdoor_close", x, y, z, 0.5, 1.0);

            // Reset bounding box
            this.boundingBox = new BoundingBox(0.0, 0.0, 0.0, 1.0, 0.1875, 1.0);
        }

        return true;
    }

    getTextureForFace(face) {
        return this.textureSlotId;
    }

    getLightValue() {
        return 0;
    }

    isSolid() {
        return true;
    }

    getOpacity() {
        return 0.0;
    }
}
