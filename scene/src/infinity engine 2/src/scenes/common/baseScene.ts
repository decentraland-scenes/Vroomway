import { Vector3 } from '@dcl/sdk/math'
import { movePlayerTo } from '~system/RestrictedActions'
import { CONFIG } from '../../config'
import {
  type PlayerAvatar,
  initAvatarSwap
} from '../../modules/avatar/avatarSwap'
import {
  initAvatarTrap,
  destroyAvatarTrap
} from '../../modules/avatarTrap/avatarTrap'
import { REGISTRY } from '../../registry'
import { type SceneConfig } from '../../sceneConfigType'
import { createTerrainColliders } from '../../terrain/terrainColliders'
import {
  createTerrainGrid,
  getGridDims,
  destroyTerrainGrid
} from '../../terrain/terrainGrid'
import {
  initWorldMoveVehicle,
  createWorldMoveVehicleContacts
} from '../../world/worldMoveVehicle'
import {
  BaseSubScene,
  type IBaseEntityWrapper
} from '../../modules/SceneMgmt/subScene'
import { log } from '../../back-ports/backPorts'
import { Skybox } from '../../modules/skybox/skybox'
import { destroySpacePartition } from '../../utils/spacePartionUtil'
import {
  initWorld,
  initWorldState,
  initWorldMove,
  destroyWorldMove,
  destroyWorldState
} from '../../world/worldMove'
import {
  initPlayerControlSystemSystem,
  destroyPlayerControlSystem
} from '../../world/worldPlayerControlSystem'

const CLASSNAME = 'BaseScene'

export class BaseScene extends BaseSubScene {
  skybox!: Skybox
  avatar!: PlayerAvatar
  sceneConfig!: SceneConfig 

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(id: number, name: string) {
    super(id, name)
  }

  init(): boolean | undefined {
    const METHOD_NAME = 'init'
    log(CLASSNAME, this.name, METHOD_NAME, 'ENTRY')

    // init will call listeners onInit that calls initWithConfig which does the heavy lifting
    // see initWithConfig for heavy lifting
    return super.init()
  }

  onInit(baseEntWrapper: IBaseEntityWrapper): void {
    const METHOD_NAME = 'onInit'
    log(CLASSNAME, this.name, baseEntWrapper.name, METHOD_NAME, 'ENTRY')
    super.onInit(baseEntWrapper)

    // one timers?
    this.initWithConfig(this.sceneConfig)
  }

  initWithConfig(sceneConfig: SceneConfig): void {
    this.sceneConfig = sceneConfig

    if (sceneConfig.skybox.enabled) {
      this.skybox = new Skybox({
        radius: sceneConfig.skybox.radius,
        materialFolder: sceneConfig.skybox.materialFolder
      })
    }

    createTerrainGrid({
      id: 'mvw-grid',
      position: Vector3.create(0, 0, 0),
      // dimX: GRID_WIDTH_X,
      // dimZ: GRID_WIDTH_Z,
      // dimY: GRID_WIDTH_Y,
      // cellSize: GRID_CELL_SIZE,
      // cellOffset: Vector3.create(CENTER_OFFSET,CENTER_OFFSET,CENTER_OFFSET),
      debug: sceneConfig.grid.debug,
      moveWithWorld: true,
      tileset: sceneConfig.grid.tileSetConf
    })

    // one timers? and then hold ref to disable?
    this.initAvatar() // usable? or is this per world too?

    initAvatarTrap(sceneConfig.avatarTrap) // trap for avatar
    initWorld(sceneConfig) // create cannon world
    initWorldMoveVehicle(sceneConfig) // create world move vehicle
    initWorldState(sceneConfig, this.avatar) // create world state
    initWorldMove(sceneConfig) // activate world move
    initPlayerControlSystemSystem(REGISTRY.worldState) // create player control system
    const terrainColliders = createTerrainColliders({
      colliderData: sceneConfig.physics.colliderData
    })
    createWorldMoveVehicleContacts(terrainColliders) // create world move vehicle contacts
  }

  moveVehicleToDefaultSpawn(): void {
    const METHOD_NAME = 'moveVehicleToDefaultSpawn'
    log(CLASSNAME, this.name, METHOD_NAME, 'ENTRY')

    const gridDims = getGridDims(this.sceneConfig.grid.tileSetConf)

    // default to center of scene
    let spawnPoint = Vector3.clone(gridDims.gridSizeCenterMeters)

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this.sceneConfig.spawnPoints?.default?.position) {
      spawnPoint =
        this.sceneConfig.spawnPoints.default.position?.toCenterVector3()
      log(
        CLASSNAME,
        METHOD_NAME,
        'custom spawnPoint',
        spawnPoint,
        'gridDims',
        gridDims
      )
    } else {
      log(
        CLASSNAME,
        METHOD_NAME,
        'default to center',
        'spawnPoint',
        spawnPoint,
        'gridDims',
        gridDims
      )
    }

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this.sceneConfig.physics.colliderData.offset) {
      spawnPoint.y += this.sceneConfig.physics.colliderData.offset.y
    }

    void movePlayerTo({
      newRelativePosition: Vector3.create(
        CONFIG.infinEngineCenter.x,
        CONFIG.infinEngineCenter.y + 0.5,
        CONFIG.infinEngineCenter.z
      ),
      cameraTarget: Vector3.create(
        CONFIG.infinEngineCenter.x,
        CONFIG.infinEngineCenter.y + 0.5,
        CONFIG.infinEngineCenter.z + 2
      )
    })

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (REGISTRY.physics.player) {
      REGISTRY.physics.player.physicsBody.position.set(
        spawnPoint.x,
        spawnPoint.y,
        spawnPoint.z
      )
    }
  }

  initAvatar(): void {
    this.avatar = initAvatarSwap(this.sceneConfig.avatar)

    // TODO store avatar in registry instead of scene entities so can be more easily accessed
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this.avatar.rootEntity) this.entities.push(this.avatar.rootEntity)
  }

  destroy(): void {
    const METHOD_NAME = 'destroy'
    log(CLASSNAME, this.name, METHOD_NAME, 'ENTRY')

    destroyWorldMove()

    destroyAvatarTrap()

    destroyTerrainGrid()

    destroySpacePartition()

    destroyPlayerControlSystem()

    destroyWorldState()

    // TODO destroy avatar better, hide modifier not removed

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this.skybox) {
      this.skybox.destroy()
      this.skybox = undefined as any
    }

    super.destroy()
    // this.reset()

    // destroyAvatar()
  }

  onHide(baseEntWrapper: IBaseEntityWrapper): void {
    const METHOD_NAME = 'onHide'
    log(CLASSNAME, this.name, baseEntWrapper.name, METHOD_NAME, 'ENTRY')
    super.onHide(baseEntWrapper)
  }

  onShow(baseEntWrapper: IBaseEntityWrapper): void {
    const METHOD_NAME = 'onShow'
    log(CLASSNAME, this.name, baseEntWrapper.name, METHOD_NAME, 'ENTRY')
    super.onShow(baseEntWrapper)
  }
}
