import { engine, GltfContainer, Transform, type Entity } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { CONFIG } from '../scenes/_config'

export class GLTFEntity {
  entity: Entity
  enabled: boolean = false
  gltfShape: string
  constructor(
    gltfSrc: string,
    position?: Vector3,
    scale?: Vector3,
    rotation?: Quaternion,
    enabled: boolean = false
  ) {
    this.entity = engine.addEntity()
    if (position != null && rotation != null && scale != null) {
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

    this.gltfShape = CONFIG.GLTF_DIR + gltfSrc + CONFIG.GLTF_EXT
    GltfContainer.create(this.entity, { src: this.gltfShape })
  }

  enable(): void {
    this.enabled = true
    GltfContainer.createOrReplace(this.entity, { src: this.gltfShape })
  }

  disable(): void {
    this.enabled = false
    GltfContainer.deleteFrom(this.entity)
  }
}
