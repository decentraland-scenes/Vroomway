import { engine, InputAction, UiCanvasInformation } from '@dcl/sdk/ecs'
import {
  PowerUpCatalog,
  PowerUpIdEnum,
  PowerUpItemUtils
} from '../vw-decentrally/modules/connection/state/powerups-spec'
import { itemsSprites } from './atlas/itemsSprites'
import { getUvs, type Sprite } from './utils/utils'
import { type RaceType } from '../types/types'
import type * as serverStateSpec from '../vw-decentrally/modules/connection/state/server-state-spec'
import { ReactEcs, UiEntity } from '@dcl/sdk/react-ecs'
import Canvas from './canvas/Canvas'
import { type UIController } from '../controllers/ui.controller'
// const SCALE = 0.2;
// const BOARD_WIDTH = 1593;
const BOARD_WIDTH = 1593
const background: Sprite = {
  atlasSize: { x: 2048, y: 2048 },
  atlasSrc: 'assets/images/uiAtlas/board5Atlas.png',
  x: 0,
  y: 1727,
  w: BOARD_WIDTH,
  h: 320
}

export class PowerUpBarItem {
  item: Sprite
  item_opacity: number = 0
  item_visible: boolean = false
  itemQty: string = ''
  itemActivated: string = ''
  itemActivated_visible: boolean = false
  powerupId: PowerUpIdEnum
  visible: boolean = false
  actionButton: InputAction
  buttonAction: () => void
  uiController: UIController
  constructor(
    idx: number,
    parent: Sprite,
    powerupId: PowerUpIdEnum,
    actionButton: InputAction,
    buttonAction: () => void,
    uiController: UIController
  ) {
    this.powerupId = powerupId
    this.actionButton = actionButton
    this.buttonAction = buttonAction
    this.uiController = uiController

    switch (this.powerupId) {
      case PowerUpIdEnum.MULTIPLIER_COIN_2X_TIME_ROUND:
        this.item = itemsSprites.multipleCoins2x
        break
      case PowerUpIdEnum.MULTIPLIER_XP_2X_TIME_ROUND:
        this.item = itemsSprites.multipleXp2x
        break
      case PowerUpIdEnum.PROJECTILE_DAMANGE_PLUS_5_TIME_ROUND:
        this.item = itemsSprites.projectileDamagePlus5
        break
      case PowerUpIdEnum.HEALTH_PLUS_50:
        this.item = itemsSprites.healthPlus50
        break
      case PowerUpIdEnum.TRAP_PROJECTILE_TIME_ROUND:
        this.item = itemsSprites.projectileTrap
        break
      case PowerUpIdEnum.HEALTH_INVINCIBLE_15_SECONDS:
        this.item = itemsSprites.healthinvincible15s
        break
    }
  }

  createUI(): ReactEcs.JSX.Element {
    const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
    return (
      <UiEntity
        uiTransform={{
          width: canvasInfo.height * 3,
          height: canvasInfo.height * 0.8 * 0.075
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
            uvs: getUvs(this.item),
            texture: { src: this.item.atlasSrc }
          }}
          onMouseDown={() => {
            this.buttonAction()
          }}
        ></UiEntity>
      </UiEntity>
    )
  }

  setUsable(val: boolean): void {
    if (val) {
      if (this.item_opacity !== 1) {
        this.item_opacity = 1
      }
    } else {
      if (this.item_opacity !== 0.2) {
        this.item_opacity = 0.2
      }
    }
  }

  setVisible(val: boolean): void {
    this.visible = val
    if (this.item_visible !== val) {
      this.item_visible = this.visible
    }
  }

  setActive(val: boolean): void {
    if (this.itemActivated_visible !== val) {
      this.itemActivated_visible = val
    }
  }

  updateUI(): void {
    const powerup = PowerUpCatalog.get(this.powerupId)
    const powerupItm =
      this.uiController.gameController.PowerUpsInv.powerUpMgr.getPowerUp(
        this.powerupId
      )

    const levelType: RaceType = 'lobby' // default is lobby
    const validForRace = PowerUpCatalog.isValidFor(powerup, {
      level: levelType
    })

    let active = -1
    let available = -1

    // Verificar si powerupItm es undefined antes de usarlo
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (validForRace && powerupItm) {
      active = PowerUpItemUtils.getActiveCnt(powerupItm)
      available = PowerUpItemUtils.getAvailableCnt(powerupItm)
    }

    console.log(
      'powerUpBarItem',
      'updateUI()',
      'this.powerupId',
      this.powerupId,
      'Constants.SCENE_MGR.lastRaceType',
      levelType,
      'validForRace',
      validForRace,
      'active',
      active,
      'available',
      available
    )

    if (!validForRace || (available <= 0 && active <= 0)) {
      this.setUsable(false)
    } else {
      this.setUsable(true)
    }

    this.setVisible(validForRace)

    if (active > 0) {
      this.setActive(true)
    } else {
      this.setActive(false)
    }

    this.itemQty = this.getAvailableCnt()
  }

  getAvailableCnt(): string {
    // might have to move away from this is we dont send all to be used during game
    // alterantive is this, it will return the overall total with some math
    // BUT then we need 2 getters - getAvailableCnt and getAvailableCntOverall
    // powerup.total - powerup.allocated + getAvailableCnt
    const powerup =
      this.uiController.gameController.PowerUpsInv.powerUpMgr.getPowerUp(
        this.powerupId
      )
    if (powerup == null) {
      return '0'
    }
    const cnt = PowerUpItemUtils.getAvailableCnt(powerup).toString()
    return cnt
  }
}

export class PowerUpBar {
  powerupBoard: Sprite
  visible: boolean = false
  items: PowerUpBarItem[] = []
  barWidth: string = '100%'
  originalItems: PowerUpBarItem[] = []
  uiController: UIController
  constructor(uiController: UIController) {
    this.powerupBoard = background
    this.uiController = uiController
    // this.powerupBoard.positionY = 250;

    const item1 = new PowerUpBarItem(
      0,
      this.powerupBoard,
      PowerUpIdEnum.MULTIPLIER_COIN_2X_TIME_ROUND,
      InputAction.IA_PRIMARY,
      () => {
        this.activatePu1()
      },
      this.uiController
    )
    const item2 = new PowerUpBarItem(
      1,
      this.powerupBoard,
      PowerUpIdEnum.MULTIPLIER_XP_2X_TIME_ROUND,
      InputAction.IA_PRIMARY,
      () => {
        this.activatePu2()
      },
      this.uiController
    )
    const item3 = new PowerUpBarItem(
      2,
      this.powerupBoard,
      PowerUpIdEnum.PROJECTILE_DAMANGE_PLUS_5_TIME_ROUND,
      InputAction.IA_PRIMARY,
      () => {
        this.activatePu3()
      },
      this.uiController
    )
    const item4 = new PowerUpBarItem(
      3,
      this.powerupBoard,
      PowerUpIdEnum.HEALTH_PLUS_50,
      InputAction.IA_ACTION_3,
      () => {
        this.activatePu4()
      },
      this.uiController
    )
    const item5 = new PowerUpBarItem(
      4,
      this.powerupBoard,
      PowerUpIdEnum.TRAP_PROJECTILE_TIME_ROUND,
      InputAction.IA_ACTION_4,
      () => {
        this.activatePu5()
      },
      this.uiController
    )
    const item6 = new PowerUpBarItem(
      5,
      this.powerupBoard,
      PowerUpIdEnum.HEALTH_INVINCIBLE_15_SECONDS,
      InputAction.IA_ACTION_5,
      () => {
        this.activatePu6()
      },
      this.uiController
    )

    this.items.push(item1)
    this.items.push(item2)
    this.items.push(item3)
    this.items.push(item4)
    this.items.push(item5)
    this.items.push(item6)
    this.originalItems = [...this.items]
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
            alignItems: 'center',
            position: { top: '40%' }
          }}
        >
          {/* Power UP Board */}
          <UiEntity
            uiTransform={{
              positionType: 'relative',
              width: (canvasInfo.height * 0.08 * background.w) / background.h,
              height: canvasInfo.height * 0.08
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
                width: '30%',
                height: '100%',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                margin: { left: '4%', top: '1%' }
              }}
            >
              {this.items.map((item) => item.createUI())}
            </UiEntity>
          </UiEntity>
        </UiEntity>
      </Canvas>
    )
  }

  activatePu1(): void {
    this.activatePu(0)
  }

  activatePu2(): void {
    this.activatePu(1)
  }

  activatePu3(): void {
    this.activatePu(2)
  }

  activatePu4(): void {
    this.activatePu(3)
  }

  activatePu5(): void {
    this.activatePu(4)
  }

  activatePu6(): void {
    this.activatePu(5)
  }

  updateUI(): void {
    for (const p of this.items) {
      p.updateUI()
    }
  }

  updateUIById(id: serverStateSpec.PowerUpId): void {
    // TODO add a record for faster lookup
    for (const p of this.items) {
      if (p.powerupId === id) {
        p.updateUI()
        return
      }
    }
  }

  activatePu(index: number): void {
    // const powerup = PowerUpsInv.powerUpMgr.getPowerUp(this.items[index].powerupId)
    // powerup.
    //   initialUsePowerUpHelper(this.items[index].powerupId);
    // this.items[index].setActive(true)
  }

  //   eButtonAction = Input.instance.subscribe(
  //     'BUTTON_DOWN',
  //     InputAction.IA_PRIMARY,
  //     false,
  //     (e) => {
  //       return
  //     }
  //   )

  //   fButtonAction = Input.instance.subscribe(
  //     'BUTTON_DOWN',
  //     InputAction.IA_SECONDARY,
  //     false,
  //     (e) => {
  //       // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  //       if (!this.visible) {
  //         console.log(
  //           'PowerUpBar',
  //           'key down',
  //           'SECONDARY',
  //           'not visible ignored'
  //         )
  //         return
  //       }
  //       console.log('PowerUpBar', 'key down', 'SECONDARY')
  //     }
  //   )

  //   k1ButtonAction = Input.instance.subscribe(
  //     'BUTTON_DOWN',
  //     InputAction.IA_ACTION_3,
  //     false,
  //     (e) => {
  //       if (!this.visible) {
  //         console.log('PowerUpBar', 'key down', 'ACTION_3', 'not visible ignored')
  //         return
  //       }
  //       console.log('PowerUpBar', 'key down', 'ACTION_3')
  //       this.activatePu4()
  //     }
  //   )

  //   k2ButtonAction = Input.instance.subscribe(
  //     'BUTTON_DOWN',
  //     InputAction.IA_ACTION_4,
  //     false,
  //     (e) => {
  //       if (!this.visible) {
  //         console.log('PowerUpBar', 'key down', 'ACTION_4', 'not visible ignored')
  //         return
  //       }
  //       console.log('PowerUpBar', 'key down', 'ACTION_4')
  //       this.activatePu5()
  //     }
  //   )

  //   k3ButtonAction = Input.instance.subscribe(
  //     'BUTTON_DOWN',
  //     InputAction.IA_ACTION_5,
  //     false,
  //     (e) => {
  //       if (!this.visible) {
  //         console.log('PowerUpBar', 'key down', 'ACTION_5', 'not visible ignored')
  //         return
  //       }
  //       console.log('PowerUpBar', 'key down', 'ACTION_5')

  //       this.activatePu6()
  //     }
  //   )

  show(): void {
    // Subscribe to keys
    // if (!Input.instance)
    //   attachKeyBindings(
    //     this.eButtonAction,
    //     this.fButtonAction,
    //     this.k1ButtonAction,
    //     this.k2ButtonAction,
    //     this.k3ButtonAction
    //   )
    this.items = [...this.originalItems]
    this.visible = true
  }

  showSoloSprintMode(): void {
    console.log('PowerUpsBar SoloSprint Mode')
    // this.item3.setVisible(false)
    // this.items[3].setActive(false)
    // this.items[3].setVisible(false)
    // this.items[4].setActive(false)
    // this.items[4].setVisible(false)
    // this.items[5].setActive(false)
    // this.items[5].setVisible(false)
    // this.item3.visible = false
    // this.updateUI()
    this.items = this.originalItems.slice(0, 2)
    this.barWidth = '30%'
    this.visible = true
  }

  hide(): void {
    // Unsubscribe from buttons
    // removeKeyBindings(
    //   this.eButtonAction,
    //   this.fButtonAction,
    //   this.k1ButtonAction,
    //   this.k2ButtonAction,
    //   this.k3ButtonAction
    // )
    this.visible = false
  }

  // time argument is seconds
  /* updatePowerUps() {
      //PowerUpsInv.updateUsedPowerUps(); //TODO should we wait till write to server then call this?
      PowerUpsInv.updateUsedPowerUps(); //TODO should we wait till write to server then call this?
      PowerUpsInv.writeDataToServer();
  
    } */
}
