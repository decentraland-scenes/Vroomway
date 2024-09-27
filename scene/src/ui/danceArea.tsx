import { type Quaternion, Color4, Vector3 } from '@dcl/sdk/math'
import { type GameController } from '../controllers/game.controller'
import { ReactEcs, UiEntity } from '@dcl/sdk/react-ecs'
import {
  Material,
  MeshRenderer,
  Transform,
  UiCanvasInformation,
  engine
} from '@dcl/sdk/ecs'
import { getUvs, type Sprite } from './utils/utils'
import { danceOffIcon, danceOnIcon } from './buttons'
import * as utils from '@dcl-sdk/utils'
import { movePlayerTo, triggerEmote } from '~system/RestrictedActions'
import { entityController } from '../utils/entityController'
import { instance } from '../utils/currentInstance'
import { missions } from '../utils/missions'

export class DanceAreaUI {
  gameController: GameController
  isVisible: boolean = false
  danceIconTexture: Sprite
  isDanceOn: boolean = true
  constructor(gameController: GameController) {
    this.gameController = gameController
    this.danceIconTexture = danceOnIcon
  }

  turnOnUI(): void {
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
      this.gameController.realmController.currentRealm?.callSingleFunction(
        'enableDanceAreas',
        false
      )
    } else {
      this.gameController.realmController.currentRealm?.callSingleFunction(
        'enableDanceAreas',
        true
      )
      this.danceIconTexture = danceOnIcon
    }
    this.isDanceOn = !this.isDanceOn
  }
}

export class DanceArea {
  danceArea = entityController.addEntity()
  danceSystem = new DanceSystem('all')
  gameController: GameController
  firstTime: boolean = true
  constructor(
    gameController: GameController,
    position: Vector3,
    scale: Vector3,
    rotation: Quaternion
  ) {
    this.gameController = gameController
    Transform.create(this.danceArea, {
      position,
      scale,
      rotation
    })
    MeshRenderer.setBox(this.danceArea)
    Material.setPbrMaterial(this.danceArea, {
      albedoColor: Color4.create(0, 0, 0, 0)
    })
    utils.triggers.addTrigger(
      this.danceArea,
      1,
      1,
      [{ type: 'box', scale }],
      () => {
        if (this.firstTime) {
          void movePlayerTo({
            newRelativePosition: Vector3.create(48, 16.29, 32),
            cameraTarget: Vector3.create(48, 8.29, 32)
          })
          this.firstTime = false
        }
        this.danceSystem.routine = 'all'
        this.danceSystem.dance()
        if (instance.getInstance() !== 'recharge') return
        if (this.gameController.Player.getFuel() < 50)
          this.gameController.superChargeTimer.initDanceTimer()
        this.gameController.superChargeTimer.show()
        missions.checkAndUnlockCampaignMission('visitDanceFloor')
      },
      () => {
        this.gameController.superChargeTimer.removeDanceTimer()
      }
    )
  }
}

export class DanceSystem {
  length = 11
  timer = 2
  routine: any
  danceFunction: () => void = () => {
    this.dance()
  }

  routines: string[] = [
    'robot',
    'tik',
    'tektonik',
    'hammer',
    'headexplode',
    'handsair',
    'disco',
    'dab'
  ]

  constructor(routine: string) {
    this.routine = routine
  }

  update(dt: number): void {
    if (this.timer > 0) {
      this.timer -= dt
    } else {
      this.dance()
    }
  }

  dance(): void {
    console.log('dance' + this.routine)
    this.timer = this.length
    if (this.routine === 'all') {
      const rand = Math.floor(Math.random() * (this.routine.length - 0) + 0)
      void triggerEmote({ predefinedEmote: this.routines[rand] })
    } else {
      void triggerEmote({ predefinedEmote: this.routine })
    }
  }
}
