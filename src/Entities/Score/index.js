import { BitmapText } from 'pixi.js';

export default class Score {
  constructor({ x = 50, y = 50, fz = 18, initial = 0 } = {}) {
    this._text = new BitmapText(`Score: ${initial}`, {
      fontName: 'Arial',
      fontSize: fz,
    });
    this._text.x = x;
    this._text.y = y;
    this._colors = {
      red: 0xff0000,
      green: 0x00ff00,
      blue: 0x0000ff,
      white: 0xffffff,
    };
  }

  set text(score) {
    this._text.text = `Score: ${score}`;
  }

  set color(color) {
    this._text.tint = this._colors[color] || this._colors.white;
  }

  set align(align) {
    this._text.align = align;
  }

  get view() {
    return this._text;
  }
}
