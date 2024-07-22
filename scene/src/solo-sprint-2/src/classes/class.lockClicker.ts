//  ██████╗██╗     ██╗ ██████╗██╗  ██╗███████╗██████╗     ██╗      ██████╗  ██████╗██╗  ██╗
// ██╔════╝██║     ██║██╔════╝██║ ██╔╝██╔════╝██╔══██╗    ██║     ██╔═══██╗██╔════╝██║ ██╔╝
// ██║     ██║     ██║██║     █████╔╝ █████╗  ██████╔╝    ██║     ██║   ██║██║     █████╔╝
// ██║     ██║     ██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗    ██║     ██║   ██║██║     ██╔═██╗
// ╚██████╗███████╗██║╚██████╗██║  ██╗███████╗██║  ██║    ███████╗╚██████╔╝╚██████╗██║  ██╗
//  ╚═════╝╚══════╝╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝    ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝
//

import {
  AudioSource,
  engine,
  type Entity,
  InputAction,
  inputSystem,
  PointerEvents,
  PointerEventType,
  TextAlignMode,
  TextShape,
  Transform
} from '@dcl/sdk/ecs'
import { Vector3, Quaternion, Color4 } from '@dcl/sdk/math'
import { CONFIG } from '../scenes/_config'
import * as utils from '@dcl-sdk/utils'
import { clamp } from '../../../utils/clamp'
import { GLTFEntity } from './class.gltfEntity'

export class LockClicker {
  entity: Entity
  foo: Entity
  // Lock values
  target_value = 0
  min_value = 0
  max_value = 0
  current_value = 0

  // The text and their pivot point
  text_current_value_pivot: Entity = engine.addEntity()
  text_current_value: string = ''

  text_target_value_pivot: Entity = engine.addEntity()
  text_target_value: string = ''

  // GLTF Shape
  gltfEntity: GLTFEntity = new GLTFEntity('lock.clicker')

  // Audio sources
  public sfx = {
    fail: CONFIG.SFX_LOCK_FAIL,
    interact: CONFIG.SFX_LOCK_INTERACT,
    success: CONFIG.SFX_LOCK_SUCCESS
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  unlock_function?: Function

  constructor(
    position: Vector3,
    scale?: Vector3,
    rotation?: Quaternion,
    // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/ban-types
    unlock_function?: Function,
    min?: number,
    max?: number
  ) {
    this.entity = engine.addEntity()
    this.foo = engine.addEntity()
    // sanitise the inputs
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/prefer-nullish-coalescing
    this.min_value = clamp(min || CONFIG.LOCK_CLICKER_MIN, 1, 98)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/prefer-nullish-coalescing
    this.max_value = clamp(max || CONFIG.LOCK_CLICKER_MAX, 1, 99)

    // Add the basic components
    Transform.create(this.entity, {
      position,
      scale,
      rotation
    })
    Transform.createOrReplace(this.gltfEntity.entity, { parent: this.entity })

    this.unlock_function = unlock_function

    // An entity can only havea s ingle audio source, and an audio source can only have a single audio clip.
    // We combat this by spawning a child entity per audioclip
    // This can likely be done more elegantly, eg with a loop, but that can be done later
    // Add the various sound effects
    type SfxKeys = keyof typeof this.sfx
    for (const s in this.sfx) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.sfx.hasOwnProperty(s)) {
        Transform.createOrReplace(this.foo, { parent: this.entity })
        AudioSource.createOrReplace(this.foo, {
          audioClipUrl: this.sfx[s as SfxKeys] // Type assertion here
        })
      }

      // Add the text elements (to avoid various errors if we create them in addTextObjects()
      Transform.createOrReplace(this.text_target_value_pivot, {
        parent: this.entity
      })
      Transform.createOrReplace(this.text_current_value_pivot, {
        parent: this.entity
      })
      TextShape.createOrReplace(this.text_target_value_pivot, {
        text: this.text_target_value
      })
      TextShape.createOrReplace(this.text_current_value_pivot, {
        text: this.text_current_value
      })

      // Do the various setup functions
      this.addButtonEvents()
      this.randomiseTargetValue()
      this.addTextObjects()
      this.updateText()

      // log("Created LockClicker entity: target_value = " + this.target_value)
    }
  }

  // Function to remove object from scene when disabled
  disable(): void {
    console.log('Disabled LockClicker entity')
  }

  // Triggered when the players succeeds at unlocking the lock
  onUnlock(): void {
    this.randomiseTargetValue()
    this.resetInput()

    AudioSource.playSound(this.foo, this.sfx.success)

    this.flash(this.text_current_value, Color4.Green())
    // this.text_current_value_pivot.addComponent(new utils.RotateTransformComponent(Quaternion.Euler(25.5, 90, 180), Quaternion.Euler(25.5, 90, 0), 1))

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this.unlock_function) {
      this.unlock_function()
    }
  }

  // Tirggered when the players fails at unlocking the lock - eg wrong value
  onFailUnlock(): void {
    this.resetInput()
    AudioSource.playSound(this.foo, this.sfx.fail)
    this.flash(this.text_current_value, Color4.Red())
  }

  // Trigged by Secondary F interactions
  attemptUnlock(): void {
    if (this.current_value === this.target_value) {
      // Success
      this.onUnlock()
    } else {
      // Fail
      this.onFailUnlock()
    }
  }

  // Triggerd by primary E interactions
  incrementValue(): void {
    this.current_value = clamp(this.current_value + 1, 1, 99)

    this.updateText()

    AudioSource.playSound(this.foo, this.sfx.interact)
  }

  // Resets
  resetInput(): void {
    this.current_value = 0
    this.updateText()
  }

  addButtonEvents(): void {
    PointerEvents.createOrReplace(this.gltfEntity.entity, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText:
              'Match the target code! \n Press E to increment \n Press F to Unlock',
            maxDistance: 4
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_PRIMARY,
          PointerEventType.PET_DOWN,
          this.gltfEntity.entity
        )
      ) {
        if (InputAction.IA_PRIMARY === 1) {
          this.incrementValue()
        } else {
          this.attemptUnlock()
        }
      }
    })
  }

  addTextObjects(): void {
    // Add the text_target_value_pivot
    Transform.createOrReplace(this.text_target_value_pivot, {
      parent: this.entity
    })
    Transform.getMutable(this.text_target_value_pivot).position =
      Vector3.create(-0.05, 1.865, -0.42)
    Transform.getMutable(this.text_target_value_pivot).scale = Vector3.create(
      0.1,
      0.1,
      0.1
    )
    Transform.getMutable(this.text_target_value_pivot).rotation =
      Quaternion.fromEulerDegrees(25.5, 90, 0)

    // Style the text_target_value text object
    TextShape.getMutable(this.text_target_value_pivot).fontSize = 22
    TextShape.getMutable(this.text_target_value_pivot).textAlign =
      TextAlignMode.TAM_MIDDLE_RIGHT
    TextShape.getMutable(this.text_target_value_pivot).width = 32
    TextShape.getMutable(this.text_target_value_pivot).height = 22
    TextShape.getMutable(this.text_target_value_pivot).outlineWidth = 0.1
    TextShape.getMutable(this.text_target_value_pivot).textColor = Color4.Teal()
    TextShape.getMutable(this.text_target_value_pivot).outlineColor =
      Color4.Black()
    TextShape.getMutable(this.text_target_value_pivot).shadowBlur = 2
    TextShape.getMutable(this.text_target_value_pivot).shadowColor =
      Color4.Black()

    // Add the text_current_value_pivot
    Transform.createOrReplace(this.text_current_value_pivot, {
      parent: this.entity
    })
    Transform.getMutable(this.text_current_value_pivot).position =
      Vector3.create(-0.05, 1.85, 0.33)
    Transform.getMutable(this.text_current_value_pivot).scale = Vector3.create(
      0.1,
      0.1,
      0.1
    )
    Transform.getMutable(this.text_current_value_pivot).rotation =
      Quaternion.fromEulerDegrees(25.5, 90, 0)

    // Style the text_current_value_pivot text object
    TextShape.getMutable(this.text_current_value_pivot).fontSize = 22
    TextShape.getMutable(this.text_current_value_pivot).textAlign =
      TextAlignMode.TAM_MIDDLE_LEFT
    TextShape.getMutable(this.text_current_value_pivot).width = 32
    TextShape.getMutable(this.text_current_value_pivot).height = 32
    TextShape.getMutable(this.text_current_value_pivot).outlineWidth = 0.1
    TextShape.getMutable(this.text_current_value_pivot).textColor =
      Color4.Teal()
    TextShape.getMutable(this.text_current_value_pivot).outlineColor =
      Color4.Black()
    TextShape.getMutable(this.text_current_value_pivot).shadowBlur = 2
    TextShape.getMutable(this.text_current_value_pivot).shadowColor =
      Color4.Black()

    // log("Added text labels")
  }

  randomiseTargetValue(): void {
    let newRandomValue = this.target_value
    while (newRandomValue === this.target_value) {
      newRandomValue = Math.floor(
        Math.random() * (this.max_value - this.min_value + 1) + this.min_value
      )
    }

    this.target_value = newRandomValue
    console.log('randomiseTargetValue(): ' + newRandomValue)
  }

  // Update the textShape interface with the current values
  updateText(): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this.text_current_value) {
      this.text_current_value = this.current_value.toString()
    }
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this.text_target_value) {
      this.text_target_value = this.target_value.toString()
    }
  }

  // Flashes a text object
  flash(text: string, color: Color4): void {
    const defaultColor = Color4.Teal()
    const duration = 150
    const interval = 300
    const count = 2

    for (let i = 0; i < count + 1; i++) {
      utils.timers.setTimeout(() => {
        TextShape.getMutable(this.text_target_value_pivot).textColor = color
        utils.timers.setTimeout(
          () => {
            TextShape.getMutable(this.text_target_value_pivot).textColor =
              defaultColor
          },
          i * interval + duration
        )
      }, i * interval)
    }
  }
}
