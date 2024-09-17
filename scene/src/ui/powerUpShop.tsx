import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type UIController } from '../controllers/ui.controller'
import {
  PowerUpCatalog,
  PowerUpIdEnum
} from '../vw-decentrally/modules/connection/state/powerups-spec'
import { buyHexagonButton, closeButton } from './buttons'
import { getUvs, type Sprite } from './utils/utils'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'

const board5Atlas = 'images/uiAtlas/board5Atlas.png'
const BOARD_WIDTH = 964
const BOARD_HEIGHT = 1700
const SCALE = 0.35

class PowerUpShopItem {
  powerupBoard: Sprite
  buy: Sprite
  powerupId: PowerUpIdEnum
  visible: boolean = true
  buttonAction: () => void
  uiController: UIController
  buy_opacity: number = 0
  buy_visible: boolean = false
  constructor(
    idx: number,
    parent: Sprite,
    powerupId: PowerUpIdEnum,
    buttonAction: () => void,
    uiController: UIController
  ) {
    this.powerupId = powerupId
    this.uiController = uiController
    this.buttonAction = buttonAction
    const LEFT_PADD = 64
    const MARGIN = 3.6
    const HEIGHT = 260
    this.powerupBoard = {
      atlasSrc: board5Atlas,
      atlasSize: { x: 2048, y: 2048 },
      x: 0,
      y:
        (BOARD_HEIGHT * SCALE) / 2 -
        (LEFT_PADD + idx * HEIGHT * SCALE + MARGIN * idx),
      w: BOARD_WIDTH * SCALE,
      h: HEIGHT * SCALE
    }
    this.buy = buyHexagonButton
    this.buy.w = this.buy.w * SCALE
    this.buy.h = this.buy.h * SCALE
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
          flexDirection: 'row',
          width: canvasInfo.width,
          height: canvasInfo.height,
          justifyContent: 'center',
          positionType: 'absolute',
          position: { top: '25%', left: '50%' }
        }}
      >
        {/* Power UP Board */}
        <UiEntity
          uiTransform={{
            positionType: 'relative',
            width: (canvasInfo.height * 2.1) / 1.7,
            height: canvasInfo.height * 0.5
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(this.powerupBoard),
            texture: { src: this.powerupBoard.atlasSrc }
          }}
          onMouseDown={() => {}}
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
  powerupBoard: Sprite
  items: PowerUpShopItem[] = []
  powerupToBuyIndex: number = 0
  closeBtn: Sprite
  uiController: UIController
  item1: PowerUpShopItem
  item2: PowerUpShopItem
  item3: PowerUpShopItem
  item4: PowerUpShopItem
  item5: PowerUpShopItem
  item6: PowerUpShopItem
  constructor(uiController: UIController) {
    this.uiController = uiController
    this.closeBtn = closeButton
    this.powerupBoard = {
      atlasSrc: board5Atlas,
      atlasSize: { x: 2048, y: 2048 },
      x: 8,
      y: 9,
      w: BOARD_WIDTH * SCALE,
      h: BOARD_HEIGHT * SCALE
    }
    this.closeBtn.x = 50 * SCALE
    this.closeBtn.y = 20 * SCALE
    this.closeBtn.w = this.closeBtn.w * 0.3
    this.closeBtn.h = this.closeBtn.h * 0.3

    this.item1 = new PowerUpShopItem(0, this.powerupBoard, PowerUpIdEnum.MULTIPLIER_COIN_2X_TIME_ROUND, () => {
      this.activatePu1();
    },this.uiController);
    this.item2 = new PowerUpShopItem(1, this.powerupBoard, PowerUpIdEnum.MULTIPLIER_XP_2X_TIME_ROUND, () => {
      this.activatePu2();
    },this.uiController);
    this.item3 = new PowerUpShopItem(2, this.powerupBoard, PowerUpIdEnum.PROJECTILE_DAMANGE_PLUS_5_TIME_ROUND, () => {
      this.activatePu3();
    },this.uiController);
    this.item4 = new PowerUpShopItem(3, this.powerupBoard, PowerUpIdEnum.HEALTH_PLUS_50, () => {
      this.activatePu4();
    },this.uiController);
    this.item5 = new PowerUpShopItem(4, this.powerupBoard, PowerUpIdEnum.TRAP_PROJECTILE_TIME_ROUND, () => {
      this.activatePu5();
    },this.uiController);

    this.item6 = new PowerUpShopItem(5, this.powerupBoard, PowerUpIdEnum.HEALTH_INVINCIBLE_15_SECONDS, () => {
      this.activatePu6();
    },this.uiController);

    this.items.push(this.item1);
    this.items.push(this.item2);
    this.items.push(this.item3);
    this.items.push(this.item4);
    this.items.push(this.item5);
    this.items.push(this.item6);
  }

  activatePu1():void {
    this.confirmBuyPu(0);
  }

  activatePu2():void {
    this.confirmBuyPu(1);
  }

  activatePu3():void {
    this.confirmBuyPu(2);
  }

  activatePu4():void {
    this.confirmBuyPu(3);
  }

  activatePu5():void {
    this.confirmBuyPu(4);
  }

  activatePu6():void {
    this.confirmBuyPu(5);
  }

  confirmBuyPu(index: number):void {

  }
}
