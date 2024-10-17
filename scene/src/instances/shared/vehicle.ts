import {
  Animator,
  engine,
  type Entity,
  GltfContainer,
  Transform,
  type TransformType
} from '@dcl/sdk/ecs'

export class Arissa {
  entity: Entity

  constructor(model: string, transform: TransformType) {
    // omitCleanupEntities.push(this.uuid);
    this.entity = engine.addEntity()
    Transform.createOrReplace(this.entity, transform)

    GltfContainer.create(this.entity, {
      src: model
    })

    Animator.createOrReplace(this.entity, {
      states: [
        {
          clip: 'go',
          playing: false,
          loop: true,
          shouldReset: true
        },
        {
          clip: 'idle',
          playing: false,
          loop: true,
          shouldReset: true
        }
      ]
    })
  }

  updateModel(model: string): void {
    GltfContainer.createOrReplace(this.entity, { src: model })
  }

  // Remove entity
  remove(): void {
    engine.removeEntity(this.entity)
  }

  // Play running animation
  playRunning(): void {
    const runningAnim = Animator.getClip(this.entity, 'go')
    runningAnim.playing = true
  }

  // Play idle animation
  playIdle(): void {
    const idleAnim = Animator.getClip(this.entity, 'idle')
    idleAnim.playing = true
  }
}
