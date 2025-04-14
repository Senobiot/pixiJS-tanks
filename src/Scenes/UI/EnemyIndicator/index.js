import { Container, Sprite, Assets } from 'pixi.js';

export default class EnemyIndicator extends Container {
  constructor(screenWidth) {
    super();
    this.alpha = 0.65;
    this.screenWidth = screenWidth;
    this.init();
  }

  init = async () => {
    await Assets.loadBundle('indicator');
    this.icon = Assets.get('enemy-amount');
  };

  setEnemies = ({
    amount = 10,
    columns = 2,
    spacingX = 25,
    spacingY = 25,
    spriteWidth = 20,
    spriteHeight = 20,
    alignRight = true,
  } = {}) => {
    if (this.children.length) {
      this.children.forEach((e) => e.destroy());
      this.children = [];
    }
    if (!this.icon) {
      console.error('no such textures');
      return;
    }
    const rows = Math.ceil(amount / columns);

    for (let index = 0; index < rows * columns; index++) {
      const sprite = Sprite.from(this.icon);
      const column = index % columns;
      const row = Math.floor(index / columns);
      sprite.width = spriteWidth;
      sprite.height = spriteHeight;
      sprite.x = column * spacingX;
      sprite.y = row * spacingY;
      this.addChild(sprite);
    }
    if (this.parent) console.log(this.getBounds().width);
    if (alignRight) {
      this.y = spacingY;
      this.x = this.screenWidth - this.width - spacingX;
    }
  };

  updateEnemies = () => {
    console.log('?');
    if (this.children.length) {
      this.children[this.children.length - 1].destroy();
    }
  };
}
