// CHANGE THIS FLAG TO TRUE IF YOURE TESTING
// const TESTING = false;

import { getUserData } from '~system/UserIdentity'
import { missions } from './missions'
import { LAMBDA_URL } from './constants'

const TESTING = false
export type DailyMissions =
  | 'sprintCompleteFast'
  | 'sprintCompleteThree'
  | 'sprintCollectFiftyCoins'
  | 'sprintCollectBarrel'
  | 'circuitsFifteenLaps'
  | 'circuitsThreeFastLaps'
  | 'circuitsFirstPlace'
  | 'circuitsCollectTenCoins'
  | 'rechargeCompleteTwoSupercharge'
  | 'rechargeExchangeMaterialsThreeTimes'
  | 'scrapyardTwentyFiveBarrels'
  | 'scrapyardTwoBlueBarrels'
  | 'scrapyardOnePurpleBarrel'

type DailyMissionData = {
  [key in DailyMissions]: number
}

const MultiMissionSteps = {
  sprintCompleteThree: 3,
  circuitsFifteenLaps: 15,
  circuitsCollectTenCoins: 10,
  rechargeCompleteTwoSupercharge: 2,
  rechargeExchangeMaterialsThreeTimes: 3,
  scrapyardTwentyFiveBarrels: 25,
  scrapyardTwoBlueBarrels: 2
}

class DailyMission {
  public randomMissions: string[]
  public dailyMissionsData: DailyMissionData = {
    sprintCompleteFast: 0,
    sprintCompleteThree: 0,
    sprintCollectFiftyCoins: 0,
    sprintCollectBarrel: 0,
    circuitsFirstPlace: 0,
    circuitsFifteenLaps: 0,
    circuitsThreeFastLaps: 0,
    circuitsCollectTenCoins: 0,
    rechargeCompleteTwoSupercharge: 0,
    rechargeExchangeMaterialsThreeTimes: 0,
    scrapyardTwentyFiveBarrels: 0,
    scrapyardTwoBlueBarrels: 0,
    scrapyardOnePurpleBarrel: 0
  }

  constructor() {
    void this.fetchMissionData()
    this.randomMissions = []
  }

  setRandomMissions(): void {
    const keys = Object.keys(this.dailyMissionsData) as DailyMissions[]
    const randomKeys = keys.sort(() => 0.5 - Math.random()).slice(0, 3)
    this.randomMissions = randomKeys.sort()
  }

  async fetchMissionData(): Promise<void> {}

  initCampaignMissionData(data: DailyMissionData): void {
    this.dailyMissionsData = { ...this.dailyMissionsData, ...data }
    console.log(this.randomMissions, 'random')
  }

  checkIfMissionComplete = (mission: DailyMissions): boolean => {
    console.log(
      mission,
      this.dailyMissionsData,
      this.dailyMissionsData[mission]
    )
    const multiMissions: DailyMissions[] = [
      'sprintCompleteThree',
      'circuitsFifteenLaps',
      'circuitsCollectTenCoins',
      'rechargeCompleteTwoSupercharge',
      'rechargeExchangeMaterialsThreeTimes',
      'scrapyardTwentyFiveBarrels',
      'scrapyardTwoBlueBarrels'
    ]
    if (multiMissions.includes(mission)) {
      const multiMissionFinished = this.multiMissionRequirementsMet(mission)
      return multiMissionFinished
    }
    return this.dailyMissionsData[mission] > 0
  }

  checkAllMissionsComplete = (data: DailyMissions[]): boolean => {
    const missions = data
    let allMissionsComplete = true
    missions.forEach((mission) => {
      const missionComplete = this.checkIfMissionComplete(mission)
      if (!missionComplete) allMissionsComplete = false
    })
    console.log('ALL MISSIONS COMPLETE', allMissionsComplete, missions)
    return allMissionsComplete
  }

  multiMissionRequirementsMet = (missionToUpdate: string): boolean => {
    const {
      sprintCompleteThree,
      circuitsFifteenLaps,
      circuitsCollectTenCoins,
      rechargeCompleteTwoSupercharge,
      rechargeExchangeMaterialsThreeTimes,
      scrapyardTwentyFiveBarrels,
      scrapyardTwoBlueBarrels
    } = this.dailyMissionsData
    if (
      (missionToUpdate === 'sprintCompleteThree' &&
        sprintCompleteThree === MultiMissionSteps.sprintCompleteThree) ||
      (missionToUpdate === 'circuitsFifteenLaps' &&
        circuitsFifteenLaps === MultiMissionSteps.circuitsFifteenLaps) ||
      (missionToUpdate === 'circuitsCollectTenCoins' &&
        circuitsCollectTenCoins ===
          MultiMissionSteps.circuitsCollectTenCoins) ||
      (missionToUpdate === 'rechargeCompleteTwoSupercharge' &&
        rechargeCompleteTwoSupercharge ===
          MultiMissionSteps.rechargeCompleteTwoSupercharge) ||
      (missionToUpdate === 'rechargeExchangeMaterialsThreeTimes' &&
        rechargeExchangeMaterialsThreeTimes ===
          MultiMissionSteps.rechargeExchangeMaterialsThreeTimes) ||
      (missionToUpdate === 'scrapyardTwentyFiveBarrels' &&
        scrapyardTwentyFiveBarrels ===
          MultiMissionSteps.scrapyardTwentyFiveBarrels) ||
      (missionToUpdate === 'scrapyardTwoBlueBarrels' &&
        scrapyardTwoBlueBarrels === MultiMissionSteps.scrapyardTwoBlueBarrels)
    ) {
      return true
    }
    return false
  }

  async checkMission(missionToUpdate: DailyMissions): Promise<void> {
    const multiAttemptMissions = [
      'sprintCompleteThree',
      'circuitsFifteenLaps',
      'circuitsCollectTenCoins',
      'rechargeCompleteTwoSupercharage',
      'rechargeExchangeMaterialsThreeTimes',
      'scrapyardTwentyFiveBarrels',
      'scrapyardTwoBlueBarrels'
    ]
    const userId = (await getUserData({})).data?.userId
    // Make sure campaign missions are complete
    if (!TESTING && !missions.campaignMissionsComplete) return
    // If theyve already met requirements for a mission end here
    if (
      this.multiMissionRequirementsMet(missionToUpdate) ||
      (this.dailyMissionsData[missionToUpdate] > 0 &&
        !multiAttemptMissions.includes(missionToUpdate)) ||
      //   If all missions are complete end here
      this.checkAllMissionsComplete(this.randomMissions as DailyMissions[])
    ) return
    // Make sure daily missions havent been reset
    // Handle updated data in case client doesnt match server
    const result = await fetch(`${LAMBDA_URL}/dailymissions?uuid=${userId}`)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const userData = (await result?.json()) || null;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (userData?.updated) {
      const keys = Object.keys(this.dailyMissionsData)
      const randomKeys = keys.sort(() => 0.5 - Math.random()).slice(0, 3)
      const randomMissions = randomKeys.sort()
      void this.writeMissionsData(randomMissions[0], true)
      // missionBoard.hide()
      // return ui.displayAnnouncement(
      //   'Daily Missions have been reset.\n\nCheck the menu for updated missions.',
      //   5
      // )
    }
    // Move on to rewards
    void this.awardUserForMission(missionToUpdate)
  }

  async awardUserForMission(missionToUpdate: any): Promise<void> {
    const {
      sprintCompleteThree,
      circuitsFifteenLaps,
      circuitsCollectTenCoins,
      rechargeCompleteTwoSupercharge,
      rechargeExchangeMaterialsThreeTimes,
      scrapyardTwentyFiveBarrels,
      scrapyardTwoBlueBarrels
    } = this.dailyMissionsData
    // Multi action missions -- equality check is 1 below total b/c we'll be adding one to total serverside
    if (
      (missionToUpdate === 'sprintCompleteThree' &&
        sprintCompleteThree === MultiMissionSteps.sprintCompleteThree - 1) ||
      (missionToUpdate === 'circuitsFifteenLaps' &&
        circuitsFifteenLaps === MultiMissionSteps.circuitsFifteenLaps - 1) ||
      (missionToUpdate === 'circuitsCollectTenCoins' &&
        circuitsCollectTenCoins ===
          MultiMissionSteps.circuitsCollectTenCoins - 1) ||
      (missionToUpdate === 'rechargeCompleteTwoSupercharge' &&
        rechargeCompleteTwoSupercharge ===
          MultiMissionSteps.rechargeCompleteTwoSupercharge - 1) ||
      (missionToUpdate === 'rechargeExchangeMaterialsThreeTimes' &&
        rechargeExchangeMaterialsThreeTimes ===
          MultiMissionSteps.rechargeExchangeMaterialsThreeTimes - 1) ||
      (missionToUpdate === 'scrapyardTwentyFiveBarrels' &&
        scrapyardTwentyFiveBarrels ===
          MultiMissionSteps.scrapyardTwentyFiveBarrels - 1) ||
      (missionToUpdate === 'scrapyardTwoBlueBarrels' &&
        scrapyardTwoBlueBarrels ===
          MultiMissionSteps.scrapyardTwoBlueBarrels - 1)
    ) {
      // Player.getValueAdjuster().exp += 500;
      // Player.getValueAdjuster().coins += 750;
      // missionBoard.showMissionCompleteBoard();
      // setTimeout(3000, () => Player.writeDataToServer());
      // Player.updateUI();
      await this.writeMissionsData(missionToUpdate as DailyMission)
      return
    }
    // update multi atttempt missions
    if (Object.keys(MultiMissionSteps).includes(missionToUpdate)) {
      await this.writeMissionsData(missionToUpdate as DailyMission)
    } else {
      // Handle single attempt missions
      // Player.getValueAdjuster().exp += 500;
      // Player.getValueAdjuster().coins += 750;
      // missionBoard.showMissionCompleteBoard();
      // Player.updateUI();
      // setTimeout(3000, () => Player.writeDataToServer());
      void this.writeMissionsData(missionToUpdate as DailyMission)
    }
  }

  async writeMissionsData(
    missionToUpdate: any,
    init?: boolean
  ): Promise<void> {}
}

export const dailyMission = new DailyMission()
