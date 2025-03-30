import { Sprite } from 'pixi.js';

export default class Bullet extends Sprite {
  _speed = 3;

  constructor(texture, direction, type) {
    super(texture);
    this.x = 0;
    this.y = 0;
    this.direction = direction;
    this.rotation = direction;
    this.type = type;
  }

  update = () => {
    this.x -= Math.sin(this.direction) * this._speed;
    this.y += Math.cos(this.direction) * this._speed;
  };
}
