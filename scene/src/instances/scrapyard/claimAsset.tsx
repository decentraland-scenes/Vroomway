import { getUserData } from '~system/UserIdentity'
import { type UIController } from '../../controllers/ui.controller'
import { boardsSprites } from '../../ui/atlas/boardsAtlas'
import { getUvs, type Sprite } from '../../ui/utils/utils'
import { LAMBDA_URL } from '../../utils/constants'
import * as eth from 'eth-connect'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { buttonsSprites } from '../../ui/atlas/buttonsSprites'

type Asset = {
  urn: string[]
  cost: {
    metal: number[]
    rubber: number[]
    wires: number[]
    glass: number[]
    circuitBoard: number[]
    propulsion: number[]
    coins: number[]
    fuel: number[]
  }
}
export const CLAIMABLE_ASSETS: Record<string, Asset> = {
  speedBoots: {
    urn: [
      'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:0',
      'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:1',
      'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:2'
    ],
    cost: {
      metal: [500, 600, 800],
      rubber: [500, 600, 800],
      wires: [300, 400, 600],
      glass: [300, 400, 600],
      circuitBoard: [300, 400, 500],
      propulsion: [100, 200, 400],
      coins: [50000, 50000, 75000],
      fuel: [100, 150, 200]
    }
  },
  hoverBikes: {
    urn: [
      'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:3',
      'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:4',
      'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:5'
    ],
    cost: {
      metal: [700, 800, 1000],
      rubber: [700, 800, 1000],
      wires: [500, 600, 800],
      glass: [500, 600, 800],
      circuitBoard: [500, 600, 800],
      propulsion: [200, 300, 500],
      coins: [60000, 60000, 85000],
      fuel: [150, 200, 250]
    }
  },
  hoverCars: {
    urn: [
      'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:6',
      'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:7',
      'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:8'
    ],
    cost: {
      metal: [900, 1000, 1200],
      rubber: [900, 1000, 1200],
      wires: [700, 800, 1000],
      glass: [700, 800, 1000],
      circuitBoard: [700, 800, 1000],
      propulsion: [300, 500, 600],
      coins: [70000, 80000, 100000],
      fuel: [200, 250, 300]
    }
  },
  brutes: {
    urn: [
      'urn:decentraland:matic:collections-v2:0xc294467684315e7d28aa503ac571df08d4f829be:0',
      'urn:decentraland:matic:collections-v2:0xc294467684315e7d28aa503ac571df08d4f829be:1',
      'urn:decentraland:matic:collections-v2:0xc294467684315e7d28aa503ac571df08d4f829be:2'
    ],
    cost: {
      metal: [1200, 1500, 1750],
      rubber: [600, 750, 900],
      wires: [500, 650, 800],
      glass: [750, 850, 900],
      circuitBoard: [800, 1000, 1100],
      propulsion: [250, 300, 450],
      coins: [60000, 65000, 75000],
      fuel: [150, 200, 300]
    }
  }
}

export class ClaimAsset {
  assets: Asset = CLAIMABLE_ASSETS.speedBoots
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
  uiController: UIController
  loader: any
  constructor(uiController: UIController) {
    this.uiController = uiController
    void this.checkAssetsOwnership()
  }

  canPurchaseAsset(index: number): boolean {
    const {
      metal
      //   rubber,
      //   glass,
      //   wires,
      //   propulsion,
      //   fuel,
      //   coins,
      //   circuitBoard
    } = this.uiController.gameController.Player

    if (
      //   metal >= this.assets.cost.metal[index] &&
      //   rubber >= this.assets.cost.rubber[index] &&
      //   wires >= this.assets.cost.wires[index] &&
      //   glass >= this.assets.cost.glass[index] &&
      //   circuitBoard >= this.assets.cost.circuitBoard[index] &&
      //   propulsion >= this.assets.cost.propulsion[index] &&
      //   coins >= this.assets.cost.coins[index] &&
      //   fuel >= this.assets.cost.fuel[index] &&
      //   this.prevAssetOwned
      metal >= 0
    )
      return true
    return false
  }

  subtractResources(index: number): void {
    // this.uiController.gameController.Player.getValueAdjuster().metal -=
    //   this.assets.cost.metal[index]
    // this.uiController.gameController.Player.getValueAdjuster().rubber -=
    //   this.assets.cost.rubber[index]
    // this.uiController.gameController.Player.getValueAdjuster().wires -=
    //   this.assets.cost.wires[index]
    // this.uiController.gameController.Player.getValueAdjuster().glass -=
    //   this.assets.cost.glass[index]
    // this.uiController.gameController.Player.getValueAdjuster().circuitBoard -=
    //   this.assets.cost.circuitBoard[index]
    // this.uiController.gameController.Player.getValueAdjuster().propulsion -=
    //   this.assets.cost.propulsion[index]
    // this.uiController.gameController.Player.getValueAdjuster().coins -=
    //   this.assets.cost.coins[index]
    // this.uiController.gameController.Player.getValueAdjuster().fuel -=
    //   this.assets.cost.fuel[index]
    this.uiController.gameController.Player.getValueAdjuster().metal -= 100
    void this.uiController.gameController.Player.writeDataToServer()
    this.uiController.gameController.Player.updateUI()
  }

  async airdrop(index: number): Promise<void> {
    const urn: string = this.assets.urn[index]
    const userData = await getUserData({})
    this.uiController.loader.showLoader(5)
    const data = eth.toHex(`urn=${urn}&uuid=${userData.data?.userId}`)
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
    this.subtractResources(index)
    // Send wearable to user
    const txn = (await fetch(`${LAMBDA_URL}/airdrop?data=${result}`)) as any
    // Stop execution if there's been an error
    const json = await txn.text()
    if (json.includes('Error: please try again') === true) {
      this.showClaimingError()
      return
    }
    this.loader.hide()
    // mintBoard.show(json, urn)
  }

  showClaimingError(): void {
    this.isVisible = false
    this.loader.hide()
    // errorBoard.show()
  }

  //   showTeleportBoard(): void {
  //     this.hoverCarBoard.isVisible = false
  //     // this.teleportBoard.isVisible = true;
  //     ui.displayAnnouncement(
  //       'You need more resources to buy this!\n\nGo loot in the scrapyard for more!'
  //     )
  //   }

  //   teleportToScrapyard(): void {
  //     this.teleportBoard.isVisible = false
  //     instance.setInstance('scrapyard')
  //     cleanupScene()
  //     setTimeout(50, () => {
  //       renderScrapyard()
  //       loader.showLoader(7000)
  //     })
  //   }

  //   eButtonAction = Input.instance.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, false, (e) => {
  //     // if (this.hoverCarBoard.isVisible) this.teleport();
  //   });

  //   fButtonAction = Input.instance.subscribe("BUTTON_DOWN", ActionButton.SECONDARY, false, (e) => {
  //     if (this.hoverCarBoard.isVisible) this.cancel();
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
    this.assetTypeClaim = type
    switch (type) {
      case 'boots':
        this.backGround = boardsSprites.speedBootsBoard
        this.asset1urn = CLAIMABLE_ASSETS.speedBoots.urn[0]
        this.asset2urn = CLAIMABLE_ASSETS.speedBoots.urn[1]
        this.asset3urn = CLAIMABLE_ASSETS.speedBoots.urn[2]
        this.assets = CLAIMABLE_ASSETS.speedBoots
        break
      case 'cars':
        this.backGround = boardsSprites.hoverCarsBoard
        this.asset1urn = CLAIMABLE_ASSETS.hoverCars.urn[0]
        this.asset2urn = CLAIMABLE_ASSETS.hoverCars.urn[1]
        this.asset3urn = CLAIMABLE_ASSETS.hoverCars.urn[2]
        this.prevAssetUrn = CLAIMABLE_ASSETS.hoverBikes.urn[2]
        this.assets = CLAIMABLE_ASSETS.hoverCars

        break
      case 'bikes':
        this.backGround = boardsSprites.hoverBikesBoard
        this.asset1urn = CLAIMABLE_ASSETS.hoverBikes.urn[0]
        this.asset2urn = CLAIMABLE_ASSETS.hoverBikes.urn[1]
        this.asset3urn = CLAIMABLE_ASSETS.hoverBikes.urn[2]
        this.prevAssetUrn = CLAIMABLE_ASSETS.speedBoots.urn[2]
        this.assets = CLAIMABLE_ASSETS.hoverBikes
        break
      case 'brutes':
        this.backGround = boardsSprites.brutesBoard
        this.asset1urn = CLAIMABLE_ASSETS.brutes.urn[0]
        this.asset2urn = CLAIMABLE_ASSETS.brutes.urn[1]
        this.asset3urn = CLAIMABLE_ASSETS.brutes.urn[2]
        this.assets = CLAIMABLE_ASSETS.brutes

        break
    }
    void this.checkAssetsOwnership()
  }

  async checkAssetsOwnership(): Promise<void> {
    try {
      const player = await getUserData({})
      //   const playerRealm = await getCurrentRealm();
      const url =
        `https://peer.decentraland.org/lambdas/collections/wearables-by-owner/${player.data?.userId}`.toString()
      const response = await fetch(url)
      const usersWearables = await response.json()
      usersWearables.forEach((wearable: { urn: string | string[] }) => {
        if (wearable.urn.includes(this.asset1urn)) this.asset1Owned = true
        if (wearable.urn.includes(this.asset2urn)) this.asset2Owned = true
        if (wearable.urn.includes(this.asset3urn)) this.asset3Owned = true
        if (this.prevAssetUrn !== '') {
          if (wearable.urn.includes(this.prevAssetUrn))
            this.prevAssetOwned = true
        } else {
          this.prevAssetOwned = true
        }
      })
    } catch (e) {
      console.error('Error checking assets owenership - getting user data')
      //   errorBoard.show()
    }
  }

  createUi(): ReactEcs.JSX.Element {
    const canvasInfo = UiCanvasInformation.get(engine.RootEntity)

      return (
        <UiEntity uiTransform={{
            flexDirection: 'column',
            width:'100%',
            height:'100%'
          }}>
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          width:
            ((canvasInfo.height * 0.5) / this.backGround.h) * this.backGround.w,
          height: canvasInfo.height * 0.5
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(this.backGround),
          texture: { src: this.backGround.atlasSrc }
        }}
      >
        <UiEntity
          uiTransform={{
            positionType: 'absolute',
            position: { bottom: '10%', left: '10%' },
            width:
              ((canvasInfo.height * 0.5 * 0.1) / buttonsSprites.claimSprite.h) *
              buttonsSprites.claimSprite.w,
            height: canvasInfo.height * 0.5 * 0.1
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(buttonsSprites.claimSprite),
            texture: { src: buttonsSprites.claimSprite.atlasSrc }
          }}
          onMouseDown={() => {
            if (this.canPurchaseAsset(0)) {
              console.log('se puede comprar 0')
            } else {
              console.error('no se puede comprar 0')
            }
          }}
        />
        <UiEntity
          uiTransform={{
            positionType: 'absolute',
            position: { bottom: '10%', right: '45%' },
            width:
              ((canvasInfo.height * 0.5 * 0.1) / buttonsSprites.claimSprite.h) *
              buttonsSprites.claimSprite.w,
            height: canvasInfo.height * 0.5 * 0.1
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(buttonsSprites.claimSprite),
            texture: { src: buttonsSprites.claimSprite.atlasSrc }
          }}
          onMouseDown={() => {
            if (this.canPurchaseAsset(1)) {
              console.log('se puede comprar 1')
            } else {
              console.error('no se puede comprar 1')
            }
          }}
        />
        <UiEntity
          uiTransform={{
            positionType: 'absolute',
            position: { bottom: '10%', right: '10%' },
            width:
              ((canvasInfo.height * 0.5 * 0.1) / buttonsSprites.claimSprite.h) *
              buttonsSprites.claimSprite.w,
            height: canvasInfo.height * 0.5 * 0.1
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(buttonsSprites.claimSprite),
            texture: { src: buttonsSprites.claimSprite.atlasSrc }
          }}
          onMouseDown={() => {
            if (this.canPurchaseAsset(2)) {
              console.log('se puede comprar 2')
            } else {
              console.error('no se puede comprar 2')
            }
          }}
        />
              </UiEntity>
              </UiEntity>
    )
  }
}
