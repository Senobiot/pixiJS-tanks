import { Assets, AnimatedSprite } from 'pixi.js';

export default class ExplosionFabric {
  constructor() {
    this.explosionTextures = [];
    this.loadAssets();
  }

  async loadAssets() {
    await Assets.loadBundle('explosion');
    for (let i = 1; i <= 5; i++) {
      this.explosionTextures.push(Assets.get(`explosionFrame${i}`));
    }
    console.log(this.explosionTextures);
  }
  createAnimation({ x, y, speed = 0.15, loop = false }) {
    if (!this.explosionTextures || this.explosionTextures.length === 0) {
      return;
    }

    const animation = new AnimatedSprite(this.explosionTextures);
    animation.x = x;
    animation.y = y;
    animation.animationSpeed = speed;
    animation.loop = loop;
    animation.play();

    animation.onComplete = () => {
      animation.destroy();
    };

    return animation;
  }
}
