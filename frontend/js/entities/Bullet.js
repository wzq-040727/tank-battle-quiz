export class Bullet {
    constructor(x, y, vx, vy, attack, owner) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.attack = attack;
        this.owner = owner;
        this.alive = true;
    }

    update(dt) {
        this.x += this.vx;
        this.y += this.vy;
    }

    getBounds() {
        return { x: this.x - 3, y: this.y - 3, w: 6, h: 6 };
    }
}
