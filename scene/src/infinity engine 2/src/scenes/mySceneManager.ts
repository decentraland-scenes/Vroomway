/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Vector3 } from '@dcl/sdk/math'
import { REGISTRY } from '../registry'
import { type BaseScene } from './common/baseScene'
import { SceneManager } from '../modules/SceneMgmt/sceneManager'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CLASS_NAME = 'MySceneManager'
export class MySceneManager extends SceneManager {
  static instance: MySceneManager

  static getInstance(): MySceneManager {
    if (!MySceneManager.instance || MySceneManager.instance === undefined) {
      MySceneManager.instance = new MySceneManager()
    }
    return MySceneManager.instance
  }

  _activeScene!: BaseScene
  // ideally these point at concrete instance classes
  // however to keep the demo simple for deleteing demo things
  // will use common base class
  skateParkSceneStom!: BaseScene
  raceTrackScene!: BaseScene

  playerLocationBeforeRace: Vector3 = Vector3.Zero()

  goSkateParkStom(force?: boolean): void {
    // Constants.doLoginFlow(
    //    {
    //      onSuccess:()=>{
    this.destroyActiveScene()

    const alreadyRacing = this.skateParkSceneStom.isVisible()

    this._activeScene = this.skateParkSceneStom
    // -3 for player height with padding if standing on stuff

    this.capturePlayerLobbyPosition()

    if ((force === undefined || !force) && alreadyRacing) {
      console.log('already racing')
      // run these anyway just in case state got messed up
      this.changeToScene(this.skateParkSceneStom)
      this.skateParkSceneStom.moveVehicleToDefaultSpawn()
    } else {
      // if(!Constants.showedHowToPlayAlready){
      // REGISTRY.Game_2DUI.openHowToPlayPrompt()
      // }else{
      this.changeToScene(this.skateParkSceneStom)
      this.skateParkSceneStom.moveVehicleToDefaultSpawn()
      // this.racingScene.initRace(force)
      // }
    }
    //    }
    //  }
    // )
  }

  goRaceTrack(force?: boolean): void {
    // Constants.doLoginFlow(
    //    {
    //      onSuccess:()=>{
    this.destroyActiveScene()

    const alreadyRacing = this.raceTrackScene.isVisible()

    this._activeScene = this.raceTrackScene
    // -3 for player height with padding if standing on stuff

    this.capturePlayerLobbyPosition()

    if ((force === undefined || !force) && alreadyRacing) {
      console.log('already racing')
      // run these anyway just in case state got messed up
      this.changeToScene(this.raceTrackScene)
      this.raceTrackScene.moveVehicleToDefaultSpawn()
    } else {
      // if(!Constants.showedHowToPlayAlready){
      // REGISTRY.Game_2DUI.openHowToPlayPrompt()
      // }else{
      this.changeToScene(this.raceTrackScene)
      this.raceTrackScene.moveVehicleToDefaultSpawn()
      // this.racingScene.initRace(force)
      // }
    }
    //    }
    //  }
    // )
  }

  destroyActiveScene(): void {
    // destrony any existing scene
    if (this._activeScene) {
      this._activeScene.destroy()
    }
  }

  capturePlayerLobbyPosition(): void {
    /* if( player.camera.position.y  < scene.raceGroundElevation - 3 ){
      this.playerLocationBeforeRace = new Vector3().copyFrom( player.camera.position )

      //also check distance from center which is not a place to be spawned

      const centerIgnoreHeight = new Vector3().copyFrom(scene.center)
      centerIgnoreHeight.y = this.playerLocationBeforeRace.y
      const distFromCenter = realDistance(this.playerLocationBeforeRace,centerIgnoreHeight)
      log("goRace check dist from center",this.playerLocationBeforeRace,distFromCenter)
      const minDistance = 8
      if(distFromCenter < minDistance){
        //how did they start a game from in side the tower?
        //TODO have predefined spawn spots?
        this.playerLocationBeforeRace.x += (minDistance-this.playerLocationBeforeRace.x)
        this.playerLocationBeforeRace.y += 1 //to avoid spawning inside something
        log("goRace move out from center",this.playerLocationBeforeRace,distFromCenter)
      }

    }else{
      log("goRace playerLocationBeforeRace player in race so dont capture",this.playerLocationBeforeRace)
      //see if has value, if missing for some reason pick a safe respawn point
      //this.playerLocationBeforeRace
    } */
  }
}

export function initSceneMgr(): void {
  // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
  REGISTRY.SCENE_MGR = MySceneManager.getInstance()
}
