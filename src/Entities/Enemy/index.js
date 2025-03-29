import { Point } from 'pixi.js';
import Tank from '../Tank';

export default class Enemy extends Tank {
  constructor(...args) {
    super(...args);
    this.initialPosition();
    this.setRandomDirection();
    this.changeDirectionInterval = 2000;
    setInterval(() => this.setRandomDirection(), this.changeDirectionInterval);
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
    const direction = Math.floor(Math.random() * 2);
    if (direction) {
      this.directionX = Math.floor(Math.random() * 3) - 1; // -1: left | 0: isMoving = false, 1: right
      if (this.directionX > 0) {
        this.isMoving = true;
        this.movingDirection = 'drivingRight';
        this.drivingRight = true;
      } else if (this.directionX < 0) {
        this.isMoving = true;
        this.movingDirection = 'drivingLeft';
        this.drivingLeft = true;
      } else {
        this.isMoving = false;
      }
      this.directionY = 0;
    } else {
      this.directionY = Math.floor(Math.random() * 3) - 1; // -1: up | 0: stay | 1: down
      if (this.directionY > 0) {
        this.isMoving = true;
        this.movingDirection = 'drivingDown';
        this.directionY = true;
      } else if (this.directionX < 0) {
        this.isMoving = true;
        this.movingDirection = 'drivingUp';
        this.drivingUp = true;
      } else {
        this.isMoving = false;
      }
      this.directionX = 0;
    }
  };

  update = () => {
    this.updateBullets();
    this.movingBehavior();
  };
}
