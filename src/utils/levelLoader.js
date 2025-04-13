import { Sprite, Texture, Rectangle, Assets } from 'pixi.js';
import { TYPE } from '../constants';

const levelLaoader = async (levelMap, stage) => {
  const { tilesets, layers } = levelMap;
  if (!tilesets.length || !layers.length) return;

  const layerTextures = [];
  const obstacles = [];
  let texturesSizes = {};

  for (const tileSet of tilesets) {
    if (tileSet.image) {
      const { columns, tilecount, tileheight, tilewidth, name, image } =
        tileSet;
      await Assets.loadBundle(name);
      const tileSheetImg = Assets.get(image);

      texturesSizes[name] = { width: tilewidth, height: tileheight };

      for (let index = 0; index < tilecount; index++) {
        const x = (index % columns) * tilewidth;
        const y = Math.floor(index / columns) * tileheight;
        const frame = new Rectangle(x, y, tilewidth, tileheight);

        const tileTexture = new Texture({
          source: tileSheetImg.source,
          frame,
        });

        layerTextures.push(tileTexture);
      }
    } else if (tileSet.tiles?.length) {
      const { name, tileheight, tilewidth } = tileSet;

      texturesSizes[name] = { width: tilewidth, height: tileheight };

      for (const tile of tileSet.tiles) {
        await Assets.loadBundle(name);
        const tileImg = await Assets.load(tile.image);

        layerTextures.push(new Texture(tileImg.source));
      }
    }
  }

  layers.forEach((layer) => {
    const { data, width, name } = layer;

    if (name in texturesSizes) {
      data.forEach((tileIndex, index) => {
        if (tileIndex === 0) return;

        const x = (index % width) * texturesSizes[name].width;
        const y = Math.floor(index / width) * texturesSizes[name].height;

        const tileTexture = layerTextures[tileIndex - 1];
        if (!tileTexture) return;

        const tile = new Sprite(tileTexture);
        tile.x = x;
        tile.y = y;
        if (name === 'trees') {
          tile.type = TYPE.obstacles.tree;
          obstacles.push(tile);
        }
        stage.addChild(tile);
      });
    }
  });
  return obstacles;
};

export default levelLaoader;
