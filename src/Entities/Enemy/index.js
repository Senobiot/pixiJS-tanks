import { Point } from 'pixi.js';
import Tank from '../Tank';
import { TYPE } from '../../constants';

export default class Enemy extends Tank {
  constructor({ startPosition, ...rest }) {
    super({ ...rest });
    this.type = TYPE.tank.enemy;
    this.bulletType = TYPE.bullets.enemy;
    this.changeDirectionInterval = 2000;
    this.intervalId = null;
    this.startPosition = startPosition;

    this.initialPosition();
  }

  initialPosition() {
    const possibleStartPositions = [
      new Point(this.stageWidth / 4, -this.height / 2),
      new Point((this.stageWidth / 4) * 3, -this.height / 2),
      new Point(this.stageWidth / 4, this.stageHeight + this.height / 2),
      new Point((this.stageWidth / 4) * 3, this.stageHeight + this.height / 2),
    ];

    const randomPosition =
      this.startPosition ||
      Math.floor(Math.random() * possibleStartPositions.length);

    const initialPosition = possibleStartPositions[randomPosition];

    console.log(`enemy Initial position ${initialPosition}`);
    this.x = initialPosition.x;
    this.y = initialPosition.y;
    this.movingDirection = randomPosition > 1 ? 'drivingUp' : 'drivingDown';
    this.isMoving = true;
    this.initialMovement = true;

    this.intervalId = setInterval(() => {
      this.initialMovement = false;
      this.setRandomDirection();
    }, this.changeDirectionInterval);
  }

  setRandomDirection = () => {
    this.shoot();

    const isHorizontal = Math.random() < 0.5;

    if (isHorizontal) {
      this.directionX = Math.floor(Math.random() * 3) - 1; // -1: left | 0: isMoving = false, 1: right
      this.directionY = 0;
      this.updateMovementState('X', this.directionX);
    } else {
      this.directionY = Math.floor(Math.random() * 3) - 1; // 1: up | 0: stay | 1: down
      this.directionX = 0;
      this.updateMovementState('Y', this.directionY);
    }
  };

  updateMovementState = (axis, initialDirection) => {
    let direction = initialDirection;

    if (direction === 0) {
      this.isMoving = false;
      return;
    }

    // if (this.isNearBorder) {
    //   direction = -initialDirection;
    // }
    this.isMoving = true;

    if (axis === 'X') {
      this.movingDirection = direction > 0 ? 'drivingRight' : 'drivingLeft';
      this.drivingRight = direction > 0;
      this.drivingLeft = direction < 0;
    } else {
      this.movingDirection = direction > 0 ? 'drivingDown' : 'drivingUp';
      this.drivingDown = direction > 0;
      this.drivingUp = direction < 0;
    }
  };

  selfDestroy = () => {
    super.selfDestroy();
    console.log('clearIntervals');
    clearInterval(this.intervalId);
    this.intervalId = null;
  };

  // update = () => {
  //   this.updateBullets();
  //   this.movingBehavior();
  // };
}
