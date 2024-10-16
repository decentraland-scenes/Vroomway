/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { VehicleData, type VehicleDataObject } from '../vehicle/vehicle-data'
import { type UIController } from '../controllers/ui.controller'
import { Label, ReactEcs, UiEntity } from '@dcl/sdk/react-ecs'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { getUvs, type Sprite } from './utils/utils'
import { Color4 } from '@dcl/sdk/math'
import { LevelManager } from '../leveling/level-manager'
import { boardsSprites } from './atlas/boardsAtlas'
import Canvas from './canvas/Canvas'
import {
  type BaseObject,
  type CargoObject,
  CargoObjectData,
  PowerUpObjectData,
  type ResourceObject,
  ResourceObjectData
} from '../inventory/inventory-data'
import { InventoryManager } from '../inventory/inventory-manager'
import { buttonsSprites } from './atlas/buttonsSprites'
import { VehicleManager } from '../vehicle/vehicle-manager'
import { AccessoryManager } from '../vehicle/accessory-manager'
import { type VehicleAttachmentDataObject } from '../vehicle/vehicle-attachment-data'
import { VehicleAttachmentManager } from '../vehicle/vehicle-attachment-manager'

const TOTAL_MODS_SLOTS = 6

type InventoryItem =
  | BaseObject
  | ResourceObject
  | CargoObject
  | VehicleDataObject

export class UIInventoryManager {
  isModsVisible: boolean = true
  modSlotSelected: number = 1
  arrayToShow: InventoryItem[] = [...ResourceObjectData, ...CargoObjectData]
  background: Sprite = boardsSprites.inventoryMaterialsBoardSprite
  uiParentVisible: boolean = true
  uiTextExperience: string = '999999'
  uiTextLevel: string = '999'
  uiController: UIController | undefined
  selectedTab: number = 0
  private static instance: undefined | UIInventoryManager
  selectedVehicleSprite: Sprite | undefined
  selectedVehicleID: string | undefined
  attachmentsLocked: number = 6
  selectedAttachments: InventoryItem[] = []

  public static get Instance(): UIInventoryManager {
    //ensure instance is set
    if (UIInventoryManager.instance === undefined) {
      UIInventoryManager.instance = new UIInventoryManager()
    }

    return UIInventoryManager.instance
  }

  constructor(uiController?: UIController) {
    this.uiController = uiController
    LevelManager.Instance.RegisterUICallbackExperience(
      this.CallbackUpdateExpDisplay.bind(this)
    )
    LevelManager.Instance.RegisterUICallbackLevel(
      this.CallbackUpdateLevelDisplay.bind(this)
    )
  }

  public selectModSlot(value: number): void {
    if (value > 0 && value < 7) {
      this.modSlotSelected = value
    } else {
      this.modSlotSelected = 1
    }
  }

  public DisplayInventory(type: number): void {
    this.selectedTab = type
    this.isModsVisible = false
    this.updateExpDisplay()
    this.updateLevelDisplay()
    switch (type) {
      case 0: {
        this.background = boardsSprites.inventoryVehiclesBoardSprite
        this.arrayToShow = []
        VehicleData.forEach((vehicle) => {
          if (VehicleManager.Instance.GetEntryByID(vehicle.ID).IsOwned) {
            this.arrayToShow.push(vehicle)
          }
        })
        break
      }
      case 1: {
        this.background = boardsSprites.inventoryAccesoriesBoardSprite
        this.arrayToShow = []
        break
      }
      case 2: {
        this.background = boardsSprites.inventoryMaterialsBoardSprite
        this.arrayToShow = [...ResourceObjectData, ...CargoObjectData]
        break
      }
      case 3: {
        this.background = boardsSprites.inventoryPowerUpsBoardSprite
        this.arrayToShow = PowerUpObjectData
        break
      }
      default: {
        this.background = boardsSprites.inventoryVehiclesBoardSprite
        this.arrayToShow = []
        break
      }
    }
  }

  public SetAttachmentLockState(value: number): void {
    this.attachmentsLocked = TOTAL_MODS_SLOTS - value
    this.selectedAttachments = []
    this.selectedAttachments.forEach((attachment) => {
      const objectDefPrev: VehicleAttachmentDataObject | undefined =
        VehicleAttachmentManager.Instance.GetDefByID(attachment.ID)
      if (objectDefPrev !== undefined) {
        VehicleAttachmentManager.Instance.RemoveAttachment(objectDefPrev.Type)
      }
    })
  }

  createUI(): ReactEcs.JSX.Element {
    const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
    const fontSizeTimer = canvasInfo.height * 0.035
    const fontSizeXP = canvasInfo.height * 0.02
    const fontSizeDrop = canvasInfo.height * 0.02
    return (
      <Canvas
        uiTransform={{
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {this.isModsVisible && (
          <UiEntity
            uiTransform={{
              positionType: 'relative',
              width:
                ((canvasInfo.height * 0.55) / boardsSprites.modsSprite.h) *
                boardsSprites.modsSprite.w,
              height: canvasInfo.height * 0.55
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(boardsSprites.modsSprite),
              texture: { src: boardsSprites.modsSprite.atlasSrc }
            }}
          >
            <UiEntity
              uiTransform={{
                positionType: 'absolute',
                width: '105%',
                height: '23%',
                position: { top: '18%', left: '8%' },
                flexDirection: 'row',
                alignContent: 'flex-start',
                flexWrap: 'wrap',
              }}
              uiBackground={{
                color: Color4.create(1,0,0,0.1)
              }}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <UiEntity
                  uiTransform={{
                    positionType: 'relative',
                    width: canvasInfo.height * 0.55 * 0.1,
                    height: canvasInfo.height * 0.55 * 0.1,
                    margin:{bottom:'4%', right:'14.15%'}
                  }}
                  onMouseDown={() => {
                    if (i < 6 - this.attachmentsLocked) {
                      this.modSlotSelected = i
                      console.log(i)
                    }
                  }}
                >
                  <UiEntity
                    uiTransform={{
                      positionType: 'absolute',
                      width: '90%',
                      height: '90%',
                      position: { top: '10%', left: '10%' }
                    }}
                    uiBackground={{
                      textureMode: 'stretch',
                      uvs:
                        i >= 6 - this.attachmentsLocked
                          ? getUvs(boardsSprites.modLockSprite)
                          : getUvs(boardsSprites.emptySlot),
                      texture: {
                        src: boardsSprites.modLockSprite.atlasSrc
                      }
                    }
                    }
                  />

                  
                </UiEntity>
              ))}
              
            </UiEntity>
            <UiEntity
                    uiTransform={{
                      positionType: 'absolute',
                      width: '30%',
                      height: '7.5%',
                      position: { top: '-2.5%', right: '-5%' }
                    }}
                    uiBackground={{
                      textureMode: 'stretch',
                      uvs: getUvs(buttonsSprites.closeButton),
                      texture: { src: buttonsSprites.closeButton.atlasSrc }
                    }}
                    onMouseDown={() => {
                      this.isModsVisible = false
                    }}
                  />
          </UiEntity>
        )}
        {!this.isModsVisible && (
          <UiEntity
            uiTransform={{
              positionType: 'relative',
              width:
                ((canvasInfo.height * 0.55) / this.background.h) *
                this.background.w,
              height: canvasInfo.height * 0.55
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(this.background),
              texture: { src: this.background.atlasSrc }
            }}
          >
            {/* Navbar */}
            <UiEntity
              uiTransform={{
                flexDirection: 'row',
                positionType: 'absolute',
                position: { top: '12%', right: '2%' },
                width: '53%',
                height: '10%'
              }}
            >
              <UiEntity
                uiTransform={{
                  positionType: 'relative',
                  width: '25%',
                  height: '100%'
                }}
                onMouseDown={() => {
                  this.DisplayInventory(0)
                }}
              />
              <UiEntity
                uiTransform={{
                  positionType: 'relative',
                  width: '25%',
                  height: '100%'
                }}
                onMouseDown={() => {
                  this.DisplayInventory(1)
                }}
              />
              <UiEntity
                uiTransform={{
                  positionType: 'relative',
                  width: '25%',
                  height: '100%'
                }}
                onMouseDown={() => {
                  this.DisplayInventory(2)
                }}
              />
              <UiEntity
                uiTransform={{
                  positionType: 'relative',
                  width: '25%',
                  height: '100%'
                }}
                onMouseDown={() => {
                  this.DisplayInventory(3)
                }}
              />
            </UiEntity>
            <UiEntity
              uiTransform={{
                flexDirection: 'row',
                alignContent: 'flex-start',
                flexWrap: 'wrap',
                positionType: 'absolute',
                position: { top: '50%', left: '25%' },
                width:
                  (canvasInfo.height *
                    0.55 *
                    0.05 *
                    buttonsSprites.modsSprite.w) /
                  buttonsSprites.modsSprite.h,
                height: canvasInfo.height * 0.55 * 0.05
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(buttonsSprites.modsSprite),
                texture: { src: buttonsSprites.modsSprite.atlasSrc }
              }}
              onMouseDown={() => {
                this.isModsVisible = true
              }}
            />
            <UiEntity
              uiTransform={{
                flexDirection: 'row',
                alignContent: 'flex-start',
                flexWrap: 'wrap',
                positionType: 'absolute',
                position: { top: '30.5%', right: '2.5%' },
                width: '51%',
                height: '60%'
              }}
            >
              {
                /* Items grid */
                this.arrayToShow.map((element, index) => (
                  <UiEntity
                    uiTransform={{
                      positionType: 'relative',
                      width: '16%',
                      height: '23%',
                      margin: { right: '0.7%', bottom: '0.6%' }
                    }}
                    uiBackground={{
                      textureMode: 'stretch',
                      uvs: getUvs(element.Sprite),
                      texture: { src: element.Sprite.atlasSrc }
                    }}
                    onMouseDown={() => {
                      this.ClickedItemSlot(element.ID)
                    }}
                  >
                    {this.selectedTab !== 0 && (
                      <Label
                        uiTransform={{
                          width: '100%',
                          height: fontSizeDrop,
                          positionType: 'absolute',
                          position: { bottom: '5%', left: '12%' }
                        }}
                        value={InventoryManager.Instance.GetItemCountByID(
                          element.ID,
                          false
                        ).toString()}
                        key={index}
                        fontSize={fontSizeDrop}
                        font="sans-serif"
                        color={Color4.White()}
                        textAlign="bottom-left"
                      />
                    )}
                  </UiEntity>
                ))
              }
            </UiEntity>
            <UiEntity
              uiTransform={{
                positionType: 'absolute',
                width: '10%',
                height: '5%',
                position: { top: '-0.5%', right: '-0.5%' }
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(buttonsSprites.closeButton),
                texture: { src: buttonsSprites.closeButton.atlasSrc }
              }}
              onMouseDown={() => {
                this.uiController?.sideBar.switchButtonState('Inventory')
              }}
            />
            {/* Experience */}
            <Label
              uiTransform={{
                positionType: 'absolute',
                position: { left: '10%', bottom: '9.5%' }
              }}
              value={this.uiTextExperience}
              fontSize={13}
              font="sans-serif"
              color={Color4.Yellow()}
              textAlign="bottom-left"
            />
            {/* Level */}
            <Label
              uiTransform={{
                positionType: 'absolute',
                position: { left: '21%', bottom: '15%' }
              }}
              value={this.uiTextLevel}
              fontSize={20}
              font="sans-serif"
              color={Color4.Yellow()}
              textAlign="bottom-left"
            />
          </UiEntity>
        )}
      </Canvas>
    )
  }

  public CallbackUpdateExpDisplay(): void {
    this.updateExpDisplay()
  }

  public ClickedItemSlot(id: string): void {
    // const uiElement: UIInteractable = this.uiInventorySlots.getElement(value);

    //ensure item exists in slot
    if (id !== '') {
      //process action based on current inventory display type
      let def
      switch (this.selectedTab) {
        //vehicle
        case 0:
          //get def
          def = VehicleManager.Instance.GetDefByID(id)
          if (def.ID !== null) {
            if (VehicleManager.Instance.ApplyVehicle(def.ID) !== null) {
              //update ui slot
              this.selectedVehicleSprite = def.Sprite
              this.selectedVehicleID = id
              console.log(this.selectedVehicleID)
              //update attachment panel
              //  apply locks based on rarity
              this.SetAttachmentLockState(
                VehicleManager.Instance.GetRarityIndex(def.Rarity) + 1
              )

              //  current vehicle
              // vehicleOwnership.changeEquippedVehicle(id);
              // this.updateDisplayBonus();
              // this.RedrawVehicle();
            }
          }
          //attempt to equip vehicle

          break
        //accessories
        case 1:
          //get def
          // def = AccessoryManager.Instance.GetDefByID(uiElement.itemID);
          // //attempt to equip accessory
          // if (AccessoryManager.Instance.ApplyAccessory(id)) {
          //     //update ui slot
          //     this.uiAccessory.SetIcon(def);
          //     this.uiAccessory.itemID = id;
          //     //  legacy
          //     vehicleOwnership.changeEquippedAccessory(id);
          // }
          break
        //resources
        case 2:
          break
        //powerups
        case 3:
          break
      }
    }
  }

  public updateExpDisplay(): void {
    this.uiTextExperience =
      LevelManager.Instance.CallbackGetExperienceNext().toString() +
      ' TO NEXT LVL'
  }

  public CallbackUpdateLevelDisplay(): void {
    UIInventoryManager.Instance.updateLevelDisplay()
  }

  public updateLevelDisplay(): void {
    this.uiTextLevel = LevelManager.Instance.GetLevelDisplayValue().toString()
  }

  init = (): void => {
    this.DisplayInventory(0)
    this.uiParentVisible = true
  }

  hide = (): void => {
    // this.SetDisplayState(false)
    this.uiParentVisible = false
  }
}
