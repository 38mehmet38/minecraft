import BoundingBox from "../../../../util/BoundingBox.js";
import Block from "../Block.js";
import BlockRenderType from "../../../../util/BlockRenderType.js";

export default class BlockHopper extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

        this.boundingBox = new BoundingBox(0.0, 0.0, 0.0, 1.0, 1.0, 1.0);

        // Sound
        this.sound = Block.sounds.stone;

        this.inventory = new Map(); // Store items: "x,y,z" -> [items array]
        this.updateTick = new Map(); // Update tick counter
    }

    getRenderType() {
        return BlockRenderType.BLOCK;
    }

    canInteract() {
        return true;
    }

    onBlockClicked(world, x, y, z, minecraft) {
        let key = `${x},${y},${z}`;
        
        // Get or create hopper inventory
        if (!this.inventory.has(key)) {
            this.inventory.set(key, []);
        }

        // Open hopper GUI
        let hopperInventory = this.inventory.get(key);
        minecraft.hopperOpen = true;
        minecraft.hopperInventory = hopperInventory;
        minecraft.hopperPosition = { x, y, z };

        // Play open sound
        minecraft.soundManager?.playSound("random.chestopen", x, y, z, 0.3, 0.8);

        return true;
    }

    addItem(world, x, y, z, itemId, minecraft) {
        let key = `${x},${y},${z}`;
        
        if (!this.inventory.has(key)) {
            this.inventory.set(key, []);
        }

        let inventory = this.inventory.get(key);
        
        // Add item if space available
        if (inventory.length < 5) {
            inventory.push(itemId);
            return true;
        }
        
        return false; // Inventory full
    }

    extractItem(world, x, y, z, minecraft) {
        let key = `${x},${y},${z}`;
        
        if (!this.inventory.has(key)) {
            return null;
        }

        let inventory = this.inventory.get(key);
        
        if (inventory.length > 0) {
            return inventory.pop();
        }
        
        return null;
    }

    onBlockUpdate(world, x, y, z, minecraft) {
        let key = `${x},${y},${z}`;
        let tick = this.updateTick.get(key) || 0;

        if (tick >= 8) {
            // Transfer items to adjacent containers
            this.transferItems(world, x, y, z, minecraft);
            this.updateTick.set(key, 0);
        } else {
            this.updateTick.set(key, tick + 1);
        }
    }

    transferItems(world, x, y, z, minecraft) {
        let key = `${x},${y},${z}`;
        
        if (!this.inventory.has(key)) {
            return;
        }

        let inventory = this.inventory.get(key);
        
        if (inventory.length === 0) {
            return;
        }

        // Check adjacent containers
        let directions = [
            { x: 0, y: -1, z: 0 }, // Down
            { x: 0, y: 1, z: 0 },  // Up
            { x: 1, y: 0, z: 0 },  // East
            { x: -1, y: 0, z: 0 }, // West
            { x: 0, y: 0, z: 1 },  // South
            { x: 0, y: 0, z: -1 }  // North
        ];

        for (let dir of directions) {
            let adjX = x + dir.x;
            let adjY = y + dir.y;
            let adjZ = z + dir.z;

            let adjBlockId = world.getBlockAt(adjX, adjY, adjZ);
            let adjBlock = Block.getById(adjBlockId);

            // Check if adjacent block is a hopper or chest
            if (adjBlock && (adjBlock.id === this.id || adjBlock.id === 51)) {
                // Transfer item
                if (inventory.length > 0) {
                    let item = inventory.pop();
                    
                    if (adjBlock.id === 51) {
                        // Chest
                        adjBlock.inventory.set(`${adjX},${adjY},${adjZ}`, [item]);
                    } else if (adjBlock.id === this.id) {
                        // Hopper
                        adjBlock.addItem(world, adjX, adjY, adjZ, item, minecraft);
                    }
                    
                    // Play transfer sound
                    minecraft.soundManager?.playSound("random.click", x, y, z, 0.2, 0.9);
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
        return true;
    }

    getOpacity() {
        return 1.0;
    }
}
