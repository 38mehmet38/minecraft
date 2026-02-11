import Block from "../world/block/Block.js";
import * as THREE from "../../../../../../libraries/three.module.js";
import InteractiveBlockSounds from "./InteractiveBlockSounds.js";

export default class SoundManager {

    constructor() {
        this.audioLoader = new THREE.AudioLoader();
        this.audioListener = null;

        this.soundPool = {};
        this.audioContext = null;
    }

    create(worldRenderer) {
        this.scene = worldRenderer.scene;

        this.audioListener = new THREE.AudioListener();
        worldRenderer.camera.add(this.audioListener);

        // Load initial sound pool
        for (let i in Block.sounds) {
            let sound = Block.sounds[i];

            // Load sound types
            this.loadSoundPool(sound.getStepSound());
        }

        // Load interactive block sounds
        this.loadSoundPool("random.chestopen");
        this.loadSoundPool("random.chestclosed");
        this.loadSoundPool("random.door_open");
        this.loadSoundPool("random.door_close");
        this.loadSoundPool("random.trapdoor_open");
        this.loadSoundPool("random.trapdoor_close");
        this.loadSoundPool("random.lever");
        this.loadSoundPool("random.click");
    }

    loadSoundPool(name) {
        let pool = [];
        let amount = 4;

        // Load all sounds into pool
        let path = name.replace(".", "/");
        for (let i = 0; i < amount; i++) {
            let sound = this.loadSound('src/resources/sound/' + path + (i + 1) + '.ogg');
            pool.push(sound);
        }

        // Register sound pool
        this.soundPool[name] = pool;
    }

    loadSound(path) {
        if (!this.isCreated()) {
            return;
        }

        // Create sound
        let sound = new THREE.PositionalAudio(this.audioListener);
        sound.setRefDistance(0.1);
        sound.setRolloffFactor(6);
        sound.setFilter(sound.context.createBiquadFilter());
        sound.setVolume(0);

        // Try to load real sound file, if not found use procedural sound
        this.audioLoader.load(path, buffer => {
            sound.setBuffer(buffer);
            this.scene.add(sound);
        }, undefined, error => {
            // If file not found, create procedural sound
            console.warn("Ses dosyası bulunamadı, programatik ses üretiliyor: " + path);
            this.createProceduralSound(sound, path);
        });

        return sound;
    }

    createProceduralSound(sound, path) {
        // Get sound type from path
        let soundType = path.replace(/.*\//g, "").replace(/\.ogg/g, "");
        soundType = soundType.substring(0, soundType.length - 1); // Remove digit at end

        // Use InteractiveBlockSounds to generate sound
        if (this.audioContext === null) {
            this.audioContext = sound.context;
        }

        // Create a buffer for procedural sound
        let context = this.audioContext;
        let sampleRate = context.sampleRate;
        let duration = 0.5; // Default duration
        let length = sampleRate * duration;
        let buffer = context.createBuffer(1, length, sampleRate);
        let data = buffer.getChannelData(0);

        // Generate procedural audio based on sound type
        this.generateProceduralAudio(soundType, data, sampleRate);

        sound.setBuffer(buffer);
        this.scene.add(sound);
    }

    generateProceduralAudio(soundType, data, sampleRate) {
        // Generate sound waveform based on type
        switch(soundType) {
            case "random.chestopen":
            case "random.chest":
                this.generateChestSound(data, sampleRate, true);
                break;
            case "random.chestclosed":
                this.generateChestSound(data, sampleRate, false);
                break;
            case "random.door_open":
            case "random.door":
                this.generateDoorSound(data, sampleRate, true);
                break;
            case "random.door_close":
                this.generateDoorSound(data, sampleRate, false);
                break;
            case "random.trapdoor_open":
                this.generateTrapDoorSound(data, sampleRate, true);
                break;
            case "random.trapdoor_close":
                this.generateTrapDoorSound(data, sampleRate, false);
                break;
            case "random.lever":
                this.generateLeverSound(data, sampleRate);
                break;
            case "random.click":
                this.generateClickSound(data, sampleRate);
                break;
            default:
                this.generateDefaultSound(data, sampleRate);
        }
    }

    generateChestSound(data, sampleRate, isOpen) {
        let freq = isOpen ? 400 : 350;
        let duration = isOpen ? 0.2 : 0.15;
        let length = sampleRate * duration;

        for (let i = 0; i < length; i++) {
            let t = i / sampleRate;
            let envelope = Math.exp(-t * 10); // Decay envelope
            data[i] = Math.sin(2 * Math.PI * freq * t) * 0.3 * envelope;
        }
    }

    generateDoorSound(data, sampleRate, isOpen) {
        let startFreq = isOpen ? 800 : 400;
        let endFreq = isOpen ? 400 : 200;
        let duration = isOpen ? 0.3 : 0.2;
        let length = sampleRate * duration;

        for (let i = 0; i < length; i++) {
            let t = i / sampleRate;
            let progress = t / duration;
            let freq = startFreq + (endFreq - startFreq) * progress;
            let envelope = Math.exp(-t * 5);
            data[i] = Math.sin(2 * Math.PI * freq * t) * 0.4 * envelope;
        }
    }

    generateTrapDoorSound(data, sampleRate, isOpen) {
        let freq = isOpen ? 600 : 500;
        let duration = isOpen ? 0.15 : 0.12;
        let length = sampleRate * duration;

        for (let i = 0; i < length; i++) {
            let t = i / sampleRate;
            let envelope = Math.exp(-t * 12);
            data[i] = Math.sin(2 * Math.PI * freq * t) * 0.2 * envelope;
        }
    }

    generateLeverSound(data, sampleRate) {
        let freq = 700;
        let duration = 0.1;
        let length = sampleRate * duration;

        for (let i = 0; i < length; i++) {
            let t = i / sampleRate;
            let envelope = Math.exp(-t * 15);
            data[i] = Math.sin(2 * Math.PI * freq * t) * 0.15 * envelope;
        }
    }

    generateClickSound(data, sampleRate) {
        let freq = 1000;
        let duration = 0.05;
        let length = sampleRate * duration;

        for (let i = 0; i < length; i++) {
            let t = i / sampleRate;
            let envelope = Math.exp(-t * 20);
            data[i] = Math.sin(2 * Math.PI * freq * t) * 0.1 * envelope;
        }
    }

    generateDefaultSound(data, sampleRate) {
        let freq = 500;
        let duration = 0.2;
        let length = sampleRate * duration;

        for (let i = 0; i < length; i++) {
            let t = i / sampleRate;
            let envelope = Math.exp(-t * 8);
            data[i] = Math.sin(2 * Math.PI * freq * t) * 0.2 * envelope;
        }
    }

    playSound(name, x, y, z, volume, pitch) {
        let pool = this.soundPool[name];

        if (typeof pool === "undefined") {
            // Load sound pool
            this.loadSoundPool(name);
        } else if (pool.length > 0) {
            // Play random sound in pool
            let sound = pool[Math.floor(Math.random() * pool.length)];
            if (typeof volume === "undefined" || typeof sound === "undefined") {
                return;
            }

            // Stop previous sound
            if (sound.isPlaying) {
                sound.stop();
            }

            // Update position
            sound.position.set(x, y, z);

            // Update volume and pitch
            sound.setVolume(volume);
            sound.filters[0].frequency.setValueAtTime(12000 * pitch, sound.context.currentTime);

            // Play sound
            sound.offset = 0;
            sound.play();
        }
    }

    isCreated() {
        return !(this.audioListener === null);
    }

}