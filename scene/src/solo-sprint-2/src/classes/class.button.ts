// ███████╗ ██████╗███████╗███╗   ██╗███████╗    ██████╗  █████╗ ██████╗ ███████╗███╗   ██╗████████╗
// ██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝    ██╔══██╗██╔══██╗██╔══██╗██╔════╝████╗  ██║╚══██╔══╝
// ███████╗██║     █████╗  ██╔██╗ ██║█████╗      ██████╔╝███████║██████╔╝█████╗  ██╔██╗ ██║   ██║
// ╚════██║██║     ██╔══╝  ██║╚██╗██║██╔══╝      ██╔═══╝ ██╔══██║██╔══██╗██╔══╝  ██║╚██╗██║   ██║
// ███████║╚██████╗███████╗██║ ╚████║███████╗    ██║     ██║  ██║██║  ██║███████╗██║ ╚████║   ██║
// ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝╚══════╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝
//

import {
  engine,
  InputAction,
  inputSystem,
  PointerEvents,
  PointerEventType,
  Transform,
  type Entity
} from '@dcl/sdk/ecs'
import { GLTFEntity } from './class.gltfEntity'
import { Vector3, Quaternion } from '@dcl/sdk/math'

export class ButtonSprint {
  gltfEntity: GLTFEntity
  // eslint-disable-next-line @typescript-eslint/ban-types
  onInteract?: Function
  entity: Entity
  constructor(
    gltfSrc: string,
    position?: Vector3,
    scale?: Vector3,
    rotation?: Quaternion,
    // eslint-disable-next-line @typescript-eslint/ban-types
    onInteract?: Function,
    hoverText: string = 'Activate',
    distance: number = 5
  ) {
    this.entity = engine.addEntity()
    this.gltfEntity = new GLTFEntity(gltfSrc)
    Transform.createOrReplace(this.gltfEntity.entity, { parent: this.entity })

    if (onInteract != null) {
      this.onInteract = onInteract
    }
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
    // Add the elevator panel gltf and a triggersss
    PointerEvents.createOrReplace(this.gltfEntity.entity, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText,
            maxDistance: distance
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.gltfEntity.entity
        )
      ) {
        if (this.onInteract != null) {
          this.onInteract()
        }
      }
    })
  }
}
