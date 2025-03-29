import { Container, Sprite, Point } from 'pixi.js';
import Bullet from '../Bullet';

export default class Tank {
  constructor({
    body,
    barrel,
    bullet,
    position,
    stageDimensions,
    speed = 1,
    rotationSpeed = 0.05,
  }) {
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
    this.isMoving = false;
    this.movingDirection = null;
    this.drivingLeft = false;
    this.drivingRight = false;
    this.drivingUp = false;
    this.drivingDown = false;
    this.bullets = [];
    this.speed = speed;
    this.rotationSpeed = rotationSpeed;
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
    const barrelGlobalPosition = this._barrel.toGlobal(
      new Point(0, this._barrel.height)
    );

    const bullet = new Bullet(this.bulletTexture, this._view.rotation);
    bullet.sprite.x = barrelGlobalPosition.x;
    bullet.sprite.y = barrelGlobalPosition.y;
    this._view.parent.addChild(bullet.sprite);
    this.bullets.push(bullet);
  };

  outOfBounds = (x, y) => {
    return x < 0 || x > this.stageWidth || y < 0 || y > this.stageHeight;
  };

  movingBehavior = () => {
    const movementMap = {
      drivingLeft: { angle: Math.PI / 2, x: -1, y: 0 },
      drivingRight: { angle: -Math.PI / 2, x: 1, y: 0 },
      drivingUp: { angle: Math.PI, x: 0, y: -1 },
      drivingDown: { angle: 0, x: 0, y: 1 },
    };

    const target = movementMap[this.movingDirection];
    if (!target) return;

    const rotationDelta = this.calculateShortestRotation(
      this._view.rotation,
      target.angle
    );

    if (Math.abs(rotationDelta) > 0.01) {
      this._view.rotation +=
        Math.sign(rotationDelta) *
        Math.min(Math.abs(rotationDelta), this.rotationSpeed);
    } else {
      const newX = this._view.x + this.speed * target.x;
      const newY = this._view.y + this.speed * target.y;

      if (
        !this.outOfBounds(
          newX + (target.x * this._view.width) / 2,
          newY + (target.y * this._view.height) / 2
        )
      ) {
        this._view.x = newX;
        this._view.y = newY;
      }
    }
  };

  calculateShortestRotation = (currentAngle, targetAngle) => {
    const delta = (targetAngle - currentAngle + Math.PI * 2) % (Math.PI * 2);
    return delta > Math.PI ? delta - Math.PI * 2 : delta;
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
    if (this.isMoving) {
      this.movingBehavior();
    }
  };
}
