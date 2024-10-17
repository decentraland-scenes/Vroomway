/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { getUserData } from '~system/UserIdentity'
import { type GameController } from '../../controllers/game.controller'

export type Attributes = {
  speedBoost: number
  coin: number
  exp: number
  gathering: number
  fuelEff: number
  rummagingCycles: number
  coinBonusPercent: number
}

export type EquippedAccessory =
  | 'none'
  | 'betaWings'
  | 'vwAura'
  | 'trophyOne'
  | 'trophyTwo'
  | 'levelCrown'
  | 'racerJacket'
// colyseus is binding to these ids, do not change values unless update server
// adding to list is safe, just not changing values
// EquippedVehicle should be copied/synced with vehicleOwnership.ts and server-state-spec
export type EquippedVehicle =
  | 'none'
  | 'diamondVroom'
  | 'flamesEnd'
  | 'tideBreaker'
  | 'viridianQuake'
  | 'obsidianStrike'
  | 'opulent'
  | 'wonderVroom'
  | 'buildaVroom'
  | 'kittyVroom'
  | 'caddyVroom'
  | 'broomVroom'
  | 'junkerVan'
  | 'vroomWing'
  | 'rollerVroom'
  | 'bosier'
  | 'divinity'
  | 'pleather'
  | 'machina'
  | 'peafowl'
  | 'rattyVroom'
  | 'vroomVroom'
  | 'modelO'
  | 'bronzeSaucer'
  | 'bronzeSaucer2'
  | 'silverSaucer'
  | 'silverSaucer2'
  | 'goldSaucer'
  | 'goldSaucer2'
  | 'speedBoots1'
  | 'speedBoots2'
  | 'speedBoots3'
  | 'hoverBike1'
  | 'hoverBike2'
  | 'hoverBike3'
  | 'hoverCar1'
  | 'hoverCar2'
  | 'hoverCar3'
  | 'brutes1'
  | 'brutes2'
  | 'brutes3'

export class VehicleOwnership {
  public speedBoost: number = 0
  public coin: number = 0
  public exp: number = 0
  public gathering: number = 0
  public fuelEff: number = 0
  public diamondVroomOwned: boolean = false
  public buildaVroomOwned: boolean = false
  public kittyVroomOwned: boolean = false
  public caddyVroomOwned: boolean = false
  public broomVroomOwned: boolean = false
  public flamesEndOwned: boolean = false
  public tideBreakerOwned: boolean = false
  public viridianQuakeOwned: boolean = false
  public junkerVanOwned: boolean = false
  public vroomWingOwned: boolean = false
  public rollerVroomOwned: boolean = false
  public bosierOwned: boolean = false
  public obsidianStrikeOwned: boolean = false
  public opulentOwned: boolean = false
  public wonderVroomOwned: boolean = false
  public divinityOwned: boolean = false
  public pleatherOwned: boolean = false
  public machinaOwned: boolean = false
  public peafowlOwned: boolean = false
  public rattyVroomOwned: boolean = false
  public vroomVroomOwned: boolean = false
  public modelOOwned: boolean = false
  public bronzeSaucerOwned: boolean = false
  public bronzeSaucer2Owned: boolean = false
  public silverSaucerOwned: boolean = false
  public silverSaucer2Owned: boolean = false
  public goldSaucerOwned: boolean = false
  public goldSaucer2Owned: boolean = false
  public speedBoots1Owned: boolean = false
  public speedBoots2Owned: boolean = false
  public speedBoots3Owned: boolean = false
  public hoverBike1Owned: boolean = false
  public hoverBike2Owned: boolean = false
  public hoverBike3Owned: boolean = false
  public hoverCar1Owned: boolean = false
  public hoverCar2Owned: boolean = false
  public hoverCar3Owned: boolean = false
  public brutes1Owned: boolean = false
  public brutes2Owned: boolean = false
  public brutes3Owned: boolean = false
  public auraAccessoryOwned: boolean = false
  public betaWingsAccessoryOwned: boolean = false
  public trophyOneAccessoryOwned: boolean = false
  public trophyTwoAccessoryOwned: boolean = false
  public levelCrownAccessoryOwned: boolean = false
  public racerJacketAccessoryOwned: boolean = false
  public equippedVehicle: EquippedVehicle | string = 'none'
  public equippedAccessory: EquippedAccessory | string = 'none'
  // Flag People  const wearingBrutes1 = (currentWearables as any).includes(
  // Beta Wings
  private readonly gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
  }

  init = async (): Promise<void> => {
    // Grab DB info and update player
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this.gameController.Player.equippedVehicle as EquippedAccessory) {
      this.equippedVehicle = this.gameController.Player.equippedVehicle
      // avatarSwap()
    }
    if (
      (this.gameController.Player.equippedAccessory as EquippedAccessory)
        .length > 0
    ) {
      this.equippedAccessory = this.gameController.Player.equippedAccessory
    }
    await this.checkVehicleOwnership()
  }

  getEquippedVehicle = (): string => this.equippedVehicle
  getEquippedAccessories = (): string => this.equippedAccessory
  getEquippedVehicleLevel = (): 1 | 2 | 3 | undefined | number => {
    if (['brutes1', 'brutes2', 'brutes3'].includes(this.equippedVehicle)) {
      const bruteLevel = parseInt(this.equippedVehicle.replace('brutes', ''))
      return bruteLevel
    }
    if (
      ['speedBoots1', 'speedBoots2', 'speedBoots3'].includes(
        this.equippedVehicle
      )
    ) {
      const bruteLevel = parseInt(
        this.equippedVehicle.replace('speedBoots', '')
      )
      return bruteLevel
    }
    if (
      ['hoverBike1', 'hoverBike2', 'hoverBike3'].includes(this.equippedVehicle)
    ) {
      const bruteLevel = parseInt(this.equippedVehicle.replace('hoverBike', ''))
      return bruteLevel
    }
    if (
      ['hoverCar1', 'hoverCar2', 'hoverCar3'].includes(this.equippedVehicle)
    ) {
      const bruteLevel = parseInt(this.equippedVehicle.replace('hoverCar', ''))
      return bruteLevel
    }
  }

  changeEquippedVehicle = (
    vehicle: EquippedVehicle,
    onInit?: boolean
  ): void => {
    this.equippedVehicle = vehicle
    // avatarSwap()
    // Dont update DB again if we're just initing
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (onInit) return
    this.gameController.Player.equippedVehicle = vehicle
    void this.gameController.Player.writeDataToServer()
  }

  changeEquippedAccessory = (accessory: EquippedAccessory): void => {
    this.equippedAccessory = accessory
    this.gameController.Player.equippedAccessory = accessory
    void this.gameController.Player.writeDataToServer()
  }

  async checkVehicleOwnership(): Promise<void> {
    try {
      const player = await getUserData({})
      const url =
        `https://peer.decentraland.org/lambdas/collections/wearables-by-owner/${player.data?.userId}`.toString()
      const response = await fetch(url)
      const usersWearables = await response.json()
      usersWearables.forEach((wearable: { urn: string | string[] }) => {
        // DIAMOND VROOM
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0x40519b3aebc58a489d576962a02efca7497faf44:0'
          )
        )
          this.diamondVroomOwned = true
        // Unique
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xa5f2cef962d2ad81db43a673a9a2b0e34f3df497:0'
          )
        )
          this.flamesEndOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0x12d5b367c1d93a1920162d4fe21c1fafefcc6cc5:0'
          )
        )
          this.tideBreakerOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xdc9be77fbcee4d374cb5460bf4a71ab81bb9c6c2:0'
          )
        )
          this.viridianQuakeOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0x82426f63212180d16afc309f2d5dee4fc397165b:0'
          )
        )
          this.obsidianStrikeOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0x2d19c4f2212ec37ed48eb8134ffbc0a695612986:0'
          )
        )
          this.opulentOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0x53d635a3732b03a2b288e7958c3478484959fb1a:0'
          )
        )
          this.goldSaucerOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xb6342949873342512c5bd0a48ad01b80bbe35e90:0'
          )
        )
          this.goldSaucer2Owned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0x53d635a3732b03a2b288e7958c3478484959fb1a:1'
          )
        )
          this.silverSaucerOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xb6342949873342512c5bd0a48ad01b80bbe35e90:1'
          )
        )
          this.silverSaucer2Owned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0x53d635a3732b03a2b288e7958c3478484959fb1a:2'
          )
        )
          this.bronzeSaucerOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xb6342949873342512c5bd0a48ad01b80bbe35e90:2'
          )
        )
          this.bronzeSaucer2Owned = true
        // Mythic
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xf907f7abe1af828ac16fd5525df019c6e44cf977:0'
          )
        )
          this.junkerVanOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0x52f5931b5658d59ee9f740b94ebcb104ab87770e:0'
          )
        )
          this.vroomWingOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xbed6f4dad1326d7ad268cc1d6beab911566f0e98:0'
          )
        )
          this.rollerVroomOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xed2692690fb36a4906ec8d04add42e2fa1510151:0'
          )
        )
          this.wonderVroomOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xf61d27b7899d2641b02c56f4617f2d01f63f7ee5:4'
          )
        )
          this.rattyVroomOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0x1628fcce52a0d2c671fe828bea0102c76d27c73e:0'
          )
        )
          this.divinityOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0x3c75b3bd751eb90db5e992e0c735d8e4df386906:0'
          )
        )
          this.pleatherOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0x2555a974177d05b50472343701e74594e14af5fc:0'
          )
        )
          this.machinaOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0x50480f858791fbbc1149a66af7fb983f2e1114e5:0'
          )
        )
          this.peafowlOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0x2d19c4f2212ec37ed48eb8134ffbc0a695612986:1'
          )
        )
          this.bosierOwned = true
        // LEGACY
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0x681a6e37e96340f21bf7401e3d770d10e3e1f1d7:0'
          )
        )
          this.buildaVroomOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xd62cb20c1fc76962aae30e7067babdf66463ffe3:0'
          )
        )
          this.kittyVroomOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xfc96c422101e708da022ebe19037eac741024a0e:0'
          )
        )
          this.caddyVroomOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xd8f18e6791dbb3468a793791e6ad9ca782643c69:3'
          )
        )
          this.broomVroomOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0x320a144099546e6561f4747686f79ec6a5c24e27:0'
          )
        )
          this.vroomVroomOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0x1306d694871ec48aa03dd36f384afa1605cce900:0'
          )
        )
          this.modelOOwned = true
        // SPEED BOOTS
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:0'
          )
        )
          this.speedBoots1Owned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:1'
          )
        )
          this.speedBoots2Owned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:2'
          )
        )
          this.speedBoots3Owned = true
        // HOVER BIKES
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:3'
          )
        )
          this.hoverBike1Owned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:4'
          )
        )
          this.hoverBike2Owned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:5'
          )
        )
          this.hoverBike3Owned = true
        // HOVER CARS
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:6'
          )
        )
          this.hoverCar1Owned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:7'
          )
        )
          this.hoverCar2Owned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:8'
          )
        )
          this.hoverCar3Owned = true
        // BRUTES
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xc294467684315e7d28aa503ac571df08d4f829be:0'
          )
        )
          this.brutes1Owned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xc294467684315e7d28aa503ac571df08d4f829be:1'
          )
        )
          this.brutes2Owned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xc294467684315e7d28aa503ac571df08d4f829be:2'
          )
        )
          this.brutes3Owned = true
        // ACCESSORIES
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xc0b2ab864ca328c94b04bdaa03b413b503331e7f:0'
          )
        )
          this.trophyOneAccessoryOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0x219d62f29682bbfd5379a08943f60738c8b2f0c3:0'
          )
        )
          this.trophyTwoAccessoryOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0x8803d94e27b3844dd191fe354ec5d88b49c66f5d:0'
          )
        )
          this.betaWingsAccessoryOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0x9d82a09b425e90e0b6dc7cdf34d5bf6db37362c4:0'
          )
        )
          this.auraAccessoryOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0xae4addb9783658c6ac331e13820a8d4d330e2606:0'
          )
        )
          this.levelCrownAccessoryOwned = true
        if (
          wearable.urn.includes(
            'urn:decentraland:matic:collections-v2:0x92e99608d311842eafad39b7e974ac4e108307c9:0'
          )
        )
          this.racerJacketAccessoryOwned = true
      })
    } catch (e) {
      // errorBoard.show()
    }
  }

  getBonusAttributes(): Attributes {
    const equippedVehicle = this.equippedVehicle
    const equippedAccessory = this.equippedAccessory
    const modelO = equippedVehicle === 'modelO'
    const legacy = ['vroomVroom', 'modelO'].includes(equippedVehicle)
    const mythic = [
      'pleather',
      'divinity',
      'machina',
      'peafowl',
      'junkerVan',
      'vroomWing',
      'rattyVroom',
      'rollerVroom',
      'bosier'
    ].includes(equippedVehicle)
    const unique = [
      'bronzeSaucer',
      'silverSaucer',
      'goldSaucer',
      'flamesEnd',
      'tideBreaker',
      'bronzeSaucer2',
      'silverSaucer2',
      'goldSaucer2',
      'viridianQuake',
      'obsidianStrike',
      'opulent'
    ].includes(equippedVehicle)
    const betaWings = equippedAccessory === 'betaWings'
    const vwAura = equippedAccessory === 'vwAura'
    const trophyOne = equippedAccessory === 'trophyOne'
    const trophyTwo = equippedAccessory === 'trophyTwo'
    const levelCrown = equippedAccessory === 'levelCrown'
    const racerJacket = equippedAccessory === 'racerJacket'
    const wonderminerOwner = equippedVehicle === 'wonderVroom'
    const diamondVroom = equippedVehicle === 'diamondVroom'
    const buildaVroom = equippedVehicle === 'buildaVroom'
    const kittyVroom = equippedVehicle === 'kittyVroom'
    const caddyVroom = equippedVehicle === 'caddyVroom'
    const broomVroom = equippedVehicle === 'broomVroom'
    let speedBoost = 0
    let exp = 0
    let coin = 0
    let coinBonusPercent = 0
    let gathering = 0
    let fuelEff = 0
    let rummagingCycles = 2

    if (legacy) {
      coinBonusPercent = 5
      rummagingCycles += 7
      speedBoost = 12
      coin = 5
      exp = modelO ? 2 : 5
      gathering = 7
      fuelEff = 12
    }
    if (mythic) {
      coinBonusPercent = 10
      rummagingCycles += 9
      speedBoost = 15
      coin = 10
      exp = 7
      gathering = 9
      fuelEff = 15
    }
    if (unique) {
      coinBonusPercent = 15
      rummagingCycles += 11
      speedBoost = 17
      coin = 15
      exp = 10
      gathering = 11
      fuelEff = 17
    }
    if (diamondVroom) {
      speedBoost = 12
      coin = 10
      coinBonusPercent = 10
      exp = 5
    }
    if (wonderminerOwner) {
      coinBonusPercent = 7
      rummagingCycles += 8
      coin = 7
      exp = 5
      gathering = 8
    }
    if (buildaVroom) {
      coinBonusPercent = 5
      rummagingCycles += 8
      coin = 5
      exp = 5
      gathering = 8
      fuelEff = 10
      speedBoost = 12
    }
    if (kittyVroom) {
      coinBonusPercent = 5
      rummagingCycles += 8
      coin = 5
      exp = 5
      gathering = 8
      fuelEff = 10
      speedBoost = 12
    }
    if (caddyVroom) {
      coinBonusPercent = 5
      rummagingCycles += 8
      coin = 5
      exp = 5
      gathering = 8
      fuelEff = 5
      speedBoost = 12
    }
    if (broomVroom) {
      coinBonusPercent = 5
      rummagingCycles += 8
      coin = 5
      exp = 5
      gathering = 8
      fuelEff = 10
      speedBoost = 12
    }

    // Flag people
    // if (miscTypeOwner) exp += 5;
    if (equippedVehicle === 'speedBoots1') speedBoost = 7
    if (equippedVehicle === 'speedBoots2') speedBoost = 8
    if (equippedVehicle === 'speedBoots3') speedBoost = 10
    if (equippedVehicle === 'hoverBike1') speedBoost = 3
    if (equippedVehicle === 'hoverBike2') speedBoost = 4
    if (equippedVehicle === 'hoverBike3') speedBoost = 6
    if (equippedVehicle === 'brutes1') speedBoost = 3
    if (equippedVehicle === 'brutes2') speedBoost = 4
    if (equippedVehicle === 'brutes3') speedBoost = 6
    if (equippedVehicle === 'hoverCar1') speedBoost = 7
    if (equippedVehicle === 'hoverCar2') speedBoost = 8
    if (equippedVehicle === 'hoverCar3') speedBoost = 10
    if (equippedVehicle === 'vroomVroom') speedBoost = 12
    if (equippedVehicle === 'modelO') speedBoost = 12
    if (equippedVehicle === 'wonderVroom') speedBoost = 12
    if (equippedVehicle === 'diamondVroom') speedBoost = 12
    if (equippedVehicle === 'buildaVroom') speedBoost = 12
    if (equippedVehicle === 'kittyVroom') speedBoost = 12
    if (equippedVehicle === 'caddyVroom') speedBoost = 12
    if (equippedVehicle === 'broomVroom') speedBoost = 12
    if (equippedVehicle === 'divinity') speedBoost = 15
    if (equippedVehicle === 'pleather') speedBoost = 15
    if (equippedVehicle === 'peafowl') speedBoost = 15
    if (equippedVehicle === 'machina') speedBoost = 15
    if (equippedVehicle === 'junkerVan') speedBoost = 15
    if (equippedVehicle === 'vroomWing') speedBoost = 15
    if (equippedVehicle === 'rollerVroom') speedBoost = 15
    if (equippedVehicle === 'bosier') speedBoost = 15
    if (equippedVehicle === 'rattyVroom') speedBoost = 15
    if (equippedVehicle === 'goldSaucer') speedBoost = 17
    if (equippedVehicle === 'silverSaucer') speedBoost = 17
    if (equippedVehicle === 'bronzeSaucer') speedBoost = 17
    if (equippedVehicle === 'goldSaucer2') speedBoost = 17
    if (equippedVehicle === 'silverSaucer2') speedBoost = 17
    if (equippedVehicle === 'bronzeSaucer2') speedBoost = 17
    if (equippedVehicle === 'flamesEnd') speedBoost = 17
    if (equippedVehicle === 'tideBreaker') speedBoost = 17
    if (equippedVehicle === 'viridianQuake') speedBoost = 17
    if (equippedVehicle === 'obsidianStrike') speedBoost = 17
    if (equippedVehicle === 'opulent') speedBoost = 17

    if (
      ['speedBoots1', 'hoverBike1', 'hoverCar1', 'brutes1'].includes(
        equippedVehicle
      )
    ) {
      gathering = 1
      rummagingCycles += 1
      if (['hoverBike1', 'hoverCar1', 'brutes1'].includes(equippedVehicle))
        fuelEff = 5
    }
    if (
      ['speedBoots2', 'hoverBike2', 'hoverCar2', 'brutes2'].includes(
        equippedVehicle
      )
    ) {
      gathering = 3
      rummagingCycles += 3
      if (['hoverBike2', 'hoverCar2', 'brutes2'].includes(equippedVehicle))
        fuelEff = 7
    }
    if (
      ['speedBoots3', 'hoverBike3', 'hoverCar3', 'brutes3'].includes(
        equippedVehicle
      )
    ) {
      gathering = 6
      rummagingCycles += 6
      if (['hoverBike3', 'hoverCar3', 'brutes3'].includes(equippedVehicle))
        fuelEff = 10
    }
    // ACCESSORIES
    if (betaWings) exp += 5
    if (vwAura) exp += 2
    if (trophyOne) {
      exp += 8
      coin += 8
      coinBonusPercent += 8
      gathering += 4
    }
    if (trophyTwo) {
      exp += 7
      coin += 7
      coinBonusPercent += 7
      gathering += 3
    }
    if (levelCrown) {
      exp += 10
      coin += 10
      coinBonusPercent += 10
      gathering += 5
    }
    if (racerJacket) {
      exp += 5
      coin += 5
      coinBonusPercent += 5
      gathering += 3
      fuelEff += 5
    }

    this.speedBoost = speedBoost
    this.coin = coin
    this.exp = exp
    this.gathering = gathering
    this.fuelEff = fuelEff
    return {
      speedBoost,
      coin,
      exp,
      gathering,
      fuelEff,
      rummagingCycles,
      coinBonusPercent
    }
  }

  getCoinBonus = (coin: number): number => {
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    const { coinBonusPercent } =
      this.gameController.vehicleOwnership.getBonusAttributes()
    const total = coin + Math.ceil((coinBonusPercent / 100) * coin)
    return total
  }

  getFuelEff = (fuel: number): number => {
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    const { fuelEff } =
      this.gameController.vehicleOwnership.getBonusAttributes()
    const total = fuel - Math.ceil((fuelEff / 100) * fuel)
    return total
  }

  getExpBonus = (expBonus: number): number => {
    const { exp } = this.gameController.vehicleOwnership.getBonusAttributes()
    const total = expBonus + Math.ceil((exp / 100) * expBonus)
    return total
  }

  computeXP(
    base: number,
    xpPowerUp: number,
    xpBonusByRacerNum: number
  ): number {
    // Math.max(0, to ensure never goes negative
    const res = Math.ceil(
      this.getExpBonus(base) +
        base * Math.max(0, xpPowerUp - 1) +
        base * Math.max(0, xpBonusByRacerNum - 1)
    )
    return res
  }
}
