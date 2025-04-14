// import { initDevtools } from '@pixi/devtools';
import { Application, Assets, Container, Graphics } from 'pixi.js';
import { manifest } from './assetsMap';
import level_1 from './data/level-1.json';
import Game from './game';
import { getScreenSize } from './utils';
import levelLaoader from './utils/levelLoader';

(async () => {
  const mx = 100;
  const app = new Application();
  const screenSize = getScreenSize();
  await app.init(screenSize);
  // initDevtools({ app });

  await Assets.init({ manifest });
  const mapContainer = new Container();

  app.stage.addChild(mapContainer);
  const obstacles = await levelLaoader(level_1, mapContainer);
  const originalSize = mapContainer.getSize();
  const mask = new Graphics()
    .rect(mx / 2, mx / 2, screenSize.width - mx, screenSize.height - mx)
    .fill(0xffffff);

  mapContainer.mask = mask;
  mapContainer.screenMargins = { x: mx / 2, y: mx / 2 };
  mapContainer.x = mx / 2;
  mapContainer.y = mx / 2;
  const game = new Game(mapContainer, obstacles, originalSize);

  app.ticker.add(game.update, game);

  document.getElementById('pixi-container').appendChild(app.canvas);
})();
