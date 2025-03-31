import { BitmapText } from 'pixi.js';

export default class Title extends BitmapText {
  constructor({ text, x, y }) {
    super(text, {
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
    this.position.set(x, y);
    this.pivot.set(this.width / 2, this.height / 2);
  }

  set color(color) {
    this.tint = this.colors[color] || this.colors.white;
  }
}
