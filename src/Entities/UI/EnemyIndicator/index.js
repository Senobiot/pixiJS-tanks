import { Container, Sprite, Assets } from 'pixi.js';

export default class EnemyIndicator extends Container {
  constructor({
    amount = 10,
    columns = 2,
    spacingX = 25,
    spacingY = 25,
    x = 20,
    y = 20,
    alignRight,
  } = {}) {
    super();
    this.enemies = amount;
    this.columns = columns;
    this.rows = Math.ceil(amount / columns);
    this.spacingX = spacingX;
    this.spacingY = spacingY;
    this.x = x;
    this.y = y;
    this.alpha = 0.65;
    this.init(alignRight);
  }

  init = async (alignRight) => {
    await Assets.loadBundle('indicator');
    const icon = Assets.get('enemy-amount');

    if (!icon) {
      console.error('no such textures');
      return;
    }

    for (let index = 0; index < this.rows * this.columns; index++) {
      const sprite = Sprite.from(icon);
      const column = index % this.columns;
      const row = Math.floor(index / this.columns);
      sprite.width = 20;
      sprite.height = 20;
      sprite.x = column * this.spacingX;
      sprite.y = row * this.spacingY;
      this.addChild(sprite);
    }

    if (alignRight) {
      this.x = this.x - this.getBounds().width - 20;
      console.log(this.x);
    }
  };

  update = () => {
    if (this.children.length) {
      this.children[this.children.length - 1].destroy();
    }
  };
}
