import { type Sprite } from "../utils/utils"

const itemAtlas: string = 'assets/images/uiAtlas/itemAtlas.png'
const itemAtlasSize: { x: number, y: number } = { x: 2048, y: 2048 }


export const itemsSprites: Record<string, Sprite> = {
    coinSprite : {
        atlasSrc: itemAtlas,
        atlasSize: itemAtlasSize,
        x: 256,
        y: 0,
        w: 256,
        h: 246
    },
    cargoSprite: {
        atlasSrc: itemAtlas,
        atlasSize: itemAtlasSize,
        x: 0,
        y: 1476,
        w: 256,
        h: 246
    }
}