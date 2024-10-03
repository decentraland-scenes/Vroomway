import { type Sprite } from '../utils/utils'

const board2Atlas: string = 'assets/images/uiAtlas/board2Atlas.png'
const board2AtlasSize: { x: number; y: number } = { x: 2048, y: 2048 }

export const boardsSprites: Record<string, Sprite> = {
  rewardBoardSprite: {
    atlasSrc: board2Atlas,
    atlasSize: board2AtlasSize,
    x: 1325,
    y: 1383,
    w: 718,
    h: 665
  }
}
