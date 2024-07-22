// ███████╗ ██████╗███████╗███╗   ██╗███████╗    ██████╗  █████╗ ██████╗ ███████╗███╗   ██╗████████╗
// ██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝    ██╔══██╗██╔══██╗██╔══██╗██╔════╝████╗  ██║╚══██╔══╝
// ███████╗██║     █████╗  ██╔██╗ ██║█████╗      ██████╔╝███████║██████╔╝█████╗  ██╔██╗ ██║   ██║
// ╚════██║██║     ██╔══╝  ██║╚██╗██║██╔══╝      ██╔═══╝ ██╔══██║██╔══██╗██╔══╝  ██║╚██╗██║   ██║
// ███████║╚██████╗███████╗██║ ╚████║███████╗    ██║     ██║  ██║██║  ██║███████╗██║ ╚████║   ██║
// ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝╚══════╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝
//
// Note the 180 rotation, this is so that position in Blender align with positions in DCL (with Y and Z swapped)

import { AudioSource, engine, Material, Transform } from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'
import { movePlayerTo } from '~system/RestrictedActions'
import { CONFIG } from '../scenes/_config'
import { GLTFEntity } from './class.gltfEntity'
import { TriggerZone } from './class.triggerZone'
import * as utils from '@dcl-sdk/utils'

export class Zapper {
  entity = engine.addEntity()
  // Internal stuff
  enabled: boolean = false
  gltfEntity: GLTFEntity
  trigger?: TriggerZone

  public isBusy: boolean = false
  public cooldown: number = 4000
  public duration: number = 1500

  // Audio sources
  audioSrc_idle = CONFIG.SFX_ZAPPER_IDLE
  audioSrcs_zaps = [
    CONFIG.SFX_ZAPPER_ZAP_01,
    CONFIG.SFX_ZAPPER_ZAP_02,
    CONFIG.SFX_ZAPPER_ZAP_03,
    CONFIG.SFX_ZAPPER_ZAP_04
  ]

  // Last played index to avoid repeating sounds
  last_index = Math.floor(Math.random() * this.audioSrcs_zaps.length)

  constructor(
    gltfSrc: string,
    position: Vector3,
    scale: Vector3,
    rotation: Quaternion,
    duration?: number
  ) {
    this.entity = engine.addEntity()

    // Add the basic components
    Transform.createOrReplace(this.entity, {
      position,
      scale,
      rotation
    })
    // Add the gltfShape as a child of self
    this.gltfEntity = new GLTFEntity(gltfSrc)
    Transform.createOrReplace(this.gltfEntity.entity, { parent: this.entity })

    // Set the freeze duration
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/prefer-nullish-coalescing
    this.duration = duration || this.duration

    // Add the sound effects
    this.addSoundEffects()

    // Add the trigger zone
    this.createTriggerZone(position, scale, rotation)
  }

  addSoundEffects(): void {
    // Add the looping sound effect
    const childSound1 = engine.addEntity()
    AudioSource.create(childSound1, { audioClipUrl: this.audioSrc_idle })
    Transform.create(childSound1, { parent: this.entity })
    AudioSource.getMutable(childSound1).loop = true
    AudioSource.getMutable(childSound1).volume = 0.4

    // Add the triggered zap effects
    for (let i = 0; i < this.audioSrcs_zaps.length; i++) {
      const foo = engine.addEntity()
      Transform.create(foo, { parent: this.entity })
      AudioSource.create(foo, { audioClipUrl: this.audioSrcs_zaps[i] })
    }
  }

  createTriggerZone(
    position: Vector3,
    scale: Vector3,
    rotation: Quaternion
  ): void {
    // Add the trigger zone
    const triggerTransform = {
      position: Vector3.create(0, -4, 0),
      scale: Vector3.create(3, 4, 1.5),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    }

    const eulerY = Math.round(rotation.y)

    if (eulerY === 90 || eulerY === 270) {
      // If the zapper is rotated then swap the x and z sizes
      ;[triggerTransform.scale.x, triggerTransform.scale.z] = [
        triggerTransform.scale.z,
        triggerTransform.scale.x
      ]

      triggerTransform.rotation = Quaternion.fromEulerDegrees(0, 90, 0)
    }

    // Add a reference to this for use in the trigger box constructor below
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const triggerParent = this
    this.trigger = new TriggerZone(
      triggerTransform.position,
      triggerTransform.scale,
      triggerTransform.rotation,
      function () {
        triggerParent.zapPlayer()
      }
    )
    Transform.getOrCreateMutable(this.trigger.entity).parent = this.entity
  }

  /**
	 Zaps the player, plays a sound effect, and teleports them in place for a few seconds
	*/

  public zapPlayer(): void {
    if (!this.isBusy) {
      this.setBusy()

      this.playRandomZapSound()
      // Freeze the player in position for the specified duration
      const CameraPos = Transform.get(engine.CameraEntity).position
      const freezePosition = Vector3.clone(CameraPos)
      freezePosition.y -= 0.5

      const freezeInterval = 50
      for (let i = 0; i < this.duration; i += freezeInterval) {
        utils.timers.setTimeout(() => {
          void movePlayerTo({ newRelativePosition: freezePosition })
        }, i)
      }
      // Debugging: change the material color to indicate the zone is in cooldown
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (this.trigger && this.trigger.entity) {
        Material.getMutable(this.entity).material = {
          $case: 'pbr',
          pbr: { albedoColor: CONFIG.DEBUG_MATERIAL_ORANGE } // Use the correct color format
        }
      }
    }
  }

  public enable(): void {
    this.enabled = true

    // Enable any triggers
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this.trigger) {
      this.trigger.enable()
    }

    this.gltfEntity.enable()
  }

  public disable(): void {
    this.enabled = false

    // Disable any triggers
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this.trigger) {
      this.trigger.disable()
    }

    this.gltfEntity.disable()
  }

  setBusy(): void {
    // Sets the Entity as "busy" to avoid repeat firings and allow for escape
    this.isBusy = true

    // DEBUG
    if (CONFIG.SHOW_TRIGGER_BOXES) {
      Material.getMutable(this.entity).material = {
        $case: 'pbr',
        pbr: { albedoColor: CONFIG.DEBUG_MATERIAL_RED } // Use the correct color format
      }
    }

    utils.timers.setTimeout(() => {
      this.isBusy = false
      if (CONFIG.SHOW_TRIGGER_BOXES) {
        Material.getMutable(this.entity).material = {
          $case: 'pbr',
          pbr: { albedoColor: CONFIG.DEBUG_MATERIAL_GREEN } // Use the correct color format
        }
      }
    }, this.cooldown)
  }

  // Plays a random effect
  playRandomZapSound(): void {
    // Play a random zapping sound effect
    let randomIndex = this.last_index
    while (randomIndex === this.last_index) {
      randomIndex = Math.floor(Math.random() * this.audioSrcs_zaps.length)
    }
    this.last_index = randomIndex
    AudioSource.playSound(this.entity, this.audioSrcs_zaps[randomIndex])
    console.log('Playing zap sfx: ' + randomIndex.toString())
  }
}
