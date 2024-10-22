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
    this.entity = engine.addEntity()
    // omitCleanupEntities.push(this.uuid);
    Transform.create(this.entity, {
      position: transform.position,
      scale: transform.scale,
      rotation: transform.rotation
    })
    this.updateModel(model)
  }

  updateModel(model: string): void {
    // workaround.  for some reason addComponentOrReplace
    // is not updating the entity animator, add remove from engine solved this
    // alternative is to remove animator first, then add back
    if (Animator.getMutableOrNull(this.entity) != null) {
      Animator.deleteFrom(this.entity)
    }
    GltfContainer.createOrReplace(this.entity, { src: model })
    Animator.createOrReplace(this.entity, {
      states: [
        {
          clip: 'go',
          loop: true
        },
        {
          clip: 'idle',
          loop: true
        }
      ]
    })
  }
  // Remove entity
  remove(): void {
    engine.removeEntity(this.entity)
  }

  // Play running animation
  playRunning(): void {
    Animator.getClip(this.entity, 'go').playing = true
  }

  // Play idle animation
  playIdle(): void {
    Animator.getClip(this.entity, 'idle').playing = true
  }
}
