import { Animator, type Entity, GltfContainer, Transform } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { CONFIG } from '../_config'
import { entityController } from '../../utils/entityController'

export class GLTFParticles {
  entity: Entity
  enabled: boolean = false
  animation_clip: string
  animationSpeed: number

  constructor(
    gltfSrc: string,
    position?: Vector3,
    scale?: Vector3,
    rotation?: Quaternion,
    animationClipName: string = 'action',
    animationLooping: boolean = true,
    animationLayer: number = 0,
    animationSpeed: number = 1
  ) {
    this.entity = entityController.addEntity()
    // Add the transform
    if (position == null && rotation == null && scale == null) {
      Transform.createOrReplace(this.entity, {
        position: Vector3.create(0, 0, 0),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0, 0, 0)
      })
    } else {
      Transform.createOrReplace(this.entity, {
        position,
        scale,
        rotation
      })
    }

    // Add the GLTFShape
    GltfContainer.createOrReplace(this.entity, {
      src: CONFIG.GLTF_DIR + gltfSrc + CONFIG.GLTF_EXT
    })
    // Add the animator
    this.animation_clip = animationClipName
    Animator.create(this.entity, {
      states: [
        {
          clip: animationClipName,
          loop: animationLooping,
          weight: animationLayer,
          speed: animationSpeed,
        }
      ]
    })
    this.animationSpeed = animationSpeed
  }

  enable(): void {
    this.enabled = true
    Animator.playSingleAnimation(this.entity, this.animation_clip)
    Animator.getClip(this.entity, this.animation_clip).playing = true
    console.log('gltfparticles enabled', ' animation'+ this.animation_clip, this.animationSpeed, Animator.getClip(this.entity, this.animation_clip))
  }

  disable(): void {
    console.log('gltfparticles disabled', ' animation'+ this.animation_clip)
    this.enabled = false
    Animator.getClip(this.entity, this.animation_clip).playing = false
  }
}
