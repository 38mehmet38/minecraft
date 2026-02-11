import Minecraft from './net/minecraft/client/Minecraft.js';
import * as aesjs from '../../libraries/aes.js';
import DynamicTextureLoader from './net/minecraft/client/render/DynamicTextureLoader.js';

class Start {

    loadTextures(textures) {
        let resources = [];
        let index = 0;

        return textures.reduce((currentPromise, texturePath) => {
            return currentPromise.then(() => {
                return new Promise((resolve, reject) => {
                    // Load texture
                    let image = new Image();
                    image.src = "src/resources/" + texturePath;
                    image.onload = () => resolve();
                    resources[texturePath] = image;

                    index++;
                });
            });
        }, Promise.resolve()).then(() => {
            return resources;
        });
    }

    async launch(canvasWrapperId) {
        // Temel textureları yükle
        const baseTextures = await this.loadTextures([
            "misc/grasscolor.png",
            "gui/font.png",
            "gui/gui.png",
            "gui/background.png",
            "gui/icons.png",
            "terrain/terrain.png",
            "terrain/sun.png",
            "terrain/moon.png",
            "char.png",
            "gui/title/minecraft.png",
            "gui/title/background/panorama_0.png",
            "gui/title/background/panorama_1.png",
            "gui/title/background/panorama_2.png",
            "gui/title/background/panorama_3.png",
            "gui/title/background/panorama_4.png",
            "gui/title/background/panorama_5.png",
            "gui/container/creative.png"
        ]);

        // Dinamik texture yükleyicisini başlat
        console.log("🎨 Minecraft varlıkları yükleniyor...");
        const textureLoader = new DynamicTextureLoader();
        
        try {
            await textureLoader.loadAllTextures();
            console.log("✅ Tüm varlıklar başarıyla yüklendi!");
        } catch (error) {
            console.warn("⚠️  Bazı varlıklar yüklenemedi, oyun devam ediyor...", error);
        }

        // Launch actual game on canvas
        window.app = new Minecraft(canvasWrapperId, baseTextures);
        window.app.textureLoader = textureLoader; // Global erişim için kaydet
    }
}

// Listen on history back
window.addEventListener('pageshow', function (event) {
    if (window.app) {
        // Reload page to restart the game
        if (!window.app.running) {
            window.location.reload();
        }
    } else {
        // Launch game
        new Start().launch("canvas-container");
    }
});

export function require(module) {
    return window[module];
}