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
};