import { Application, Assets, Sprite, Texture } from 'pixi.js';
import { assetsMap, manifest } from './assetsMap';
import Tank from './Tank';
import createGroundTextures from './Ground';
import {
  addKeyboardListener,
  keyDownHandler,
  keySpaceHandler,
  keyUpHandler,
} from './utils';

(async () => {
  const app = new Application();
  await app.init({
    //background: '#1099bb',
    //  resizeTo: window,
    width: 600,
    height: 400,
  });

  const moving = {
    isMoving: false,
    up: false,
    down: false,
    left: false,
    right: false,
  };

  document.getElementById('pixi-container').appendChild(app.canvas);
  document.addEventListener('keydown', (e) => keyDownHandler(e, moving));
  document.addEventListener('keyup', (e) => keyUpHandler(e, moving));

  await Assets.init({ manifest });
  const spritesheet = await Assets.load('/assets/terrainTiles.png'); // load ground map
  const bullet = await Assets.load('/assets/bulletRed3.png');
  createGroundTextures(app.stage, spritesheet); // draw ground
  const assets = await Assets.loadBundle('tank-red');

  const tank = new Tank({
    position: {
      x: app.screen.width * 0.25,
      y: app.screen.height / 2,
    },
    body: {
      texture: assets.bodyRed,
    },
    barrel: {
      texture: assets.barrel,
    },
    bullet: {
      texture: bullet,
    },
    stageDimensions: {
      width: app.stage.width,
      height: app.stage.height,
    },
  });
  document.addEventListener('keydown', (e) => keySpaceHandler(e, tank.shoot));
  app.stage.addChild(tank.view);

  app.ticker.add((time) => {
    if (tank.bullets.length) {
      tank.update();
    }

    if (moving.isMoving) {
      if (!moving.isRotating) {
        if (moving.up || moving.down) moving.targetRotation = Math.PI;
        if (moving.right || moving.left) moving.targetRotation = Math.PI / 2;

        if (Math.abs(tank.view.rotation - moving.targetRotation) !== 0) {
          moving.isRotating = true;
        } else {
          moving.isRotating = false;
        }
      }

      if (moving.isRotating) {
        const deltaRotation = 0.05 * time.deltaTime;
        if (
          Math.abs(tank.view.rotation - moving.targetRotation) <= deltaRotation
        ) {
          tank.view.rotation = moving.targetRotation;
          moving.isRotating = false;
        } else if (tank.view.rotation < moving.targetRotation) {
          tank.view.rotation += deltaRotation;
        } else {
          tank.view.rotation -= deltaRotation;
        }
      } else {
        if (moving.up) tank.view.y -= 1 * time.deltaTime;
        if (moving.right) tank.view.x += 1 * time.deltaTime;
        if (moving.down) tank.view.y += 1 * time.deltaTime;
        if (moving.left) tank.view.x -= 1 * time.deltaTime;
      }
      // perhaps its some special method to handle screen borders in pixi
      if (
        tank.view.x >= app.screen.width - tank.view.width / 2 ||
        tank.view.x - tank.view.width / 2 <= 0 ||
        tank.view.y >= app.screen.height - tank.view.height / 2 ||
        tank.view.y - tank.view.height / 2 <= 0
      ) {
        moving.isMoving = false;
      }
    }
  });

  // app.ticker.add((time) => {
  //   tank._barrel.rotation += 0.01 * time.deltaTime;
  // });
})();
