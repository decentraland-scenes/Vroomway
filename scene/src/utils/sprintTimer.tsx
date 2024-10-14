import { Label, ReactEcs, UiEntity } from '@dcl/sdk/react-ecs'
import { type GameController } from '../controllers/game.controller'
import { Color4 } from '@dcl/sdk/math'
import { engine } from '@dcl/sdk/ecs'

export type LevelModeType = {
  type: 'normal' | 'tournament'
  // more stuff like branch, level, difficulty...?
}
export type SceneArgs = {
  mode?: LevelModeType
  // powerUps?: serverStateSpec.PowerUpSelection;
}

export class SprintTimer {
  gameController: GameController
  sprintOff: boolean
  sprintComplete: boolean
  gameMode?: LevelModeType
  isVisible: boolean = true
  timerText: string = ''
  options: SceneArgs = { mode: { type: 'normal' } }
  // -------- LoopSystem

  _sprintTimer: number = 0
  _timerIteration: number = 0

  constructor(gameController: GameController) {
    this.gameController = gameController
    this.sprintOff = true
    this.sprintComplete = false
    engine.addSystem(this.updateTimer)
  }

  format = (secs: number): string => {
    const minutes = Math.floor(secs / 60) % 60
    const seconds = (secs % 60).toFixed(2)

    return [minutes.toString(), seconds] // Convertir ambos a string
      .map((v) => (parseFloat(v) < 10 ? '0' + v : v)) // Ahora ambos son strings
      .filter((v, i) => v !== '00' || i > 0)
      .join(':')
  }

  resetTimer(): void {
    console.log("TIMER IS RESETED")
    this.timerText = ''
    this.sprintOff = true
    this.sprintComplete = false
    this._sprintTimer = 0
  }

  startTimer(options: SceneArgs = this.options): void {
    // workaround trying to fix bug saying race finished immeidatly
    this.resetTimer()

    this.sprintOff = false
    console.log(options, 'Options')
    if (options !== undefined) {
      this.gameMode = options.mode
      // this.powerUps = options.powerUps
    } else {
      this.gameMode = undefined
      // this.powerUps = undefined
    }
  }

  mainUI(): ReactEcs.JSX.Element | null {
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          positionType: 'absolute',
          position: { left: '12%', top: '0%' },
          display: this.isVisible ? 'flex' : 'none'
        }}
      >
        <UiEntity
          uiTransform={{
            width: '217',
            height: '105'
          }}
        />
        <Label
          uiTransform={{
            positionType: 'absolute',
            position: { top: '38%', left: '45%' }
          }}
          value={this.timerText}
          color={Color4.Yellow()}
          fontSize={37}
        />
      </UiEntity>
    )
  }

  getTime(): number {
    return this._sprintTimer
  }

  updateTimer = (dt: number): void => {
    // Don't run if not sprinting
    if (this.sprintOff) return //  (this._sprintTimer = 0)
    // Handle sprint completion
    if (this.sprintComplete) {
      // Update reward popup with time and remove timer
      this.timerText = this.format(this._sprintTimer)
      // reward.updateTime(
      //   this._sprintTimer,
      //   sprintTimer.gameMode,
      //   sprintTimer.powerUps
      // )
      // reward.show()
      this.resetTimer()
      return
    }

    // Handle timer updates
    this._timerIteration++
    const total = (this._sprintTimer += dt)
    this._sprintTimer = total
    if (this._timerIteration === 2) {
      this.timerText = this.format(total)
      this._timerIteration = 0
    }
  }
}
