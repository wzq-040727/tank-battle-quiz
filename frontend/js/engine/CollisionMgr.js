export class CollisionMgr {
    static rectsOverlap(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x &&
               a.y < b.y + b.h && a.y + a.h > b.y;
    }

    static bulletHitTank(bullet, tank) {
        if (!bullet.alive || !tank.alive) return false;
        return this.rectsOverlap(bullet.getBounds(), tank.getBounds());
    }

    static bulletHitWall(bullet, mapGen) {
        if (!bullet.alive) return false;
        return mapGen.isWallAtPixel(bullet.x, bullet.y);
    }

    static tankHitItem(tank, item) {
        if (!tank.alive || !item.active) return false;
        return this.rectsOverlap(tank.getBounds(), item.getBounds());
    }

    static tankCanMove(tank, mapGen, nx, ny) {
        return !mapGen.isWallAtPixel(nx, ny) &&
               !mapGen.isWallAtPixel(nx + tank.width - 1, ny) &&
               !mapGen.isWallAtPixel(nx, ny + tank.height - 1) &&
               !mapGen.isWallAtPixel(nx + tank.width - 1, ny + tank.height - 1);
    }
}
