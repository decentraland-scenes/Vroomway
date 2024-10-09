/*      INVENTORY MANAGER
    provides an interface for processing/storing all the player's items and components. before
    initializing/using system ensure all delegation methods have been assigned. this system also
    includes tokenization of player experience/prestige.
    
    author: Alex Pazder
    contact: TheCryptoTrader69@gmail.com 
*/
import Dictionary, { List } from '../utils/collections'
import {
  CargoObjectData,
  LevelingObjectData,
  PowerUpObjectData,
  ResourceObjectData,
  TokenObjectData
} from './inventory-data'

// used to define a single item in the player's inventory
type InventoryCallbackFunction = () => void
export class InventoryEntry {
  // index of entry in-data
  private readonly index: number
  public get Index(): number {
    return this.index
  }

  // unique id of this item
  private readonly id: string
  public get ID(): string {
    return this.id
  }

  // whether this item's amount has changed since last server update
  private isModified: boolean = false
  public get IsModified(): boolean {
    return this.isModified
  }

  public set IsModified(value: boolean) {
    // log("Inventory Manager: isMod change cur=" + this.IsModified + ", new=" + value);
    // if flag state is changing, set value as reference for previous server communication
    if (this.isModified !== value) this.amountPrev = this.amount
    this.isModified = value
  }

  // current amount of item, includes back-checking to ensure only new values force an update
  private amount: number = 0 // current item count
  private amountPrev: number = 0 // item as of last server update
  public get Amount(): number {
    return this.amount
  }

  public set Amount(value: number) {
    // set modified flag
    this.IsModified = true
    // set new value
    this.amount = value
    // redraw ui
    this.UpdateItemUI()
  }

  /** returns the change in amount since last server update */
  public get AmountDelta(): number {
    return this.amount - this.amountPrev
  }

  // listing of all registered callback events
  private readonly updateItemUICallbacks: InventoryCallbackFunction[] = []
  /** registers the given method to the list of ui update callbacks */
  public RegisterItemUICallback(callback: InventoryCallbackFunction): void {
    this.updateItemUICallbacks.push(callback)
  }

  /** makes an update attempt to call every registed ui callbacks */
  public UpdateItemUI(): void {
    this.updateItemUICallbacks.forEach((callback) => {
      callback()
    })
  }

  constructor(index: number, id: string) {
    this.index = index
    this.id = id
  }
}
// manages the player's inventory
export class InventoryManager {
  // if true, all debugging logs will be isVisible (ensure is false when deploying to remove overhead)
  private static readonly IsDebugging: boolean = false

  // access pocketing
  private static instance: undefined | InventoryManager
  public static get Instance(): InventoryManager {
    // ensure instance is set
    if (InventoryManager.instance === undefined) {
      InventoryManager.instance = new InventoryManager()
    }

    return InventoryManager.instance
  }

  // resource inventory
  //  via data's id
  private readonly itemRegistryViaID: Dictionary<InventoryEntry>
  //  via data's id, sorted by type
  private readonly itemRegistryViaType: Array<Dictionary<InventoryEntry>>
  //  via rarity
  private readonly itemRegistryViaRarity: Dictionary<List<InventoryEntry>>

  // returns number of item types
  public get ItemTypes(): number {
    return this.itemRegistryViaType.length
  }

  // returns length of registry of given type
  public GetRegistryLengthOfType(type: number): number {
    return this.itemRegistryViaType[type].size()
  }

  /**
   * prepares the inventory for use, populating all inventory item and callback dictionaries.
   */
  public constructor() {
    if (InventoryManager.IsDebugging)
      console.log('Inventory System: initializing...')

    // initialize resource dicitonary sets
    this.itemRegistryViaType = [
      new Dictionary<InventoryEntry>(), // leveling
      new Dictionary<InventoryEntry>(), // resources
      new Dictionary<InventoryEntry>(), // cargo
      new Dictionary<InventoryEntry>(), // tokens
      new Dictionary<InventoryEntry>() // powerups
    ]
    this.itemRegistryViaID = new Dictionary<InventoryEntry>()
    this.itemRegistryViaRarity = new Dictionary<List<InventoryEntry>>()

    // populate dictionaries
    //  leveling
    for (let i: number = 0; i < LevelingObjectData.length; i++) {
      const entry: InventoryEntry = new InventoryEntry(
        i,
        LevelingObjectData[i].ID
      )
      this.itemRegistryViaType[0].addItem(i.toString(), entry)
      this.itemRegistryViaID.addItem(entry.ID, entry)
    }
    //  resources
    for (let i: number = 0; i < ResourceObjectData.length; i++) {
      const entry: InventoryEntry = new InventoryEntry(
        i,
        ResourceObjectData[i].ID
      )
      this.itemRegistryViaType[1].addItem(i.toString(), entry)
      this.itemRegistryViaID.addItem(entry.ID, entry)
      // push to rarity
      //  ensure rarity list exists
      if (
        !this.itemRegistryViaRarity.containsKey(
          ResourceObjectData[i].Rarity.toString()
        )
      )
        this.itemRegistryViaRarity.addItem(
          ResourceObjectData[i].Rarity.toString(),
          new List<InventoryEntry>()
        )
      //  add entry to rarity listing
      this.itemRegistryViaRarity
        .getItem(ResourceObjectData[i].Rarity.toString())
        .addItem(entry)
    }
    //  cargo
    for (let i: number = 0; i < CargoObjectData.length; i++) {
      const entry: InventoryEntry = new InventoryEntry(i, CargoObjectData[i].ID)
      this.itemRegistryViaType[2].addItem(i.toString(), entry)
      this.itemRegistryViaID.addItem(entry.ID, entry)
    }
    //  tokens
    for (let i: number = 0; i < TokenObjectData.length; i++) {
      const entry: InventoryEntry = new InventoryEntry(i, TokenObjectData[i].ID)
      this.itemRegistryViaType[3].addItem(i.toString(), entry)
      this.itemRegistryViaID.addItem(entry.ID, entry)
    }
    //  powerups
    for (let i: number = 0; i < PowerUpObjectData.length; i++) {
      const entry: InventoryEntry = new InventoryEntry(
        i,
        PowerUpObjectData[i].ID
      )
      this.itemRegistryViaType[4].addItem(i.toString(), entry)
      this.itemRegistryViaID.addItem(entry.ID, entry)
    }

    if (InventoryManager.IsDebugging)
      console.log('Inventory System: initialized!')
  }

  // clears the inventory of the given type of all items, setting their value to 0
  public CallbackResetItems(type: number): void {
    InventoryManager.Instance.ResetItems(type)
  }

  public ResetItems(type: number): void {
    if (InventoryManager.IsDebugging)
      console.log('Inventory System: reset item')
    // process every item in collection
    for (let i: number = 0; i < this.itemRegistryViaType[type].size(); i++) {
      this.SetItemCountByIndex(type, i.toString(), 0)
    }
  }

  // access via numeric position in data
  //  returns true if the count of target resource has been modified since the last server interaction
  public CallbackIsItemModifiedByIndex(type: number, index: string): boolean {
    return InventoryManager.Instance.IsItemModifiedByIndex(type, index)
  }

  public IsItemModifiedByIndex(type: number, index: string): boolean {
    if (InventoryManager.IsDebugging)
      console.log('Inventory System: is item modified')
    return this.itemRegistryViaType[type].getItem(index).IsModified
  }

  //  get current count of target item, reset for modification has been packed into this method so
  //      server calls accessing the value can easily reset the save-state of the inv entry
  public CallbackGetItemCountByIndex(
    type: number,
    index: string,
    reset: boolean = false
  ): number {
    return InventoryManager.Instance.GetItemCountByIndex(type, index, reset)
  }

  public GetItemCountByIndex(
    type: number,
    index: string,
    reset: boolean = false
  ): number {
    if (InventoryManager.IsDebugging)
      console.log('Inventory System: reset item')
    if (reset) this.itemRegistryViaType[type].getItem(index).IsModified = false
    return this.itemRegistryViaType[type].getItem(index).Amount
  }

  //  set current count of target item, reset for modification has been packed into this meathod so
  //      server calls setting the value can easily reset the save-state of the inv entry
  public CallbackSetItemCountByIndex(
    type: number,
    index: string,
    value: number,
    reset: boolean = false
  ): void {
    InventoryManager.Instance.SetItemCountByIndex(type, index, value, reset)
  }

  public SetItemCountByIndex(
    type: number,
    index: string,
    value: number,
    reset: boolean = false
  ): void {
    if (InventoryManager.IsDebugging)
      console.log('Inventory System: reset item')
    this.itemRegistryViaType[type].getItem(index).Amount = value
    if (reset) this.itemRegistryViaType[type].getItem(index).IsModified = false
  }

  //  add given amount to target item
  public CallbackAddItemCountByIndex(
    type: number,
    index: string,
    value: number
  ): void {
    InventoryManager.Instance.AddItemCountByIndex(type, index, value)
  }

  public AddItemCountByIndex(type: number, index: string, value: number): void {
    if (InventoryManager.IsDebugging)
      console.log(
        'Inventory System: adding count to item, type=' +
          type +
          ', index=' +
          index +
          ', value=' +
          value
      )
    this.itemRegistryViaType[type].getItem(index).Amount += value
  }

  //  updates the ui update meathod of the target item
  public CallbackSetUpdateUI(
    type: number,
    index: string,
    callbackUpdateUI: () => void
  ): void {
    InventoryManager.Instance.RegisterUpdateUI(type, index, callbackUpdateUI)
  }

  public RegisterUpdateUI(
    type: number,
    index: string,
    callbackUpdateUI: () => void
  ): void {
    if (InventoryManager.IsDebugging)
      console.log(
        'Inventory System: adding count to item, type=' +
          type +
          ', index=' +
          index
      )
    this.itemRegistryViaType[type]
      .getItem(index)
      .RegisterItemUICallback(callbackUpdateUI)
  }

  //  retrieves actual inventory entry object (use with caution, mishandling this will brick the system)
  public CallbackGetEntry(type: number, index: string): InventoryEntry {
    return InventoryManager.Instance.GetEntry(type, index)
  }

  public GetEntry(type: number, index: string): InventoryEntry {
    if (InventoryManager.IsDebugging)
      console.log(
        'Inventory System: adding count to item, type=' +
          type +
          ', index=' +
          index
      )
    return this.itemRegistryViaType[type].getItem(index)
  }

  // access via type + id combo
  //  returns true if the count of target resource has been modified since the last server interaction
  public CallbackIsItemModifiedByType(type: number, index: string): boolean {
    return InventoryManager.Instance.IsItemModifiedByType(type, index)
  }

  public IsItemModifiedByType(type: number, index: string): boolean {
    if (InventoryManager.IsDebugging)
      console.log(
        'Inventory System: adding count to item by type|pos, type=' +
          type +
          ', index=' +
          index
      )
    return this.itemRegistryViaType[type].getItem(index).IsModified
  }

  //  get current count of target item
  public CallbackGetItemCountByType(
    type: number,
    index: string,
    reset: boolean = false
  ): number {
    return InventoryManager.Instance.GetItemCountByType(type, index, reset)
  }

  public GetItemCountByType(
    type: number,
    index: string,
    reset: boolean = false
  ): number {
    if (InventoryManager.IsDebugging)
      console.log(
        'Inventory System: getting count of item by type|pos, type=' +
          type +
          ', index=' +
          index
      )
    if (reset) this.itemRegistryViaType[type].getItem(index).IsModified = false
    return this.itemRegistryViaType[type].getItem(index).Amount
  }

  //  set current count of target item
  public CallbackSetItemCountByType(
    type: number,
    index: string,
    value: number,
    reset: boolean = false
  ): void {
    InventoryManager.Instance.SetItemCountByType(type, index, value, reset)
  }

  public SetItemCountByType(
    type: number,
    index: string,
    value: number,
    reset: boolean = false
  ): void {
    if (InventoryManager.IsDebugging)
      console.log(
        'Inventory System: setting count of item by type|pos, type=' +
          type +
          ', index=' +
          index +
          ', value=' +
          value
      )
    this.itemRegistryViaType[type].getItem(index).Amount = value
    if (reset) this.itemRegistryViaType[type].getItem(index).IsModified = false
  }

  //  add given amount to target item
  public CallbackAddItemCountByType(
    type: number,
    index: string,
    value: number
  ): void {
    InventoryManager.Instance.AddItemCountByType(type, index, value)
  }

  public AddItemCountByType(type: number, index: string, value: number): void {
    if (InventoryManager.IsDebugging)
      console.log(
        'Inventory System: adding count to item by type|pos, type=' +
          type +
          ', index=' +
          index +
          ', value=' +
          value
      )
    this.itemRegistryViaType[type].getItem(index).Amount += value
  }

  // access via ID (all IDs must be unique)
  //  get item count using item's name as indexing
  public CallbackGetItemCountByID(id: any, reset: boolean = false): number {
    return InventoryManager.Instance.GetItemCountByID(id, reset)
  }

  public GetItemCountByID(id: any, reset: boolean = false): number {
    if (InventoryManager.IsDebugging)
      console.log('Inventory System: getting count of item by id, id=' + id)
    if (reset) this.itemRegistryViaID.getItem(id.toString()).IsModified = false
    return this.itemRegistryViaID.getItem(id.toString()).Amount
  }

  //  set item count using item's name as indexing
  public CallbackSetItemCountByID(
    id: any,
    value: number,
    reset: boolean = false
  ): void {
    InventoryManager.Instance.SetItemCountByID(id, value, reset)
  }

  public SetItemCountByID(
    id: any,
    value: number,
    reset: boolean = false
  ): void {
    if (InventoryManager.IsDebugging)
      console.log(
        'Inventory System: setting count of item by id, id=' +
          id +
          ', value=' +
          value
      )
    this.itemRegistryViaID.getItem(id.toString()).Amount = value
    if (reset) this.itemRegistryViaID.getItem(id.toString()).IsModified = false
  }

  //  modify item count using item's name as indexing
  public CallbackAddItemCountByID(id: any, value: number): void {
    InventoryManager.Instance.AddItemCountByID(id, value)
  }

  public AddItemCountByID(id: any, value: number): void {
    if (InventoryManager.IsDebugging)
      console.log(
        'Inventory System: adding count to item by id, id=' +
          id +
          ', value=' +
          value
      )
    this.itemRegistryViaID.getItem(id.toString()).Amount += value
  }

  //  updates the ui update meathod of the target item
  public RegisterUpdateUIByID(id: any, callbackUpdateUI: () => void): void {
    if (InventoryManager.IsDebugging)
      console.log('Inventory System: registering callback to item id=' + id)
    this.itemRegistryViaID
      .getItem(id.toString())
      .RegisterItemUICallback(callbackUpdateUI)
  }

  //  returns a random resource item name based on the given rarity
  public GetRandomResourceViaRarity(rarity: number): string {
    if (InventoryManager.IsDebugging)
      console.log(
        'Inventory System: getting random resource of rarity=' + rarity
      )
    const rarityListing: List<InventoryEntry> =
      this.itemRegistryViaRarity.getItem(rarity.toString())
    return rarityListing.getItem(
      Math.floor(Math.random() * rarityListing.size())
    ).ID
  }
}
