import { Sprite } from 'pixi.js';

export default class Bullet {
  _speed = 3;

  constructor(texture, x, y, direction) {
    this.sprite = new Sprite(texture);
    this.sprite.x = x;
    this.sprite.y = y;
    this.direction = direction;
    this.rotation = direction;
  }

  get view() {
    return this.bullet;
  }

  update = () => {
    this.sprite.x -= Math.sin(this.direction) * this._speed;
    this.sprite.y += Math.cos(this.direction) * this._speed;
  };
}
