import { Container, Sprite, Point, Assets } from 'pixi.js';
import Bullet from '../Bullet';
import { TYPE, ASSETS_COLORS } from '../../constants';
export default class Tank extends Container {
  constructor({
    stageDimensions,
    speed = 1,
    rotationSpeed = 0.05,
    position = { x: 50, y: 150 },
    color,
    isPlayerOwned,
    mapSize = {},
    mapContainer = {},
  }) {
    super();
    this.loadAssets(color);

    this.x = position.x;
    this.y = position.y;
    this.isPlayerOwned = isPlayerOwned;
    this.mapContainer = mapContainer;
    this.mapSize = mapSize;
    this.stageWidth = stageDimensions.width;
    this.stageHeight = stageDimensions.height;
    this.mapSize = mapSize;
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
    this.color = color;
  }

  shoot = () => {
    const barrelGlobalPosition = this.barrel.toGlobal(
      // для отвязки пули от движения танка
      new Point(0, this.barrel.height)
    );
    const bulletLocalPos = this.parent.toLocal(barrelGlobalPosition);
    const bullet = new Bullet(this.rotation, this.bulletType, this.color);
    bullet.x = bulletLocalPos.x;
    bullet.y = bulletLocalPos.y;
    this.parent.addChild(bullet); // для привязки пули к сцене а не танку
    this.bullets.push(bullet);
  };

  outOfBounds = (x, y) => {
    return x < 0 || x > this.mapSize.width || y < 0 || y > this.mapSize.height;
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
        if (this.isPlayerOwned) {
          this.checkViewArea(newX, newY);
        }
      } else {
        if (this.initialMovement) {
          // враги выезжают из-зза экрана
          this.x = newX;
          this.y = newY;
        }
      }
    }
  };

  checkViewArea = (tankX, tankY) => {
    let desiredOffsetX = -tankX + this.stageWidth / 2;
    let desiredOffsetY = -tankY + this.stageHeight / 2;

    desiredOffsetX = Math.min(
      0,
      Math.max(desiredOffsetX, -(this.mapSize.width - this.stageWidth))
    );
    desiredOffsetY = Math.min(
      0,
      Math.max(desiredOffsetY, -(this.mapSize.height - this.stageHeight))
    );

    this.mapContainer.x = desiredOffsetX;
    this.mapContainer.y = desiredOffsetY;
  };

  calculateShortestRotation = (currentAngle, targetAngle) => {
    const delta = (targetAngle - currentAngle + Math.PI * 2) % (Math.PI * 2);
    return delta > Math.PI ? delta - Math.PI * 2 : delta;
  };

  updateBullets = () => {
    if (this.bullets.length) {
      this.bullets = this.bullets.filter((bullet) => {
        if (bullet.destroyed) {
          bullet.parent.removeChild(bullet);
          bullet.destroy();
          return false;
        }
        bullet.update();
        if (this.outOfBounds(bullet.x, bullet.y)) {
          bullet.parent.removeChild(bullet);
          bullet.destroy();
          return false;
        }
        return true;
      });
    }
  };

  update() {
    this.updateBullets();

    if (this.isMoving) {
      this.movingBehavior();
    }
  }

  selfDestroy() {
    if (this.bullets && this.bullets.length) {
      this.bullets.forEach((e) => e.destroy());
      this.bullets = [];
    }

    if (this.parent) {
      this.parent.removeChild(this);
    }

    this.destroy();
  }

  async loadAssets(color = ASSETS_COLORS.red) {
    await Assets.loadBundle(`tank-${color}`);

    const bodyTexture = Assets.get(`body-${color}`);
    const barrelTexture = Assets.get(`barrel-${color}`);

    if (!bodyTexture || !barrelTexture) {
      console.error('no such textures');
      return;
    }

    this.body = new Sprite(bodyTexture);
    this.barrel = new Sprite(barrelTexture);

    this.body.anchor.set(0.5);
    this.barrel.anchor.set(0.5, 0);

    this.addChild(this.body);
    this.addChild(this.barrel);
  }
}
