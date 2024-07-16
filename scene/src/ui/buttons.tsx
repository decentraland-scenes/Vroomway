import type { Sprite } from './utils/utils'

const board1Atlas = 'assets/images/uiAtlas/buttonAtlas.png'
export const joinDiscord: Sprite = {
  atlasSrc: board1Atlas,
  atlasSize: { x: 2048, y: 2048 },
  x: 0,
  y: 680,
  w: 135,
  h: 91
}
export const joinTwitter: Sprite = {
  atlasSrc: board1Atlas,
  atlasSize: { x: 2048, y: 2048 },
  x: 0,
  y: 786,
  w: 135,
  h: 91
}
export const missionsButtons: Record<string, Sprite> = {
  active: {
    atlasSrc: board1Atlas,
    atlasSize: { x: 2048, y: 2048 },
    x: 475.5,
    y: 531,
    w: 284,
    h: 160.5
  },
  inactive: {
    atlasSrc: board1Atlas,
    atlasSize: { x: 2048, y: 2048 },
    x: 169,
    y: 348,
    w: 284,
    h: 160
  }
}
export const teleportButton: Sprite = {
  atlasSrc: board1Atlas,
  atlasSize: { x: 2048, y: 2048 },
  x: 169,
  y: 531.3,
  w: 284,
  h: 160
}
export const inventoryButtons: Record<string, Sprite> = {
  active: {
    atlasSrc: board1Atlas,
    atlasSize: { x: 2048, y: 2048 },
    x: 475.5,
    y: 340.6,
    w: 284,
    h: 160
  },
  inactive: {
    atlasSrc: board1Atlas,
    atlasSize: { x: 2048, y: 2048 },
    x: 169,
    y: 715,
    w: 284,
    h: 160
  }
}
export const refuelIcon: Sprite = {
  atlasSrc: board1Atlas,
  atlasSize: { x: 2048, y: 2048 },
  x: 0,
  y: 348.3,
  w: 150.9,
  h: 105.8
}
export const closeButton: Sprite = {
  atlasSrc: board1Atlas,
  atlasSize: { x: 2048, y: 2048 },
  x: 1550.1,
  y: 137.5,
  w: 229,
  h: 91.4
};
export const startButton: Sprite = {
  atlasSrc: board1Atlas,
  atlasSize: { x: 2048, y: 2048 },
  x: 792.5,
  y: 137.5,
  w: 229,
  h: 91.4
};
export const startCapitalButton: Sprite = {
  atlasSrc: board1Atlas,
  atlasSize: { x: 2048, y: 2048 },
  x: 541.7,
  y: 137.5,
  w: 235,
  h: 100
};
export const startCloudlandsButton: Sprite = {
  atlasSrc: board1Atlas,
  atlasSize: { x: 2048, y: 2048 },
  x: 290.7,
  y: 137.5,
  w: 235,
  h: 100
};
export const startObelisqueButton: Sprite = {
  atlasSrc: board1Atlas,
  atlasSize: { x: 2048, y: 2048 },
  x: 35.4,
  y: 239.5,
  w: 235,
  h: 100
};
export const startFungalButton: Sprite = {
  atlasSrc: board1Atlas,
  atlasSize: { x: 2048, y: 2048 },
  x: 35.4,
  y: 137.5,
  w: 235,
  h: 100
};
export const startWinterButton: Sprite = {
  atlasSrc: board1Atlas,
  atlasSize: { x: 2048, y: 2048 },
  x: 290.7,
  y: 239.5,
  w: 235,
  h: 100
};
export const startWAGMIButton: Sprite = {
  atlasSrc: board1Atlas,
  atlasSize: { x: 2048, y: 2048 },
  x: 792.5,
  y: 239.5,
  w: 235,
  h: 100
};
export const startAtlantisButton: Sprite = {
  atlasSrc: board1Atlas,
  atlasSize: { x: 2048, y: 2048 },
  x: 1292.5,
  y: 341.5,
  w: 235,
  h: 100
};
