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
  }
}
