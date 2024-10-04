import { type Sprite } from '../utils/utils'

const itemAtlas: string = 'assets/images/uiAtlas/itemsAtlas.png'
const itemAtlasSize: { x: number; y: number } = { x: 2048, y: 2048 }

export const itemsSprites: Record<string, Sprite> = {
  coinSprite: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 256,
    y: 0,
    w: 256,
    h: 245
  },
  smCargoSprite: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 0,
    y: 1205,
    w: 256,
    h: 240
  },
  mdCargoSprite: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 256,
    y: 1205,
    w: 256,
    h: 240
  },
  lgCargoSprite: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 512,
    y: 1205,
    w: 256,
    h: 240
  },
  coins: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 270,
    y: 14.2,
    w: 240,
    h: 240
  },
  fuel: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 14.2,
    y: 14.2,
    w: 240,
    h: 240
  },
  metal: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 784.9,
    y: 14.2,
    w: 240,
    h: 240
  },
  rubber: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 528,
    y: 14.2,
    w: 240,
    h: 240
  },
  glass: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 1294.8,
    y: 14.2,
    w: 240,
    h: 240
  },
  wires: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 1808,
    y: 14.2,
    w: 240,
    h: 240
  },
  cannisters: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 14.2,
    y: 256.5,
    w: 240,
    h: 240
  },
  circuitBoard: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 1039.8,
    y: 14.2,
    w: 240,
    h: 240
  },
  propulsion: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 1553.1,
    y: 14.2,
    w: 240,
    h: 240
  },
  antimatter: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 270,
    y: 256.5,
    w: 240,
    h: 240
  },

  healthinvincible15s: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 782.2,
    y: 1447,
    w: 240,
    h: 240
  },
  healthPlus50: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 270.2,
    y: 1447,
    w: 240,
    h: 240
  },
  multipleCoins2x: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 1552,
    y: 1215,
    w: 240,
    h: 240
  },
  multipleXp2x: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 1808,
    y: 1215,
    w: 240,
    h: 240
  },
  projectileDamagePlus5: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 14.2,
    y: 1447,
    w: 240,
    h: 240
  },
  projectileTrap: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 526.2,
    y: 1447,
    w: 240,
    h: 240
  },
  token0: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 14.2,
    y: 1215,
    w: 240,
    h: 240
  },
  token1: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 270,
    y: 1215,
    w: 240,
    h: 240
  },
  token2: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 528,
    y: 1215,
    w: 240,
    h: 240
  }
}
