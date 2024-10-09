import { type Sprite } from '../utils/utils'

const board2Atlas: string = 'assets/images/uiAtlas/board2Atlas.png'
const board2AtlasSize: { x: number; y: number } = { x: 2048, y: 2048 }
const board3Atlas: string = 'assets/images/uiAtlas/board3Atlas.png'
const board3AtlasSize: { x: number; y: number } = { x: 2048, y: 2048 }
const board8Atlas: string = 'assets/images/uiAtlas/board8Atlas.png'
const board8AtlasSize: { x: number; y: number } = { x: 2048, y: 2048 }

export const boardsSprites: Record<string, Sprite> = {
  rewardBoardSprite: {
    atlasSrc: board2Atlas,
    atlasSize: board2AtlasSize,
    x: 1325,
    y: 1383,
    w: 718,
    h: 665
  },
  inventoryAccesoriesBoardSprite: {
    atlasSrc: board3Atlas,
    atlasSize: board3AtlasSize,
    x: 18,
    y: 14,
    w: 975,
    h: 547
  },
  inventoryVehiclesBoardSprite: {
    atlasSrc: board3Atlas,
    atlasSize: board3AtlasSize,
    x: 18,
    y: 575,
    w: 975,
    h: 547
  },
  inventoryPowerUpsBoardSprite: {
    atlasSrc: board3Atlas,
    atlasSize: board3AtlasSize,
    x: 18,
    y: 1141,
    w: 975,
    h: 547
  },
  inventoryMaterialsBoardSprite: {
    atlasSrc: board3Atlas,
    atlasSize: board3AtlasSize,
    x: 1058,
    y: 14,
    w: 975,
    h: 547
  },
  modsSprite: {
    atlasSrc: board8Atlas,
    atlasSize: board8AtlasSize,
    x: 488,
    y: 45,
    w: 1065,
    h: 1964
  },
  modHighlightSprite: {
    atlasSrc: board8Atlas,
    atlasSize: board8AtlasSize,
    x: 31,
    y: 20,
    w: 250,
    h: 250
  },
  modLockSprite: {
    atlasSrc: board8Atlas,
    atlasSize: board8AtlasSize,
    x: 92,
    y: 320,
    w: 162,
    h: 182
  },
  lootBoard: {
    atlasSrc: 'assets/images/uiAtlas/board2Atlas.png',
    atlasSize: { x: 2048, y: 2048 },
    x: 947,
    y: 1176,
    w: 1047,
    h: 190
  }
}
