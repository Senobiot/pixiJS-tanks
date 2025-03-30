import createGroundTextures from './Entities/Ground';
import {
  addKeyboardListener,
  isCollision,
  keyDownHandler,
  keyUpHandler,
  removeKeyboardListener,
  startGame,
} from './utils';
import Tank from './Entities/Tank';
import Enemy from './Entities/Enemy';
import ExplosionFabric from './Entities/Explosion';
import Score from './Entities/Score';
import { TYPE } from './constants';

export default class Game {
  constructor(app, ground, bullet, tankAssets) {
    this.stage = app.stage;
    createGroundTextures(this.stage, ground);

    this.defaultTankProperties = {
      position: {
        x: app.screen.width * 0.25,
        y: app.screen.height / 2,
      },
      body: {
        texture: tankAssets.bodyRed,
      },
      barrel: {
        texture: tankAssets.barrel,
      },
      bullet: {
        texture: bullet,
      },
      stageDimensions: {
        width: app.stage.width,
        height: app.stage.height,
      },
    };

    this.gridSize = 100;
    this.grid = new Map();

    this.explosion = new ExplosionFabric();
    this.tank = new Tank(this.defaultTankProperties);
    this.initalEnemyAmount = 2;
    this.enemies = [];
    this.stage.addChild(this.tank.view);
    this.scoreMeter = new Score();
    this.scoreMeter.color = 'red';

    this.start();
  }

  start = () => {
    this.addEnemy(this.initalEnemyAmount);
    this.currentScore = 0;
    this.stage.addChild(this.scoreMeter.view);
    addKeyboardListener('keydown', keyDownHandler, this);
    addKeyboardListener('keyup', keyUpHandler, this);
  };

  gameOver = () => {
    removeKeyboardListener('keydown', this);
    removeKeyboardListener('keyup', this);
    //addKeyboardListener('keydown', keyDownHandler, this); for menu
  };

  update = () => {
    if (this.enemies.length && this.tank) {
      //this.checkEnemyCollision();
      this.updateCollision();
    }
    if (this.tank) {
      this.tank.update();
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
    this.currentScore += 100;
    this.scoreMeter.text = this.currentScore;

    if (index !== -1) {
      tank.parent.selfDestroy();
      this.enemies = this.enemies.filter(e.view !== tank.view);
      // this.enemies.splice(index, 1); // need to rewrite with filter
    } else {
      this.stage.addChild(
        this.explosion.createAnimation({
          x: this.tank.view.x,
          y: this.tank.view.y,
        })
      );

      this.gameOver();
      this.tank.selfDestroy();
      this.tank = null;

      const temp = new Score({
        fz: 50,
        initial: 'GAME OVER',
      }).view;
      temp.align = 'center';

      this.stage.addChild(temp);
      this.enemies.forEach((enemy) => {
        this.stage.addChild(
          this.explosion.createAnimation({
            x: enemy.view.x,
            y: enemy.view.y,
          })
        );
        enemy.selfDestroy();
      });

      this.enemies = [];
    }
  };

  checkEnemyCollision() {
    if (this.enemies.length) {
      for (let index = 0; index < this.enemies.length; index++) {
        if (this.tank.bullets.length) {
          for (let bullIdx = 0; bullIdx < this.tank.bullets.length; bullIdx++) {
            if (
              isCollision(
                this.enemies[index].view,
                this.tank.bullets[bullIdx].sprite
              )
            ) {
              return this.destroyTank(this.enemies[index], index);
            }
          }
        }
        if (this.enemies[index].bullets.length) {
          for (
            let enemyBulletIdx = 0;
            enemyBulletIdx < this.enemies[index].bullets.length;
            enemyBulletIdx++
          ) {
            if (
              isCollision(
                this.enemies[index].bullets[enemyBulletIdx].sprite,
                this.tank.view
              )
            ) {
              return this.destroyTank(this.tank, -1);
            }
          }
        }

        if (this.tank) {
          if (isCollision(this.enemies[index].view, this.tank.view)) {
            // if (this.tank.isMoving && this.enemies.length) { ?????
            // if (this.tank.isMoving) {
            //   if (isCollision(this.enemies[index].view, this.tank.view)) {
            //     this.destroyEnemy(this.enemies[index], index); // Destoy if collide with enemy
            //   }
            // }

            this.enemies[index].isMoving = false;
          }
        }

        this.enemies[index].update();
      }
    }
  }

  addEnemy = (amount = 1) => {
    for (let index = 1; index <= amount; index++) {
      const enemey = new Enemy({ ...this.defaultTankProperties, speed: 0.5 });
      this.enemies.push(enemey);
      this.stage.addChild(enemey.view);
    }
  };

  clearGrid() {
    this.grid.clear();
  }

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

          // Проверяем столкновения между объектами
          for (let i = 0; i < objects.length; i++) {
            for (let j = 0; j < neighborObjects.length; j++) {
              if (objects[i] !== neighborObjects[j]) {
                if (isCollision(objects[i], neighborObjects[j])) {
                  if (
                    objects[i].type === TYPE.bullets.player &&
                    neighborObjects[j].type === TYPE.tank.enemy
                  ) {
                    return this.destroyTank(neighborObjects[j]);
                  }
                  console.log(objects[i].type);
                  // console.log(neighborObjects[j].type);
                  // return console.log(objects[i]);
                }
              }
            }
          }
        }
      }
    }
  }

  updateCollision() {
    this.clearGrid();
    this.enemies.forEach((enemy) => {
      this.addToGrid(enemy.view);

      enemy.update();
      if (enemy.bullets) {
        enemy.bullets.forEach((bullet) => this.addToGrid(bullet.sprite));
      }
    });

    if (this.tank) {
      this.tank.bullets.forEach((bullet) => {
        this.addToGrid(bullet.sprite);
      });

      this.addToGrid(this.tank.view);
    }

    this.checkCollisions();
  }
}
