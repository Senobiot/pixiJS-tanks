import { Sprite, Texture, Rectangle } from 'pixi.js';
import groundData from '../data/ground-tile-map.json';

const createGroundTextures = (
  stage,
  spritesheet,
  options = { tilesInRow: 10, tilesQuantity: 40, tileSize: 64 }
) => {
  const { data, width } = groundData.layers[0];
  const { tilesInRow, tilesQuantity, tileSize } = options;
  const textures = [];

  for (let i = 0; i < tilesQuantity; i++) {
    const x = (i % tilesInRow) * tileSize;
    const y = Math.floor(i / tilesInRow) * tileSize;
    const frame = new Rectangle(x, y, tileSize, tileSize);
    textures.push(
      new Texture({
        source: spritesheet.source,
        frame,
      })
    );
  }

  data.forEach((tileIndex, index) => {
    if (tileIndex !== 0) {
      const x = (index % width) * 64;
      const y = Math.floor(index / width) * 64;
      const tile = new Sprite(textures[tileIndex - 1]);
      tile.x = x;
      tile.y = y;

      stage.addChild(tile); //add to screen
    }
  });
};

export default createGroundTextures;
