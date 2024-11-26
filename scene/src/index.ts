import * as utils from '@dcl-sdk/utils'
import { GameController } from './controllers/game.controller'
import { Vector3 } from '@dcl/sdk/math'
import { movePlayerTo } from '~system/RestrictedActions'
// import { infinityEngineMain } from './infinity engine 2/src'

export function main(): void {
  // prepare entry scene
  const game = new GameController()
  game.realmController.switchRealm('mainInstance')
  // prepare solo sprint track
  // const Tracks = new spawn_Tracks();
  // Tracks.spawnFloor1();
  // attempt initialization of player vehicle ownership
  utils.timers.setTimeout(() => {
    void movePlayerTo({
      newRelativePosition: Vector3.create(47.48, 0.88, 62.38),
      cameraTarget: Vector3.create(48.66, 0.88, 53.29)
    })
    void game.vehicleOwnership.init()
  }, 200)
  // infinityEngineMain()
  // initialize debugging menu
  //  NOTE: debug menus will only appear in the first render of the main scene
  // DebugMenuController.Instance.InitDebugMenuInventory();
  // DebugMenuController.Instance.InitDebugMenuLeveling();
  
}
