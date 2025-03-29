import { Point } from 'pixi.js';
import Tank from '../Tank';

export default class Enemy extends Tank {
  constructor(...args) {
    super(...args);
    this.initialPosition();
    // this.setRandomDirection();
    this.changeDirectionInterval = 2000;
    this.intervalId = setInterval(
      () => this.setRandomDirection(),
      this.changeDirectionInterval
    );
  }

  initialPosition() {
    const possibleStartPositions = [
      new Point(this.stageWidth / 4, this.view.height / 2),
      new Point((this.stageWidth / 4) * 3, this.view.height / 2),
      new Point(this.stageWidth / 4, this.stageHeight - this.view.height / 2),
      new Point(
        (this.stageWidth / 4) * 3,
        this.stageHeight - this.view.height / 2
      ),
    ];

    const initialPosition =
      possibleStartPositions[
        Math.floor(Math.random() * possibleStartPositions.length)
      ];
    console.log(
      `enemy Initial position ${(initialPosition.x, initialPosition.y)}`
    );
    this._view.x = initialPosition.x;
    this._view.y = initialPosition.y;
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
      console.log('direction === 0');
      this.isMoving = false;
      return;
    }

    if (this.isNearBorder) {
      direction = -initialDirection;
    }
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
    clearInterval(this.intervalId);
  };

  // update = () => {
  //   this.updateBullets();
  //   this.movingBehavior();
  // };
}
