import { Vector3, Quaternion } from '@dcl/sdk/math'
import { type GameController } from '../controllers/game.controller'
import { ReactEcs, UiEntity } from '@dcl/sdk/react-ecs'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { getUvs, type Sprite } from './utils/utils'
import { danceOffIcon, danceOnIcon } from './buttons'

export const danceAreas: any = [
  {
    transform: {
      position: Vector3.create(47.65, 3.29, 32.72),
      rotation: Quaternion.fromEulerDegrees(90, 0, 0),
      scale: Vector3.create(10, 10, 10)
    },
    type: 'all'
  }
]

export class DanceArea {
  gameController: GameController
  isVisible: boolean = false
  danceIconTexture: Sprite
  isDanceOn: boolean = true
  constructor(gameController: GameController) {
    this.gameController = gameController
    this.danceIconTexture = danceOnIcon
  }

  createDanceAreas(): void {
    this.isVisible = true
    this.isDanceOn = true
  }

  mainUI(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          positionType: 'absolute',
          position: { right: '0%', bottom: '32%' },
          width: (canvasInfo.height * 0.1) / 0.67,
          height: canvasInfo.height * 0.1,
          display: this.isVisible ? 'flex' : 'none'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(this.danceIconTexture),
          texture: { src: this.danceIconTexture.atlasSrc }
        }}
        onMouseDown={() => {
          this.toggleDanceButton()
        }}
      ></UiEntity>
    )
  }

  toggleDanceButton(): void {
    if (this.isDanceOn) {
      this.danceIconTexture = danceOffIcon
    } else {
      this.danceIconTexture = danceOnIcon
    }
    this.isDanceOn = !this.isDanceOn
  }
}
