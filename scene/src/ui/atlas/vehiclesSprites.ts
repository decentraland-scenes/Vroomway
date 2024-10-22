import { type Sprite } from '../utils/utils'

const itemAtlas1: string = 'assets/images/uiAtlas/itemsAtlas.png'
const itemAtlas2: string = 'assets/images/uiAtlas/itemsAtlas2.png'
const itemAtlasSize: { x: number; y: number } = { x: 2048, y: 2048 }
export enum vehicles {
  SPEED_BOOTS_L1 = 'speedBoots1',
  SPEED_BOOTS_L2 = 'speedBoots2',
  SPEED_BOOTS_L3 = 'speedBoots3',
  // ###   TIER 2
  HOVER_BIKE_L1 = 'hoverBike1',
  HOVER_BIKE_L2 = 'hoverBike2',
  HOVER_BIKE_L3 = 'hoverBike3',
  BRUTE_L1 = 'brute1',
  BRUTE_L2 = 'brute2',
  BRUTE_L3 = 'brute3',
  // ###   TIER 3
  HOVER_CAR_L1 = 'hoverCar1',
  HOVER_CAR_L2 = 'hoverCar2',
  HOVER_CAR_L3 = 'hoverCar3',
  // ###   TIER 4
  VROOM_VROOM = 'vroomVroom',
  MODEL_0 = 'model0',
  WONDER_VROOM = 'wonderVroom',
  DIAMOND_VROOM = 'diamondVroom',
  BUILDA_VROOM = 'buildaVroom',
  CADDY_VROOM = 'caddyVroom',
  BROOM_VROOM = 'broomVroom',
  KITTY_VROOM = 'kittyVroom',
  // ###   TIER 5
  DIVINITY = 'divinity',
  PLEATHER_BIKE = 'pleather',
  OCEAN_PEAFOWL = 'peafowl',
  FUEGO_MACHINA = 'machina',
  JUNKER_VAN = 'junkerVan',
  VROOM_WING = 'vroomWing',
  ROLLER_VROOM = 'rollerVroom',
  BOSIER = 'bosier',
  RATTY_VROOM = 'rattyVroom',
  // ###   TIER 6
  GRAND_PRIX_GOLD = 'goldSaucer',
  GRAND_PRIX_SILVER = 'silverSaucer',
  GRAND_PRIX_BRONZE = 'bronzeSaucer',
  GRAND_PRIX_GOLD_23 = 'goldSaucer2',
  GRAND_PRIX_SILVER_23 = 'silverSaucer2',
  GRAND_PRIX_BRONZE_23 = 'bronzeSaucer2',
  FLAMES_END = 'flamesEnd',
  TIDE_BREAKER = 'tideBreaker',
  VIRIDIAN_QUAKE = 'viridianQuake',
  OBSIDIAN_STRIKE = 'obsidianStrike',
  OPULENT = 'opulent'
}
export const vehiclesSprites: Record<vehicles, Sprite> = {
  // ###   TIER 1 VEHICLES
  [vehicles.SPEED_BOOTS_L1]: {
    w: 220,
    h: 220,
    y: 498,
    x: 14,
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize
  },

  [vehicles.SPEED_BOOTS_L2]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 220,
    h: 220,
    y: 498,
    x: 271
  },

  [vehicles.SPEED_BOOTS_L3]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 220,
    h: 220,
    y: 498,
    x: 527
  },

  // ###   TIER 2 VEHICLES
  [vehicles.HOVER_BIKE_L1]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 220,
    h: 220,
    y: 498,
    x: 784
  },

  [vehicles.HOVER_BIKE_L2]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 220,
    h: 220,
    y: 498,
    x: 1040
  },

  [vehicles.HOVER_BIKE_L3]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 220,
    h: 220,
    y: 498,
    x: 1297
  },

  [vehicles.BRUTE_L1]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 220,
    h: 220,
    y: 498,
    x: 1553
  },

  [vehicles.BRUTE_L2]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 220,
    h: 220,
    y: 498,
    x: 1810
  },

  [vehicles.BRUTE_L3]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 220,
    h: 220,
    y: 740,
    x: 14
  },

  // ###   TIER 3 VEHICLES
  [vehicles.HOVER_CAR_L1]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 220,
    h: 220,
    y: 740,
    x: 527
  },

  [vehicles.HOVER_CAR_L2]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 220,
    h: 220,
    y: 740,
    x: 783
  },

  [vehicles.HOVER_CAR_L3]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 220,
    h: 220,
    y: 740,
    x: 1039
  },

  // ###   TIER 4 VEHICLES
  [vehicles.VROOM_VROOM]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 218,
    h: 218,
    y: 743,
    x: 1297
  },
  [vehicles.MODEL_0]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    x: 1553.1,
    y: 743,
    w: 218,
    h: 218
  },

  [vehicles.WONDER_VROOM]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 218,
    h: 218,
    y: 743,
    x: 1810
  },

  [vehicles.DIAMOND_VROOM]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 218,
    h: 218,
    y: 1218,
    x: 1294
  },

  [vehicles.BUILDA_VROOM]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 218,
    h: 218,
    y: 1700,
    x: 528 + 256 * 4
  },

  [vehicles.CADDY_VROOM]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 218,
    h: 218,
    y: 1700,
    x: 1807
  },

  [vehicles.BROOM_VROOM]: {
    atlasSrc: itemAtlas2,
    atlasSize: itemAtlasSize,
    w: 256,
    h: 256,
    y: 512,
    x: 0
  },

  [vehicles.KITTY_VROOM]: {
    atlasSrc: itemAtlas2,
    atlasSize: itemAtlasSize,
    w: 256,
    h: 256,
    y: 512,
    x: 256
  },

  // ###   TIER 5 VEHICLES
  [vehicles.DIVINITY]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 218,
    h: 218,
    y: 980,
    x: 527
  },

  [vehicles.PLEATHER_BIKE]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 218,
    h: 218,
    y: 980,
    x: 270
  },

  [vehicles.OCEAN_PEAFOWL]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 218,
    h: 218,
    y: 980,
    x: 783
  },

  [vehicles.FUEGO_MACHINA]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 218,
    h: 218,
    y: 980,
    x: 14
  },

  [vehicles.JUNKER_VAN]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 218,
    h: 218,
    y: 1456,
    x: 1039
  },

  [vehicles.VROOM_WING]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 218,
    h: 218,
    y: 1700,
    x: 1039.8
  },

  [vehicles.ROLLER_VROOM]: {
    atlasSrc: itemAtlas2,
    atlasSize: itemAtlasSize,
    w: 256,
    h: 256,
    y: 256,
    x: 0
  },

  [vehicles.BOSIER]: {
    atlasSrc: itemAtlas2,
    atlasSize: itemAtlasSize,
    w: 256,
    h: 256,
    y: 252,
    x: 252
  },

  [vehicles.RATTY_VROOM]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 218,
    h: 218,
    y: 1700,
    x: 1293
  },

  // ###   TIER 6 VEHICLES
  [vehicles.GRAND_PRIX_BRONZE]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 220,
    h: 219,
    y: 978,
    x: 1037
  },

  [vehicles.GRAND_PRIX_SILVER]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 220,
    h: 219,
    y: 978,
    x: 1294
  },

  [vehicles.GRAND_PRIX_GOLD]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 220,
    h: 219,
    y: 978,
    x: 1550
  },

  [vehicles.GRAND_PRIX_BRONZE_23]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 220,
    h: 219,
    y: 1696,
    x: 15
  },

  [vehicles.GRAND_PRIX_SILVER_23]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 220,
    h: 219,
    y: 1698,
    x: 271
  },

  [vehicles.GRAND_PRIX_GOLD_23]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 220,
    h: 219,
    y: 1456,
    x: 1807
  },

  [vehicles.FLAMES_END]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 220,
    h: 219,
    y: 1220,
    x: 784
  },

  [vehicles.TIDE_BREAKER]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 220,
    h: 220,
    y: 1450,
    x: 1290
  },

  [vehicles.VIRIDIAN_QUAKE]: {
    atlasSrc: itemAtlas1,
    atlasSize: itemAtlasSize,
    w: 220,
    h: 219,
    y: 1700,
    x: 784
  },

  [vehicles.OBSIDIAN_STRIKE]: {
    atlasSrc: itemAtlas2,
    atlasSize: itemAtlasSize,
    w: 256,
    h: 256,
    y: 0,
    x: 0
  },

  [vehicles.OPULENT]: {
    atlasSrc: itemAtlas2,
    atlasSize: itemAtlasSize,
    w: 256,
    h: 256,
    y: 0,
    x: 252
  }
}
