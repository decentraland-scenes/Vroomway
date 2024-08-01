import { Animator, type Entity, GltfContainer, Transform } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { CONFIG } from '../_config'
import { entityController } from '../../utils/entityController'

export class GLTFParticles {
  entity: Entity
  enabled: boolean = false
  animation_clip: string

  constructor(
    gltfSrc: string,
    position?: Vector3,
    scale?: Vector3,
    rotation?: Quaternion,
    animationClipName: string = 'action',
    animationLooping: boolean = true,
    animationLayer: number = 0,
    animationSpeed: number = 1.0
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
    Animator.createOrReplace(this.entity, {
      states: [
        {
          clip: animationClipName,
          loop: animationLooping,
          speed: animationSpeed,
          weight: animationLayer
        }
      ]
    })
  }

  enable(): void {
    this.enabled = true
    Animator.getClip(this.entity, this.animation_clip).playing = true
  }

  disable(): void {
    this.enabled = false
    Animator.getClip(this.entity, this.animation_clip).playing = false
  }
}
