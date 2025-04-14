import { Container, BitmapText } from 'pixi.js';
import Score from './Score';
import EnemyIndicator from './EnemyIndicator';

export default class UI extends Container {
  constructor(screenWidth = 0) {
    super();
    this.width = screenWidth;
    this.score = new Score();
    this.enemyIndicator = new EnemyIndicator(screenWidth);
  }

  show = () => {
    this.addChild(this.score);
    this.addChild(this.enemyIndicator);
  };

  hide = () => {
    this.removeChild(this.score);
    this.removeChild(this.enemyIndicator);
  };
}
