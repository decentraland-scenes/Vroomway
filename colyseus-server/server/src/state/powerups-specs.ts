import * as serverStateSpec from "./server-state-specs";
//powerup framework - opensourced

//so code can run client and colyseus, comment out colysesus side
function log(...args: any[]) {
  console.log(...args);
}

export enum PowerUpIdEnum {
  HEALTH_PLUS_50 = "health.plus.50",
  HEALTH_INVINCIBLE_15_SECONDS = "health.invincible.time.15s",
  PROJECTILE_DAMANGE_PLUS_5_TIME_ROUND = "projectile.damage.plus.5.time.round",
  TRAP_PROJECTILE_TIME_ROUND = "trap.projectile.time.round",
  //TRAP_DEPLOYER_TIME_ROUND
  MULTIPLIER_COIN_2X_TIME_ROUND = "multiplier.coins.2x.time.round",
  MULTIPLIER_XP_2X_TIME_ROUND = "multiplier.xp.2x.time.round",
}

export class PowerUpCatalog {
  //static MULTIPLIER_COIN_2X_TIME_ROUND:PowerUpsDefInst=
  //static MULTIPLIER_XP_2X_TIME_ROUND:PowerUpsDefInst=
  //static HEALTH_PLUS_50:PowerUpsDefInst=
  //static HEALTH_INVINCIBLE_15_SECONDS:PowerUpsDefInst=

  //static TRAP_DEPLOYER_TIME_ROUND:PowerUpsDefInst=

  static catalog: Record<string, serverStateSpec.PowerUpsDefInst> = {};

  static {
    const list: serverStateSpec.PowerUpsDefInst[] = [
      {
        id: PowerUpIdEnum.MULTIPLIER_COIN_2X_TIME_ROUND,
        classType: "multiplier",
        name: "Double Coins",
        desc: "Gain 2x coins while active.",
        cooldown: -1,
        duration: -1,
        autoActivate: false,
        stackableAmount: 1,
        usageType: "consumable",
        valueModifier: {
          //type:'number',
          numVal: 2,
        },
        validFor: {
          mode: undefined,
          level: ["solosprint"], //add 'circuit', when coins added
        },
        cost: [{ type: "coins", id: "coin", amount: 3500 }],
      },
      {
        id: PowerUpIdEnum.MULTIPLIER_XP_2X_TIME_ROUND,
        classType: "multiplier",
        name: "Double EXP",
        desc: "Gain 2x XP while active.",
        cooldown: -1,
        duration: -1,
        autoActivate: false,
        stackableAmount: 1,
        usageType: "consumable",
        cost: [{ type: "coins", id: "coin", amount: 3500 }],
        valueModifier: {
          //type:'number',
          numVal: 2,
        },
      },
      {
        id: PowerUpIdEnum.HEALTH_PLUS_50,
        classType: "health",
        name: "Power Repair",
        desc: "Adds 50 points to health.",
        cooldown: -1,
        duration: -1,
        autoActivate: false,
        stackableAmount: 1,
        usageType: "consumable",
        cost: [{ type: "coins", id: "coin", amount: 5000 }],
        valueModifier: {
          //type:'number',
          numVal: 50,
        },
        validFor: {
          mode: undefined,
          level: ["derby"], //'circuit', add when circuits have health
        },
      },
      {
        id: PowerUpIdEnum.HEALTH_INVINCIBLE_15_SECONDS,
        classType: "health",
        name: "Burnt Hotdog Water",
        desc: "Invincible for 15 seconds. Avoid traps and projectiles.",
        cooldown: 3000,
        duration: 15000,
        autoActivate: false,
        stackableAmount: 1,
        usageType: "consumable",
        cost: [{ type: "coins", id: "coin", amount: 7500 }],
        valueModifier: {
          //type:'number',
          numVal: 999999999,
        },
        validFor: {
          mode: undefined,
          level: ["circuit", "derby"],
        },
      },
      {
        id: PowerUpIdEnum.TRAP_PROJECTILE_TIME_ROUND,
        classType: "projectile",
        name: "Trap Launcher",
        desc: "Deploys trap behind you.",
        cooldown: 3000,
        duration: -1,
        autoActivate: false,
        stackableAmount: 1,
        usageType: "consumable",
        cost: [{ type: "coins", id: "coin", amount: 7500 }],
        valueModifier: {
          //type:'number',
          numVal: 1,
        },
        validFor: {
          mode: undefined,
          level: ["circuit"],
        },
      },
      {
        id: PowerUpIdEnum.PROJECTILE_DAMANGE_PLUS_5_TIME_ROUND,
        classType: "multiplier",
        name: "Power Damage",
        desc: "Deal extra 5 damage with projectiles.",
        cooldown: -1,
        duration: -1,
        autoActivate: false,
        stackableAmount: 1,
        usageType: "consumable",
        cost: [{ type: "coins", id: "coin", amount: 5000 }],
        valueModifier: {
          //type:'number',
          numVal: 5,
        },
        validFor: {
          mode: undefined,
          level: ["derby"], //'circuit', add when circuits have health
        },
      },
    ];
    for (const p of list) {
      PowerUpCatalog.catalog[p.id] = p;
    }
  }

  static get(id: serverStateSpec.PowerUpId) {
    return PowerUpCatalog.catalog[id];
  }

  /*static getValidFor(filter:{mode?:serverStateSpec.PowerUpLevelModeType,level?:serverStateSpec.PowerUpLevelType}){
    for(const p in PowerUpCatalog.catalog){
      const pup = PowerUpCatalog.catalog[p]
      const _valid = PowerUpCatalog.isValidFor(pup,filter)

    }
  }*/
  static isValidFor(
    itm: serverStateSpec.PowerUpsDefInst,
    filter: {
      mode?: serverStateSpec.PowerUpLevelModeType;
      level?: serverStateSpec.PowerUpLevelType;
    },
  ) {
    log("isValidFor", "ENTRY", [itm.id, filter]);

    let valid = true;
    if (filter.mode !== undefined) {
      if (itm.validFor && itm.validFor.mode) {
        let matched = false;
        for (const p of itm.validFor.mode) {
          if (p === filter.mode) {
            matched = true;
            break;
          }
        }
        if (!matched) {
          valid = false;
        }
      } else {
        //undefined means all
      }
    }
    if (filter.level !== undefined) {
      if (itm.validFor && itm.validFor.level) {
        let matched = false;
        for (const p of itm.validFor.level) {
          if (p === filter.level) {
            matched = true;
            break;
          }
        }
        if (!matched) {
          valid = false;
        }
      } else {
        //undefined means all
      }
    }

    log("isValidFor", "RETURN", valid);
    return valid;
  }
}
/*
//use this for state!
export class PowerUpsItemPoolInst implements serverStateSpec.PowerUpsItemPool{
    id:serverStateSpec.PowerUpId
    available: serverStateSpec.PowerUpsActivatedItem[];//allocated
    activated: serverStateSpec.PowerUpsActivatedItem[];
    expired: serverStateSpec.PowerUpsActivatedItem[];

    //TODO 
    constructor(invItem:serverStateSpec.PowerUpsGameSettingsItm){
        //create n for 
    }
    
    hasActivated(){
        //TODO scan to check if expired?
        return this.available && this.available.length > 0
    }
    use(qty:number){
        const usedVal = this.available.splice(0,1)[0]
        this.activated.push(usedVal)

        return usedVal
    }
    
    updateActive(){
        const now = Date.now()
        const toExpire:serverStateSpec.PowerUpsActivatedItem[] = []
        const newActivatedList:serverStateSpec.PowerUpsActivatedItem[] = []
        for(const p of this.activated){
            if(p.expireTime > -1 && p.expireTime < now){
                //expired
                toExpire.push(p)
            }else{
                newActivatedList.push(p)
            }            
        }
        this.activated = newActivatedList

        //add to expired
        for(const p of toExpire){
            //this.activated.splice()
            this.expired.push(p)
        }
    }

    getAvailableCnt():number{
        let canUse = 0;
        if(this.available){
            canUse = this.available.length
        }

        return canUse
    }
}
//use this for state!
*/

export class PowerUpItemUtils {
  static hasActivated(powerUpItm: serverStateSpec.PowerUpsItemPoolState) {
    for (let x = 0; x < powerUpItm.items.length; x++) {
      const itm = powerUpItm.items[x];
      if (itm.status == "activated") {
        return true;
      }
    }
    return false;
  }
  static hasUsed(powerUpItm: serverStateSpec.PowerUpsItemPoolState) {
    for (let x = 0; x < powerUpItm.items.length; x++) {
      const itm = powerUpItm.items[x];
      if (itm.status == "used") {
        return true;
      }
    }
    return false;
  }
  /*static hasActivatedId(id:PowerUpIdEnum,powerUpItm: serverStateSpec.PowerUpsItemPoolState) {
    //TODO as some point will be able to look up
    //powerUpItm.cached.activatedCountRecord for faster lookup
    for (let x = 0; x < powerUpItm.items.length; x++) {
      const itm = powerUpItm.items[x];
      if (itm.id === id && itm.status == "activated") {
        return true;
      }
    }
    return false;
  }*/
  static hasAvialable(powerUpItm: serverStateSpec.PowerUpsItemPoolState) {
    for (let x = 0; x < powerUpItm.items.length; x++) {
      const itm = powerUpItm.items[x];
      if (itm.status == "available") {
        return true;
      }
    }
    return false;
  }

  static use(
    powerUpItm: serverStateSpec.PowerUpsItemPoolState,
    now: number,
  ): serverStateSpec.PowerUpItemUseResult {
    //const usedVal = this.available.splice(0,1)[0]
    // this.activated.push(usedVal)
    //const now = Date.now();
    // const powerUpDef = PowerUpCatalog.get( this.id )
    for (let x = 0; x < powerUpItm.items.length; x++) {
      const itm = powerUpItm.items[x];
      log("use.try", itm.id, itm.status);
      if (itm.status == "available") {
        const useResult = PowerUpItemUtils.useThis(powerUpItm, itm, now);
        return useResult;
      }
    }

    //THROW ERROR?
    return undefined;
  }
  static useThis(
    powerUpItm: serverStateSpec.PowerUpsItemPoolState,
    itm: serverStateSpec.PowerUpItemState,
    now: number,
  ): serverStateSpec.PowerUpItemUseResult {
    //const usedVal = this.available.splice(0,1)[0]
    // this.activated.push(usedVal)
    const powerUpDef = PowerUpCatalog.get(powerUpItm.id);
    const maxActive = powerUpDef.stackableAmount;
    let curActive = PowerUpItemUtils.getActiveCnt(powerUpItm); //FIXME this is a loop count :( need way to cache
    // const powerUpDef = PowerUpCatalog.get( this.id )
    const result: serverStateSpec.PowerUpItemUseResult = {
      success: false,
      id: itm.id,
      msg: "tbd",
      itm: itm,
      serverTime: now,
    };
    if (itm.status == "available") {
      if (curActive < maxActive) {
        PowerUpItemUtils.activateItem(powerUpItm, itm, now);
        log("XXX", powerUpItm.id, "activating", maxActive, curActive);
        result.success = true;
      } else {
        log("XXX", powerUpItm.id, "hit max active", maxActive, curActive);
        result.msg =
          powerUpItm.id +
          " " +
          +"hit max active" +
          " " +
          maxActive +
          " " +
          curActive;
      }
    } else {
      //item state invalid
      log(
        "XXX",
        powerUpItm.id,
        "invalid state. must be 'available'",
        itm.status,
      );
      result.msg =
        powerUpItm.id +
        " " +
        +"invalid state. must be 'available'" +
        " " +
        itm.status;
    }

    //THROW ERROR?
    return result;
  }
  static activateItem(
    powerUpItm: serverStateSpec.PowerUpsItemPoolState,
    itm: serverStateSpec.PowerUpItemState,
    now: number,
  ) {
    itm.activateTime = now;

    const powerUpDef = PowerUpCatalog.get(powerUpItm.id);

    if (powerUpDef.duration >= 0) itm.expireTime = now + powerUpDef.duration;

    itm.status = "activated";
  }

  static updateStatuses(
    powerUpItm: serverStateSpec.PowerUpsItemPoolState,
    now: number,
  ): serverStateSpec.PowerUpsStatusUpdateResult {
    //const now = Date.now(); //FIXME need game clock!!!

    //const newActivatedList:serverStateSpec.PowerUpItemState[] = []

    let hasChanges = false;
    const results = new serverStateSpec.PowerUpsStatusUpdateResult();
    results.id = powerUpItm.id;

    if (!powerUpItm || !powerUpItm.items) return results;

    const powerUpDef = PowerUpCatalog.get(powerUpItm.id);

    const maxActive = powerUpDef.stackableAmount;
    let curActive = PowerUpItemUtils.getActiveCnt(powerUpItm);
    powerUpItm.items.forEach((p: serverStateSpec.PowerUpItemState) => {
      //for(const p of this.activated){
      if (powerUpDef.autoActivate && p.status === "available") {
        //} && ( curActive < maxActive )){
        if (PowerUpItemUtils.useThis(powerUpItm, p, now)) {
          hasChanges = true;
          results.activated.push(p);
          curActive++;
        } else {
          log("XXX___", powerUpItm.id, "hit max active", maxActive, curActive);
        }
      }
      if (
        p.status === "activated" &&
        p.expireTime !== undefined &&
        powerUpDef.duration > -1 &&
        p.expireTime <= now
      ) {
        log(
          "expiring",
          p.id,
          p.status,
          p.activateTime,
          p.expireTime,
          powerUpDef.duration,
        );
        //expired
        hasChanges = true;
        p.status = "used";
        results.expired.push(p);
      } else {
        //newActivatedList.push(p)
      }
      //}
    });

    if (hasChanges) {
      //replace with new active list if changed
      //do a diff so its cleaner?
      //loop over and remove if in expire list
      //this.activated = newActivatedList
      //add to expired
      /*for(const p of results.expired){
                //this.activated.splice()
                this.expired.push(p)
            }*/
    }

    return results;
  }

  static getStatusCnt(
    powerUpItm: serverStateSpec.PowerUpsItemPoolState,
    status: serverStateSpec.PowerUpItemStateStatus,
  ): number {
    let canUse = 0;
    if (!powerUpItm || !powerUpItm.items) return canUse;

    powerUpItm.items.forEach((p: serverStateSpec.PowerUpItemState) => {
      if (p.status === status) {
        canUse++;
      }
    });

    return canUse;
  }

  static getAvailableCnt(
    powerUpItm: serverStateSpec.PowerUpsItemPoolState,
  ): number {
    return PowerUpItemUtils.getStatusCnt(powerUpItm, "available");
  }
  static getActiveCnt(
    powerUpItm: serverStateSpec.PowerUpsItemPoolState,
  ): number {
    return PowerUpItemUtils.getStatusCnt(powerUpItm, "activated");
  }
  static getUsedCnt(powerUpItm: serverStateSpec.PowerUpsItemPoolState): number {
    return PowerUpItemUtils.getStatusCnt(powerUpItm, "used");
  }
}
export abstract class PowerUpItemBase
  implements serverStateSpec.PowerUpsItemPoolState
{
  abstract id: serverStateSpec.PowerUpId;
  abstract items: serverStateSpec.PowerUpItemState[];
  hasActivated(): boolean {
    return PowerUpItemUtils.hasActivated(this);
  }
  use(now: number): serverStateSpec.PowerUpItemUseResult {
    return PowerUpItemUtils.use(this, now);
  }
  useThis(
    itm: serverStateSpec.PowerUpItemState,
    now: number,
  ): serverStateSpec.PowerUpItemUseResult {
    return PowerUpItemUtils.useThis(this, itm, now);
  }
  activateItem(itm: serverStateSpec.PowerUpItemState, now: number) {
    return PowerUpItemUtils.activateItem(this, itm, now);
  }

  updateStatuses(now: number): any {
    return PowerUpItemUtils.updateStatuses(this, now);
  }

  getAvailableCnt(): number {
    return PowerUpItemUtils.getAvailableCnt(this);
  }
  getActiveCnt(): number {
    return PowerUpItemUtils.getActiveCnt(this);
  }
  getUsedCnt() {
    return PowerUpItemUtils.getUsedCnt(this);
  }
}
export abstract class PowerUpManagerBase {
  abstract powerUps: Map<string, serverStateSpec.PowerUpsItemPoolState>;
  //abstract getPowerUpPoolMap():Map<string,serverStateSpec.PowerUpsItemPoolState>
  //abstract getPowerUpPoolMap():Map<string,serverStateSpec.PowerUpsItemPoolState>
  //getPowerUp:(id:serverStateSpec.PowerUpId)=>serverStateSpec.PowerUpsItemPoolState
  abstract createFromPowerUpGameSettingItm(
    setting: serverStateSpec.PowerUpsGameSettingsItm,
  ): serverStateSpec.PowerUpsItemPoolState;
  //getActivePowerUps:()=>serverStateSpec.PowerUpsItemPoolState[]

  reset() {
    if (this.powerUps) this.powerUps.clear();
  }

  getPowerUpPoolMap() {
    return this.powerUps;
  }

  getPowerUp(id: serverStateSpec.PowerUpId) {
    return this.powerUps.get(id);
  }

  getActivePowerUpsAsList(): serverStateSpec.PowerUpsItemPoolState[] {
    const list: serverStateSpec.PowerUpsItemPoolState[] = [];

    const powerups = this.getPowerUpPoolMap();

    for (const p of powerups.values()) {
      if (PowerUpItemUtils.hasActivated(p)) {
        list.push(p);
      }
    }

    return list;
  }

  updateStatuses(
    now: number,
  ): Map<
    serverStateSpec.PowerUpId,
    serverStateSpec.PowerUpsStatusUpdateResult
  > {
    const results: Map<
      serverStateSpec.PowerUpId,
      serverStateSpec.PowerUpsStatusUpdateResult
    > = new Map();

    const powerups = this.getPowerUpPoolMap();

    powerups.forEach(
      (p: serverStateSpec.PowerUpsItemPoolState, key: string) => {
        const r = PowerUpItemUtils.updateStatuses(p, now);
        //log("updateStatuses","p",p.id,r)
        results.set(p.id, r);
      },
    );
    //log("updateStatuses","results",JSON.stringify(results),results.size)

    return results;
  }

  getActivePowerUpsIdsAsList(): serverStateSpec.PowerUpId[] {
    const list: serverStateSpec.PowerUpId[] = [];

    const powerups = this.getPowerUpPoolMap();

    for (const p of powerups.values()) {
      if (PowerUpItemUtils.hasActivated(p)) {
        list.push(p.id);
      }
    }

    return list;
  }
  getUsedPowerUpsIdsAsList(): serverStateSpec.PowerUpId[] {
    const list: serverStateSpec.PowerUpId[] = [];

    const powerups = this.getPowerUpPoolMap();

    for (const p of powerups.values()) {
      if (PowerUpItemUtils.hasUsed(p)) {
        list.push(p.id);
      }
    }

    return list;
  }
  getAvialablePowerUpsIdsAsList(): serverStateSpec.PowerUpId[] {
    const list: serverStateSpec.PowerUpId[] = [];

    const powerups = this.getPowerUpPoolMap();

    for (const p of powerups.values()) {
      if (PowerUpItemUtils.hasAvialable(p)) {
        list.push(p.id);
      }
    }

    return list;
  }
  /*
    setActivePowerUps(inventory:serverStateSpec.PowerUpsGameSettingsItm[]){
        const inventoryMap:Record<string,serverStateSpec.PowerUpsGameSettingsItm> = {}
        for(const p of inventory){
            inventoryMap[p.id] = p
            //use factory pattern
            this.powerUpMap[p.id] = this.createFromPowerUpGameSettingItm(p)
        }
    }*/

  getPowerUpAvailableCnt(id: serverStateSpec.PowerUpId): number {
    const powerUpId: serverStateSpec.PowerUpId = id;
    const powerUpInv = this.getPowerUp(powerUpId);

    let canUse = 0;
    if (powerUpInv) {
      const powerUpDef = PowerUpCatalog.get(powerUpId);
      const activatedMap = this.getPowerUp(powerUpId);
      canUse = activatedMap && PowerUpItemUtils.getAvailableCnt(activatedMap);
    }

    return canUse;
  }

  usePowerUp(
    id: serverStateSpec.PowerUpId,
    now: number,
  ): serverStateSpec.PowerUpItemUseResult {
    const powerUpId: serverStateSpec.PowerUpId = id;
    const powerPool = this.getPowerUp(powerUpId);
    const powerUpDef = PowerUpCatalog.get(powerUpId);

    let usedVal: serverStateSpec.PowerUpItemUseResult;
    let canUse = PowerUpItemUtils.getAvailableCnt(powerPool);
    let using = PowerUpItemUtils.getActiveCnt(powerPool);
    if (canUse > 0 && using < powerUpDef.stackableAmount) {
      usedVal = PowerUpItemUtils.use(powerPool, now);
    } else {
      if (canUse <= 0) {
        usedVal = {
          success: false,
          id: id,
          msg: "no items in avaiaible state canUse:" + canUse,
          itm: undefined,
          serverTime: now,
        };
      } else if (using > powerUpDef.stackableAmount) {
        usedVal = {
          success: false,
          id: id,
          msg:
            "reached max usage amount using:" +
            using +
            " vs stackableAmount:" +
            powerUpDef.stackableAmount,
          itm: undefined,
          serverTime: now,
        };
      } else {
        usedVal = {
          success: false,
          id: id,
          msg:
            ":shrug: canUse:" +
            canUse +
            ";using:" +
            using +
            "powerUpDef.stackableAmount:" +
            powerUpDef.stackableAmount,
          itm: undefined,
          serverTime: now,
        };
      }
    }

    return usedVal;
  }
  getCoinMultiplier() {
    const powerUpId: serverStateSpec.PowerUpId =
      PowerUpIdEnum.MULTIPLIER_COIN_2X_TIME_ROUND;
    const powerUpInv = this.getPowerUp(powerUpId);
    let multiplier = 1;

    if (powerUpInv && PowerUpItemUtils.hasActivated(powerUpInv)) {
      const powerUpDef = PowerUpCatalog.get(powerUpId);
      multiplier = powerUpDef.valueModifier.numVal;
    }

    return multiplier;
  }

  getHealthModifier() {
    //server
    const powerUpId: serverStateSpec.PowerUpId = PowerUpIdEnum.HEALTH_PLUS_50;
    const powerUpInv = this.getPowerUp(powerUpId);
    let modifier = 0;

    if (powerUpInv && PowerUpItemUtils.hasActivated(powerUpInv)) {
      const powerUpDef = PowerUpCatalog.get(powerUpId);
      modifier = powerUpDef.valueModifier.numVal;
    }

    return modifier;
  }

  getProjectileDamageModifier() {
    //server but show front end too?
    const powerUpId: serverStateSpec.PowerUpId =
      PowerUpIdEnum.PROJECTILE_DAMANGE_PLUS_5_TIME_ROUND;
    const powerUpInv = this.getPowerUp(powerUpId);
    let modifier = 0;

    if (powerUpInv && PowerUpItemUtils.hasActivated(powerUpInv)) {
      const powerUpDef = PowerUpCatalog.get(powerUpId);
      modifier = powerUpDef.valueModifier.numVal;
    }

    return modifier;
  }

  isInvincible() {
    const powerUpId: serverStateSpec.PowerUpId =
      PowerUpIdEnum.HEALTH_INVINCIBLE_15_SECONDS;
    const powerUpInv = this.getPowerUp(powerUpId);
    let multiplier = false;

    if (powerUpInv && PowerUpItemUtils.hasActivated(powerUpInv)) {
      const powerUpDef = PowerUpCatalog.get(powerUpId);
      multiplier = true; //powerUpDef.valueModifier.numVal
    }

    return multiplier;
  }
  getXpMultiplier() {
    const powerUpId: serverStateSpec.PowerUpId =
      PowerUpIdEnum.MULTIPLIER_XP_2X_TIME_ROUND;
    const powerUpInv = this.getPowerUp(powerUpId);
    let multiplier = 1;

    if (powerUpInv && PowerUpItemUtils.hasActivated(powerUpInv)) {
      const powerUpDef = PowerUpCatalog.get(powerUpId);
      multiplier = powerUpDef.valueModifier.numVal;
    }

    return multiplier;
  }
}
export class PowerUpManager
  extends PowerUpManagerBase
  implements serverStateSpec.PowerUpManagerState
{
  powerUps: Map<string, serverStateSpec.PowerUpsItemPoolState>; //dead to make interface happy = new Map()

  createFromPowerUpGameSettingItm(
    setting: serverStateSpec.PowerUpsGameSettingsItm,
  ): serverStateSpec.PowerUpsItemPoolState {
    throw new Error("Method not implemented.");
  }
}
export class PowerUpItemPoolMgr
  extends PowerUpItemBase
  implements serverStateSpec.PowerUpsItemPoolState
{
  id: serverStateSpec.PowerUpId;
  items: serverStateSpec.PowerUpItemState[];
}
