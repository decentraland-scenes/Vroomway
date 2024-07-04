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
export const missionsActiveButton: Sprite = {
  atlasSrc: board1Atlas,
  atlasSize: { x: 2048, y: 2048 },
  x: 475.5,
  y: 531,
  w: 284,
  h: 160.5
}
export const missionsInactiveButton: Sprite = {
  atlasSrc: board1Atlas,
  atlasSize: { x: 2048, y: 2048 },
  x: 169,
  y: 348,
  w: 284,
  h: 160
}
export const teleportButton: Sprite = {
  atlasSrc: board1Atlas,
  atlasSize: { x: 2048, y: 2048 },
  x: 169,
  y: 531.3,
  w: 284,
  h: 160
}
export const inventoryInactiveButton: Sprite = {
  atlasSrc: board1Atlas,
  atlasSize: { x: 2048, y: 2048 },
  x: 169,
  y: 715,
  w: 284,
  h: 160
}