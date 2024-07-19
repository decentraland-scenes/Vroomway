/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ATLAS_SHEET_ITEM } from '../inventory/inventory-data'
import { ATLAS_SHEET_VEHICLE } from '../vehicle/vehicle-data'
import { ATLAS_SHEET_ACCESSORY } from '../vehicle/accessory-data'
import { type UIController } from './ui.controller'
import { Label, ReactEcs, UiEntity } from '@dcl/sdk/react-ecs'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { getUvs, type Sprite } from './utils/utils'
import { Color4 } from '@dcl/sdk/math'
import { LevelManager } from '../leveling/level-manager'

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
const INVENTORY_TEXTURES_PER_TYPE: string[][] = [
  ATLAS_SHEET_VEHICLE, //vehicles
  ATLAS_SHEET_ACCESSORY, //accessories
  ATLAS_SHEET_ITEM, //resources
  ATLAS_SHEET_ITEM //powerups
]

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
export class UIInventoryManager {
  uiParent: Sprite
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
    this.uiParent = {
      atlasSrc: INVENTORY_TEXTURE_BACKGROUND,
      atlasSize: { x: 2048, y: 2048 },
      x: 0,
      y: 580,
      w: 1000,
      h: 550
    }
    LevelManager.Instance.RegisterUICallbackExperience(
      this.CallbackUpdateExpDisplay
    )
    LevelManager.Instance.RegisterUICallbackLevel(
      this.CallbackUpdateLevelDisplay
    )
  }

  public DisplayInventory(type: number): void {
    if (DEBUGGING_UI_INVENTORY)
      console.log('UI Inventory Manager: redrawing inventory type=' + type)

    //redraw progression display
    this.updateExpDisplay()
    this.updateLevelDisplay()
    if (DEBUGGING_UI_INVENTORY)
      console.log('UI Inventory Manager: redrew inventory type=' + type)
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
          position: { top: '25%', right: '0%' }
        }}
      >
        {/* Ui Parent */}
        <UiEntity
          uiTransform={{
            positionType: 'relative',
            width: (canvasInfo.height * 1.88) / 1.8,
            height: canvasInfo.height * 0.55
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(this.uiParent),
            texture: { src: this.uiParent.atlasSrc }
          }}
          onMouseDown={() => {}}
        >
          {/* Experience */}
          <Label
            uiTransform={{
              positionType: 'absolute',
              position: { left: '11.3%', bottom: '13.3%' }
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
              position: { left: '21%', bottom: '19%' }
            }}
            value={this.uiTextLevel}
            fontSize={20}
            font="sans-serif"
            color={Color4.Yellow()}
            textAlign="bottom-left"
          />
        </UiEntity>
      </UiEntity>
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
