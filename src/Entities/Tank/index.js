import { Container, Sprite, Point } from 'pixi.js';
import Bullet from '../Bullet';
import { TYPE } from '../../constants';
export default class Tank extends Container {
  constructor({
    body,
    barrel,
    bullet,
    position,
    stageDimensions,
    speed = 1,
    rotationSpeed = 0.05,
  }) {
    super();
    this.x = position.x;
    this.y = position.y;

    this.body = new Sprite(body.texture);
    this.body.anchor.set(0.5);
    this.addChild(this.body);

    this.barrel = new Sprite(barrel.texture);
    this.barrel.anchor.set(0.5, 0);

    this.addChild(this.barrel);
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
    this.type = TYPE.tank.player;
    this.bulletType = TYPE.bullets.player;
    this.rotationSpeed = rotationSpeed;
  }

  shoot = () => {
    const barrelGlobalPosition = this.barrel.toGlobal(
      // для отвязки пули от движения танка
      new Point(0, this.barrel.height)
    );

    const bullet = new Bullet(
      this.bulletTexture,
      this.rotation,
      this.bulletType
    );

    bullet.x = barrelGlobalPosition.x;
    bullet.y = barrelGlobalPosition.y;
    this.parent.addChild(bullet); // для привязки пули к сцене а не танку
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
      this.rotation,
      target.angle
    );

    if (Math.abs(rotationDelta) > 0.01) {
      this.rotation +=
        Math.sign(rotationDelta) *
        Math.min(Math.abs(rotationDelta), this.rotationSpeed);
    } else {
      const newX = this.x + this.speed * target.x;
      const newY = this.y + this.speed * target.y;

      if (
        !this.outOfBounds(
          newX + (target.x * this.width) / 2,
          newY + (target.y * this.height) / 2
        )
      ) {
        this.x = newX;
        this.y = newY;
        this.isNearBorder = false;
      } else {
        this.isNearBorder = true;
      }
    }
  };

  calculateShortestRotation = (currentAngle, targetAngle) => {
    const delta = (targetAngle - currentAngle + Math.PI * 2) % (Math.PI * 2);
    return delta > Math.PI ? delta - Math.PI * 2 : delta;
  };

  updateBullets = () => {
    if (this.bullets.length) {
      this.bullets = this.bullets.filter((bullet) => {
        bullet.update();
        if (this.outOfBounds(bullet.x, bullet.y)) {
          bullet.destroy();
          return false;
        }
        return true;
      });
    }
  };

  update = () => {
    this.updateBullets();

    if (this.isMoving) {
      this.movingBehavior();
    }
  };

  selfDestroy() {
    if (this.bullets.length) {
      this.bullets.forEach((e) => e.destroy());
      this.bullets = [];
    }
    this.destroy();
  }
}
