// ███████╗ ██████╗███████╗███╗   ██╗███████╗    ██████╗  █████╗ ██████╗ ███████╗███╗   ██╗████████╗
// ██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝    ██╔══██╗██╔══██╗██╔══██╗██╔════╝████╗  ██║╚══██╔══╝
// ███████╗██║     █████╗  ██╔██╗ ██║█████╗      ██████╔╝███████║██████╔╝█████╗  ██╔██╗ ██║   ██║
// ╚════██║██║     ██╔══╝  ██║╚██╗██║██╔══╝      ██╔═══╝ ██╔══██║██╔══██╗██╔══╝  ██║╚██╗██║   ██║
// ███████║╚██████╗███████╗██║ ╚████║███████╗    ██║     ██║  ██║██║  ██║███████╗██║ ╚████║   ██║
// ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝╚══════╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝
//
// Note the 180 rotation, this is so that position in Blender align with positions in DCL (with Y and Z swapped)

import { Vector3, Quaternion } from '@dcl/sdk/math'
import { CONFIG } from '../_config'
import { Door } from './class.door'
import { Animator, AudioSource } from '@dcl/sdk/ecs'

export class DoorBroken extends Door {
  // Audio sources
  public sfx = {
    open: CONFIG.SFX_DOOR_REGULAR_OPEN[0],
    close: CONFIG.SFX_DOOR_REGULAR_CLOSE[0],
    lock: CONFIG.SFX_DOOR_REGULAR_LOCK[0],
    unlock: CONFIG.SFX_DOOR_REGULAR_UNLOCK[0],
    broken: CONFIG.SFX_DOOR_BROKEN_LOOP
  }

  constructor(
    gltfSrc: string,
    position: Vector3,
    scale: Vector3,
    rotation: Quaternion,
    hasTrigger: boolean = true,
    oneWayTrigger: boolean = false,
    _triggerTransformP = Vector3.create(0, 0, 0),
    _triggerTransformS = Vector3.create(7, 4, 6),
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

    // Start the broken loop
    this.startBrokenDoor()
  }

  enable(): void {
    super.enable()

    this.startBrokenDoor()
  }

  disable(): void {
    super.disable()

    this.stopBrokenDoor()
  }

  public onEnterTriggerZone(): void {
    // Do Nothing, but need to over-ride default action
  }

  public onExitTriggerZone(): void {
    // Do nothing, but need to over-ride default action
  }

  public startBrokenDoor(): void {
    // Trigger the broken animation to play as default
    Animator.getClip(this.gltfEntity.entity, 'broken').playing = true

    // Trigger the sfx in a loop 
    // TODO: Fix sound system
    // AudioSource.playSound(this.foo, this.sfx.lock)
    // AudioSource.getMutable(this.foo).loop = true
  }

  public stopBrokenDoor(): void {
    // Stop the door loop
    Animator.getClip(this.gltfEntity.entity, 'broken').playing = false

    // Stop the sfx playing

    AudioSource.getMutable(this.foo).playing = false
  }
}
