import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs } from './utils/utils'
import { joinDiscord, joinTwitter } from './buttons'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'

export class UIController {
  public canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  constructor() {
    const uiComponent = (): ReactEcs.JSX.Element => [
      this.joinDiscord(),
      this.joinTwitter()
    ]
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }

  render(): void {}

  joinDiscord(): ReactEcs.JSX.Element | null {
    if (this.canvasInfo === null) return null
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          positionType: 'absolute',
          position: { left: '1%', top: '30%' },
          width: (this.canvasInfo.height * 0.06) / 0.67,
          height: this.canvasInfo.height * 0.06
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(joinDiscord),
          texture: { src: joinDiscord.atlasSrc }
        }}
      />
    )
  } 

  joinTwitter(): ReactEcs.JSX.Element | null {
    if (this.canvasInfo === null) return null
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          positionType: 'absolute',
          position: { left: '4.5%', top: '30%' },
          width: (this.canvasInfo.height * 0.06) / 0.67,
          height: this.canvasInfo.height * 0.06
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(joinTwitter),
          texture: { src: joinTwitter.atlasSrc }
        }}
      />
    )
  }
}
