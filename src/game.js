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
  constructor(mapContainer, obstacles) {
    this.obstacles = obstacles;
    // this.app = app;
    // this.stage = app.stage;
    this.stage = mapContainer;
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
    // addGameListener('contextmenu', canvasContextMenu, this);
    // addGameListener('mousedown', canvasMouseDown, this);
    // addGameListener('mouseup', canvasMouseUp, this);
    // addGameListener('mousemove', canvasMouseMove, this);
  };

  gameOver = () => {
    this.isBossFight = false;
    this.gameOverText = new TitleText({
      x: this.stage.width / 2,
      y: this.stage.height / 2,
      text: `GAME OVER \nScore: ${this.currentScore}`,
    });

    this.stage.removeChild(this.scoreMeter);
    this.stage.addChild(this.gameOverText);
    removeKeyboardListener('keydown', this);
    removeKeyboardListener('keyup', this);
    // removeGameListener('contextmenu', this);
    // removeGameListener('mousedown', this);
    // removeGameListener('mouseup', this);
    // removeGameListener('mousemove', this);
    addKeyboardListener('keydown', menuControls, this);
  };

  update = () => {
    if (this.tank) {
      this.tank.update();
    }

    if (this.enemies.length) {
      this.enemies.forEach((enemy) => enemy.update());
    }

    if (this.tank || this.enemies.length) {
      this.updateCollision();
    }
  };

  detonate = (obj) => {
    const { x, y, width, height } = obj;
    const explosionX = x - width;
    const explosionY = y - height;

    const explosion = this.explosion.createAnimation({
      x: explosionX,
      y: explosionY,
    });

    obj.destroy();
    this.obstacles = this.obstacles.filter((e) => e !== obj);
    this.stage.addChild(explosion);
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
      tank.destroyed = true;
      this.enemies = this.enemies.filter((e) => e !== tank);
      if (!this.enemies.length && !this.isBossFight) {
        this.isBossFight = true;
        this.addEnemyBoss();
      } else if (!this.enemies.length && this.isBossFight) {
        this.isBossFight = false;
        setTimeout(() => alert('You WIN!'), 1000);
      }
    } else {
      this.gameOver();
      this.tank.selfDestroy();
      this.tank = null;
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
    this.bossArmor = 5;
  };

  updateCollision = () => {
    // player bullets VS tress
    if (this.tank) {
      this.obstacles.forEach((tree) => {
        let collision = isCollision(tree, this.tank);
        if (collision) {
          this.setCollisionAction(tree, this.tank, collision);
        }
        const playerBullets = this.tank.bullets;
        playerBullets.forEach((bullet) => {
          collision = isCollision(tree, bullet);
          if (collision) {
            this.setCollisionAction(tree, bullet);
          }
        });
      });
    }

    //enemy VS trees
    this.obstacles.forEach((tree) => {
      this.enemies.forEach((enemy) => {
        if (enemy.destroyed) return;
        const collision = isCollision(tree, enemy);
        if (collision) {
          this.setCollisionAction(tree, enemy, collision);
        }
      });
    });

    if (this.tank) {
      const playerBullets = this.tank.bullets;
      this.enemies.forEach((enemy) => {
        if (enemy.destroyed) return;

        // enemy VS player
        const collisionWithEnemy = isCollision(this.tank, enemy);
        if (collisionWithEnemy) {
          this.setCollisionAction(this.tank, enemy, collisionWithEnemy);
        }

        // enemy VS player bullets
        playerBullets.forEach((bullet) => {
          if (bullet.destroyed || enemy.destroyed) return;

          const collision = isCollision(bullet, enemy);
          if (collision) {
            this.setCollisionAction(bullet, enemy, collision);
          }
        });

        if (enemy.destroyed) return;

        // enemy bullets VS player
        enemy.bullets.forEach((bullet) => {
          const collision = isCollision(bullet, this.tank);
          if (collision) {
            this.setCollisionAction(bullet, this.tank);
          }
        });
      });

      // enemy bullets VS trees
      this.enemies.forEach((enemy) => {
        enemy.bullets.forEach((bullet) => {
          this.obstacles.forEach((tree) => {
            const collision = isCollision(tree, bullet);
            if (collision) {
              this.setCollisionAction(tree, bullet);
            }
          });
        });
      });

      // enemy VS enemy
      for (let i = 0; i < this.enemies.length; i++) {
        const enemyA = this.enemies[i];
        if (enemyA.destroyed) continue;
        for (let j = i + 1; j < this.enemies.length; j++) {
          const enemyB = this.enemies[j];
          if (enemyB.destroyed) continue;
          const collision = isCollision(enemyA, enemyB);
          if (collision) {
            this.setCollisionAction(enemyA, enemyB, collision);
          }
        }
      }
    }
  };

  setCollisionAction = (obj1, obj2, side) => {
    const {
      tank: { player: playerTank, enemy: enemyTank },
      bullets: { player: playerBullet, enemy: enemyBullet },
      obstacles: { tree },
    } = TYPE;

    switch (obj1.type + obj2.type) {
      case tree + playerTank:
      case tree + enemyTank:
        if (side === 'left') obj2.x += 1;
        if (side === 'right') obj2.x -= 1;
        if (side === 'top') obj2.y += 1;
        if (side === 'bottom') obj2.y -= 1;
        break;

      case tree + playerBullet:
      case tree + enemyBullet:
        obj2.destroyed = true;
        break;

      case playerTank + enemyTank:
        if (side === 'left') {
          if (obj1.isMoving) {
            obj1.x -= 1;
          } else {
            obj2.x += 1;
          }
        }
        if (side === 'right') {
          if (obj1.isMoving) {
            obj1.x += 1;
          } else {
            obj2.x -= 1;
          }
        }
        if (side === 'top') {
          if (obj1.isMoving) {
            obj1.y -= 1;
          } else {
            obj1.y += 1;
          }
        }
        if (side === 'bottom') {
          if (obj1.isMoving) {
            obj1.y += 1;
          } else {
            obj1.y -= 1;
          }
        }
        break;

      case enemyTank + enemyTank:
        obj1.isMoving = false;
        obj2.isMoving = false;
        break;

      case playerBullet + enemyTank:
        obj1.destroyed = true;

        if (this.isBossFight && this.bossArmor) {
          this.enemies[0].hit = true;
          this.bossArmor--;
          break;
        }
        this.destroyTank(obj2);
        break;

      case enemyBullet + playerTank:
        obj1.destroyed = true;
        this.destroyTank(this.tank, -1);
        break;
    }
  };
}
