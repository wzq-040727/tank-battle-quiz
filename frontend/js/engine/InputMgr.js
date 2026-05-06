export class InputMgr {
    constructor() {
        this.keys = {};
        this.justPressed = {};
        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.code]) this.justPressed[e.code] = true;
            this.keys[e.code] = true;
            e.preventDefault();
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            e.preventDefault();
        });
    }

    isDown(code) { return !!this.keys[code]; }

    wasJustPressed(code) {
        if (this.justPressed[code]) {
            this.justPressed[code] = false;
            return true;
        }
        return false;
    }

    clearJustPressed() { this.justPressed = {}; }
}
