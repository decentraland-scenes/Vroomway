import { type Sprite } from '../utils/utils'

const itemAtlas: string = 'assets/images/uiAtlas/itemsAtlas.png'
const itemAtlasSize: { x: number; y: number } = { x: 2048, y: 2048 }
export enum items {
  exp = 'exp',
  lvl = 'lvl',
  token0 = 'token0',
  token1 = 'token1',
  token2 = 'token2',
  PlayerInvincible = 'healthinvincible15s',
  PlayerHeal = 'healthPlus50',
  BonusCoins = 'multipleCoins2x',
  BonusExp = 'multipleXp2x',
  WeaponBoost = 'projectileDamagePlus5',
  WeaponTrap = 'projectileTrap',
  smCargo = 'smCargo',
  mdCargo = 'mdCargo',
  lgCargo = 'lgCargo',
  coins = 'coins',
  fuel = 'fuel',
  metal = 'metal',
  rubber = 'rubber',
  glass = 'glass',
  propulsion = 'propulsion',
  wires = 'wires',
  antimatter = 'antimatter',
  cannisters = 'cannisters',
  circuitBoard = 'circuitBoard'
}
export const itemsSprites: Record<items, Sprite> = {
  [items.smCargo]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 0,
    y: 1205,
    w: 256,
    h: 240
  },
  [items.mdCargo]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 256,
    y: 1205,
    w: 256,
    h: 240
  },
  [items.lgCargo]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 512,
    y: 1205,
    w: 256,
    h: 240
  },
  [items.coins]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 270,
    y: 14.2,
    w: 240,
    h: 240
  },
  [items.exp]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 270,
    y: 14.2,
    w: 240,
    h: 240
  },
  [items.lvl]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 270,
    y: 14.2,
    w: 240,
    h: 240
  },
  [items.fuel]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 14.2,
    y: 14.2,
    w: 240,
    h: 240
  },
  [items.metal]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 784.9,
    y: 14.2,
    w: 240,
    h: 240
  },
  [items.rubber]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 528,
    y: 14.2,
    w: 240,
    h: 240
  },
  [items.glass]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 1294.8,
    y: 14.2,
    w: 240,
    h: 240
  },
  [items.wires]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 1808,
    y: 14.2,
    w: 240,
    h: 240
  },
  [items.cannisters]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 14.2,
    y: 256.5,
    w: 240,
    h: 240
  },
  [items.circuitBoard]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 1039.8,
    y: 14.2,
    w: 240,
    h: 240
  },
  [items.propulsion]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 1553.1,
    y: 14.2,
    w: 240,
    h: 240
  },
  [items.antimatter]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 270,
    y: 256.5,
    w: 240,
    h: 240
  },

  [items.PlayerInvincible]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 782.2,
    y: 1447,
    w: 240,
    h: 240
  },
  [items.PlayerHeal]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 270.2,
    y: 1447,
    w: 240,
    h: 240
  },
  [items.BonusCoins]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 1552,
    y: 1215,
    w: 240,
    h: 240
  },
  [items.BonusExp]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 1808,
    y: 1215,
    w: 240,
    h: 240
  },
  [items.WeaponBoost]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 14.2,
    y: 1447,
    w: 240,
    h: 240
  },
  [items.WeaponTrap]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 526.2,
    y: 1447,
    w: 240,
    h: 240
  },
  [items.token0]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 14.2,
    y: 1215,
    w: 240,
    h: 240
  },
  [items.token1]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 270,
    y: 1215,
    w: 240,
    h: 240
  },
  [items.token2]: {
    atlasSrc: itemAtlas,
    atlasSize: itemAtlasSize,
    x: 528,
    y: 1215,
    w: 240,
    h: 240
  }
}
