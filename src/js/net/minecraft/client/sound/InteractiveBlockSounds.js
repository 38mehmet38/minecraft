/**
 * Interactive Block System - Sound Configuration
 * 
 * Bu dosya interaktif bloklar için gereken ses dosyalarını yapılandırır.
 * Gerçek .ogg ses dosyaları bulunmaması durumunda Web Audio API kullanarak
 * programatik olarak sesler üretilir.
 */

export class InteractiveBlockSounds {
    
    /**
     * Ses dosyaları yapılandırması
     * Format: "ses.adı" -> dosya sayısı
     */
    static SOUNDS = {
        // Sandık sesleri
        "random.chestopen": 1,
        "random.chestclosed": 1,
        
        // Kapı sesleri
        "random.door_open": 1,
        "random.door_close": 1,
        
        // Tuzak kapı sesleri
        "random.trapdoor_open": 1,
        "random.trapdoor_close": 1,
        
        // Alet ve diğer sesleri
        "random.lever": 1,
        "random.click": 1
    };

    /**
     * Ses oluşturucusu - gerçek dosya olmadığında programatik ses üretir
     */
    static generateSound(context, type) {
        let oscillator = context.createOscillator();
        let gain = context.createGain();
        
        oscillator.connect(gain);
        gain.connect(context.destination);
        
        switch(type) {
            case "random.chestopen":
                oscillator.frequency.value = 400;
                gain.gain.setValueAtTime(0.3, context.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
                oscillator.start(context.currentTime);
                oscillator.stop(context.currentTime + 0.2);
                break;
                
            case "random.chestclosed":
                oscillator.frequency.value = 350;
                gain.gain.setValueAtTime(0.25, context.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.15);
                oscillator.start(context.currentTime);
                oscillator.stop(context.currentTime + 0.15);
                break;
                
            case "random.door_open":
                oscillator.frequency.value = 800;
                oscillator.frequency.setValueAtTime(800, context.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(400, context.currentTime + 0.3);
                gain.gain.setValueAtTime(0.4, context.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
                oscillator.start(context.currentTime);
                oscillator.stop(context.currentTime + 0.3);
                break;
                
            case "random.door_close":
                oscillator.frequency.value = 400;
                oscillator.frequency.setValueAtTime(400, context.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, context.currentTime + 0.2);
                gain.gain.setValueAtTime(0.3, context.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
                oscillator.start(context.currentTime);
                oscillator.stop(context.currentTime + 0.2);
                break;
                
            case "random.trapdoor_open":
                oscillator.frequency.value = 600;
                gain.gain.setValueAtTime(0.2, context.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.15);
                oscillator.start(context.currentTime);
                oscillator.stop(context.currentTime + 0.15);
                break;
                
            case "random.trapdoor_close":
                oscillator.frequency.value = 500;
                gain.gain.setValueAtTime(0.2, context.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.12);
                oscillator.start(context.currentTime);
                oscillator.stop(context.currentTime + 0.12);
                break;
                
            case "random.lever":
                oscillator.frequency.value = 700;
                gain.gain.setValueAtTime(0.15, context.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
                oscillator.start(context.currentTime);
                oscillator.stop(context.currentTime + 0.1);
                break;
                
            case "random.click":
                oscillator.frequency.value = 1000;
                gain.gain.setValueAtTime(0.1, context.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.05);
                oscillator.start(context.currentTime);
                oscillator.stop(context.currentTime + 0.05);
                break;
        }
    }
}

export default InteractiveBlockSounds;
