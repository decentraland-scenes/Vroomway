import {movePlayerTo, openExternalUrl} from "~system/RestrictedActions"
import * as utils from '@dcl-sdk/utils'
import { instance } from "../utils/currentInstance"
import { dailyMission } from "../utils/dailyMissions"
import { missions } from "../utils/missions"
import { LevelModeType } from "../utils/sprintTimer"
import { Vector3 } from "@dcl/sdk/math"

class Reward {
    timeText: string = ''
    coinsText: string = ''
    cargoText: string = ''
    isVisible: boolean = false
    expText: string = ''
    time: string = ''
    constructor(time:string) {
        this.time = time
    }

        show():void {
            this.isVisible = true
            // Subscribe to keys
            // if (!Input.instance) attachKeyBindings(this.eButtonAction, this.fButtonAction)
        }
    
        claim():void {
            this.isVisible = false
            // Unsubscribe from buttons
            removeKeyBindings(this.eButtonAction, this.fButtonAction)
            Player.getValueAdjuster().sprintCoinsCollected = 0
            Player.getValueAdjuster().sprintCoinsQtyCollected = 0
            PowerUpsInv.powerUpMgr.reset()
    
            instance.setInstance("main")
            cleanupScene()
            SCENE_MANAGER.disableScene("base_main")
            
            utils.timers.setTimeout(() => {
                renderMainInstance()
                loader.showLoader()
                void movePlayerTo({newRelativePosition: Vector3.create(32.06, 1.0, 46.99), cameraTarget: Vector3.create(31.68, 1.15, 43.41)})
              }, 5000)
         
        }
    
        // time argument is seconds
        async updateTime(time: number, mode: LevelModeType, powerUps: serverStateSpec.PowerUpSelection) {
            if (DEBUGGING_SPRINT_SOLO_REWARDS) log("Race Rewards - Solo Sprint: race finished, processing rewards...")
    
            //entry processing
            //  leash time decimals
            const fixedTime = time.toFixed(2)
            //  convert time to formatted string (for tween and ui update)
            this.time = sprintTimer.format(fixedTime)
            this.timeText.value = this.time
            //
            //const total = 125 + Player.sprintCoinsCollected
    
            //check for tournament mode
            const tournamentMode = mode?.type === "tournament"
            //calculate race exp
            const xpPowerUp = PowerUpsInv.powerUpMgr.getXpMultiplier()
            const numRacersXp = 1
            //let coinMultiplier = powerUps.getCoinMultiplier()
    
            if (DEBUGGING_SPRINT_SOLO_REWARDS) log("Race Rewards - Solo Sprint: parsing speed rewards for tournament=" + tournamentMode + " time=" + fixedTime + "mode=" + mode)
    
            //TODO: this can be hugely reduced
            //normal mode
            if (time >= 180.03) {
                this.expText.value = "+50"
                this.coinsText.value = "50"
                this.cargoText.value = "0"
                Player.getValueAdjuster().exp += 50
                Player.getValueAdjuster().coins += 50
                //Player.getValueAdjuster().compPoints += 300
                //this.compPointsText.value = "300"
            } else if (time >= 180.02 && time <= 180.02) {
                Player.getValueAdjuster().smCargo += 1
                const bonusCoins = vehicleOwnership.getCoinBonus(125 + Player.getValueAdjuster().sprintCoinsCollected)
                const bonusExp = computeXP(150, xpPowerUp, numRacersXp)
                Player.getValueAdjuster().coins += bonusCoins
                Player.getValueAdjuster().exp += bonusExp
                //Player.getValueAdjuster().compPoints += 300
                //this.compPointsText.value = "300"
                this.expText.value = `+${bonusExp.toString()}`
                this.coinsText.value = bonusCoins.toString()
                this.cargoText.value = "1"
            } else if (time >= 135.02 && time <= 180.01) {
                Player.getValueAdjuster().mdCargo += 1
                const bonusCoins = vehicleOwnership.getCoinBonus(150 + Player.getValueAdjuster().sprintCoinsCollected)
                const bonusExp = computeXP(200, xpPowerUp, numRacersXp)
                Player.getValueAdjuster().coins += bonusCoins
                Player.getValueAdjuster().exp += bonusExp
                //Player.getValueAdjuster().compPoints += 400
                //this.compPointsText.value = "400"
                this.expText.value = `+${bonusExp.toString()}`
                this.coinsText.value = bonusCoins.toString()
                this.cargoText.value = "1"
                missions.checkAndUnlockCampaignMission("completeSprintFastTime")
            } else if (time <= 135.01) {
                Player.getValueAdjuster().lgCargo += 1
                //Player.getValueAdjuster().compPoints += 500
                const bonusCoins = vehicleOwnership.getCoinBonus(200 + Player.getValueAdjuster().sprintCoinsCollected)
                const bonusExp = computeXP(300, xpPowerUp, numRacersXp)
                Player.getValueAdjuster().coins += bonusCoins
                Player.getValueAdjuster().exp += bonusExp
                //this.compPointsText.value = "500"
                this.expText.value = `+${bonusExp.toString()}`
                this.coinsText.value = bonusCoins.toString()
                this.cargoText.value = "1"
                missions.checkAndUnlockCampaignMission("completeSprintFastTime")
            }
    
            //if add at the end
            /*const addAtTheEnd = false
            if(coinMultiplier > 1 && addAtTheEnd){
              //adds a multiplier -1 since we already added the values 1x
              Player.getValueAdjuster().coins += Player.getValueAdjuster().sprintCoinsCollected * (coinMultiplier-1)
            }*/
    
            if (DEBUGGING_SPRINT_SOLO_REWARDS) log("Race Rewards - Solo Sprint: oldScore=" + Player.soloSprintTime + ", newScore=" + fixedTime)
            // Update player time if time < last quest time or they dont have a record
            Player.soloSprintTime = time
    
            // Daily Missions
            if (time <= 105) dailyMission.checkMission("sprintCompleteFast")
            if (Player.sprintCoinsCollected >= 50) dailyMission.checkMission("sprintCollectFiftyCoins")
            dailyMission.checkMission("sprintCompleteThree")
    
            //PowerUpsInv.updateUsedPowerUps() //TODO should we wait till write to server then call this?
            PowerUpsInv.updateEndOfRace()
    
            // Write Data to Server here
            missions.checkAndUnlockCampaignMission("completeThreeSprints")
            Player.writeDataToServer()
            Player.updateUI()
    }
    
        getTweetText(text: string): string {
            return text.split(" ").join("%20");
    };
    
    tweet(): void {
            const url: string = `https://twitter.com/intent/tweet?text=${this.getTweetText(
                    `${encodeURIComponent("🏎")} I crushed the SoloSprint in ${this.time
                    } seconds at @Vroomwayio!%0A%0ACome beat my record: https://play.decentraland.org/?position=-103%2C-144 %0A%0A`
                )}&hashtags=Decentraland,DCL,P2E,Vroomway`
            void openExternalUrl({url})
        }
    }
    
export const reward = new Reward()
    
