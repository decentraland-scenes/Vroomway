import { getUserData } from '~system/UserIdentity'
import {
  PowerUpManager,
  PowerUpItemPoolMgr,
  PowerUpIdEnum,
  PowerUpCatalog
} from '../vw-decentrally/modules/connection/state/powerups-spec'
import { SAVE_TESTERS, LAMBDA_URL } from './constants'
import type * as serverStateSpec from '../vw-decentrally/modules/connection/state/server-state-spec'
import * as eth from 'eth-connect'
import { type GameController } from '../controllers/game.controller'
const CLASSNAME = 'powerups.ts'
type PlayerStats = {
  multiplierCoins2x?: number
  multiplierXp2x?: number
  projectileDamagePlus5?: number
  healthPlus50?: number
  projectileTrap?: number
  healthInvincible15s?: number
}
export class PowerUpManagerClient extends PowerUpManager {
  gameController: GameController
  constructor(gameController: GameController) {
    super()
    this.gameController = gameController
    this.powerUps = new Map()
  }

  usePowerUp(
    id: serverStateSpec.PowerUpId,
    now: number
  ): serverStateSpec.PowerUpItemUseResult {
    const result: serverStateSpec.PowerUpItemUseResult = super.usePowerUp(
      id,
      now
    )

    console.log(
      'PowerUpManagerClient',
      'powerup',
      'usePowerUp',
      'result',
      result
    )
    console.log(
      'PowerUpManagerClient',
      'powerup',
      'usePowerUp',
      'getAvialablePowerUpsIdsAsList',
      this.getAvialablePowerUpsIdsAsList()
    )
    console.log(
      'PowerUpManagerClient',
      'powerup',
      'usePowerUp',
      'getActivePowerUpsIdsAsList',
      this.getActivePowerUpsIdsAsList()
    )

    return result
  }

  createFromPowerUpGameSettingItm(
    invItem: serverStateSpec.PowerUpsGameSettingsItm
  ): serverStateSpec.PowerUpsItemPoolState {
    const obj = new PowerUpItemPoolMgr()
    obj.id = invItem.id
    obj.items = []
    for (let x = 0; x < invItem.available; x++) {
      const itm: serverStateSpec.PowerUpItemState = {
        id: invItem.id,
        status: 'available',
        activateTime: 0,
        expireTime: 0,
        serverTime: 0,
        usesLeft: 0
      }

      obj.items.push(itm)
    }

    return obj
  }

  reset(): void {
    const METHOD_NAME = 'powerupReset'
    // debugger
    console.log(CLASSNAME, METHOD_NAME)

    super.reset()

    this.gameController.uiController.powerUpBar.updateUI()
  }

  initPowerUps(inventory: serverStateSpec.PowerUpSelection): void {
    const METHOD_NAME = 'initPowerUps'

    console.log(CLASSNAME, METHOD_NAME, 'inventory', inventory)

    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain, @typescript-eslint/strict-boolean-expressions
    if (!inventory || !inventory.items) {
      console.log(CLASSNAME, METHOD_NAME, 'no inventory or items', inventory)
    }
    // const inventoryMap:Record<string,serverStateSpec.PowerUpsGameSettingsItm> = {}
    for (const p of inventory.items) {
      // inventoryMap[p.id] = p
      // use factory pattern
      this.powerUps.set(p.id, this.createFromPowerUpGameSettingItm(p))
    }
  }

  /**
   *
   * @param _now - when omitted will use GAME_STATE.getGameTime()
   * @returns
   */
  updateStatuses(
    _now?: number
  ): Map<
    serverStateSpec.PowerUpId,
    serverStateSpec.PowerUpsStatusUpdateResult
  > {
    const METHOD_NAME = 'updateStatuses'
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    // const now = _now !== undefined ? _now : GAME_STATE.getGameTime()
    const now = Date.now()
    const result = super.updateStatuses(now)

    this.gameController.uiController.powerUpBar.updateUI()

    console.log(
      CLASSNAME,
      METHOD_NAME,
      'result',
      result,
      'this.getPowerUpPoolMap()',
      this.powerUps,
      'this.getPowerUpPoolMap()',
      this.getPowerUpPoolMap()
    )
    return result
  }
}

class PowerUpsBase {
  public multiplierCoins2x: number = 0 // pu1
  public multiplierXp2x: number = 0 // pu2
  public projectileDamagePlus5: number = 0 // pu3
  public healthPlus50: number = 0 // pu4
  public projectileTrap: number = 0 // pu5
  public healthInvincible15s: number = 0 // pu6

  public lastLogin: number = 0

  public cnt: number = 0

  resetStats(): void {
    this.healthPlus50 = 0
    this.healthInvincible15s = 0
    this.multiplierCoins2x = 0
    this.multiplierXp2x = 0
    this.projectileDamagePlus5 = 0
    this.projectileTrap = 0
  }

  getHealthPlus50(): number | undefined {
    return this.healthPlus50
  }

  getHealthInvincible15s(): number | undefined {
    return this.healthInvincible15s
  }

  getMultiplierCoins2x(): number | undefined {
    return this.multiplierCoins2x
  }

  getMultiplierXp2x(): number | undefined {
    return this.multiplierXp2x
  }

  getProjectileDamagePlus5(): number | undefined {
    return this.projectileDamagePlus5
  }

  getProjectileTrap(): number | undefined {
    return this.projectileTrap
  }

  // meant for use on the adjuster (temprorary counter), not the actual perma state object
  adjustFromResult(result: serverStateSpec.PowerUpItemUseResult): void {
    if (!result.newlyActivated) {
      console.log(
        'PowerUpsBase',
        'adjustFromResult',
        'result was not newlyActivated.skipping'
      )
      return
    }
    // deduct 1
    this.adjustFromId(result.id, -1)
  }

  /**
   * amount you have of the powerup
   * @param id
   * @returns
   */
  getAmountById(id: serverStateSpec.PowerUpId): number | undefined {
    const METHOD_NAME = 'getAmountById'
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!id) {
      console.log('PowerUpsBase', METHOD_NAME, 'id isinvalid', id)
      return -2
    }

    switch (id) {
      case PowerUpIdEnum.HEALTH_INVINCIBLE_15_SECONDS:
        return this.getHealthInvincible15s()
      case PowerUpIdEnum.HEALTH_PLUS_50:
        return this.getHealthPlus50()
      case PowerUpIdEnum.MULTIPLIER_XP_2X_TIME_ROUND:
        return this.getMultiplierXp2x()
      case PowerUpIdEnum.MULTIPLIER_COIN_2X_TIME_ROUND:
        return this.getMultiplierCoins2x()
      case PowerUpIdEnum.PROJECTILE_DAMANGE_PLUS_5_TIME_ROUND:
        return this.getProjectileDamagePlus5()
      case PowerUpIdEnum.TRAP_PROJECTILE_TIME_ROUND:
        return this.getProjectileTrap()
      default:
        // debugger
        console.log(METHOD_NAME, 'UNEXPECTED TYPE ', id)
        return -2
    }
  }

  adjustFromId(id: serverStateSpec.PowerUpId, amount: number): void {
    const METHOD_NAME = 'adjustFromId'
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!id) {
      console.log('PowerUpsBase', METHOD_NAME, 'id isinvalid', id)
      return
    }

    switch (id) {
      case PowerUpIdEnum.HEALTH_INVINCIBLE_15_SECONDS:
        this.healthInvincible15s += amount
        break
      case PowerUpIdEnum.HEALTH_PLUS_50:
        this.healthPlus50 += amount
        break
      case PowerUpIdEnum.MULTIPLIER_XP_2X_TIME_ROUND:
        this.multiplierXp2x += amount
        break
      case PowerUpIdEnum.MULTIPLIER_COIN_2X_TIME_ROUND:
        this.multiplierCoins2x += amount
        break
      case PowerUpIdEnum.PROJECTILE_DAMANGE_PLUS_5_TIME_ROUND:
        this.projectileDamagePlus5 += amount
        break
      case PowerUpIdEnum.TRAP_PROJECTILE_TIME_ROUND:
        this.projectileTrap += amount
        break
      default:
        // debugger
        console.log('PowerUpsBase', METHOD_NAME, 'UNEXPECTED TYPE ', id)
    }
  }

  add(vals: PowerUpsBase): void {
    this.healthPlus50 += vals.healthPlus50
    this.healthInvincible15s += vals.healthInvincible15s
    this.multiplierCoins2x += vals.multiplierCoins2x
    this.multiplierXp2x += vals.multiplierXp2x
    this.projectileDamagePlus5 += vals.projectileDamagePlus5
    this.projectileTrap += vals.projectileTrap
    this.copyTimeValuesFrom(vals)
  }

  // copy times over because they are not aggrative
  // with how they are computed i think "best" time is stored
  // so must copy latest or it will be lost as a completly
  // reset object will hold null values and the eval will assume 0
  // or empty and assign when ever score they had
  copyTimeValuesFrom(vals: PowerUpsBase): void {}
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SEED = {
  lastLogin: undefined,
  healthPlus50: 0,
  healthInvincible15s: 0,
  multiplierCoins2x: 0,
  multiplierXp2x: 0,
  projectileDamangePlus5: 0,
  projectileTrap: 0
}
export class PlayerPowerUps extends PowerUpsBase {
  firstLoad: boolean = false
  hasFetchingError: boolean
  saveInProgress: boolean = false
  _userId: string | undefined = '' // cacheit

  adjustValues: PowerUpsBase

  public powerUpMgr: PowerUpManagerClient
  gameController: GameController
  constructor(gameController: GameController) {
    super()
    this.gameController = gameController

    this.powerUpMgr = new PowerUpManagerClient(this.gameController)

    this.adjustValues = new PowerUpsBase()
    this.adjustValues.resetStats()

    this.hasFetchingError = false
    void this.fetchPlayerStats(true, true)
  }

  resetStats(): void {
    super.resetStats()
    this.powerUpMgr.reset()
  }

  initPlayerStats(
    {
      multiplierCoins2x = 0,
      multiplierXp2x = 0,
      projectileDamagePlus5 = 0,
      healthPlus50 = 0,
      projectileTrap = 0,
      healthInvincible15s = 0
    }: PlayerStats,
    refreshAdjustedValues?: boolean
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
    if (refreshAdjustedValues === undefined || refreshAdjustedValues === true) {
      this.refreshAdjustedValues(this.adjustValues)
    }

    const d = new Date()
    const milliseconds = d.getTime()
    this.lastLogin = milliseconds

    this.multiplierCoins2x = multiplierCoins2x
    this.multiplierXp2x = multiplierXp2x
    this.projectileDamagePlus5 = projectileDamagePlus5
    this.healthPlus50 = healthPlus50
    this.projectileTrap = projectileTrap
    this.healthInvincible15s = healthInvincible15s

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
    if (refreshAdjustedValues === undefined || refreshAdjustedValues === true) {
      this.refreshAdjustedValues(this.adjustValues)
    }

    // Player.updateUI();
  }

  refreshAdjustedValues(adjustableVals: PowerUpsBase): void {
    adjustableVals.resetStats()
    // need to copy time values as they are persisted and copies forward
    adjustableVals.copyTimeValuesFrom(this)
  }

  getHealthPlus50(): number {
    const baseHealth = super.getHealthPlus50() ?? 0
    return baseHealth + this.adjustValues.healthPlus50
  }

  getHealthInvincible15s(): number | undefined {
    const baseHealth = super.getHealthInvincible15s()
    if (baseHealth !== undefined) {
      return baseHealth + this.adjustValues.healthInvincible15s
    }
    return undefined
  }

  getMultiplierCoins2x(): number {
    const baseMultiplier = super.getMultiplierCoins2x() ?? 0 // Usa 0 si es undefined
    return baseMultiplier + this.adjustValues.multiplierCoins2x
  }

  getMultiplierXp2x(): number {
    const baseMultiplier = super.getMultiplierXp2x() ?? 0 // Usa 0 si es undefined
    return baseMultiplier + this.adjustValues.multiplierXp2x
  }

  getProjectileDamagePlus5(): number {
    const baseDamage = super.getProjectileDamagePlus5() ?? 0 // Usa 0 si es undefined
    return baseDamage + this.adjustValues.projectileDamagePlus5
  }

  getProjectileTrap(): number {
    const baseTrap = super.getProjectileTrap() ?? 0 // Usa 0 si es undefined
    return baseTrap + this.adjustValues.projectileTrap
  }

  public isIncDecServiceEnabled(): boolean {
    const retVal = true
    console.log('PowerUpsBase', 'isIncDecEnabled', retVal, SAVE_TESTERS)
    return retVal
  }

  public isAdjustbleValsEnabled(): boolean {
    const retVal = true // SAVE_TESTERS[this._userId] !== undefined;
    console.log('PowerUpsBase', 'isAdjustbleValsEnabled', retVal, SAVE_TESTERS)
    return retVal
  }

  /**
   * if should save the second its used
   * otherwise all races should call updateEndOfRace at the end to flush all changes
   * @returns
   */
  public isSaveImmeidatlyOnUseEnabled(): boolean {
    const retVal = true // SAVE_TESTERS[this._userId] !== undefined;
    console.log(
      'PowerUpsBase',
      'isSaveImmeidatlyOnUseEnabled',
      retVal,
      SAVE_TESTERS
    )
    return retVal
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public getValueAdjuster() {
    if (this.isAdjustbleValsEnabled()) {
      return this.adjustValues
    } else {
      return this
    }
  }

  async fetchPlayerStats(
    updateUI?: boolean,
    refreshAdjustedValues?: boolean
  ): Promise<void> {
    // await Player.fetchPlayerStats(updateUI,refreshAdjustedValues)
    try {
      const userData = await getUserData({})
      this._userId = userData.data?.userId

      const url = `${LAMBDA_URL}/powerups?uuid=${this._userId}`
      const response = await fetch(url)
      const json = await response.json()
      // const items = json.Items;
      console.log(json, 'POWERUP ITEMS')

      // Check for fetching error
      const stats = json

      /* if(userId === WILL){
        stats = {
          healthPlus50: 2,
          healthInvincible15s: 1,
          multiplierCoins2x: 3,
          multiplierXp2x: 4,
          projectileDamangePlus5: 5,
          projectileTrap: 6
        };
      } */
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/strict-boolean-expressions
      this.initPlayerStats((stats || {}) as any, refreshAdjustedValues)
      if (updateUI === undefined || updateUI) this.updateUI()
    } catch (e) {
      this.hasFetchingError = true
    }
  }

  updateUI(): void {
    // TODO use powerUpBarUI????
    this.gameController.uiController.powerUpBar.updateUI()
  }

  /**
   * amount you can use for a race
   * @param powerupId
   * @returns
   */
  getSelectionAvailableAmountById(
    powerupId: serverStateSpec.PowerUpId
  ): number {
    const METHOD_NAME = 'getAvailableAmountById'
    const pup = PowerUpCatalog.get(powerupId)
    let val = Math.min(this.getAmountById(powerupId) ?? 0, pup.usageMax)
    if (val < 0) {
      val = 0
    }
    console.log('PowerUpsBase', 'syncUsedPowerUps', METHOD_NAME, val)
    return val
  }

  toPowerUpSelection(): serverStateSpec.PowerUpSelection {
    // TODO convert item count to this format
    const selection = {
      items: [
        {
          id: PowerUpIdEnum.MULTIPLIER_COIN_2X_TIME_ROUND,
          available: this.getSelectionAvailableAmountById(
            PowerUpIdEnum.MULTIPLIER_COIN_2X_TIME_ROUND
          ),
          total:
            this.getAmountById(PowerUpIdEnum.MULTIPLIER_COIN_2X_TIME_ROUND) ?? 0
        },
        {
          id: PowerUpIdEnum.MULTIPLIER_XP_2X_TIME_ROUND,
          available: this.getSelectionAvailableAmountById(
            PowerUpIdEnum.MULTIPLIER_XP_2X_TIME_ROUND
          ),
          total:
            this.getAmountById(PowerUpIdEnum.MULTIPLIER_XP_2X_TIME_ROUND) ?? 0
        },
        {
          id: PowerUpIdEnum.HEALTH_PLUS_50,
          available: this.getSelectionAvailableAmountById(
            PowerUpIdEnum.HEALTH_PLUS_50
          ),
          total: this.getAmountById(PowerUpIdEnum.HEALTH_PLUS_50) ?? 0
        },
        {
          id: PowerUpIdEnum.HEALTH_INVINCIBLE_15_SECONDS,
          available: this.getSelectionAvailableAmountById(
            PowerUpIdEnum.HEALTH_INVINCIBLE_15_SECONDS
          ),
          total:
            this.getAmountById(PowerUpIdEnum.HEALTH_INVINCIBLE_15_SECONDS) ?? 0
        },
        {
          id: PowerUpIdEnum.PROJECTILE_DAMANGE_PLUS_5_TIME_ROUND,
          available: this.getSelectionAvailableAmountById(
            PowerUpIdEnum.PROJECTILE_DAMANGE_PLUS_5_TIME_ROUND
          ),
          total:
            this.getAmountById(
              PowerUpIdEnum.PROJECTILE_DAMANGE_PLUS_5_TIME_ROUND
            ) ?? 0
        },
        {
          id: PowerUpIdEnum.TRAP_PROJECTILE_TIME_ROUND,
          available: this.getSelectionAvailableAmountById(
            PowerUpIdEnum.TRAP_PROJECTILE_TIME_ROUND
          ),
          total:
            this.getAmountById(PowerUpIdEnum.TRAP_PROJECTILE_TIME_ROUND) ?? 0
        }
      ]
    }

    // adjust available to be no greater than total
    for (const p of selection.items) {
      if (p.available > p.total) {
        p.available = p.total
      }
    }

    return selection
  }

  // to write back to the primary counter (not the adjuster)
  // do we need this if #this.adjustFromResult is already being called
  // and all access goes through getters to account for the subraction?
  // just perform a read after the write to update the latest?
  // TODO not sure we need / want this? keep as a debugger/optimistic update but not an official usage?
  // not sure this is what we want if we are event updating
  updateUsedPowerUpsDONTUSE_Q(): void {
    // TODO fetch from powerupmgr used/active

    // const list:serverStateSpec.PowerUpsItemPoolState[] = []

    const powerups = this.powerUpMgr.getPowerUpPoolMap()

    // TODO should we check the core value or can we use the adjuster?
    for (const p of powerups.values()) {
      let usedCnt = 0

      // scan for used or active (meaning used)
      p.items.forEach((val: serverStateSpec.PowerUpItemState) => {
        // list.push(p)
        if (val.status === 'activated' || val.status === 'used') usedCnt += 1
      })
      // decrement which ever id it matches up to
      switch (p.id) {
        case PowerUpIdEnum.HEALTH_INVINCIBLE_15_SECONDS:
          this.healthInvincible15s -= usedCnt
          break
        case PowerUpIdEnum.HEALTH_PLUS_50:
          this.healthPlus50 -= usedCnt
          break
        case PowerUpIdEnum.MULTIPLIER_XP_2X_TIME_ROUND:
          this.multiplierXp2x -= usedCnt
          break
        case PowerUpIdEnum.MULTIPLIER_COIN_2X_TIME_ROUND:
          this.multiplierCoins2x -= usedCnt
          break
        case PowerUpIdEnum.PROJECTILE_DAMANGE_PLUS_5_TIME_ROUND:
          this.projectileDamagePlus5 -= usedCnt
          break
        case PowerUpIdEnum.TRAP_PROJECTILE_TIME_ROUND:
          this.projectileTrap -= usedCnt
          break
        default:
          // debugger
          console.log(
            'syncUsedPowerUps',
            'UNEXPECTED TYPE ',
            p.id,
            'usecount',
            usedCnt
          )
      }
    } // end for loop
  }

  // assuming that writeDataToServer is called as we use them then its
  // a no-op
  updateEndOfRace(): void {
    // if ever we needed specific end of race logic do it here
    // fly any un save already values, in theory should be a no-op
    void this.writeDataToServer({
      onFinish: { updateUI: true, fetchLatest: true }
    })
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async writeDataToServer(options?: {
    onFinish?: { updateUI: boolean; fetchLatest: boolean }
  }) {
    // TODO implement me!!!!

    const METHOD_NAME = 'writeDataToServer'
    console.log(CLASSNAME, METHOD_NAME, 'ENTRY', 'options', options)
    if (this.hasFetchingError)
      // return ui.displayAnnouncement(
      //   'Error fetching data. Please reload the page.',
      //   6000
      // )

      // save in progess should be safe
      // using increments
      /* if (this.saveInProgress) {
      //log warning!!!!
      log("WARNING saving data. Save in progress already.");
      ui.displayAnnouncement("WARNING saving data. Save in progress already.", 5);
    } */
      this.saveInProgress = true

    const old = this.adjustValues

    // new copy to avoid concurrent writes
    this.adjustValues = new PowerUpsBase()
    this.refreshAdjustedValues(this.adjustValues)

    // START workaround  until lambda can be updated to handle increments
    const localAdjustValues = old

    // fetch latest values
    // COMMENTED OUT TILL WE SOLVE BUG
    /* if (this.isAdjustbleValsEnabled() && !this.isIncDecServiceEnabled()) {
      log(
        METHOD_NAME,
        "isAdjustbleValsEnabled is true, fetching latest stats workaround because isIncDecServiceEnabled:",
        this.isIncDecServiceEnabled()
      );
      await this.fetchPlayerStats(false, false);
    } */
    // concat them to current display values

    // add adjustValues to this object for save to work propertly for now
    if (this.isAdjustbleValsEnabled()) {
      // && !this.isIncDecServiceEnabled()) {
      console.log(
        CLASSNAME,
        METHOD_NAME,
        'isAdjustbleValsEnabled is true, incrementing values to primary object.' // do not use this once server handles inc/dec for us"
      )
      this.add(localAdjustValues) // do it after save to ensure worked??
    }

    // reset values for next time
    // refreshAdjustedValues

    // when lambda is changed to an incrementer pass this.adjustValues instead
    const valueHolder = localAdjustValues

    // END workaround  until lambda can be updated to handle increments
    const encrypting = true

    console.log('writeDataToServer', 'valueHolder', valueHolder)

    const userData = await getUserData({})
    const pu1 = valueHolder.multiplierCoins2x
    const pu2 = valueHolder.multiplierXp2x
    const pu3 = valueHolder.projectileDamagePlus5
    const pu4 = valueHolder.healthPlus50
    const pu5 = valueHolder.projectileTrap
    const pu6 = valueHolder.healthInvincible15s

    let powerups = ''
    powerups += `&powerup=multiplierCoins2x&change=${pu1}`
    powerups += `&powerup1=multiplierXp2x&change1=${pu2}`
    powerups += `&powerup2=projectileDamagePlus5&change2=${pu3}`
    powerups += `&powerup3=healthPlus50&change3=${pu4}`
    powerups += `&powerup4=projectileTrap&change4=${pu5}`
    powerups += `&powerup5=healthInvincible15s&change5=${pu6}`
    console.log('powerups.data', powerups)
    const data = eth.toHex(
      `uuid=${userData.data?.userId}&username=${userData.data?.displayName}&${powerups}`
    )

    // Get the first four characters of the string
    const reversedStr = data.substring(0, data.length - 7)
    // Split the first four characters into an array of characters
    let arr: any[] = []
    if (encrypting) {
      arr = reversedStr.split('')
      // Reverse the order of the characters in the array
      arr.reverse()
    }
    // Join the reversed characters back into a string
    const reversed = encrypting ? arr.join('') : reversedStr
    // Concatenate the reversed string with the rest of the original string
    const result = reversed.concat(data.substring(data.length - 7))
    try {
      const response = await fetch(
        `${LAMBDA_URL}/powerupsupdate?data=${result}`
      )
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const json = await response.json()
      console.log('writeDataToServer', 'json,json')
    } catch (e) {
      console.log('db update failed try again later')
    } finally {
      this.saveInProgress = false
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (options?.onFinish?.updateUI) {
        // TODO must refech latest or can update return latest to avoid another call?
        // if (this.isIncDecServiceEnabled()) {//beacuse we write very fast, dont fetch till end
        if (options?.onFinish?.fetchLatest) {
          await this.fetchPlayerStats(false, false)
        }

        this.updateUI()
      }
    }
  }
}

/*
//uncomment to give your player some data for testing. also shows how easy it is to hack
PowerUpsInv.getValueAdjuster().multiplierCoins2x+=2
PowerUpsInv.getValueAdjuster().multiplierXp2x+=2
PowerUpsInv.getValueAdjuster().healthInvincible15s+=2
PowerUpsInv.getValueAdjuster().healthPlus50+=2
PowerUpsInv.getValueAdjuster().projectileDamagePlus5+=2
PowerUpsInv.getValueAdjuster().projectileTrap+=2
PowerUpsInv.writeDataToServer({onFinish:{fetchLatest:true,updateUI:true}})
 
*/
