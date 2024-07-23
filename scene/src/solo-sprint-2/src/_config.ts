//  ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗
// ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝
// ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗
// ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║
// ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝
//  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝
//

import { type Entity, Transform } from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { entityController } from '../../utils/entity-controller'

export class Config {
  public ROOT_DIR: string = 'src/solo-sprint-2/'
  // public ROOT_DIR: string = ""

  //  ██████╗ ██╗  ████████╗███████╗
  // ██╔════╝ ██║  ╚══██╔══╝██╔════╝
  // ██║  ███╗██║     ██║   █████╗
  // ██║   ██║██║     ██║   ██╔══╝
  // ╚██████╔╝███████╗██║   ██║
  //  ╚═════╝ ╚══════╝╚═╝   ╚═╝
  //
  // Set the current GLTF path and file extension. During dev this is GLTF
  // During prod this is most likely GLB
  // This changes which models are currently being loaded by the scene
  public GLTF_EXT = '.glb'

  // Set the directory. Doesn't support absolute paths :(
  // public GLTF_DIR = "models/glb/"
  public GLTF_DIR = this.ROOT_DIR + 'models/glb/'

  // ██████╗ ███████╗██████╗ ██╗   ██╗ ██████╗
  // ██╔══██╗██╔════╝██╔══██╗██║   ██║██╔════╝
  // ██║  ██║█████╗  ██████╔╝██║   ██║██║  ███╗
  // ██║  ██║██╔══╝  ██╔══██╗██║   ██║██║   ██║
  // ██████╔╝███████╗██████╔╝╚██████╔╝╚██████╔╝
  // ╚═════╝ ╚══════╝╚═════╝  ╚═════╝  ╚═════╝
  //

  // Enable the keybindings used for dev shortcuts? Should be false for production
  public ENABLE_DEBUG_KEYBINDS = false

  // Show all trigger zones? Should be false for production
  public SHOW_TRIGGER_BOXES = false

  // DEBUG MATERIALS
  public DEBUG_MATERIAL_ORANGE = Color4.create(1.0, 0.6, 0.0, 0.4)
  public DEBUG_MATERIAL_GREEN = Color4.create(0.0, 1.0, 0.2, 0.4)
  public DEBUG_MATERIAL_RED = Color4.create(1.0, 0.2, 0.0, 0.4)

  // ███████╗ ██████╗███████╗███╗   ██╗███████╗    ██████╗  █████╗ ██████╗ ███████╗███╗   ██╗████████╗███████╗
  // ██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝    ██╔══██╗██╔══██╗██╔══██╗██╔════╝████╗  ██║╚══██╔══╝██╔════╝
  // ███████╗██║     █████╗  ██╔██╗ ██║█████╗      ██████╔╝███████║██████╔╝█████╗  ██╔██╗ ██║   ██║   ███████╗
  // ╚════██║██║     ██╔══╝  ██║╚██╗██║██╔══╝      ██╔═══╝ ██╔══██║██╔══██╗██╔══╝  ██║╚██╗██║   ██║   ╚════██║
  // ███████║╚██████╗███████╗██║ ╚████║███████╗    ██║     ██║  ██║██║  ██║███████╗██║ ╚████║   ██║   ███████║
  // ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝╚══════╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝
  //
  // --- SCENE PARENT TRANSFORMS
  public _SCENE_ROOT: Entity

  public SCENE_TRANSFORM = {
    position: Vector3.create(0, 0, 0),
    rotation: Quaternion.fromEulerDegrees(0, 0, 0),
    scale: Vector3.create(1, 1, 1)
  }

  public SCENE_TRANSFORM_180 = {
    position: Vector3.create(0, 0, 0),
    rotation: Quaternion.fromEulerDegrees(0, 180, 0),
    scale: Vector3.create(1, 1, 1)
  }

  // CACHE
  // Specify the size and location for cached/hidden scene objects.
  public _SCENE_CACHE: Entity
  public SCENE_CACHE_TRANSFORM = {
    position: Vector3.create(1, 3, 1),
    rotation: Quaternion.fromEulerDegrees(0, 0, 0),
    scale: Vector3.create(0.01, 0.01, 0.01)
  }

  // ███████╗███████╗██╗  ██╗
  // ██╔════╝██╔════╝╚██╗██╔╝
  // ███████╗█████╗   ╚███╔╝
  // ╚════██║██╔══╝   ██╔██╗
  // ███████║██║     ██╔╝ ██╗
  // ╚══════╝╚═╝     ╚═╝  ╚═╝
  //
  // Zappers
  public SFX_ZAPPER_IDLE = this.ROOT_DIR + 'sfx/zapper.idle.mp3'
  public SFX_ZAPPER_ZAP_01 = this.ROOT_DIR + 'sfx/zapper.zap.01.mp3'
  public SFX_ZAPPER_ZAP_02 = this.ROOT_DIR + 'sfx/zapper.zap.02.mp3'
  public SFX_ZAPPER_ZAP_03 = this.ROOT_DIR + 'sfx/zapper.zap.04.mp3'
  public SFX_ZAPPER_ZAP_04 = this.ROOT_DIR + 'sfx/zapper.zap.05.mp3'
  public SFX_LOCK_FAIL = this.ROOT_DIR + 'sfx/lock.fail.mp3'
  public SFX_LOCK_INTERACT = this.ROOT_DIR + 'sfx/lock.increment.mp3'
  public SFX_LOCK_SUCCESS = this.ROOT_DIR + 'sfx/lock.success.mp3'

  // ██████╗  █████╗ ██████╗ ████████╗██╗ ██████╗██╗     ███████╗███████╗
  // ██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██║██╔════╝██║     ██╔════╝██╔════╝
  // ██████╔╝███████║██████╔╝   ██║   ██║██║     ██║     █████╗  ███████╗
  // ██╔═══╝ ██╔══██║██╔══██╗   ██║   ██║██║     ██║     ██╔══╝  ╚════██║
  // ██║     ██║  ██║██║  ██║   ██║   ██║╚██████╗███████╗███████╗███████║
  // ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝╚══════╝╚══════╝╚══════╝
  //

  public BUBBLES_SPEED_MIN = 0.5
  public BUBBLES_SPEED_MAX = 1.0

  public SHARK_SPEED_MIN = 0.9
  public SHARK_SPEED_MAX = 1.1

  public FISH_SPEED_MIN = 0.75
  public FISH_SPEED_MAX = 1.0

  // ██╗      ██████╗  ██████╗██╗  ██╗███████╗
  // ██║     ██╔═══██╗██╔════╝██║ ██╔╝██╔════╝
  // ██║     ██║   ██║██║     █████╔╝ ███████╗
  // ██║     ██║   ██║██║     ██╔═██╗ ╚════██║
  // ███████╗╚██████╔╝╚██████╗██║  ██╗███████║
  // ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝
  //

  public LOCK_CLICKER_MIN = 3
  public LOCK_CLICKER_MAX = 10

  // ██████╗  ██████╗  ██████╗ ██████╗ ███████╗
  // ██╔══██╗██╔═══██╗██╔═══██╗██╔══██╗██╔════╝
  // ██║  ██║██║   ██║██║   ██║██████╔╝███████╗
  // ██║  ██║██║   ██║██║   ██║██╔══██╗╚════██║
  // ██████╔╝╚██████╔╝╚██████╔╝██║  ██║███████║
  // ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝
  //
  // Doors: Regular
  public SFX_DOOR_REGULAR_OPEN = this.ROOT_DIR + 'sfx/door.open.01.mp3'
  public SFX_DOOR_REGULAR_CLOSE = this.ROOT_DIR + 'sfx/door.close.01.mp3'
  public SFX_DOOR_REGULAR_LOCK = this.ROOT_DIR + 'sfx/door.regular.lock.01.mp3'
  public SFX_DOOR_REGULAR_UNLOCK =
    this.ROOT_DIR + 'sfx/door.regular.unlock.01.mp3'

  // Doors: Large
  public SFX_DOOR_LARGE_OPEN = [
    this.ROOT_DIR + 'sfx/door.open.13.mp3',
    this.ROOT_DIR + 'sfx/door.open.12.mp3'
  ]

  public SFX_DOOR_LARGE_CLOSE = [
    this.ROOT_DIR + 'sfx/door.close.13.mp3',
    this.ROOT_DIR + 'sfx/door.close.12.mp3'
  ]

  public SFX_DOOR_LARGE_LOCK = this.ROOT_DIR + 'sfx/door.large.lock.01.mp3'
  public SFX_DOOR_LARGE_UNLOCK = this.ROOT_DIR + 'sfx/door.large.unlock.01.mp3'

  // Door: Broken
  public SFX_DOOR_BROKEN_LOOP = this.ROOT_DIR + 'sfx/door.large.unlock.01.mp3'

  //  ██████╗ ██████╗ ███╗   ██╗███████╗███████╗████████╗██████╗ ██╗   ██╗ ██████╗████████╗ ██████╗ ██████╗
  // ██╔════╝██╔═══██╗████╗  ██║██╔════╝██╔════╝╚══██╔══╝██╔══██╗██║   ██║██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗
  // ██║     ██║   ██║██╔██╗ ██║███████╗███████╗   ██║   ██████╔╝██║   ██║██║        ██║   ██║   ██║██████╔╝
  // ██║     ██║   ██║██║╚██╗██║╚════██║╚════██║   ██║   ██╔══██╗██║   ██║██║        ██║   ██║   ██║██╔══██╗
  // ╚██████╗╚██████╔╝██║ ╚████║███████║███████║   ██║   ██║  ██║╚██████╔╝╚██████╗   ██║   ╚██████╔╝██║  ██║
  //  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝  ╚═════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝
  //

  // Init the scene
  constructor() {
    console.log('// CONFIG LOAD')

    // Add the scene root - used by the SceneManager system
    this._SCENE_ROOT = entityController.addEntity()
    Transform.createOrReplace(this._SCENE_ROOT, {
      position: this.SCENE_TRANSFORM.position,
      scale: this.SCENE_TRANSFORM.scale,
      rotation: this.SCENE_TRANSFORM.rotation
    })

    // Add the scene cache - used by the SceneManager system
    this._SCENE_CACHE = entityController.addEntity()
    Transform.createOrReplace(this._SCENE_CACHE, {
      position: this.SCENE_CACHE_TRANSFORM.position,
      scale: this.SCENE_CACHE_TRANSFORM.scale,
      rotation: this.SCENE_CACHE_TRANSFORM.rotation
    })
  }
}

export const CONFIG = new Config()
