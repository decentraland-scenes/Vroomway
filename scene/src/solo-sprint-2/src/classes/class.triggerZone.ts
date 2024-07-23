// ████████╗██████╗ ██╗ ██████╗  ██████╗ ███████╗██████╗ ███████╗ ██████╗ ███╗   ██╗███████╗
// ╚══██╔══╝██╔══██╗██║██╔════╝ ██╔════╝ ██╔════╝██╔══██╗╚══███╔╝██╔═══██╗████╗  ██║██╔════╝
//    ██║   ██████╔╝██║██║  ███╗██║  ███╗█████╗  ██████╔╝  ███╔╝ ██║   ██║██╔██╗ ██║█████╗
//    ██║   ██╔══██╗██║██║   ██║██║   ██║██╔══╝  ██╔══██╗ ███╔╝  ██║   ██║██║╚██╗██║██╔══╝
//    ██║   ██║  ██║██║╚██████╔╝╚██████╔╝███████╗██║  ██║███████╗╚██████╔╝██║ ╚████║███████╗
//    ╚═╝   ╚═╝  ╚═╝╚═╝ ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝
//

import {
  engine,
  type Entity,
  Material,
  MeshRenderer,
  Transform
} from '@dcl/sdk/ecs'
import { CONFIG } from '../_config'
import { type Vector3, type Quaternion } from '~system/EngineApi'
import * as utils from '@dcl-sdk/utils'
import { Color4 } from '@dcl/sdk/math'

// Got sick of the Dash Utils causing the scene to reload every damned file at random, so wrote a simplified trigger class

export class TriggerZone {
  public entity: Entity
  public enabled: boolean = false
  // eslint-disable-next-line @typescript-eslint/ban-types
  public onEnter: Function
  // eslint-disable-next-line @typescript-eslint/ban-types
  public onExit: Function

  constructor(
    position: Vector3,
    scale: Vector3,
    rotation: Quaternion,
    // eslint-disable-next-line @typescript-eslint/ban-types
    onEnter: Function = function (): void {},
    // eslint-disable-next-line @typescript-eslint/ban-types
    onExit: Function = function (): void {}
  ) {
    this.entity = engine.addEntity()
    // Add the transform for the trigger zone
    position.y += scale.y / 2
    Transform.createOrReplace(this.entity, {
      position,
      scale,
      rotation
    })

    // Add the onEnter and onExit functions
    this.onEnter = onEnter
    this.onExit = onExit

    // Add the trigger component
    utils.triggers.addTrigger(
      this.entity,
      1,
      1,
      [{ type: 'box', scale }],
      () => {
        if (this.enabled) {
          this.onEnter()
        }
      },
      () => {
        if (this.enabled) {
          this.onExit()
        }
      }
    )
    Material.setPbrMaterial(this.entity, {
      albedoColor: Color4.create(0, 0, 0, 0)
    })
    // Debug shaoe
    if (CONFIG.SHOW_TRIGGER_BOXES) {
      MeshRenderer.setBox(this.entity)
      this.shadeGreen()
    }
  }

  enable(): void {
    this.enabled = true
    utils.triggers.enableTrigger(this.entity, true)

    if (CONFIG.SHOW_TRIGGER_BOXES) {
      Material.setPbrMaterial(this.entity, {
        albedoColor: Color4.Gray()
      })
    }
  }

  disable(): void {
    this.enabled = false
    utils.triggers.enableTrigger(this.entity, false)
    if (CONFIG.SHOW_TRIGGER_BOXES) {
      Material.setPbrMaterial(this.entity, {
        albedoColor: Color4.create(0, 0, 0, 0)
      })
    }
  }

  shadeGreen(): void {
    if (CONFIG.SHOW_TRIGGER_BOXES) {
      Material.setPbrMaterial(this.entity, {
        albedoColor: CONFIG.DEBUG_MATERIAL_GREEN
      })
    }
  }

  shadeOrange(): void {
    if (CONFIG.SHOW_TRIGGER_BOXES) {
      Material.setPbrMaterial(this.entity, {
        albedoColor: CONFIG.DEBUG_MATERIAL_ORANGE
      })
    }
  }

  shadeRed(): void {
    if (CONFIG.SHOW_TRIGGER_BOXES) {
      Material.setPbrMaterial(this.entity, {
        albedoColor: CONFIG.DEBUG_MATERIAL_RED
      })
    }
  }
}
