import { Sprite } from 'pixi.js';
import { TYPE } from '../../constants';

export default class Bullet {
  _speed = 3;

  constructor(texture, direction, type) {
    this.sprite = new Sprite(texture);
    this.sprite.x = 0;
    this.sprite.y = 0;
    this.direction = direction;
    this.sprite.rotation = direction;
    this.sprite.type = type;
  }
  get view() {
    return this.sprite;
  }

  update = () => {
    this.sprite.x -= Math.sin(this.direction) * this._speed;
    this.sprite.y += Math.cos(this.direction) * this._speed;
  };
}
