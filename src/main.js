// import { initDevtools } from '@pixi/devtools';
import { Application, Assets } from 'pixi.js';
import { manifest } from './assetsMap';
import Game from './game';
import createGroundTextures from './Entities/Ground';

(async () => {
  const app = new Application();
  await app.init({ width: 640, height: 512 });
  // initDevtools({ app });

  await Assets.init({ manifest });
  await createGroundTextures(app.stage);

  const game = new Game(app);
  app.ticker.add(game.update, game);

  document.getElementById('pixi-container').appendChild(app.canvas);
})();
