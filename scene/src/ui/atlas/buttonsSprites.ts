import { type Sprite } from "../utils/utils"

const buttonAtlas: string = 'assets/images/uiAtlas/buttonAtlas.png'
const buttonAtlasSize: { x: number, y: number } = { x: 2048, y: 2048 }


export const itemsSprites: Record<string, Sprite> = {
    tweetSprite : {
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
    }
}