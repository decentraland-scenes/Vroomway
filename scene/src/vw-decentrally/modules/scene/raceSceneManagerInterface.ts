import { type PowerUpSelection } from "../connection/state/server-state-spec";
export type LevelModeType = {
  type: 'normal' | 'tournament'
  // more stuff like branch, level, difficulty...?
}
export type SceneArgs = {
  mode?: LevelModeType
  powerUps?: PowerUpSelection
}

// workaround to break cyclic deps
export type IRaceSceneManager = {
  // lastRaceType: RaceType;
  // lobbyScene: LobbyScene;
  // grandPrixScene: GrandPrixScene;
  // racingScene: RacingScene;
  // demoDerbyScene: DemoDerbyScene;
  changeToDemoDerby: (force?: boolean) => void
  goRace: (options?: SceneArgs, force?: boolean) => void
  goDragRace: (options?: SceneArgs, force?: boolean) => void
  goLobby: (options?: SceneArgs, force?: boolean) => void
  goGrandPrix: (options?: SceneArgs, force?: boolean) => void
  goDemoDerby: (options?: SceneArgs, force?: boolean) => void
}

export let SCENE_MGR: IRaceSceneManager // = new RaceSceneManager();
