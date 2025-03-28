import { Application, Assets, Sprite, Texture } from 'pixi.js';
import { assetsMap, manifest } from './assetsMap';
import Tank from './Tank';
import createGroundTextures from './Ground';
import { addKeyboardListener, keyDownHandler, keyUpHandler } from './utils';

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

  document.addEventListener('keydown', (e) => keyDownHandler(e, tank));
  document.addEventListener('keyup', (e) => keyUpHandler(e, tank));

  app.stage.addChild(tank.view);

  app.ticker.add(() => {
    tank.update();
  });

  // app.ticker.add((time) => {
  //   tank._barrel.rotation += 0.01 * time.deltaTime;
  // });
})();
