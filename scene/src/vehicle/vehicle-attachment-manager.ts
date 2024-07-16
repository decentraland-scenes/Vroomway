/*      VEHICLE ATTACHMENT MANAGER
    provides an interface for managing live/in-scene data forvehicle attachments. this
    includes: ownership verification 

    NOTE: eventually ownership verification should be probably be processed on the server,
    additional checks should also be done when saving the user's slotted items (if the player
    is attempting to save items they dont own in their slots they are cheating -> add a black-tic)

    author: Alex Pazder
    contact: TheCryptoTrader69@gmail.com 
*/

import {
  type Entity,
  engine,
  Transform,
  executeTask,
  Material,
  MeshRenderer,
  AvatarAnchorPointType,
  AvatarAttach,
  GltfContainer
} from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'
import { getUserData } from '~system/UserIdentity'
import { RARITY_TYPE } from '../inventory/rarity-data'
import Dictionary, { List } from '../utils/collections'
import { instance, INSTANCE_TYPES } from '../utils/currentInstance'
import {
  type VEHICLE_ATTACHMENT,
  type VehicleAttachmentDataObject,
  VehicleAttachmentData,
  VEHICLE_ATTACHMENT_TYPE,
  ATTACHMENT_SCENE_OFFSETS,
  ATTACHMENT_SCENE_SCALES
} from './vehicle-attachment-data'
import { OmitFromCleanUpFlag } from '../utils/cleanupScene'
import { AudioManager } from '../utils/audio-manager'

// button down event (just change 'ActionButton.' to key you want)
// const input = Input.instance
// input.subscribe('BUTTON_DOWN', ActionButton.ACTION_3, false, (e) => {
//   // debug to ensure key is taken from input
//   // (if it doesnt show up here then there is another subscriber taking it else where -.-)
//   // console.log("key pressed: " + e.buttonId);
//   VehicleAttachmentManager.Instance.PlayHornSound()
// })

// NOTE: in SDK6 an entity cannot have both a transform & attachToPlayer component, so we must use a
//  nesting solution. this will get simpler in SDK7
/** in-game object attached to the player representing a equipped vehicle attachment */
export class VehicleAttachmentObject {
  /** id of the object currently being displayed */
  public ID = ''
  /** display object */
  public entity: Entity

  constructor(parent: Entity) {
    this.entity = engine.addEntity()
    OmitFromCleanUpFlag.create(this.entity)
    Transform.create(this.entity, { parent })
    Transform.createOrReplace(this.entity)
  }
}

type Serial = Record<string, any>
/** defines a single vehicle attachment's live data in-scene */
export class VehicleAttachmentEntry {
  /** id data object referenced by this entry */
  private readonly id: VEHICLE_ATTACHMENT
  public get ID(): VEHICLE_ATTACHMENT {
    return this.id
  }

  /** positional index of data object */
  private readonly position: number
  public get Position(): number {
    return this.position
  }

  public get DataDef(): VehicleAttachmentDataObject {
    return VehicleAttachmentData[this.position]
  }

  /** true when the player owns wearable */
  public IsOwned: boolean = true

  constructor(pos: number, id: VEHICLE_ATTACHMENT) {
    this.position = pos
    this.id = id
  }
}
/** manages the state of all vehicle attachments in the game */
export class VehicleAttachmentManager {
  /** when true debugging logs will be generated (ensure is false when deploying to remove overhead) */
  private static readonly IsDebugging: boolean = true
  /** when true vehicle attachments will only be visible in inventory if the player owns them (set to false to test) */
  private static readonly EnforceOwnership: boolean = false

  // access pocketing
  private static instance: undefined | VehicleAttachmentManager
  public static get Instance(): VehicleAttachmentManager {
    // ensure instance is set
    if (VehicleAttachmentManager.instance === undefined) {
      VehicleAttachmentManager.instance = new VehicleAttachmentManager()
    }

    return VehicleAttachmentManager.instance
  }

  /** parental object for attachment models, attached to player */
  private readonly attachmentParentObject: Entity
  // TODO: after the repo is fixed and concurrent processing has been removed, we can move player IDs into a single file
  private playerID: string | undefined = ''

  // overhead indexing
  //  indexes of type
  private readonly indexTypeRegistry: Dictionary<number>
  //  indexes of rarities
  private readonly indexRarityRegistry: Dictionary<number>
  // vehicle attachment registries, providing access
  //  to ALL registered data
  private readonly entryRegistry: List<VehicleAttachmentEntry>
  //  id as key
  private readonly entryRegistryViaID: Dictionary<VehicleAttachmentEntry>
  //  data split via type
  private readonly entryRegistryViaType: Dictionary<
    List<VehicleAttachmentEntry>
  >

  //  data split via rarity
  private readonly entryRegistryViaRarity: Dictionary<
    List<VehicleAttachmentEntry>
  >

  // active vehicle attachment components
  //  attachment objects per type (represents equipped items)
  private readonly equippedAttachmentDict: Dictionary<VehicleAttachmentObject>

  private readonly underglow: VehicleAttachmentObject

  /** prepares registry for use, this is done automatically when the instance is first called */
  public constructor() {
    if (VehicleAttachmentManager.IsDebugging)
      console.log('Vehicle Attachment Manager: initializing...')

    // ensure audio manager is initialized
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    AudioManager.Instance

    // prepare parent object
    this.attachmentParentObject = engine.addEntity()
    OmitFromCleanUpFlag.create(this.attachmentParentObject)
    // get player id, required to connect model
    executeTask(async () => {
      // get player data
      const result = await getUserData({})
      this.playerID = result.data?.userId
      // attach to player character
      AvatarAttach.createOrReplace(this.attachmentParentObject, {
        avatarId: result.data?.userId,
        anchorPointId: AvatarAnchorPointType.AAPT_NAME_TAG
      })
    })

    // initialize collection sets
    this.indexTypeRegistry = new Dictionary<number>()
    this.indexRarityRegistry = new Dictionary<number>()
    this.entryRegistry = new List<VehicleAttachmentEntry>()
    this.entryRegistryViaID = new Dictionary<VehicleAttachmentEntry>()
    this.entryRegistryViaType = new Dictionary<List<VehicleAttachmentEntry>>()
    this.entryRegistryViaRarity = new Dictionary<List<VehicleAttachmentEntry>>()
    this.equippedAttachmentDict = new Dictionary<VehicleAttachmentObject>()
    //  initialize sort by type sorting collection
    let index = 0
    Object.keys(VEHICLE_ATTACHMENT_TYPE).forEach((key) => {
      this.indexTypeRegistry.addItem(key, index)
      this.entryRegistryViaType.addItem(key, new List<VehicleAttachmentEntry>())
      this.equippedAttachmentDict.addItem(
        key,
        new VehicleAttachmentObject(this.attachmentParentObject)
      )
      index++
    })
    //  initialize sort by rarity sorting collection
    index = 0
    Object.keys(RARITY_TYPE).forEach((key) => {
      this.indexRarityRegistry.addItem(key, index)
      this.entryRegistryViaRarity.addItem(
        key,
        new List<VehicleAttachmentEntry>()
      )
      index++
    })

    // populate registry collections
    const str: string = 'Vehicle Attachment Manager: loaded data entries:'
    //  process every vehicle attachment def
    for (let i: number = 0; i < VehicleAttachmentData.length; i++) {
      if (VehicleAttachmentManager.IsDebugging)
        console.log(
          '\n\tentry=' +
            i +
            ', type=' +
            VehicleAttachmentData[i].Type +
            ', id=' +
            VehicleAttachmentData[i].ID
        )
      // prepare entry
      const entry = new VehicleAttachmentEntry(i, VehicleAttachmentData[i].ID)
      // add to registry
      this.entryRegistry.addItem(entry)
      this.entryRegistryViaID.addItem(VehicleAttachmentData[i].ID, entry)
      this.entryRegistryViaType
        .getItem(VehicleAttachmentData[i].Type)
        .addItem(entry)
      this.entryRegistryViaRarity
        .getItem(VehicleAttachmentData[i].Rarity)
        .addItem(entry)
      // add audio source link
      if (VehicleAttachmentData[i].Type === VEHICLE_ATTACHMENT_TYPE.HORN) {
        // if audio exists
        if (VehicleAttachmentData[i].Content != null) {
          AudioManager.Instance.AddSound(
            VehicleAttachmentData[i].ID,
            VehicleAttachmentData[i].Content
          )
        }
      }
    }
    if (VehicleAttachmentManager.IsDebugging) console.log(str)

    // refresh ownership if required
    if (VehicleAttachmentManager.EnforceOwnership) this.VerifyOwnership()

    // set up attachments

    //  underglow object
    this.underglow = this.equippedAttachmentDict.getItem(
      VEHICLE_ATTACHMENT_TYPE.UNDERGLOW
    )
    MeshRenderer.setPlane(
      this.underglow.entity,
      [
        0, 0, 1, 0, 1, 1, 0, 1,

        1, 0, 0, 0, 0, 1, 1, 1
      ]
    )
    //  disable object by default
    Transform.createOrReplace(this.underglow.entity, { scale: Vector3.Zero() })
    if (VehicleAttachmentManager.IsDebugging)
      console.log(
        'Vehicle Attachment Manager: initialized, total count=' +
          this.entryRegistry.size()
      )
  }

  /** processes the player's wearables and sets ownership for any owned items */
  public VerifyOwnership(): void {
    executeTask(async () => {
      try {
        let logOwnership: string =
          'Vehicle Accessory Manager: asserting ownership...'
        // get player data
        const player = await getUserData({})
        // attempt to get player's wearables
        const url =
          `https://peer.decentraland.org/lambdas/collections/wearables-by-owner/${player.data?.userId}`.toString()
        const response = await fetch(url)
        // convert to json
        const usersWearables = await response.json()
        // process each wearable
        usersWearables.forEach((wearable: { urn: string | string[] }) => {
          // check
          for (let i: number = 0; i < this.entryRegistry.size(); i++) {
            // get entry
            const entry = this.entryRegistry.getItem(i)
            // check list of player wearables for item
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (wearable.urn.includes(entry.DataDef.NFTSourceURN)) {
              entry.IsOwned = true
            } else {
              entry.IsOwned = false
            }
            if (VehicleAttachmentManager.IsDebugging)
              logOwnership += '\n\tisOwned=' + entry.IsOwned + ' id=' + entry.ID
          }
        })
        if (VehicleAttachmentManager.IsDebugging)
          console.log(logOwnership + '\nfinished parsing owned wearables!')
      } catch (e) {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        console.log('Vehicle Accessory Manager:' + e)
      }
    })
  }

  /** provides a string representing all the player's currently equipped items */
  public Serialize(): string {
    if (VehicleAttachmentManager.IsDebugging)
      console.log('Vehicle Attachment Manager: serializing equipment...')
    let serial: string = '&Attachment=000' // <- this is padding, required bc server coms need to be updated to cull white space -.-
    // process every equipped item piece
    Object.keys(VEHICLE_ATTACHMENT_TYPE).forEach((key) => {
      // attempt to get item
      const itemID = this.equippedAttachmentDict.getItem(key).ID
      // append serial for existing items
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/restrict-plus-operands
      if (itemID) serial += '&' + key + '=' + itemID
    })
    if (VehicleAttachmentManager.IsDebugging)
      console.log(
        "Vehicle Attachment Manager: serialized equipment, serial='" +
          serial +
          "'"
      )
    // return serial
    return serial
  }

  /** takes in a string representing all equipped attachments and sets the player's items accordingly */
  public Deserialize(serial: Serial): void {
    let str =
      'Vehicle Attachment Manager: deserializing equipment from server result...'
    // process every equipped item piece
    Object.keys(VEHICLE_ATTACHMENT_TYPE).forEach((key) => {
      // attempt to get item
      const itemID = serial[key]
      // ensure type existance
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (itemID) {
        if (VehicleAttachmentManager.IsDebugging)
          str += "\n\tfound item for type='" + key + "', id=" + itemID
        // equip item
        this.ApplyAttachment(serial[key])
      } else {
        if (VehicleAttachmentManager.IsDebugging)
          str += "\n\tfailed to find item for type='" + key + "'"
      }
    })
    if (VehicleAttachmentManager.IsDebugging)
      console.log(str + '\nVehicle Attachment Manager: deserialized equipment!')
    //  initialize sort by type sorting collection
  }

  // access functions (we do not want to allow direct access to registries, as they should remain unchanged)
  // callbacks have been provided to hook up as needed, providing unintrussive plug-and-play solution (while avoiding cyclindrical dep issues)
  // NOTE: we can hand out entry references because the values on entries are readonly (cannot be modified)

  /** returns type index (used for slot filtering) */
  public CallbackGetTypeIndex(type: VEHICLE_ATTACHMENT_TYPE): number {
    return VehicleAttachmentManager.Instance.GetTypeIndex(type)
  }

  public GetTypeIndex(type: VEHICLE_ATTACHMENT_TYPE): number {
    return this.indexTypeRegistry.getItem(type)
  }

  /** returns entry at given position */
  public CallbackGetEntryByPos(index: number): VehicleAttachmentEntry {
    return VehicleAttachmentManager.Instance.GetEntryByPos(index)
  }

  public GetEntryByPos(index: number): VehicleAttachmentEntry {
    return this.entryRegistry.getItem(index)
  }

  /** returns entry of given id */
  public CallbackGetEntryByID(id: string): VehicleAttachmentEntry {
    return VehicleAttachmentManager.Instance.GetEntryByID(id)
  }

  public GetEntryByID(id: string): VehicleAttachmentEntry {
    return this.entryRegistryViaID.getItem(id)
  }

  /** returns entry of given type and position */
  public CallbackGetEntryByType(
    type: VEHICLE_ATTACHMENT_TYPE,
    index: number
  ): VehicleAttachmentEntry {
    return VehicleAttachmentManager.Instance.GetEntryByType(type, index)
  }

  public GetEntryByType(
    type: VEHICLE_ATTACHMENT_TYPE,
    index: number
  ): VehicleAttachmentEntry {
    return this.entryRegistryViaType.getItem(type).getItem(index)
  }

  /** returns entry of given rarity and position */
  public CallbackGetEntryByRarity(
    type: RARITY_TYPE,
    index: number
  ): VehicleAttachmentEntry {
    return VehicleAttachmentManager.Instance.GetEntryByRarity(type, index)
  }

  public GetEntryByRarity(
    type: RARITY_TYPE,
    index: number
  ): VehicleAttachmentEntry {
    return this.entryRegistryViaType.getItem(type).getItem(index)
  }

  /** returns data definition that corosponds to the given id */
  public CallbackGetDefByID(
    id: string
  ): VehicleAttachmentDataObject | undefined {
    return VehicleAttachmentManager.Instance.GetDefByID(id)
  }

  public GetDefByID(id: string): undefined | VehicleAttachmentDataObject {
    for (let i = 0; i < VehicleAttachmentData.length; i++) {
      if (VehicleAttachmentData[i].ID === id) return VehicleAttachmentData[i]
    }
    console.error(
      'Vehicle Attachment Manager: failed to find given def=' +
        id +
        ', returned undefined'
    )
    return undefined
  }

  /** returns rarity index (used for slot filtering), when rarities are more fleshed out pop this in the manager */
  public CallbackGetRarityIndex(type: RARITY_TYPE): number {
    return VehicleAttachmentManager.Instance.GetRarityIndex(type)
  }

  public GetRarityIndex(type: RARITY_TYPE): number {
    return this.indexRarityRegistry.getItem(type)
  }

  // attachment display functionality
  //  each attatchment is represented in-game by a custom model that is tied to the player's character
  public curHornAudio: string = ''

  /** updates attachment states based what scene is loaded, this is used as a work around to
        ensure certain attachments are displayed correctly due to the offset to the ground in race maps
    */
  public UpdateAttachmentSceneOffsets(): void {
    // attempt to get attachment pieces
    const attachmentObj = this.equippedAttachmentDict.getItem(
      VEHICLE_ATTACHMENT_TYPE.UNDERGLOW
    )
    if (attachmentObj.ID == null) return
    const attachmentDef = this.GetDefByID(attachmentObj.ID)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!attachmentDef) return

    // update position of attachment based on scene

    const transformUnderglow = Transform.getMutable(attachmentObj.entity)
    if (
      instance.getInstance() === INSTANCE_TYPES.MAIN ||
      instance.getInstance() === INSTANCE_TYPES.RECHARGE ||
      instance.getInstance() === INSTANCE_TYPES.SOLO_SPRINT ||
      instance.getInstance() === INSTANCE_TYPES.SCRAPYARD
    ) {
      transformUnderglow.position = Vector3.create(
        attachmentDef.Offset.position.x + ATTACHMENT_SCENE_OFFSETS[0].x,
        attachmentDef.Offset.position.y + ATTACHMENT_SCENE_OFFSETS[0].y,
        attachmentDef.Offset.position.z + ATTACHMENT_SCENE_OFFSETS[0].z
      )
      transformUnderglow.scale = Vector3.create(
        attachmentDef.Offset.scale.x * ATTACHMENT_SCENE_SCALES[0].x,
        attachmentDef.Offset.scale.y * ATTACHMENT_SCENE_SCALES[0].y,
        attachmentDef.Offset.scale.z * ATTACHMENT_SCENE_SCALES[0].z
      )
    } else {
      transformUnderglow.position = Vector3.create(
        attachmentDef.Offset.position.x + ATTACHMENT_SCENE_OFFSETS[1].x,
        attachmentDef.Offset.position.y + ATTACHMENT_SCENE_OFFSETS[1].y,
        attachmentDef.Offset.position.z + ATTACHMENT_SCENE_OFFSETS[1].z
      )
      transformUnderglow.scale = Vector3.create(
        attachmentDef.Offset.scale.x * ATTACHMENT_SCENE_SCALES[1].x,
        attachmentDef.Offset.scale.y * ATTACHMENT_SCENE_SCALES[1].y,
        attachmentDef.Offset.scale.z * ATTACHMENT_SCENE_SCALES[1].z
      )
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public GetAttachmentObject(index: number) {
    let result = null
    Object.keys(VEHICLE_ATTACHMENT_TYPE).forEach((key) => {
      if (index === 0) result = this.equippedAttachmentDict.getItem(key)
      index--
    })
    return result
  }

  /** removes attachment of given type from the player's character */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public RemoveAttachment(type: VEHICLE_ATTACHMENT_TYPE) {
    if (VehicleAttachmentManager.IsDebugging)
      console.log(
        'Vehicle Attachment Manager: removing attachment type=' + type
      )
    const attachmentObj = this.equippedAttachmentDict.getItem(type)

    // ensure there is an attachment to remove
    if (attachmentObj?.ID === '') return

    // remove id
    attachmentObj.ID = ''

    // process based on effect type
    switch (type) {
      // horn, remove trail
      case VEHICLE_ATTACHMENT_TYPE.TRAILS:
        // VehicleTrailEffect.RemoveTrailEffectProviderFromPlayer(this.playerID)
        break
      // horn, set sound source
      case VEHICLE_ATTACHMENT_TYPE.HORN:
        this.curHornAudio = ''
        break
      // underglow
      case VEHICLE_ATTACHMENT_TYPE.UNDERGLOW:
        Transform.getMutable(attachmentObj.entity).scale = Vector3.Zero()
        break
      // other type, remove model
      default:
        // remove model
        GltfContainer.deleteFrom(attachmentObj.entity)
        break
    }
  }

  /** applies the given attachment to the player's character */
  public ApplyAttachment(id: VEHICLE_ATTACHMENT): void {
    if (VehicleAttachmentManager.IsDebugging)
      console.log(
        'Vehicle Attachment Manager: attempting to apply new attachment ID=' +
          id
      )
    // attempt to get def
    const attachmentDef = this.GetDefByID(id)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!attachmentDef) return
    // get attachment object
    const attachmentObj = this.equippedAttachmentDict.getItem(
      attachmentDef.Type
    )
    if (VehicleAttachmentManager.IsDebugging)
      console.log(
        'Vehicle Attachment Manager: applying attachment type=' +
          attachmentDef.Type +
          ', ID=' +
          attachmentDef.ID
      )

    // remove previous attachment of same type
    if (attachmentObj.ID != null) this.RemoveAttachment(attachmentDef.Type)

    // update attachment object
    attachmentObj.ID = attachmentDef.ID

    // process based on effect type
    switch (attachmentDef.Type) {
      // horn, redefine trail
      case VEHICLE_ATTACHMENT_TYPE.TRAILS:
        // test for creating based on player location (for propigating to other players)
        // VehicleTrailEffect.CreateTrailEffectProviderOnPlayer({
        //   id: this.playerID,
        //   modelPath: attachmentDef.Content,
        //   parent: engine.PlayerEntity,
        //   displayPosition: Vector3.create(
        //     attachmentDef.Offset.position.x,
        //     attachmentDef.Offset.position.y,
        //     attachmentDef.Offset.position.z
        //   ),
        //   displayScale: Vector3.create(
        //     attachmentDef.Offset.scale.x,
        //     attachmentDef.Offset.scale.y,
        //     attachmentDef.Offset.scale.z
        //   ),
        //   displayLookAt: undefined
        // })
        break
      // horn, set sound source
      case VEHICLE_ATTACHMENT_TYPE.HORN:
        this.curHornAudio = attachmentDef.ID
        break
      // underglow
      case VEHICLE_ATTACHMENT_TYPE.UNDERGLOW:
        // update material
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        Material.setPbrMaterial(this.underglow.entity, {
          texture: Material.Texture.Common({
            src: attachmentDef.Content,
            wrapMode: 1
          }),
          castShadows: false,
          transparencyMode: 2,
          alphaTest: 0.5,
          metallic: 0,
          roughness: 1
        })
        // reassert position

        // eslint-disable-next-line no-case-declarations
        const transformUnderglow = Transform.getMutable(attachmentObj.entity)
        transformUnderglow.position = Vector3.create(
          attachmentDef.Offset.position.x,
          attachmentDef.Offset.position.y,
          attachmentDef.Offset.position.z
        )
        transformUnderglow.scale = Vector3.create(
          attachmentDef.Offset.scale.x,
          attachmentDef.Offset.scale.y,
          attachmentDef.Offset.scale.z
        )
        transformUnderglow.rotation = Quaternion.fromEulerDegrees(
          attachmentDef.Offset.rotation.x,
          attachmentDef.Offset.rotation.y,
          attachmentDef.Offset.rotation.z
        )
        break

      // other type, manipulate object
      default:
        // overwrite model
        GltfContainer.create(attachmentObj.entity, {
          src: attachmentDef.Content
        })
        // reassert position
        // eslint-disable-next-line no-case-declarations
        const transform = Transform.getMutable(attachmentObj.entity)
        transform.position = Vector3.create(
          attachmentDef.Offset.position.x,
          attachmentDef.Offset.position.y,
          attachmentDef.Offset.position.z
        )
        transform.scale = Vector3.create(
          attachmentDef.Offset.scale.x,
          attachmentDef.Offset.scale.y,
          attachmentDef.Offset.scale.z
        )
        transform.rotation = Quaternion.fromEulerDegrees(
          attachmentDef.Offset.rotation.x,
          attachmentDef.Offset.rotation.y,
          attachmentDef.Offset.rotation.z
        )
        break
    }
    if (VehicleAttachmentManager.IsDebugging)
      console.log(
        'Vehicle Attachment Manager: applied attachment type=' +
          attachmentDef.Type +
          ', ID=' +
          attachmentDef.ID
      )
  }

  /** plays the horn sound via audio manager */
  public PlayHornSound(): void {
    // ensure a horn sound is active
    if (this.curHornAudio === '') return

    if (VehicleAttachmentManager.IsDebugging)
      console.log('Vehicle Attachment Manager: played attached horn sfx')
    AudioManager.Instance.PlaySound(this.curHornAudio.toString())
  }
}
