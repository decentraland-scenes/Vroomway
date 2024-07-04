import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { inventoryInactiveButton, missionsInactiveButton, teleportButton } from './buttons'
import { getUvs } from './utils/utils'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'

export class SideBar {
  private readonly canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  public isVisible: boolean = false
  constructor() {
    this.isVisible = true
  }

  createSideBarIcons(): ReactEcs.JSX.Element | null {
    if (this.canvasInfo === null) return null
    return (
        <UiEntity
        uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          positionType: 'absolute',
          position: { right: '0.5%', bottom: '20%' },
          width: (this.canvasInfo.height * 0.24) / 1.75,
          height: this.canvasInfo.height * 0.077,
          display: this.isVisible ? 'flex' : 'none'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(inventoryInactiveButton),
          texture: { src: inventoryInactiveButton.atlasSrc }
        }}
        onMouseDown={() => {}}
      >
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          positionType: 'absolute',
          position: { right: '0.5%', top: '120%' },
          width: (this.canvasInfo.height * 0.24) / 1.75,
          height: this.canvasInfo.height * 0.077,
          display: this.isVisible ? 'flex' : 'none'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(missionsInactiveButton),
          texture: { src: missionsInactiveButton.atlasSrc }
        }}
        onMouseDown={() => {}}
      >
        <UiEntity
          uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            positionType: 'absolute',
            position: { right: '0%', top: '120%' },
            width: (this.canvasInfo.height * 0.24) / 1.75,
            height: this.canvasInfo.height * 0.077,
            display: this.isVisible ? 'flex' : 'none'
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(teleportButton),
            texture: { src: teleportButton.atlasSrc }
          }}
          onMouseDown={() => {}}
        />
      </UiEntity>
      </UiEntity>
    )
  }
}
