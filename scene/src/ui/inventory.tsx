/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ATLAS_SHEET_VEHICLE } from '../vehicle/vehicle-data'
import { ATLAS_SHEET_ACCESSORY } from '../vehicle/accessory-data'
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
  ResourceObjectData,
  TokenObjectData
} from '../inventory/inventory-data'
import { InventoryManager } from '../inventory/inventory-manager'
import { buttonsSprites } from './atlas/buttonsSprites'

const DEBUGGING_UI_INVENTORY: boolean = true
const DEBUGGING_UI_INVENTORY_VERBOSE: boolean = false
const UI_SKIP_EQUIPPED_ITEMS: boolean = true

type SplicePiece = {
  srcWidth: number
  srcHeight: number
  srcLeft: number
  srcTop: number
}

/** vehicle attachment sheet pieces, these can be simplified later with better sheets */
const INVENTORY_TEXTURE_ATTACHMENTS_MENU =
  'assets/images/uiAtlas/board8Atlas.png'
const ATTACHMENT_HIGHLIGHT: SplicePiece = {
  srcWidth: 250,
  srcHeight: 250,
  srcLeft: 31,
  srcTop: 20
}
const ATTACHMENT_LOCK: SplicePiece = {
  srcWidth: 162,
  srcHeight: 182,
  srcLeft: 92,
  srcTop: 320
}
const ATTACHMENT_CLOSE: SplicePiece = {
  srcWidth: 229,
  srcHeight: 82,
  srcLeft: 58,
  srcTop: 564
}
const ATTACHMENT_OPEN: SplicePiece = {
  srcWidth: 260,
  srcHeight: 92,
  srcLeft: 891,
  srcTop: 927
}
const ATTACHMENT_PANEL: SplicePiece = {
  srcWidth: 1065,
  srcHeight: 1964,
  srcLeft: 488,
  srcTop: 45
}

/** this is a transitional fix for handling UI draws, the items.ts file defs
 * currently exist across several scripts and the data claw-back is going to
 * take a while. we'll store rough data objects for any currently undefined
 * data portions here (ex: vehicles need their own data objects); resource items
 * (coins, metal, etc.) are already being handled automatically.
 */

/** atlases of all possible ui elements, ideally we will split these per type:
 * 1 atlas for backgrounds, another for item icons (making things easier to manage
 * and cheaper to store)
 */
const INVENTORY_TEXTURE_BACKGROUND = 'assets/images/uiAtlas/board3Atlas.png'
const INVENTORY_TEXTURE_ICON = 'assets/images/uiAtlas/itemsAtlas.png'
const INVENTORY_TEXTURE_MODS = 'assets/images/uiAtlas/vehicleModsAtlas.png'
const INVENTORY_TEXTURE_BUTTONS = 'assets/images/uiAtlas/buttonAtlas.png'

/** targeting details for inventory slot backplate */
const INVENTORY_BACKPLATE_POS: SplicePiece = {
  srcWidth: 128,
  srcHeight: 128,
  srcLeft: 0,
  srcTop: 0
}
/** defines what splice sheet will be used for icons, sub arrays based on current inventory type
 */
// const INVENTORY_TEXTURES_PER_TYPE: string[][] = [
//   ATLAS_SHEET_VEHICLE, //vehicles
//   ATLAS_SHEET_ACCESSORY, //accessories
//   ATLAS_SHEET_ITEM, //resources
//   ATLAS_SHEET_ITEM //powerups
// ]

/** if true vehicle attachment ownership is not verified */
const ATTACHMENTS_SKIP_OWNERSHIP_CHECK: boolean = true
/** if true resources that have a zero amount will not be shown */
const INVENTORY_SKIP_ZERO_COUNT_RESOURCE: boolean = false
/** if true powerups that have a zero amount will not be shown */
const INVENTORY_SKIP_ZERO_COUNT_POWERUPS: boolean = false

//fixer pieces b.c toggled-on icons are hard-baked but toggled off icons are not -.-
//this will be redone in SDK7, so not sweating ugly solutions
const CATAGORY_ICON_RAW_POS = [
  [24, 1140],
  [24, 1260],
  [24, 900],
  [24, 1020]
]
const CATAGORY_ICON_SCREEN_POS = [
  [13, 136],
  [114, 138],
  [210.5, 139],
  [306, 138]
]
const CATAGORY_ICON_SCREEN_SIZE = [
  [34, 34],
  [34, 34],
  [34, 34],
  [34, 34]
]

/** represents a bundled set of ui objects making up a single
 *  interactable ui object, including:
 *      parent (controls draw & size)
 *      background (ex: frame/rarity/flair)
 *      icon (ex: item img) <= the current clickable
 *      text (ex: naming/item count)
 */

class UIInteractable {
  /** controls whether this ui element is clickable */
  isInteractable: boolean = true

  /** when true text will be removed when icon is reset, set this to false if using text as slot label */
  wipeText: boolean = true

  /** indexing (we could add type here too if required) */
  index: number

  /** currently slotted item */
  itemID: string = ''

  /** click callback, called whenever the ui element is clicked */
  uiCallbackEvent: ((value: number) => void) | undefined

  /** creates a new UI interactable, with default values */
  constructor(index: number = 0) {
    this.index = index
  }
}

type InventoryItem = BaseObject | ResourceObject | CargoObject

export class UIInventoryManager {
  isModsVisible: boolean = false
  modSlotSelected: number = 1
  arrayToShow: InventoryItem[] = [...ResourceObjectData, ...CargoObjectData]
  background: Sprite = boardsSprites.inventoryMaterialsBoardSprite
  uiParentVisible: boolean = false
  uiTextExperience: string = '999999'
  uiTextLevel: string = '999'
  uiController: UIController | undefined
  private static instance: undefined | UIInventoryManager
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
    this.isModsVisible = false
    this.updateExpDisplay()
    this.updateLevelDisplay()
    switch (type) {
      case 0: {
        this.background = boardsSprites.inventoryVehiclesBoardSprite
        this.arrayToShow = []
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

  createUi(): ReactEcs.JSX.Element {
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
                width: canvasInfo.height * 0.55 * 0.1,
                height: canvasInfo.height * 0.55 * 0.1,
                position: { top: '18%', left: '8%' }
              }}
              onMouseDown={() => {
                this.modSlotSelected = 1
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
                  uvs: getUvs(boardsSprites.modLockSprite),
                  texture: { src: boardsSprites.modLockSprite.atlasSrc }
                }}
              />
              <UiEntity
                uiTransform={{
                  display: this.modSlotSelected === 1 ? 'flex' : 'none',
                  width: '100%',
                  height: '100%'
                }}
                uiBackground={{
                  textureMode: 'stretch',
                  uvs: getUvs(boardsSprites.modHighlightSprite),
                  texture: { src: boardsSprites.modHighlightSprite.atlasSrc }
                }}
              />
            </UiEntity>
            <UiEntity
              uiTransform={{
                positionType: 'absolute',
                width: canvasInfo.height * 0.55 * 0.1,
                height: canvasInfo.height * 0.55 * 0.1,
                position: { top: '18%', left: '41%' }
              }}
              onMouseDown={() => {
                this.modSlotSelected = 2
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
                  uvs: getUvs(boardsSprites.modLockSprite),
                  texture: { src: boardsSprites.modLockSprite.atlasSrc }
                }}
              />
              <UiEntity
                uiTransform={{
                  display: this.modSlotSelected === 2 ? 'flex' : 'none',
                  width: '100%',
                  height: '100%'
                }}
                uiBackground={{
                  textureMode: 'stretch',
                  uvs: getUvs(boardsSprites.modHighlightSprite),
                  texture: { src: boardsSprites.modHighlightSprite.atlasSrc }
                }}
              />
            </UiEntity>
            <UiEntity
              uiTransform={{
                positionType: 'absolute',
                width: canvasInfo.height * 0.55 * 0.1,
                height: canvasInfo.height * 0.55 * 0.1,
                position: { top: '18%', left: '74%' }
              }}
              onMouseDown={() => {
                this.modSlotSelected = 3
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
                  uvs: getUvs(boardsSprites.modLockSprite),
                  texture: { src: boardsSprites.modLockSprite.atlasSrc }
                }}
              />
              <UiEntity
                uiTransform={{
                  display: this.modSlotSelected === 3 ? 'flex' : 'none',
                  width: '100%',
                  height: '100%'
                }}
                uiBackground={{
                  textureMode: 'stretch',
                  uvs: getUvs(boardsSprites.modHighlightSprite),
                  texture: { src: boardsSprites.modHighlightSprite.atlasSrc }
                }}
              />
            </UiEntity>
            <UiEntity
              uiTransform={{
                positionType: 'absolute',
                width: canvasInfo.height * 0.55 * 0.1,
                height: canvasInfo.height * 0.55 * 0.1,
                position: { top: '31%', left: '8%' }
              }}
              onMouseDown={() => {
                this.modSlotSelected = 4
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
                  uvs: getUvs(boardsSprites.modLockSprite),
                  texture: { src: boardsSprites.modLockSprite.atlasSrc }
                }}
              />
              <UiEntity
                uiTransform={{
                  display: this.modSlotSelected === 4 ? 'flex' : 'none',
                  width: '100%',
                  height: '100%'
                }}
                uiBackground={{
                  textureMode: 'stretch',
                  uvs: getUvs(boardsSprites.modHighlightSprite),
                  texture: { src: boardsSprites.modHighlightSprite.atlasSrc }
                }}
              />
            </UiEntity>
            <UiEntity
              uiTransform={{
                positionType: 'absolute',
                width: canvasInfo.height * 0.55 * 0.1,
                height: canvasInfo.height * 0.55 * 0.1,
                position: { top: '31%', left: '41%' }
              }}
              onMouseDown={() => {
                this.modSlotSelected = 5
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
                  uvs: getUvs(boardsSprites.modLockSprite),
                  texture: { src: boardsSprites.modLockSprite.atlasSrc }
                }}
              />
              <UiEntity
                uiTransform={{
                  display: this.modSlotSelected === 5 ? 'flex' : 'none',
                  width: '100%',
                  height: '100%'
                }}
                uiBackground={{
                  textureMode: 'stretch',
                  uvs: getUvs(boardsSprites.modHighlightSprite),
                  texture: { src: boardsSprites.modHighlightSprite.atlasSrc }
                }}
              />
            </UiEntity>
            <UiEntity
              uiTransform={{
                positionType: 'absolute',
                width: canvasInfo.height * 0.55 * 0.1,
                height: canvasInfo.height * 0.55 * 0.1,
                position: { top: '31%', left: '74%' }
              }}
              onMouseDown={() => {
                this.modSlotSelected = 6
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
                  uvs: getUvs(boardsSprites.modLockSprite),
                  texture: { src: boardsSprites.modLockSprite.atlasSrc }
                }}
              />
              <UiEntity
                uiTransform={{
                  display: this.modSlotSelected === 6 ? 'flex' : 'none',
                  width: '100%',
                  height: '100%'
                }}
                uiBackground={{
                  textureMode: 'stretch',
                  uvs: getUvs(boardsSprites.modHighlightSprite),
                  texture: { src: boardsSprites.modHighlightSprite.atlasSrc }
                }}
              />
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
                  >
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
