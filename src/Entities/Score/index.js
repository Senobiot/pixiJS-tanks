import { BitmapText } from 'pixi.js';

export default class Score extends BitmapText {
  constructor({ x = 50, y = 50, fz = 18, initial = 0 } = {}) {
    super(`Score: ${initial}`, {
      fontName: 'Arial',
      fontSize: fz,
    });
    this.x = x;
    this.y = y;
    this.colors = {
      red: 0xff0000,
      green: 0x00ff00,
      blue: 0x0000ff,
      white: 0xffffff,
    };
  }

  set score(score) {
    super.text = `Score: ${score}`;
  }

  set color(color) {
    this.tint = this.colors[color] || this.colors.white;
  }

  set align(align) {
    this.style.align = align;
  }
}
