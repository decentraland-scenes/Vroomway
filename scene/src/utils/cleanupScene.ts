import { engine, Schemas } from '@dcl/sdk/ecs'

export const OmitFromCleanUpFlag = engine.defineComponent(
  'OmitFromCleanUpFlag',
  {
    OMIT_FROM_CLEANUP_FLAG_INST: Schemas.String
  }
)

export function cleanUpScene(): void {
  console.log('scene cleaned')
  for (const component of engine.componentsIter()) {
    for (const [entity] of engine.getEntitiesWith(component)) {
      engine.removeEntity(entity)
      // eslint-disable-next-line no-irregular-whitespace
    }
    // eslint-disable-next-line no-irregular-whitespace
  }
}
