import { Application, Assets } from 'pixi.js';
import { manifest } from './assetsMap';
import Game from './game';

(async () => {
  const app = new Application();
  await app.init({ width: 600, height: 400 });

  // тут разобрать как это грузить сразу всё
  await Assets.init({ manifest });
  const spritesheet = await Assets.load('/assets/terrainTiles.png'); // load ground map
  const bullet = await Assets.load('/assets/bulletRed3.png');
  const tankAssets = await Assets.loadBundle('tank-red');

  const game = new Game(app, spritesheet, bullet, tankAssets);
  app.ticker.add(game.update, game);

  document.getElementById('pixi-container').appendChild(app.canvas);
})();
