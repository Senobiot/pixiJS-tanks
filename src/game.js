import createGroundTextures from './Entities/Ground';
import { addKeyboardListener, keyDownHandler, keyUpHandler } from './utils';
import Tank from './Entities/Tank';

export default class Game {
  constructor(app, spritesheet, bullet, tankAssets) {
    this.stage = app.stage;
    createGroundTextures(this.stage, spritesheet);

    this.tank = new Tank({
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
    });

    this.stage.addChild(this.tank.view);
    addKeyboardListener('keydown', keyDownHandler, this.tank);
    addKeyboardListener('keyup', keyUpHandler, this.tank);
  }

  update = () => {
    this.tank.update();
  };
}
