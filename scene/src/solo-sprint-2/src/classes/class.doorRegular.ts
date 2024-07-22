// ███████╗ ██████╗███████╗███╗   ██╗███████╗    ██████╗  █████╗ ██████╗ ███████╗███╗   ██╗████████╗
// ██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝    ██╔══██╗██╔══██╗██╔══██╗██╔════╝████╗  ██║╚══██╔══╝
// ███████╗██║     █████╗  ██╔██╗ ██║█████╗      ██████╔╝███████║██████╔╝█████╗  ██╔██╗ ██║   ██║
// ╚════██║██║     ██╔══╝  ██║╚██╗██║██╔══╝      ██╔═══╝ ██╔══██║██╔══██╗██╔══╝  ██║╚██╗██║   ██║
// ███████║╚██████╗███████╗██║ ╚████║███████╗    ██║     ██║  ██║██║  ██║███████╗██║ ╚████║   ██║
// ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝╚══════╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝
//
// Note the 180 rotation, this is so that position in Blender align with positions in DCL (with Y and Z swapped)

import { Vector3, Quaternion } from '@dcl/sdk/math'
import { CONFIG } from '../scenes/_config'
import { Door } from './class.door'

export class DoorRegular extends Door {
  // Audio sources
  public sfx = {
    open: CONFIG.SFX_DOOR_REGULAR_OPEN[0],
    close: CONFIG.SFX_DOOR_REGULAR_CLOSE[0],
    lock: CONFIG.SFX_DOOR_REGULAR_LOCK[0],
    unlock: CONFIG.SFX_DOOR_REGULAR_UNLOCK[0]
  }

  constructor(
    gltfSrc: string,
    position: Vector3,
    scale: Vector3,
    rotation?: Quaternion,
    hasTrigger: boolean = true,
    oneWayTrigger: boolean = false,
    _triggerTransformP = Vector3.create(0, 0, 0.25),
    _triggerTransformS = Vector3.create(4, 4, 6),
    _triggerTransformR = Quaternion.fromEulerDegrees(0, 0, 0),
    isLocked: boolean = false
  ) {
    super(
      gltfSrc,
      position,
      scale,
      rotation,
      hasTrigger,
      oneWayTrigger,
      _triggerTransformP,
      _triggerTransformS,
      _triggerTransformR,
      isLocked
    )

    // Must call addSoundFX() again for the correct sound effects to take effect, otherwise there will be no audio
    this.addSoundFX()
  }
}
