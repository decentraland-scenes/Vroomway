import { type Entity } from '@dcl/sdk/ecs'
import { type EntityWrapper } from '../registry'

export function assertAssigned(
  entity: EntityWrapper | Entity,
  entId: string,
  caller: string,
  failMsg: string
): void {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!entity) {
    console.log('WARNING', entId, caller, failMsg)
  }
}
