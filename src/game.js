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
import Score from './Entities/Score';

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
    this.scoreMeter = new Score();
    this.scoreMeter.color = 'red';
    this.currentScore = 0;
    this.stage.addChild(this.scoreMeter.view);
    addKeyboardListener('keydown', keyDownHandler, this);
    addKeyboardListener('keyup', keyUpHandler, this);
    this.addEnemy(this.initalEnemyAmount);
  }

  update = () => {
    if (this.enemies.length && this.tank) {
      this.checkEnemyCollision();
    }
    if (this.tank) {
      this.tank.update();
    }
  };

  destroyTank = (tank, index) => {
    const { x, y, width, height } = tank.view;
    const explosionX = x - width;
    const explosionY = y - height;
    tank.selfDestroy();

    if (index !== -1) {
      this.enemies.splice(index, 1); // need to rewrite with filter
    } else {
      this.tank = null;
      const temp = new Score({
        fz: 50,
        initial: 'GAME OVER',
      }).view;
      temp.align = 'center';

      this.stage.addChild(temp);
      this.enemies.forEach((enemy) => enemy.selfDestroy());
      this.enemies = [];
    }
    const explosion = this.explosion.createAnimation({
      x: explosionX,
      y: explosionY,
    });
    this.currentScore += 100;
    this.scoreMeter.text = this.currentScore;
    this.stage.addChild(explosion);
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
}
