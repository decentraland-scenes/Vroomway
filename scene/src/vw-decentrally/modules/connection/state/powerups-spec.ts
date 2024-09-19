import type * as serverStateSpec from './server-state-spec'
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
