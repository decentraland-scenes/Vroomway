import {
  AvatarModifierArea,
  AvatarModifierType,
  engine,
  Transform,
  type Entity
} from '@dcl/sdk/ecs'
import { type GameController } from '../controllers/game.controller'
import { Arissa } from '../instances/shared/vehicle'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { player, scene } from '../vw-decentrally/modules/scene'
import { PlayerIdentityData } from '@dcl/sdk/ecs'
import { type UserData } from '~system/Players'
import { instance } from './currentInstance'
import { getUserData } from '~system/UserIdentity'
import * as utils from '@dcl-sdk/utils'

export class AvatarSwapManager {
  gameController: GameController
  avatarSwapUuid = ''
  hideAvatarsEntity: Entity = engine.addEntity()
  hideAvatarsEntity_defined: boolean = false
  vehicle: Arissa
  lastPosition: Vector3 = Vector3.create(0, 0, 0)
  cameraPosition: Vector3 = Transform.get(engine.CameraEntity).position
  constructor(gameController: GameController) {
    this.gameController = gameController
    this.vehicle = new Arissa('', {
      position: Vector3.create(0, 0, 0),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.create(0, 0, 0, 0)
    })
    this.update()
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
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const userData = getUserData({})
    const excludeIds = await getExcludeIds((await userData).data)
    console.log('Exclude IDs:', excludeIds)
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
      engine.removeEntity(this.hideAvatarsEntity)
      this.vehicle.remove()
      player.carModelId = undefined
      console.log('remove vehicle')
    }
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
        'vehical already exists, just update/make visible',
        vehicleModel,
        this.vehicle.model
      )
      // destroy current one and make another, OR do we just update the existing one?
      this.vehicle.updateModel(vehicleModel)
    } else {
      console.log(
        METHOD_NAME,
        'vehical new, make fresh visible',
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
    // handle mod area
    if (!this.hideAvatarsEntity_defined) {
      this.hideAvatarsEntity = engine.addEntity()
      AvatarModifierArea.createOrReplace(this.hideAvatarsEntity, {
        area: Vector3.create(150, 200, 120),
        modifiers: [AvatarModifierType.AMT_HIDE_AVATARS],
        excludeIds
      })
      Transform.create(this.hideAvatarsEntity, { position: scene.center })
      utils.triggers.addTrigger(
        this.hideAvatarsEntity,
        1,
        1,
        [
          {
            type: 'box',
            scale: Vector3.create(96, 200, 80),
            position: Vector3.create(20, 0, 35)
          }
        ],
        () => {
          console.log('triggeeeredd')
          Transform.getMutable(this.vehicle.entity).scale = Vector3.create(
            1,
            1,
            1
          )
        }
      )
      this.hideAvatarsEntity_defined = true
    } else {
      if (AvatarModifierArea.getOrNull(this.hideAvatarsEntity) === null) {
        return
      }
      AvatarModifierArea.getMutable(this.hideAvatarsEntity).excludeIds =
        excludeIds
    }
  }
}

async function getExcludeIds(
  userData: UserData | undefined
): Promise<string[]> {
  const playerList: string[] = []

  // Itera sobre las entidades que tienen PlayerIdentityData y Transform
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [entity, data, transform] of engine.getEntitiesWith(
    PlayerIdentityData,
    Transform
  )) {
    // Extrae el address de cada entidad y agrégalo a la lista de jugadores
    playerList.push(data.address)
  }

  // Filtra la lista de IDs de jugadores
  return playerList.filter((addy) => {
    // eslint-disable-next-line array-callback-return
    if (instance.getInstance() === 'fuegoCircuit') return
    // eslint-disable-next-line array-callback-return
    if (instance.getInstance() === 'dragRace') return
    return addy.toLocaleLowerCase() !== userData?.userId?.toLowerCase()
  })
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
