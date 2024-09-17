import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type UIController } from '../controllers/ui.controller'
import {
  PowerUpCatalog,
  PowerUpIdEnum
} from '../vw-decentrally/modules/connection/state/powerups-spec'
import { buyHexagonButton, closeButton } from './buttons'
import { getUvs, type Sprite } from './utils/utils'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import Canvas from './canvas/Canvas'
import { type PlayerStats } from '../utils/player'

const background: Sprite = {
  atlasSize: { x: 2048, y: 2048 },
  atlasSrc: 'assets/images/uiAtlas/board5Atlas.png',
  x: 16,
  y: 15,
  w: 949,
  h: 1688
}


class PowerUpShopItem {
  buy: Sprite = buyHexagonButton
  powerupId: PowerUpIdEnum
  visible: boolean = true
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
          onMouseDown={() => {this.buttonAction()}}
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
  isVisible: boolean
  uiController: UIController
  player: PlayerStats
  constructor(uiController: UIController) {
    this.isVisible = true
    this.uiController = uiController
    this.closeBtn = closeButton
    this.player = uiController.player

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
    let coins: number = 0
    if (this.player !== undefined) {
      coins = this.player.coins
    }
    const powerupToBuyId = this.items[index].powerupId;
    const powerup = PowerUpCatalog.get(powerupToBuyId);

    this.powerupToBuyIndex = index;
    
    const cost = powerup.cost[0].amount;
    
    const canBuy = cost <= coins;
    
    console.log({index, coins, canBuy})
    // if (canBuy) {
    //   powerupShopConfirmTitle.text.value = "Confirm Purchase";
    //   //ui.displayAnnouncement("coins:"+coins +"\nbuy:"+powerupToBuyId +"\ncost:"+cost)
    //   powerupShopConfirmMsg.text.value = "Buy " + powerup.name + "\nPrice: " + cost;

    //   powerupShopConfirm.show();
    // } else {
    //   powerupShopLackOfFundsMsg.text.value = "You do not have enough\n to Buy " + powerup.name + "\nPrice: " + cost;

    //   powerupShopLackOfFunds.show();
    // }
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
                position:{top:'-2.5%', right:'-5%'}
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(closeButton),
                texture: { src: closeButton.atlasSrc }
              }}
              onMouseDown={() => {this.hide()}}
            />
            
          </UiEntity>
          
        </UiEntity>
      </Canvas>
    )
  }
}
