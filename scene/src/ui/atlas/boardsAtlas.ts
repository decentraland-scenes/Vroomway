import { type Sprite } from "../utils/utils"

const board1Atlas: string = 'assets/images/uiAtlas/board2Atlas.png'
const board1AtlasSize: { x: number, y: number } = { x: 2048, y: 2048 }




  export const itemsSprites: Record<string, Sprite> = {
    rewardBoardSprite:{
        atlasSrc: board1Atlas,
        atlasSize: board1AtlasSize,
        x: 1325,
        y: 1383,
        w: 256,
        h: 665
      }
  }