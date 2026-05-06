import { GameEngine, GameState } from './engine/GameEngine.js';
import { InputMgr } from './engine/InputMgr.js';
import { CollisionMgr } from './engine/CollisionMgr.js';
import { MapGen } from './map/MapGen.js';
import { Renderer } from './ui/Renderer.js';
import { PlayerTank } from './entities/PlayerTank.js';
import { EnemyTank, EnemyType } from './entities/EnemyTank.js';
import { Bullet } from './entities/Bullet.js';
import { QuizItem } from './entities/QuizItem.js';
import { QuizModule } from './quiz/QuizModule.js';
import { NotebookUI } from './ui/Notebook.js';

// --- Init ---
const canvas = document.getElementById('game-canvas');
const engine = new GameEngine(canvas);
const input = new InputMgr();
const mapGen = new MapGen();
const renderer = new Renderer(canvas, mapGen);
const quizModule = new QuizModule();
const notebookUI = new NotebookUI();

let player = null;
let enemies = [];
let bullets = [];
let quizItems = [];
let quizCorrect = 0;
let quizWrong = 0;
let totalEnemies = 0;
let isPausedForQuiz = false;

// --- Menu ---
const menuOverlay = document.getElementById('menu-overlay');
const btnStart = document.getElementById('btn-start');
const btnNotebook = document.getElementById('btn-notebook');

btnStart.addEventListener('click', startGame);
btnNotebook.addEventListener('click', () => notebookUI.show());

document.getElementById('btn-restart').addEventListener('click', () => {
    document.getElementById('gameover-overlay').classList.add('hidden');
    startGame();
});

document.getElementById('btn-back-menu').addEventListener('click', () => {
    document.getElementById('gameover-overlay').classList.add('hidden');
    menuOverlay.classList.remove('hidden');
    engine.setState(GameState.MENU);
});

// --- Quiz Events ---
quizModule.bindEvents();
quizModule.onAnswer = (isCorrect, q) => {
    if (isCorrect) {
        player.addAttack(5);
        engine.addScore(50);
        quizCorrect++;
    } else {
        player.takeDamage(10);
        quizWrong++;
    }
};
quizModule.onContinue = () => {
    isPausedForQuiz = false;
    engine.setState(GameState.PLAYING);
    if (!player.alive) {
        showGameOver(false);
    }
};

// --- Game Functions ---
function startGame() {
    const name = document.getElementById('player-name').value.trim();
    if (!name) { alert('请输入昵称'); return; }
    window.playerName = name;

    menuOverlay.classList.add('hidden');
    resetGame();
    engine.setState(GameState.PLAYING);
    if (!engine._started) {
        engine._started = true;
        engine.start();
    }
}

function resetGame() {
    mapGen.loadRandomMap();

    player = new PlayerTank(mapGen.getPlayerSpawn().x, mapGen.getPlayerSpawn().y);
    enemies = [];
    bullets = [];
    quizItems = [];
    quizCorrect = 0;
    quizWrong = 0;
    engine.resetScore();
    isPausedForQuiz = false;

    const spawns = mapGen.getEnemySpawns();
    totalEnemies = spawns.length;
    spawns.forEach((pos, i) => {
        const type = i === 0 ? EnemyType.ELITE : EnemyType.NORMAL;
        enemies.push(new EnemyTank(pos.x, pos.y, type));
    });

    mapGen.getQuizItemSpawns().forEach(pos => {
        quizItems.push(new QuizItem(pos.x, pos.y));
    });
}

function showGameOver(isWin) {
    engine.setState(isWin ? GameState.WIN : GameState.GAME_OVER);
    const overlay = document.getElementById('gameover-overlay');
    const title = document.getElementById('gameover-title');
    const stats = document.getElementById('gameover-stats');
    title.textContent = isWin ? '胜利！' : '游戏结束';
    title.style.color = isWin ? '#4ecca3' : '#e74c3c';
    const killed = totalEnemies - enemies.filter(e => e.alive).length;
    stats.innerHTML = `
        <p style="color:#fff;margin:8px 0">得分: ${engine.getScore()}</p>
        <p style="color:#fff;margin:8px 0">消灭敌方: ${killed}/${totalEnemies}</p>
        <p style="color:#4ecca3;margin:8px 0">答对: ${quizCorrect}题</p>
        <p style="color:#e74c3c;margin:8px 0">答错: ${quizWrong}题</p>
    `;
    overlay.classList.remove('hidden');
}

function triggerQuiz(difficulty) {
    isPausedForQuiz = true;
    engine.setState(GameState.QUIZ);
    quizModule.triggerQuiz(difficulty);
}

// --- Game Loop Integration ---
function gameUpdate(dt) {
    if (isPausedForQuiz) return;

    // Player movement
    let dx = 0, dy = 0;
    if (input.isDown('KeyW') || input.isDown('ArrowUp')) { dy = -player.speed; player.direction = 'up'; }
    else if (input.isDown('KeyS') || input.isDown('ArrowDown')) { dy = player.speed; player.direction = 'down'; }
    else if (input.isDown('KeyA') || input.isDown('ArrowLeft')) { dx = -player.speed; player.direction = 'left'; }
    else if (input.isDown('KeyD') || input.isDown('ArrowRight')) { dx = player.speed; player.direction = 'right'; }

    if (dx !== 0 || dy !== 0) {
        const nx = player.x + dx;
        const ny = player.y + dy;
        if (CollisionMgr.tankCanMove(player, mapGen, nx, ny)) {
            player.x = nx;
            player.y = ny;
        }
    }

    // Player shoot
    if (input.wasJustPressed('Space') && player.canShoot(Date.now())) {
        const b = player.shoot(Date.now());
        bullets.push(new Bullet(b.x, b.y, b.vx, b.vy, b.attack, b.owner));
    }

    // Enemy AI
    for (const enemy of enemies) {
        if (!enemy.alive) continue;
        enemy.updateAI(dt, player.x, player.y, mapGen);
        if (enemy.canShoot(Date.now()) && enemy.shouldShoot(player.x, player.y)) {
            const b = enemy.shoot(Date.now());
            bullets.push(new Bullet(b.x, b.y, b.vx, b.vy, b.attack, b.owner));
        }
    }

    // Bullets update
    for (const bullet of bullets) {
        if (!bullet.alive) continue;
        bullet.update(dt);

        // Wall collision
        if (CollisionMgr.bulletHitWall(bullet, mapGen)) {
            bullet.alive = false;
            continue;
        }

        // Hit player
        if (bullet.owner !== player && CollisionMgr.bulletHitTank(bullet, player)) {
            player.takeDamage(bullet.attack);
            bullet.alive = false;
            if (!player.alive) {
                showGameOver(false);
                return;
            }
            continue;
        }

        // Hit enemies
        for (const enemy of enemies) {
            if (bullet.owner === enemy || !enemy.alive) continue;
            if (CollisionMgr.bulletHitTank(bullet, enemy)) {
                enemy.takeDamage(bullet.attack);
                bullet.alive = false;
                if (!enemy.alive) {
                    engine.addScore(enemy.type === EnemyType.ELITE ? 100 : 50);
                    // Trigger quiz on kill
                    const diff = enemy.type === EnemyType.ELITE ? 'hard' : null;
                    triggerQuiz(diff);
                }
                break;
            }
        }
    }

    // Quiz items collision
    for (const item of quizItems) {
        if (!item.active) continue;
        if (CollisionMgr.tankHitItem(player, item)) {
            item.active = false;
            triggerQuiz(null);
        }
    }

    // Clean dead bullets
    bullets = bullets.filter(b => b.alive);

    // Win condition
    if (enemies.every(e => !e.alive)) {
        showGameOver(true);
    }
}

function gameRender(ctx) {
    renderer.clear();
    renderer.renderMap();

    for (const item of quizItems) renderer.renderQuizItem(item);
    for (const enemy of enemies) renderer.renderTank(enemy);
    renderer.renderTank(player);
    for (const bullet of bullets) renderer.renderBullet(bullet);

    const aliveEnemies = enemies.filter(e => e.alive).length;
    renderer.renderHUD(player, aliveEnemies, totalEnemies, engine.getScore());
}

// Register systems
engine.addSystem({ update: gameUpdate, render: gameRender });
