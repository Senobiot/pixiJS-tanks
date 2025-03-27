import { Application, Assets, Sprite } from 'pixi.js';
import { assetsMap, manifest } from './assetsMap';
import Tank from './Tank';

(async () => {
  const app = new Application();

  await app.init({
    background: '#1099bb',
    //  resizeTo: window,
    width: 600,
    height: 400,
  });

  document.getElementById('pixi-container').appendChild(app.canvas);

  await Assets.init({ manifest });

  const assets = await Assets.loadBundle('tank-red');
  console.log(assets);
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
  });

  app.stage.addChild(tank.view);

  let moving = {
    isMoving: false,
    up: false,
    down: false,
    left: false,
    right: false,
  };

  tank.view.interactive = true;
  document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowUp':
        moving.isMoving = true;
        moving.up = true;
        break;
      case 'ArrowDown':
        moving.isMoving = true;
        moving.down = true;
        break;
      case 'ArrowLeft':
        moving.isMoving = true;
        moving.left = true;
        break;
      case 'ArrowRight':
        moving.isMoving = true;
        moving.right = true;
        break;
      default:
        console.log(`keydown ${event.key}`);
    }
  });

  document.addEventListener('keyup', (event) => {
    switch (event.key) {
      case 'ArrowUp':
        moving.isMoving = false;
        moving.up = false;
        break;
      case 'ArrowDown':
        moving.isMoving = false;
        moving.down = false;
        break;
      case 'ArrowLeft':
        moving.isMoving = false;
        moving.left = false;
        break;
      case 'ArrowRight':
        moving.isMoving = false;
        moving.right = false;
        break;
      default:
        console.log(`Keyup: ${event.key}`);
    }
  });

  app.ticker.add((time) => {
    if (moving.isMoving) {
      if (moving.up) {
        if (tank.view.rotation > 0) {
          tank.view.rotation -= 0.05 * time.deltaTime;
        } else {
          tank.view.y -= 1 * time.deltaTime;
        }
      }
      if (moving.right) {
        if (tank.view.rotation < Math.PI / 2) {
          tank.view.rotation += 0.05 * time.deltaTime;
        } else {
          tank.view.x += 1 * time.deltaTime;
        }
      }

      if (moving.left) {
        if (tank.view.rotation < Math.PI / 2) {
          tank.view.rotation += 0.05 * time.deltaTime;
        } else {
          tank.view.x -= 1 * time.deltaTime;
        }
      }

      if (moving.down) {
        if (tank.view.rotation > 0) {
          tank.view.rotation -= 0.05 * time.deltaTime;
        } else {
          tank.view.y += 1 * time.deltaTime;
        }
      }
      if (tank.view.x >= app.screen.width - tank.view.width) {
        moving.isMoving = false;
      }
    }
  });

  // app.ticker.add((time) => {
  //   tank._barrel.rotation += 0.01 * time.deltaTime;
  // });
})();
