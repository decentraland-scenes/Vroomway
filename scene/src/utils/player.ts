import { getUserData } from '~system/UserIdentity'
import {
  ItemNameLeveling,
  ItemNameResource,
  ItemNameCargo,
  ItemNameToken
} from '../inventory/inventory-data'
import {
  InventoryManager,
  type InventoryEntry
} from '../inventory/inventory-manager'
import { LevelManager } from '../leveling/level-manager'
import {
  PLAYER_SCORE_NAMES,
  PlayerScoreData
} from '../player-scores/player-score-data'
import {
  PlayerScoreManager,
  type PlayerScoreEntry
} from '../player-scores/player-score-manager'
import { AccessoryManager } from '../vehicle/accessory-manager'
import { VehicleManager } from '../vehicle/vehicle-manager'
import { WILL, LAMBDA_URL } from './constants'
import { Color4 } from '@dcl/sdk/math'
import * as eth from 'eth-connect'
import { VehicleAttachmentManager } from '../vehicle/vehicle-attachment-manager'
import { type GameController } from '../game.controller'

/**
 * primary controller for player's details (leveling, inventory, power-up, etc)
 * this class also acts at the primary communicator to conduct server read/write
 */
export class PlayerStats {
  private readonly isDebugging = true

  // true if the system has encountered an error when attempting to fecth data
  hasFetchingError: boolean = false
  // current initialization state, locks write attempts to server until data has been fetched for the first time
  private isInitialized: boolean = false

  // processing flags
  serverClaimGeneral: boolean = false
  serverClaimItems: boolean = false
  serverClaimCourses: boolean = false
  // processing strings (small overhead opt)
  private serverStringWriteSend: string = ''
  private serverStringWriteDebug: string = ''
  private serverStringReadDebug: string = ''

  // user details
  private readonly userId: string = ''
  public get UserId(): string {
    return this.userId
  }

  private readonly userDisplayName: string = ''
  public get UserDisplayName(): string {
    return this.userDisplayName
  }

  public lastLogin: number = 0
  public lapsCompleted: number = 0
  // public pinkSlips: number;
  public elims: number = 0

  // inventory accessors
  //  TODO: inventory item management calls should be fully pulled way from this class and allow external classes to interact
  //      directly with the inventory management system
  //  level details (relegated to leveling manager, but does trace back to inventory manager values)
  // public exp: number = 0;
  public get exp(): number {
    return InventoryManager.Instance.GetItemCountByID(ItemNameLeveling.exp)
  }

  public set exp(value: number) {
    console.log('Leveling System: testing exp input value: ' + value)
    LevelManager.Instance.SetExperience(value, true)
  }

  // public lvl: number = 0;
  public get lvl(): number {
    return LevelManager.Instance.Level
  }

  //  resources   (relegated to inventory manager)
  // public coins: number = 0;
  public get coins(): number {
    return InventoryManager.Instance.GetItemCountByID(ItemNameResource.coins)
  }

  public set coins(value: number) {
    InventoryManager.Instance.SetItemCountByID(ItemNameResource.coins, value)
  }

  // public fuel: number = 0;
  public get fuel(): number {
    return InventoryManager.Instance.GetItemCountByID(ItemNameResource.fuel)
  }

  public set fuel(value: number) {
    /* console.log("testing fuel input value: " + value); */ InventoryManager.Instance.SetItemCountByID(
      ItemNameResource.fuel,
      value
    )
  }

  // public metal: number = 0;
  public get metal(): number {
    return InventoryManager.Instance.GetItemCountByID(ItemNameResource.metal)
  }

  public set metal(value: number) {
    InventoryManager.Instance.SetItemCountByID(ItemNameResource.metal, value)
  }

  // public rubber: number = 0;
  public get rubber(): number {
    return InventoryManager.Instance.GetItemCountByID(ItemNameResource.rubber)
  }

  public set rubber(value: number) {
    InventoryManager.Instance.SetItemCountByID(ItemNameResource.rubber, value)
  }

  // public glass: number = 0;
  public get glass(): number {
    return InventoryManager.Instance.GetItemCountByID(ItemNameResource.glass)
  }

  public set glass(value: number) {
    InventoryManager.Instance.SetItemCountByID(ItemNameResource.glass, value)
  }

  // public propulsion: number = 0;
  public get propulsion(): number {
    return InventoryManager.Instance.GetItemCountByID(
      ItemNameResource.propulsion
    )
  }

  public set propulsion(value: number) {
    InventoryManager.Instance.SetItemCountByID(
      ItemNameResource.propulsion,
      value
    )
  }

  // public wires: number = 0;
  public get wires(): number {
    return InventoryManager.Instance.GetItemCountByID(ItemNameResource.wires)
  }

  public set wires(value: number) {
    InventoryManager.Instance.SetItemCountByID(ItemNameResource.wires, value)
  }

  // public antimatter: number = 0;
  public get antimatter(): number {
    return InventoryManager.Instance.GetItemCountByID(
      ItemNameResource.antimatter
    )
  }

  public set antimatter(value: number) {
    InventoryManager.Instance.SetItemCountByID(
      ItemNameResource.antimatter,
      value
    )
  }

  // public cannisters: number = 0
  public get cannisters(): number {
    return InventoryManager.Instance.GetItemCountByID(
      ItemNameResource.cannisters
    )
  }

  public set cannisters(value: number) {
    InventoryManager.Instance.SetItemCountByID(
      ItemNameResource.cannisters,
      value
    )
  }

  // public circuitBoard: number = 0;
  public get circuitBoard(): number {
    return InventoryManager.Instance.GetItemCountByID(
      ItemNameResource.circuitBoard
    )
  }

  public set circuitBoard(value: number) {
    InventoryManager.Instance.SetItemCountByID(
      ItemNameResource.circuitBoard,
      value
    )
  }

  //  cargo
  // public smCargo: number = 0;
  public get smCargo(): number {
    return InventoryManager.Instance.GetItemCountByID(ItemNameCargo.smCargo)
  }

  public set smCargo(value: number) {
    InventoryManager.Instance.SetItemCountByID(ItemNameCargo.smCargo, value)
  }

  // public mdCargo: number = 0;
  public get mdCargo(): number {
    return InventoryManager.Instance.GetItemCountByID(ItemNameCargo.mdCargo)
  }

  public set mdCargo(value: number) {
    InventoryManager.Instance.SetItemCountByID(ItemNameCargo.mdCargo, value)
  }

  // public lgCargo: number = 0;
  public get lgCargo(): number {
    return InventoryManager.Instance.GetItemCountByID(ItemNameCargo.lgCargo)
  }

  public set lgCargo(value: number) {
    InventoryManager.Instance.SetItemCountByID(ItemNameCargo.lgCargo, value)
  }

  //  tokens
  public get token2(): number {
    return InventoryManager.Instance.GetItemCountByID(ItemNameToken.token2)
  }

  public set token2(value: number) {
    InventoryManager.Instance.SetItemCountByID(ItemNameToken.token2, value)
  }

  //  race
  // public soloSprintTime: number = 0;
  public get soloSprintTime(): number {
    return PlayerScoreManager.Instance.GetEntryByID(
      PLAYER_SCORE_NAMES.SPRINT_SOLO_TIME
    ).Value
  }

  public set soloSprintTime(value: number) {
    PlayerScoreManager.Instance.GetEntryByID(
      PLAYER_SCORE_NAMES.SPRINT_SOLO_TIME
    ).SetValue(value, true)
  }

  // public sprintCoinsCollected: number = 0; //tracks total value collected
  public get sprintCoinsCollected(): number {
    return PlayerScoreManager.Instance.GetEntryByID(
      PLAYER_SCORE_NAMES.SPRINT_SOLO_COUNT_COINS
    ).Value
  }

  public set sprintCoinsCollected(value: number) {
    PlayerScoreManager.Instance.GetEntryByID(
      PLAYER_SCORE_NAMES.SPRINT_SOLO_COUNT_COINS
    ).SetValue(value, false)
  }

  // public sprintCoinsQtyCollected: number = 0; //tracks total qty collected ignoring any bonus multipliers
  public get sprintCoinsQtyCollected(): number {
    return PlayerScoreManager.Instance.GetEntryByID(
      PLAYER_SCORE_NAMES.SPRINT_COUNT_QTY_COINS
    ).Value
  }

  public set sprintCoinsQtyCollected(value: number) {
    PlayerScoreManager.Instance.GetEntryByID(
      PLAYER_SCORE_NAMES.SPRINT_COUNT_QTY_COINS
    ).SetValue(value, false)
  }

  // public sprintCompTime: number = 0;
  // public get sprintCompTime(): number { return InventoryManager.Instance.GetItemCountByID(ItemNameRaceScore.sprintCompTime); }
  // public set sprintCompTime(value: number) { InventoryManager.Instance.SetItemCountByID(ItemNameRaceScore.sprintCompTime, value); }
  // public circuitTime: number = 0;
  public get circuitTime(): number {
    return PlayerScoreManager.Instance.GetEntryByID(
      PLAYER_SCORE_NAMES.CIRCUIT_TIME
    ).Value
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions, no-sequences
  public set circuitTime(value: number) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    PlayerScoreManager.Instance.GetEntryByID(
      PLAYER_SCORE_NAMES.CIRCUIT_TIME
      // eslint-disable-next-line no-sequences
    ).SetValue(value, true),
      true
  }

  // public circuitsCoinsCollected: number = 0;
  public get circuitsCoinsCollected(): number {
    return PlayerScoreManager.Instance.GetEntryByID(
      PLAYER_SCORE_NAMES.CIRCUIT_COUNT_COINS
    ).Value
  }

  public set circuitsCoinsCollected(value: number) {
    PlayerScoreManager.Instance.GetEntryByID(
      PLAYER_SCORE_NAMES.CIRCUIT_COUNT_COINS
    ).SetValue(value, false)
  }

  // public circuitCompTime: number = 0;
  public get circuitCompTime(): number {
    return PlayerScoreManager.Instance.GetEntryByID(
      PLAYER_SCORE_NAMES.CIRCUIT_COMP_TIME
    ).Value
  }

  public set circuitCompTime(value: number) {
    PlayerScoreManager.Instance.GetEntryByID(
      PLAYER_SCORE_NAMES.CIRCUIT_COMP_TIME
    ).SetValue(value, true)
  }

  // public compPoints: number = 0;
  public get compPoints(): number {
    return PlayerScoreManager.Instance.GetEntryByID(
      PLAYER_SCORE_NAMES.COMP_POINTS
    ).Value
  }

  public set compPoints(value: number) {
    PlayerScoreManager.Instance.GetEntryByID(
      PLAYER_SCORE_NAMES.COMP_POINTS
    ).SetValue(value, false)
  }

  // public dragRaceTime: number;
  public get dragRaceTime(): number {
    return PlayerScoreManager.Instance.GetEntryByID(
      PLAYER_SCORE_NAMES.DRAG_RACE_TIME
    ).Value
  }

  public set dragRaceTime(value: number) {
    PlayerScoreManager.Instance.GetEntryByID(
      PLAYER_SCORE_NAMES.DRAG_RACE_TIME
    ).SetValue(value, true)
  }

  //  item inventory
  // TODO: there is a TON of defs spread across the system that need to be clawed back, far too many things reach into this raw
  //  and many of the systems can be simplified (ex: too many things are checking for specific vehicles instead of vehicle traits)
  // public equippedVehicle: EquippedVehicle;
  public get equippedVehicle(): string {
    return VehicleManager.Instance.EquippedVehicle
  }

  public set equippedVehicle(value) {
    VehicleManager.Instance.ApplyVehicle(value)
  }

  // public equippedAccessory: EquippedAccessory;
  public get equippedAccessory(): string {
    return AccessoryManager.Instance.EquippedAccessory
  }

  public set equippedAccessory(value) {
    AccessoryManager.Instance.ApplyAccessory(value)
  }

  // TODO: get rid of these
  getExp(): number {
    return this.exp
  }

  getLvl(): number {
    return this.lvl
  }

  getCoins(): number {
    return this.coins
  }

  getFuel(): number {
    return this.fuel
  }

  getMetal(): number {
    return this.metal
  }

  getCannisters(): number {
    return this.cannisters
  }

  getAntimatter(): number {
    return this.antimatter
  }

  getSmCargo(): number {
    return this.smCargo
  }

  getMdCargo(): number {
    return this.mdCargo
  }

  getLgCargo(): number {
    return this.lgCargo
  }

  getCompPoints(): number {
    return this.compPoints
  }

  gameController: GameController

  constructor(gameController: GameController) {
    this.gameController = gameController
    // attempt to get player's data from server
    void this.fetchPlayerStats()
  }

  // resets player's stats to starting values
  resetStats(): void {
    this.exp = 0
    // this.lvl = 1;
    this.lapsCompleted = 0
    this.lastLogin = 0
    this.coins = 100
    this.fuel = 750
    this.metal = 0
    this.rubber = 0
    this.glass = 0
    this.propulsion = 0
    this.wires = 0
    this.antimatter = 0
    this.cannisters = 0
    this.circuitBoard = 0
    this.smCargo = 0
    this.mdCargo = 0
    this.lgCargo = 0
    this.soloSprintTime = -1
    this.compPoints = -1
    this.circuitTime = -1
    this.sprintCoinsCollected = -1
    this.sprintCoinsQtyCollected = -1
    this.circuitsCoinsCollected = -1
    this.elims = -1
    // this.pinkSlips = 0;
    this.equippedVehicle = ''
    this.equippedAccessory = ''
  }

  // TODO: remove this
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public getValueAdjuster() {
    return this
  }

  // redraws *entire* ui display
  // TODO: this should be changed to only update specific elements/even better to just automate updates when values change
  updateUI(): void {
    this.gameController.uiController.profile.updateExp()
    this.gameController.uiController.profile.updateLvl()
    this.gameController.uiController.profile.updateFuel()
    this.gameController.uiController.profile.updateCoins()
    this.gameController.uiController.profile.updateCompPoints()

    // debugging menu redraws
    //  inventory
    // DebugMenuInventory.Instance.UpdateResourceDisplay();
    //  leveling
    // DebuggingMenuLeveling.Instance.UpdateDisplay();
  }

  // get player data from server
  async fetchPlayerStats(): Promise<void> {
    try {
      // TODO: we only really need to do this call once, maybe add it to the constructor
      const userData = await getUserData({})
      if (userData == null) {
        console.error(
          'SERVER READ ERROR - could not get user data, likely trying to make call before scene is initialized'
        )
        return
      }

      // TODO: ensure user is logged in
      // this.writeDataToServer();
      // return;

      // check admin seed: Will's account
      if (userData.data?.userId === WILL) {
        // provie a large count of every resource
        //  process each type
        for (let i: number = 0; i < 4; i++) {
          // process each def within type
          for (
            let j: number = 0;
            j < InventoryManager.Instance.GetRegistryLengthOfType(i);
            j++
          ) {
            InventoryManager.Instance.SetItemCountByIndex(
              i,
              j.toString(),
              1000,
              true
            )
          }
        }
      }

      // create call
      // const urlCall = `${LAMBDA_URL}/stats?uuid=${userData.userId}`;
      // debugging: test account
      const urlCall = `${LAMBDA_URL}/stats?uuid=${userData.data?.userId}`
      // attempt call
      const urlResponse = await fetch(urlCall)
      if (urlResponse == null) {
        console.error(
          'SERVER READ ERROR - fetch did not retrieve any results from url=' +
            urlCall
        )
        return
      } else {
        if (this.isDebugging)
          console.log(
            'SERVER READ - fetch gathered resource file from url=' + urlCall
          )
      }

      // convert data
      const result = await urlResponse.json()
      if (result == null) {
        console.error(
          'SERVER READ ERROR - could not parse resource file as JSON readable,  got={' +
            result +
            '}: player may not be registered or there was an error with server communications'
        )

        // NOTE: ENABLE TO ALLOW NEW ACCOUNT POPULATION
        // populate player's starting data
        /* this.isInitialized = true;
                InventoryManager.Instance.SetItemCountByID(ItemNameResource.fuel, 500, true);
                InventoryManager.Instance.SetItemCountByID(ItemNameResource.coins, 500, true);
                //push changes to server
                this.writeDataToServer(); */
        // halt load attempt
        return
      } else {
        if (this.isDebugging)
          console.log(
            'SERVER READ - stats converted to JSON readable, stashing provided values...'
          )
      }

      // pull in values based on existing item defs
      this.serverStringReadDebug = 'SERVER READ - JSON inventory check:'
      // parse data
      //  session
      this.lastLogin = new Date().getTime()
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/dot-notation
      this.elims = result['elims'] || 0
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/dot-notation
      this.lapsCompleted = result['lapsCompleted'] || 0
      // this.pinkSlips = pinkSlips || 0;
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/dot-notation
      this.equippedVehicle = result['equippedVehicle'] || null
      if (this.isDebugging)
        this.serverStringReadDebug +=
          '\n\tequipped vehicle: ' + this.equippedVehicle
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/dot-notation
      this.equippedAccessory = result['equippedAccessory'] || null
      if (this.isDebugging)
        this.serverStringReadDebug +=
          '\n\tequipped accessory: ' + this.equippedAccessory

      // push data changes to level management system
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      LevelManager.Instance.Initialize(result.exp || 0, 0)

      // debug spool
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (this.isDebugging)
        this.serverStringReadDebug +=
          '\n\titem type=0, id=exp, count: ' + (Boolean(result.exp) || '0')
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (this.isDebugging)
        this.serverStringReadDebug +=
          '\n\titem type=0, id=lvl, count: ' + (Boolean(result.lvl) || '0')

      //  process each type (DO NOT PROCESS LEVELING ON READ-IN)
      for (let i: number = 1; i < InventoryManager.Instance.ItemTypes; i++) {
        // process each def within type
        for (
          let j: number = 0;
          j < InventoryManager.Instance.GetRegistryLengthOfType(i);
          j++
        ) {
          const entry: InventoryEntry = InventoryManager.Instance.GetEntry(
            i,
            j.toString()
          )
          console.log('item type=' + i + ', id=' + entry.ID)
          if (this.isDebugging)
            this.serverStringReadDebug +=
              '\n\titem type=' + i + ', id=' + entry.ID
          // only process value change IF a given entry for the def exists, do not set a default value
          /**/ if (entry.ID in result) {
            console.log('count: ' + result[entry.ID])
            if (this.isDebugging)
              this.serverStringReadDebug += ', count: ' + result[entry.ID]
            InventoryManager.Instance.SetItemCountByIndex(
              i,
              j.toString(),
              result[entry.ID],
              true
            )
          } else {
            if (this.isDebugging)
              this.serverStringReadDebug += ', no entry found'
          }
          // debugging inventory population
          // InventoryManager.Instance.SetItemCountByIndex(i, j.toString(), 1000, true);
        }
      }
      //  process each score
      for (let i: number = 0; i < PlayerScoreData.length; i++) {
        const entry: PlayerScoreEntry =
          PlayerScoreManager.Instance.GetEntryByPos(i)
        if (this.isDebugging)
          this.serverStringReadDebug +=
            '\n\tscore index=' + i + ', id=' + entry.ID
        // only process value change IF a given entry for the def exists, do not set a default value
        if (entry.ID in result) {
          if (this.isDebugging)
            this.serverStringReadDebug += ', value: ' + result[entry.ID]
          entry.SetValue(result[entry.ID], false)
        } else {
          if (this.isDebugging) this.serverStringReadDebug += ', no entry found'
        }
      }

      // load attachments inventory
      VehicleAttachmentManager.Instance.Deserialize(result)

      if (this.isDebugging) console.log(this.serverStringReadDebug)

      // should be able to remove this after ui callbacks are correctly delegated
      this.updateUI()

      this.isInitialized = true
    } catch (e) {
      // this.hasFetchingError = true;
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      console.error(
        'SERVER READ ERROR - database read attempt failed: try again later\n' +
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          e
      )
    }
  }

  // write player data to server
  async writeDataToServer(options?: {
    onFinish?: { updateUI: boolean }
  }): Promise<void> {
    // only allow write attempts after initialization is completed,
    //  after first successful load and data values have been populated
    // NOTE: with the current server implementation you can lose data b.c whoever set it up likely isnt even using a real
    //  database/is hard-setting values instead of actually spooling through inbound data and adjusting a table. this is
    //  obvious because we lose access to any stored data if it was not passed in the previous server write. if data becomes
    //  corrupt, you will need to toggle this off to send initialiation data to the server (loads will always fail when reading
    //  corrupt data so you will never be able to save).

    // ensure there were no previous errors when reading data from server
    if (this.hasFetchingError) {
      this.gameController.uiController.displayAnnouncement(
        'Error fetching data. Please reload the page.',
        Color4.Yellow(),
        6000
      )
      return
    }

    // ensure no processing is currently on-going
    if (this.serverClaimGeneral) {
      console.log(
        'SERVER WRITE - database write attempt already in progress...'
      )
      this.gameController.uiController.displayAnnouncement(
        'WARNING saving data. Save in progress already.',
        Color4.Yellow(),
        5
      )
      return
    }
    // claim write system
    this.serverClaimGeneral = true

    // do level up checking hot fix, long term seperate writes from ui updates
    // this.updateLvl();

    // packs ALL data
    const userId = await getUserData({})

    const lastLogin = this.lastLogin
    const elims = this.elims
    const equippedVehicle = this.equippedVehicle
    const equippedAccessory = this.equippedAccessory
    // const pinkSlips = valueHolder.pinkSlips;
    // removeing these, are in powerup endpoint

    // generate send string
    this.serverStringWriteSend =
      // NOTE: for whatever reason there MUST NOT be a space between the uuid/username or who whole system breaks
      `uuid=${userId.data?.userId}&username=${userId.data?.displayName}
            &lastLogin=${lastLogin}&elims=${elims}`

    // generate additional call spool for each stored item
    this.serverStringWriteDebug = 'SERVER WRITE - defining inventory save data:'
    //  process each item type
    for (let i: number = 0; i < InventoryManager.Instance.ItemTypes; i++) {
      // process each item def within type
      for (
        let j: number = 0;
        j < InventoryManager.Instance.GetRegistryLengthOfType(i);
        j++
      ) {
        const entry: InventoryEntry = InventoryManager.Instance.GetEntry(
          i,
          j.toString()
        )
        if (entry.Amount !== 0) {
          if (this.isDebugging)
            this.serverStringWriteDebug +=
              '\n\t item: type=' +
              i +
              ', id=' +
              entry.ID +
              ', count=' +
              entry.Amount +
              ', delta=' +
              entry.AmountDelta
          this.serverStringWriteSend +=
            '\n&' +
            entry.ID +
            '=' +
            InventoryManager.Instance.GetItemCountByIndex(i, j.toString(), true)
        } else {
          if (this.isDebugging)
            this.serverStringWriteDebug +=
              '\n\t (data culled) item: type=' +
              i +
              ', id=' +
              entry.ID +
              ', count=' +
              entry.Amount +
              ', delta=' +
              entry.AmountDelta
          // this.serverStringWriteSend += '\n&' + entry.ID + '=' + 10;    //testing call
        }
      }
    }
    //  process each score
    for (let i: number = 0; i < PlayerScoreData.length; i++) {
      const entry: PlayerScoreEntry =
        PlayerScoreManager.Instance.GetEntryByPos(i)
      // only process
      if (entry.Value !== -1) {
        if (this.isDebugging)
          this.serverStringWriteDebug +=
            '\n\t score: index=' +
            i +
            ', id=' +
            entry.ID +
            ', count=' +
            entry.Value
        this.serverStringWriteSend += '\n&' + entry.ID + '=' + entry.Value
      } else {
        if (this.isDebugging)
          this.serverStringWriteDebug +=
            '\n\t (data culled) score: index=' +
            i +
            ', id=' +
            entry.ID +
            ', count=' +
            entry.Value
      }
    } /**/

    if (this.isDebugging) console.log(this.serverStringWriteDebug)

    // race stats/equipment (this makes a bunch of whitespace atm b.c of bad implementation, so just keeping at the bottom to keep things readable)
    this.serverStringWriteSend += ` 
            ${
              equippedVehicle.length > 0
                ? `&equippedVehicle=${equippedVehicle}`
                : ''
            }
            ${
              equippedAccessory.length > 0
                ? `&equippedAccessory=${equippedAccessory}`
                : ''
            }`

    // save attachments inventory
    this.serverStringWriteSend += VehicleAttachmentManager.Instance.Serialize()

    console.log(
      'SERVER WRITE - save string completed, preparing to post:\n' +
        this.serverStringWriteSend
    )

    // convert data pre-post
    const data = eth.toHex(this.serverStringWriteSend)

    // Get the first four characters of the string
    const reversedStr = data.substring(0, data.length - 7)
    // Split the first four characters into an array of characters
    const arr = reversedStr.split('')
    // Reverse the order of the characters in the array
    arr.reverse()
    // Join the reversed characters back into a string
    const reversed = arr.join('')
    // Concatenate the reversed string with the rest of the original string
    const result = reversed.concat(data.substring(data.length - 7))
    try {
      await fetch(`${LAMBDA_URL}/update?data=${result}`)
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      console.error(
        'SERVER WRITE ERROR - database write attempt failed: try again later\n' +
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          e
      )
    } finally {
      this.serverClaimGeneral = false
      this.updateUI()
    }
  }
}
