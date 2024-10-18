import { ACCESSORY_ID } from '../../vehicle/accessory-data'
import { type Sprite } from '../utils/utils'

const atlasSrc: string = 'assets/images/uiAtlas/itemsAtlas.png'
const atlasSize: { x: number; y: number } = { x: 2048, y: 2048 }

export const accessoriesSprites: Record<ACCESSORY_ID, Sprite> = {
  [ACCESSORY_ID.NONE]: {
    w: 1,
    h: 1,
    y: 2048,
    x: 2048,
    atlasSrc,
    atlasSize
  },

  [ACCESSORY_ID.WINGS_BETA]: {
    w: 220,
    h: 220,
    y: 740,
    x: 270,
    atlasSrc,
    atlasSize
  },

  [ACCESSORY_ID.WINGS_MASTER]: {
    w: 220,
    h: 220,
    y: 740,
    x: 270,
    atlasSrc,
    atlasSize
  },

  [ACCESSORY_ID.AURA_VROOMWAY]: {
    w: 220,
    h: 220,
    y: 975,
    x: 1805,
    atlasSrc,
    atlasSize
  },

  [ACCESSORY_ID.TROPHY_1]: {
    w: 220,
    h: 220,
    y: 1455,
    x: 1553,
    atlasSrc,
    atlasSize
  },

  [ACCESSORY_ID.TROPHY_2]: {
    w: 220,
    h: 220,
    y: 1216,
    x: 1040,
    atlasSrc,
    atlasSize
  },

  [ACCESSORY_ID.LEVEL_CROWN]: {
    w: 220,
    h: 220,
    y: 258,
    x: 527,
    atlasSrc,
    atlasSize
  },

  [ACCESSORY_ID.RACER_JACKET]: {
    w: 220,
    h: 220,
    y: 1697,
    x: 528,
    atlasSrc,
    atlasSize
  }
}
