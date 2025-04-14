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
import TitleText from './Scenes/UI/Screens/GameOver';
import { ASSETS_COLORS, TYPE } from './constants';
import Mammoth from './Entities/Enemy/Boss';

export default class Game {
  constructor({
    mapContainer,
    obstacles,
    mapFullSize,
    ui,
    gameOverScreen,
  } = {}) {
    this.obstacles = obstacles;
    this.stage = mapContainer;
    this.mapSize = mapFullSize;
    this.stageDimensions = this.stage.getBounds();

    this.defaultTankProperties = {
      stageDimensions: this.stageDimensions,
      mapSize: this.mapSize,
    };

    this.playerTankProperties = {
      stageDimensions: this.stageDimensions,
      mapContainer,
      mapSize: this.mapSize,
      isPlayerOwned: true,
    };

    this.explosion = new ExplosionFabric();
    this.tank = new Tank(this.playerTankProperties);
    this.initalEnemyAmount = 4;
    this.defaultEnemyAmount = 8;
    this.enemyAmount = this.defaultEnemyAmount;
    this.enemies = [];
    this.isBossFight = false;
    this.currentScore = 0;
    this.ui = ui;
    this.setScore = this.ui.score.setScore;
    this.setEnemies = this.ui.enemyIndicator.setEnemies;
    this.updateEnemies = this.ui.enemyIndicator.updateEnemies;
    this.gameOverScreen = gameOverScreen;
    this.start();
  }

  start = () => {
    if (this.endOfGame) {
      if (this.enemies.length) {
        this.destroyAllEnemies();
      }
      this.stage.x = 0;
      this.stage.y = 0;
      this.gameOverScreen.hide();
    }

    this.addEnemy(this.initalEnemyAmount);
    this.tank = new Tank(this.playerTankProperties);
    this.currentScore = 0;
    this.setScore(0);
    this.enemyAmount = this.defaultEnemyAmount - this.initalEnemyAmount;
    this.setEnemies({
      amount: this.defaultEnemyAmount,
    });
    this.stage.addChild(this.tank);
    this.ui.show();

    removeKeyboardListener('keydown', this);
    addKeyboardListener('keydown', keyDownHandler, this);
    addKeyboardListener('keyup', keyUpHandler, this);
    // addGameListener('contextmenu', canvasContextMenu, this);
    // addGameListener('mousedown', canvasMouseDown, this);
    // addGameListener('mouseup', canvasMouseUp, this);
    // addGameListener('mousemove', canvasMouseMove, this);
  };

  gameOver = () => {
    this.ui.hide();
    this.isBossFight = false;
    this.endOfGame = true;
    this.gameOverScreen.show(this.currentScore);

    removeKeyboardListener('keydown', this);
    removeKeyboardListener('keyup', this);
    // removeGameListener('contextmenu', this);
    // removeGameListener('mousedown', this);
    // removeGameListener('mouseup', this);
    // removeGameListener('mousemove', this);
    addKeyboardListener('keydown', menuControls, this);
  };

  destroyAllEnemies = () => {
    this.enemies.forEach((e) => e.selfDestroy());
    this.enemies = [];
  };

  update = (deltaTime) => {
    if (this.tank) {
      this.tank.update(deltaTime);
    }

    if (this.enemies.length) {
      this.enemies.forEach((enemy) => enemy.update(deltaTime));
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
    console.log(this.enemies.length, this.enemyAmount);
    if (index !== -1) {
      this.updateEnemies();
      if (this.enemies.length < 4 && this.enemyAmount > 0) {
        this.enemyAmount--;
        this.addEnemy();
      }

      this.currentScore += 100;
      this.setScore(this.currentScore);
      // this.scoreMeter.score = this.currentScore;
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
        speed: 2,
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
        if (side === 'left') obj2.x += 2;
        if (side === 'right') obj2.x -= 2;
        if (side === 'top') obj2.y += 2;
        if (side === 'bottom') obj2.y -= 2;
        break;

      case tree + playerBullet:
      case tree + enemyBullet:
        obj2.destroyed = true;
        break;

      case playerTank + enemyTank:
        if (side === 'left') {
          if (obj1.isMoving) {
            obj1.x -= 2;
          } else {
            obj2.x += 2;
          }
        }
        if (side === 'right') {
          if (obj1.isMoving) {
            obj1.x += 2;
          } else {
            obj2.x -= 2;
          }
        }
        if (side === 'top') {
          if (obj1.isMoving) {
            obj1.y -= 2;
          } else {
            obj2.y += 2;
          }
        }
        if (side === 'bottom') {
          if (obj1.isMoving) {
            obj1.y += 2;
          } else {
            obj2.y -= 2;
          }
        }
        break;

      case enemyTank + enemyTank:
        obj1.movingDirection = 'drivingRight';
        obj2.movingDirection = 'drivingLeft';
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
