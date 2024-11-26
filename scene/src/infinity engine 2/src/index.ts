import { initConfig } from './config'
import { setupDemo } from './demo/setupDemo'
import { initMyFirstScene } from './myFirstScene/getting-started'
import { initRegistry, REGISTRY } from './registry'
import { initSceneMgr } from './scenes/mySceneManager'

// export all the functions required to make the scene work
export * from '@dcl/sdk'

export function infinityEngineMain(): void {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
      REGISTRY.SCENE_MGR.destroyActiveScene()
    }
  })
}
