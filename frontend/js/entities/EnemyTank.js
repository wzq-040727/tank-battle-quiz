import { Tank } from './Tank.js';

export const EnemyType = {
    NORMAL: 'normal',
    ELITE: 'elite'
};

export class EnemyTank extends Tank {
    constructor(x, y, type = EnemyType.NORMAL) {
        const config = type === EnemyType.ELITE
            ? { hp: 60, attack: 10, speed: 2, color: '#e74c3c', turretColor: '#ff6b6b', cooldownTime: 800 }
            : { hp: 30, attack: 5, speed: 2, color: '#f0a500', turretColor: '#ffd93d', cooldownTime: 1200 };
        super(x, y, config);
        this.type = type;
        this.aiTimer = 0;
        this.aiDirection = this.randomDirection();
        this.aiChangeInterval = 2000 + Math.random() * 2000;
    }

    randomDirection() {
        const dirs = ['up', 'down', 'left', 'right'];
        return dirs[Math.floor(Math.random() * dirs.length)];
    }

    updateAI(dt, playerX, playerY, mapGen) {
        this.aiTimer += dt;

        if (this.type === EnemyType.ELITE) {
            const dx = playerX - this.x;
            const dy = playerY - this.y;
            if (Math.abs(dx) > Math.abs(dy)) {
                this.aiDirection = dx > 0 ? 'right' : 'left';
            } else {
                this.aiDirection = dy > 0 ? 'down' : 'up';
            }
        } else {
            if (this.aiTimer >= this.aiChangeInterval) {
                this.aiTimer = 0;
                this.aiDirection = this.randomDirection();
                this.aiChangeInterval = 2000 + Math.random() * 2000;
            }
        }

        this.direction = this.aiDirection;

        let nx = this.x, ny = this.y;
        if (this.direction === 'up') ny -= this.speed;
        else if (this.direction === 'down') ny += this.speed;
        else if (this.direction === 'left') nx -= this.speed;
        else if (this.direction === 'right') nx += this.speed;

        if (!mapGen.isWallAtPixel(nx, ny) &&
            !mapGen.isWallAtPixel(nx + this.width - 1, ny) &&
            !mapGen.isWallAtPixel(nx, ny + this.height - 1) &&
            !mapGen.isWallAtPixel(nx + this.width - 1, ny + this.height - 1)) {
            this.x = nx;
            this.y = ny;
        } else {
            this.aiDirection = this.randomDirection();
        }
    }

    shouldShoot(playerX, playerY) {
        const dx = Math.abs(playerX - this.x);
        const dy = Math.abs(playerY - this.y);
        if (this.direction === 'up' || this.direction === 'down') {
            return dx < 40 && dy < 300;
        }
        return dy < 40 && dx < 300;
    }
}
