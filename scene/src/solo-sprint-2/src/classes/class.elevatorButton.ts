// ███████╗ ██████╗███████╗███╗   ██╗███████╗    ██████╗  █████╗ ██████╗ ███████╗███╗   ██╗████████╗
// ██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝    ██╔══██╗██╔══██╗██╔══██╗██╔════╝████╗  ██║╚══██╔══╝
// ███████╗██║     █████╗  ██╔██╗ ██║█████╗      ██████╔╝███████║██████╔╝█████╗  ██╔██╗ ██║   ██║
// ╚════██║██║     ██╔══╝  ██║╚██╗██║██╔══╝      ██╔═══╝ ██╔══██║██╔══██╗██╔══╝  ██║╚██╗██║   ██║
// ███████║╚██████╗███████╗██║ ╚████║███████╗    ██║     ██║  ██║██║  ██║███████╗██║ ╚████║   ██║
// ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝╚══════╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝
//
// Note the 180 rotation, this is so that position in Blender align with positions in DCL (with Y and Z swapped)

import {
  engine,
  InputAction,
  inputSystem,
  PointerEvents,
  PointerEventType,
  Transform,
  type Entity
} from '@dcl/sdk/ecs'
import { CONFIG } from '../scenes/_config'
import { type Elevator } from './class.elevator'
import { GLTFEntity } from './class.gltfEntity'

export class ElevatorButton {
  entity: Entity
  gltfEntity: GLTFEntity
  elevator: Elevator

  constructor(gltfSrc: string, elevator: Elevator) {
    this.entity = engine.addEntity()

    this.gltfEntity = new GLTFEntity(
      gltfSrc,
      CONFIG.SCENE_TRANSFORM_180.position,
      CONFIG.SCENE_TRANSFORM_180.scale,
      CONFIG.SCENE_TRANSFORM_180.rotation
    )
    Transform.createOrReplace(this.gltfEntity.entity, { parent: this.entity })
    this.elevator = elevator
    // Add the elevator panel gltf and a triggersss
    PointerEvents.createOrReplace(this.gltfEntity.entity, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Trigger elevator',
            maxDistance: 5
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
        this.triggerAction()
      }
    })
  }

  triggerAction(): void {
    this.elevator.liftUp()
  }

  reset(): void {
    this.elevator.liftDown()
  }
}
