import { type Vector3 } from '~system/EngineApi'
import { type GameController } from '../../controllers/game.controller'
import { type RealmType } from '../types'

export class DragRaceInstance {
  gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
  }

  callSingleFunction(functionName: string, boolean: boolean): void {}

  spawnSingleEntity(entityName: string): void {}

  removeSingleEntity(entityName: string): void {}

  removeAllEntities(): void {}

  getId(): RealmType {
    return 'dragRace'
  }

  deadPosition(): Vector3 {
    return { x: -38.34, y: 10.43, z: -39.75 }
  }
}
