import { Assets, Point, Sprite, Graphics } from 'pixi.js';
import Enemy from '..';
import Bullet from '../../Bullet';

export default class Mammoth extends Enemy {
  constructor({ speed = 0.25, ...rest } = {}) {
    super({ ...rest });
    this.changeDirectionInterval = 4000;
    this.speed = speed;
  }

  shoot = () => {
    const barrelGlobalPositions = [
      this.topBarrel.toGlobal(new Point(0, this.topBarrel.height)),
      this.leftBarrel.toGlobal(new Point(0, this.leftBarrel.height)),
      this.rightBarrel.toGlobal(new Point(0, this.rightBarrel.height)),
    ];
    const barrelLocalPos = barrelGlobalPositions.map((barrel) =>
      this.parent.toLocal(barrel)
    );
    barrelLocalPos.forEach((point) => {
      const bullet = new Bullet(this.rotation, this.bulletType, this.color);
      bullet.x = point.x;
      bullet.y = point.y;

      this.parent.addChild(bullet);
      this.bullets.push(bullet);
    });
  };

  async loadAssets() {
    await Assets.loadBundle('tank-mammoth');

    const bodyTexture = Assets.get('body-mammoth');
    const primaryBarrelTexture = Assets.get('barrel-mammoth-1');
    const topBarrelTexture = Assets.get('barrel-mammoth-2');

    if (!bodyTexture || !primaryBarrelTexture || !topBarrelTexture) {
      console.error('no such textures');
      return;
    }

    this.body = new Sprite(bodyTexture);
    this.leftBarrel = new Sprite(primaryBarrelTexture);
    this.rightBarrel = new Sprite(primaryBarrelTexture);
    this.rightBarrel.scale.x = -1;
    this.topBarrel = new Sprite(topBarrelTexture);

    this.body.anchor.set(0.5);
    this.leftBarrel.anchor.set(0.5, 0.5);
    this.rightBarrel.anchor.set(0.5, 0.5);
    this.topBarrel.anchor.set(0.5, 0.5);

    this.leftBarrel.x = this.body.width / 2;
    this.rightBarrel.x = -this.body.width / 2;
    this.topBarrel.y = -this.body.height / 2 + 25;

    this.addChild(this.body);
    this.addChild(this.leftBarrel);
    this.addChild(this.rightBarrel);
    this.addChild(this.topBarrel);
  }

  updateExplosion = () => {
    if (!this.explosion) {
      this.explosion = new Graphics();
      this.explosionFrames = 0;

      const globalPos = this.toGlobal(new Point(0, 0));
      const localPos = this.parent.toLocal(globalPos);

      this.explosion = new Graphics();
      this.explosion.x = localPos.x;
      this.explosion.y = localPos.y;

      this.parent.addChild(this.explosion);
    }

    this.explosion
      .clear()
      .circle(0, 0, 5 * this.explosionFrames)
      .stroke({ width: 6, color: 0xfeeb77 });

    this.explosionFrames++;

    if (this.explosionFrames > 50) {
      this.explosionFrames = 0;
      this.hit = false;
      this.explosion.destroy();
      this.explosion = null;
    }
  };

  update() {
    super.update();

    if (this.hit) {
      this.updateExplosion();
    }
  }
}
