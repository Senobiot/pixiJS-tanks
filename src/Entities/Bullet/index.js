import { Sprite, Texture, Assets } from 'pixi.js';
import { ASSETS_COLORS } from '../../constants';

export default class Bullet extends Sprite {
  _speed = 12;

  constructor(direction, type, color) {
    super(Texture.EMPTY);
    this.x = 0;
    this.y = 0;
    this.direction = direction;
    this.rotation = direction;
    this.type = type;
    this.loadAssets(color);
  }

  update = (deltaTime) => {
    this.x -= Math.sin(this.direction) * this._speed * deltaTime;
    this.y += Math.cos(this.direction) * this._speed * deltaTime;
  };

  async loadAssets(color = ASSETS_COLORS.red) {
    await Assets.loadBundle(`bullets`);
    const bulletTexture = Assets.get(`bullet-${color}`);

    if (!bulletTexture) {
      console.error('no such textures');
    }
    this.texture = bulletTexture;
  }
}
