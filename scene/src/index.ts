import { executeTask } from '@dcl/sdk/ecs'
import * as utils from '@dcl-sdk/utils'
import { renderMainInstance } from './instances/main/mainInstance'

export function main(): void {
  executeTask(async () => {
    // prepare entry scene
    void renderMainInstance()

    // prepare social display
    // renderSocials();

    // prepare solo sprint track
    // const Tracks = new spawn_Tracks();
    // Tracks.spawnFloor1();

    // attempt initialization of player vehicle ownership
    // utils.timers.setTimeout(() => {
    //   movePlayerTo({
    //     newRelativePosition: Vector3.create(31.46, 0.88, 63.71),
    //     cameraTarget: Vector3.create(31.12, 1.06, 53.56)
    //   })
    //   // vehicleOwnership.init();
    // }, 200)
    // attempt initialization of player profile
    utils.timers.setTimeout(() => {
      // profile.initialize();
    }, 500)

    // initialize debugging menu
    //  NOTE: debug menus will only appear in the first render of the main scene
    // DebugMenuController.Instance.InitDebugMenuInventory();
    // DebugMenuController.Instance.InitDebugMenuLeveling();
  })
}
