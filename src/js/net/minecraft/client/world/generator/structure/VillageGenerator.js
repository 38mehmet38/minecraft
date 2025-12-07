import { BlockRegistry } from "../../block/BlockRegistry.js";

export default class VillageGenerator {

    constructor(world, seed) {
        this.world = world;
        this.seed = seed;
        this.random = world.random;
    }

    /**
     * Generates a village structure at the given block position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate (ground level)
     * @param {number} z - Z coordinate
     */
    generateVillageAtBlock(x, y, z) {
        // Generate village layout around the center point
        this.generateHuts(x, y, z);
        this.generateWells(x, y, z);
        this.generateGravelRoads(x, y, z);
    }

    /**
     * Generates simple huts (houses) in a village
     */
    generateHuts(centerX, centerY, centerZ) {
        // Create a small cluster of huts (3-5 huts per village)
        const hutCount = 3 + this.random.nextInt(3);

        for (let i = 0; i < hutCount; i++) {
            // Spread huts in a circle around the center
            const angle = (i / hutCount) * Math.PI * 2;
            const distance = 8 + this.random.nextInt(8);

            const hutX = centerX + Math.floor(Math.cos(angle) * distance);
            const hutZ = centerZ + Math.floor(Math.sin(angle) * distance);
            const hutY = this.world.getHeightAt(hutX, hutZ);

            this.buildHut(hutX, hutY, hutZ);
        }
    }

    /**
     * Builds a single hut (5x5 base structure)
     * Structure:
     * - Floor: Cobblestone
     * - Walls: Wood planks (3 blocks high)
     * - Door: Empty space (1x2)
     * - Roof: Logs arranged in a simple pattern
     */
    buildHut(x, y, z) {
        const width = 5;
        const depth = 5;
        const height = 3;

        // Clear area above ground (tree removal)
        for (let dx = x - 1; dx < x + width + 1; dx++) {
            for (let dz = z - 1; dz < z + depth + 1; dz++) {
                for (let dy = y + 5; dy < y + 8; dy++) {
                    this.setBlock(dx, dy, dz, null);
                }
            }
        }

        // Build floor
        for (let dx = x; dx < x + width; dx++) {
            for (let dz = z; dz < z + depth; dz++) {
                this.setBlock(dx, y - 1, dz, BlockRegistry.COBBLE_STONE);
            }
        }

        // Build walls
        for (let dy = y; dy < y + height; dy++) {
            for (let dx = x; dx < x + width; dx++) {
                // Front and back walls
                this.setBlock(dx, dy, z, BlockRegistry.WOOD);
                this.setBlock(dx, dy, z + depth - 1, BlockRegistry.WOOD);
            }

            for (let dz = z + 1; dz < z + depth - 1; dz++) {
                // Left and right walls
                this.setBlock(x, dy, dz, BlockRegistry.WOOD);
                this.setBlock(x + width - 1, dy, dz, BlockRegistry.WOOD);
            }
        }

        // Create door opening (front wall, 2 blocks high, 1 block wide)
        const doorX = x + Math.floor(width / 2);
        const doorZ = z;
        this.setBlock(doorX, y, doorZ, null);
        this.setBlock(doorX, y + 1, doorZ, null);

        // Build roof (simple sloped roof using logs)
        for (let dx = x; dx < x + width; dx++) {
            for (let dz = z; dz < z + depth; dz++) {
                // Alternate logs for a roof pattern
                if ((dx + dz) % 2 === 0) {
                    this.setBlock(dx, y + height, dz, BlockRegistry.LOG);
                } else {
                    this.setBlock(dx, y + height, dz, BlockRegistry.LOG);
                }
            }
        }

        // Add wooden torches at corners for light
        this.setBlock(x + 1, y + 2, z + 1, BlockRegistry.TORCH);
        this.setBlock(x + width - 2, y + 2, z + 1, BlockRegistry.TORCH);
    }

    /**
     * Generates wells (water sources) in a village
     */
    generateWells(centerX, centerY, centerZ) {
        // 1-2 wells per village
        const wellCount = 1 + this.random.nextInt(2);

        for (let i = 0; i < wellCount; i++) {
            const wellX = centerX + this.random.nextInt(20) - 10;
            const wellZ = centerZ + this.random.nextInt(20) - 10;
            const wellY = this.world.getHeightAt(wellX, wellZ);

            this.buildWell(wellX, wellY, wellZ);
        }
    }

    /**
     * Builds a well structure
     * Structure:
     * - Outer ring: Cobblestone (3x3)
     * - Inner water: 1x1
     * - Depth: 5 blocks
     */
    buildWell(x, y, z) {
        const wellSize = 3;
        const wellDepth = 5;

        // Build outer ring (cobblestone)
        for (let dx = x - 1; dx <= x + 1; dx++) {
            for (let dz = z - 1; dz <= z + 1; dz++) {
                // Only outer ring
                if (Math.abs(dx - x) === 1 || Math.abs(dz - z) === 1) {
                    for (let dy = y; dy < y + wellDepth; dy++) {
                        this.setBlock(dx, dy, dz, BlockRegistry.COBBLE_STONE);
                    }
                }
            }
        }

        // Fill center with water
        for (let dy = y; dy < y + wellDepth; dy++) {
            this.setBlock(x, dy, z, BlockRegistry.WATER);
        }

        // Add a wooden cover on top
        this.setBlock(x - 1, y + wellDepth, z - 1, BlockRegistry.WOOD);
        this.setBlock(x - 1, y + wellDepth, z + 1, BlockRegistry.WOOD);
        this.setBlock(x + 1, y + wellDepth, z - 1, BlockRegistry.WOOD);
        this.setBlock(x + 1, y + wellDepth, z + 1, BlockRegistry.WOOD);
    }

    /**
     * Generates gravel paths connecting the village structures
     */
    generateGravelRoads(centerX, centerY, centerZ) {
        // Create main road cross pattern
        const roadLength = 30;
        const roadWidth = 3;

        // North-South road
        for (let dx = centerX - Math.floor(roadWidth / 2); dx <= centerX + Math.floor(roadWidth / 2); dx++) {
            for (let dz = centerZ - roadLength / 2; dz < centerZ + roadLength / 2; dz++) {
                const roadY = this.world.getHeightAt(dx, dz);
                this.setBlock(dx, roadY - 1, dz, BlockRegistry.GRAVEL);

                // Clear blocks above to prevent trees growing through
                this.setBlock(dx, roadY, dz, null);
            }
        }

        // East-West road
        for (let dz = centerZ - Math.floor(roadWidth / 2); dz <= centerZ + Math.floor(roadWidth / 2); dz++) {
            for (let dx = centerX - roadLength / 2; dx < centerX + roadLength / 2; dx++) {
                const roadY = this.world.getHeightAt(dx, dz);
                this.setBlock(dx, roadY - 1, dz, BlockRegistry.GRAVEL);

                // Clear blocks above to prevent trees growing through
                this.setBlock(dx, roadY, dz, null);
            }
        }
    }

    /**
     * Helper method to set a block in the world
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @param {Block} block - Block to set (or null to remove)
     */
    setBlock(x, y, z, block) {
        // Ensure coordinates are within valid world bounds
        if (y < 0 || y >= 256) return;

        try {
            if (block === null) {
                this.world.setBlockState(x, y, z, BlockRegistry.GRASS);
            } else {
                this.world.setBlockState(x, y, z, block);
            }
        } catch (e) {
            // Silently skip invalid positions
        }
    }
}
