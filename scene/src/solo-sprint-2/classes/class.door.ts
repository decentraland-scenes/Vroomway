// ███████╗ ██████╗███████╗███╗   ██╗███████╗    ██████╗  █████╗ ██████╗ ███████╗███╗   ██╗████████╗
// ██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝    ██╔══██╗██╔══██╗██╔══██╗██╔════╝████╗  ██║╚══██╔══╝
// ███████╗██║     █████╗  ██╔██╗ ██║█████╗      ██████╔╝███████║██████╔╝█████╗  ██╔██╗ ██║   ██║
// ╚════██║██║     ██╔══╝  ██║╚██╗██║██╔══╝      ██╔═══╝ ██╔══██║██╔══██╗██╔══╝  ██║╚██╗██║   ██║
// ███████║╚██████╗███████╗██║ ╚████║███████╗    ██║     ██║  ██║██║  ██║███████╗██║ ╚████║   ██║
// ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝╚══════╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝
//
// Note the 180 rotation, this is so that position in Blender align with positions in DCL (with Y and Z swapped)

import * as utils from '@dcl-sdk/utils'
import { Animator, AudioSource, type Entity, Transform } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { GLTFEntity } from './class.gltfEntity'
import { entityController } from '../../utils/entityController'
import { CONFIG } from '../_config'
import { TriggerZone } from './class.triggerZone'

export class Door {
  entity: Entity
  // Internal stuff
  enabled: boolean = false
  gltfEntity: GLTFEntity
  trigger?: TriggerZone
  foo: Entity

  // Public, generic properties
  public cooldown: number = 1000
  public isBusy: boolean = false
  public isOpen: boolean = false
  public isLocked: boolean = false

  // Private, for internal reference
  private readonly startLocked: boolean = false
  private readonly startOpenv: boolean = false

  // Audio sources
  public sfx = {
    open: CONFIG.SFX_DOOR_REGULAR_OPEN[0],
    close: CONFIG.SFX_DOOR_REGULAR_CLOSE[0],
    lock: CONFIG.SFX_DOOR_REGULAR_LOCK[0],
    unlock: CONFIG.SFX_DOOR_REGULAR_UNLOCK[0]
  }

  // Constructor
  constructor(
    gltfSrc: string,
    position?: Vector3,
    scale?: Vector3,
    rotation?: Quaternion,
    hasTrigger: boolean = true,
    oneWayTrigger: boolean = false,
    _triggerTransformP = Vector3.create(0, 0, 0),
    _triggerTransformS = Vector3.create(7.5, 5, 10),
    _triggerTransformR = Quaternion.fromEulerDegrees(0, 0, 0),
    isLocked: boolean = false
  ) {
    this.entity = entityController.addEntity()
    this.foo = entityController.addEntity()
    // Add the basic components
    Transform.create(this.entity, {
      position,
      scale,
      rotation
    })
    // Set starting/default states
    if (isLocked) {
      this.isLocked = true
      this.startLocked = true
    }
    // Add a trigger zone, if required
    if (hasTrigger) {
      // Amend the transform for one-way triggers (half it, and offset it)
      if (oneWayTrigger) {
        _triggerTransformP.z = _triggerTransformS.z / 2
        _triggerTransformP.z += _triggerTransformS.z / 2 + 0.2
      }

      // Create a trigger zone placeholder
      this.trigger = new TriggerZone(
        _triggerTransformP,
        _triggerTransformS,
        _triggerTransformR,
        () => {
          this.onEnterTriggerZone()
        },
        () => {
          this.onExitTriggerZone()
        }
      )
      Transform.createOrReplace(this.trigger.entity, { parent: this.entity })
      Transform.getMutable(this.trigger.entity).scale = _triggerTransformS
    }
    // Add the gltfShape as a child of self
    this.gltfEntity = new GLTFEntity(gltfSrc)
    Transform.createOrReplace(this.gltfEntity.entity, { parent: this.entity })

    // Add the animator
    Animator.createOrReplace(this.gltfEntity.entity, {
      states: [
        {
          clip: 'open',
          loop: false,
          speed: 1.75,
          weight: 0
        },
        {
          clip: 'close',
          loop: false,
          speed: 1.75,
          weight: 0
        },
        {
          clip: 'lock',
          loop: false,
          speed: 1.75,
          weight: 1
        },
        {
          clip: 'unlock',
          loop: false,
          speed: 1.75,
          weight: 1
        },
        {
          clip: 'broken',
          loop: true,
          weight: 1,
          speed: 1.0
        }
      ]
    })

    // Add the sound effects
    // this.addSoundFX()

    // Bug workaround to ensure the correct pose on spawn
    this.resetAnimationState()
  }

  public removerTriggerEntity(): void {
    if (this.trigger != null) {
      utils.triggers.removeTrigger(this.trigger.entity)
      entityController.removeEntity(this.trigger.entity)
    }
  }

  public reset(): void {
    this.isOpen = false
    this.isBusy = false
    this.isLocked = this.startLocked

    this.resetAnimationState()
  }

  public enable(): void {
    console.log('door enabled')
    this.enabled = true

    // Enable any triggers
    if (this.trigger != null) {
      this.trigger.enable()
    }

    // Bug workaround to ensure the correct pose on spawn
    this.resetAnimationState()
  }

  public disable(): void {
    this.enabled = false

    // Disable any triggers
    if (this.trigger != null) {
      this.trigger.disable()
    }
  }

  public resetAnimationState(): void {
    // Bug workaround to ensure the correct pose on spawn
    if (this.isOpen) {
      Animator.getClip(this.gltfEntity.entity, 'close').playing = false
    } else {
      Animator.getClip(this.gltfEntity.entity, 'close').playing = true
      Animator.getClip(this.gltfEntity.entity, 'open').playing = false
    }

    if (this.isLocked) {
      Animator.getClip(this.gltfEntity.entity, 'lock').playing = false
    } else {
      Animator.getClip(this.gltfEntity.entity, 'unlock').playing = false
    }
  }

  public onEnterTriggerZone(): void {
    if (this.enabled) {
      this.openDoor()
    }
  }

  public onExitTriggerZone(): void {
    if (this.enabled) {
      this.closeDoor()
    }
  }

  addSoundFX(): void {
    // Add the various sound effects by creating a child entity
    // We'll never need to interact with these children directly, so we
    // skip naming them, lest we develop an attachment or feelings.
    // AudioSource.createOrReplace(this.foo)
  }

  setBusy(): void {
    // Reset the flag after the delay
    this.isBusy = true
    utils.timers.setTimeout(() => {
      this.isBusy = false
    }, this.cooldown)
    this.trigger?.shadeOrange()
    utils.timers.setTimeout(() => {
      this.trigger?.shadeGreen()
    }, this.cooldown)
  }

  public unlockAndOpenDoor(force: boolean = false): void {
    if (!this.isBusy || force) {
      // Unlock the door
      this.unlockDoor()

      if (!this.isOpen || force) {
        this.openDoor(true, true)
      }
    }
  }

  public lockAndCloseDoor(
    forceBusy: boolean = false,
    forceClose: boolean = false
  ): void {
    if (!this.isBusy || forceBusy) {
      // Unlock the door
      this.lockDoor()

      if (this.isOpen || forceClose) {
        this.closeDoor(true, true)
      }
    }
  }

  // Set public methods for locking and unlocking door
  public lockDoor(playAudio = true): void {
    this.isLocked = true
    Animator.getClip(this.gltfEntity.entity, 'lock').playing = true
    if (playAudio) {
      AudioSource.playSound(this.foo, this.sfx.lock)
    }
  }

  public unlockDoor(playAudio = true): void {
    this.isLocked = false
    Animator.playSingleAnimation(this.gltfEntity.entity, 'unlock')

    if (playAudio) {
      AudioSource.playSound(this.foo, this.sfx.unlock)
    }
  }

  /**
   * Exposing `openDoor` as an action this object is capable of doing
   * This contains the open door experience (animation and sound) while allowing
   * the scene to decide when the action occurs
   */

  public openDoor(playAudio = true, force = false): void {
    if (!this.isBusy || force) {
      if ((!this.isLocked && !this.isOpen) || force) {
        this.setBusy()
        this.isOpen = true
        Animator.playSingleAnimation(this.gltfEntity.entity, 'open')
        if (playAudio) {
          AudioSource.playSound(this.foo, this.sfx.open)
        }
      }
    } else {
      utils.timers.setTimeout(() => {
        this.openDoor(playAudio, force)
      }, this.cooldown)
    }
  }

  // Similiarly we can close the door.
  public closeDoor(playAudio = true, force = false): void {
    if (!this.isBusy || force) {
      if ((!this.isLocked && this.isOpen) || force) {
        this.setBusy()
        this.isOpen = false
        Animator.playSingleAnimation(this.gltfEntity.entity, 'close')

        if (playAudio) {
          AudioSource.playSound(this.foo, this.sfx.close)
        }
      }
    } else {
      utils.timers.setTimeout(() => {
        this.closeDoor(playAudio, force)
      }, this.cooldown)
    }
  }
}
