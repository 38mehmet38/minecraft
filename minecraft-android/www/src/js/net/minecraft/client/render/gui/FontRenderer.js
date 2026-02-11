import Gui from "../../gui/Gui.js";
import MathHelper from "../../../util/MathHelper.js";

export default class FontRenderer {

    static FONT_HEIGHT = 9;

    static BITMAP_SIZE = 16;
    static FIELD_SIZE = 8;

    static COLOR_CODE_INDEX_LOOKUP = "0123456789abcdef";
    // Turkçe karakterleri ekledim: ç\u00e7 ş\u015f ü\u00fc ğ\u011f ı\u0131 Ç\u00c7 Ş\u015e Ü\u00dc Ğ\u011e İ\u0130 ö\u00f6 Ö\u00d6
    static CHAR_INDEX_LOOKUP = "\u00c0\u00c1\u00c2\u00c8\u00ca\u00cb\u00cd\u00d3\u00d4\u00d5\u00da\u00df\u00e3\u00f5\u011f\u0130\u0131\u0152\u0153\u015e\u015f\u0174\u0175\u017e\u0207\u00e7\u015f\u00fc\u011f\u0131\u00f6\u0000 !\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u0000\u00c7\u00fc\u00e9\u00e2\u00e4\u00e0\u00e5\u00e7\u00ea\u00eb\u00e8\u00ef\u00ee\u00ec\u00c4\u00c5\u00c9\u00e6\u00c6\u00f4\u00f6\u00f2\u00fb\u00f9\u00ff\u00d6\u00dc\u00f8\u00a3\u00d8\u00d7\u0192\u00e1\u00ed\u00f3\u00fa\u00f1\u00d1\u00aa\u00ba\u00bf\u00ae\u00ac\u00bd\u00bc\u00a1\u00ab\u00bb\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255d\u255c\u255b\u2510\u2514\u2534\u252c\u251c\u2500\u253c\u255e\u255f\u255a\u2554\u2569\u2566\u2560\u2550\u256c\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256b\u256a\u2518\u250c\u2588\u2584\u258c\u2590\u2580\u03b1\u03b2\u0393\u03c0\u03a3\u03c3\u03bc\u03c4\u03a6\u0398\u03a9\u03b4\u221e\u2205\u2208\u2229\u2261\u00b1\u2265\u2264\u2320\u2321\u00f7\u2248\u00b0\u2219\u00b7\u221a\u207f\u00b2\u25a0\u0000";
    static COLOR_PREFIX = '\u00a7';

    constructor(minecraft) {
        // Lightweight initialization: avoid expensive bitmap parsing when using
        // native canvas text rendering. Keep minimal state for measuring text.
        this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        this.texture = minecraft.resources["gui/font.png"];

        // Reusable offscreen canvas/context for measureText calls
        this._measureCanvas = document.createElement('canvas');
        this._measureCtx = this._measureCanvas.getContext('2d');
        this._measureCtx.font = '12px Arial, "Noto Sans", sans-serif';

        // Simple cache to avoid repeated measureText for same strings
        this._widthCache = new Map();
        this._widthCacheLimit = 500;

        // Preload frequently used GUI strings to prime the width cache and
        // avoid first-frame measurement spikes.
        const commonStrings = [
            "Tek Oyuncu",
            "Çok Oyuncu",
            "Ayarlar...",
            "Oyunu Kapat",
            "GÜLMEZ STUDİO",
            "Minecraft JavaScript ile yazılmış!",
            "Yaratıcı Envanteri",
            "Tamam",
            "Sunucudan bağlantı kesildi:",
            "Yeni Dünya Oluştur",
            "İptal",
            "Sunucuya Bağlan",
            "Sunucu Adresi",
            "Bitti",
            "Ayarlar",
            "Fare Duyarlılığı",
            "Eğilme",
            "Koşu",
            "Sohbeti Aç",
            "Envanteri Aç"
        ];

        for (let s of commonStrings) {
            // ignore returned width
            this.getStringWidth(s);
        }
    }

    calculateCharacterWidthAt(bitMap, indexX, indexY) {
        // We scan the bitmap field from right to left
        for (let x = indexX * FontRenderer.FIELD_SIZE + FontRenderer.FIELD_SIZE - 1; x >= indexX * FontRenderer.FIELD_SIZE; x--) {

            // Scan this column from top to bottom
            for (let y = indexY * FontRenderer.FIELD_SIZE; y < indexY * FontRenderer.FIELD_SIZE + FontRenderer.FIELD_SIZE; y++) {

                let i = (x + y * this.texture.width) * 4;

                let red = bitMap[i];
                let green = bitMap[i + 1];
                let blue = bitMap[i + 2];
                let alpha = bitMap[i + 3];

                // Return width if there is a white pixel
                if (red > 1 || green > 1 || blue > 1 || alpha > 1) {
                    return x - indexX * FontRenderer.FIELD_SIZE;
                }
            }
        }

        // Empty field width (Could be a space character)
        return 2;
    }

    drawString(stack, string, x, y, color = -1, shadow = true) {
        if (!this.isSafari && shadow) { // TODO Fix filter on Safari
            this.drawStringNative(stack, string, x + 1, y + 1, color, true);
        }
        this.drawStringNative(stack, string, x, y, color);
    }

    drawStringNative(stack, string, x, y, color = -1, isShadow = false) {
        // Canvas context'ini al
        stack.save();
        
        // Renk ayarla
        if (color === -1) {
            color = 0xFFFFFFFF; // Beyaz varsayılan
        }
        
        let alpha = ((color & 0xFF000000) >>> 24) / 255;
        let r = (color & 0x00FF0000) >> 16;
        let g = (color & 0x0000FF00) >> 8;
        let b = (color & 0x000000FF);
        
        if (isShadow) {
            stack.globalAlpha = alpha * 0.25;
            stack.fillStyle = `rgb(0, 0, 0)`;
        } else {
            stack.globalAlpha = alpha;
            stack.fillStyle = `rgb(${r}, ${g}, ${b})`;
        }
        
        // Font ve metin çiz
        // Mevcut transformasyon oranını dikkate al
        stack.font = '12px Arial, "Noto Sans", sans-serif';
        stack.textBaseline = 'top';
        stack.textRendering = 'optimizeLegibility';
        stack.fillText(string, Math.floor(x), Math.floor(y));
        
        stack.restore();
    }

    drawStringRaw(stack, string, x, y, color = -1, isShadow = false) {
        // Eski bitmap font metodu yerine native rendering kullan
        this.drawStringNative(stack, string, x, y, color, isShadow);
    }

    getColorOfCharacter(character) {
        let index = FontRenderer.COLOR_CODE_INDEX_LOOKUP.indexOf(character);
        let brightness = (index & 0x8) * 8;

        // Convert index to RGB
        let b = (index & 0x1) * 191 + brightness;
        let g = ((index & 0x2) >> 1) * 191 + brightness;
        let r = ((index & 0x4) >> 2) * 191 + brightness;

        return r << 16 | g << 8 | b;
    }

    getStringWidth(string) {
        if (string === null || string === undefined || string.length === 0) return 0;

        // Fast cache lookup
        if (this._widthCache.has(string)) {
            return this._widthCache.get(string);
        }

        // Use pre-created context for measurement
        let ctx = this._measureCtx;
        // Keep font consistent with drawStringNative
        ctx.font = '12px Arial, "Noto Sans", sans-serif';
        let w = Math.ceil(ctx.measureText(string).width);

        // Cache with simple size limit
        if (this._widthCache.size >= this._widthCacheLimit) {
            // delete oldest entry
            const firstKey = this._widthCache.keys().next().value;
            this._widthCache.delete(firstKey);
        }
        this._widthCache.set(string, w);

        return w;
    }

    createBitMap(img) {
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
        return canvas.getContext('2d').getImageData(0, 0, img.width, img.height).data;
    }

    setColor(stack, color, isShadow = false) {
        if (isShadow) {
            color = (color & 0xFCFCFC) >> 2;
        }

        let r = (color & 0xFF0000) >> 16;
        let g = (color & 0x00FF00) >> 8;
        let b = (color & 0x0000FF);
        let hsv = MathHelper.rgb2hsv(r, g, b);
        let hue = hsv[0] + 270;
        let saturation = hsv[1];
        let brightness = hsv[2] / 255 * 100;

        // TODO fix colors
        let saturate1 = saturation * 1000;
        let saturate2 = saturation * 5000;
        let saturate3 = saturation * 100;

        if (!this.isSafari) { // TODO Fix filter on Safari
            stack.filter = "sepia()"
                + " saturate(" + saturate1 + "%)"
                + " hue-rotate(" + hue + "deg)"
                + " saturate(" + saturate2 + "%)"
                + " brightness(" + brightness + "%)"
                + " saturate(" + saturate3 + "%)";
        }
    }

    listFormattedStringToWidth(text, wrapWidth) {
        let lines = [];
        let currentColorCharacter = "r";
        for (let line of text.split('\n')) {
            let currentLine = '';
            let currentLineWidth = 0;

            // Split the text into words
            for (let word of line.split(' ')) {
                const wordWidth = this.getStringWidth(word + " ");

                // If adding the word exceeds the wrap width, start a new line
                if (currentLineWidth + wordWidth > wrapWidth) {
                    lines.push(FontRenderer.COLOR_PREFIX + currentColorCharacter + currentLine.trim());
                    currentColorCharacter = this.getLastColorCharacterOfText(currentLine);

                    currentLine = '';
                    currentLineWidth = 0;
                }

                // Add the word to the current line
                currentLine += word + ' ';
                currentLineWidth += wordWidth;
            }

            // Push the last line
            if (currentLine.length > 0) {
                lines.push(FontRenderer.COLOR_PREFIX + currentColorCharacter + currentLine.trim());
                currentColorCharacter = this.getLastColorCharacterOfText(currentLine);
            }
        }
        return lines;
    }

    getLastColorCharacterOfText(text) {
        let character = "r";
        let isColorCode = false;

        // For each character
        for (let i = 0; i < text.length; i++) {
            if (text[i] === FontRenderer.COLOR_PREFIX) {
                isColorCode = true;
            } else {
                if (isColorCode) {
                    character = text[i];
                    isColorCode = false;
                }
            }
        }
        return character;
    }
}