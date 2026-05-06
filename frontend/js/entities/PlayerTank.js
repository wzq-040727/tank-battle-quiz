import { Tank } from './Tank.js';

export class PlayerTank extends Tank {
    constructor(x, y) {
        super(x, y, { hp: 100, attack: 10, speed: 3, color: '#4ecca3', turretColor: '#fff' });
    }

    addAttack(pts) { this.attack += pts; }
}
