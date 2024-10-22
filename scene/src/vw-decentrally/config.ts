// using search service
// https://github.com/decentraland/decentrally-service

import { getRealm } from '~system/Runtime'
import {
  type ProjectileConfig,
  type RaceType,
  type UpdateType
} from '../types/types'
import type * as serverStateSpec from './modules/connection/state/server-state-spec'

const DEFAULT_ENV = 'dev'

const PLAYFAB_ENABLED = false
const PLAYFAB_TITLE_ID: Record<string, string> = {
  local: 'TODO',
  dev: 'TODO',
  stg: 'TODO',
  prd: 'TODO'
}

const COLYSEUS_ENDPOINT_URL: Record<string, string> = {
  local: 'ws://127.0.0.1:2567',
  dev: 'wss://vroomway.herokuapp.com',
  stg: 'TODO',
  prd: 'TODO'
}

const AUTH_URL: Record<string, string> = {
  local: 'http://localhost:5001', // only used if PLAYFAB_ENABLED
  localColyseus: 'TODO', // TODO get io
  dev: 'TODO', // TODO get io
  stg: 'TODO',
  prd: 'TODO'
}

const ADMIN_WALLETS_ANYONE = [
  'any' // if set to any will allow anyone to see
]

const ADMIN_WALLETS_DEFAULT = [
  '0x3aB4601A5bEb3F14196A5f9A3596E1589D6C935B', // wac
  'Xany' // if set to any will allow anyone to see
]

const ADMIN_WALLETS: Record<string, string[]> = {
  local: ADMIN_WALLETS_ANYONE, // TODO get io
  localColyseus: ADMIN_WALLETS_ANYONE, // TODO get io
  dev: ADMIN_WALLETS_DEFAULT, // TODO get io
  stg: ADMIN_WALLETS_DEFAULT,
  prd: ADMIN_WALLETS_DEFAULT
}

// const SERVICES_DOMAIN = AUTH_URL[DEFAULT_ENV]
// "http://localhost:5001"
// "https://decentrally-service.decentraland.net"

export class Config {
  ENV = DEFAULT_ENV
  // allow differentiation between vroomway proper and a side world like grandprix
  SCENE_ID: serverStateSpec.SceneId = 'vroomway'

  IN_PREVIEW = false // can be used for more debugging of things, not meant to be enabled in prod

  DEBUG_SHOW_CONNECTION_INFO = false
  DEBUG_SHOW_PLAYER_LOGIN_INFO = false
  TEST_CONTROLS_ENABLE = false
  ADMIN_WALLETS: string[] = [] // see #initForEnv
  TEST_CONTROLS_DEFAULT_EXPANDED = false // if test controls expanded by default

  // by default COLYSEUS_CONNECTION_IN_PREVIEW_MODE set by inPreview, hardcode if want it to have a value
  // controls connecting to prod with other real players or not
  // undefined means will use isPreview value (locally its true AKA dont connect to other players)
  // true means dont connect to other players
  // false means connect to other player
  COLYSEUS_CONNECTION_IN_PREVIEW_MODE: boolean | undefined = undefined
  COLYSEUS_ENDPOINT_LOCAL = 'see #initForEnv'
  COLYSEUS_ENDPOINT_NON_LOCAL = 'see #initForEnv' // prod environment
  // COLYSEUS_ENDPOINT = "wss://TODO"; // production environment

  CLIENT_VERSION = 2 // version of client so server knows what features it can enabled

  GAME_LOBBY_ROOM_NAME = 'custom_lobby'
  GAME_RACE_ROOM_NAME = 'racing_room'
  GAME_DRAG_RACE_ROOM_NAME = 'drag_racing_room'
  GAME_DEMO_DERBY_ROOM_NAME = 'demo_derby_room'
  GAME_GRAND_PRIX_LOBBY_ROOM_NAME = 'grand_prix_custom_lobby'
  GAME_GRAND_PRIX_ROOM_NAME = 'grand_prix_room'
  GAME_DEMO_DERBY_ACTIVATE_ON_TRACK_RACE_STATUS: serverStateSpec.RaceStatus =
    'not-started' // 'not-started'=move immediatly to scene; 'starting'=when have enough to start

  PLAYER_INSTANCE_CHECK_DATA_FREQ_MILLIS = 1000 / 12 // //Note: The Camera.instance data is updated at a throttled rate of 10 times per second so do it a little higher to ensure does not loose any
  SEND_RACE_DATA_FREQ_MILLIS = 1000 / 10 // doing 13 times a second or 76ms (100 or less is considered acceptable for gaming). best i could get locally was ~60ms
  ENTER_CAR_CHECK_FREQ_MILLIS = 1000 / 6 // x times a second, not sure that is needed, but incase they jump out
  RACE_RANK_SORT_FREQ_MILLIS = 1000 / 6 // 6 times a second

  GAME_DEMO_DERBY_SECONDS_PER_FLOOR_DROP = 90

  // currently server stores rankPosition 1 based. 1,2,3,4
  // but when using it in an array need to adjust by -1
  // can flip to 0 if rank changes to 0 based
  RACE_POSITION_0_BASED_OFFSET_ADJUSTMENT = -1

  GROUND_THICKNESS = 0.3
  showInivisibleGroundColliders = false

  ENABLE_BLOOM_VISIBLE_WORKAROUNDS = false

  // replaced by PROJECTILE_CONFIG.circuit.enabled
  // ENABLE_PROJECTILE_CIRCUITS = false; //if true will enable projectiles for circuits

  ENEMY_CAR_COLLIDERS_CONFIG: Record<RaceType, { enabled: boolean }> = {
    solosprint: {
      enabled: false
    },
    grandprix: {
      enabled: false
    },
    derby: {
      enabled: true
    },
    lobby: {
      enabled: false
    },
    circuit: {
      enabled: false
    },
    dragrace: {
      enabled: false
    }
  }

  ENEMY_CAR_NAMETAG_CONFIG: Record<RaceType, { enabled: boolean }> = {
    solosprint: {
      enabled: false
    },
    grandprix: {
      enabled: true
    },
    derby: {
      enabled: true
    },
    lobby: {
      enabled: true
    },
    circuit: {
      enabled: true
    },
    dragrace: {
      enabled: true
    }
  }

  LOAD_MODELS_DURING_SCENE_LOAD_ENABLED = true

  DEBUGGING_ENABLED = false
  DEBUGGING_LOGS_ENABLED = true
  DEBUGGING_UI_ENABLED = false
  DEBUGGING_TRIGGERS_ENABLED = false
  DEBUGGING_LAG_TESTING_ENABLED = false // will create a ghost image of the player to test lag correction
  DEBUG_SMALLER_AVATAR_HIDE_AREA = false // how big will hide area to be, if true will be only around car so can see player otherwise
  DEBUGGING_ENEMY_COLLIDER_BOX_VISIBLE_ENABLED = false // if enemy collider box is visible or not

  LOGIN_ENDPOINT = 'see #initForEnv'

  GAME_AUTO_CONNECT_LOBBY_ENABLED = true // if enabled will attempt to auto connect to lobby as default room
  GAME_AUTO_CONNECT_GRAND_PRIX_LOBBY_ENABLED = false // if enabled will attempt to auto connect to grand prix lobby as default room

  // max auto connect retries, prevent error always visible
  GAME_CONNECT_RETRY_MAX = 3

  TRACK_FEATURE_SLOW_DOWN_RESPAWN = 30000 // long time
  TRACK_FEATURE_DEFAULT_RESPAWN = 3000 // short

  ITEM_RECHARGE_CHECK_FREQ_MILLIS = 1000 / 6 // 6 times a second

  // PROJECTILE_SHOOT_COOLDOWN_MS = 1000 * 2;
  PROJECTILE_RELOAD_TIME = 2 // unit in seconds //TODO REMOVE REPLACE WITH PROJECTILE_CONFIG
  PROJECTILE_MAX_RELOAD_AMOUNT = 3 // TODO REMOVE REPLACE WITH PROJECTILE_CONFIG

  PROJECTILE_CONFIG: Record<RaceType, ProjectileConfig> = {
    solosprint: {
      enabled: false,
      lifeInSeconds: 1,
      speed: 20,
      reloadTimeSeconds: 2,
      shootCooldownTimeMs: 1000 * 2,
      maxReloadAmount: 3
    },
    grandprix: {
      enabled: false,
      lifeInSeconds: 1,
      speed: 20,
      reloadTimeSeconds: 2,
      shootCooldownTimeMs: 1000 * 2,
      maxReloadAmount: 3
    },
    derby: {
      enabled: true,
      lifeInSeconds: 2,
      speed: 35,
      reloadTimeSeconds: 2,
      shootCooldownTimeMs: 1000 * 2,
      maxReloadAmount: 3
    },
    lobby: {
      enabled: false,
      lifeInSeconds: 2,
      speed: 35,
      reloadTimeSeconds: 2,
      shootCooldownTimeMs: 1000 * 2,
      maxReloadAmount: 3
    },
    circuit: {
      enabled: false,
      lifeInSeconds: 1,
      speed: 20,
      reloadTimeSeconds: 2,
      shootCooldownTimeMs: 1000 * 2,
      maxReloadAmount: 3
    },
    dragrace: {
      enabled: false,
      lifeInSeconds: 1,
      speed: 20,
      reloadTimeSeconds: 2,
      shootCooldownTimeMs: 1000 * 2,
      maxReloadAmount: 3
    }
  }

  ACTIVATE_PLAYER_HIT_UPDATE_TYPE: UpdateType = 'server'
  ACTIVATE_PLAYER_DIE_UPDATE_TYPE: UpdateType = 'server'

  // BOOSTERS_COOLDOWN_MS = 100;
  BOOSTERS_RELOAD_TIME = 1 // unit in seconds
  BOOSTERS_MAX_RELOAD_AMOUNT = 3

  BOOST_CONFIG: Record<
    RaceType,
    { buttonEnabled: boolean; cooldownMs: number }
  > = {
    solosprint: {
      buttonEnabled: false,
      cooldownMs: 100
    },
    grandprix: {
      buttonEnabled: false,
      cooldownMs: 100
    },
    derby: {
      buttonEnabled: false,
      cooldownMs: 100
    },
    lobby: {
      buttonEnabled: false,
      cooldownMs: 100
    },
    circuit: {
      buttonEnabled: false,
      cooldownMs: 100
    },
    dragrace: {
      buttonEnabled: false,
      cooldownMs: 100
    }
  }

  // set valid finish resutls
  // min - min time in seconds to be a valid finish time
  VALID_FINISH_TIME_TO_SAVE_RESULT: Record<RaceType, { min: number }> = {
    solosprint: {
      min: 10
    },
    grandprix: {
      min: 10
    },
    derby: {
      min: 10
    },
    lobby: {
      min: 10
    },
    circuit: {
      min: 135
    },
    dragrace: {
      min: 10
    }
  }

  // with how we compute latency do we need to fudge it anymore?
  // with avg latancey of ~160ms a value of 50 was about 1.5 car lengths behind real so trying 99
  // curious if it relates to how frequent we update server though that should be accounted for in the
  // end to end calculation
  // will be a fuge value added onto latancey calculated to account for other drift
  // maybe better name LATENCY_MISC_FACTOR
  LATENCY_MISC_FACTOR = 99 // millis
  // how many latency datapoints to keep and average them
  LATENCY_AVERAGE_WINDOW_SIZE = 20 // try to keep 1 second.  assume latency is ~100ms 20 would be 2 seconds
  // works with how we lerp.  since we lerp fast when far, slow when near target pos. maybe we assume latency a little higher so it
  // pushes a little closer to player better
  LATENCY_LEADING_FACTOR = 1.2 // knowing there is lag + we lerp. consider lerping ahead of likely position

  SKID_SOUND_FREQ_MILLIS = 200

  // how far back u can drive form the furthest forward direct
  MAX_DRIVE_BACKWARDS_DIST_SQRED = Math.pow(8, 2)

  ENABLE_DEBUGGER_BREAK_POINTS = true // change to false to force all debugger break points to off

  PLAYFAB_ENABLED: boolean = false // see #initForEnv
  PLAYFAB_TITLEID = 'see #initForEnv'

  // how much padding past finish line to get around bug where
  // decorations drawn in center
  DRAG_TRACK_EXTRA_AFTER_FINISHLINE = 60
  DRAG_TRACK_SEGMENT_SEPERATION = 2

  //
  SPEED_WORLD_TOP_SPEED_BASELINE = 12 // base value all speeds will be adjusted from

  GAME_LEADEBOARD_MAX_RESULTS = 10
  // need to give playfab time to get updated before calling
  GAME_LEADEBOARD_END_GAME_RELOAD_DELAY_MILLIS = 1000
  // in milliseconds. how long to wait for other room disconnect to finalize
  GAME_OTHER_ROOM_DISCONNECT_TIMER_WAIT_TIME = 2000

  // workaround, because we update data client side, we must wait for server to send latest data
  // before we disconnect
  DELAY_WAIT_FOR_SERVER_LATEST_SYNC = 500 // never be equal to or higher than GAME_OTHER_ROOM_DISCONNECT_TIMER_WAIT_TIME

  initForEnv(): void {
    const env = DEFAULT_ENV

    this.COLYSEUS_ENDPOINT_LOCAL = COLYSEUS_ENDPOINT_URL[env]
    this.COLYSEUS_ENDPOINT_NON_LOCAL = COLYSEUS_ENDPOINT_URL[env] // prod environment
    this.PLAYFAB_ENABLED = PLAYFAB_ENABLED
    this.PLAYFAB_TITLEID = PLAYFAB_TITLE_ID[env]
    this.LOGIN_ENDPOINT = AUTH_URL[env] + '/player/auth'
    this.ADMIN_WALLETS = ADMIN_WALLETS[env]
  }

  /// /.io (development), .net (staging), and .org (production).
  getAuthEnv(): string {
    if (
      this.LOGIN_ENDPOINT.includes('localhost') ||
      this.LOGIN_ENDPOINT.includes('127.0.0.1')
    ) {
      return 'LOCAL'
    }
    if (this.LOGIN_ENDPOINT.includes('.io')) {
      return 'DEV'
    }
    if (this.LOGIN_ENDPOINT.includes('.net')) {
      return 'STG'
    }
    if (this.isAuthEnvProd()) {
      return 'PROD'
    }

    console.log('getAuthEnv unrecognized env', this.LOGIN_ENDPOINT)
    return 'UNKNOWN' // Fallback return value
  }

  isAuthEnvProd(): boolean {
    if (this.LOGIN_ENDPOINT.includes('.org')) {
      // org is the external facing cloudflare end point
      return true
    }
    return false
  }

  getAuthEnvSingleLetter(): string | undefined {
    return this.getAuthEnv().substr(0, 1)
  }
}

export const CONFIG = new Config()
CONFIG.initForEnv()

// set in preview mode from env, local == preview
async function checkPreview(): Promise<void> {
  const { realmInfo } = await getRealm({})
  if (realmInfo === null) {
    setInPreview(true)
  } else {
    setInPreview(false)
  }
}
void checkPreview()

export function setInPreview(val: boolean): void {
  console.log('setInPreview ' + val)
  CONFIG.IN_PREVIEW = val
  if (CONFIG.COLYSEUS_CONNECTION_IN_PREVIEW_MODE === undefined) {
    console.log('setInPreview COLYSEUS_CONNECTION_IN_PREVIEW_MODE set ' + val)
    CONFIG.COLYSEUS_CONNECTION_IN_PREVIEW_MODE = val
  } else {
    console.log(
      'setInPreview COLYSEUS_CONNECTION_IN_PREVIEW_MODE ALREADY SET TO ' +
        CONFIG.COLYSEUS_CONNECTION_IN_PREVIEW_MODE
    )
  }

  // var console: any
}
