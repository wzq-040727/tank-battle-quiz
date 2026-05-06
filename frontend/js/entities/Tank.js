import { CELL_SIZE } from '../map/maps.js';

export class Tank {
    constructor(x, y, config = {}) {
        this.x = x;
        this.y = y;
        this.width = CELL_SIZE;
        this.height = CELL_SIZE;
        this.hp = config.hp || 100;
        this.maxHp = this.hp;
        this.attack = config.attack || 10;
        this.speed = config.speed || 3;
        this.direction = 'up';
        this.color = config.color || '#4ecca3';
        this.turretColor = config.turretColor || '#fff';
        this.alive = true;
        this.shootCooldown = 0;
        this.cooldownTime = config.cooldownTime || 500;
    }

    takeDamage(dmg) {
        this.hp -= dmg;
        if (this.hp <= 0) {
            this.hp = 0;
            this.alive = false;
        }
    }

    canShoot(now) {
        return now - this.shootCooldown >= this.cooldownTime;
    }

    shoot(now) {
        this.shootCooldown = now;
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const bulletSpeed = 6;
        let vx = 0, vy = 0;
        if (this.direction === 'up') vy = -bulletSpeed;
        else if (this.direction === 'down') vy = bulletSpeed;
        else if (this.direction === 'left') vx = -bulletSpeed;
        else if (this.direction === 'right') vx = bulletSpeed;
        return { x: cx, y: cy, vx, vy, attack: this.attack, owner: this };
    }

    getBounds() {
        return { x: this.x, y: this.y, w: this.width, h: this.height };
    }
}
