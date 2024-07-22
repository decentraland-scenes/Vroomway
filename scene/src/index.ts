import * as utils from '@dcl-sdk/utils'
import { GameController } from './controllers/game.controller'
import { Vector3 } from '@dcl/sdk/math'
import { movePlayerTo } from '~system/RestrictedActions'
import { executeTask } from '@dcl/sdk/ecs'
import { dailyMission } from './utils/dailyMissions'
import { Spawn_Tracks } from './spawners/tracks'

export function main(): void {
  // prepare entry scene
  const game = new GameController()
  // prepare solo sprint track

  const Tracks = new Spawn_Tracks()
  Tracks.spawnFloor1()
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

// daily mission routine
executeTask(async () => {
  // Fetch daily missions a copule minutes after 12pm UTC (when server-side reset happens)
  function fetchAtNext12pmUTC(): void {
    const now = new Date()
    let targetTime = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        12,
        2,
        0
      )
    )
    if (now >= targetTime) {
      targetTime = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() + 1,
          12,
          2,
          0
        )
      )
    }
    const delayMs = targetTime.getTime() - now.getTime()
    utils.timers.setTimeout(() => {
      void dailyMission.fetchMissionData()
    }, delayMs)
  }
  fetchAtNext12pmUTC()
})
