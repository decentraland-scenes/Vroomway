import { type Sprite } from '../utils/utils'

const buttonAtlas: string = 'assets/images/uiAtlas/buttonAtlas.png'
const buttonAtlasSize: { x: number; y: number } = { x: 2048, y: 2048 }
const board1Atlas = 'assets/images/uiAtlas/buttonAtlas.png'



export const buttonsSprites: Record<string, Sprite> = {
  tweetSprite: {
    atlasSrc: buttonAtlas,
    atlasSize: buttonAtlasSize,
    x: 539,
    y: 231,
    w: 235,
    h: 100
  },
  claimSprite: {
    atlasSrc: buttonAtlas,
    atlasSize: buttonAtlasSize,
    x: 1798,
    y: 31,
    w: 235,
    h: 100
  },
  modsSprite: {
    atlasSrc: 'assets/images/uiAtlas/board3Atlas.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 0,
    y: 1956,
    w: 260,
    h: 92
  },
  joinDiscord: {
    atlasSrc: board1Atlas,
    atlasSize: { x: 2048, y: 2048 },
    x: 0,
    y: 680,
    w: 135,
    h: 91
  },
  joinTwitter: {
    atlasSrc: board1Atlas,
    atlasSize: { x: 2048, y: 2048 },
    x: 0,
    y: 786,
    w: 135,
    h: 91
  },
    missionsActive: {
      atlasSrc: board1Atlas,
      atlasSize: { x: 2048, y: 2048 },
      x: 475.5,
      y: 531,
      w: 284,
      h: 160.5,
    },
    missionsInactive: {
      atlasSrc: board1Atlas,
      atlasSize: { x: 2048, y: 2048 },
      x: 169,
      y: 348,
      w: 284,
      h: 160
    },
  
  teleportButton: {
    atlasSrc: board1Atlas,
    atlasSize: { x: 2048, y: 2048 },
    x: 169,
    y: 531.3,
    w: 284,
    h: 160
  },
 
    inventoryActive: {
      atlasSrc: board1Atlas,
      atlasSize: { x: 2048, y: 2048 },
      x: 475.5,
      y: 340.6,
      w: 284,
      h: 160,
    },
    inventoryInactive: {
      atlasSrc: board1Atlas,
      atlasSize: { x: 2048, y: 2048 },
      x: 169,
      y: 715,
      w: 284,
      h: 160
    },
 
  refuelIcon: {
    atlasSrc: board1Atlas,
    atlasSize: { x: 2048, y: 2048 },
    x: 23,
    y: 334,
    w: 120,
    h: 120
  },
  closeButton: {
    atlasSrc: board1Atlas,
    atlasSize: { x: 2048, y: 2048 },
    x: 1550.1,
    y: 137.5,
    w: 229,
    h: 91.4
  },
  startButton: {
    atlasSrc: board1Atlas,
    atlasSize: { x: 2048, y: 2048 },
    x: 792.5,
    y: 137.5,
    w: 229,
    h: 91.4
  },
  startCapitalButton: {
    atlasSrc: board1Atlas,
    atlasSize: { x: 2048, y: 2048 },
    x: 541.7,
    y: 137.5,
    w: 235,
    h: 100
  },
  startCloudlandsButton: {
    atlasSrc: board1Atlas,
    atlasSize: { x: 2048, y: 2048 },
    x: 290.7,
    y: 137.5,
    w: 235,
    h: 100
  },
  startObelisqueButton: {
    atlasSrc: board1Atlas,
    atlasSize: { x: 2048, y: 2048 },
    x: 35.4,
    y: 239.5,
    w: 235,
    h: 100
  },
  startFungalButton: {
    atlasSrc: board1Atlas,
    atlasSize: { x: 2048, y: 2048 },
    x: 35.4,
    y: 137.5,
    w: 235,
    h: 100
  },
  startWinterButton: {
    atlasSrc: board1Atlas,
    atlasSize: { x: 2048, y: 2048 },
    x: 290.7,
    y: 239.5,
    w: 235,
    h: 100
  },
  startWAGMIButton: {
    atlasSrc: board1Atlas,
    atlasSize: { x: 2048, y: 2048 },
    x: 792.5,
    y: 239.5,
    w: 235,
    h: 100
  },
  startAtlantisButton: {
    atlasSrc: board1Atlas,
    atlasSize: { x: 2048, y: 2048 },
    x: 1292.5,
    y: 341.5,
    w: 235,
    h: 100
  },
  
  danceOnIcon: {
    atlasSrc: board1Atlas,
    atlasSize: { x: 2048, y: 2048 },
    x: 0,
    y: 1390,
    w: 150.9,
    h: 105.8
  },
  
  danceOffIcon: {
    atlasSrc: board1Atlas,
    atlasSize: { x: 2048, y: 2048 },
    x: 0,
    y: 1495,
    w: 150.9,
    h: 105.8
  },
  
  superchargeIcon: {
    atlasSrc: board1Atlas,
    atlasSize: { x: 2048, y: 2048 },
    x: 23,
    y: 455,
    w: 120,
    h: 106
  },
  
  buyHexagonButton: {
    atlasSrc: board1Atlas,
    atlasSize: { x: 2048, y: 2048 },
    x: 17,
    y: 1600,
    w: 120,
    h: 120
  }
}
