import { Container, Sprite, Texture } from 'pixi.js';
import Bullet from './Bullet';

export default class Tank {
  constructor(props) {
    const { body, barrel, bullet, position, stageDimensions } = props;

    this._view = new Container();
    this._view.x = position.x;
    this._view.y = position.y;

    this._body = new Sprite(body.texture);
    this._body.anchor.set(0.5);
    this._view.addChild(this._body);

    this._barrel = new Sprite(barrel.texture);
    this._barrel.anchor.set(0.5, 0);
    this._view.addChild(this._barrel);
    this.stageWidth = stageDimensions.width;
    this.stageHeight = stageDimensions.height;
    this.bulletTexture = bullet.texture;

    this.bullets = [];
  }

  get view() {
    return this._view;
  }

  set x(num) {
    this._view.x = num;
  }
  set y(num) {
    this._view.y = num;
  }

  shoot = () => {
    const bullet = new Bullet(
      this.bulletTexture,
      0,
      this._barrel.height,
      this._view.rotation
    );
    this._barrel.addChild(bullet.sprite);
    this.bullets.push(bullet);
  };

  outOfBounds = (x, y) => {
    return x < 0 || x > this.stageWidth || y < 0 || y > this.stageHeight;
  };

  update = () => {
    if (this.bullets.length) {
      this.bullets = this.bullets.filter((bullet) => {
        bullet.update();
        if (this.outOfBounds(bullet.sprite.x, bullet.sprite.y)) {
          bullet.sprite.destroy();
          return false;
        }
        return true;
      });
    }
  };
}
