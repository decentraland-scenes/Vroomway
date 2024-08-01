import { ReactEcs, UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs, type Sprite } from './utils/utils'
import {
  AudioSource,
  AvatarAnchorPointType,
  AvatarAttach,
  Transform,
  UiCanvasInformation,
  engine
} from '@dcl/sdk/ecs'
import { closeButton, startButton } from './buttons'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { movePlayerTo } from '~system/RestrictedActions'
import { instance } from '../utils/currentInstance'
import * as utils from '@dcl-sdk/utils'
import { type GameController } from '../controllers/game.controller'
import { getUserData } from '~system/UserIdentity'
import { entityController } from '../utils/entityController'

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

  createUI(): ReactEcs.JSX.Element {
    const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          width: canvasInfo.width,
          height: canvasInfo.height,
          justifyContent: 'center',
          positionType: 'absolute',
          position: { top: '25%', right: '0%' }
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
      // loader.showLoader(3000)
      // just copy what is in the powerup utils??
      //   const powerUps: serverStateSpec.PowerUpSelection =
      //     PowerUpsInv.toPowerUpSelection()

      //   const options: SceneArgs = {
      //     mode: { type: 'normal' },
      //     powerUps: powerUps
      //   }
      // Renders Solo-Sprint 2
      this.gameController.realmController.switchRealm('soloSprint')
      utils.timers.setTimeout(() => {
        void this.loadAndEnableSoloSprint2()
        utils.timers.setTimeout(() => {
          const raceStartPos = Vector3.create(86.25, 38, 32.9)
          void movePlayerTo({ newRelativePosition: raceStartPos })
        }, 50)
      }, 50)
    }
    if (this.gameController.Player.getFuel() < 50) {
      this.gameController.uiController.displayAnnouncement(
        'You need more FUEL! Go hit the dance floor at The Recharge!',
        Color4.Yellow(),
        2000
      )
    }
  }

  async loadAndEnableSoloSprint2(): Promise<void> {
    let startClicked = false
    console.log('Race is starting! WOOOOOP')

    if (startClicked) return
    startClicked = true
    const publicKey = await getUserData({})
    // Create entity
    const cube = entityController.addEntity()
    Transform.createOrReplace(cube, {
      parent: engine.PlayerEntity
    })
    AvatarAttach.createOrReplace(cube, {
      avatarId: publicKey.data?.publicKey,
      anchorPointId: AvatarAnchorPointType.AAPT_NAME_TAG
    })
    // Create AudioClip object, holding audio file
    AudioSource.create(cube, {
      audioClipUrl: 'sounds/solosprintMusicTrack.mp3'
    })
    // Add AudioSource component to entity
    // start timer
    // if connected to lobby, lobby will overwrite, but still want this here to enforce expectation
    // Constants.SCENE_MGR.lastRaceType = 'solosprint'
    // powerUpBarUI.show()
    // GAME_STATE.setGameTimeFromServerClock({ serverTime: -2 }) // using local game time since not connected
    // PowerUpsInv.powerUpMgr.reset()
    // PowerUpsInv.powerUpMgr.initPowerUps(options.powerUps)
    // PowerUpsInv.powerUpMgr.updateStatuses()
    // save too??
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const preFuel = this.gameController.Player.getFuel()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const preFuelAdj = this.gameController.Player.getValueAdjuster().fuel
    this.gameController.Player.getValueAdjuster().fuel -= this.getFuelCost(50)
    this.gameController.uiController.profile.updateFuel()
    void this.gameController.Player.writeDataToServer({
      onFinish: { updateUI: true }
    })
    // sprintTimer.startTimer(options) // kicks off rewards
  }

  getFuelCost = (fuelCost: number): number => {
    const total = this.gameController.vehicleOwnership.getFuelEff(fuelCost)
    return total
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
