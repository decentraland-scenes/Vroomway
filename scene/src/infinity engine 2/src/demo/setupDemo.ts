import { REGISTRY } from '../registry'
import {
  initRaceTrackSceneConf,
  RACE_TRACK_CONF_8_8_32
} from '../scenes/demo/raceTrack/raceTrackConfs'
import { RaceTrackScene } from '../scenes/demo/raceTrack/raceTrackScene'
import { SkateParkSceneStom } from '../scenes/demo/skateParkStom/skateParkSceneStom'
import {
  initSkateParkStomConfs,
  SKATE_PARK_STOM_CONF_8_8_30
} from '../scenes/demo/skateParkStom/skateParkSceneStomConfs'

export function setupDemo(): void {
  // IT IS SAFE TO DELETE everything in this method if you plan to write your own scene code
  function setupSkateParkStomInst(): void {
    const skatePartScene = new SkateParkSceneStom(
      REGISTRY.SCENE_MGR.generateSceneId(),
      'skateParkStomScene'
    )
    initSkateParkStomConfs()
    // set default
    skatePartScene.sceneConfig = SKATE_PARK_STOM_CONF_8_8_30

    REGISTRY.SCENE_MGR.skateParkSceneStom = skatePartScene
  }

  function setupRaceTrackInst(): void {
    const raceTrackScene = new RaceTrackScene(
      REGISTRY.SCENE_MGR.generateSceneId(),
      'raceTrackScene'
    )
    initRaceTrackSceneConf()
    // set default
    raceTrackScene.sceneConfig = RACE_TRACK_CONF_8_8_32

    REGISTRY.SCENE_MGR.raceTrackScene = raceTrackScene
  }

  setupSkateParkStomInst()
  setupRaceTrackInst()
}
