import { type GameController } from '../../controllers/game.controller'
import * as utils from '@dcl-sdk/utils'
import { RECHARGE_REFUEL_AMOUNT } from '../../utils/constants'
import { dailyMission } from '../../utils/dailyMissions'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity, Label } from '@dcl/sdk/react-ecs'
import { superchargeIcon } from '../../ui/buttons'
import { getUvs } from '../../ui/utils/utils'

export class SuperChargeTimer {
  gameController: GameController
  time: string = '00:00'
  isVisible: boolean = false
  constructor(gameController: GameController) {
    this.gameController = gameController
  }

  initDanceTimer(): void {
    console.log('dance timer')
    let defaultValue = 15 * 60
    utils.timers.setInterval(() => {
      if (this.gameController.Player.getFuel() >= 100) {
        this.hide()
        return
      }
      const remainingTimeInSeconds = defaultValue - 1
      defaultValue = remainingTimeInSeconds
      if (remainingTimeInSeconds < 1) {
        this.gameController.Player.getValueAdjuster().fuel +=
          RECHARGE_REFUEL_AMOUNT
        void dailyMission.checkMission('rechargeCompleteTwoSupercharge')
        void this.gameController.Player.writeDataToServer()
        this.gameController.Player.updateUI()
        this.removeDanceTimer()
        return
      }
      this.setDanceTimer(remainingTimeInSeconds)
    }, 1000)
  }

  hide(): void {
    this.isVisible = false
  }

  show(): void {
    this.isVisible = true
  }

  removeDanceTimer(): void {
    this.hide()
  }

  setDanceTimer(seconds: number): void {
    this.time = this.format(seconds)
  }

  format = (secs: number): string => {
    const hours = Math.floor(secs / 3600)
    const minutes = Math.floor(secs / 60) % 60
    const seconds = Math.floor(secs % 60)

    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? '0' + v : v.toString()))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':')
  }

  mainUI(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          width: canvasInfo.width,
          height: canvasInfo.height * 0.1,
          justifyContent: 'flex-end',
          positionType: 'absolute',
          position: { bottom: '5%', right: '50%' },
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
            uvs: getUvs(superchargeIcon),
            texture: { src: superchargeIcon.atlasSrc }
          }}
          onMouseDown={() => {}}
        >
          {/* Timer */}
          <Label
            uiTransform={{
              positionType: 'absolute',
              position: { right: '48%', top: '33%' }
            }}
            value={this.time}
            fontSize={16}
            font="sans-serif"
            color={Color4.Yellow()}
          />
        </UiEntity>
      </UiEntity>
    )
  }
}
