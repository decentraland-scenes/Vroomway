import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs } from './utils/utils'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
// import * as utils from '@dcl-sdk/utils'
import { movePlayerTo } from '~system/RestrictedActions'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { type UIController } from '../controllers/ui.controller'
import { instance, type InstanceId } from '../utils/currentInstance'
import { buttonsSprites } from './atlas/buttonsSprites'

export class SideBar {
  public isVisible: boolean = true
  public missionsButtonVisible: boolean = true
  public backpackButtonVisible: boolean = true
  public inventoryButton: number[]
  public missionsButton: number[]
  private inventoryButtonActive: boolean = false
  private missionsButtonActive: boolean = false
  uiController: UIController
  constructor(uiController: UIController) {
    this.uiController = uiController
    this.inventoryButton = getUvs(buttonsSprites.inventoryInactive)
    this.missionsButton = getUvs(buttonsSprites.missionsInactive)
  }

  createSideBarIcons(): ReactEcs.JSX.Element {
    const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          width: canvasInfo.width * 0.2,
          height: canvasInfo.height * 0.5,
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          positionType: 'absolute',
          position: { bottom: '2%', right: '0%' }
        }}
      >
        {/* Inventory */}
        <UiEntity
          uiTransform={{
            positionType: 'relative',
            width: canvasInfo.height * 0.077 * 1.75,
            height: canvasInfo.height * 0.077,
            display: this.backpackButtonVisible ? 'flex' : 'none',
            margin: '2%'
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: this.inventoryButton,
            texture: { src: buttonsSprites.inventoryInactive.atlasSrc }
          }}
          onMouseDown={() => {
            this.switchButtonState('Inventory')
            const gameMode = instance.getInstance()
            console.log(gameMode, 'MODE')
            // Disable button in game modes
            const instanceIdsToDisable: InstanceId[] = [
              'soloSprint',
              'demoDerby',
              'fuegoCircuit',
              'dragRace'
            ]
            if (instanceIdsToDisable.includes(gameMode)) {
              this.uiController.displayAnnouncement(
                "Inventory's disabled until after game.",
                Color4.Yellow(),
                1000
              )
              return
            }
            //   UIInventoryManager.Instance.init()
            this.hideMissionBoard()
          }}
        />
        {/* Missions */}
        <UiEntity
          uiTransform={{
            positionType: 'relative',
            width: canvasInfo.height * 0.077 * 1.75,
            height: canvasInfo.height * 0.077,
            display: this.missionsButtonVisible ? 'flex' : 'none',
            margin: '2%'
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: this.missionsButton,
            texture: { src: buttonsSprites.missionsInactive.atlasSrc }
          }}
          onMouseDown={() => {
            this.switchButtonState('Missions')
          }}
        />
        {/* Teleport */}
        <UiEntity
          uiTransform={{
            positionType: 'relative',
            width: canvasInfo.height * 0.077 * 1.75,
            height: canvasInfo.height * 0.077,
            display: this.isVisible ? 'flex' : 'none',
            margin: '2%'
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(buttonsSprites.teleportButton),
            texture: { src: buttonsSprites.teleportButton.atlasSrc }
          }}
          onMouseDown={() => {
            // UIInventoryManager.Instance.SetDisplayState(false);
            this.hideMissionBoard()
            if (instance.getInstance() === 'main') {
              this.uiController.displayAnnouncement(
                "You're already home.",
                Color4.Yellow(),
                3000
              )
              return
            }
            if (instance.getInstance() === 'fuegoCircuit') {
              this.uiController.displayAnnouncement(
                'Use the quit button.',
                Color4.Yellow(),
                3000
              )
              this.teleport()
              return
            }
            if (instance.getInstance() === 'dragRace') {
              this.uiController.displayAnnouncement(
                'Use the quit button.',
                Color4.Yellow(),
                3000
              )
              return
            }
            this.teleport()
          }}
        />
      </UiEntity>
    )
  }

  switchButtonState = (button: string): void => {
    if (button === 'Inventory') {
      console.log('Inventory clicked')
      this.inventoryButtonActive = !this.inventoryButtonActive
      this.inventoryButton = getUvs(
        this.inventoryButtonActive
          ? buttonsSprites.inventoryActive
          : buttonsSprites.inventoryInactive
      )
      if (this.inventoryButtonActive) {
        this.uiController.inventory.init()
      } else {
        this.uiController.inventory.hide()
      }
    } else if (button === 'Missions') {
      console.log('Missions clicked')
      this.missionsButtonActive = !this.missionsButtonActive
      this.missionsButton = getUvs(
        this.missionsButtonActive
          ? buttonsSprites.missionsActive
          : buttonsSprites.missionsInactive
      )
      if (this.missionsButtonActive) {
        this.uiController.missionsBoard.show()
      } else {
        this.uiController.missionsBoard.hide()
      }
    } else {
      console.log('Unknown button clicked:', button)
    }
  }

  hideMissionBoard = (): void => {
    this.uiController.missionsBoard.hide()
  }

  teleport = (): void => {
    // Make sure sprint is off!
    // sprintTimer.resetTimer();
    instance.setInstance('main')
    // cleanupScene();}
    //   renderMainInstance()
    this.uiController.loader.showLoader()
    this.uiController.gameController.realmController.switchRealm('mainInstance')
    void movePlayerTo({
      newRelativePosition: Vector3.create(32.06, 1.0, 46.99),
      cameraTarget: Vector3.create(31.68, 1.15, 43.41)
    })
  }
}
