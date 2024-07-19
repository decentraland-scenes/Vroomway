import {
  type Entity,
  executeTask,
  engine,
  Transform,
  AudioSource,
  AvatarAttach,
  AvatarAnchorPointType
} from '@dcl/sdk/ecs'
import { getUserData } from '~system/UserIdentity'
import { OmitFromCleanUpFlag } from './cleanupScene'
import Dictionary from './collections'

/*      AUDIO MANAGER
    controls audio components in-scene

    Author: TheCryptoTrader69 (Alex Pazder)
    Contact: TheCryptoTrader69@gmail.com
*/
export class AudioManager {
  /** access pocketing */
  private static instance: undefined | AudioManager
  public static get Instance(): AudioManager {
    // ensure instance is set
    if (AudioManager.instance === undefined) {
      AudioManager.instance = new AudioManager()
    }

    return AudioManager.instance
  }

  /** parental object, all audio/sfx objects are children of this */
  parentEntity: Entity

  /** registry of all audio that can be played */
  audioDict: Dictionary<Entity>

  // constructor
  constructor() {
    console.log('Audio Manager: initializaing...')
    // create parental object
    //  entity
    this.parentEntity = engine.addEntity()
    OmitFromCleanUpFlag.create(this.parentEntity)
    // get player id & tie sound parent to player
    executeTask(async () => {
      // get player data
      const result = await getUserData({})
      // attach to player character
      AvatarAttach.createOrReplace(this.parentEntity, {
        avatarId: result.data?.userId,
        anchorPointId: AvatarAnchorPointType.AAPT_NAME_TAG
      })
    })
    // initialize collection
    this.audioDict = new Dictionary<Entity>()
    console.log('Audio Manager: initialized!')
  }

  AddSound(key: string, location: string): void {
    // ensure key is not empty
    if (key === '') return
    // entity
    const soundEntity = engine.addEntity()
    OmitFromCleanUpFlag.create(soundEntity)
    Transform.create(soundEntity, { parent: this.parentEntity })
    // audio clip
    AudioSource.createOrReplace(soundEntity, {
      audioClipUrl: location,
      loop: false,
      playing: false,
      volume: 1
    })
    // add to collection
    this.audioDict.addItem(key, soundEntity)
    console.log(
      'Audio Manager: added sound key=' + key + ', source=' + location
    )
  }

  PlaySound(key: string): void {
    // ensure key exists in dict
    if (!this.audioDict.containsKey(key)) return
    console.log('Audio Manager: play sound key=' + key)
    // get entity
    const entity: Entity = this.audioDict.getItem(key)
    // reset the place state to play from start
    AudioSource.getMutable(entity).loop = false
    AudioSource.getMutable(entity).playing = true
  }
}
