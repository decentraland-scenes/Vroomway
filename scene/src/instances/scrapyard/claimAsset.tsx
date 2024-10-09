import { setTimeout } from '@dcl/ecs-scene-utils'
import * as ui from '@dcl/ui-scene-utils'
import { getUserData } from '@decentraland/Identity'
import * as eth from 'eth-connect'
import { errorBoard } from 'src/ui/error'
import { mintBoard } from 'src/ui/mint'
import { cleanupScene } from 'src/utils/cleanupScene'
import { LAMBDA_URL } from 'src/utils/constants'
import { loader } from 'src/utils/loader'
import { Player } from 'src/utils/player'
import { boardsSprites } from '../../ui/atlas/boardsAtlas'
import { type Sprite } from '../../ui/utils/utils'
import { instance } from '../../utils/currentInstance'
import { renderScrapyard } from '../scrapyard/scrapyard'

const speedBoot1urn =
  'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:0'
const speedBoot2urn =
  'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:1'
const speedBoot3urn =
  'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:2'
const bike1urn =
  'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:3'
const bike2urn =
  'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:4'
const bike3urn =
  'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:5'
const car1urn =
  'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:6'
const car2urn =
  'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:7'
const car3urn =
  'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:8'
const brute1urn =
  'urn:decentraland:matic:collections-v2:0xc294467684315e7d28aa503ac571df08d4f829be:0'
const brute2urn =
  'urn:decentraland:matic:collections-v2:0xc294467684315e7d28aa503ac571df08d4f829be:1'
const brute3urn =
  'urn:decentraland:matic:collections-v2:0xc294467684315e7d28aa503ac571df08d4f829be:2'

export class claimAsset {
  isVisible: boolean = true
  backGround: Sprite = boardsSprites.speedBootsBoard
  public asset1Owned: boolean = false
  public asset2Owned: boolean = false
  public asset3Owned: boolean = false
  public prevAssetOwned: boolean = false
  public assetTypeClaim: 'boots' | 'cars' | 'bikes' | 'brutes' = 'boots'
  public asset1urn: string = ''
  public asset2urn: string = ''
  public asset3urn: string = ''
  public prevAssetUrn: string = ''
  loader: any
  constructor() {
    void this.checkAssetsOwnership()
  }

  canPurchaseAsset1(): boolean {
    const {
      metal,
      rubber,
      glass,
      wires,
      propulsion,
      fuel,
      coins,
      circuitBoard
    } = Player
    switch (this.assetTypeClaim) {
      case 'boots':
        if (
          metal >= 500 &&
          rubber >= 500 &&
          wires >= 300 &&
          glass >= 300 &&
          circuitBoard >= 300 &&
          propulsion >= 100 &&
          coins >= 50000 &&
          fuel >= 100
        )
          return true
        return false
      case 'cars':
        if (
          metal >= 900 &&
          rubber >= 900 &&
          wires >= 700 &&
          glass >= 700 &&
          circuitBoard >= 700 &&
          propulsion >= 300 &&
          coins >= 70000 &&
          fuel >= 200 &&
          this.prevAssetOwned
        )
          return true
        return false
      case 'bikes':
        if (
          metal >= 700 &&
          rubber >= 700 &&
          wires >= 500 &&
          glass >= 500 &&
          circuitBoard >= 500 &&
          propulsion >= 200 &&
          coins >= 60000 &&
          fuel >= 150 &&
          this.prevAssetOwned
        )
          return true
        return false
      case 'brutes':
        if (
          metal >= 1200 &&
          rubber >= 600 &&
          wires >= 500 &&
          glass >= 750 &&
          circuitBoard >= 800 &&
          propulsion >= 250 &&
          coins >= 60000 &&
          fuel >= 150
        )
          return true
        return false
    }
  }

  subtractResources(urn: string): void {
    const hoverCar1 =
      urn ===
      'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:6'
    const hoverCar2 =
      urn ===
      'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:7'
    // const speedBoot3 = "urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:2";
    Player.getValueAdjuster().metal -= hoverCar1 ? 900 : hoverCar2 ? 1000 : 1200
    Player.getValueAdjuster().rubber -= hoverCar1
      ? 900
      : hoverCar2
      ? 1000
      : 1200
    Player.getValueAdjuster().wires -= hoverCar1 ? 700 : hoverCar2 ? 800 : 1000
    Player.getValueAdjuster().glass -= hoverCar1 ? 700 : hoverCar2 ? 800 : 1000
    Player.getValueAdjuster().circuitBoard -= hoverCar1
      ? 700
      : hoverCar2
      ? 800
      : 1000
    Player.getValueAdjuster().propulsion -= hoverCar1
      ? 300
      : hoverCar2
      ? 400
      : 600
    Player.getValueAdjuster().coins -= hoverCar1
      ? 70000
      : hoverCar2
      ? 80000
      : 100000
    Player.getValueAdjuster().fuel -= hoverCar1 ? 200 : hoverCar2 ? 250 : 300
    Player.writeDataToServer()
    Player.updateUI()
  }

  async airdrop(urn: string): Promise<void> {
    const { userId } = await getUserData()
    this.loader = new ui.LoadingIcon()
    const data = eth.toHex(`urn=${urn}&uuid=${userId}`)
    // Get the first four characters of the string
    const reversedStr = data.substring(0, data.length - 7)
    // Split the first four characters into an array of characters
    const arr = reversedStr.split('')
    // Reverse the order of the characters in the array
    arr.reverse()
    // Join the reversed characters back into a string
    const reversed = arr.join('')
    // Concatenate the reversed string with the rest of the original string
    const result = reversed.concat(data.substring(data.length - 7))
    this.subtractResources(urn)
    // Send wearable to user
    const txn = (await fetch(`${LAMBDA_URL}/airdrop?data=${result}`)) as any
    // Stop execution if there's been an error
    const json = await txn.text()
    if (json.includes('Error: please try again') === true) {
      this.showClaimingError()
      return
    }
    this.loader.hide()
    mintBoard.show(json, urn)
  }

  showClaimingError(): void {
    this.isVisible = false
    this.loader.hide()
    errorBoard.show()
  }

  showTeleportBoard(): void {
    this.hoverCarBoard.visible = false
    // this.teleportBoard.visible = true;
    ui.displayAnnouncement(
      'You need more resources to buy this!\n\nGo loot in the scrapyard for more!'
    )
  }

  teleportToScrapyard(): void {
    this.teleportBoard.visible = false
    instance.setInstance('scrapyard')
    cleanupScene()
    setTimeout(50, () => {
      renderScrapyard()
      loader.showLoader(7000)
    })
  }

  //   eButtonAction = Input.instance.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, false, (e) => {
  //     // if (this.hoverCarBoard.visible) this.teleport();
  //   });

  //   fButtonAction = Input.instance.subscribe("BUTTON_DOWN", ActionButton.SECONDARY, false, (e) => {
  //     if (this.hoverCarBoard.visible) this.cancel();
  //   });

  show(type: 'boots' | 'cars' | 'bikes' | 'brutes'): void {
    // Subscribe to keys
    // if (!Input.instance) attachKeyBindings(this.eButtonAction, this.fButtonAction);
    this.setAssetType(type)
    this.isVisible = true
  }

  cancel(): void {
    // Unsubscribe from buttons
    // removeKeyBindings(this.eButtonAction, this.fButtonAction);
    this.isVisible = false
  }

  setAssetType(type: 'boots' | 'cars' | 'bikes' | 'brutes'): void {
    void this.checkAssetsOwnership()
    this.assetTypeClaim = type
    switch (type) {
      case 'boots':
        this.asset1urn = speedBoot1urn
        this.asset2urn = speedBoot2urn
        this.asset3urn = speedBoot3urn
        break
      case 'cars':
        this.asset1urn = car1urn
        this.asset2urn = car2urn
        this.asset3urn = car3urn
        this.prevAssetUrn = bike3urn
        break
      case 'bikes':
        this.asset1urn = bike1urn
        this.asset2urn = bike2urn
        this.asset3urn = bike3urn
        this.prevAssetUrn = speedBoot3urn
        break
      case 'brutes':
        this.asset1urn = brute1urn
        this.asset2urn = brute2urn
        this.asset3urn = brute3urn

        break
    }
  }

  async checkAssetsOwnership(): Promise<void> {
    try {
      const player = await getUserData()
      //   const playerRealm = await getCurrentRealm();
      const url =
        `https://peer.decentraland.org/lambdas/collections/wearables-by-owner/${player.userId}`.toString()
      const response = await fetch(url)
      const usersWearables = await response.json()
      usersWearables.forEach((wearable: { urn: string | string[] }) => {
        if (wearable.urn.includes(this.asset1urn)) this.asset1Owned = true
        if (wearable.urn.includes(this.asset2urn)) this.asset2Owned = true
        if (wearable.urn.includes(this.asset3urn)) this.asset3Owned = true
        if (wearable.urn.includes(this.prevAssetUrn)) this.prevAssetOwned = true
      })
    } catch (e) {
      errorBoard.show()
    }
  }
}
