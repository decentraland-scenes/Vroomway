import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { type UIController } from '../controllers/ui.controller'
import {
  PowerUpCatalog,
  PowerUpIdEnum
} from '../vw-decentrally/modules/connection/state/powerups-spec'
import { getUvs, type Sprite } from './utils/utils'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import Canvas from './canvas/Canvas'
import { type PlayerStats } from '../utils/player'
import { buttonsSprites } from './atlas/buttonsSprites'
import { Color4 } from '@dcl/sdk/math'

const background: Sprite = {
  atlasSize: { x: 2048, y: 2048 },
  atlasSrc: 'assets/images/uiAtlas/board5Atlas.png',
  x: 16,
  y: 15,
  w: 949,
  h: 1688
}
const customAtlasTexture: Sprite = {
  atlasSize: { x: 1024, y: 1024 },
  atlasSrc: 'assets/images/ui/vw-atlas.png',
  x: 490,
  y: 3,
  w: 450,
  h: 380
}

const powerupShopEButton: Sprite = {
  atlasSize: { x: 1024, y: 1024 },
  atlasSrc: 'assets/images/ui/vw-atlas.png',
  x: 514,
  y: 660,
  w: 172,
  h: 47
}

const powerupShopFButton: Sprite = {
  atlasSize: { x: 1024, y: 1024 },
  atlasSrc: 'assets/images/ui/vw-atlas.png',
  x: 514,
  y: 610,
  w: 172,
  h: 47
}

class PowerUpShopItem {
  buy: Sprite = buttonsSprites.buyHexagonButton
  powerupId: PowerUpIdEnum
  visible: boolean = false
  buttonAction: () => void
  uiController: UIController
  buy_opacity: number = 0
  buy_visible: boolean = false
  constructor(
    idx: number,
    powerupId: PowerUpIdEnum,
    buttonAction: () => void,
    uiController: UIController
  ) {
    this.powerupId = powerupId
    this.uiController = uiController
    this.buttonAction = buttonAction
  }

  setUsable(val: boolean): void {
    if (val) {
      if (this.buy_opacity !== 1) {
        this.buy_opacity = 1
      }
    } else {
      if (this.buy_opacity !== 0.2) {
        this.buy_opacity = 0.2
      }
    }
  }

  setVisible(val: boolean): void {
    this.visible = val
    if (this.buy_visible !== val) {
      this.buy_visible = this.visible
    }
  }

  createUI(): ReactEcs.JSX.Element {
    const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
    return (
      <UiEntity
        uiTransform={{
          width: canvasInfo.height * 0.7 * 0.075,
          height: canvasInfo.height * 0.7 * 0.075
        }}
      >
        {/* Power UP Board */}
        <UiEntity
          uiTransform={{
            positionType: 'relative',
            width: '100%',
            height: '100%'
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(this.buy),
            texture: { src: this.buy.atlasSrc }
          }}
          onMouseDown={() => {
            this.buttonAction()
          }}
        ></UiEntity>
      </UiEntity>
    )
  }

  updateUI(): void {
    const powerup = PowerUpCatalog.get(this.powerupId)
    const coins = this.uiController.gameController.Player.getCoins()

    // let levelType: RaceType = "lobby";
    // if (Constants.SCENE_MGR && Constants.SCENE_MGR.lastRaceType) {
    //   levelType = Constants.SCENE_MGR.lastRaceType;
    // } else {
    //   console.log(
    //     "powerUpBarItem",
    //     "updateUI()",
    //     "failed to get Constants.SCENE_MGR.lastRaceType",
    //     "falling back to default",
    //     levelType
    //   );
    // }

    const cost = powerup.cost[0].amount

    const canBuy = cost <= coins
    console.log(
      'powerUpShopUI',
      'updateUI()',
      'this.powerupId',
      this.powerupId,
      'coins',
      coins.toFixed(0),
      'cost',
      cost,
      'canBuy',
      canBuy
    )

    if (!canBuy) {
      this.setUsable(false)
    } else {
      this.setUsable(true)
    }
    this.setVisible(true)
  }
}

export class PowerUpShop {
  items: PowerUpShopItem[] = []
  powerupToBuyIndex: number = 0
  closeBtn: Sprite
  isVisible: boolean = false
  confirm_visible: boolean = false
  powerupShopConfirmTitle: string = '<b>Confirm Purchase</b>'
  powerupShopConfirmMsg: string = ''
  powerupShopConfirm: string = 'OK'
  powerupShopLackOfFundsTitle: string = '<b>Insufficient Funds</b>'
  powerupShopLackOfFundsMsg: string = 'Not Enough?'
  powerupShopLackOfFunds_visible: boolean = false
  uiController: UIController
  player: PlayerStats
  constructor(uiController: UIController) {
    this.isVisible = false
    this.uiController = uiController
    this.closeBtn = buttonsSprites.closeButton
    this.player = this.uiController.player
    this.items.push(
      new PowerUpShopItem(
        0,
        PowerUpIdEnum.MULTIPLIER_COIN_2X_TIME_ROUND,
        () => {
          this.confirmBuyPu(0)
        },
        this.uiController
      )
    )
    this.items.push(
      new PowerUpShopItem(
        1,
        PowerUpIdEnum.MULTIPLIER_XP_2X_TIME_ROUND,
        () => {
          this.confirmBuyPu(1)
        },
        this.uiController
      )
    )
    this.items.push(
      new PowerUpShopItem(
        2,
        PowerUpIdEnum.PROJECTILE_DAMANGE_PLUS_5_TIME_ROUND,
        () => {
          this.confirmBuyPu(2)
        },
        this.uiController
      )
    )
    this.items.push(
      new PowerUpShopItem(
        3,
        PowerUpIdEnum.HEALTH_PLUS_50,
        () => {
          this.confirmBuyPu(3)
        },
        this.uiController
      )
    )
    this.items.push(
      new PowerUpShopItem(
        4,
        PowerUpIdEnum.TRAP_PROJECTILE_TIME_ROUND,
        () => {
          this.confirmBuyPu(4)
        },
        this.uiController
      )
    )

    this.items.push(
      new PowerUpShopItem(
        5,
        PowerUpIdEnum.HEALTH_INVINCIBLE_15_SECONDS,
        () => {
          this.confirmBuyPu(5)
        },
        this.uiController
      )
    )
  }

  confirmBuyPu(index: number): void {
    const coins = this.uiController.gameController.Player?.getCoins()
    const powerupToBuyId = this.items[index].powerupId
    const powerup = PowerUpCatalog.get(powerupToBuyId)

    this.powerupToBuyIndex = index

    const cost = powerup.cost[0].amount

    const canBuy = cost <= coins

    console.log({ index, coins, canBuy })
    if (canBuy) {
      this.powerupShopConfirmTitle = '<b>Confirm Purchase</b>'
      // ui.displayAnnouncement("coins:"+coins +"\nbuy:"+powerupToBuyId +"\ncost:"+cost)
      this.powerupShopConfirmMsg =
        '<b>Buy ' + powerup.name + '<br>Price: ' + cost + '</b>'
      this.confirm_visible = true
    } else {
      this.powerupShopLackOfFundsMsg =
        '<b>You do not have enough<br>to Buy ' +
        powerup.name +
        '<br>Price: ' +
        cost +
        '</b>'

      this.powerupShopLackOfFunds_visible = true
    }
  }

  doBuyPowerupAction(): void {
    const coins = this.uiController.gameController.Player?.getCoins()
    const powerupToBuyId = this.items[this.powerupToBuyIndex].powerupId
    const powerup = PowerUpCatalog.get(powerupToBuyId)
    const cost = powerup.cost[0].amount

    const canBuy = cost <= coins
    console.log(coins, 'coins')
    if (canBuy) {
      this.uiController.gameController.Player.getValueAdjuster().coins -= cost
      this.uiController.gameController.PowerUpsInv.getValueAdjuster().adjustFromId(
        powerup.id,
        1
      )

      void this.uiController.gameController.Player.writeDataToServer({
        onFinish: { updateUI: true }
      })
      void this.uiController.gameController.PowerUpsInv.writeDataToServer()
    } else {
      this.powerupShopLackOfFundsMsg =
        'You do not have enough\n to Buy ' + powerup.name + '\nPrice: ' + cost
      this.powerupShopLackOfFunds_visible = true
    }
  }

  show(): void {
    this.isVisible = true
  }

  hide(): void {
    this.isVisible = false
  }

  createUI(): ReactEcs.JSX.Element {
    const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
    return (
      <Canvas>
        <UiEntity
          uiTransform={{
            flexDirection: 'row',
            width: canvasInfo.width,
            height: canvasInfo.height,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {/* Power UP Board */}
          <UiEntity
            uiTransform={{
              positionType: 'relative',
              width: (canvasInfo.height * 0.7 * background.w) / background.h,
              height: canvasInfo.height * 0.7
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(background),
              texture: { src: background.atlasSrc }
            }}
          >
            <UiEntity
              uiTransform={{
                positionType: 'relative',
                width: '15%',
                height: '95%',
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
                margin: { top: '3.5%' }
              }}
            >
              {this.items.map((item) => item.createUI())}
            </UiEntity>
            <UiEntity
              uiTransform={{
                positionType: 'absolute',
                width: '20%',
                height: '5%',
                position: { top: '-2.5%', right: '-5%' }
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(buttonsSprites.closeButton),
                texture: { src: buttonsSprites.closeButton.atlasSrc }
              }}
              onMouseDown={() => {
                this.hide()
              }}
            />
          </UiEntity>
        </UiEntity>
      </Canvas>
    )
  }

  createConfirmationUI(): ReactEcs.JSX.Element {
    const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
    return (
      <Canvas>
        <UiEntity
          uiTransform={{
            flexDirection: 'column',
            width: canvasInfo.width,
            height: canvasInfo.height,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              width:
                (canvasInfo.height * 0.4 * customAtlasTexture.w) /
                customAtlasTexture.h,
              height: canvasInfo.height * 0.3
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(customAtlasTexture),
              texture: { src: customAtlasTexture.atlasSrc }
            }}
          >
            <Label
              uiTransform={{
                positionType: 'absolute',
                position: { left: '25.5%', top: '15%' }
              }}
              value={this.powerupShopConfirmTitle}
              fontSize={20}
              font="sans-serif"
              color={Color4.White()}
              textAlign="middle-center"
            />
            <Label
              uiTransform={{
                positionType: 'absolute',
                position: { left: '27%', top: '30%' }
              }}
              value={this.powerupShopConfirmMsg}
              fontSize={20}
              font="sans-serif"
              color={Color4.White()}
              textAlign="middle-center"
            />
            <UiEntity
              uiTransform={{
                position: { right: '15%', bottom: '15%' },
                positionType: 'absolute',
                justifyContent: 'center',
                width: '30%',
                height: '20%'
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(powerupShopEButton),
                texture: { src: powerupShopEButton.atlasSrc }
              }}
              onMouseDown={() => {
                this.doBuyPowerupAction()
                this.confirm_visible = false
              }}
            >
              <Label
                uiTransform={{
                  positionType: 'absolute',
                  position: { left: '30%', top: '5%' }
                }}
                value={'OK'}
                fontSize={30}
                font="sans-serif"
                color={Color4.White()}
                textAlign="middle-left"
              />
            </UiEntity>
            <UiEntity
              uiTransform={{
                position: { left: '15%', bottom: '15%' },
                positionType: 'absolute',
                justifyContent: 'center',
                width: '30%',
                height: '20%'
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(powerupShopFButton),
                texture: { src: powerupShopFButton.atlasSrc }
              }}
              onMouseDown={() => {
                this.confirm_visible = false
              }}
            >
              <Label
                uiTransform={{
                  positionType: 'absolute',
                  position: { left: '10%', top: '5%' }
                }}
                value={'Cancel'}
                fontSize={30}
                font="sans-serif"
                color={Color4.White()}
                textAlign="middle-left"
              />
            </UiEntity>
          </UiEntity>
        </UiEntity>
      </Canvas>
    )
  }

  createLackOfFundsUI(): ReactEcs.JSX.Element {
    const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
    return (
      <Canvas>
        <UiEntity
          uiTransform={{
            flexDirection: 'column',
            width: canvasInfo.width,
            height: canvasInfo.height,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              width:
                (canvasInfo.height * 0.4 * customAtlasTexture.w) /
                customAtlasTexture.h,
              height: canvasInfo.height * 0.3
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(customAtlasTexture),
              texture: { src: customAtlasTexture.atlasSrc }
            }}
          >
            <Label
              uiTransform={{
                positionType: 'absolute',
                position: { left: '26%', top: '15%' }
              }}
              value={this.powerupShopLackOfFundsTitle}
              fontSize={20}
              font="sans-serif"
              color={Color4.White()}
              textAlign="middle-center"
            />
            <Label
              uiTransform={{
                positionType: 'absolute',
                position: { left: '20%', top: '28%' }
              }}
              value={this.powerupShopLackOfFundsMsg}
              fontSize={20}
              font="sans-serif"
              color={Color4.White()}
              textAlign="middle-center"
            />
            <UiEntity
              uiTransform={{
                position: { left: '35%', bottom: '15%' },
                positionType: 'absolute',
                justifyContent: 'center',
                width: '30%',
                height: '20%'
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(powerupShopFButton),
                texture: { src: powerupShopFButton.atlasSrc }
              }}
              onMouseDown={() => {
                this.powerupShopLackOfFunds_visible = false
              }}
            >
              <Label
                uiTransform={{
                  positionType: 'absolute',
                  position: { left: '10%', top: '5%' }
                }}
                value={'Cancel'}
                fontSize={30}
                font="sans-serif"
                color={Color4.White()}
                textAlign="middle-center"
              />
            </UiEntity>
          </UiEntity>
        </UiEntity>
      </Canvas>
    )
  }
}
