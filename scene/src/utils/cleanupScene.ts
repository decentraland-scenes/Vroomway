import { engine, Schemas } from '@dcl/sdk/ecs'

export const OmitFromCleanUpFlag = engine.defineComponent('OmitFromCleanUpFlag', {
  OMIT_FROM_CLEANUP_FLAG_INST: Schemas.String
})
