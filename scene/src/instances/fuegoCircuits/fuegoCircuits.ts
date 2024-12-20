/* eslint-disable @typescript-eslint/no-floating-promises */
import { type GameController } from '../../controllers/game.controller'
import { type RealmType } from '../types'
import { initRegistry, REGISTRY } from '../../infinity engine 2/src/registry'
import { initSceneMgr } from '../../infinity engine 2/src/scenes/mySceneManager'
import { setupDemo } from '../../infinity engine 2/src/demo/setupDemo'
import { initMyFirstScene } from '../../infinity engine 2/src/myFirstScene/getting-started'
import { CONFIG, initConfig } from '../../infinity engine 2/src/config'
import * as utils from '@dcl-sdk/utils'
import { Vector3 } from '@dcl/sdk/math'
import { movePlayerTo } from '~system/RestrictedActions'
import { initAvatarTrap } from '../../infinity engine 2/src/modules/avatarTrap/avatarTrap'

export class FuegoCircuitsInstance {
  gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
    initConfig().then((config) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const registry = initRegistry()
      initSceneMgr()
      // setup demo call
      // safe to remove if you write your own code
      setupDemo()

      // END TODO move to subscene
      // setupUi()

      // init my first scene
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!initMyFirstScene()) {
        // start with race trace as default it no other scene
        REGISTRY.SCENE_MGR.goRaceTrack()
        utils.timers.setTimeout(() => {
          initAvatarTrap()
          movePlayerTo({
            newRelativePosition: Vector3.create(
              CONFIG.infinEngineCenter.x,
              CONFIG.infinEngineCenter.y + 0.5,
              CONFIG.infinEngineCenter.z
            ),
            cameraTarget: Vector3.create(
              CONFIG.infinEngineCenter.x,
              CONFIG.infinEngineCenter.y + 0.5,
              CONFIG.infinEngineCenter.z + 2
            )
          })
        }, 1000)
      }
    })
  }

  callSingleFunction(functionName: string, boolean: boolean): void {}

  spawnSingleEntity(entityName: string): void {}

  removeSingleEntity(entityName: string): void {}

  removeAllEntities(): void {
    REGISTRY.SCENE_MGR.destroyActiveScene()
  }

  getId(): RealmType {
    return 'fuegoCircuit'
  }

  deadPosition(): Vector3 {
    return { x: -38.34, y: 10.43, z: -39.75 }
  }
}
