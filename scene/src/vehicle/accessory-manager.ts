/*      ACCESSORY MANAGER
    provides an interface for managing live/in-scene data for all accessories. this
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
import {
  ACCESSORY_ID,
  AccessoryData,
  type AccessoryDataObject
} from './accessory-data'

/** defines a single accessory's live data in-scene */
export class AccessoryEntry {
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

  public get DataDef(): AccessoryDataObject {
    return AccessoryData[this.position]
  }

  /** true when the player owns wearable */
  public IsOwned: boolean = false

  constructor(pos: number, id: string) {
    this.position = pos
    this.id = id
  }
}
/** manages the state of all accessories in the game */
export class AccessoryManager {
  /** when true debugging logs will be generated (ensure is false when deploying to remove overhead) */
  private static readonly IsDebugging: boolean = false
  /** when true accessories will only be visible in the inventory if the player owns them (set to false to test) */
  private static readonly EnforceOwnership: boolean = true

  // access pocketing
  private static instance: undefined | AccessoryManager
  public static get Instance(): AccessoryManager {
    // ensure instance is set
    if (AccessoryManager.instance === undefined) {
      AccessoryManager.instance = new AccessoryManager()
    }

    return AccessoryManager.instance
  }

  /** currently equipped accessory */
  private equippedAccessory: ACCESSORY_ID = ACCESSORY_ID.NONE
  public get EquippedAccessory(): ACCESSORY_ID {
    return this.equippedAccessory
  }

  // overhead indexing
  //  indexes of rarities
  private readonly indexRarityRegistry: Dictionary<number>
  // accessory registries, providing access to entry
  //  ALL registered data
  private readonly entryRegistry: List<AccessoryEntry>
  //  id as key
  private readonly entryRegistryViaID: Dictionary<AccessoryEntry>
  //  data split via rarity
  private readonly entryRegistryViaRarity: Dictionary<List<AccessoryEntry>>

  /** prepares registry for use, this is done automatically when the instance is first called */
  public constructor() {
    if (AccessoryManager.IsDebugging)
      console.log('Accessory Manager: initializing...')

    // initialize collection sets
    this.indexRarityRegistry = new Dictionary<number>()
    this.entryRegistry = new List<AccessoryEntry>()
    this.entryRegistryViaID = new Dictionary<AccessoryEntry>()
    this.entryRegistryViaRarity = new Dictionary<List<AccessoryEntry>>()
    //  initialize sort by rarity sorting collection
    let index = 0
    Object.keys(RARITY_TYPE).forEach((key) => {
      this.indexRarityRegistry.addItem(key, index)
      this.entryRegistryViaRarity.addItem(key, new List<AccessoryEntry>())
      index++
    })

    // populate registry collections
    //  process every accessory def
    for (let i: number = 0; i < AccessoryData.length; i++) {
      // prepare entry
      const entry = new AccessoryEntry(i, AccessoryData[i].ID)
      if (AccessoryManager.IsDebugging)
        console.log(
          'Accessory Manager: creating entry=' +
            i +
            ', rarity=' +
            AccessoryData[i].Rarity
        )
      // add to registry
      this.entryRegistry.addItem(entry)
      this.entryRegistryViaID.addItem(AccessoryData[i].ID, entry)
      this.entryRegistryViaRarity
        .getItem(AccessoryData[i].Rarity)
        .addItem(entry)
    }

    // NOTE: if we can manage to pull back the concurrent structure of the repo we could have a single listing of all the player's
    //      wearables in Player.ts that we can reference (would majorly cut down on coms requests)
    // check ownershipt of all accessories
    executeTask(async () => {
      try {
        let logOwnership: string = 'Accessory Manager: asserting ownership...'
        // get player data
        const player = await getUserData({})
        // attempt to get player's wearables
        const url =
          `https://peer.decentraland.org/lambdas/collections/wearables-by-owner/${player.data?.userId}`.toString()
        const response = await fetch(url)
        // convert to json
        const usersWearables = await response.json()
        // process each wearable
        usersWearables.forEach((wearable: any) => {
          // check
          for (let i: number = 0; i < this.entryRegistry.size(); i++) {
            // get entry
            const entry = this.entryRegistry.getItem(i)
            // check list of player wearables for item
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (wearable.urn.includes(entry.DataDef.NFTSourceURN)) {
              entry.IsOwned = true
            }
            if (AccessoryManager.IsDebugging)
              logOwnership += '\n\tisOwned=' + entry.IsOwned + ' id=' + entry.ID
          }
        })
        if (AccessoryManager.IsDebugging)
          console.log(logOwnership + '\nfinished parsing owned wearables!')
      } catch (e: any) {
        console.log('Accessory Manager:' + e)
      }
    })

    if (AccessoryManager.IsDebugging)
      console.log(
        'Accessory Manager: initialized, total count=' +
          this.entryRegistry.size()
      )
  }

  // access functions (we do not want to allow direct access to registries, as they should remain unchanged)
  // callbacks have been provided to hook up as needed, providing unintrussive plug-and-play solution (while avoiding cyclindrical dep issues)
  // NOTE: we can hand out entry references because the values on entries are readonly (cannot be modified)

  /** returns entry at given position */
  public CallbackGetEntryByPos(index: number): AccessoryEntry {
    return AccessoryManager.Instance.GetEntryByPos(index)
  }

  public GetEntryByPos(index: number): AccessoryEntry {
    return this.entryRegistry.getItem(index)
  }

  /** returns def at given position */
  public CallbackGetDefByPos(index: number): AccessoryDataObject {
    return AccessoryManager.Instance.GetDefByPos(index)
  }

  public GetDefByPos(index: number): AccessoryDataObject {
    return this.GetEntryByPos(index).DataDef
  }

  /** returns entry of given id */
  public CallbackGetEntryByID(id: string): AccessoryEntry {
    return AccessoryManager.Instance.GetEntryByID(id)
  }

  public GetEntryByID(id: string): AccessoryEntry {
    return this.entryRegistryViaID.getItem(id)
  }

  /** returns def of given id */
  public CallbackGetDefByID(id: string): AccessoryDataObject {
    return AccessoryManager.Instance.GetDefByID(id)
  }

  public GetDefByID(id: string): AccessoryDataObject {
    return this.GetEntryByID(id).DataDef
  }

  /** returns rarity index (used for slot filtering), when rarities are more fleshed out pop this in the manager */
  public CallbackGetRarityIndex(type: RARITY_TYPE): number {
    return AccessoryManager.Instance.GetRarityIndex(type)
  }

  public GetRarityIndex(type: RARITY_TYPE): number {
    return this.indexRarityRegistry.getItem(type)
  }

  /** removes accessory from character */
  public RemoveAccessory(): void {
    if (AccessoryManager.IsDebugging)
      console.log(
        'Accessory Manager: removing accessory type=' + this.equippedAccessory
      )

    // ensure there is an item to remove
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!this.equippedAccessory) return

    // remove all effects provided by item

    // remove item
    this.equippedAccessory = ACCESSORY_ID.NONE
    if (AccessoryManager.IsDebugging)
      console.log(
        'Accessory Manager: removed accessory type=' + this.equippedAccessory
      )
  }

  /** applies the given accessory to the player's character (overwrites avatar)
   *  returns true if item was successfully equipped
   */
  public ApplyAccessory(id: null | string): boolean | undefined {
    if (AccessoryManager.IsDebugging)
      console.log('Vehicle Manager: applying new vehicle ID=' + id + '...')

    // if player already has an attachment, remove previous attachment
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this.equippedAccessory) this.RemoveAccessory()
    // ensure validity of given vehicle
    if (id === '' || id == null) {
      if (AccessoryManager.IsDebugging)
        console.log(
          'Accessory Manager: halted applying new vehicle -> invalid ID, please use Remove() instead!'
        )
      return
    }

    // get vehicle entry
    const entry = this.GetEntryByID(id)
    if (entry == null) {
      if (AccessoryManager.IsDebugging)
        console.log(
          'Accessory Manager: halted applying new vehicle -> no valid entry found!'
        )
      return
    }

    // get vehicle data
    const dataDef = entry.DataDef
    if (dataDef == null) {
      if (AccessoryManager.IsDebugging)
        console.log(
          'Accessory Manager: halted applying new vehicle -> no valid data def found!'
        )
      return
    }

    // ensure player owns vehicle (if enforcement is active)
    if (AccessoryManager.EnforceOwnership && !entry.IsOwned) {
      if (AccessoryManager.IsDebugging)
        Error(
          'Accessory Manager: failed to applying new accessory -> player does not own accessory'
        )
      return false
    }

    // add item
    this.equippedAccessory = dataDef.ID

    // successfully equipped item
    if (AccessoryManager.IsDebugging)
      console.log(
        'Vehicle Manager: applied new vehicle ID=' +
          this.equippedAccessory +
          '!'
      )
    return true
  }
}
