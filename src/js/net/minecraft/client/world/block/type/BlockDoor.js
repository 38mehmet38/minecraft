import BoundingBox from "../../../../util/BoundingBox.js";
import Block from "../Block.js";
import EnumBlockFace from "../../../../util/EnumBlockFace.js";
import BlockRenderType from "../../../../util/BlockRenderType.js";

export default class BlockDoor extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

        this.boundingBox = new BoundingBox(0.0, 0.0, 0.8125, 1.0, 1.0, 1.0);

        // Sound
        this.sound = Block.sounds.wood;

        this.opened = new Map(); // Store opened state: "x,y,z" -> true/false
        this.openedFace = new Map(); // Store which face door opens towards
    }

    getRenderType() {
        return BlockRenderType.BLOCK;
    }

    canInteract() {
        return true;
    }

    onBlockClicked(world, x, y, z, minecraft, face) {
        let key = `${x},${y},${z}`;
        let isOpened = this.opened.get(key) || false;

        if (!isOpened) {
            // Open door
            this.opened.set(key, true);
            this.openedFace.set(key, face || EnumBlockFace.SOUTH);

            // Play open sound
            minecraft.soundManager?.playSound("random.door_open", x, y, z, 0.5, 1.0);

            // Update bounding box
            this.updateBoundingBox(true, face);

            // Add door open event
            if (minecraft.particleRenderer) {
                this.createDoorParticles(minecraft, x, y, z);
            }
        } else {
            // Close door
            this.opened.set(key, false);
            
            // Play close sound
            minecraft.soundManager?.playSound("random.door_close", x, y, z, 0.5, 1.0);

            // Update bounding box
            this.updateBoundingBox(false, face);
        }

        return true;
    }

    updateBoundingBox(isOpen, face) {
        if (isOpen) {
            // Open door: reduces collision box
            switch (face) {
                case EnumBlockFace.NORTH:
                    this.boundingBox = new BoundingBox(0.0, 0.0, 0.0, 1.0, 1.0, 0.1875);
                    break;
                case EnumBlockFace.SOUTH:
                    this.boundingBox = new BoundingBox(0.0, 0.0, 0.8125, 1.0, 1.0, 1.0);
                    break;
                case EnumBlockFace.WEST:
                    this.boundingBox = new BoundingBox(0.0, 0.0, 0.0, 0.1875, 1.0, 1.0);
                    break;
                case EnumBlockFace.EAST:
                    this.boundingBox = new BoundingBox(0.8125, 0.0, 0.0, 1.0, 1.0, 1.0);
                    break;
            }
        } else {
            // Closed door: full collision box
            this.boundingBox = new BoundingBox(0.0, 0.0, 0.8125, 1.0, 1.0, 1.0);
        }
    }

    createDoorParticles(minecraft, x, y, z) {
        // Create door opening particles
        let particleManager = minecraft.particleRenderer;
        if (particleManager) {
            for (let i = 0; i < 5; i++) {
                let px = x + Math.random();
                let py = y + Math.random();
                let pz = z + Math.random();
                // Particle effect on door opening
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
        return true;
    }

    getOpacity() {
        return 0.5;
    }
}
