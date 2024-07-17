import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type GameController } from '../game.controller'
import {
  closeButton,
  startCapitalButton,
  startCloudlandsButton,
  startObelisqueButton,
  startFungalButton,
  startWinterButton,
  startWAGMIButton,
  startAtlantisButton
} from './buttons'
import { getUvs, type Sprite } from './utils/utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SHOW_LOAD_TIME = 14000

export class DecentrallyBoard {
  board: Sprite
  boardVisible: boolean = false
  imageTexture: string
  gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
    this.imageTexture = 'assets/images/uiAtlas/board1Atlas.png'
    this.board = {
      atlasSrc: this.imageTexture,
      atlasSize: { x: 2048, y: 2048 },
      x: 1000,
      y: 680,
      w: 975,
      h: 653
    }
  }

  createUI(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          width: canvasInfo.width,
          height: canvasInfo.height,
          justifyContent: 'center',
          positionType: 'absolute',
          position: { top: '25%', right: '0%' },
          display: this.boardVisible ? 'flex' : 'none'
        }}
      >
        {/* Decentrally Board */}
        <UiEntity
          uiTransform={{
            positionType: 'relative',
            width: (canvasInfo.height * 1.55) / 1.49,
            height: canvasInfo.height * 0.7
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(this.board),
            texture: { src: this.board.atlasSrc }
          }}
          onMouseDown={() => {}}
        >
          {/* Close Button */}
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              position: { top: '4%', right: '4.3%' },
              width: (canvasInfo.height * 0.39) / 2.75,
              height: canvasInfo.height * 0.055
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(closeButton),
              texture: { src: closeButton.atlasSrc }
            }}
            onMouseDown={() => {
              this.hide()
            }}
          />
          {/* START BUTTON #1 */}
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              position: { bottom: '12%', left: '10%' },
              width: (canvasInfo.height * 0.4496) / 2.75,
              height: canvasInfo.height * 0.06
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(startCapitalButton),
              texture: { src: startCapitalButton.atlasSrc }
            }}
            onMouseDown={() => {}}
          />
          {/* START BUTTON #2 */}
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              position: { bottom: '12%', left: '27%' },
              width: (canvasInfo.height * 0.4496) / 2.75,
              height: canvasInfo.height * 0.06
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(startCloudlandsButton),
              texture: { src: startCloudlandsButton.atlasSrc }
            }}
            onMouseDown={() => {}}
          />
          {/* START BUTTON #3 */}
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              position: { bottom: '12%', left: '44%' },
              width: (canvasInfo.height * 0.4496) / 2.75,
              height: canvasInfo.height * 0.06
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(startObelisqueButton),
              texture: { src: startObelisqueButton.atlasSrc }
            }}
            onMouseDown={() => {}}
          />
          {/* START BUTTON #4 */}
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              position: { bottom: '12%', left: '61%' },
              width: (canvasInfo.height * 0.4496) / 2.75,
              height: canvasInfo.height * 0.06
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(startFungalButton),
              texture: { src: startFungalButton.atlasSrc }
            }}
            onMouseDown={() => {}}
          />
          {/* START BUTTON #5 */}
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              position: { bottom: '12%', left: '78%' },
              width: (canvasInfo.height * 0.4496) / 2.75,
              height: canvasInfo.height * 0.06
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(startWinterButton),
              texture: { src: startWinterButton.atlasSrc }
            }}
            onMouseDown={() => {}}
          />
          {/* START BUTTON #6 */}
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              position: { bottom: '2%', left: '10%' },
              width: (canvasInfo.height * 0.4496) / 2.75,
              height: canvasInfo.height * 0.06
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(startWAGMIButton),
              texture: { src: startWAGMIButton.atlasSrc }
            }}
            onMouseDown={() => {}}
          />
          {/* START BUTTON #7 */}
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              position: { bottom: '2%', left: '27%' },
              width: (canvasInfo.height * 0.4496) / 2.75,
              height: canvasInfo.height * 0.06
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(startAtlantisButton),
              texture: { src: startAtlantisButton.atlasSrc }
            }}
            onMouseDown={() => {}}
          />
        </UiEntity>
      </UiEntity>
    )
  }

  hide(): void {
    // Unsubscribe from buttons
    // removeKeyBindings(this.eButtonAction, this.fButtonAction)
    this.boardVisible = false
  }

  show(): void {
    // Subscribe to keys
    // if (!Input.instance) attachKeyBindings(this.eButtonAction, this.fButtonAction);
    this.boardVisible = true
  }
}
