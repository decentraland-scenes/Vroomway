// ███████╗ ██████╗███████╗███╗   ██╗███████╗    ██████╗  █████╗ ██████╗ ███████╗███╗   ██╗████████╗
// ██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝    ██╔══██╗██╔══██╗██╔══██╗██╔════╝████╗  ██║╚══██╔══╝
// ███████╗██║     █████╗  ██╔██╗ ██║█████╗      ██████╔╝███████║██████╔╝█████╗  ██╔██╗ ██║   ██║
// ╚════██║██║     ██╔══╝  ██║╚██╗██║██╔══╝      ██╔═══╝ ██╔══██║██╔══██╗██╔══╝  ██║╚██╗██║   ██║
// ███████║╚██████╗███████╗██║ ╚████║███████╗    ██║     ██║  ██║██║  ██║███████╗██║ ╚████║   ██║
// ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝╚══════╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝
//

import { Animator, engine, Transform, type Entity } from '@dcl/sdk/ecs'
import { GLTFEntity } from './class.gltfEntity'
import { CONFIG } from '../_config'

export class Elevator {
  entity: Entity
  gltfEntity: GLTFEntity
  anim_action_up?: boolean
  anim_action_down?: boolean
  last_animation: number = 0
  public startDown: boolean = false
  public isDown: boolean = false
  constructor(gltfSrc: string, startDown?: boolean) {
    this.entity = engine.addEntity()
    // Remember starting state
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (startDown) {
      this.startDown = startDown
      this.isDown = startDown
    }

    // Add the gltfShape
    this.gltfEntity = new GLTFEntity(
      gltfSrc,
      CONFIG.SCENE_TRANSFORM_180.position,
      CONFIG.SCENE_TRANSFORM_180.scale,
      CONFIG.SCENE_TRANSFORM_180.rotation
    )
    Transform.createOrReplace(this.gltfEntity.entity, { parent: this.entity })

    // Add the animator and animations
    Animator.create(this.gltfEntity.entity, {
      states: [
        {
          clip: 'action_up',
          loop: false,
          speed: 1,
          weight: 0
        },
        {
          clip: 'action_down',
          loop: false,
          speed: 1,
          weight: 0
        }
      ]
    })
  }

  enable(): void {
    // Bug workaround to ensure the correct pose on spawn
    // We stop the OPPOSITE animation from playing
    // This assumes that each animations ends at the point that it's coutner-part begins
    if (this.isDown) {
      this.last_animation = 1
      this.anim_action_up = Animator.getClipOrNull(
        this.gltfEntity.entity,
        'action_up'
      )?.playing
      if (this.anim_action_up ?? false) {
        Animator.getClip(this.gltfEntity.entity, 'action_up').playing = false
      }
    } else {
      this.last_animation = 0
      this.anim_action_down = Animator.getClipOrNull(
        this.gltfEntity.entity,
        'action_down'
      )?.playing
      if (this.anim_action_down ?? false) {
        Animator.getClip(this.gltfEntity.entity, 'action_down').playing = false
      }
    }
  }

  disable(): void {
    // Don't need to do anything for Elevators, this is left over from boilerplate
  }

  reset(): void {
    if (this.startDown) {
      this.isDown = true
      this.last_animation = 1
      Animator.getClip(this.gltfEntity.entity, 'action_up').playing = false
    } else {
      this.isDown = false
      this.last_animation = 0
      Animator.getClip(this.gltfEntity.entity, 'action_down').playing = false
    }
  }

  // Platform controls
  liftUp(force?: boolean): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this.last_animation !== 0 || force) {
      this.last_animation = 0
      console.log('liftUp()')
      this.anim_action_up = Animator.getClipOrNull(
        this.gltfEntity.entity,
        'action_up'
      )?.playing
      if (this.anim_action_up ?? false) {
        Animator.playSingleAnimation(this.gltfEntity.entity, 'action_up')
      }
    }
  }

  liftDown(force?: boolean): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this.last_animation !== 1 || force) {
      this.last_animation = 1
      console.log('liftDown()')
      this.anim_action_down = Animator.getClipOrNull(
        this.gltfEntity.entity,
        'action_down'
      )?.playing
      if (this.anim_action_down ?? false) {
        Animator.playSingleAnimation(this.gltfEntity.entity, 'action_down')
      }
    }
  }
}
