import { Sprite } from 'pixi.js';

export default class Bullet {
  _speed = 3;

  constructor(texture, direction) {
    this.sprite = new Sprite(texture);
    this.sprite.x = 0;
    this.sprite.y = 0;
    this.direction = direction;
    this.sprite.rotation = direction;
  }
  get view() {
    return this.bullet;
  }

  update = () => {
    this.sprite.x -= Math.sin(this.direction) * this._speed;
    this.sprite.y += Math.cos(this.direction) * this._speed;
  };
}
