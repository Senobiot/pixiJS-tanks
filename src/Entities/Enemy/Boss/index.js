import { Assets, Point, Sprite, Graphics } from 'pixi.js';
import Enemy from '..';
import Bullet from '../../Bullet';

export default class Mammoth extends Enemy {
  constructor({ speed = 0.25, ...rest } = {}) {
    super({ ...rest });
    this.changeDirectionInterval = 4000;
    this.speed = speed;
    // this.explosion = new Graphics();
    // this.explosion.position.set(0, 0);
    this.explosionFrames = 0;
    this.hit = false;
  }

  shoot = () => {
    const barrelGlobalPositions = [
      this.topBarrel.toGlobal(new Point(0, this.topBarrel.height)),
      this.leftBarrel.toGlobal(new Point(0, this.leftBarrel.height)),
      this.rightBarrel.toGlobal(new Point(0, this.rightBarrel.height)),
    ];

    barrelGlobalPositions.forEach((point) => {
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
      this.explosion.position.set(this.x, this.y);
      this.addChild(this.explosion);
    }

    this.explosion.beginFill(0xff4500, 1 - this.explosionFrames * 0.05);
    this.explosion.ellipse(this.x, this.y, 30 - this.explosionFrames * 2);
    this.explosion.endFill();

    this.explosion.beginFill(0xffff00, 1 - this.explosionFrames * 0.05);
    this.explosion.ellipse(this.x, this.y, 20 - this.explosionFrames * 2);
    this.explosion.endFill();

    this.explosionFrames++;

    if (this.explosionFrames > 15) {
      this.explosionFrames = 0;
      this.explosion.clear();
      this.explosion.destroy();
      this.explosion = null;
      this.hit = false;
    }
    console.log(this.explosion);
  };

  update() {
    console.log('Boss - super');
    console.log(this.super);
    super.update();

    if (this.hit) {
      console.log('update');
      this.updateExplosion();
    }
  }
}
