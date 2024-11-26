// registry will hold
// physicsSystem - decouple sync back to DCL sdk? or make easier to register callback???
// WorldState
// playerMoveInput system - current in worldMoveSate

import { type Entity } from '@dcl/sdk/ecs'
import { type WorldMoveVehicle } from './world/worldMoveVehicle'
import { type AvatarTrapEntity } from './modules/avatarTrap/avatarTrap'
import { type MySceneManager } from './scenes/mySceneManager'
import { type SystemWrapperBasic } from './utils/systemsHelpers'
import type Grid from './modules/spacePartition/Grid'
import { type WorldState } from './world/worldMoveState'

export type EntityWrapper = {
  entity: Entity
}

export class RegistryEntities {
  avatarTrap!: AvatarTrapEntity
  moveWithWorldGrid!: EntityWrapper
  fixedGrid!: EntityWrapper
}
export class RegistrySystems {
  worldStepSystem?: SystemWrapperBasic
  keepPlayerCenteredSystem?: SystemWrapperBasic
}
export class RegistryPhysics {
  world?: CANNON.World
  player?: WorldMoveVehicle
  // TODO REMOVE groundMaterial
  groundMaterial?: CANNON.Material
}

export class Registry {
  worldState!: WorldState
  SCENE_MGR!: MySceneManager
  spacePartioner!: Grid
  systemsByName = new Map<string, SystemWrapperBasic>()
  entities: RegistryEntities = new RegistryEntities()
  systems: RegistrySystems = new RegistrySystems()
  physics: RegistryPhysics = new RegistryPhysics()

  registerSystem(system: SystemWrapperBasic): void {
    const name = system.getName()
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (name) {
      this.systemsByName.set(name, system)
    } else {
      console.log('WARNING', 'registerSystem', 'system missing name!!!')
    }
  }

  unregisterSystem(system: SystemWrapperBasic): void {
    const name = system.getName()
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (name) {
      this.systemsByName.delete(name)
    } else {
      console.log('WARNING', 'unregisterSystem', 'system missing name!!!')
    }
  }
}

export let REGISTRY: Registry
export function initRegistry(): Registry {
  console.log('initRegistry called')
  if (REGISTRY === undefined) {
    REGISTRY = new Registry()
  }
  return REGISTRY
}
