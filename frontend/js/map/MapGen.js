import { mapTemplates, CELL_SIZE, COLS, ROWS } from './maps.js';

export class MapGen {
    constructor() {
        this.grid = null;
        this.playerSpawn = null;
        this.enemySpawns = [];
        this.quizItemSpawns = [];
    }

    loadRandomMap() {
        const template = mapTemplates[Math.floor(Math.random() * mapTemplates.length)];
        this.grid = template.grid.map(row => [...row]);
        this.playerSpawn = null;
        this.enemySpawns = [];
        this.quizItemSpawns = [];

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const cell = this.grid[r][c];
                if (cell === 2) {
                    this.playerSpawn = { x: c * CELL_SIZE, y: r * CELL_SIZE };
                    this.grid[r][c] = 0;
                } else if (cell === 3) {
                    this.enemySpawns.push({ x: c * CELL_SIZE, y: r * CELL_SIZE });
                    this.grid[r][c] = 0;
                } else if (cell === 4) {
                    this.quizItemSpawns.push({ x: c * CELL_SIZE, y: r * CELL_SIZE });
                    this.grid[r][c] = 0;
                }
            }
        }
    }

    isWall(col, row) {
        if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return true;
        return this.grid[row][col] === 1;
    }

    isWallAtPixel(px, py) {
        const col = Math.floor(px / CELL_SIZE);
        const row = Math.floor(py / CELL_SIZE);
        return this.isWall(col, row);
    }

    getPlayerSpawn() { return this.playerSpawn; }
    getEnemySpawns() { return this.enemySpawns; }
    getQuizItemSpawns() { return this.quizItemSpawns; }
    getGrid() { return this.grid; }
}
