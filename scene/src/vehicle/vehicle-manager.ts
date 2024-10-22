/*      VEHICLE MANAGER
    provides an interface for managing live/in-scene data for all vehicles. this
    is mainly for ownership verification (knowing what items are available to a player)
    and applying/removing bonuses that items provide to the player

    NOTE: eventually ownership verification should be probably be processed on the server,
    additional checks should also be done when saving the user's slotted items (if the player
    is attempting to save items they dont own in their slots they are cheating -> add a black-tic)

    author: Alex Pazder
    contact: TheCryptoTrader69@gmail.com 
*/

import { executeTask } from '@dcl/sdk/ecs'
import { getUserData } from '~system/UserIdentity'
import { RARITY_TYPE } from '../inventory/rarity-data'
import Dictionary, { List } from '../utils/collections'
import { VEHICLE_ID, type VehicleDataObject, VehicleData } from './vehicle-data'

type Wearable = {
  urn: string
  // other properties as needed
}

/** defines a single vehicle's live data in-scene */
export class VehicleEntry {
  /** id data object referenced by this entry */
  private readonly id: string
  public get ID(): string {
    return this.id
  }

  /** positional index of data object */
  private readonly position: number
  public get Position(): number {
    return this.position
  }

  public get DataDef(): VehicleDataObject {
    return VehicleData[this.position]
  }

  /** true when the player owns wearable */
  public IsOwned: boolean = false

  constructor(pos: number, id: string) {
    this.position = pos
    this.id = id
  }
}
/** manages the state of all vehicles in the game */
export class VehicleManager {
  /** when true debugging logs will be generated (ensure is false when deploying to remove overhead) */
  private static readonly IsDebugging: boolean = false
  /** when true vehicles will only be visible in the inventory if the player owns them (set to false to test) */
  private static readonly EnforceOwnership: boolean = true

  // access pocketing
  private static instance: undefined | VehicleManager
  public static get Instance(): VehicleManager {
    // ensure instance is set
    if (VehicleManager.instance === undefined) {
      VehicleManager.instance = new VehicleManager()
    }

    return VehicleManager.instance
  }

  /** currently equipped vehicle */
  private equippedVehicle: VEHICLE_ID = VEHICLE_ID.NONE
  public get EquippedVehicle(): VEHICLE_ID {
    return this.equippedVehicle
  }

  public get EquippedVehicleEntry(): VehicleEntry | null {
    if (this.EquippedVehicle != null && this.EquippedVehicle !== undefined) {
      return this.GetEntryByID(this.equippedVehicle)
    } else {
      return null
    }
  }

  // overhead indexing
  //  indexes of rarities
  private readonly indexRarityRegistry: Dictionary<number>
  // vehicle registries, providing access to entry
  //  ALL registered data
  public readonly entryRegistry: List<VehicleEntry>
  //  id as key
  private readonly entryRegistryViaID: Dictionary<VehicleEntry>
  //  data split via rarity
  private readonly entryRegistryViaRarity: Dictionary<List<VehicleEntry>>

  /** prepares registry for use, this is done automatically when the instance is first called */
  public constructor() {
    if (VehicleManager.IsDebugging)
      console.log('Vehicle Manager: initializing...')

    // initialize collection sets
    this.indexRarityRegistry = new Dictionary<number>()
    this.entryRegistry = new List<VehicleEntry>()
    this.entryRegistryViaID = new Dictionary<VehicleEntry>()
    this.entryRegistryViaRarity = new Dictionary<List<VehicleEntry>>()
    //  initialize sort by rarity sorting collection
    let index = 0
    Object.keys(RARITY_TYPE).forEach((key) => {
      this.indexRarityRegistry.addItem(key, index)
      this.entryRegistryViaRarity.addItem(key, new List<VehicleEntry>())
      index++
    })

    // populate registry collections
    //  process every vehicle def
    for (let i: number = 0; i < VehicleData.length; i++) {
      // prepare entry
      const entry = new VehicleEntry(i, VehicleData[i].ID)
      if (VehicleManager.IsDebugging)
        console.log(
          'Vehicle Manager: creating entry=' +
            i +
            ', rarity=' +
            VehicleData[i].Rarity
        )
      // add to registry
      this.entryRegistry.addItem(entry)
      this.entryRegistryViaID.addItem(VehicleData[i].ID, entry)
      this.entryRegistryViaRarity.getItem(VehicleData[i].Rarity).addItem(entry)
    }

    // NOTE: if we can manage to pull back the concurrent structure of the repo we could have a single listing of all the player's
    //      wearables in Player.ts that we can reference (would majorly cut down on coms requests)
    // check ownershipt of all vehicles
    executeTask(async () => {
      try {
        let logOwnership: string = 'Vehicle Manager: asserting ownership...'
        // get player data
        const player = await getUserData({})
        // attempt to get player's wearables
        const url =
          `https://peer.decentraland.org/lambdas/collections/wearables-by-owner/${player.data?.userId}`.toString()
        const response = await fetch(url)
        // convert to json
        const usersWearables = await response.json()
        // process each wearable
        usersWearables.forEach((wearable: Wearable) => {
          // check
          for (let i: number = 0; i < this.entryRegistry.size(); i++) {
            // get entry
            const entry = this.entryRegistry.getItem(i)
            // check list of player wearables for item
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (wearable.urn.includes(entry.DataDef.NFTSourceURN)) {
              entry.IsOwned = true
            }
            if (VehicleManager.IsDebugging)
              logOwnership += '\n\tisOwned=' + entry.IsOwned + ' id=' + entry.ID
          }
        })
        if (VehicleManager.IsDebugging)
          console.log(logOwnership + '\nfinished parsing owned wearables!')
      } catch (e: any) {
        console.log('Vehicle Manager:' + e)
      }
    })

    // debug add to inventory
    // this.GetEntryByID(VEHICLE_ID.OBSIDIAN_STRIKE).IsOwned = true;

    if (VehicleManager.IsDebugging)
      console.log(
        'Vehicle Manager: initialized, total count=' + this.entryRegistry.size()
      )
  }

  // access functions (we do not want to allow direct access to registries, as they should remain unchanged)
  // callbacks have been provided to hook up as needed, providing unintrussive plug-and-play solution (while avoiding cyclindrical dep issues)
  // NOTE: we can hand out entry references because the values on entries are readonly (cannot be modified)

  /** returns entry at given position */
  public CallbackGetEntryByPos(index: number): VehicleEntry {
    return VehicleManager.Instance.GetEntryByPos(index)
  }

  public GetEntryByPos(index: number): VehicleEntry {
    return this.entryRegistry.getItem(index)
  }

  /** returns def at given position */
  public CallbackGetDefByPos(index: number): VehicleDataObject {
    return VehicleManager.Instance.GetDefByPos(index)
  }

  public GetDefByPos(index: number): VehicleDataObject {
    return this.GetEntryByPos(index).DataDef
  }

  /** returns entry of given id */
  public CallbackGetEntryByID(id: string): VehicleEntry {
    return VehicleManager.Instance.GetEntryByID(id)
  }

  public GetEntryByID(id: string): VehicleEntry {
    return this.entryRegistryViaID.getItem(id)
  }

  /** returns def of given id */
  public CallbackGetDefByID(id: string): VehicleDataObject {
    return VehicleManager.Instance.GetDefByID(id)
  }

  public GetDefByID(id: string): VehicleDataObject {
    return this.GetEntryByID(id).DataDef
  }

  /** returns rarity index (used for slot filtering), when rarities are more fleshed out pop this in the manager */
  public CallbackGetRarityIndex(type: RARITY_TYPE): number {
    return VehicleManager.Instance.GetRarityIndex(type)
  }

  public GetRarityIndex(type: RARITY_TYPE): number {
    return this.indexRarityRegistry.getItem(type)
  }

  /** removes vehicle from character */
  public RemoveVehicle(): void {
    if (VehicleManager.IsDebugging)
      console.log(
        'Vehicle Manager: removing vehicle type=' + this.equippedVehicle
      )

    // ensure there is an item to remove
    if (this.equippedVehicle === VEHICLE_ID.NONE) return

    // remove all effects provided by item

    // remove item
    this.equippedVehicle = VEHICLE_ID.NONE
    if (VehicleManager.IsDebugging)
      console.log(
        'Vehicle Manager: removed vehicle type=' + this.equippedVehicle
      )
  }

  /** applies the given vehicle to the player's character (overwrites avatar)
   *  returns true if item was successfully equipped
   */
  public ApplyVehicle(id: null | string): boolean | undefined {
    if (VehicleManager.IsDebugging)
      console.log('Vehicle Manager: applying new vehicle ID=' + id + '...')

    // if player already has an attachment, remove previous attachment
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this.equippedVehicle) this.RemoveVehicle()
    // ensure validity of given vehicle
    if (id === '' || id == null) {
      if (VehicleManager.IsDebugging)
        console.log(
          'Vehicle Manager: halted applying new vehicle -> invalid ID, please use Remove() instead!'
        )
      return
    }

    // get vehicle entry
    const entry = this.GetEntryByID(id)
    if (entry == null) {
      if (VehicleManager.IsDebugging)
        console.log(
          'Vehicle Manager: halted applying new vehicle -> no valid entry found!'
        )
      return
    }

    // get vehicle data
    const dataDef = entry.DataDef
    if (dataDef == null) {
      if (VehicleManager.IsDebugging)
        console.log(
          'Vehicle Manager: halted applying new vehicle -> no valid data def found!'
        )
      return
    }

    // ensure player owns vehicle (if enforcement is active)
    if (VehicleManager.EnforceOwnership && !entry.IsOwned) {
      if (VehicleManager.IsDebugging)
        Error(
          'Vehicle Manager: failed to applying new vehicle -> player does not own vehicle'
        )
      return false
    }

    // add item
    this.equippedVehicle = dataDef.ID

    // successfully equipped item
    if (VehicleManager.IsDebugging)
      console.log(
        'Vehicle Manager: applied new vehicle ID=' + this.equippedVehicle + '!'
      )
    return true
  }
}
