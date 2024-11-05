import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs, type Sprite } from './utils/utils'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { type UIController } from '../controllers/ui.controller'
import { Color4 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'
import { LevelManager } from '../leveling/level-manager'
import { ItemNameResource } from '../inventory/inventory-data'
import { InventoryManager } from '../inventory/inventory-manager'
import { PLAYER_SCORE_NAMES } from '../player-scores/player-score-data'
import { PlayerScoreManager } from '../player-scores/player-score-manager'
import { buttonsSprites } from './atlas/buttonsSprites'

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
      y: 1790,
      w: 994,
      h: 244
    }
    utils.timers.setTimeout(() => {
      this.initRefuelTimer()
    }, 2000)
  }

  initialize(): ReactEcs.JSX.Element {
    this.updateExp()
    this.updateLvl()
    this.updateCoins()
    this.updateFuel()
    this.updateCompPoints()
    const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
    const profileH = canvasInfo.height * 0.1
    const fontSize = profileH * 0.15
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          width: canvasInfo.width,
          height: profileH,
          justifyContent: 'flex-end',
          positionType: 'absolute',
          position: { top: '0%', right: '0%' }
        }}
      >
        {/* Refuel Timer */}
        <UiEntity
          uiTransform={{
            positionType: 'relative',
            width: profileH,
            height: profileH,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(buttonsSprites.refuelIcon),
            texture: { src: buttonsSprites.refuelIcon.atlasSrc }
          }}
        >
          {/* Timer */}
          <Label
            uiTransform={{
              width: '100%',
              height: '25%'
            }}
            value={this.refuelTimer}
            fontSize={fontSize}
            textAlign="middle-center"
            font="sans-serif"
            color={Color4.Yellow()}
          />
        </UiEntity>
        {/* Profile Conteiner */}
        <UiEntity
          uiTransform={{
            margin: { top: profileH * 0.05, right: profileH * 0.05 },
            positionType: 'relative',
            width: (profileH * this.profile.w) / this.profile.h,
            height: profileH
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(this.profile),
            texture: { src: this.profile.atlasSrc }
          }}
        >
          {/* Level */}
          <Label
            uiTransform={{
              width: '15%',
              height: '20%',
              positionType: 'absolute',
              position: { right: '20%', top: '12%' }
            }}
            value={this.lvl.toString()}
            fontSize={fontSize}
            textAlign="middle-left"
            font="sans-serif"
            color={Color4.Yellow()}
          />
          {/* Exp */}
          <Label
            uiTransform={{
              width: '30%',
              height: '20%',
              positionType: 'absolute',
              position: { right: '19%', top: '32%' }
            }}
            value={this.exp}
            fontSize={fontSize * 0.6}
            font="sans-serif"
            color={Color4.Yellow()}
            textAlign="middle-center"
          />
          {/* Fuel */}
          <Label
            uiTransform={{
              width: '15%',
              height: '20%',
              positionType: 'absolute',
              position: { left: '12%', top: '20%' }
            }}
            fontSize={fontSize * 1.5}
            textAlign="middle-left"
            font="sans-serif"
            color={Color4.Yellow()}
            value={this.fuel.toString()}
          />
          {/* Comp points */}
          <Label
            uiTransform={{
              width: '15%',
              height: '20%',
              positionType: 'absolute',
              position: { left: '42%', top: '65%' }
            }}
            fontSize={fontSize * 1.2}
            textAlign="middle-left"
            font="sans-serif"
            color={Color4.Yellow()}
            value={this.compPoints.toString()}
          />
          {/* Coins */}
          <Label
            uiTransform={{
              width: '15%',
              height: '20%',
              positionType: 'absolute',
              position: { left: '12%', top: '65%' }
            }}
            fontSize={fontSize * 1.2}
            textAlign="middle-left"
            font="sans-serif"
            color={Color4.Yellow()}
            value={this.coins.toString()}
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
    console.log(
      this.lvl + '  level',
      this.coins + '  coins',
      this.fuel + '  fuel'
    )
  }

  updateFuel(): void {
    this.fuel = InventoryManager.Instance.GetItemCountByID(
      ItemNameResource.fuel
    )
    console.log(
      this.lvl + '  level',
      this.coins + '  coins',
      this.fuel + '  fuel'
    )
  }

  updateCompPoints(): void {
    this.compPoints = PlayerScoreManager.Instance.GetEntryByID(
      PLAYER_SCORE_NAMES.COMP_POINTS
    ).Value
  }
}
