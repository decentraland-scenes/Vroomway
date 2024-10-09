import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { type UIController } from '../controllers/ui.controller'
import { getUvs, type Sprite } from './utils/utils'
import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import Canvas from './canvas/Canvas'
import { InventoryManager } from '../inventory/inventory-manager'
import { missions } from '../utils/missions'
import * as utils from '@dcl-sdk/utils'
import { itemsSprites, type items } from './atlas/itemsSprites'
import { boardsSprites } from './atlas/boardsAtlas'

export class LootBoard {
  rewards: Record<string, number> = {}
  uiController: UIController
  lootBoard: Sprite = boardsSprites.lootBoard
  visible: boolean = false
  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  createUI(): ReactEcs.JSX.Element {
    const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
    return (
      <Canvas>
        <UiEntity
          uiTransform={{
            flexDirection: 'row',
            width: canvasInfo.width,
            height: canvasInfo.height * 0.95,
            justifyContent: 'center',
            alignItems: 'flex-end'
          }}
        >
          {/* Loot */}
          <UiEntity
            uiTransform={{
              positionType: 'relative',
              width:
                (canvasInfo.height * 0.2 * this.lootBoard.w) / this.lootBoard.h,
              height: canvasInfo.height * 0.2,
              alignItems: 'center'
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
                height: canvasInfo.height * 0.2 * 0.4,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignContent: 'center',
                margin: { left: '52%' }
              }}
            >
              {Object.entries(this.rewards).map(([key, value]) => (
                <UiEntity
                  key={key}
                  uiTransform={{
                    width:
                      ((canvasInfo.height * 0.2 * 0.4) /
                        itemsSprites[key as items].h) *
                      itemsSprites[key as items].w,
                    height: canvasInfo.height * 0.2 * 0.4,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  uiBackground={{
                    textureMode: 'stretch',
                    uvs: getUvs(itemsSprites[key as items]),
                    texture: { src: itemsSprites[key as items].atlasSrc }
                  }}
                >
                  <Label
                    value={value.toString()}
                    fontSize={canvasInfo.height * 0.2 * 0.4 * 0.3}
                    textAlign="bottom-right"
                    uiTransform={{ width: '90%', height: '90%' }}
                  />
                </UiEntity>
              ))}
            </UiEntity>
          </UiEntity>
        </UiEntity>
      </Canvas>
    )
  }

  updateBoardStats = (rewards: Record<string, number>): void => {
    this.rewards = rewards
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
  }

  toggleBoard = (): void => {
    this.visible = true
    missions.checkAndUnlockCampaignMission('collectMaterials')
    utils.timers.setTimeout(() => {
      this.hide()
    }, 4000)
  }
}
