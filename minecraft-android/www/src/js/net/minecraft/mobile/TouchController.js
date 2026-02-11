/**
 * Sanal joystick ve kontrol simgeleri yönetimi
 */
export default class TouchController {
    constructor(gameWindow) {
        this.gameWindow = gameWindow;
        this.joystick = null;
        this.buttons = {};
        this.isEnabled = false;
        this.joystickActive = false;
        this.joystickX = 0;
        this.joystickY = 0;
    }

    initialize() {
        if (!this.gameWindow.mobileDevice) {
            return;
        }

        this.isEnabled = true;
        this.createControlOverlay();
        this.registerTouchListeners();
    }

    createControlOverlay() {
        // Ana kontrol container'ı
        const controlsDiv = document.createElement('div');
        controlsDiv.id = 'mobile-controls';
        controlsDiv.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 180px;
            background: transparent;
            z-index: 100;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 10px;
            pointer-events: none;
        `;

        // SOL: JOYSTİCK
        const joystickContainer = document.createElement('div');
        joystickContainer.style.cssText = `
            width: 120px;
            height: 120px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            position: relative;
            pointer-events: auto;
            touch-action: none;
        `;

        this.joystick = document.createElement('div');
        this.joystick.style.cssText = `
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.4);
            border: 2px solid rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            transition: background 0.1s;
        `;

        joystickContainer.appendChild(this.joystick);

        // SAĞ: KONTROL TUŞLARI
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: flex-end;
            pointer-events: auto;
        `;

        // Sol üst: W, A, Space
        const topRow = document.createElement('div');
        topRow.style.cssText = 'display: flex; gap: 10px;';

        const wButton = this.createButton('W', 'KeyW', '⬆️');
        const aButton = this.createButton('A', 'KeyA', '⬅️');
        const spaceButton = this.createButton('SEKTME', 'Space', '🚀');

        topRow.appendChild(wButton);
        topRow.appendChild(aButton);
        topRow.appendChild(spaceButton);
        buttonsContainer.appendChild(topRow);

        // Orta: E, S, D
        const midRow = document.createElement('div');
        midRow.style.cssText = 'display: flex; gap: 10px;';

        const eButton = this.createButton('E', 'KeyE', '🎒');
        const sButton = this.createButton('S', 'KeyS', '⬇️');
        const dButton = this.createButton('D', 'KeyD', '➡️');

        midRow.appendChild(eButton);
        midRow.appendChild(sButton);
        midRow.appendChild(dButton);
        buttonsContainer.appendChild(midRow);

        // Alt: LMB, RMB, Shift
        const bottomRow = document.createElement('div');
        bottomRow.style.cssText = 'display: flex; gap: 10px;';

        const lmbButton = this.createButton('LMB', 'LeftClick', '⛏️');
        const rmbButton = this.createButton('RMB', 'RightClick', '📦');
        const shiftButton = this.createButton('KOŞU', 'ShiftLeft', '💨');

        bottomRow.appendChild(lmbButton);
        bottomRow.appendChild(rmbButton);
        bottomRow.appendChild(shiftButton);
        buttonsContainer.appendChild(bottomRow);

        controlsDiv.appendChild(joystickContainer);
        controlsDiv.appendChild(buttonsContainer);

        document.body.appendChild(controlsDiv);
    }

    createButton(label, keyCode, icon) {
        const button = document.createElement('button');
        button.dataset.keyCode = keyCode;
        button.style.cssText = `
            width: 50px;
            height: 50px;
            background: rgba(100, 150, 255, 0.3);
            border: 2px solid rgba(100, 150, 255, 0.6);
            border-radius: 8px;
            color: white;
            font-weight: bold;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
            transition: all 0.1s;
            opacity: 0.7;
        `;

        button.textContent = icon;
        button.title = label;

        const updateButtonState = (isPressed) => {
            if (isPressed) {
                button.style.background = 'rgba(100, 255, 150, 0.5)';
                button.style.opacity = '1';
                button.style.transform = 'scale(0.95)';
            } else {
                button.style.background = 'rgba(100, 150, 255, 0.3)';
                button.style.opacity = '0.7';
                button.style.transform = 'scale(1)';
            }
        };

        // Mouse Events (Desktop)
        button.addEventListener('mousedown', () => {
            this.simulateKeyPress(keyCode, true);
            updateButtonState(true);
        });

        button.addEventListener('mouseup', () => {
            this.simulateKeyPress(keyCode, false);
            updateButtonState(false);
        });

        button.addEventListener('mouseleave', () => {
            this.simulateKeyPress(keyCode, false);
            updateButtonState(false);
        });

        // Touch Events (Mobile)
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.simulateKeyPress(keyCode, true);
            updateButtonState(true);
        }, false);

        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.simulateKeyPress(keyCode, false);
            updateButtonState(false);
        }, false);

        button.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            this.simulateKeyPress(keyCode, false);
            updateButtonState(false);
        }, false);

        this.buttons[keyCode] = { element: button, updateState: updateButtonState };

        return button;
    }

    registerTouchListeners() {
        const joystickContainer = this.joystick.parentElement;
        let touchId = null;

        const handleTouchStart = (e) => {
            if (e.touches.length === 0) return;

            const touch = e.touches[0];
            touchId = touch.identifier;

            const rect = joystickContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            this.joystickActive = true;
            this.updateJoystickPosition(touch.clientX, touch.clientY, rect, centerX, centerY);
        };

        const handleTouchMove = (e) => {
            if (touchId === null) return;

            const touch = Array.from(e.touches).find(t => t.identifier === touchId);
            if (!touch) return;

            const rect = joystickContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            e.preventDefault();
            this.updateJoystickPosition(touch.clientX, touch.clientY, rect, centerX, centerY);
        };

        const handleTouchEnd = (e) => {
            const touch = Array.from(e.touches).find(t => t.identifier === touchId);
            if (touch) return;

            touchId = null;
            this.joystickActive = false;
            this.joystickX = 0;
            this.joystickY = 0;
            this.resetJoystickVisuals();
        };

        joystickContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    updateJoystickPosition(touchX, touchY, rect, centerX, centerY) {
        const maxDistance = rect.width / 2 - 30;
        const deltaX = touchX - centerX;
        const deltaY = touchY - centerY;

        let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance > maxDistance) {
            distance = maxDistance;
        }

        const angle = Math.atan2(deltaY, deltaX);
        const newX = Math.cos(angle) * distance;
        const newY = Math.sin(angle) * distance;

        this.joystickX = newX / maxDistance;
        this.joystickY = -newY / maxDistance;

        // Joystick görselini güncelle
        const offsetX = (newX / maxDistance) * (rect.width / 2 - 30);
        const offsetY = (newY / maxDistance) * (rect.height / 2 - 30);

        this.joystick.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
        this.joystick.style.background = 'rgba(100, 255, 150, 0.5)';

        // Joystick inputlarını kontrol et
        this.updateMovementKeys();
    }

    resetJoystickVisuals() {
        this.joystick.style.transform = 'translate(-50%, -50%)';
        this.joystick.style.background = 'rgba(255, 255, 255, 0.4)';
    }

    updateMovementKeys() {
        const forwardThreshold = 0.2;
        const strafeThreshold = 0.2;

        const forwardPressed = this.joystickY > forwardThreshold;
        const backwardPressed = this.joystickY < -forwardThreshold;
        const leftPressed = this.joystickX < -strafeThreshold;
        const rightPressed = this.joystickX > strafeThreshold;

        // Joystick hareket kontrolü
        if (forwardPressed) {
            this.simulateKeyPress('KeyW', true);
        } else {
            this.simulateKeyPress('KeyW', false);
        }

        if (backwardPressed) {
            this.simulateKeyPress('KeyS', true);
        } else {
            this.simulateKeyPress('KeyS', false);
        }

        if (leftPressed) {
            this.simulateKeyPress('KeyA', true);
        } else {
            this.simulateKeyPress('KeyA', false);
        }

        if (rightPressed) {
            this.simulateKeyPress('KeyD', true);
        } else {
            this.simulateKeyPress('KeyD', false);
        }
    }

    simulateKeyPress(keyCode, pressed) {
        // Gerçek Keyboard sistemi ile uyumlu
        if (typeof window.Keyboard !== 'undefined') {
            window.Keyboard.setState(keyCode, pressed);
        }

        // Fare kliklemeleri
        if (keyCode === 'LeftClick') {
            if (pressed && typeof window.app !== 'undefined') {
                window.app.onMouseClicked(0);
            }
        } else if (keyCode === 'RightClick') {
            if (pressed && typeof window.app !== 'undefined') {
                window.app.onMouseClicked(1);
            }
        }
    }

    update(gameWindow) {
        if (!this.isEnabled) return;

        // Joystick mouse hareketi simülasyonu
        if (this.joystickActive) {
            const sensitivity = 3;
            gameWindow.mouseMotionX += this.joystickX * sensitivity;
            gameWindow.mouseMotionY += this.joystickY * sensitivity;
        }
    }
}
