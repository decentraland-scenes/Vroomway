import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs, type Sprite } from './utils/utils'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { type UIController } from './ui.controller'
import { Color4 } from '@dcl/sdk/math'
import { refuelIcon } from './buttons'
import * as utils from '@dcl-sdk/utils'
import { LevelManager } from '../leveling/level-manager'
import { ItemNameResource } from '../inventory/inventory-data'
import { InventoryManager } from '../inventory/inventory-manager'
import { PLAYER_SCORE_NAMES } from '../player-scores/player-score-data'
import { PlayerScoreManager } from '../player-scores/player-score-manager'

export class Profile {
  public profile: Sprite
  public isVisible: boolean = true
  public board2Atlas = 'assets/images/uiAtlas/board2Atlas.png'
  uiController: UIController
  public refuelTimer: string = ''
  public exp: string = '-'
  public lvl: number = 0
  public coins: number = 0
  public fuel: number = 0
  public compPoints: number = 0
  constructor(uiController: UIController) {
    this.uiController = uiController
    this.profile = {
      atlasSrc: this.board2Atlas,
      atlasSize: { x: 2048, y: 2048 },
      x: 16,
      y: 1787,
      w: 995,
      h: 249
    }
    utils.timers.setTimeout(() => {
      this.initRefuelTimer()
    }, 2000)
  }

  initialize(): ReactEcs.JSX.Element | null {
    this.updateExp()
    this.updateLvl()
    this.updateCoins()
    this.updateFuel()
    this.updateCompPoints()
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          width: canvasInfo.width,
          height: canvasInfo.height * 0.1,
          justifyContent: 'flex-end',
          positionType: 'absolute',
          position: { top: '0%', right: '0%' },
          display: this.isVisible ? 'flex' : 'none'
        }}
      >
        {/* Refuel Timer */}
        <UiEntity
          uiTransform={{
            positionType: 'relative',
            width: (canvasInfo.height * 0.17) / 1.09,
            height: canvasInfo.height * 0.1
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(refuelIcon),
            texture: { src: refuelIcon.atlasSrc }
          }}
          onMouseDown={() => {}}
        >
          {/* Timer */}
          <Label
            uiTransform={{
              positionType: 'absolute',
              position: { right: '48%', top: '33%' }
            }}
            value={this.refuelTimer}
            fontSize={16}
            font="sans-serif"
            color={Color4.Yellow()}
          />
        </UiEntity>
        {/* Profile Conteiner */}
        <UiEntity
          uiTransform={{
            positionType: 'relative',
            width: (canvasInfo.height * 2.16) / 3.99,
            height: '100%'
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(this.profile),
            texture: { src: this.profile.atlasSrc }
          }}
          onMouseDown={() => {}}
        >
          {/* Level */}
          <Label
            uiTransform={{
              positionType: 'absolute',
              position: { right: '34%', top: '15%' }
            }}
            value={this.lvl.toString()}
            fontSize={20}
            font="sans-serif"
            color={Color4.Yellow()}
          />
          {/* Exp */}
          <Label
            uiTransform={{
              positionType: 'absolute',
              position: { right: '49%', top: '35%' }
            }}
            value={this.exp}
            fontSize={11}
            font="sans-serif"
            color={Color4.Yellow()}
            textAlign="middle-left"
          />
          {/* Fuel */}
          <Label
            uiTransform={{
              positionType: 'absolute',
              position: { right: '87%', top: '20%' }
            }}
            value={this.fuel.toString()}
            fontSize={20}
            font="sans-serif"
            color={Color4.Yellow()}
          />
          {/* Comp points */}
          <Label
            uiTransform={{
              positionType: 'absolute',
              position: { right: '55%', top: '64%' }
            }}
            value={this.compPoints.toString()}
            fontSize={20}
            font="sans-serif"
            color={Color4.Yellow()}
          />
          {/* Coins */}
          <Label
            uiTransform={{
              positionType: 'absolute',
              position: { right: '87%', top: '64%' }
            }}
            value={this.coins.toString()}
            fontSize={20}
            font="sans-serif"
            color={Color4.Yellow()}
          />
        </UiEntity>
      </UiEntity>
    )
  }

  initRefuelTimer(): void {
    // Update time since last login
    utils.timers.setInterval(() => {
      const nextMidnight = new Date()
      nextMidnight.setUTCHours(24, 0, 0, 0)
      const now = new Date()
      const remainingTimeInSeconds =
        (nextMidnight.getTime() - now.getTime()) / 1000
      if (remainingTimeInSeconds <= 1) {
        this.setRefuelTimer(0)
        return
      }
      this.setRefuelTimer(remainingTimeInSeconds)
    }, 200)
  }

  setRefuelTimer(seconds: number): void {
    const time = this.format(seconds)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    this.refuelTimer = time
  }

  format = (secs: number): string => {
    const auxSec = secs.toString()
    const secNum = parseFloat(auxSec)
    const hours = Math.floor(secNum / 3600)
    const minutes = Math.floor(secNum / 60) % 60
    const seconds = (secNum % 60).toFixed(0)

    return [hours, minutes, seconds]
      .map((v) => (Number(v) < 10 ? '0' + v : v))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':')
  }

  updateExp(): void {
    this.exp =
      LevelManager.Instance.CallbackGetExperienceNext() + ' TO NEXT LVL'
  }

  updateLvl(): void {
    this.lvl = LevelManager.Instance.GetLevelDisplayValue()
  }

  updateCoins(): void {
    this.coins = InventoryManager.Instance.GetItemCountByID(
      ItemNameResource.coins
    )
  }

  updateFuel(): void {
    this.fuel = InventoryManager.Instance.GetItemCountByID(
      ItemNameResource.fuel
    )
  }

  updateCompPoints(): void {
    this.compPoints = PlayerScoreManager.Instance.GetEntryByID(
      PLAYER_SCORE_NAMES.COMP_POINTS
    ).Value
  }
}
