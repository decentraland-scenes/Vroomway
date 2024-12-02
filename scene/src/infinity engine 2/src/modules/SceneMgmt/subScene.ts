/* eslint-disable @typescript-eslint/no-for-in-array */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
// import { movePlayerTo } from '@decentraland/RestrictedActions'
// import * as utils from '@dcl/ecs-scene-utils'
// import { nftCollection, Painting } from './nfts'

import {
  type Entity,
  type TransformTypeWithOptionals,
  engine
} from '@dcl/sdk/ecs'
import { type Vector3 } from '~system/EngineApi'
import { log } from '../../back-ports/backPorts'
import { _movePlayerTo } from '../../back-ports/movePlayer'
import { SpawnPoint, type POISelectorType } from './types'

/*
per nico
  adding/removing to engine can be slower
    "after running some tests measuring hiccups in different scenarios, turns out that making entities invisible rather than removing them from the engine is a lot more efficient"
  
    it causes less hiccups and also the entities show a lot faster like this
    and I suppose we’d also avoid the issue that you reported with entities not appearing (I wasn’t able to reproduce that w my tests, though)
      it implies slightly more loading at the very beginning, but not too significant


    trade off are SHAPE_SHOW_HIDE still has active colliders
  
*/
export type EntityWrapperArgs = {
  // matches?(action: string,showActionMgr:ShowActionManager):boolean,

  // onShow?(scene:SubScene):void,
  // onHide?(scene:SubScene):void,
  // hide?():void,
  onChangeEntityVisibility?: (
    entity: BaseEntityWrapper,
    type: VisibleChangeType
  ) => void

  name?: string

  onInit?: (entity: IBaseEntityWrapper) => void
}
export type EntityActionListener = (entityWrap: IBaseEntityWrapper) => void

export type IBaseEntityWrapper = {
  name: string
  onInit?: (baseEntWrapper: IBaseEntityWrapper) => void
  onHide?: (baseEntWrapper: IBaseEntityWrapper) => void
  onShow?: (baseEntWrapper: IBaseEntityWrapper) => void
  addOnInitListener: (
    listener: (baseEntWrapper: IBaseEntityWrapper) => void
  ) => void
  addOnHideListener: (
    listener: (baseEntWrapper: IBaseEntityWrapper) => void
  ) => void
  addOnShowListener: (
    listener: (baseEntWrapper: IBaseEntityWrapper) => void
  ) => void
  hide: () => void
  disable: () => void
  enable: () => void
  show: () => void
  init: () => void
}

export type ISubScene = {
  id: number
  name: string
  entities: any[] // You can replace 'any' with the actual type of entities
} & IBaseEntityWrapper

export class BaseEntityWrapper implements IBaseEntityWrapper {
  // entity that holds the state data for subscene. ideally the root
  entity: Entity
  name: string
  // TODO store on entity
  private visible: boolean = true

  // TODO store on entity
  // NOW STORED ON entity
  // even though this object holds no entities directly, it is good to know the intent
  // for visiblity should it override the listeners onHide / onShow for how to react
  // visibilityStrategy:VisibilityStrategyEnum = VisibilityStrategyEnum.SHAPE_SHOW_HIDE
  visibleTransformInfo?: TransformTypeWithOptionals // if vault hide/showing

  initAlready: boolean = false

  onInitListener: EntityActionListener[] = [] // (scene:SubScene)=>void = []
  onShowListener: EntityActionListener[] = []
  onHideListener: EntityActionListener[] = []

  enabled: boolean = true

  constructor(entity: Entity, name: string, args?: EntityWrapperArgs) {
    this.entity = entity
    this.name = name

    // if(args && args.visibilityStrategy) this.visibilityStrategy = args.visibilityStrategy
    if (args?.onInit) this.addOnInitListener(args.onInit)
  }

  destroy(): void {
    // this.name += "-destroyed!"
    this.onInitListener = []
    this.onShowListener = []
    this.onHideListener = []
  }

  disable(): void {
    this.enabled = false
  }

  enable(): void {
    this.enabled = true
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  init() {
    // debugger
    if (!this.enabled) {
      log('init() not enabled', this.name)
      return
    }
    if (this.initAlready) return false

    this.initAlready = true

    // log("ent.checking onInit!!!",this.name)

    if (this.onInit !== undefined) {
      log('calling onInit!!!', this.name)
      this.onInit(this)
    }

    return true
  }

  getName(): string {
    return this.name
  }

  // onInit(entity:EntityWrapper) {}

  onChangeEntityVisibility(
    entity: BaseEntityWrapper,
    type: VisibleChangeType
  ): void {
    switch (type) {
      case 'hide':
        this.onHide(this)
        break
      case 'show':
        log('onChangeEntityVisibility calling onShow', this.name, this.enabled)
        this.onShow(this)
        break
    }
  }

  setVisible(val: boolean): void {
    // FIXME get sub component visible flag
    this.visible = val
  }

  isVisible(): boolean {
    // FIXME get sub component visible flag
    return this.visible
  }

  onHide(baseEntWrapper: IBaseEntityWrapper): void {
    this.processListener(baseEntWrapper, this.onHideListener)
  }

  onShow(baseEntWrapper: IBaseEntityWrapper): void {
    log('baseclass.onShow', this.onShowListener)
    this.processListener(baseEntWrapper, this.onShowListener)
  }

  onInit(baseEntWrapper: IBaseEntityWrapper): void {
    log('baseclass.onInit', this.onInitListener)
    this.processListener(baseEntWrapper, this.onInitListener)
  }

  processListener(
    sceneEnt: IBaseEntityWrapper,
    listeners: Array<(sceneEnt: IBaseEntityWrapper) => void>
  ): void {
    if (!listeners) return
    for (const p in listeners) {
      listeners[p](sceneEnt)
    }
  }

  show(force?: boolean): void {
    if (!this.initAlready) this.init()
    if (!this.enabled) {
      log('show() not enabled', this.name)
      return
    }

    if ((force === undefined || !force) && this.isVisible()) {
      log('show() already visible', this.name)
      return
    }

    this.setVisible(true) // = true
    this.onChangeEntityVisibility(this, 'show')
  }

  hide(force?: boolean): void {
    if ((force === undefined || !force) && !this.isVisible()) {
      log('hide() already hidden', this.name)
      return
    }
    if (!this.enabled) {
      log('hide() not enabled', this.name)
      return
    }

    this.setVisible(false) //
    this.onChangeEntityVisibility(this, 'hide')
  }

  addOnInitListener(listener: EntityActionListener): void {
    this.onInitListener.push(listener)
  }

  addOnShowListener(listener: EntityActionListener): void {
    this.onShowListener.push(listener)
  }

  addOnHideListener(listener: EntityActionListener): void {
    this.onHideListener.push(listener)
  }
}

export class EntityWrapper extends BaseEntityWrapper {
  rootEntity: Entity
  entities: Entity[]

  constructor(
    name: string,
    entity: Entity | Entity[],
    args?: EntityWrapperArgs
  ) {
    super(Array.isArray(entity) ? entity[0] : entity, name, args)

    if (Array.isArray(entity)) {
      // const ent:Entity = entity as Entity
      this.rootEntity = entity[0]
      this.entities = entity
    } else if (entity !== undefined) {
      this.rootEntity = entity
      this.entities = []
      this.entities.push(entity)
    } else {
      this.rootEntity = engine.addEntity() // new Entity()
      this.entities = []
    }

    // if(args && args.visibilityStrategy) this.visibilityStrategy = args.visibilityStrategy
    // if(args && args.onInit) this.onInit = args.onInit
  }

  addEntity(entity: Entity): void {
    this.entities.push(entity)
  }

  onShow(): void {
    log('EntityWrapper', 'called onShow on', this.name, this.entities.length)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const entity = this.rootEntity

    // if(this.name == 'closestTrack.debugUI') debugger

    super.onShow(this)
  }

  onHide(): void {
    log('EntityWrapper', 'called onHide', this.name, this.entities.length) //, this.visibilityStrategy)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const entity = this.rootEntity

    super.onHide(this)
  }
}
/*
export class SceneEntity extends EntityWrapper{
  constructor(name:string,entity:Entity|Entity[],args?:SceneEntityArgs){
    super(name,entity,args)
  } 

} */

export type VisibleChangeType = 'show' | 'hide'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SceneInitData = {
  name: string
  entities: any[]
  onInit?: () => void
  onHide?: () => void
  onShow?: () => void
}

// FIXME do not extend Entity
export class BaseSubScene extends BaseEntityWrapper implements ISubScene {
  id: number
  entities: Entity[]
  public spawnPoints: SpawnPoint[] = []

  constructor(id: number, name: string) {
    super(engine.addEntity(), name, undefined)

    this.id = id
    this.entities = []
  }

  destroy(): void {
    super.destroy()
    for (const p in this.entities) {
      engine.removeEntityWithChildren(this.entities[p])
    }
    // clear out
    this.entities = []

    this.initAlready = false
    this.enabled = true
  }

  randomSpawnPoint(spawnPointFilter?: POISelectorType): SpawnPoint {
    let list = this.spawnPoints

    if (spawnPointFilter !== undefined) {
      list = list.filter(function (item) {
        return item.type === spawnPointFilter.type
      })
    }

    log('randomSpawnPoint ', spawnPointFilter, list)

    const spawnPoint = list[Math.floor(Math.random() * list.length)]

    return spawnPoint
  }

  async movePlayerHere(
    spawnPointFilter?: POISelectorType | SpawnPoint
  ): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      // log("(spawnPointFilter as POISelectorType).type",(spawnPointFilter as POISelectorType).type,spawnPointFilter)

      let position: Vector3
      let cameraLook: Vector3 | undefined
      if (
        spawnPointFilter === undefined ||
        (spawnPointFilter as POISelectorType).type
      ) {
        const spawnPoint = this.randomSpawnPoint(
          spawnPointFilter as POISelectorType
        )

        if (spawnPoint?.position === undefined) {
          log(
            this.name + '.movePlayerHere no spawnPoints. not moving player',
            this.spawnPoints
          )
          resolve()
          return
        }
        position = spawnPoint.position.toCenterVector3()
        cameraLook = spawnPoint.cameraLookAt
      } else if (
        spawnPointFilter !== undefined &&
        spawnPointFilter instanceof SpawnPoint
      ) {
        if (spawnPointFilter.position === undefined) {
          log(
            this.name + '.movePlayerHere no spawnPoints. not moving player',
            this.spawnPoints
          )
          resolve()
          return
        }
        position = spawnPointFilter.position.toCenterVector3()
        cameraLook = spawnPointFilter.cameraLookAt
      } else {
        log(
          this.name +
            '.movePlayerHere type not recognized spawnPointFilter. not moving player',
          spawnPointFilter
        )
        resolve()
        return
      }

      _movePlayerTo(position, cameraLook)
        .then(() => {
          log('player move to scene ', this.name, '@', position, ' complete')
          resolve()
        })
        .catch((reason: any) => {
          log(
            'player move to scene ',
            this.name,
            '@',
            position,
            ' FAILED',
            reason
          )
          reject(reason)
        })
    })
  }
}
