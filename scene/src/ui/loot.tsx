import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type UIController } from '../controllers/ui.controller'
import { getUvs, type Sprite } from './utils/utils'
import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import Canvas from './canvas/Canvas'
import { InventoryManager } from '../inventory/inventory-manager'
import { missions } from '../utils/missions'
import * as utils from '@dcl-sdk/utils'
import { itemsSprites } from './atlas/itemsSprites'

export class LootItem {
  uiController: UIController
  visible: boolean = false
  item: Sprite
  constructor(item: Sprite, uiController: UIController) {
    this.uiController = uiController
    this.item = item
  }

  createUI(): ReactEcs.JSX.Element {
    const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
    return (
      <UiEntity
        uiTransform={{
          width: canvasInfo.height * 0.09,
          height: canvasInfo.height * 0.07
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
        ></UiEntity>
      </UiEntity>
    )
  }
}

export class LootBoard {
  metalMaterial: LootItem
  rubberMaterial: LootItem
  wiresMaterial: LootItem
  glassMaterial: LootItem
  circuitMaterial: LootItem
  propulsionMaterial: LootItem
  antimatterMaterial: LootItem
  cannistersMat: LootItem
  coinMaterial: LootItem
  items: LootItem[] = []
  metal: string = '-'
  glass: string = '-'
  circuitBoard: string = '-'
  rubber: string = '-'
  wires: string = '-'
  propulsion: string = '-'
  coins: string = '-'
  antimatter: string = '-'
  antimatterText: string = '-'
  cannisters: string = '-'
  cannistersText: string = '-'
  metalText: string = '-'
  glassText: string = '-'
  circuitText: string = '-'
  rubberText: string = '-'
  wiresText: string = '-'
  propulsionText: string = '-'
  coinsText: string = '-'
  uiController: UIController
  lootBoard: Sprite
  visible: boolean = false
  mainTexture: string = 'assets/images/uiAtlas/board2Atlas.png'
  constructor(uiController: UIController) {
    this.uiController = uiController
    this.lootBoard = {
      atlasSrc: this.mainTexture,
      atlasSize: { x: 2048, y: 2048 },
      x: 1150,
      y: 1100,
      w: 1000,
      h: 250
    }
    this.metalMaterial = new LootItem(itemsSprites.metal, this.uiController)
    this.rubberMaterial = new LootItem(itemsSprites.rubber, this.uiController)
    this.wiresMaterial = new LootItem(itemsSprites.wires, this.uiController)
    this.glassMaterial = new LootItem(itemsSprites.glass, this.uiController)
    this.circuitMaterial = new LootItem(
      itemsSprites.circuitBoard,
      this.uiController
    )
    this.propulsionMaterial = new LootItem(
      itemsSprites.propulsion,
      this.uiController
    )
    this.antimatterMaterial = new LootItem(
      itemsSprites.antimatter,
      this.uiController
    )
    this.cannistersMat = new LootItem(
      itemsSprites.cannisters,
      this.uiController
    )
    this.coinMaterial = new LootItem(itemsSprites.coins, this.uiController)
    this.items.push(this.metalMaterial)
    this.items.push(this.rubberMaterial)
    this.items.push(this.wiresMaterial)
    this.items.push(this.glassMaterial)
    this.items.push(this.circuitMaterial)
    this.items.push(this.propulsionMaterial)
    this.items.push(this.antimatterMaterial)
    this.items.push(this.cannistersMat)
    this.items.push(this.coinMaterial)
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
            alignItems: 'flex-end'
          }}
        >
          {/* Loot */}
          <UiEntity
            uiTransform={{
              positionType: 'relative',
              width:
                (canvasInfo.height * 0.3 * this.lootBoard.w) / this.lootBoard.h,
              height: canvasInfo.height * 0.3
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(this.lootBoard),
              texture: { src: this.lootBoard.atlasSrc }
            }}
          >
            <UiEntity
              uiTransform={{
                positionType: 'relative',
                width: '100%',
                height: '100%',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                margin: { left: '32%', top: '5%' }
              }}
            >
              {this.items.map((item) => item.createUI())}
            </UiEntity>
          </UiEntity>
        </UiEntity>
      </Canvas>
    )
  }

  showIcons = (materials: any): void => {
    console.log('materials' + materials)
    Object.keys(materials).forEach((material, i) => {
      console.log(material)
      if (material === 'metal') this.metalText = materials[material]
      else if (material === 'glass') this.glassText = materials[material]
      else if (material === 'circuitBoard')
        this.circuitText = materials[material]
      else if (material === 'rubber') this.rubberText = materials[material]
      else if (material === 'wires') this.wiresText = materials[material]
      else if (material === 'coins') this.coinsText = materials[material]
      else if (material === 'propulsion')
        this.propulsionText = materials[material]
      else if (material === 'cannisters')
        this.cannistersText = materials[material]
      else if (material === 'antimatter')
        this.antimatterText = materials[material]
    })
  }

  updateBoardStats = (rewards: Record<string, number>): void => {
    // display icons based on existance
    this.showIcons(rewards)

    // add rewards to player's inventory
    Object.keys(rewards).forEach((reward) => {
      console.log(
        'Barrel: processing reward=' + reward + ', value=' + rewards[reward]
      )

      InventoryManager.Instance.AddItemCountByID(reward, rewards[reward])
    })

    // save player gains to server
    void this.uiController.gameController.Player.writeDataToServer()
  }

  hide(): void {
    this.visible = false
    // Clear out looted materials
    this.metalText = '-'
    this.glassText = '-'
    this.circuitText = '-'
    this.rubberText = '-'
    this.wiresText = '-'
    this.propulsionText = '-'
    this.cannistersText = '-'
    this.antimatterText = '-'
  }

  toggleBoard = (): void => {
    // Subscribe to keys
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    // Show board for 4 seconds
    this.visible = true
    missions.checkAndUnlockCampaignMission('collectMaterials')
    utils.timers.setTimeout(() => {
      this.hide()
    }, 4000)
  }
}
