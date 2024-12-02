import { Transform, engine } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { CONFIG } from '../config'
import { REGISTRY } from '../registry'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CLASSNAME = 'worldMoveHelpers.ts'

/**
 *
 * @returns Vector3 player position relative to the world grid
 */
export function getPlayerPositionRelative(): Vector3 {
  const playerPosition = Transform.getOrNull(engine.PlayerEntity)
  if (playerPosition == null) return Vector3.Zero() // ' playerPosition no data yet'
  const { x, y, z } = playerPosition.position
  if (!CONFIG.MOVE_WORLD_AROUND_PLAYER) {
    return Vector3.create(x, y, z)
  }
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!REGISTRY.entities.moveWithWorldGrid) return Vector3.Zero() // ' playerPosition no data yet'
  const terrainPos = Transform.getOrNull(
    REGISTRY.entities.moveWithWorldGrid.entity
  )

  if (terrainPos == null) return Vector3.Zero() // 'terrainPos no data yet'

  const tx = terrainPos.position.x
  const ty = terrainPos.position.y
  const tz = terrainPos.position.z

  const gx = CONFIG.infinEngineCenter.x - tx
  const gy = CONFIG.infinEngineCenter.y - ty
  const gz = CONFIG.infinEngineCenter.z - tz

  return Vector3.create(gx, gy, gz)
}
