// import { initDevtools } from '@pixi/devtools';
import { Application, Assets, Container, Graphics } from 'pixi.js';
import { manifest } from './assetsMap';
import level_1 from './data/level-1.json';
import Game from './game';
import { getScreenSize } from './utils';
import levelLaoader from './utils/levelLoader';

(async () => {
  const app = new Application();
  // const screenSize = getScreenSize();
  const screenSize = { width: 640, height: 512 };
  await app.init(screenSize);
  // initDevtools({ app });

  await Assets.init({ manifest });
  const mapContainer = new Container();
  app.stage.addChild(mapContainer);
  const obstacles = await levelLaoader(level_1, mapContainer);

  const mask = new Graphics();
  mask
    .beginFill(0x000000)
    .drawRect(0, 0, screenSize.width, screenSize.height)
    .endFill();
  mapContainer.mask = mask;

  // const game = new Game(app);
  const game = new Game(mapContainer, obstacles);
  app.ticker.add(game.update, game);

  document.getElementById('pixi-container').appendChild(app.canvas);
})();
