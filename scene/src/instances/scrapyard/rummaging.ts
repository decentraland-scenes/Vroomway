// ███████╗ ██████╗███████╗███╗   ██╗███████╗    ██████╗  █████╗ ██████╗ ███████╗███╗   ██╗████████╗
// ██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝    ██╔══██╗██╔══██╗██╔══██╗██╔════╝████╗  ██║╚══██╔══╝
// ███████╗██║     █████╗  ██╔██╗ ██║█████╗      ██████╔╝███████║██████╔╝█████╗  ██╔██╗ ██║   ██║
// ╚════██║██║     ██╔══╝  ██║╚██╗██║██╔══╝      ██╔═══╝ ██╔══██║██╔══██╗██╔══╝  ██║╚██╗██║   ██║
// ███████║╚██████╗███████╗██║ ╚████║███████╗    ██║     ██║  ██║██║  ██║███████╗██║ ╚████║   ██║
// ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝╚══════╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝
//
// Note the 180 rotation, this is so that position in Blender align with positions in DCL (with Y and Z swapped)

// import * as utils from '@dcl-sdk/utils'
import {
  type Entity,
  Transform,
  pointerEventsSystem,
  InputAction,
  GltfContainer,
  engine,
  MeshCollider,
  Animator
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { entityController } from '../../utils/entityController'
import { List } from '../../utils/collections'
import { type GameController } from '../../controllers/game.controller'
import { missions } from '../../utils/missions'
import { InventoryManager } from '../../inventory/inventory-manager'
import * as utils from '@dcl-sdk/utils'

const isDebuggingBarrels: boolean = true
const modelRootBarrelObj: string = 'assets/models/scrapyard/'
class BarrelSpawn {
  x: number
  y: number
  z: number
  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }
}
const BarrelSpawns: BarrelSpawn[] = [
  new BarrelSpawn(31.76, 0, 20.94),
  new BarrelSpawn(35.35, 0, 35.15),
  new BarrelSpawn(28.08, 0, 35.33),
  new BarrelSpawn(16.67, 0, 47.92),
  new BarrelSpawn(12.79, 0, 30.93),
  new BarrelSpawn(16.7, 0, 11.74),
  new BarrelSpawn(53.37, 3.16, 12.63),
  new BarrelSpawn(55.26, 0, 35.7),
  new BarrelSpawn(59.5, 6.08, 56.34),
  new BarrelSpawn(59.31, 10.29, 33.72),
  new BarrelSpawn(58.67, 15.48, 11.6),
  new BarrelSpawn(47.01, 15.14, 4.17),
  new BarrelSpawn(32.06, 19.74, 20.67),
  new BarrelSpawn(22.89, 30.05, 6.86),
  new BarrelSpawn(8.94, 28.79, 19.03),
  new BarrelSpawn(43.66, 47.4, 57.83),
  new BarrelSpawn(4.39, 9.78, 39.32),
  new BarrelSpawn(25.22, 0, 52.93),
  new BarrelSpawn(17.77, 0, 30.27),
  new BarrelSpawn(40.08, 0, 7.65),
  new BarrelSpawn(59.33, 0, 26.6)
]

enum BarrelDataTypes {
  green = 'green',
  blue = 'blue',
  purple = 'purple',
  gold = 'gold'
}
const BarrelData = {
  green: {
    weight: 74,
    cost: 0,
    rewardWeights: [
      [0, 50],
      [1, 30],
      [2, 15],
      [3, 5]
    ],
    model: 'barrelGreen.glb'
  },
  blue: {
    weight: 20,
    cost: 5,
    rewardWeights: [
      [1, 10],
      [2, 75],
      [3, 15]
    ],
    model: 'barrelBlue.glb'
  },
  purple: {
    weight: 5,
    cost: 10,
    rewardWeights: [
      [2, 25],
      [3, 75]
    ],
    model: 'barrelPurple.glb'
  },
  gold: {
    weight: 1,
    cost: 20,
    rewardWeights: [[3, 100]],
    model: 'barrelGold.glb'
  }
}
export class BarrelObject {
  entity: Entity
  collitionEntity: Entity
  parentEntity: Entity
  // Internal stuff
  enabled: boolean = false

  // Public, generic properties
  public inUse: boolean = false
  public isInteractable: boolean = false
  public spawnPoint: BarrelSpawn | undefined
  public type: BarrelDataTypes = BarrelDataTypes.green

  // Private, for internal reference
  interactEvent: (barrel: BarrelObject) => void
  gameController: GameController
  constructor(
    parent: Entity,
    interact: (barrel: BarrelObject) => void,
    gameController: GameController
  ) {
    this.gameController = gameController
    this.entity = entityController.addEntity()
    this.collitionEntity = entityController.addEntity()
    Transform.createOrReplace(this.collitionEntity, {
      position: Vector3.create(0, 1.5, 0),
      scale: Vector3.create(1, 1, 1),
      parent: this.entity
    })
    Transform.getMutable(this.collitionEntity).scale = Vector3.create(3, 3, 3)
    this.parentEntity = parent
    this.interactEvent = (barrel: BarrelObject) => {
      interact(barrel)
    }

    // Add the basic components

    Transform.create(this.entity, {
      position: Vector3.create(0, 0, 0),
      scale: Vector3.create(0.5, 0.5, 0.5),
      rotation: Quaternion.create(0, 0, 0),
      parent: this.parentEntity
    })
    MeshCollider.setCylinder(this.collitionEntity)
  }

  SetType(type: BarrelDataTypes): void {
    // change barrel type
    this.type = type

    // update hover text

    pointerEventsSystem.onPointerDown(
      {
        entity: this.collitionEntity,
        opts: {
          button: InputAction.IA_POINTER,
          hoverText: 'Rummage Fuel Cost: ' + this.getBarrelCost()
        }
      },
      () => {
        console.log(this.isInteractable, 'in use')
        if (!this.inUse) return
        // do not allow multiple interactions
        if (!this.isInteractable) return
        if (this.gameController.Player.getFuel() < this.getBarrelCost()) {
          if (isDebuggingBarrels)
            console.log(
              'Barrel Handler: barrel interaction not processed - not enough fuel'
            )
          this.gameController.uiController.outOfFuel.show()
        }
        this.isInteractable = false
        missions.checkAndUnlockCampaignMission('rummage')
        missions.checkAndUnlockCampaignMission('collectMaterials')
        console.log('barrels active')
        Animator.playSingleAnimation(this.entity, 'rummage')
        if (isDebuggingBarrels)
          console.log(
            'Barrel Handler: player interacted with barrel, type=' + this.type
          )
        utils.timers.setTimeout(() => {
          if (isDebuggingBarrels)
            console.log(
              'Barrel Handler: animation finished - firing secondary event'
            )
          this.interactEvent(this)
        }, 3000)
      }
    )

    // update model
    const modelLocation: string =
      modelRootBarrelObj + BarrelData[this.type].model
    GltfContainer.createOrReplace(this.entity, { src: modelLocation })
    Animator.createOrReplace(this.entity, {
      states: [
        {
          clip: 'rummage',
          loop: false,
          playing: true
        }
      ]
    })
  }

  getBarrelCost(): number {
    return this.gameController.vehicleOwnership.getFuelEff(
      BarrelData[this.type].cost
    )
  }

  PlaceBarrel(spawnPoint: BarrelSpawn | undefined): void {
    // record spawnpoint
    this.spawnPoint = spawnPoint

    // move to location (*might* be able to do this via reference in SDK7 without defining a new vector)
    Transform.getMutable(this.entity).position = Vector3.create(
      this.spawnPoint?.x,
      this.spawnPoint?.y,
      this.spawnPoint?.z
    )
  }

  /** changes the object's state/visibility based on the given value */
  public SetState(state: boolean): void {
    this.inUse = state

    // NOTE: the code below is the curren solution for the SDK7 implementation,
    //  from what I can tell they have yet to add the actual isVisible/hide functionality
    //  to the engine interface, so we can just use scaling while wait for that update

    if (this.inUse) {
      Transform.getMutable(this.entity).scale = Vector3.create(0.5, 0.5, 0.5)
    } else {
      Transform.getMutable(this.entity).scale = Vector3.create(0, 0, 0)
    }
  }
}

export class BarrelHandler {
  private debugLogPlacement: string = ''
  private debugLogRummage: string = ''
  // /** access pocketing */

  /** total weight of all barrel types */
  private static maxWeight: number
  /** current weight for barrel type calc */
  private curWeight: number = 0

  /** parental object all barrels are placed under */
  private readonly parentEntity: Entity
  public SetParent(entity: Entity): void {
    Transform.createOrReplace(entity, { parent: this.parentEntity })
  }

  // NOTE: this is a speed optimization to reduce processing at the cost of space, easier to find inactive spawnpoints
  private readonly spawnPointActive: List<BarrelSpawn | undefined>
  private readonly spawnPointInactive: List<BarrelSpawn | undefined>

  /** pool containing all barrel objects */
  private readonly barrelPool: List<BarrelObject>

  // NOTE: this is a speed optimization to reduce processing at the cost of space, easier to find inactive barrel objs
  private readonly barrelPoolActive: List<BarrelObject>
  private readonly barrelPoolInactive: List<BarrelObject>
  public gameController: GameController
  constructor(count: number = 11, gameController: GameController) {
    this.gameController = gameController
    if (isDebuggingBarrels) console.log('Barrel Handler: initializing...')
    // set up parental entity
    this.parentEntity = engine.addEntity()

    //  define max type weight
    BarrelHandler.maxWeight = 0
    for (const barrelType in BarrelData) {
      BarrelHandler.maxWeight +=
        BarrelData[barrelType as keyof typeof BarrelData].weight
    }

    // initialize spawnpoint pooling
    this.spawnPointActive = new List<BarrelSpawn>()
    this.spawnPointInactive = new List<BarrelSpawn>()
    for (let i: number = 0; i < BarrelSpawns.length; i++) {
      this.spawnPointInactive.addItem(BarrelSpawns[i])
    }

    // initialize barrel object pooling
    this.barrelPool = new List<BarrelObject>()
    this.barrelPoolActive = new List<BarrelObject>()
    this.barrelPoolInactive = new List<BarrelObject>()
    for (let i: number = 0; i < count; i++) {
      const barrel = new BarrelObject(
        this.parentEntity,
        this.CallbackInteractBarrel.bind(this),
        this.gameController
      )
      this.barrelPool.addItem(barrel)
      this.barrelPoolInactive.addItem(barrel)
    }

    if (BarrelHandler != null)
      console.log(
        'Barrel Handler: initialized barrel handler, spawnPointCount=' +
          this.spawnPointInactive.size() +
          ', barrelCount=' +
          this.barrelPool.size() +
          ', typeWeights=' +
          BarrelHandler.maxWeight
      )
  }

  getLootRarity(barrelType: BarrelDataTypes): number {
    let curWeight: number = Math.random() * 100
    for (let i = 0; i < BarrelData[barrelType].rewardWeights.length; i++) {
      curWeight -= BarrelData[barrelType].rewardWeights[i][1]
      if (curWeight <= 0) return BarrelData[barrelType].rewardWeights[i][0]
    }
    return 0
  }

  getRandomBarrelType(): BarrelDataTypes {
    // reset weighting
    this.curWeight = Math.random() * BarrelHandler.maxWeight
    if (isDebuggingBarrels)
      console.log(
        'Barrel Handler: got random barrel of weight ' +
          this.curWeight.toString()
      )
    // process each type
    for (const barrelType in BarrelData) {
      this.curWeight -= BarrelData[barrelType as keyof typeof BarrelData].weight

      if (this.curWeight <= 0) {
        return barrelType as BarrelDataTypes
      }
    }
    // default to the lowest rarity barrel if overage (should not occur)
    if (isDebuggingBarrels)
      console.log(
        'Barrel Handler: overage of ' +
          this.curWeight.toString() +
          ' dedected when getting random barrel...'
      )
    return BarrelDataTypes.purple
  }

  public PlaceAllBarrels(): void {
    const count = this.barrelPoolInactive.size()
    for (let i: number = 0; i < count; i++) {
      this.PlaceBarrel()
    }

    if (isDebuggingBarrels)
      console.log('Barrel Handler: placed all pooled barrels!')
  }

  private previousSpawn: BarrelSpawn | undefined

  PlaceBarrel(): void {
    this.debugLogPlacement = 'Barrel Handler: attempting to place barrel...'

    // ensure there is a free spawnpoint to place barrel at
    if (this.spawnPointInactive.size() === 0) {
      if (isDebuggingBarrels)
        console.log(
          this.debugLogPlacement +
            '\nbarrel was not placed: could not find inactive spawnpoint'
        )
      return
    }

    // ensure there is a free barrel to claim
    if (this.barrelPoolInactive.size() === 0) {
      if (isDebuggingBarrels)
        console.log(
          this.debugLogPlacement +
            '\nbarrel was not placed: could not find inactive barrel object'
        )
      return
    }

    // claim next inactive barrel obj
    const barrel: BarrelObject = this.barrelPoolInactive.getItem(0)
    this.barrelPoolActive.addItem(barrel)
    this.barrelPoolInactive.removeItem(barrel)

    // set barrel type
    const type = this.getRandomBarrelType()
    barrel.SetType(type)

    // claim random inactive barrel spawn
    let spawnPointIndex: number = Math.floor(
      Math.random() * this.spawnPointInactive.size()
    )
    let spawnPoint: BarrelSpawn | undefined =
      this.spawnPointInactive.getItem(spawnPointIndex)
    //  ensure no replacement at previous location
    if (spawnPoint === this.previousSpawn) {
      // roll to next index
      spawnPointIndex++
      if (spawnPointIndex >= this.spawnPointInactive.size()) spawnPointIndex = 0

      // update selection
      spawnPoint = this.spawnPointInactive.getItem(spawnPointIndex)

      // clear previous spawn
      this.previousSpawn = undefined
    }
    //  update registry
    this.spawnPointActive.addItem(spawnPoint)
    this.spawnPointInactive.removeItem(spawnPoint)

    // set barrel location
    barrel.PlaceBarrel(spawnPoint)

    // enable barrel's display state and allow interaction
    barrel.SetState(true)
    barrel.isInteractable = true

    if (isDebuggingBarrels)
      console.log(
        this.debugLogPlacement +
          '\nplaced barrel of type=' +
          barrel.type +
          ' at: x=' +
          spawnPoint?.x +
          ', y=' +
          spawnPoint?.y +
          ', z=' +
          spawnPoint?.z
      )
  }

  /** removes a barrel from use in the scene */
  public RemoveBarrel(barrel: BarrelObject): void {
    // update barrel state
    barrel.SetState(false)
    barrel.isInteractable = false

    // record previous spawn point
    this.previousSpawn = barrel.spawnPoint

    // push barrel back into inactive listing
    this.barrelPoolInactive.addItem(barrel)
    this.barrelPoolActive.removeItem(barrel)

    // release claim on spawnpoint location
    this.spawnPointInactive.addItem(barrel.spawnPoint)
    this.spawnPointActive.removeItem(barrel.spawnPoint)
  }

  /** global callback for barrel interation */
  public CallbackInteractBarrel(barrel: BarrelObject): void {
    console.log('debug callback')
    this.InteractBarrel(barrel)
  }

  /** called when user interacts with a barrel */
  public InteractBarrel(barrel: BarrelObject): void {
    console.log('debug interact')
    this.debugLogRummage = 'Barrel Handler: providing interaction rewards...'
    if (this.gameController.Player.getFuel() < barrel.getBarrelCost()) {
      if (isDebuggingBarrels)
        console.log(
          this.debugLogRummage +
            '\nfailed to rummage barrel, not enough fuel remaining'
        )
      // re-enable interactions for barrel
      barrel.isInteractable = true
      // halt and display feedback
      this.gameController.uiController.outOfFuel.show()
    }
    const { rummagingCycles } =
      this.gameController.vehicleOwnership.getBonusAttributes()

    const fuelValue = this.gameController.vehicleOwnership.getFuelEff(
      barrel.getBarrelCost()
    )
    this.gameController.Player.fuel -= fuelValue

    const expValue = this.gameController.vehicleOwnership.getExpBonus(20)
    this.gameController.Player.exp += expValue
    let rewardCoins = this.gameController.vehicleOwnership.getCoinBonus(
      Math.floor(Math.floor(Math.random() * 5)) + 5
    )
    //  provide additional coins if barrel was gold
    if (barrel.type === BarrelDataTypes.gold)
      rewardCoins += this.gameController.vehicleOwnership.getCoinBonus(500)

    if (isDebuggingBarrels)
      this.debugLogRummage +=
        '\nbarrel interaction summary (cycles=' +
        rummagingCycles +
        '): \n\tfuelCost=' +
        fuelValue +
        ', expGain=' +
        expValue +
        ', coinGain=' +
        rewardCoins

    // provide player with rewards based on their ownership
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const rewards: Record<string, number> = {}
    for (let i = 0; i < rummagingCycles; i++) {
      // get rarity
      const rarity: number = this.getLootRarity(barrel.type)
      if (isDebuggingBarrels)
        this.debugLogRummage += '\n\treward generated, rarity=' + rarity

      // get item ID
      const item: string =
        InventoryManager.Instance.GetRandomResourceViaRarity(rarity)
      if (isDebuggingBarrels) this.debugLogRummage += ', id=' + item

      // add reword to stats pool
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      rewards[item] = rewards[item] ? rewards[item] + 1 : 1
    }

    // push loot to lootboard
    this.gameController.uiController.lootBoard.updateBoardStats({
      ...rewards,
      coins: rewardCoins
    })

    // TODO: (THIS IS FROM CODEBASE) this should be relegated to automatic subscriber events
    // update ui
    this.gameController.Player.updateUI()
    this.gameController.uiController.lootBoard.toggleBoard()

    // NOTE: right now current processing automatically places barrel again without delay, but we could add a timed system that places barrels over time,
    //  maybe linked to a subvariable that defines how many barrels a user can salvage (resetting daily)

    // remove barrel obj from use
    this.RemoveBarrel(barrel)

    // place a new barrel somewhere
    this.PlaceBarrel()

    if (isDebuggingBarrels)
      console.log(this.debugLogRummage + '\nbarrel successfully rummaged!')
  }
}
