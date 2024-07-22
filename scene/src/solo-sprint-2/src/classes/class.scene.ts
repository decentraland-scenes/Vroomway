// ███████╗ ██████╗███████╗███╗   ██╗███████╗
// ██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝
// ███████╗██║     █████╗  ██╔██╗ ██║█████╗
// ╚════██║██║     ██╔══╝  ██║╚██╗██║██╔══╝
// ███████║╚██████╗███████╗██║ ╚████║███████╗
// ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝╚══════╝
//

import { type Entity, Transform, engine } from '@dcl/sdk/ecs'
import { CONFIG } from '../scenes/_config'
import { type SceneManager } from './class.sceneManager'

export class Scene {
  [index: string]: any
  name: string
  objects: Entity[] = []
  sceneManager?: SceneManager
  enabled: boolean = false

  constructor(name: string, objects?: Entity[]) {
    this.name = name
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/prefer-nullish-coalescing
    this.objects = objects || []

    console.log('class.scene: adding scene: ' + name)
  }

  init(): void {
    // Loads the scene assets but doesn't set them as visible
    // Instead the assets are parented to a CACHE entity, which is scaled down small and hidden somewhere
    // This keeps the scene loaded and ready to be enabled very quickly.

    console.log('class.scene: init(): ' + this.name)

    // Ensure we have a sceneManager assigned
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!this.sceneManager) {
      console.log(
        'class.scene: ERROR during init for scene' +
          this.name +
          ': scene does not have a sceneManager'
      )
      return
    }

    // Loop through all objects stored in the scene
    for (let i = 0; i < this.objects.length; i++) {
      const obj = this.objects[i]

      // Assign the _SCENE_CACHE as the parent
      Transform.createOrReplace(obj, { parent: CONFIG._SCENE_CACHE })
    }

    this.enabled = false

    this.reset()
  }

  reset(): void {
    // Resets the scene
  }

  enable(): void {
    console.log('class.scene: enable(): ' + this.name)

    for (let i = 0; i < this.objects.length; i++) {
      let obj = this.objects[i]

      // Set the correct parent for the entity
      Transform.createOrReplace(obj, { parent: CONFIG._SCENE_ROOT })

      // Check if object is alive, this ensures compatibility with the Vroomway scene management/cleanup
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!engine.getEntityOrNullByName('obj')) {
        obj = engine.addEntity()
      }

      if (this.hasEnableDisableMethod(obj)) {
        // console.log("class.scene: enable(): " + (obj.name? obj.name : obj.uuid) + ": Enabling object")
        obj.enable()
      }
    }

    this.reset()
    this.enabled = true
  }

  disable(): void {
    console.log('class.scene: disable(): ' + this.name)
    for (let i = 0; i < this.objects.length; i++) {
      const obj = this.objects[i]
      Transform.createOrReplace(obj, { parent: CONFIG._SCENE_CACHE })

      if (this.hasEnableDisableMethod(obj)) {
        // console.log("class.scene: disable(): " + (obj.name? obj.name : obj.uuid) + ": Disabling object")
        obj.disable()
      }
    }

    this.enabled = false
  }

  destroy(): void {
    for (let i = 0; i < this.objects.length; i++) {
      engine.removeEntity(this.objects[i])
    }
  }

  addEntity(entity: Entity): void {
    this.objects.push(entity)

    if (this.enabled) {
      Transform.createOrReplace(entity, { parent: CONFIG._SCENE_ROOT })
    } else {
      Transform.createOrReplace(entity, { parent: CONFIG._SCENE_CACHE })
    }
  }

  addEntities(entities: Entity[]): void {
    for (let i = 0; i < entities.length; i++) {
      this.addEntity(entities[i])
    }
  }

  hasEnableDisableMethod(obj: any): obj is {
    enable: () => void
    disable: () => void
  } {
    return typeof obj.enable === 'function' && typeof obj.disable === 'function'
  }
}
