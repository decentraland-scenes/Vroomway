import {
  AvatarModifierArea,
  AvatarModifierType,
  engine,
  PlayerIdentityData,
  Transform,
  type Entity
} from '@dcl/sdk/ecs'
import { type GameController } from '../controllers/game.controller'
import { Arissa } from '../instances/shared/vehicle'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { player } from '../vw-decentrally/modules/scene'
import { getUserData } from '~system/UserIdentity'
import { instance } from './currentInstance'

export class AvatarSwapManager {
  gameController: GameController
  avatarSwapUuid = ''
  hideAvatarsEntity: Entity = engine.addEntity()
  vehicle: Arissa
  lastPosition: Vector3 = Vector3.create(0, 0, 0)
  excludeIds: string[] = []
  cameraPosition: Vector3 = Transform.get(engine.CameraEntity).position
  vehicleEquipped: boolean = false
  userID: string | undefined = ''
  constructor(gameController: GameController) {
    this.gameController = gameController
    this.vehicle = new Arissa('', {
      position: Vector3.create(0, 0, 0),
      scale: Vector3.create(0, 0, 0),
      rotation: Quaternion.create(0, 0, 0, 0)
    })
    Transform.create(this.hideAvatarsEntity, {
      position: Vector3.create(48.0, 100, 32.0),
      scale: Vector3.create(1, 1, 1)
    })

    AvatarModifierArea.create(this.hideAvatarsEntity, {
      area: Vector3.create(96, 1, 64),
      modifiers: [AvatarModifierType.AMT_HIDE_AVATARS],
      excludeIds: []
    })
    void this.getUserData()
    this.update()
  }

  async getUserData(): Promise<void> {
    const userData = getUserData({})
    this.userID = (await userData).data?.userId
  }

  update(): void {
    engine.addSystem(() => {
      const currentPosition = Transform.get(engine.PlayerEntity).position
      if (!equals(this.lastPosition, currentPosition)) {
        this.vehicle.playRunning()
      } else {
        this.vehicle.playIdle()
      }
      this.lastPosition = currentPosition
    })
  }

  async avatarSwap(): Promise<void> {
    console.log('avatar swap')
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type

    const METHOD_NAME = 'avatarSwap'
    let vehicleModel = ''
    const currentWearable =
      this.gameController.vehicleOwnership.getEquippedVehicle()
    const wearingDiamondVroom = currentWearable === 'diamondVroom'
    const wearingBuildaVroom = currentWearable === 'buildaVroom'
    const wearingKittyVroom = currentWearable === 'kittyVroom'
    const wearingCaddyVroom = currentWearable === 'caddyVroom'
    const wearingBroomVroom = currentWearable === 'broomVroom'
    const wearingFlamesEnd = currentWearable === 'flamesEnd'
    const wearingTideBreaker = currentWearable === 'tideBreaker'
    const wearingViridianQuake = currentWearable === 'viridianQuake'
    const wearingJunkerVan = currentWearable === 'junkerVan'
    const wearingVroomWing = currentWearable === 'vroomWing'
    const wearingRollerVroom = currentWearable === 'rollerVroom'
    const wearingBosier = currentWearable === 'bosier'
    const wearingObsidianStrike = currentWearable === 'obsidianStrike'
    const wearingOpulent = currentWearable === 'opulent'
    const wearingWonderminer = currentWearable === 'wonderVroom'
    const wearingDivinity = currentWearable === 'divinity'
    const wearingPleather = currentWearable === 'pleather'
    const wearingMachina = currentWearable === 'machina'
    const wearingPeafowl = currentWearable === 'peafowl'
    const wearingRattyVroom = currentWearable === 'rattyVroom'
    const wearingGoldSaucer = currentWearable === 'goldSaucer'
    const wearingSilverSaucer = currentWearable === 'silverSaucer'
    const wearingBronzeSaucer = currentWearable === 'bronzeSaucer'
    const wearingGoldSaucer2 = currentWearable === 'goldSaucer2'
    const wearingSilverSaucer2 = currentWearable === 'silverSaucer2'
    const wearingBronzeSaucer2 = currentWearable === 'bronzeSaucer2'
    const wearingVroomVroom = currentWearable === 'vroomVroom'
    const wearingModelO = currentWearable === 'modelO'
    const wearingBrutes1 = currentWearable === 'brutes1'
    const wearingBrutes2 = currentWearable === 'brutes2'
    const wearingBrutes3 = currentWearable === 'brutes3'
    const wearingSpeedBoots1 = currentWearable === 'speedBoots1'
    const wearingSpeedBoots2 = currentWearable === 'speedBoots2'
    const wearingSpeedBoots3 = currentWearable === 'speedBoots3'
    const wearingHoverBike1 = currentWearable === 'hoverBike1'
    const wearingHoverBike2 = currentWearable === 'hoverBike2'
    const wearingHoverBike3 = currentWearable === 'hoverBike3'
    const wearingHoverCar1 = currentWearable === 'hoverCar1'
    const wearingHoverCar2 = currentWearable === 'hoverCar2'
    const wearingHoverCar3 = currentWearable === 'hoverCar3'

    if (wearingDiamondVroom) vehicleModel = 'models/diamondVroomVehicle.glb'
    if (wearingBuildaVroom) vehicleModel = 'models/buildaVroomVehicle.glb'
    if (wearingKittyVroom) vehicleModel = 'models/kittyVroomVehicle.glb'
    if (wearingCaddyVroom) vehicleModel = 'models/caddyVroomVehicle.glb'
    if (wearingBroomVroom) vehicleModel = 'models/broomVroomVehicle.glb'
    if (wearingFlamesEnd) vehicleModel = 'models/flamesEndVehicle.glb'
    if (wearingTideBreaker) vehicleModel = 'models/tideBreakerVehicle.glb'
    if (wearingViridianQuake) vehicleModel = 'models/viridianQuakeVehicle.glb'
    if (wearingJunkerVan) vehicleModel = 'models/junkerVanVehicle.glb'
    if (wearingVroomWing) vehicleModel = 'models/vroomWingVehicle.glb'
    if (wearingRollerVroom) vehicleModel = 'models/rollerVroomVehicle.glb'
    if (wearingBosier) vehicleModel = 'models/bosierVehicle.glb'
    if (wearingObsidianStrike) vehicleModel = 'models/obsidianStrikeVehicle.glb'
    if (wearingOpulent) vehicleModel = 'models/opulentVehicle.glb'
    if (wearingWonderminer) vehicleModel = 'models/wonderVroomVehicle.glb'
    if (wearingDivinity) vehicleModel = 'models/divinityVehicle.glb'
    if (wearingPleather) vehicleModel = 'models/pleatherVehicle.glb'
    if (wearingMachina) vehicleModel = 'models/machinaVehicle.glb'
    if (wearingRattyVroom) vehicleModel = 'models/rattyVroomVehicle.glb'
    if (wearingPeafowl) vehicleModel = 'models/peafowlVehicle.glb'
    if (wearingGoldSaucer) vehicleModel = 'models/goldSaucerVehicle.glb'
    if (wearingSilverSaucer) vehicleModel = 'models/silverSaucerVehicle.glb'
    if (wearingBronzeSaucer) vehicleModel = 'models/bronzeSaucerVehicle.glb'
    if (wearingGoldSaucer2) vehicleModel = 'models/goldSaucer2Vehicle.glb'
    if (wearingSilverSaucer2) vehicleModel = 'models/silverSaucer2Vehicle.glb'
    if (wearingBronzeSaucer2) vehicleModel = 'models/bronzeSaucer2Vehicle.glb'
    if (wearingVroomVroom) vehicleModel = 'models/vroomVehicle.glb'
    if (wearingSpeedBoots1) vehicleModel = 'models/sbVehicle1.glb'
    if (wearingSpeedBoots2) vehicleModel = 'models/sbVehicle2.glb'
    if (wearingSpeedBoots3) vehicleModel = 'models/sbVehicle3.glb'
    if (wearingBrutes1) vehicleModel = 'models/bruteVehicle1.glb'
    if (wearingBrutes2) vehicleModel = 'models/bruteVehicle2.glb'
    if (wearingBrutes3) vehicleModel = 'models/bruteVehicle3.glb'
    if (wearingHoverBike1) vehicleModel = 'models/hbVehicle1.glb'
    if (wearingHoverBike2) vehicleModel = 'models/hbVehicle2.glb'
    if (wearingHoverBike3) vehicleModel = 'models/hbVehicle3.glb'
    if (wearingHoverCar1) vehicleModel = 'models/hcVehicle1.glb'
    if (wearingHoverCar2) vehicleModel = 'models/hcVehicle2.glb'
    if (wearingHoverCar3) vehicleModel = 'models/hcVehicle3.glb'
    if (wearingModelO) vehicleModel = 'models/modelOVehicle.glb'
    const notWearingVehicle =
      !wearingDiamondVroom &&
      !wearingBuildaVroom &&
      !wearingKittyVroom &&
      !wearingCaddyVroom &&
      !wearingBroomVroom &&
      !wearingFlamesEnd &&
      !wearingTideBreaker &&
      !wearingViridianQuake &&
      !wearingJunkerVan &&
      !wearingVroomWing &&
      !wearingRollerVroom &&
      !wearingBosier &&
      !wearingObsidianStrike &&
      !wearingOpulent &&
      !wearingWonderminer &&
      !wearingBrutes1 &&
      !wearingBrutes2 &&
      !wearingBrutes3 &&
      !wearingDivinity &&
      !wearingPleather &&
      !wearingMachina &&
      !wearingPeafowl &&
      !wearingRattyVroom &&
      !wearingGoldSaucer &&
      !wearingSilverSaucer &&
      !wearingBronzeSaucer &&
      !wearingGoldSaucer2 &&
      !wearingSilverSaucer2 &&
      !wearingBronzeSaucer2 &&
      !wearingVroomVroom &&
      !wearingModelO &&
      !wearingSpeedBoots1 &&
      !wearingSpeedBoots2 &&
      !wearingSpeedBoots3 &&
      !wearingHoverBike1 &&
      !wearingHoverBike2 &&
      !wearingHoverBike3 &&
      !wearingHoverCar1 &&
      !wearingHoverCar2 &&
      !wearingHoverCar3
    if (notWearingVehicle) {
      console.log('avatar swap - not wearing a vehicle', notWearingVehicle)
      AvatarModifierArea.getMutable(this.hideAvatarsEntity).excludeIds =
        getExcludeIds(this.userID, true).sort()
      this.vehicle.remove()
      player.carModelId = undefined
      return
    }
    Transform.getMutable(this.hideAvatarsEntity).position.y = 0
    AvatarModifierArea.getMutable(this.hideAvatarsEntity).excludeIds =
      getExcludeIds(this.userID, false).sort()
    player.avatarSwapCarModelId = vehicleModel
      .replace('assets/models/racing-models/circuitVehicles/', '')
      .replace('assets/models/', '') // nuevo replace para la carpeta assets
      .replace('models/racing-models/circuitVehicles/', '') // para eliminar rutas específicas si corresponde
      .replace('models/', '') // este lo mantienes si aún usas modelos desde "models/"
      .replace('CIRCUITS.glb', '') // este lo mantienes si sigue aplicando
      .replace('.glb', '') // elimina la extensión del archivo

    player.carModelId = player.avatarSwapCarModelId
    console.log(
      METHOD_NAME,
      'carModelId.avatarswap',
      'PLAYER CAR MODEL',
      player.carModelId,
      player.avatarSwapCarModelId
    )
    if (this.vehicle.model !== 'assets/') {
      console.log(
        METHOD_NAME,
        'avatar swap - vehical already exists, just update/make visible',
        vehicleModel,
        this.vehicle.model
      )
      // destroy current one and make another, OR do we just update the existing one?
      this.vehicle.updateModel(vehicleModel)
    } else {
      console.log(
        METHOD_NAME,
        ' avatar swap - vehical new, make fresh visible',
        vehicleModel,
        this.vehicle.model
      )
      // Vehicle
      Transform.getMutable(this.vehicle.entity).position = Vector3.create(
        0,
        0,
        -0.1
      )
      Transform.getMutable(this.vehicle.entity).scale = Vector3.create(1, 1, 1)
      Transform.getMutable(this.vehicle.entity).parent = engine.PlayerEntity
      this.vehicle.updateModel(vehicleModel)
    }
    console.log(
      'avatar swap - excluded ids',
      AvatarModifierArea.get(this.hideAvatarsEntity).excludeIds
    )
    // handle mod area
  }
}

export function getExcludeIds(
  userID: string | undefined,
  add: boolean
): string[] {
  const playerList: string[] = []
  const excludeIds = new Set<string>()

  // Itera sobre las entidades que tienen PlayerIdentityData y Transform
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [entity, data, transform] of engine.getEntitiesWith(
    PlayerIdentityData,
    Transform
  )) {
    // Extrae el address de cada entidad y agrégalo a la lista de jugadores
    playerList.push(data.address.toLowerCase()) // Convertimos todo a minúsculas aquí para facilitar las comparaciones.
  }

  // Filtra la lista de IDs de jugadores
  const filteredList = playerList.filter((addy) => {
    const instanceName = instance.getInstance()
    if (instanceName === 'fuegoCircuit' || instanceName === 'dragRace')
      return false
    return addy !== userID?.toLowerCase()
  })

  // Modifica excludeIds según el valor de add
  if (userID != null) {
    const userIdLower = userID.toLowerCase()
    if (add) {
      excludeIds.add(userIdLower)
    } else {
      excludeIds.delete(userIdLower)
    }
  }

  // Convierte el Set a un array y retorna
  return [...excludeIds, ...filteredList]
}

export function equals(
  vectorA: Vector3,
  vectorB: Vector3,
  epsilon: number = 0.0001
): boolean {
  const diffX = Math.abs(vectorA.x - vectorB.x)
  const diffY = Math.abs(vectorA.y - vectorB.y)
  const diffZ = Math.abs(vectorA.z - vectorB.z)

  return diffX < epsilon && diffY < epsilon && diffZ < epsilon
}

export function copyFrom(
  source: Vector3.MutableVector3,
  target: Vector3.MutableVector3
): Vector3.MutableVector3 {
  target.x = source.x
  target.y = source.y
  target.z = source.z
  return target
}

// Define la función clone
export function clone(source: Vector3): Vector3 {
  return Vector3.create(source.x, source.y, source.z)
}
