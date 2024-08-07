import * as utils from '@dcl-sdk/utils'
import { GameController } from './controllers/game.controller'
import { Vector3 } from '@dcl/sdk/math'
import { movePlayerTo } from '~system/RestrictedActions'

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
      newRelativePosition: Vector3.create(31.46, 0.88, 63.71),
      cameraTarget: Vector3.create(31.12, 1.06, 53.56)
    })
    void game.vehicleOwnership.init()
  }, 200)
  // attempt initialization of player profile
  utils.timers.setTimeout(() => {
    game.uiController.profile.initialize()
  }, 500)

  // initialize debugging menu
  //  NOTE: debug menus will only appear in the first render of the main scene
  // DebugMenuController.Instance.InitDebugMenuInventory();
  // DebugMenuController.Instance.InitDebugMenuLeveling();
}
