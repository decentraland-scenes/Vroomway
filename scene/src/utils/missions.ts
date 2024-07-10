import { crystals } from '../crystals'

export type CampaignMissions =
  | 'yoyo'
  | 'discord'
  | 'scrapyard'
  | 'rummage'
  | 'collectMaterials'
  | 'assidMary'
  | 'visitSpeedBoots'
  | 'visitHoverBike'
  | 'visitHoverCar'
  | 'scrapyardCrystal'
  | 'visitRecharge'
  | 'sellMaterialsKrystal'
  | 'visitDanceFloor'
  | 'rechargeCrystal'
  | 'visitRacehub'
  | 'completeThreeSprints'
  | 'completeSprintFastTime'
  | 'completePowerUps'
  | 'visitHyperfy'
  | 'completeThreeCircuits'
  | 'completeCircuitFastTime'
  | 'completeCircuitsOneFastTime'
  | 'visitFuelStation'
  | 'visitSponsors'
  | 'secondFloorCrystal'
  | 'craftLevelThreeVehicle'
  | 'yoyoCrystal'

type CampaignMissionData = {
  [key in CampaignMissions]: number
} & {
  currentMission?: number
}

const MissionSteps = {
  rummage: 5,
  collectMaterials: 5,
  completeThreeSprints: 3,
  completeThreeCircuits: 3
}

const missionOrder = [
  'yoyo',
  'discord',
  'scrapyard',
  'rummage',
  'collectMaterials',
  'assidMary',
  'visitSpeedBoots',
  'visitHoverBike',
  'visitHoverCar',
  'scrapyardCrystal',
  'visitRecharge',
  'sellMaterialsKrystal',
  'visitDanceFloor',
  'rechargeCrystal',
  'visitRacehub',
  'completeThreeSprints',
  'completeSprintFastTime',
  'completePowerUps',
  'visitHyperfy',
  'completeThreeCircuits',
  'completeCircuitFastTime',
  'completeCircuitsOneFastTime',
  'visitFuelStation',
  'visitSponsors',
  'secondFloorCrystal',
  'craftLevelThreeVehicle',
  'yoyoCrystal'
]
export function getMissionXpAmount(missionToUpdate: CampaignMissions): number {
  switch (missionToUpdate) {
    case 'yoyo':
      return 250
    case 'discord':
      return 250
    case 'scrapyard':
      return 100
    case 'rummage':
      return 250
    case 'collectMaterials':
      return 250
    case 'assidMary':
      return 250
    case 'visitSpeedBoots':
      return 100
    case 'visitHoverBike':
      return 100
    case 'visitHoverCar':
      return 100
    case 'scrapyardCrystal':
      return 300
    case 'visitRecharge':
      return 250
    case 'sellMaterialsKrystal':
      return 300
    case 'visitDanceFloor':
      return 250
    case 'rechargeCrystal':
      return 600
    case 'visitRacehub':
      return 200
    case 'completeSprintFastTime':
      return 400
    case 'completePowerUps':
      return 400
    case 'visitHyperfy':
      return 200
    case 'completeCircuitFastTime':
      return 400
    case 'completeCircuitsOneFastTime':
      return 500
    case 'visitFuelStation':
      return 250
    case 'visitSponsors':
      return 250
    case 'secondFloorCrystal':
      return 750
    case 'yoyoCrystal':
      return 1000
    case 'craftLevelThreeVehicle':
      return 500
    default:
      return 0
  }
}

class Missions {
  public campaignMissionsData = {
    yoyo: 0,
    discord: 0,
    scrapyard: 0,
    rummage: 0,
    collectMaterials: 0,
    assidMary: 0,
    visitSpeedBoots: 0,
    visitHoverBike: 0,
    visitHoverCar: 0,
    scrapyardCrystal: 0,
    visitRecharge: 0,
    sellMaterialsKrystal: 0,
    visitDanceFloor: 0,
    rechargeCrystal: 0,
    visitRacehub: 0,
    completeThreeSprints: 0,
    completeSprintFastTime: 0,
    completePowerUps: 0,
    visitHyperfy: 0,
    completeThreeCircuits: 0,
    completeCircuitFastTime: 0,
    completeCircuitsOneFastTime: 0,
    visitFuelStation: 0,
    visitSponsors: 0,
    secondFloorCrystal: 0,
    craftLevelThreeVehicle: 0,
    yoyoCrystal: 0
  }

  public currentMissionIndex = 0
  public campaignMissionsComplete = false
  campaignMission: string = ''
  constructor() {
    // Check if every value in the campaignMissionsData is 0
    if (Object.values(this.campaignMissionsData).every((key) => key === 0))
      void this.fetchMissionData()
  }

  getCurrentMissionName(): string {
    return missionOrder[this.currentMissionIndex]
  }

  async fetchMissionData(): Promise<void> {
    // const { userId } = await getUserData()
    // try {
    //   const res = await fetch(`${LAMBDA_URL}/missions?uuid=${userId}`)
    //   const data = (await res?.json()) || null
    //   this.initCampaignMissionData(data);
    // } catch (e) {
    //   console.log('missions fetching error', e)
    //   // return ui.displayAnnouncement(
    //   //   'Error fetching missions data. Please reload the page.',
    //   //   6000
    //   // )
    // }
  }

  initCampaignMissionData(data: CampaignMissionData): void {
    // Get current mission index
    const currentMissionIndex = data.currentMission ?? 0
    this.currentMissionIndex = currentMissionIndex
    // Remove from data object
    delete data.currentMission
    this.campaignMissionsData = { ...this.campaignMissionsData, ...data }
    // Update completions data
    if (this.campaignMissionsData.yoyoCrystal > 0)
      this.campaignMissionsComplete = true
    crystals.updateCrystals()
  }

  multiMissionRequirementsMet = (mission: string): boolean => {
    const {
      rummage,
      collectMaterials,
      completeThreeSprints,
      completeThreeCircuits
    } = this.campaignMissionsData
    if (
      (mission === 'rummage' && rummage >= MissionSteps.rummage) ||
      (mission === 'collectMaterials' &&
        collectMaterials >= MissionSteps.collectMaterials) ||
      (mission === 'completeThreeSprints' &&
        completeThreeSprints >= MissionSteps.completeThreeSprints) ||
      (mission === 'completeThreeCircuits' &&
        completeThreeCircuits >= MissionSteps.completeThreeCircuits)
    ) {
      return true
    }
    return false
  }

  checkAndUnlockCampaignMission(missionToUpdate: CampaignMissions): void {
    const multiAttemptMissions: CampaignMissions[] = [
      'rummage',
      'collectMaterials',
      'completeThreeSprints',
      'completeThreeCircuits'
    ]

    // Check if prior missions have been completed
    const missionIndex = missionOrder.indexOf(missionToUpdate)
    const priorMissions = missionOrder.slice(0, missionIndex)
    console.log(priorMissions, 'PRIOs')
    let priorMissionsIncomplete = false
    priorMissions.forEach((mission) => {
      // Single missions
      if (this.campaignMissionsData[mission as CampaignMissions] === 0)
        priorMissionsIncomplete = true
      // Only update mission (no award) if it's a multi-attempt mission and they're under reward amount
      if (multiAttemptMissions.includes(mission as CampaignMissions)) {
        if (!this.multiMissionRequirementsMet(mission as CampaignMissions))
          priorMissionsIncomplete = true
      }
    })

    // UNCOMMENT
    if (priorMissionsIncomplete) return

    // If theyve already met requirements for a mission end here
    if (
      this.multiMissionRequirementsMet(missionToUpdate) ||
      (this.campaignMissionsData[missionToUpdate] > 0 &&
        !multiAttemptMissions.includes(missionToUpdate))
    )
      return
    // If they're under the reward amount for a multi mission, increment
    if (
      multiAttemptMissions.includes(missionToUpdate) &&
      !this.multiMissionRequirementsMet(missionToUpdate)
    ) {
      this.handleMultiAttemptMission(missionToUpdate)
    }
    // If they've met requirements for single or multi mission, give award
    else this.awardUserForMission(missionToUpdate)
  }

  handleMultiAttemptMission = (mission: CampaignMissions): void => {
    const {
      rummage,
      collectMaterials,
      completeThreeSprints,
      completeThreeCircuits
    } = this.campaignMissionsData
    if (
      (mission === 'rummage' && rummage === MissionSteps.rummage - 1) ||
      (mission === 'collectMaterials' &&
        collectMaterials === MissionSteps.collectMaterials - 1) ||
      (mission === 'completeThreeCircuits' &&
        completeThreeCircuits === MissionSteps.completeThreeCircuits - 1) ||
      (mission === 'completeThreeSprints' &&
        completeThreeSprints === MissionSteps.completeThreeSprints - 1)
    ) {
      // Move on to the next mission
      this.currentMissionIndex += 1
      this.awardUserForMission(mission)
      return
    }
    // Update server
    void this.writeMissionsData(mission)
  }

  awardUserForMission(missionToUpdate: CampaignMissions): void {
    // const {
    //   rummage,
    //   collectMaterials,
    //   completeThreeSprints,
    //   completeThreeCircuits
    // } = this.campaignMissionsData
    // Update current mission indexs
    this.currentMissionIndex =
      Object.keys(this.campaignMissionsData).indexOf(missionToUpdate) + 1
    // Show mission complete board
    // missionBoard.showMissionCompleteBoard()
    // // Update crystal placement
    // crystals.updateCrystals()

    // // Multi action missions -- equality check is 1 below total b/c we'll be adding one to total serverside
    // if (missionToUpdate === 'rummage' && rummage === MissionSteps.rummage - 1)
    //   Player.getValueAdjuster().exp += 150
    // if (
    //   missionToUpdate === 'collectMaterials' &&
    //   collectMaterials === MissionSteps.collectMaterials - 1
    // )
    //   Player.getValueAdjuster().exp += 150
    // if (
    //   missionToUpdate === 'completeThreeSprints' &&
    //   completeThreeSprints === MissionSteps.completeThreeSprints - 1
    // )
    //   Player.getValueAdjuster().exp += 150

    // if (
    //   missionToUpdate === 'completeThreeCircuits' &&
    //   completeThreeCircuits === MissionSteps.completeThreeCircuits - 1
    // )
    //   Player.getValueAdjuster().exp += 150

    // Single action
    // switch (missionToUpdate) {
    //   case 'yoyo':
    //     Player.getValueAdjuster().exp += 250
    //     break
    //   case 'discord':
    //     Player.getValueAdjuster().exp += 250
    //     break
    //   case 'scrapyard':
    //     Player.getValueAdjuster().exp += 100
    //     break
    //   case 'rummage':
    //     Player.getValueAdjuster().exp += 250
    //     break
    //   case 'collectMaterials':
    //     Player.getValueAdjuster().exp += 250
    //     break
    //   case 'assidMary':
    //     Player.getValueAdjuster().exp += 250
    //     break
    //   case 'visitSpeedBoots':
    //     Player.getValueAdjuster().exp += 100
    //     break
    //   case 'visitHoverBike':
    //     Player.getValueAdjuster().exp += 100
    //     break
    //   case 'visitHoverCar':
    //     Player.getValueAdjuster().exp += 100
    //     break
    //   case 'scrapyardCrystal':
    //     Player.getValueAdjuster().exp += 300
    //     Player.getValueAdjuster().coins += 500
    //     Player.getValueAdjuster().lgCargo += 1
    //     break
    //   case 'visitRecharge':
    //     Player.getValueAdjuster().exp += 250
    //     break
    //   case 'sellMaterialsKrystal':
    //     Player.getValueAdjuster().exp += 300
    //     break
    //   case 'visitDanceFloor':
    //     Player.getValueAdjuster().exp += 250
    //     break
    //   case 'rechargeCrystal':
    //     Player.getValueAdjuster().exp += 600
    //     Player.getValueAdjuster().coins += 750
    //     Player.getValueAdjuster().lgCargo += 1
    //     break
    //   case 'visitRacehub':
    //     Player.getValueAdjuster().exp += 200
    //     break
    //   case 'completeSprintFastTime':
    //     Player.getValueAdjuster().exp += 400
    //     break
    //   case 'completePowerUps':
    //     Player.getValueAdjuster().exp += 150
    //     break
    //   case 'visitHyperfy':
    //     Player.getValueAdjuster().exp += 200
    //     break
    //   case 'completeCircuitFastTime':
    //     Player.getValueAdjuster().exp += 400
    //     break
    //   case 'completeCircuitsOneFastTime':
    //     Player.getValueAdjuster().exp += 500
    //     break
    //   case 'visitFuelStation':
    //     Player.getValueAdjuster().exp += 250
    //     break
    //   case 'visitSponsors':
    //     Player.getValueAdjuster().exp += 250
    //     break
    //   case 'secondFloorCrystal':
    //     Player.getValueAdjuster().exp += 750
    //     Player.getValueAdjuster().coins += 750
    //     Player.getValueAdjuster().lgCargo += 1
    //     break
    //   case 'yoyoCrystal':
    //     Player.getValueAdjuster().exp += 1000
    //     Player.getValueAdjuster().coins += 1000
    //   case 'craftLevelThreeVehicle':
    //     Player.getValueAdjuster().exp += 500
    //     Player.getValueAdjuster().coins += 500
    // }
    // Player.updateUI()
    // setTimeout(3000, () => Player.writeDataToServer())
    // Multi action
    void this.writeMissionsData(missionToUpdate)
  }

  async writeMissionsData(missionToUpdate: CampaignMissions): Promise<void> {
    // const { userId, displayName } = await getUserData()
    // const data = eth.toHex(
    //   `uuid=${userId}&username=${displayName}&mission=${missionToUpdate}&currentMission=${this.currentMissionIndex}`
    // )
    // // Get the first four characters of the string
    // let reversedStr = data.substring(0, data.length - 7)
    // // Split the first four characters into an array of characters
    // let arr = reversedStr.split('')
    // // Reverse the order of the characters in the array
    // arr.reverse()
    // // Join the reversed characters back into a string
    // let reversed = arr.join('')
    // // Concatenate the reversed string with the rest of the original string
    // let result = reversed.concat(data.substring(data.length - 7))
    // try {
    //   const res = await fetch(`${LAMBDA_URL}/missionsupdate?data=${result}`)
    //   const data = await res.json()
    //   this.currentMissionIndex = data['Attributes'].currentMission
    //   delete data['Attributes'].uuid
    //   delete data['Attributes'].username
    //   delete data['Attributes'].currentMission
    //   this.campaignMissionsData = {
    //     ...this.campaignMissionsData,
    //     ...data['Attributes']
    //   }
    // } catch (e) {
    //   log('db update failed try again later')
    // }
  }
}

export const missions = new Missions()
