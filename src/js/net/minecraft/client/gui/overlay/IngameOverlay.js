import Gui from "../Gui.js";
import Block from "../../world/block/Block.js";
import ChatOverlay from "./ChatOverlay.js";
import Minecraft from "../../Minecraft.js";
import EnumBlockFace from "../../../util/EnumBlockFace.js";
import MathHelper from "../../../util/MathHelper.js";
import FontRenderer from "../../render/gui/FontRenderer.js";
import EnumSkyBlock from "../../../util/EnumSkyBlock.js";
import PlayerListOverlay from "./PlayerListOverlay.js";
import Keyboard from "../../../util/Keyboard.js";

export default class IngameOverlay extends Gui {

    constructor(minecraft, window) {
        super();
        this.minecraft = minecraft;
        this.window = window;

        this.chatOverlay = new ChatOverlay(minecraft);
        this.playerListOverlay = new PlayerListOverlay(minecraft, this);

        this.textureCrosshair = minecraft.resources["gui/icons.png"];
        this.textureHotbar = minecraft.resources["gui/gui.png"];

        this.ticksRendered = 0;
        // Track last selected hotbar slot to avoid unnecessary prepareRender calls
        this._lastHotbarSlot = -1;
        // Debug overlay cache to avoid rebuilding heavy strings every frame
        this._debugCache = {
            time: 0,
            lines: []
        };
    }

    render(stack, mouseX, mouseY, partialTicks) {
        // Render crosshair
        if (this.minecraft.hasInGameFocus()) {
            this.renderCrosshair(stack, this.window.width / 2, this.window.height / 2)
        }

        // Render hotbar
        this.renderHotbar(stack, this.window.width / 2 - 91, this.window.height - 22);

        // Render chat canvas
        stack.drawImage(this.window.canvasChat, 0, 0);

        // Render debug canvas on stack
        if (this.minecraft.settings.debugOverlay) {
            stack.drawImage(this.window.canvasDebug, 0, 0);
        }

        // Render player list
        if (Keyboard.isKeyDown(this.minecraft.settings.keyPlayerList) && !this.minecraft.isSingleplayer()) {
            this.playerListOverlay.renderPlayerList(stack, this.window.width);
        }
    }

    onTick() {
        this.chatOverlay.onTick();

        // Render debug overlay on tick
        if (this.minecraft.settings.debugOverlay) {
            let stack = this.window.canvasDebug.getContext('2d');

            // Render debug overlay each tick if the player is moving
            if (this.ticksRendered % 10 === 0) {
                // Clear debug canvas
                stack.clearRect(0, 0, this.window.width, this.window.height);

                // Render debug information
                this.renderLeftDebugOverlay(stack);
                this.renderRightDebugOverlay(stack);
            } else if (this.minecraft.player.isMoving()) {
                // Render debug information
                this.renderLeftDebugOverlay(stack, [5, 6, 7, 8]);
            }

            this.ticksRendered++;
        }

        // Render chat on tick if dirty
        if (this.chatOverlay.isDirty()) {
            let stack = this.window.canvasChat.getContext('2d');
            stack.clearRect(0, 0, this.window.width, this.window.height);
            this.chatOverlay.render(stack, 0, 0, 0);
        }
    }

    renderCrosshair(stack, x, y) {
        let size = 15;
        this.drawSprite(stack, this.textureCrosshair, 0, 0, 15, 15, x - size / 2, y - size / 2, size, size, 0.6);
    }

    renderHotbar(stack, x, y) {
        // Render background
        this.drawSprite(stack, this.textureHotbar, 0, 0, 200, 22, x, y, 200, 22)
        this.drawSprite(
            stack,
            this.textureHotbar,
            0, 22,
            24, 24,
            x + this.minecraft.player.inventory.selectedSlotIndex * 20 - 1, y - 1,
            24, 24
        )

        // To make the items darker
        let brightness = this.minecraft.isPaused() ? 0.5 : 1; // TODO find a better solution

        // Only prepare hotbar rendering when the selected slot changed
        const selected = this.minecraft.player.inventory.selectedSlotIndex;
        if (this._lastHotbarSlot !== selected) {
            this.minecraft.itemRenderer.prepareRender("hotbar");
            this._lastHotbarSlot = selected;
        }

        // Render items
        for (let i = 0; i < 9; i++) {
            let typeId = this.minecraft.player.inventory.getItemInSlot(i);
            if (typeId !== 0) {
                let block = Block.getById(typeId);
                this.minecraft.itemRenderer.renderItemInGui("hotbar", i, block, Math.floor(x + i * 20 + 11), y + 11, brightness);
            }
        }
    }

    renderLeftDebugOverlay(stack, filters = []) {
        const now = Date.now();
        const cacheAge = now - this._debugCache.time;
        let lines;

        // If filters are provided (partial update) always recompute to respect the slice
        if (filters.length === 0 && this._debugCache.time !== 0 && cacheAge < 200) {
            // Use cached lines
            lines = this._debugCache.lines;
        } else {
            // Fall through to compute fresh lines and update cache
            lines = [];
        }

        // If lines empty, compute full details
        if (lines.length === 0) {
            let world = this.minecraft.world;
        let player = this.minecraft.player;
        let worldRenderer = this.minecraft.worldRenderer;

        let x = player.x;
        let y = player.y;
        let z = player.z;

        let yaw = MathHelper.wrapAngleTo180(player.rotationYaw);
        let pitch = player.rotationPitch;

        let facingIndex = (((yaw + 180) * 4.0 / 360.0) + 0.5) & 3;
        let facing = EnumBlockFace.values()[facingIndex + 2];

        let fixedX = x.toFixed(2);
        let fixedY = y.toFixed(2);
        let fixedZ = z.toFixed(2);

        let blockX = Math.floor(x);
        let blockY = Math.floor(y);
        let blockZ = Math.floor(z);

        let chunkX = blockX >> 4;
        let chunkY = blockY >> 4;
        let chunkZ = blockZ >> 4;

        let inChunkX = blockX & 0xF;
        let inChunkY = blockY & 0xF;
        let inChunkZ = blockZ & 0xF;

        let visibleChunks = 0;
        let loadedChunks = 0;
        for (let [index, chunk] of world.getChunkProvider().getChunks()) {
            for (let y in chunk.sections) {
                let chunkSection = chunk.sections[y];
                if (chunkSection.group.visible) {
                    visibleChunks++;
                }
                loadedChunks++;
            }
        }
        let visibleEntities = 0;
        for (let index in world.entities) {
            let entity = world.entities[index];
            if (entity.renderer.group.visible) {
                visibleEntities++;
            }
        }

        let fps = Math.floor(this.minecraft.fps);
        let viewDistance = this.minecraft.settings.viewDistance;
        let lightUpdates = world.lightUpdateQueue.length;
        let chunkUpdates = worldRenderer.chunkSectionUpdateQueue.length;
        let entities = world.entities.length;
        let particles = this.minecraft.particleRenderer.particles.length;
        let skyLight = world.getSavedLightValue(EnumSkyBlock.SKY, blockX, blockY, blockZ);
        let blockLight = world.getSavedLightValue(EnumSkyBlock.BLOCK, blockX, blockY, blockZ);
        let lightLevel = world.getTotalLightAt(blockX, blockY, blockZ);
        let biome = "T: " + world.getTemperature(blockX, blockY, blockZ) + " H: " + world.getHumidity(blockX, blockY, blockZ);

        let soundsLoaded = 0;
        let soundsPlaying = 0;
        let soundPool = this.minecraft.soundManager.soundPool;
        for (let [id, sounds] of Object.entries(soundPool)) {
            for (let sound of sounds) {
                soundsLoaded++;

                if (sound.isPlaying) {
                    soundsPlaying++;
                }
            }
        }

        let towards = "Yönde " + (facing.isPositive() ? "pozitif" : "negatif") + " " + (facing.isXAxis() ? "X" : "Z");

        lines = [
            "GÜLMEZ STUDİO",
            fps + " fps (" + chunkUpdates + " chunk güncellemesi) T: " + this.minecraft.maxFps,
            "C: " + visibleChunks + "/" + loadedChunks + " D: " + viewDistance + ", L: " + lightUpdates,
            "E: " + visibleEntities + "/" + entities + ", P: " + particles,
            "",
            "XYZ: " + fixedX + " / " + fixedY + " / " + fixedZ,
            "Blok: " + blockX + " " + blockY + " " + blockZ,
            "Chunk: " + chunkX + " " + chunkY + " " + chunkZ + " içinde " + inChunkX + " " + inChunkY + " " + inChunkZ,
            "Yön: " + facing.getName() + " (" + towards + ") (" + yaw.toFixed(1) + " / " + pitch.toFixed(1) + ")",
            "Işık: " + lightLevel + " (" + skyLight + " gökyüzü, " + blockLight + " blok)",
            // "Biome: " + biome,
            "",
            "Sesler: " + soundsPlaying + "/" + soundsLoaded,
            "Zaman: " + world.time % 24000 + " (Gün " + Math.floor(world.time / 24000) + ")",
            "İmleç: " + this.minecraft.window.focusState.getName()
            ];

            // Update cache
            this._debugCache.time = now;
            this._debugCache.lines = lines;
        }

        // Hit result
        let hit = worldRenderer.lastHitResult;
        if (hit !== null && hit.type !== 0) {
            lines.push("Bakılan: " + hit.x + " " + hit.y + " " + hit.z);
        }

        // Draw lines
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].length === 0 || filters.length !== 0 && !filters.includes(i)) {
                continue;
            }

            // Clear the line
            if (filters.length !== 0) {
                stack.clearRect(
                    1,
                    1 + FontRenderer.FONT_HEIGHT * i,
                    this.getStringWidth(stack, lines[i]) + 1,
                    FontRenderer.FONT_HEIGHT
                );
            }

            // Draw background
            this.drawRect(stack,
                1,
                1 + FontRenderer.FONT_HEIGHT * i,
                1 + this.getStringWidth(stack, lines[i]) + 1,
                1 + FontRenderer.FONT_HEIGHT * i + FontRenderer.FONT_HEIGHT,
                '#50505090'
            );

            // Draw line
            this.drawString(stack, lines[i], 2, 2 + FontRenderer.FONT_HEIGHT * i, 0xffe0e0e0, false);
        }
    }

    renderRightDebugOverlay(stack) {
        let memoryLimit = this.minecraft.window.getMemoryLimit();
        let memoryUsed = this.minecraft.window.getMemoryUsed();
        let memoryAllocated = this.minecraft.window.getMemoryAllocated();

        let usedPercentage = Math.floor(memoryUsed / memoryLimit * 100);
        let allocatedPercentage = Math.floor(memoryAllocated / memoryLimit * 100);

        let width = this.window.canvas.width;
        let height = this.window.canvas.height;

        let lines = [
            "Bellek: " + usedPercentage + "% " + this.humanFileSize(memoryUsed, memoryLimit),
            "Ayırılan: " + allocatedPercentage + "% " + this.humanFileSize(null, memoryAllocated),
            "",
            "Ekran: " + width + "x" + height,
            this.window.getGPUName()
        ];

        // Draw lines
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].length === 0) {
                continue;
            }

            // Draw background
            this.drawRect(stack,
                this.window.width - this.getStringWidth(stack, lines[i]) - 3,
                1 + FontRenderer.FONT_HEIGHT * i,
                this.window.width - 1,
                1 + FontRenderer.FONT_HEIGHT * i + FontRenderer.FONT_HEIGHT,
                '#50505090'
            );

            // Draw line
            this.drawRightString(stack, lines[i], this.window.width - 2, 2 + FontRenderer.FONT_HEIGHT * i, 0xffe0e0e0, false);
        }
    }

    humanFileSize(bytesUsed, bytesMax) {
        if (Math.abs(bytesMax) < 1000) {
            return (bytesUsed === null ? "" : bytesUsed + "/") + bytesMax + "B";
        }
        const units = ['kB', 'MB'];
        let u = -1;
        const r = 10;
        const thresh = 1000;

        do {
            if (bytesUsed !== null) {
                bytesUsed /= thresh;
            }
            bytesMax /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytesMax) * r) / r >= thresh && u < units.length - 1);
        return (bytesUsed === null ? "" : bytesUsed.toFixed(0) + "/") + bytesMax.toFixed(0) + units[u];
    }
}