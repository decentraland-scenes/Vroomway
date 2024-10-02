/* eslint-disable @typescript-eslint/consistent-type-assertions */
import * as serverStateSpec from './server-state-spec'
export enum PowerUpIdEnum {
  HEALTH_PLUS_50 = 'health.plus.50',
  HEALTH_INVINCIBLE_15_SECONDS = 'health.invincible.time.15s',
  PROJECTILE_DAMANGE_PLUS_5_TIME_ROUND = 'projectile.damage.plus.5.time.round',
  TRAP_PROJECTILE_TIME_ROUND = 'trap.projectile.time.round',
  // TRAP_DEPLOYER_TIME_ROUND
  MULTIPLIER_COIN_2X_TIME_ROUND = 'multiplier.coins.2x.time.round',
  MULTIPLIER_XP_2X_TIME_ROUND = 'multiplier.xp.2x.time.round'
}
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class PowerUpCatalog {
  // static MULTIPLIER_COIN_2X_TIME_ROUND:PowerUpsDefInst=
  // static MULTIPLIER_XP_2X_TIME_ROUND:PowerUpsDefInst=
  // static HEALTH_PLUS_50:PowerUpsDefInst=
  // static HEALTH_INVINCIBLE_15_SECONDS:PowerUpsDefInst=

  // static TRAP_DEPLOYER_TIME_ROUND:PowerUpsDefInst=

  static catalog: Record<string, serverStateSpec.PowerUpsDefInst> = {}

  static {
    const list: serverStateSpec.PowerUpsDefInst[] = [
      {
        id: PowerUpIdEnum.MULTIPLIER_COIN_2X_TIME_ROUND,
        classType: 'multiplier',
        name: 'Double Coins',
        desc: 'Gain 2x coins while active',
        cooldown: -1,
        duration: -1,
        usageMax: 1,
        usePerActivate: 1,
        autoActivate: false,
        stackableAmount: 1,
        usageType: 'consumable',
        valueModifier: {
          // type:'number',
          numVal: 2
        },
        validFor: {
          mode: undefined,
          level: ['solosprint'] // add 'circuit', when coins added
        },
        cost: [{ type: 'coins', id: 'coin', amount: 3500 }]
      },
      {
        id: PowerUpIdEnum.MULTIPLIER_XP_2X_TIME_ROUND,
        classType: 'multiplier',
        name: 'Double EXP',
        desc: 'Gain 2x XP while active',
        cooldown: -1,
        duration: -1,
        usageMax: 1,
        usePerActivate: 1,
        autoActivate: false,
        stackableAmount: 1,
        usageType: 'consumable',
        cost: [{ type: 'coins', id: 'coin', amount: 3500 }],
        valueModifier: {
          // type:'number',
          numVal: 2
        },
        validFor: {
          mode: undefined,
          level: ['solosprint', 'circuit', 'derby'] // add dragrace when added
        }
      },
      {
        id: PowerUpIdEnum.HEALTH_PLUS_50,
        classType: 'health',
        name: 'Power Repair',
        desc: 'Add 50 points to health',
        cooldown: -1,
        duration: -1,
        usageMax: 1,
        usePerActivate: 1,
        autoActivate: false,
        stackableAmount: 1,
        usageType: 'consumable',
        cost: [{ type: 'coins', id: 'coin', amount: 5000 }],
        valueModifier: {
          // type:'number',
          numVal: 50
        },
        validFor: {
          mode: undefined,
          level: ['derby'] // 'circuit', add when circuits have health
        }
      },
      {
        id: PowerUpIdEnum.HEALTH_INVINCIBLE_15_SECONDS,
        classType: 'health',
        name: 'Burnt Hotdog Water',
        desc: 'Invincible for 15 seconds',
        cooldown: 3000,
        duration: 15000,
        usageMax: 1,
        usePerActivate: 1,
        autoActivate: false,
        stackableAmount: 1,
        usageType: 'consumable',
        cost: [{ type: 'coins', id: 'coin', amount: 7500 }],
        valueModifier: {
          // type:'number',
          numVal: 999999999
        },
        validFor: {
          mode: undefined,
          level: ['circuit', 'derby']
        }
      },
      {
        id: PowerUpIdEnum.TRAP_PROJECTILE_TIME_ROUND,
        classType: 'projectile',
        name: 'Trap Launcher',
        desc: 'Deploys trap',
        cooldown: 30000,
        duration: -1,
        usageMax: 1,
        usePerActivate: 3,
        autoActivate: false,
        stackableAmount: 1,
        usageType: 'consumable',
        cost: [{ type: 'coins', id: 'coin', amount: 7500 }],
        valueModifier: {
          // type:'number',
          numVal: 1
        },
        validFor: {
          mode: undefined,
          level: ['circuit']
        }
      },
      {
        id: PowerUpIdEnum.PROJECTILE_DAMANGE_PLUS_5_TIME_ROUND,
        classType: 'multiplier',
        name: 'Power Damage',
        desc: 'damange + 5',
        cooldown: -1,
        duration: -1,
        usageMax: 1,
        usePerActivate: 1,
        autoActivate: false,
        stackableAmount: 1,
        usageType: 'consumable',
        cost: [{ type: 'coins', id: 'coin', amount: 5000 }],
        valueModifier: {
          // type:'number',
          numVal: 5
        },
        validFor: {
          mode: undefined,
          level: ['derby'] // 'circuit', add when circuits have health
        }
      }
    ]
    for (const p of list) {
      PowerUpCatalog.catalog[p.id] = p
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  static get(id: serverStateSpec.PowerUpId) {
    return PowerUpCatalog.catalog[id]
  }

  /* static getValidFor(filter:{mode?:serverStateSpec.PowerUpLevelModeType,level?:serverStateSpec.PowerUpLevelType}){
    for(const p in PowerUpCatalog.catalog){
      const pup = PowerUpCatalog.catalog[p]
      const _valid = PowerUpCatalog.isValidFor(pup,filter)

    }
  } */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  static isValidFor(
    itm: serverStateSpec.PowerUpsDefInst,
    filter: {
      mode?: serverStateSpec.PowerUpLevelModeType
      level?: serverStateSpec.PowerUpLevelType
    }
  ) {
    console.log('isValidFor', 'ENTRY', [itm.id, filter])

    let valid = true
    if (filter.mode !== undefined) {
      if (itm.validFor?.mode != null) {
        let matched = false
        for (const p of itm.validFor.mode) {
          if (p === filter.mode) {
            matched = true
            break
          }
        }
        if (!matched) {
          valid = false
        }
      } else {
        // undefined means all
      }
    }
    if (filter.level !== undefined) {
      if (itm.validFor?.level != null) {
        let matched = false
        for (const p of itm.validFor.level) {
          if (p === filter.level) {
            matched = true
            break
          }
        }
        if (!matched) {
          valid = false
        }
      } else {
        // undefined means all
      }
    }

    console.log('isValidFor', 'RETURN', valid)
    return valid
  }
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class PowerUpItemUtils {
  static hasActivated(
    powerUpItm: serverStateSpec.PowerUpsItemPoolState
  ): boolean {
    for (let x = 0; x < powerUpItm.items.length; x++) {
      const itm = powerUpItm.items[x]
      if (itm.status === 'activated') {
        return true
      }
    }
    return false
  }

  static hasUsed(powerUpItm: serverStateSpec.PowerUpsItemPoolState): boolean {
    for (let x = 0; x < powerUpItm.items.length; x++) {
      const itm = powerUpItm.items[x]
      if (itm.status === 'used') {
        return true
      }
    }
    return false
  }

  /* static hasActivatedId(id:PowerUpIdEnum,powerUpItm: serverStateSpec.PowerUpsItemPoolState) {
    //TODO as some point will be able to look up
    //powerUpItm.cached.activatedCountRecord for faster lookup
    for (let x = 0; x < powerUpItm.items.length; x++) {
      const itm = powerUpItm.items[x];
      if (itm.id === id && itm.status == "activated") {
        return true;
      }
    }
    return false;
  } */
  static hasAvialable(
    powerUpItm: serverStateSpec.PowerUpsItemPoolState
  ): boolean {
    for (let x = 0; x < powerUpItm.items.length; x++) {
      const itm = powerUpItm.items[x]
      if (itm.status === 'available') {
        return true
      }
    }
    return false
  }

  static use(
    powerUpItm: serverStateSpec.PowerUpsItemPoolState,
    now: number
  ): serverStateSpec.PowerUpItemUseResult | undefined {
    const powerUpDef = PowerUpCatalog.get(powerUpItm.id)

    const using = PowerUpItemUtils.getActiveCnt(powerUpItm)
    if (using === 1 && powerUpDef.usePerActivate > 1) {
      const active = PowerUpItemUtils.getFirstActive(powerUpItm)
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (active) {
        // Verificamos que active no sea undefined
        const useResult = PowerUpItemUtils.useThis(powerUpItm, active, now)
        return useResult
      }
    }

    for (let x = 0; x < powerUpItm.items.length; x++) {
      const itm = powerUpItm.items[x]
      console.log('use.try', itm.id, itm.status)
      if (itm.status === 'available') {
        const useResult = PowerUpItemUtils.useThis(powerUpItm, itm, now)
        return useResult
      }
    }

    // Return undefined if no available item is found
    return undefined
  }

  static useThis(
    powerUpItm: serverStateSpec.PowerUpsItemPoolState,
    itm: serverStateSpec.PowerUpItemState,
    now: number
  ): serverStateSpec.PowerUpItemUseResult {
    // const usedVal = this.available.splice(0,1)[0]
    // this.activated.push(usedVal)
    const powerUpDef = PowerUpCatalog.get(powerUpItm.id)
    const maxActive = powerUpDef.stackableAmount
    const curActive = PowerUpItemUtils.getActiveCnt(powerUpItm) // FIXME this is a loop count :( need way to cache
    // const powerUpDef = PowerUpCatalog.get( this.id )
    const result: serverStateSpec.PowerUpItemUseResult = {
      success: false,
      newlyActivated: false,
      id: itm.id,
      msg: 'tbd',
      itm: itm,
      serverTime: now
    }
    if (
      itm.status === 'activated' &&
      powerUpDef.usePerActivate > 1 &&
      itm.usesLeft > 0
    ) {
      itm.usesLeft--
      console.log(
        'XXX',
        powerUpItm.id,
        'decrementing usesLeft',
        itm.usesLeft,
        '/',
        powerUpDef.usePerActivate
      )
      result.success = true
      result.newlyActivated = false
    } else if (itm.status === 'available') {
      if (curActive < maxActive) {
        PowerUpItemUtils.activateItem(powerUpItm, itm, now)
        console.log('XXX', powerUpItm.id, 'activating', maxActive, curActive)
        result.success = true
        result.newlyActivated = true
      } else {
        console.log(
          'XXX',
          powerUpItm.id,
          'hit max active',
          maxActive,
          curActive
        )
        result.msg =
          powerUpItm.id +
          ' ' +
          +'hit max active' +
          ' ' +
          maxActive +
          ' ' +
          curActive
      }
    } else {
      // item state invalid
      console.log(
        'XXX',
        powerUpItm.id,
        "invalid state. must be 'available'",
        itm.status
      )
      result.msg =
        powerUpItm.id +
        ' ' +
        +"invalid state. must be 'available'" +
        ' ' +
        itm.status
    }

    // THROW ERROR?
    return result
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  static activateItem(
    powerUpItm: serverStateSpec.PowerUpsItemPoolState,
    itm: serverStateSpec.PowerUpItemState,
    now: number
  ) {
    itm.activateTime = now
    itm.usesLeft--
    itm.serverTime = now

    const powerUpDef = PowerUpCatalog.get(powerUpItm.id)

    if (powerUpDef.duration >= 0) itm.expireTime = now + powerUpDef.duration

    itm.status = 'activated'
  }

  static updateStatuses(
    powerUpItm: serverStateSpec.PowerUpsItemPoolState,
    now: number
  ): serverStateSpec.PowerUpsStatusUpdateResult {
    // const now = Date.now(); //FIXME need game clock!!!

    // const newActivatedList:serverStateSpec.PowerUpItemState[] = []

    let hasChanges = false
    const results = new serverStateSpec.PowerUpsStatusUpdateResult()
    results.id = powerUpItm.id

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!powerUpItm || !powerUpItm.items) return results

    const powerUpDef = PowerUpCatalog.get(powerUpItm.id)

    const maxActive = powerUpDef.stackableAmount
    let curActive = PowerUpItemUtils.getActiveCnt(powerUpItm)
    powerUpItm.items.forEach((p: serverStateSpec.PowerUpItemState) => {
      // for(const p of this.activated){
      if (powerUpDef.autoActivate && p.status === 'available') {
        // } && ( curActive < maxActive )){
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (PowerUpItemUtils.useThis(powerUpItm, p, now)) {
          hasChanges = true
          results.activated.push(p)
          curActive++
        } else {
          console.log(
            'XXX___',
            powerUpItm.id,
            'hit max active',
            maxActive,
            curActive
          )
        }
      }
      if (p.status === 'activated') {
        const expiredDuration =
          p.expireTime !== undefined &&
          powerUpDef.duration > -1 &&
          p.expireTime <= now
        const expiredUses =
          powerUpDef.usePerActivate > 1 &&
          p.usesLeft !== undefined &&
          p.usesLeft <= 0

        console.log(
          'updateStatuses',
          'expire.check ',
          p.id,
          'expiredDuration',
          expiredDuration,
          'expiredUses',
          expiredUses,
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          p.expireTime ? p.expireTime - now : -1,
          'p.expireTime',
          p.expireTime,
          'now',
          now
        )

        if (expiredDuration || expiredUses) {
          console.log(
            'expiring',
            p.id,
            p.status,
            p.activateTime,
            p.expireTime,
            powerUpDef.duration,
            'p.usesLeft',
            p.usesLeft
          )
          // expired
          hasChanges = true
          p.status = 'used'
          p.serverTime = now
          results.expired.push(p)
        }
      } else {
        // newActivatedList.push(p)
      }
      // }
    })

    if (hasChanges) {
      // replace with new active list if changed
      // do a diff so its cleaner?
      // loop over and remove if in expire list
      // this.activated = newActivatedList
      // add to expired
      /* for(const p of results.expired){
                //this.activated.splice()
                this.expired.push(p)
            } */
      powerUpItm.serverTime = now
    }

    return results
  }

  static getStatusCnt(
    powerUpItm: serverStateSpec.PowerUpsItemPoolState,
    status: serverStateSpec.PowerUpItemStateStatus
  ): number {
    let canUse = 0
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!powerUpItm || !powerUpItm.items) return canUse

    powerUpItm.items.forEach((p: serverStateSpec.PowerUpItemState) => {
      if (p.status === status) {
        canUse++
      }
    })

    return canUse
  }

  static getFirstOfStatus(
    powerUpItm: serverStateSpec.PowerUpsItemPoolState,
    status: serverStateSpec.PowerUpItemStateStatus
  ): serverStateSpec.PowerUpItemState | undefined {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!powerUpItm || !powerUpItm.items) return undefined

    for (let x = 0; x < powerUpItm.items.length; x++) {
      const itm = powerUpItm.items[x]
      if (itm.status === status) {
        return itm
      }
    }

    // Retornar undefined si no se encuentra un ítem con el estado solicitado
    return undefined
  }

  static getAvailableCnt(
    powerUpItm: serverStateSpec.PowerUpsItemPoolState
  ): number {
    return PowerUpItemUtils.getStatusCnt(powerUpItm, 'available')
  }

  static getActiveCnt(
    powerUpItm: serverStateSpec.PowerUpsItemPoolState
  ): number {
    return PowerUpItemUtils.getStatusCnt(powerUpItm, 'activated')
  }

  static getUsedCnt(powerUpItm: serverStateSpec.PowerUpsItemPoolState): number {
    return PowerUpItemUtils.getStatusCnt(powerUpItm, 'used')
  }

  static getFirstActive(
    powerUpItm: serverStateSpec.PowerUpsItemPoolState
  ): serverStateSpec.PowerUpItemState | undefined {
    return PowerUpItemUtils.getFirstOfStatus(powerUpItm, 'activated')
  }
}

export abstract class PowerUpItemBase
  implements serverStateSpec.PowerUpsItemPoolState
{
  abstract id: serverStateSpec.PowerUpId
  abstract items: serverStateSpec.PowerUpItemState[]
  abstract serverTime: number

  hasActivated(): PowerUpItemUtils {
    return PowerUpItemUtils.hasActivated(this)
  }

  use(now: number): serverStateSpec.PowerUpItemUseResult | undefined {
    return PowerUpItemUtils.use(this, now)
  }

  useThis(
    itm: serverStateSpec.PowerUpItemState,
    now: number
  ): serverStateSpec.PowerUpItemUseResult {
    return PowerUpItemUtils.useThis(this, itm, now)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  activateItem(itm: serverStateSpec.PowerUpItemState, now: number) {
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    return PowerUpItemUtils.activateItem(this, itm, now)
  }

  updateStatuses(now: number): PowerUpItemUtils {
    return PowerUpItemUtils.updateStatuses(this, now)
  }

  getAvailableCnt(): PowerUpItemUtils {
    return PowerUpItemUtils.getAvailableCnt(this)
  }

  getActiveCnt(): PowerUpItemUtils {
    return PowerUpItemUtils.getActiveCnt(this)
  }

  getUsedCnt(): PowerUpItemUtils {
    return PowerUpItemUtils.getUsedCnt(this)
  }
}

export abstract class PowerUpManagerBase {
  abstract powerUps: Map<string, serverStateSpec.PowerUpsItemPoolState>
  // abstract getPowerUpPoolMap():Map<string,serverStateSpec.PowerUpsItemPoolState>
  // abstract getPowerUpPoolMap():Map<string,serverStateSpec.PowerUpsItemPoolState>
  // getPowerUp:(id:serverStateSpec.PowerUpId)=>serverStateSpec.PowerUpsItemPoolState
  abstract createFromPowerUpGameSettingItm(
    setting: serverStateSpec.PowerUpsGameSettingsItm
  ): serverStateSpec.PowerUpsItemPoolState
  // getActivePowerUps:()=>serverStateSpec.PowerUpsItemPoolState[]

  reset(): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this.powerUps) this.powerUps.clear()
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getPowerUpPoolMap() {
    return this.powerUps
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getPowerUp(id: serverStateSpec.PowerUpId) {
    return this.powerUps.get(id)
  }

  getActivePowerUpsAsList(): serverStateSpec.PowerUpsItemPoolState[] {
    const list: serverStateSpec.PowerUpsItemPoolState[] = []

    const powerups = this.getPowerUpPoolMap()

    for (const p of powerups.values()) {
      if (PowerUpItemUtils.hasActivated(p)) {
        list.push(p)
      }
    }

    return list
  }

  updateStatuses(
    now: number
  ): Map<
    serverStateSpec.PowerUpId,
    serverStateSpec.PowerUpsStatusUpdateResult
  > {
    const results = new Map<
      serverStateSpec.PowerUpId,
      serverStateSpec.PowerUpsStatusUpdateResult
    >()

    const powerups = this.getPowerUpPoolMap()

    powerups.forEach(
      (p: serverStateSpec.PowerUpsItemPoolState, key: string) => {
        const r = PowerUpItemUtils.updateStatuses(p, now)
        // log("updateStatuses","p",p.id,r)
        results.set(p.id, r)
      }
    )
    // log("updateStatuses","results",JSON.stringify(results),results.size)

    return results
  }

  getActivePowerUpsIdsAsList(): serverStateSpec.PowerUpId[] {
    const list: serverStateSpec.PowerUpId[] = []

    const powerups = this.getPowerUpPoolMap()

    for (const p of powerups.values()) {
      if (PowerUpItemUtils.hasActivated(p)) {
        list.push(p.id)
      }
    }

    return list
  }

  getUsedPowerUpsIdsAsList(): serverStateSpec.PowerUpId[] {
    const list: serverStateSpec.PowerUpId[] = []

    const powerups = this.getPowerUpPoolMap()

    for (const p of powerups.values()) {
      if (PowerUpItemUtils.hasUsed(p)) {
        list.push(p.id)
      }
    }

    return list
  }

  getAvialablePowerUpsIdsAsList(): serverStateSpec.PowerUpId[] {
    const list: serverStateSpec.PowerUpId[] = []

    const powerups = this.getPowerUpPoolMap()

    for (const p of powerups.values()) {
      if (PowerUpItemUtils.hasAvialable(p)) {
        list.push(p.id)
      }
    }

    return list
  }
  /*
    setActivePowerUps(inventory:serverStateSpec.PowerUpsGameSettingsItm[]){
        const inventoryMap:Record<string,serverStateSpec.PowerUpsGameSettingsItm> = {}
        for(const p of inventory){
            inventoryMap[p.id] = p
            //use factory pattern
            this.powerUpMap[p.id] = this.createFromPowerUpGameSettingItm(p)
        }
    } */

  getPowerUpAvailableCnt(id: serverStateSpec.PowerUpId): number {
    const powerUpId: serverStateSpec.PowerUpId = id
    const powerUpInv = this.getPowerUp(powerUpId)

    let canUse = 0
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (powerUpInv) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const powerUpDef = PowerUpCatalog.get(powerUpId)
      const activatedMap = this.getPowerUp(powerUpId)
      // Manejar el valor undefined retornando 0 en su lugar
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      canUse =
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        activatedMap &&
        PowerUpItemUtils.getAvailableCnt(activatedMap) !== undefined
          ? PowerUpItemUtils.getAvailableCnt(activatedMap)
          : 0
    }

    return canUse
  }

  usePowerUp(
    id: serverStateSpec.PowerUpId,
    now: number
  ): serverStateSpec.PowerUpItemUseResult {
    const powerUpId: serverStateSpec.PowerUpId = id
    const powerPool = this.getPowerUp(powerUpId)
    const powerUpDef = PowerUpCatalog.get(powerUpId)

    // Verificar si el powerPool está definido
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!powerPool) {
      return {
        success: false,
        id: id,
        msg: 'Power-up pool is undefined.',
        itm: {
          id: id,
          status: 'not-init',
          activateTime: now,
          expireTime: now + 1000 * 60, // Valor por defecto
          usesLeft: 0,
          serverTime: now
        },
        serverTime: now,
        newlyActivated: false
      }
    }

    const canUse = PowerUpItemUtils.getAvailableCnt(powerPool)
    const using = PowerUpItemUtils.getActiveCnt(powerPool)
    const active =
      using > 0 && powerUpDef.usePerActivate > 1
        ? PowerUpItemUtils.getFirstActive(powerPool)
        : undefined

    // Inicialización del valor usado
    let usedVal: serverStateSpec.PowerUpItemUseResult = {
      success: false,
      id: id,
      msg: 'No valid use result', // Mensaje por defecto
      itm: {
        id: id,
        status: 'not-init',
        activateTime: now,
        expireTime: now + 1000 * 60, // Valor por defecto
        usesLeft: 0,
        serverTime: now
      },
      serverTime: now,
      newlyActivated: false
    }

    // Lógica para usar el power-up
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (
      using === 1 &&
      powerUpDef.usePerActivate > 1 &&
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      active &&
      active.usesLeft > 0
    ) {
      const result = PowerUpItemUtils.use(powerPool, now)
      usedVal = result ?? usedVal // Asignar el resultado si no es undefined
    } else if (canUse > 0 && using < powerUpDef.stackableAmount) {
      const result = PowerUpItemUtils.use(powerPool, now)
      usedVal = result ?? usedVal // Asignar el resultado si no es undefined
    } else {
      // Manejo de errores
      if (canUse <= 0) {
        usedVal.msg = `No items in available state. Can use: ${canUse}, Currently using: ${using}.`
      } else if (using >= powerUpDef.stackableAmount) {
        usedVal.msg = `Reached max usage amount. Currently using: ${using}, Stackable amount: ${powerUpDef.stackableAmount}.`
      } else {
        usedVal.msg = `Invalid state for usage. Can use: ${canUse}, Currently using: ${using}.`
      }
    }

    return usedVal
  }

  getCoinMultiplier(): number {
    const powerUpId: serverStateSpec.PowerUpId =
      PowerUpIdEnum.MULTIPLIER_COIN_2X_TIME_ROUND
    const powerUpInv = this.getPowerUp(powerUpId)
    let multiplier = 1

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (powerUpInv && PowerUpItemUtils.hasActivated(powerUpInv)) {
      const powerUpDef = PowerUpCatalog.get(powerUpId)
      multiplier = powerUpDef.valueModifier.numVal
    }

    return multiplier
  }

  getHealthModifier(): number {
    // server
    const powerUpId: serverStateSpec.PowerUpId = PowerUpIdEnum.HEALTH_PLUS_50
    const powerUpInv = this.getPowerUp(powerUpId)
    let modifier = 0

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (powerUpInv && PowerUpItemUtils.hasActivated(powerUpInv)) {
      const powerUpDef = PowerUpCatalog.get(powerUpId)
      modifier = powerUpDef.valueModifier.numVal
    }

    return modifier
  }

  getProjectileDamageModifier(): number {
    // server but show front end too?
    const powerUpId: serverStateSpec.PowerUpId =
      PowerUpIdEnum.PROJECTILE_DAMANGE_PLUS_5_TIME_ROUND
    const powerUpInv = this.getPowerUp(powerUpId)
    let modifier = 0

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (powerUpInv && PowerUpItemUtils.hasActivated(powerUpInv)) {
      const powerUpDef = PowerUpCatalog.get(powerUpId)
      modifier = powerUpDef.valueModifier.numVal
    }

    return modifier
  }

  isInvincible(): boolean {
    const powerUpId: serverStateSpec.PowerUpId =
      PowerUpIdEnum.HEALTH_INVINCIBLE_15_SECONDS
    const powerUpInv = this.getPowerUp(powerUpId)
    let multiplier = false

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (powerUpInv && PowerUpItemUtils.hasActivated(powerUpInv)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const powerUpDef = PowerUpCatalog.get(powerUpId)
      multiplier = true // powerUpDef.valueModifier.numVal
    }

    return multiplier
  }

  getXpMultiplier(): number {
    const powerUpId: serverStateSpec.PowerUpId =
      PowerUpIdEnum.MULTIPLIER_XP_2X_TIME_ROUND
    const powerUpInv = this.getPowerUp(powerUpId)
    let multiplier = 1

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (powerUpInv && PowerUpItemUtils.hasActivated(powerUpInv)) {
      const powerUpDef = PowerUpCatalog.get(powerUpId)
      multiplier = powerUpDef.valueModifier.numVal
    }

    return multiplier
  }
}
export class PowerUpManager
  extends PowerUpManagerBase
  implements serverStateSpec.PowerUpManagerState
{
  powerUps!: Map<string, serverStateSpec.PowerUpsItemPoolState>

  createFromPowerUpGameSettingItm(
    setting: serverStateSpec.PowerUpsGameSettingsItm
  ): serverStateSpec.PowerUpsItemPoolState {
    throw new Error('Method not implemented.')
  }
}

export class PowerUpItemPoolMgr
  extends PowerUpItemBase
  implements serverStateSpec.PowerUpsItemPoolState
{
  id!: serverStateSpec.PowerUpId
  items!: serverStateSpec.PowerUpItemState[]
  serverTime!: number
}
