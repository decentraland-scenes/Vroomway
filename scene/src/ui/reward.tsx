import { movePlayerTo, openExternalUrl } from '~system/RestrictedActions'
import type * as serverStateSpec from '../vw-decentrally/modules/connection/state/server-state-spec'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { type UIController } from '../controllers/ui.controller'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { getUvs, type Sprite } from './utils/utils'
import { boardsSprites } from './atlas/boardsAtlas'
import { buttonsSprites } from './atlas/buttonsSprites'
import { dailyMission } from '../utils/dailyMissions'
import { missions } from '../utils/missions'
import { itemsSprites } from './atlas/itemsSprites'

export class Reward {
  public coins: number = 0
  public smCargo: number = 0
  public mdCargo: number = 0
  public lgCargo: number = 0
  public cargoQuantity: number = 0
  public cargoSpriteSize: Sprite = itemsSprites.smCargoSprite
  public exp: number = 0
  public isVisible: boolean = false
  public timeText: string = '00:00.00'
  uiController: UIController
  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  show(): void {
    this.isVisible = true
    // Subscribe to keys
    // if (!Input.instance) attachKeyBindings(this.eButtonAction, this.fButtonAction)
  }

  hide(): void {
    this.isVisible = false
  }

  claim(): void {
    this.hide()
    // Give loot to player:
    const player = this.uiController.gameController.Player

    player.getValueAdjuster().coins += this.coins
    player.getValueAdjuster().exp += this.exp
    player.getValueAdjuster().smCargo += this.smCargo
    player.getValueAdjuster().mdCargo += this.mdCargo
    player.getValueAdjuster().lgCargo += this.lgCargo

    // Unsubscribe from buttons
    // removeKeyBindings(this.eButtonAction, this.fButtonAction)
    // Player.getValueAdjuster().sprintCoinsCollected = 0
    // Player.getValueAdjuster().sprintCoinsQtyCollected = 0
    // PowerUpsInv.powerUpMgr.reset()

    // instance.setInstance('main')
    // cleanUpScene()
    // // SCENE_MANAGER.disableScene("base_main")

    this.uiController.loader.showLoader()
    // renderMainInstance()
    void movePlayerTo({
      newRelativePosition: Vector3.create(32.06, 1.0, 46.99),
      cameraTarget: Vector3.create(31.68, 1.15, 43.41)
    })
  }

  //   time argument is seconds
  updateTime(time: number, powerUps?: serverStateSpec.PowerUpSelection): void {
    const player = this.uiController.gameController.Player
    const vehicleOwnership = this.uiController.gameController.vehicleOwnership

    // entry processing
    //  leash time decimals
    //  convert time to formatted string (for tween and ui update)
    this.timeText = this.uiController.gameController.sprintTimer.format(time)
    //

    // calculate race exp
    // const xpPowerUp = PowerUpsInv.powerUpMgr.getXpMultiplier()
    const xpPowerUp = 2
    const numRacersXp = 1
    // let coinMultiplier = powerUps.getCoinMultiplier()

    // TODO: this can be hugely reduced
    // normal mode
    // Clear reward:
    this.coins = 0
    this.exp = 0
    this.smCargo = 0
    this.mdCargo = 0
    this.lgCargo = 0
    this.cargoQuantity = 0

    if (time >= 180.03) {
      this.exp = 50
      this.coins = 50
      this.cargoQuantity = 0
    } else if (time >= 180.02 && time <= 180.02) {
      const bonusCoins = vehicleOwnership.getCoinBonus(
        125 + player.getValueAdjuster().sprintCoinsCollected
      )
      const bonusExp = vehicleOwnership.computeXP(150, xpPowerUp, numRacersXp)
      this.exp = bonusExp
      this.coins = bonusCoins
      this.smCargo = 1
      this.cargoQuantity = this.smCargo
      this.cargoSpriteSize = itemsSprites.smCargoSprite
    } else if (time >= 135.02 && time <= 180.01) {
      const bonusCoins = vehicleOwnership.getCoinBonus(
        150 + player.getValueAdjuster().sprintCoinsCollected
      )
      const bonusExp = vehicleOwnership.computeXP(200, xpPowerUp, numRacersXp)
      this.exp = bonusExp
      this.coins = bonusCoins
      this.mdCargo = 1
      this.cargoQuantity = this.mdCargo
      this.cargoSpriteSize = itemsSprites.mdCargoSprite
      missions.checkAndUnlockCampaignMission('completeSprintFastTime')
    } else if (time <= 135.01) {
      const bonusCoins = vehicleOwnership.getCoinBonus(
        200 + player.getValueAdjuster().sprintCoinsCollected
      )
      const bonusExp = vehicleOwnership.computeXP(300, xpPowerUp, numRacersXp)
      this.exp = bonusExp
      this.coins = bonusCoins
      this.lgCargo = 1
      this.cargoQuantity = this.lgCargo
      this.cargoSpriteSize = itemsSprites.lgCargoSprite
      missions.checkAndUnlockCampaignMission('completeSprintFastTime')

      console.log('time = ' + time)
    }

    // Daily Missions
    if (time <= 105) void dailyMission.checkMission('sprintCompleteFast')
    if (this.uiController.gameController.Player.sprintCoinsCollected >= 50)
      void dailyMission.checkMission('sprintCollectFiftyCoins')
    void dailyMission.checkMission('sprintCompleteThree')

    // PowerUpsInv.updateUsedPowerUps() //TODO should we wait till write to server then call this?
    //   PowerUpsInv.updateEndOfRace()

    // Write Data to Server here
    missions.checkAndUnlockCampaignMission('completeThreeSprints')
    //   Player.writeDataToServer()
    //   Player.updateUI()
  }

  getTweetText(text: string): string {
    return text.split(' ').join('%20')
  }

  tweet(): void {
    const url: string = `https://twitter.com/intent/tweet?text=${this.getTweetText(
      `${encodeURIComponent('🏎')} I crushed the SoloSprint in ${
        this.timeText
      } seconds at @Vroomwayio!%0A%0ACome beat my record: https://play.decentraland.org/?position=-103%2C-144 %0A%0A`
    )}&hashtags=Decentraland,DCL,P2E,Vroomway`
    void openExternalUrl({ url })
  }

  createUi(): ReactEcs.JSX.Element {
    const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
    const fontSizeTimer = canvasInfo.height * 0.035
    const fontSizeXP = canvasInfo.height * 0.02
    const fontSizeDrop = canvasInfo.height * 0.02

    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <UiEntity
          uiTransform={{
            flexDirection: 'column',
            width:
              ((canvasInfo.height * 0.5) / boardsSprites.rewardBoardSprite.h) *
              boardsSprites.rewardBoardSprite.w,
            height: canvasInfo.height * 0.5
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(boardsSprites.rewardBoardSprite),
            texture: { src: boardsSprites.rewardBoardSprite.atlasSrc }
          }}
        >
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              position: { bottom: '10%', right: '10%' },
              width:
                ((canvasInfo.height * 0.5 * 0.1) /
                  buttonsSprites.claimSprite.h) *
                buttonsSprites.claimSprite.w,
              height: canvasInfo.height * 0.5 * 0.1
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(buttonsSprites.claimSprite),
              texture: { src: buttonsSprites.claimSprite.atlasSrc }
            }}
            onMouseDown={() => {
              this.claim()
            }}
          />
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              position: { bottom: '10%', left: '10%' },
              width:
                ((canvasInfo.height * 0.5 * 0.1) /
                  buttonsSprites.tweetSprite.h) *
                buttonsSprites.tweetSprite.w,
              height: canvasInfo.height * 0.5 * 0.1
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(buttonsSprites.tweetSprite),
              texture: { src: buttonsSprites.tweetSprite.atlasSrc }
            }}
            onMouseDown={() => {
              this.tweet()
            }}
          />
          <Label
            uiTransform={{
              width: '100%',
              height: fontSizeTimer,
              positionType: 'absolute',
              position: { top: '24.5%', left: '52%' }
            }}
            value={this.timeText}
            fontSize={fontSizeTimer}
            font="sans-serif"
            color={Color4.Yellow()}
            textAlign="middle-left"
          />
          <Label
            uiTransform={{
              width: '100%',
              height: fontSizeXP,
              positionType: 'absolute',
              position: { bottom: '25.3%' }
            }}
            value={'+' + this.exp.toString()}
            fontSize={fontSizeXP}
            font="sans-serif"
            color={Color4.White()}
            textAlign="middle-center"
          />
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              position: { top: '40%', left: '25%' },
              width:
                ((canvasInfo.height * 0.5 * 0.25) / itemsSprites.coinSprite.h) *
                itemsSprites.coinSprite.w,
              height: canvasInfo.height * 0.5 * 0.25
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(itemsSprites.coinSprite),
              texture: { src: itemsSprites.coinSprite.atlasSrc }
            }}
          >
            <Label
              uiTransform={{
                width: '100%',
                height: fontSizeDrop,
                positionType: 'absolute',
                position: { bottom: '5%', left: '12%' }
              }}
              value={this.coins.toString()}
              fontSize={fontSizeDrop}
              font="sans-serif"
              color={Color4.Green()}
              textAlign="bottom-left"
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              position: { top: '40%', right: '25%' },
              width:
                ((canvasInfo.height * 0.5 * 0.25) / this.cargoSpriteSize.h) *
                this.cargoSpriteSize.w,
              height: canvasInfo.height * 0.5 * 0.25,
              display: this.cargoQuantity > 0 ? 'flex' : 'none'
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(this.cargoSpriteSize),
              texture: { src: this.cargoSpriteSize.atlasSrc }
            }}
          >
            <Label
              uiTransform={{
                width: '100%',
                height: fontSizeDrop,
                positionType: 'absolute',
                position: { bottom: '5%', left: '12%' }
              }}
              value={'1'}
              fontSize={fontSizeDrop}
              font="sans-serif"
              color={Color4.Green()}
              textAlign="bottom-left"
            />
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }
}
