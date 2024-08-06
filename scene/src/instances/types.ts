import { type Vector3 } from '@dcl/sdk/math'

export type RealmType = 'mainInstance' | 'recharge' | 'scrapyard' | 'soloSprint'

export type Realm = {
  getId: () => RealmType
  removeAllEntities: () => void
  removeSingleEntity?: (entityName: string) => void
  spawnSingleEntity: (entityName: string) => void
  callSingleFunction: (functionName: string, boolean: boolean) => void
  /**
   * @returns the position where the player should be placed when they die
   */
  deadPosition: () => Vector3 | null
}
