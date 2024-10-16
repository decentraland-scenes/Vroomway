import { type Coords } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'

export function getUvs(sprite: Sprite | undefined): number[] {
  if (sprite !== undefined) {
    const A: Coords = {
      x: sprite.x / sprite.atlasSize.x,
      y: 1 - (sprite.y + sprite.h) / sprite.atlasSize.y
    }
    const B: Coords = {
      x: sprite.x / sprite.atlasSize.x,
      y: 1 - sprite.y / sprite.atlasSize.y
    }
    const C: Coords = {
      x: (sprite.x + sprite.w) / sprite.atlasSize.x,
      y: 1 - sprite.y / sprite.atlasSize.y
    }
    const D: Coords = {
      x: (sprite.x + sprite.w) / sprite.atlasSize.x,
      y: 1 - (sprite.y + sprite.h) / sprite.atlasSize.y
    }

    const finalUvs: number[] = [A.x, A.y, B.x, B.y, C.x, C.y, D.x, D.y]
    return finalUvs
  }
  return []
}

export function Tab(props: {
  condition: boolean
  trueSprite: Sprite
  falseSprite: Sprite
  callback: (value: boolean) => void
  callbackValue: boolean
}): ReactEcs.JSX.Element {
  return (
    <UiEntity
      uiTransform={{
        positionType: 'relative',
        width: '50%',
        height: '100%'
      }}
      uiBackground={{
        textureMode: 'stretch',
        uvs: getUvs(props.condition ? props.trueSprite : props.falseSprite),
        texture: {
          src: props.trueSprite.atlasSrc
        }
      }}
      onMouseDown={() => {
        props.callback(props.callbackValue)
      }}
    ></UiEntity>
  )
}

export type Sprite = {
  atlasSrc: string
  atlasSize: { x: number; y: number }
  x: number
  y: number
  w: number
  h: number
}
