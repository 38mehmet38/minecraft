import BoundingBox from "../../../../util/BoundingBox.js";
import Block from "../Block.js";
import BlockRenderType from "../../../../util/BlockRenderType.js";
import EnumBlockFace from "../../../../util/EnumBlockFace.js";

export default class BlockPiston extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

        this.boundingBox = new BoundingBox(0.0, 0.0, 0.0, 1.0, 1.0, 1.0);

        // Sound
        this.sound = Block.sounds.stone;

        this.extended = new Map(); // Store extended state: "x,y,z" -> true/false
        this.direction = new Map(); // Store piston direction
    }

    getRenderType() {
        return BlockRenderType.BLOCK;
    }

    canInteract() {
        return false; // Pistons respond to redstone
    }

    onRedstoneSignal(world, x, y, z, powered, minecraft) {
        let key = `${x},${y},${z}`;
        let wasExtended = this.extended.get(key) || false;

        if (powered && !wasExtended) {
            // Extend piston
            this.extended.set(key, true);
            
            // Play extend sound
            minecraft.soundManager?.playSound("random.click", x, y, z, 0.5, 1.2);

            // Move blocks in front of piston
            this.pushBlocks(world, x, y, z, minecraft);

            // Update animation
            this.updatePistonAnimation(world, x, y, z, minecraft, true);
        } else if (!powered && wasExtended) {
            // Retract piston
            this.extended.set(key, false);
            
            // Play retract sound
            minecraft.soundManager?.playSound("random.click", x, y, z, 0.5, 1.0);

            // Pull blocks back
            this.pullBlocks(world, x, y, z, minecraft);

            // Update animation
            this.updatePistonAnimation(world, x, y, z, minecraft, false);
        }
    }

    pushBlocks(world, x, y, z, minecraft) {
        // Get piston direction
        let direction = this.getPistonDirection();

        // Move blocks forward
        for (let i = 1; i <= 12; i++) {
            let checkX = x + direction.x * i;
            let checkY = y + direction.y * i;
            let checkZ = z + direction.z * i;

            let blockId = world.getBlockAt(checkX, checkY, checkZ);

            if (blockId === 0) {
                // Empty space - place piston head
                // In real Minecraft this would be piston head block
                break;
            } else if (blockId === 7) {
                // Bedrock - piston can't push
                break;
            } else {
                // Move block forward
                let nextX = checkX + direction.x;
                let nextY = checkY + direction.y;
                let nextZ = checkZ + direction.z;

                let nextBlockId = world.getBlockAt(nextX, nextY, nextZ);

                if (nextBlockId === 0) {
                    // Move block
                    world.setBlockAt(nextX, nextY, nextZ, blockId);
                    world.setBlockAt(checkX, checkY, checkZ, 0);
                } else {
                    break;
                }
            }
        }
    }

    pullBlocks(world, x, y, z, minecraft) {
        // Get piston direction
        let direction = this.getPistonDirection();

        // Pull blocks back
        for (let i = 1; i <= 12; i++) {
            let checkX = x + direction.x * i;
            let checkY = y + direction.y * i;
            let checkZ = z + direction.z * i;

            let blockId = world.getBlockAt(checkX, checkY, checkZ);

            if (blockId !== 0 && blockId !== 7) {
                let nextX = checkX - direction.x;
                let nextY = checkY - direction.y;
                let nextZ = checkZ - direction.z;

                let nextBlockId = world.getBlockAt(nextX, nextY, nextZ);

                if (nextBlockId === 0) {
                    world.setBlockAt(nextX, nextY, nextZ, blockId);
                    world.setBlockAt(checkX, checkY, checkZ, 0);
                }
            } else {
                break;
            }
        }
    }

    getPistonDirection() {
        // Default direction facing up
        return { x: 0, y: 1, z: 0 };
    }

    updatePistonAnimation(world, x, y, z, minecraft, isExtending) {
        // Create animation effect
        if (isExtending) {
            // Particle effect for extension
            if (minecraft.particleRenderer) {
                for (let i = 0; i < 3; i++) {
                    let px = x + Math.random();
                    let py = y + Math.random();
                    let pz = z + Math.random();
                    // Particle spawn
                }
            }
        }

        // Trigger world renderer update
        if (minecraft.worldRenderer) {
            minecraft.worldRenderer.flushRebuild = true;
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
        return 1.0;
    }
}
