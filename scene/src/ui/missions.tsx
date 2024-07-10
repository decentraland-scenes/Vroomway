import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { type UIController } from './ui.controller'
import { getUvs, type Sprite } from './utils/utils'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'
import { dailyMission, type DailyMissions } from '../utils/dailyMissions'
import {
  type CampaignMissions,
  getMissionXpAmount,
  missions
} from '../utils/missions'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DailyMissionDescriptions: Record<DailyMissions, string> = {
  sprintCompleteFast: 'Complete a Solo-Sprint with a time of 1:45 or less',
  sprintCompleteThree: 'Complete 3 Solo-Sprint races',
  sprintCollectFiftyCoins: 'Collect fifty coins during a Solo-Sprint race',
  sprintCollectBarrel: 'Collect a barrel during a Solo-Sprint race',
  circuitsFirstPlace: 'Win first place in Fuego Circuits',
  circuitsFifteenLaps: 'Complete 15 laps in Fuego Circuits',
  circuitsThreeFastLaps: 'Complete Fuego Circuits with a time of 3:45 or less',
  circuitsCollectTenCoins: 'Collect 10 coins in Fuego Circuits',
  rechargeCompleteTwoSupercharge: 'Complete 2 SuperCharges in the Recharge',
  rechargeExchangeMaterialsThreeTimes: 'Exchange materials 3 times in Recharge',
  scrapyardTwentyFiveBarrels: 'Harvest 25 green barrels',
  scrapyardTwoBlueBarrels: 'Harvest 2 blue barrels',
  scrapyardOnePurpleBarrel: 'Harvest 1 purple barrel'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MissionDescriptions: Record<string, string> = {
  yoyo: 'Visit YoYo',
  discord: 'Click on the Land T&C board behind you in the corner',
  scrapyard: 'Visit the Scrapyard through the green portal',
  rummage: 'Rummage through 1 barrel',
  collectMaterials: 'Collect more materials from barrels',
  assidMary: 'Speak to Assid Mary (learn about cargos)',
  visitSpeedBoots: 'Visit the Speed Boots crafting station',
  visitHoverBike: 'Visit the Hover Bike crafting station',
  visitHoverCar: 'Visit the Hover Car crafting station',
  scrapyardCrystal: 'Find the Green Scrapyard crystal at the top of the stacks',
  visitRecharge: 'Visit The Recharge through the purple portal',
  sellMaterialsKrystal: 'Sell materials to Krystal Koin',
  visitDanceFloor: 'Check out the dance floor',
  rechargeCrystal: 'Find the Purple Recharge crystal',
  visitRacehub: 'Find Tulio next to the Solo-Sprint hub in the Main Entrance',
  completeThreeSprints: 'Complete 3 Solo-Sprints',
  completeSprintFastTime: 'Complete a Solo-Sprint with a time of 1:59 or less',
  completePowerUps: 'Visit the Power Ups vending machine in the Main Entrance',
  visitHyperfy: 'Check out our Hyperfy world (Click on the yellow portal)',
  completeThreeCircuits: 'Complete 3 Fuego Circuit races',
  completeCircuitFastTime:
    'Complete 1 Fuego Circuit race with a time of 3:15 or less',
  completeCircuitsOneFastTime:
    'Complete 1 Fuego Circuit races with time less than 3 minutes',
  visitFuelStation: 'Check out the FUEL purchase stations',
  visitSponsors: 'Check out our sponsors on the portal frames',
  secondFloorCrystal: 'Find the Blue Race Hub crystal in the showroom',
  craftLevelThreeVehicle: 'Craft a level three vehicle',
  yoyoCrystal: 'Receive the final crystal from YoYo in the Main Entrance'
}
export class MissionsBoard {
  uiController: UIController
  board: Sprite
  dailyBoard: Sprite
  missionCompleteBoard: Sprite
  missionCompleteBoardVisible: boolean = false
  dailyBoardVisible: boolean = false
  dailyCheck1Visible: boolean = false
  dailyCheck2Visible: boolean = false
  dailyCheck3Visible: boolean = false
  isVisible: boolean = false
  board3Atlas = 'assets/images/uiAtlas/board3Atlas.png'
  dailyMission1: string = ''
  dailyMission2: string = ''
  dailyMission3: string = ''
  campaignMissionNumber: string = ''
  campaignMission: string = ''
  campaignMissionXP: string = ''
  constructor(uiController: UIController) {
    this.uiController = uiController
    this.board = {
      atlasSrc: this.board3Atlas,
      atlasSize: { x: 2048, y: 2048 },
      x: 1150,
      y: 1147,
      w: 1000,
      h: 400
    }
    this.dailyBoard = {
      atlasSrc: this.board3Atlas,
      atlasSize: { x: 2048, y: 2048 },
      x: 1150,
      y: 1570,
      w: 1000,
      h: 400
    }
    this.missionCompleteBoard = {
      atlasSrc: this.board3Atlas,
      atlasSize: { x: 2048, y: 2048 },
      x: 0,
      y: 1747,
      w: 1000,
      h: 550
    }
  }

  createMissionBoard(): ReactEcs.JSX.Element | null {
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
          display: this.isVisible ? 'flex' : 'none'
        }}
      >
        {/* Campaign Board */}
        <UiEntity
          uiTransform={{
            positionType: 'relative',
            width: (canvasInfo.height * 2.1) / 1.7,
            height: canvasInfo.height * 0.5
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(this.board),
            texture: { src: this.board.atlasSrc }
          }}
          onMouseDown={() => {}}
        >
          {/* Mission Text */}
          <Label
            uiTransform={{
              positionType: 'absolute',
              position: { left: '37%', top: '30%' }
            }}
            value={this.campaignMission}
            fontSize={20}
            font="sans-serif"
            color={Color4.Yellow()}
          />
          {/* Mission Number */}
          <Label
            uiTransform={{
              positionType: 'absolute',
              position: { left: '25%', top: '23%' }
            }}
            value={this.campaignMissionNumber}
            fontSize={20}
            font="sans-serif"
            color={Color4.Yellow()}
          />
          {/* Mission XP */}
          <Label
            uiTransform={{
              positionType: 'absolute',
              position: { right: '22%', top: '28%' }
            }}
            value={this.campaignMissionXP}
            fontSize={20}
            font="sans-serif"
            color={Color4.Yellow()}
          />
        </UiEntity>
      </UiEntity>
    )
  }

  getDailyMissionDescription(): void {
    console.log('entro al daily')
    const missions = dailyMission.randomMissions.sort()
    console.log('sorteo missiones',missions)
    missions.forEach((mission: any, i) => {
      if (i === 0) {
        const missionComplete = dailyMission.checkIfMissionComplete(mission)
        console.log('se fijo si entraron',missionComplete)
        if (missionComplete) this.dailyCheck1Visible = true
        return (this.dailyMission1 = mission)
        
      }
      if (i === 1) {
        const missionComplete = dailyMission.checkIfMissionComplete(mission)
        if (missionComplete) this.dailyCheck2Visible = true
        return (this.dailyMission2 = mission)
      }
      if (i === 2) {
        const missionComplete = dailyMission.checkIfMissionComplete(mission)
        if (missionComplete) this.dailyCheck3Visible = true
        return (this.dailyMission3 = mission)
      }
    })
  }

  getCampaignMissionDescription(): void {
    const name = missions.getCurrentMissionName()
    this.campaignMissionNumber = missions.currentMissionIndex.toString()
    this.campaignMission = MissionDescriptions[name]
    this.campaignMissionXP = getMissionXpAmount(
      name as CampaignMissions
    ).toFixed(0)
  }

  hideMissionCompleteBoard(): void {
    this.missionCompleteBoardVisible = false
  }

  showMissionCompleteBoard(): void {
    this.missionCompleteBoardVisible = true
    utils.timers.setTimeout(() => {
      this.missionCompleteBoardVisible = false
    }, 3000)
  }

  hide(): void {
    this.isVisible = false
    this.dailyBoardVisible = false
  }

  show(): void {
    this.isVisible = true
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (missions && missions.campaignMissionsComplete) {
      this.dailyBoardVisible = true
      this.isVisible = false
      this.getDailyMissionDescription()
    } else {
      this.getCampaignMissionDescription()
    }
  }
}
