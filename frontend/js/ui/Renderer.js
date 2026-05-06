import { CELL_SIZE, COLS, ROWS } from '../map/maps.js';

export class Renderer {
    constructor(canvas, mapGen) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.mapGen = mapGen;
    }

    renderMap() {
        const grid = this.mapGen.getGrid();
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const x = c * CELL_SIZE;
                const y = r * CELL_SIZE;
                if (grid[r][c] === 1) {
                    this.ctx.fillStyle = '#3a3a5c';
                    this.ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
                    this.ctx.strokeStyle = '#2a2a4c';
                    this.ctx.strokeRect(x + 0.5, y + 0.5, CELL_SIZE - 1, CELL_SIZE - 1);
                } else {
                    this.ctx.fillStyle = '#1a1a2e';
                    this.ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
                }
            }
        }
    }

    renderTank(tank) {
        if (!tank.alive) return;
        const ctx = this.ctx;
        ctx.fillStyle = tank.color;
        ctx.fillRect(tank.x + 4, tank.y + 4, tank.width - 8, tank.height - 8);

        ctx.fillStyle = tank.turretColor || '#fff';
        const cx = tank.x + tank.width / 2;
        const cy = tank.y + tank.height / 2;
        const barrelLen = 18;
        let bx = cx, by = cy;
        if (tank.direction === 'up') by = cy - barrelLen;
        else if (tank.direction === 'down') by = cy + barrelLen;
        else if (tank.direction === 'left') bx = cx - barrelLen;
        else if (tank.direction === 'right') bx = cx + barrelLen;
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = tank.turretColor || '#fff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(bx, by);
        ctx.stroke();

        // HP bar
        if (tank.hp < tank.maxHp) {
            const barW = tank.width - 8;
            const barH = 4;
            const barX = tank.x + 4;
            const barY = tank.y - 6;
            ctx.fillStyle = '#333';
            ctx.fillRect(barX, barY, barW, barH);
            ctx.fillStyle = tank.hp > tank.maxHp * 0.3 ? '#4ecca3' : '#e74c3c';
            ctx.fillRect(barX, barY, (tank.hp / tank.maxHp) * barW, barH);
        }
    }

    renderBullet(bullet) {
        if (!bullet.alive) return;
        this.ctx.fillStyle = '#f0a500';
        this.ctx.beginPath();
        this.ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
        this.ctx.fill();
    }

    renderQuizItem(item) {
        if (!item.active) return;
        const ctx = this.ctx;
        const cx = item.x + CELL_SIZE / 2;
        const cy = item.y + CELL_SIZE / 2;
        // Glow effect
        const time = Date.now() / 500;
        const alpha = 0.5 + 0.3 * Math.sin(time);
        ctx.fillStyle = `rgba(240, 165, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', cx, cy);
    }

    renderHUD(player, enemyCount, totalEnemies, score) {
        const ctx = this.ctx;
        ctx.fillStyle = '#333';
        ctx.fillRect(10, 10, 120, 16);
        ctx.fillStyle = player.hp > 30 ? '#4ecca3' : '#e74c3c';
        ctx.fillRect(10, 10, Math.max(0, (player.hp / player.maxHp) * 120), 16);
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`HP: ${player.hp}/${player.maxHp}`, 14, 23);
        ctx.fillText(`ATK: ${player.attack}`, 150, 23);
        ctx.fillText(`Enemies: ${enemyCount}/${totalEnemies}`, 240, 23);
        ctx.fillText(`Score: ${score}`, 380, 23);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
