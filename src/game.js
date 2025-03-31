import createGroundTextures from './Entities/Ground';
import {
  addKeyboardListener,
  isCollision,
  keyDownHandler,
  keyUpHandler,
  menuControls,
  getRandomNumber,
  removeKeyboardListener,
} from './utils';
import {
  addGameListener,
  canvasContextMenu,
  canvasMouseDown,
  canvasMouseMove,
  canvasMouseUp,
  removeGameListener,
} from './utils/mouse-control';
import Tank from './Entities/Tank';
import Enemy from './Entities/Enemy';
import ExplosionFabric from './Entities/Explosion';
import Score from './Entities/Score';
import TitleText from './Entities/Title';
import { ASSETS_COLORS, TYPE } from './constants';
import EnemyIndicator from './Entities/UI/EnemyIndicator';
import Mammoth from './Entities/Enemy/Boss';

export default class Game {
  constructor(app) {
    this.app = app;
    this.stage = app.stage;
    this.stageDimensions = this.stage.getBounds();

    this.defaultTankProperties = {
      stageDimensions: this.stageDimensions,
    };

    this.gridSize = 100;
    this.grid = new Map();
    this.scoreMeter = new Score();
    this.explosion = new ExplosionFabric();
    this.tank = new Tank(this.defaultTankProperties);
    this.initalEnemyAmount = 4;
    this.enemyAmount = 8;
    this.enemyIndicator = new EnemyIndicator({
      amount: this.enemyAmount,
      x: this.stageDimensions.width,
      alignRight: true,
    });

    this.enemies = [];
    this.isBossFight = false;
    this.currentScore = 0;
    this.gameOverText = null;
    this.start();
  }

  start = () => {
    this.addEnemy(this.initalEnemyAmount);
    if (this.gameOverText) {
      // сделать разделение на инициализацию и перезапуск
      this.currentScore = 0;
      this.scoreMeter.score = 0;
      this.stage.removeChild(this.gameOverText);
      this.tank = new Tank(this.defaultTankProperties);
    }
    this.stage.addChild(this.enemyIndicator);
    this.stage.addChild(this.tank);
    this.stage.addChild(this.scoreMeter);

    removeKeyboardListener('keydown', this);
    addKeyboardListener('keydown', keyDownHandler, this);
    addKeyboardListener('keyup', keyUpHandler, this);
    addGameListener('contextmenu', canvasContextMenu, this);
    addGameListener('mousedown', canvasMouseDown, this);
    addGameListener('mouseup', canvasMouseUp, this);
    addGameListener('mousemove', canvasMouseMove, this);
  };

  gameOver = () => {
    this.gameOverText = new TitleText({
      x: this.stage.width / 2,
      y: this.stage.height / 2,
      text: `GAME OVER \nScore: ${this.currentScore}`,
    });

    this.stage.removeChild(this.scoreMeter);
    this.stage.addChild(this.gameOverText);
    removeKeyboardListener('keydown', this);
    removeKeyboardListener('keyup', this);
    removeGameListener('contextmenu', this);
    removeGameListener('mousedown', this);
    removeGameListener('mouseup', this);
    removeGameListener('mousemove', this);
    addKeyboardListener('keydown', menuControls, this);
  };

  update = () => {
    if (this.tank) {
      this.tank.update();
    }
    if (this.enemies.length && this.tank) {
      this.updateCollision();
    }
  };

  destroyTank = (tank, index) => {
    const { x, y, width, height } = tank;
    const explosionX = x - width;
    const explosionY = y - height;

    const explosion = this.explosion.createAnimation({
      x: explosionX,
      y: explosionY,
    });

    this.stage.addChild(explosion);

    if (index !== -1) {
      if (this.enemies.length < 4 && this.enemyAmount > 0) {
        this.enemyAmount--;
        this.addEnemy();
        this.enemyIndicator.update();
      }

      this.currentScore += 100;
      this.scoreMeter.score = this.currentScore;
      tank.selfDestroy();
      this.enemies = this.enemies.filter((e) => e !== tank);
      if (!this.enemies.length && !this.isBossFight) {
        this.isBossFight = true;
        this.addEnemyBoss();
      } else if (!this.enemies.length && this.isBossFight) {
        this.isBossFight = false;
        setTimeout(() => alert('You WIN!'), 1000);
      }
    } else {
      this.stage.addChild(
        this.explosion.createAnimation({
          x: this.tank.x,
          y: this.tank.y,
        })
      );

      this.gameOver();
      this.tank.selfDestroy();
      this.tank = null;

      this.enemies.forEach((enemy) => {
        this.stage.addChild(
          this.explosion.createAnimation({
            x: enemy.x,
            y: enemy.y,
          })
        );
        enemy.selfDestroy();
      });

      this.enemies = [];
    }
  };

  addEnemy = (amount = 1) => {
    // if amount > 4 tanks will stack at initial positions cause only 4 spawn points
    for (let index = 1; index <= amount; index++) {
      const color = Object.keys(ASSETS_COLORS)[getRandomNumber(0, 4)];
      const enemy = new Enemy({
        ...this.defaultTankProperties,
        speed: 0.5,
        startPosition: amount > 1 ? index : null,
        color,
      });
      this.enemies.push(enemy);
      this.stage.addChild(enemy);
    }
  };

  addEnemyBoss = () => {
    const enemy = new Mammoth({
      ...this.defaultTankProperties,
    });
    this.enemies.push(enemy);
    this.stage.addChild(enemy);
  };

  addToGrid(obj) {
    const startX = Math.floor(obj.x / this.gridSize);
    const startY = Math.floor(obj.y / this.gridSize);
    const endX = Math.floor((obj.x + obj.width) / this.gridSize);
    const endY = Math.floor((obj.y + obj.height) / this.gridSize);

    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        const key = `${x},${y}`;
        if (!this.grid.has(key)) this.grid.set(key, []);
        this.grid.get(key).push(obj);
      }
    }
  }

  checkCollisions() {
    for (const [key, objects] of this.grid.entries()) {
      const [x, y] = key.split(',').map(Number);

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const neighborKey = `${x + dx},${y + dy}`;
          if (!this.grid.has(neighborKey)) continue;

          const neighborObjects = this.grid.get(neighborKey);

          for (let i = 0; i < objects.length; i++) {
            for (let j = 0; j < neighborObjects.length; j++) {
              if (objects[i] !== neighborObjects[j]) {
                if (isCollision(objects[i], neighborObjects[j])) {
                  switch (objects[i].type + neighborObjects[j].type) {
                    case `${TYPE.bullets.player}${TYPE.tank.enemy}`:
                      return this.destroyTank(neighborObjects[j]);
                    case `${TYPE.tank.enemy}${TYPE.bullets.player}`:
                      return this.destroyTank(objects[i]);
                    case `${TYPE.tank.player}${TYPE.bullets.enemy}`:
                    case `${TYPE.bullets.enemy}${TYPE.tank.player}`:
                      return this.destroyTank(this.tank, -1);
                    case `${TYPE.tank.enemy}${TYPE.tank.enemy}`:
                      objects[i].movingDirection = 'drivingLeft';
                      return (neighborObjects[j].movingDirection =
                        'drivingRight');
                    case `${TYPE.tank.enemy}${TYPE.tank.player}`:
                    case `${TYPE.tank.player}${TYPE.tank.enemy}`:
                      objects[i].isMoving = false;
                      neighborObjects[j].isMoving = false;
                    default:
                      break;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  updateCollision() {
    this.grid.clear();
    this.enemies.forEach((enemy) => {
      this.addToGrid(enemy);

      enemy.update();
      if (enemy.bullets) {
        enemy.bullets.forEach((bullet) => this.addToGrid(bullet));
      }
    });

    if (this.tank) {
      this.tank.bullets.forEach((bullet) => {
        this.addToGrid(bullet);
      });

      this.addToGrid(this.tank);
    }

    this.checkCollisions();
  }

  getTankCoordinates = () => {
    if (!this.tank) return null;
    return {
      x: this.tank.x,
      y: this.tank.y,
    };
  };
}
