// import { initDevtools } from '@pixi/devtools';
import { Application, Assets, Container, Graphics } from 'pixi.js';
import { manifest } from './assetsMap';
import level_1 from './data/level-1.json';
import Game from './game';
import { getScreenSize } from './utils';
import levelLaoader from './utils/levelLoader';
import UI from './Scenes/UI';
import GameOver from './Scenes/UI/Screens/GameOver';

(async () => {
  const margins = { x: 50, y: 50 };
  const { width, height } = getScreenSize();
  const appSize = {
    width: width > 1600 ? 1600 - margins.x * 2 : width - margins.x * 2,
    height: height > 900 ? 900 - margins.y * 2 : height - margins.y * 2,
  };

  const app = new Application();
  await app.init(appSize);
  // initDevtools({ app });
  await Assets.init({ manifest });
  const mapContainer = new Container();
  const ui = new UI(appSize.width);
  const gameOverScreen = new GameOver(appSize);

  app.stage.addChild(mapContainer);
  app.stage.addChild(ui);
  app.stage.addChild(gameOverScreen);

  const obstacles = await levelLaoader(level_1, mapContainer);
  const mapFullSize = mapContainer.getSize();
  const mask = new Graphics()
    .rect(0, 0, appSize.width, appSize.height)
    .fill(0xffffff);

  mapContainer.mask = mask;
  const game = new Game({
    mapContainer,
    obstacles,
    mapFullSize,
    ui,
    gameOverScreen,
  });

  app.ticker.add(game.update, game);

  const gameContainer = document.getElementById('pixi-container');
  gameContainer.appendChild(app.canvas);
})();
