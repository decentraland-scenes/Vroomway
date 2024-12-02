/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

//
// System determines nearby entities to be loaded and remove far away entities
//

import { log } from '../back-ports/backPorts'
import type IGridEntity from '../modules/spacePartition/IGridEntity'
import { REGISTRY } from '../registry'
import { IntervalUtil } from '../utils/interval-util'
import {
  SystemWrapperBasic,
  SystemState,
  SYSTEM_PRIORITES
} from '../utils/systemsHelpers'
import { getPlayerPositionRelative } from './worldMoveHelpers'

const CLASSNAME = 'worldSpacePartitionSystem.ts'
const logInterval = new IntervalUtil(1000)
const checkGridFrequency = new IntervalUtil(750)

let worldSpacePartitionSystem: SystemWrapperBasic

export function destroyWorldSpacePartitionSystem(): void {
  if (worldSpacePartitionSystem) worldSpacePartitionSystem.removeFromEngine()
}

export function initWorldSpacePartitionSystem(): void {
  const worldSpacePartitionState = new SystemState()

  // MOVE WITH WORLD SYSTEM
  const worldSpacePartitionSystemFn = (dt: number) => {
    if (!worldSpacePartitionState.enabled) return

    const worldState = REGISTRY.worldState

    const checkFreq = checkGridFrequency.update(dt)

    if (checkFreq) {
      const logUpdate = logInterval.update(dt)

      const terrainPosRel = getPlayerPositionRelative()

      let inCube = 0
      // let neibors:any[] = []
      const cubeSize = worldState.gridLoadRadius

      // last active ones
      // TODO is this efficient? to make a new map each time?
      const lastActiveCells = new Map(worldState.currentActiveCells)

      REGISTRY.spacePartioner.getEntitiesInCube(
        terrainPosRel.x,
        terrainPosRel.y,
        terrainPosRel.z,
        cubeSize,
        (e: IGridEntity) => {
          inCube++

          if (!worldState.currentActiveCells.has(e.id)) {
            worldState.currentActiveCells.set(e.id, e)
            e.mgr.attach()
            e.mgr.show()
          }
          lastActiveCells.delete(e.id)
        }
      )

      // anything left needs to be removed
      for (const [id, ent] of lastActiveCells) {
        worldState.currentActiveCells.delete(id)
        ent.mgr.detach()
        ent.mgr.hide()
      }

      // console.log("playergridPos","cameraPos",cameraPos,"gridPos",gridPos,"gridEnts",gridEnts.length,"inCube",inCube,"mapSize",this.controller.grid?.map.size)

      if (logUpdate)
        log(CLASSNAME, 'nearbyEntities', terrainPosRel, 'inCube', inCube) //, "neibors",neibors)
    }

    // }
  }
  // END SYSTEM

  if (worldSpacePartitionSystem) {
    worldSpacePartitionSystem.removeFromEngine()
  }

  worldSpacePartitionSystem = new SystemWrapperBasic(
    {
      name: 'worldSpacePartitionSystemFn',
      priority: SYSTEM_PRIORITES.REGULAR,
      fn: worldSpacePartitionSystemFn
    },
    worldSpacePartitionState
  )

  worldSpacePartitionSystem.addToEngine()
}
