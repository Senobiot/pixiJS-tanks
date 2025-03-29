import createGroundTextures from './Entities/Ground';
import {
  addKeyboardListener,
  isCollision,
  keyDownHandler,
  keyUpHandler,
} from './utils';
import Tank from './Entities/Tank';
import Enemy from './Entities/Enemy';
import ExplosionFabric from './Entities/Explosion';

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

    this.explosion = new ExplosionFabric();
    this.tank = new Tank(this.defaultTankProperties);
    this.initalEnemyAmount = 2;
    this.enemies = [];
    this.stage.addChild(this.tank.view);
    addKeyboardListener('keydown', keyDownHandler, this);
    addKeyboardListener('keyup', keyUpHandler, this);
    this.addEnemy(this.initalEnemyAmount);
  }

  update = () => {
    this.checkEnemyCollision();

    this.tank.update();
  };

  destroyEnemy = (enemy, index) => {
    const { x, y, width, height } = enemy.view;
    const explosionX = x - width;
    const explosionY = y - height;

    if (enemy.bullets.length) {
      enemy.bullets.forEach((e) => e.sprite.destroy()); //delete enemy bullets if hit him
      enemy.bullets = [];
    }
    enemy.view.destroy();
    this.enemies.splice(index, 1); // need to rewrite with filter

    const explosion = this.explosion.createAnimation({
      x: explosionX,
      y: explosionY,
    });

    this.stage.addChild(explosion);
  };

  checkEnemyCollision() {
    if (this.enemies.length) {
      for (let index = 0; index < this.enemies.length; index++) {
        this.enemies[index].update();
        if (this.tank.bullets[0]) {
          if (
            isCollision(this.enemies[index].view, this.tank.bullets[0].sprite)
          ) {
            this.destroyEnemy(this.enemies[index], index);
            break;
          }
        }

        if (this.tank.isMoving && this.enemies.length) {
          if (isCollision(this.enemies[index].view, this.tank.view)) {
            this.destroyEnemy(this.enemies[index], index);
          }
        }
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
}
