import { Container, Sprite, Point } from 'pixi.js';
import Bullet from './Bullet';

export default class Tank {
  constructor(props) {
    const { body, barrel, bullet, position, stageDimensions, speed } = props;

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
    this.speed = speed || 0.5;
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

    const bullet = new Bullet(
      this.bulletTexture,
      this._barrel.x,
      this._barrel.y,
      this._view.rotation
    );
    bullet.sprite.x = barrelGlobalPosition.x;
    bullet.sprite.y = barrelGlobalPosition.y;
    this._view.parent.addChild(bullet.sprite);
    this.bullets.push(bullet);
  };

  outOfBounds = (x, y) => {
    return x < 0 || x > this.stageWidth || y < 0 || y > this.stageHeight;
  };

  movingBehavior = () => {
    const targetAngles = {
      drivingUp: Math.PI,
      drivingDown: 0,
      drivingLeft: Math.PI / 2,
      drivingRight: -Math.PI / 2,
    };

    const calculateShortestRotation = (currentAngle, targetAngle) => {
      const delta = (targetAngle - currentAngle + Math.PI * 2) % (Math.PI * 2);
      return delta > Math.PI ? delta - Math.PI * 2 : delta;
    };

    let targetAngle = null;
    switch (this.movingDirection) {
      case 'drivingLeft':
        targetAngle = targetAngles.drivingLeft;
        break;
      case 'drivingRight':
        targetAngle = targetAngles.drivingRight;
        break;
      case 'drivingUp':
        targetAngle = targetAngles.drivingUp;
        break;
      case 'drivingDown':
        targetAngle = targetAngles.drivingDown;
        break;

      default:
        break;
    }

    if (targetAngle !== null) {
      const rotationDelta = calculateShortestRotation(
        this._view.rotation,
        targetAngle
      );

      if (Math.abs(rotationDelta) > 0.01) {
        this._view.rotation +=
          Math.sign(rotationDelta) * Math.min(Math.abs(rotationDelta), 0.05);
      } else {
        switch (this.movingDirection) {
          case 'drivingLeft':
            this._view.x -= this.speed;
            break;
          case 'drivingRight':
            this._view.x += this.speed;
            break;
          case 'drivingUp':
            this._view.y -= this.speed;
            break;
          case 'drivingDown':
            this._view.y += this.speed;
            break;

          default:
            break;
        }
      }
    }
  };

  update = () => {
    if (this.bullets.length) {
      console.log(this.bullets.length);
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
