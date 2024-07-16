import { ReactEcs, UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs, type Sprite } from './utils/utils'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { closeButton, startButton } from './buttons'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { movePlayerTo } from '~system/RestrictedActions'
import { instance } from '../utils/currentInstance'
import * as utils from '@dcl-sdk/utils'
import { type GameController } from '../game.controller'

export class SoloSprintBoard {
  soloSprintBoard: Sprite
  soloSprintBoardVisible: boolean = false
  imageTexture: string
  gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
    this.imageTexture = 'assets/images/uiAtlas/board1Atlas.png'
    this.soloSprintBoard = {
      atlasSrc: this.imageTexture,
      atlasSize: { x: 2048, y: 2048 },
      x: 0,
      y: 0,
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
          display: this.soloSprintBoardVisible ? 'flex' : 'none'
        }}
      >
        {/* Solo Sprint Board */}
        <UiEntity
          uiTransform={{
            positionType: 'relative',
            width: (canvasInfo.height * 1.55) / 1.49,
            height: canvasInfo.height * 0.7
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(this.soloSprintBoard),
            texture: { src: this.soloSprintBoard.atlasSrc }
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
          {/* Start Button */}
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              position: { bottom: '2%', left: '38%' },
              width: (canvasInfo.height * 0.6625) / 2.75,
              height: canvasInfo.height * 0.1056
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(startButton),
              texture: { src: startButton.atlasSrc }
            }}
            onMouseDown={() => {
              this.startSoloSprint()
            }}
          />
        </UiEntity>
      </UiEntity>
    )
  }

  startSoloSprint(): void {
    // pass tournmode??
    if (this.gameController.Player.getFuel() >= 50) {
      // Hide the scoreboard
      this.hide()

      instance.setInstance('soloSprint')

      //   cleanupScene()

      // loader.showLoader(3000)

      // just copy what is in the powerup utils??
      //   const powerUps: serverStateSpec.PowerUpSelection =
      //     PowerUpsInv.toPowerUpSelection()

      //   const options: SceneArgs = {
      //     mode: { type: 'normal' },
      //     powerUps: powerUps
      //   }
      // Renders Solo-Sprint 2
      utils.timers.setTimeout(() => {
        // this.loadAndEnableSoloSprint2(options)
        utils.timers.setTimeout(() => {
          const raceStartPos = Vector3.create(86.25, 38, 32.9)
          void movePlayerTo({ newRelativePosition: raceStartPos })
        }, 50)
      }, 50)
      // }

      // if (Player.getFuel() < 50) {
      this.gameController.uiController.displayAnnouncement(
        'You need more FUEL! Go hit the dance floor at The Recharge!',
        Color4.Yellow(),
        2000
      )
    }
  }

  hide(): void {
    // Unsubscribe from buttons
    // removeKeyBindings(this.eButtonAction, this.fButtonAction)
    this.soloSprintBoardVisible = false
  }

  show(): void {
    // Subscribe to keys
    // if (!Input.instance) attachKeyBindings(this.eButtonAction, this.fButtonAction)
    this.soloSprintBoardVisible = true
  }
}
