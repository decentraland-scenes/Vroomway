/* eslint-disable @typescript-eslint/no-floating-promises */
import { type Vector3 } from '~system/EngineApi'
import { type GameController } from '../../controllers/game.controller'
import { type RealmType } from '../types'
import { initRegistry, REGISTRY } from '../../infinity engine 2/src/registry'
import { initSceneMgr } from '../../infinity engine 2/src/scenes/mySceneManager'
import { setupDemo } from '../../infinity engine 2/src/demo/setupDemo'
import { initMyFirstScene } from '../../infinity engine 2/src/myFirstScene/getting-started'
import { initConfig } from '../../infinity engine 2/src/config'

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
