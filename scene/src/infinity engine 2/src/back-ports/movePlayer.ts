// workaround, during move player, onEnterScene/onLeaveScene trigger, should not

import { type Vector3 } from '@dcl/sdk/math'
import { movePlayerTo } from '~system/RestrictedActions'

let MOVE_PLAYER_IN_PROGRESS = false

export function isMovePlayerInProgress(): boolean {
  return MOVE_PLAYER_IN_PROGRESS
}
export function setMovePlayerInProgress(b: boolean): void {
  console.log('setMovePlayerInProgress', b)
  MOVE_PLAYER_IN_PROGRESS = b
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function _movePlayerTo(position: Vector3, cameraLook?: Vector3) {
  setMovePlayerInProgress(true)
  const p = movePlayerTo({
    newRelativePosition: position,
    cameraTarget: cameraLook
  })
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  p.then(() => {
    setMovePlayerInProgress(false)
  })
  return await p
}
