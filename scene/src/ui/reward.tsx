import { movePlayerTo, openExternalUrl } from '~system/RestrictedActions'
import type * as serverStateSpec from '../vw-decentrally/modules/connection/state/server-state-spec'

// import * as utils from '@dcl-sdk/utils'
// import { instance } from '../utils/currentInstance'
// import { cleanUpScene } from '../utils/cleanupScene'
// import { dailyMission } from "../utils/dailyMissions"
// import { missions } from "../utils/missions"
// import { type LevelModeType } from "../utils/sprintTimer"
import { Color4, Vector3 } from '@dcl/sdk/math'
import { type UIController } from '../controllers/ui.controller'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { getUvs } from './utils/utils'
import { boardsSprites } from './atlas/boardsAtlas'
import { buttonsSprites } from './atlas/buttonsSprites'
import { dailyMission } from '../utils/dailyMissions'
import { missions } from '../utils/missions'
import { type LevelModeType } from '../utils/sprintTimer'
import { itemsSprites } from './atlas/itemsSprites'

export class Reward {
  public timeText: string = '00:00.00'
  public coinsText: string = ''
  public cargoText: string = ''
  public isVisible: boolean = true
  public expText: string = '+50'
  public time: string = '00:00.00'
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
  async updateTime(
    time: number,
    _mode: LevelModeType,
    _powerUps: serverStateSpec.PowerUpSelection
  ): Promise<void> {
    //   if (DEBUGGING_SPRINT_SOLO_REWARDS) log("Race Rewards - Solo Sprint: race finished, processing rewards...")

    // entry processing
    //  leash time decimals
    const fixedTime = time.toFixed(2)
    //  convert time to formatted string (for tween and ui update)
    this.time = this.uiController.gameController.sprintTimer.format(fixedTime)
    this.timeText = this.time
    //
    // const total = 125 + Player.sprintCoinsCollected

    // check for tournament mode
    //   const tournamentMode = mode?.type === "tournament"
    // calculate race exp
    //   const xpPowerUp = PowerUpsInv.powerUpMgr.getXpMultiplier()
    //   const numRacersXp = 1
    // let coinMultiplier = powerUps.getCoinMultiplier()

    //   if (DEBUGGING_SPRINT_SOLO_REWARDS) log("Race Rewards - Solo Sprint: parsing speed rewards for tournament=" + tournamentMode + " time=" + fixedTime + "mode=" + mode)

    // TODO: this can be hugely reduced
    // normal mode
    if (time >= 180.03) {
      this.expText = '+50'
      this.coinsText = '50'
      this.cargoText = '0'
      //   Player.getValueAdjuster().exp += 50
      //   Player.getValueAdjuster().coins += 50
      // Player.getValueAdjuster().compPoints += 300
      // this.compPointsText = "300"
    } else if (time >= 180.02 && time <= 180.02) {
      //   Player.getValueAdjuster().smCargo += 1
      //   const bonusCoins = vehicleOwnership.getCoinBonus(125 + Player.getValueAdjuster().sprintCoinsCollected)
      //   const bonusExp = computeXP(150, xpPowerUp, numRacersXp)
      //   Player.getValueAdjuster().coins += bonusCoins
      //   Player.getValueAdjuster().exp += bonusExp
      // Player.getValueAdjuster().compPoints += 300
      // this.compPointsText = "300"
      //   this.expText = `+${bonusExp.toString()}`
      //   this.coinsText = bonusCoins.toString()
      this.cargoText = '1'
    } else if (time >= 135.02 && time <= 180.01) {
      //   Player.getValueAdjuster().mdCargo += 1
      //   const bonusCoins = vehicleOwnership.getCoinBonus(150 + Player.getValueAdjuster().sprintCoinsCollected)
      //   const bonusExp = computeXP(200, xpPowerUp, numRacersXp)
      //   Player.getValueAdjuster().coins += bonusCoins
      //   Player.getValueAdjuster().exp += bonusExp
      // Player.getValueAdjuster().compPoints += 400
      // this.compPointsText = "400"
      //   this.expText = `+${bonusExp.toString()}`
      //   this.coinsText = bonusCoins.toString()
      this.cargoText = '1'
      missions.checkAndUnlockCampaignMission('completeSprintFastTime')
    } else if (time <= 135.01) {
      //   Player.getValueAdjuster().lgCargo += 1
      // Player.getValueAdjuster().compPoints += 500
      //   const bonusCoins = vehicleOwnership.getCoinBonus(200 + Player.getValueAdjuster().sprintCoinsCollected)
      //   const bonusExp = computeXP(300, xpPowerUp, numRacersXp)
      //   Player.getValueAdjuster().coins += bonusCoins
      //   Player.getValueAdjuster().exp += bonusExp
      // this.compPointsText = "500"
      //   this.expText = `+${bonusExp.toString()}`
      //   this.coinsText = bonusCoins.toString()
      this.cargoText = '1'
      missions.checkAndUnlockCampaignMission('completeSprintFastTime')
    }

    // if add at the end
    /* const addAtTheEnd = false
          if(coinMultiplier > 1 && addAtTheEnd){
            //adds a multiplier -1 since we already added the values 1x
            Player.getValueAdjuster().coins += Player.getValueAdjuster().sprintCoinsCollected * (coinMultiplier-1)
          } */

    //   if (DEBUGGING_SPRINT_SOLO_REWARDS) log("Race Rewards - Solo Sprint: oldScore=" + Player.soloSprintTime + ", newScore=" + fixedTime)
    // Update player time if time < last quest time or they dont have a record
    //   Player.soloSprintTime = time

    // Daily Missions
    if (time <= 105) await dailyMission.checkMission('sprintCompleteFast')
    //   if (Player.sprintCoinsCollected >= 50) dailyMission.checkMission("sprintCollectFiftyCoins")
    await dailyMission.checkMission('sprintCompleteThree')

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
        this.time
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
                    position:{top:'24.5%', left:'52%'}
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
                    position:{bottom:'24%'}
                  }}
                  value={this.expText}
                  fontSize={fontSizeXP}
                  font="sans-serif"
                  color={Color4.White()}
                    textAlign="middle-center"
                />
                <UiEntity
            uiTransform={{
              positionType: 'absolute',
              position: { top: '30%', left: '20%' },
              width:
                ((canvasInfo.height * 0.5 * 0.1) /
                  itemsSprites.coinSprite.h) *
                buttonsSprites.coinSprite.w,
              height: canvasInfo.height * 0.5 * 0.3
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
                    position:{bottom:'24%'}
                  }}
                  value={this.cargoText}
                  fontSize={fontSizeDrop}
                  font="sans-serif"
                  color={Color4.Green()}
                    textAlign="bottom-right"
                />
                    </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }
}
