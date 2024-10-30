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
import {
  VEHICLE_ATTACHMENT_TYPE,
  VehicleAttachmentData,
  type VehicleAttachmentDataObject
} from '../vehicle/vehicle-attachment-data'
import {
  VehicleAttachmentManager,
  VehicleAttachmentObject
} from '../vehicle/vehicle-attachment-manager'
import {
  type EquippedAccessory,
  type EquippedVehicle
} from '../instances/main/vehicleOwnership'
import {
  AccessoryData,
  type AccessoryDataObject
} from '../vehicle/accessory-data'
import { attachmentsSprites } from './atlas/attachmentsSprites'

const TOTAL_MODS_SLOTS = 6

type InventoryItem =
  | BaseObject
  | ResourceObject
  | CargoObject
  | VehicleDataObject
  | AccessoryDataObject

export class UIInventoryManager {
  isModsVisible: boolean = false
  modSlotSelected: number = -1
  arrayToShow: InventoryItem[] = [...ResourceObjectData, ...CargoObjectData]
  modsToShow: VehicleAttachmentDataObject[] = []
  background: Sprite = boardsSprites.inventoryMaterialsBoardSprite
  uiParentVisible: boolean = false
  uiTextExperience: string = '999999'
  uiTextLevel: string = '999'
  uiController: UIController
  selectedTab: number = 0
  // private static instance: undefined | UIInventoryManager
  selectedVehicle: VehicleDataObject | undefined
  selectedAccesory: AccessoryDataObject | undefined
  attachmentsLocked: number = 6
  selectedAttachments: InventoryItem[] = []
  expBonus: number = 0
  fuelCostBonus: number = 0
  gatheringBonus: number = 0
  speedBonus: number = 0
  coinBonus: number = 0
  equippedVehicleAtachments: Array<VehicleAttachmentDataObject | undefined> = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  ]

  // public static get Instance(): UIInventoryManager {
  //   //ensure instance is set
  //   if (UIInventoryManager.instance === undefined) {
  //     UIInventoryManager.instance = new UIInventoryManager(nweUIController)
  //   }

  //   return UIInventoryManager.instance
  // }

  constructor(uiController: UIController) {
    this.uiController = uiController
    LevelManager.Instance.RegisterUICallbackExperience(
      this.CallbackUpdateExpDisplay.bind(this)
    )
    LevelManager.Instance.RegisterUICallbackLevel(
      this.CallbackUpdateLevelDisplay.bind(this)
    )
  }

  public selectModSlot(value: number): void {
    if (value >= 0 && value < 7) {
      this.modSlotSelected = value
      this.DisplayMods(value)
    } else {
      this.modSlotSelected = 0
      this.DisplayMods(0)
    }
  }

  public updateDisplayBonus(): void {
    if (this.selectedVehicle !== undefined) {
      this.uiController.gameController.vehicleOwnership.changeEquippedVehicle(
        this.selectedVehicle.ID as EquippedVehicle
      )
    } else {
      this.uiController.gameController.vehicleOwnership.changeEquippedVehicle(
        'none'
      )
    }
    if (this.selectedAccesory !== undefined) {
      this.uiController.gameController.vehicleOwnership.changeEquippedAccessory(
        this.selectedAccesory.ID as EquippedAccessory
      )
    } else {
      this.uiController.gameController.vehicleOwnership.changeEquippedAccessory(
        'none'
      )
    }

    const { speedBoost, fuelEff, exp, coin, gathering } =
      this.uiController.gameController.vehicleOwnership.getBonusAttributes()
    // console.log({ speedBoost, fuelEff, exp, coin, gathering })
    //set text
    this.expBonus = exp
    this.fuelCostBonus = fuelEff
    this.gatheringBonus = gathering
    this.speedBonus = speedBoost
    this.coinBonus = coin
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
        this.background = boardsSprites.inventoryAccessoriesBoardSprite
        this.arrayToShow = []

        // Owned accessories
        // AccessoryData.forEach((accessory) => {
        //   if (AccessoryManager.Instance.GetEntryByID(accessory.ID).IsOwned) {
        //     this.arrayToShow.push(accessory)
        //   }
        // })

        // To test accessories bonuses
        this.arrayToShow = AccessoryData

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

  public DisplayMods(type: number): void {
    this.modSlotSelected = type
    switch (type) {
      case 0: {
        this.modsToShow = []
        VehicleAttachmentData.filter(
          (attachment) => attachment.Type === VEHICLE_ATTACHMENT_TYPE.TRAILS
        ).forEach((attachment) => {
          if (
            VehicleAttachmentManager.Instance.GetEntryByID(attachment.ID)
              .IsOwned
          ) {
            this.modsToShow.push(attachment)
          }
        })
        break
      }
      case 1: {
        this.modsToShow = []
        VehicleAttachmentData.filter(
          (attachment) => attachment.Type === VEHICLE_ATTACHMENT_TYPE.HORN
        ).forEach((attachment) => {
          if (
            VehicleAttachmentManager.Instance.GetEntryByID(attachment.ID)
              .IsOwned
          ) {
            this.modsToShow.push(attachment)
          }
        })
        break
      }
      case 2: {
        this.modsToShow = []
        VehicleAttachmentData.filter(
          (attachment) => attachment.Type === VEHICLE_ATTACHMENT_TYPE.UNDERGLOW
        ).forEach((attachment) => {
          if (
            VehicleAttachmentManager.Instance.GetEntryByID(attachment.ID)
              .IsOwned
          ) {
            this.modsToShow.push(attachment)
          }
        })
        break
      }

      default: {
        this.modsToShow = []
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
                position: { top: '1.75%', left: '26%' },
                width:
                  this.selectedVehicle !== undefined
                    ? ((canvasInfo.height * 0.55 * 0.12) /
                        this.selectedVehicle?.Sprite.h) *
                      this.selectedVehicle.Sprite.w
                    : 0,
                height: canvasInfo.height * 0.55 * 0.12
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs:
                  this.selectedVehicle !== undefined
                    ? getUvs(this.selectedVehicle.Sprite)
                    : getUvs(boardsSprites.emptySlot),
                texture: {
                  src:
                    this.selectedVehicle !== undefined
                      ? this.selectedVehicle.Sprite.atlasSrc
                      : boardsSprites.emptySlot.atlasSrc
                }
              }}
            />
            <UiEntity
              uiTransform={{
                positionType: 'absolute',
                position: { top: '51.5%', left: '2%' },
                width: '100%',
                height: '50%'
              }}
            >
              {
                /* Items grid */
                this.modsToShow.map((element, index) => (
                  <UiEntity
                    uiTransform={{
                      positionType: 'relative',
                      width:
                        ((canvasInfo.height * 0.55 * 0.1) / element.Sprite.h) *
                        element.Sprite.w,
                      height: canvasInfo.height * 0.55 * 0.1,
                      margin: { right: '0.7%', bottom: '0.6%' }
                    }}
                    uiBackground={{
                      textureMode: 'stretch',
                      uvs: getUvs(element.Sprite),
                      texture: { src: element.Sprite.atlasSrc }
                    }}
                    onMouseDown={() => {
                      this.ClickedModSlot(element.ID)
                    }}
                  />
                ))
              }
            </UiEntity>
            <UiEntity
              uiTransform={{
                positionType: 'absolute',
                width: '105%',
                height: '23%',
                position: { top: '18%', left: '8%' },
                flexDirection: 'row',
                alignContent: 'flex-start',
                flexWrap: 'wrap'
              }}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <UiEntity
                  uiTransform={{
                    positionType: 'relative',
                    width: canvasInfo.height * 0.55 * 0.1,
                    height: canvasInfo.height * 0.55 * 0.1,
                    margin: { bottom: '5.5%', right: '14.15%' }
                  }}
                  onMouseDown={() => {
                    if (i < 6 - this.attachmentsLocked) {
                      this.selectModSlot(i)
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
                    }}
                  >
                    <UiEntity
                      uiTransform={{
                        positionType: 'absolute',
                        width: '100%',
                        height: '100%',
                        position: { top: '-10.75%', left: '-9%' }
                      }}
                      uiBackground={{
                        textureMode: 'stretch',
                        uvs:
                          this.equippedVehicleAtachments[i] !== undefined
                            ? getUvs(this.equippedVehicleAtachments[i].Sprite)
                            : getUvs(boardsSprites.emptySlot),

                        texture: {
                          src:
                            this.equippedVehicleAtachments[i] !== undefined
                              ? this.equippedVehicleAtachments[i].Sprite
                                  .atlasSrc
                              : boardsSprites.emptySlot.atlasSrc
                        }
                      }}
                    />
                    <UiEntity
                      uiTransform={{
                        positionType: 'absolute',
                        width: '30%',
                        height: '30%',
                        position: { top: '30%', right: '-35%' }
                      }}
                      uiBackground={{
                        textureMode: 'stretch',
                        uvs:
                          this.equippedVehicleAtachments[i] !== undefined
                            ? getUvs(buttonsSprites.removeAttachment)
                            : getUvs(boardsSprites.emptySlot),

                        texture: {
                          src:
                            this.equippedVehicleAtachments[i] !== undefined
                              ? buttonsSprites.removeAttachment.atlasSrc
                              : boardsSprites.emptySlot.atlasSrc
                        }
                      }}
                      onMouseDown={() => {
                        if (i < 6 - this.attachmentsLocked) {
                          this.unselectVehicleAttachment(i)
                        }
                      }}
                    />
                    <UiEntity
                      uiTransform={{
                        positionType: 'absolute',
                        width: '110%',
                        height: '110%',
                        position: { top: '-15%', left: '-15%' }
                      }}
                      uiBackground={{
                        textureMode: 'stretch',
                        uvs:
                          this.modSlotSelected === i
                            ? getUvs(boardsSprites.modHighlightSprite)
                            : getUvs(boardsSprites.emptySlot),
                        texture: {
                          src: boardsSprites.modHighlightSprite.atlasSrc
                        }
                      }}
                    />
                  </UiEntity>
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
            <UiEntity
              uiTransform={{
                positionType: 'absolute',
                position: { top: '16%', left: '21.5%' },
                width:
                  this.selectedVehicle !== undefined
                    ? ((canvasInfo.height * 0.55 * 0.255) /
                        this.selectedVehicle?.Sprite.h) *
                      this.selectedVehicle.Sprite.w
                    : 0,
                height: canvasInfo.height * 0.55 * 0.255
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs:
                  this.selectedVehicle !== undefined
                    ? getUvs(this.selectedVehicle.Sprite)
                    : getUvs(boardsSprites.emptySlot),
                texture: {
                  src:
                    this.selectedVehicle !== undefined
                      ? this.selectedVehicle.Sprite.atlasSrc
                      : boardsSprites.emptySlot.atlasSrc
                }
              }}
              onMouseDown={() => {
                this.unselectVehicle()
              }}
            />
            <UiEntity
              uiTransform={{
                positionType: 'absolute',
                position: { bottom: '14.5%', left: '31%' },
                width:
                  this.selectedAccesory !== undefined
                    ? ((canvasInfo.height * 0.55 * 0.145) /
                        this.selectedAccesory?.Sprite.h) *
                      this.selectedAccesory.Sprite.w
                    : 0,
                height: canvasInfo.height * 0.55 * 0.145
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs:
                  this.selectedAccesory !== undefined
                    ? getUvs(this.selectedAccesory.Sprite)
                    : getUvs(boardsSprites.emptySlot),
                texture: {
                  src:
                    this.selectedAccesory !== undefined
                      ? this.selectedAccesory.Sprite.atlasSrc
                      : boardsSprites.emptySlot.atlasSrc
                }
              }}
              onMouseDown={() => {
                this.unselectAccesory()
              }}
            />
            {/* BONUS SideBar */}
            <UiEntity
              uiTransform={{
                flexDirection: 'column',
                positionType: 'absolute',
                justifyContent: 'flex-start',
                position: { top: '16.2%', left: '2%' },
                width: '13%',
                height: '80%'
              }}
            >
              <Label
                uiTransform={{
                  positionType: 'relative',
                  width: '100%',
                  height: '11.3%'
                }}
                value={Math.floor(this.expBonus) + '%'}
                textAlign="bottom-center"
                fontSize={fontSizeXP * 0.8}
              />
              <Label
                uiTransform={{
                  positionType: 'relative',
                  width: '100%',
                  height: '11.3%'
                }}
                value={Math.floor(this.fuelCostBonus) + '%'}
                textAlign="bottom-center"
                fontSize={fontSizeXP * 0.8}
              />
              <Label
                uiTransform={{
                  positionType: 'relative',
                  width: '100%',
                  height: '11.3%'
                }}
                value={this.gatheringBonus.toString()}
                textAlign="bottom-center"
                fontSize={fontSizeXP * 0.8}
              />
              <Label
                uiTransform={{
                  positionType: 'relative',
                  width: '100%',
                  height: '11.3%'
                }}
                value={Math.floor(this.speedBonus) + '%'}
                textAlign="bottom-center"
                fontSize={fontSizeXP * 0.8}
              />
              <Label
                uiTransform={{
                  positionType: 'relative',
                  width: '100%',
                  height: '11.3%'
                }}
                value={Math.floor(this.coinBonus) + '%'}
                textAlign="bottom-center"
                fontSize={fontSizeXP * 0.8}
              />
            </UiEntity>
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
                    {this.selectedTab !== 0 && this.selectedTab !== 1 && (
                      <Label
                        uiTransform={{
                          width: '100%',
                          height: fontSizeDrop,
                          positionType: 'absolute',
                          position: { bottom: '5%', left: '5%' }
                        }}
                        value={InventoryManager.Instance.GetItemCountByID(
                          element.ID,
                          false
                        ).toString()}
                        key={index}
                        fontSize={fontSizeXP * 0.8}
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

    // ensure item exists in slot
    if (id !== '') {
      // process action based on current inventory display type
      let def
      switch (this.selectedTab) {
        // vehicle
        case 0:
          //get def
          def = VehicleManager.Instance.GetDefByID(id)
          if (def.ID !== null) {
            if (VehicleManager.Instance.ApplyVehicle(def.ID) !== null) {
              //update ui slot
              this.selectedVehicle = def
              this.updateDisplayBonus()

              //update attachment panel
              //  apply locks based on rarity
              this.SetAttachmentLockState(
                VehicleManager.Instance.GetRarityIndex(def.Rarity) + 1
              )

              //  current vehicle
              // this.uiController.gameController.vehicleOwnership.changeEquippedVehicle(id);
            }
          }
          //attempt to equip vehicle

          break
        // accessories
        case 1:
          // get def
          def = AccessoryManager.Instance.GetDefByID(id)
          // def = AccessoryManager.Instance.GetDefByID('levelCrown')
          console.log({ def })
          if (def.ID !== null) {
            if (AccessoryManager.Instance.ApplyAccessory(def.ID) !== null) {
              //update ui slot
              this.selectedAccesory = def
              this.updateDisplayBonus()
              // legacy
              this.uiController.gameController.vehicleOwnership.changeEquippedVehicle(
                id
              )
            }
          }

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

  public ClickedModSlot(id: string): void {
    if (id !== '') {
      // process action based on current inventory display type
      let def
      switch (this.modSlotSelected) {
        // TRAIL
        case 0:
          //get def
          def = VehicleAttachmentManager.Instance.GetDefByID(id)
          if (def !== undefined) {
            if (
              def.ID !== null &&
              def.Type === VEHICLE_ATTACHMENT_TYPE.TRAILS
            ) {
              this.equippedVehicleAtachments[this.modSlotSelected] = def
              // Attach TRAIL to avatar
            }
          }
          break
        // HORN
        case 1:
          //get def
          def = VehicleAttachmentManager.Instance.GetDefByID(id)
          if (def !== undefined) {
            if (def.ID !== null && def.Type === VEHICLE_ATTACHMENT_TYPE.HORN) {
              this.equippedVehicleAtachments[this.modSlotSelected] = def
              // Attach TRAIL to avatar
            }
          }
          break
        //resources
        case 2:
          //get def
          def = VehicleAttachmentManager.Instance.GetDefByID(id)
          if (def !== undefined) {
            if (
              def.ID !== null &&
              def.Type === VEHICLE_ATTACHMENT_TYPE.UNDERGLOW
            ) {
              this.equippedVehicleAtachments[this.modSlotSelected] = def
              // Attach TRAIL to avatar
            }
          }
          break
        case 3:
          break
        case 4:
          break
        case 5:
          break
      }
    }
  }

  public unselectVehicle(): void {
    this.SetAttachmentLockState(0)
    this.selectedVehicle = undefined
    VehicleManager.Instance.RemoveVehicle()
    this.updateDisplayBonus()
  }

  public unselectVehicleAttachment(index: number): void {
    // unequip attachment
    this.equippedVehicleAtachments[index] = undefined
  }

  public unselectAccesory(): void {
    this.selectedAccesory = undefined
    AccessoryManager.Instance.RemoveAccessory()
    this.updateDisplayBonus()
  }

  public updateExpDisplay(): void {
    this.uiTextExperience =
      LevelManager.Instance.CallbackGetExperienceNext().toString() +
      ' TO NEXT LVL'
  }

  public CallbackUpdateLevelDisplay(): void {
    this.updateLevelDisplay()
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
