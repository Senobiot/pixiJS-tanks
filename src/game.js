import createGroundTextures from './Entities/Ground';
import {
  addKeyboardListener,
  isCollision,
  keyDownHandler,
  keyUpHandler,
} from './utils';
import Tank from './Entities/Tank';
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
    this.enemies = [];
    this.stage.addChild(this.tank.view);
    addKeyboardListener('keydown', keyDownHandler, this);
    addKeyboardListener('keyup', keyUpHandler, this);
  }

  update = () => {
    this.checkEnemyCollision();

    this.tank.update();
  };

  destroyEmeny = (enemy, index) => {
    const { x, y, width, height } = enemy;
    const explosionX = x - width;
    const explosionY = y - height;

    enemy.destroy();
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
        if (this.tank.bullets[0]) {
          if (
            isCollision(this.enemies[index].view, this.tank.bullets[0].sprite)
          ) {
            this.destroyEmeny(this.enemies[index].view, index);
          }
        }

        if (this.tank.isMoving && this.enemies.length) {
          if (isCollision(this.enemies[index].view, this.tank.view)) {
            this.destroyEmeny(this.enemies[index].view, index);
          }
        }
      }
    }
  }

  addEnemy = () => {
    const enemey = new Tank(this.defaultTankProperties);
    this.enemies.push(enemey);
    this.stage.addChild(enemey.view);
  };
}
