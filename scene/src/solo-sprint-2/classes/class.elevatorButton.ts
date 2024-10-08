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
import { type Elevator } from './class.elevator'
import { GLTFEntity } from './class.gltfEntity'
import { entityController } from '../../utils/entityController'
import { CONFIG } from '../_config'

export class ElevatorButton {
  entity: Entity
  gltfEntity: GLTFEntity
  elevator: Elevator

  constructor(gltfSrc: string, elevator: Elevator) {
    this.entity = entityController.addEntity()
    this.gltfEntity = new GLTFEntity(
      gltfSrc,
      CONFIG.SCENE_TRANSFORM_180.position,
      CONFIG.SCENE_TRANSFORM_180.scale,
      CONFIG.SCENE_TRANSFORM_180.rotation
    )
    Transform.getMutable(this.gltfEntity.entity).parent = this.entity
    this.elevator = elevator
    // Add the elevator panel gltf and a triggersss
    PointerEvents.createOrReplace(this.gltfEntity.entity, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_SECONDARY,
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
          InputAction.IA_SECONDARY,
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
