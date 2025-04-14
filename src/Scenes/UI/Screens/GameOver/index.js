import { BitmapText } from 'pixi.js';

export default class GameOver extends BitmapText {
  constructor({ width, height }) {
    super(`GAME OVER \nScore: ${0}`, {
      fontName: 'Arial',
      fontSize: 50,
      align: 'center',
    });
    this.tint = 0xff0000;
    this.colors = {
      red: 0xff0000,
      green: 0x00ff00,
      blue: 0x0000ff,
      white: 0xffffff,
    };

    this.position.set(width / 2 - this.width / 2, height / 2 - this.height / 2);
    this.hide();
  }

  set color(color) {
    this.tint = this.colors[color] || this.colors.white;
  }

  hide = () => {
    this.text = '';
  };

  show = (score) => {
    this.text = `GAME OVER \nScore: ${score}\npress ENTER`;
  };
}
