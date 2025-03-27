import { Container, Sprite } from 'pixi.js';

export default class Tank {
  constructor(props) {
    const { body, barrel, position } = props;

    this._view = new Container();
    this._view.x = position.x;
    this._view.y = position.y;

    this._body = new Sprite(body.texture);
    this._body.anchor.set(0.5);
    this._view.addChild(this._body);

    this._barrel = new Sprite(barrel.texture);
    // this._barrel.x = 18;
    // this._barrel.y = 18;
    this._barrel.anchor.set(0.5, 0);
    this._view.addChild(this._barrel);
  }

  get view() {
    return this._view;
  }

  set x(num) {
    this._view.x = num;
  }
  set y(num) {
    this._view.y = num;
  }
}
