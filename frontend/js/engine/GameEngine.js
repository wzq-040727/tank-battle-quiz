export const GameState = {
    MENU: 'menu',
    PLAYING: 'playing',
    QUIZ: 'quiz',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver',
    WIN: 'win'
};

export class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.state = GameState.MENU;
        this.score = 0;
        this.lastTime = 0;
        this.systems = [];
    }

    addSystem(system) {
        this.systems.push(system);
    }

    start() {
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop.bind(this));
    }

    loop(timestamp) {
        const dt = timestamp - this.lastTime;
        this.lastTime = timestamp;

        if (this.state === GameState.PLAYING) {
            for (const sys of this.systems) {
                if (sys.update) sys.update(dt);
            }
        }

        for (const sys of this.systems) {
            if (sys.render) sys.render(this.ctx);
        }

        requestAnimationFrame(this.loop.bind(this));
    }

    setState(newState) { this.state = newState; }
    getState() { return this.state; }
    addScore(pts) { this.score += pts; }
    getScore() { return this.score; }
    resetScore() { this.score = 0; }
}
