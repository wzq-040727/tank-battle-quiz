import { CELL_SIZE } from '../map/maps.js';

export class QuizItem {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CELL_SIZE;
        this.height = CELL_SIZE;
        this.active = true;
    }

    getBounds() {
        return { x: this.x, y: this.y, w: this.width, h: this.height };
    }
}
