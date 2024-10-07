import type * as serverStateSpec from '../connection/state/server-state-spec'
export type LevelModeType = {
  type: 'normal' | 'tournament'
  // more stuff like branch, level, difficulty...?
}
export type SceneArgs = {
  mode?: LevelModeType
  powerUps?: serverStateSpec.PowerUpSelection
}
