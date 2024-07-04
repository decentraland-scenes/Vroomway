import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { inventoryButtons, missionsButtons, teleportButton } from './buttons'
import { getUvs } from './utils/utils'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import * as utils from '@dcl-sdk/utils'
import { movePlayerTo } from '~system/RestrictedActions'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { type UIController } from './ui.controller'
import { instance, type InstanceId } from '../utils/currentInstance'

export class SideBar {
  private readonly canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
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
    this.inventoryButton = getUvs(inventoryButtons.inactive)
    this.missionsButton = getUvs(missionsButtons.inactive)
  }

  createSideBarIcons(): ReactEcs.JSX.Element | null {
    if (this.canvasInfo === null) return null
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          positionType: 'absolute',
          position: { bottom: '2%', right: '2%' },
          display: this.isVisible ? 'flex' : 'none'
        }}
      >
        {/* Inventory */}
        <UiEntity
          uiTransform={{
            positionType: 'absolute',
            position: { right: '0.5%', bottom: '20%' },
            width: (this.canvasInfo.height * 0.24) / 1.75,
            height: this.canvasInfo.height * 0.077,
            display: this.backpackButtonVisible ? 'flex' : 'none'
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: this.inventoryButton,
            texture: { src: inventoryButtons.inactive.atlasSrc }
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
            positionType: 'absolute',
            position: { right: '0.5%', bottom: '10%' },
            width: (this.canvasInfo.height * 0.24) / 1.75,
            height: this.canvasInfo.height * 0.077,
            display: this.missionsButtonVisible ? 'flex' : 'none'
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: this.missionsButton,
            texture: { src: missionsButtons.inactive.atlasSrc }
          }}
          onMouseDown={() => {
            this.switchButtonState('Missions')
          }}
        />
        {/* Teleport */}
        <UiEntity
          uiTransform={{
            positionType: 'absolute',
            position: { right: '0.5%', bottom: '0%' },
            width: (this.canvasInfo.height * 0.24) / 1.75,
            height: this.canvasInfo.height * 0.077,
            display: this.isVisible ? 'flex' : 'none'
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(teleportButton),
            texture: { src: teleportButton.atlasSrc }
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
          ? inventoryButtons.active
          : inventoryButtons.inactive
      )
    } else if (button === 'Missions') {
      console.log('Missions clicked')
      this.missionsButtonActive = !this.missionsButtonActive
      this.missionsButton = getUvs(
        this.missionsButtonActive
          ? missionsButtons.active
          : missionsButtons.inactive
      )
    } else {
      console.log('Unknown button clicked:', button)
    }
  }

  hideMissionBoard = (): void => {
    // missionBoard.hide();
  }

  teleport = (): void => {
    // Make sure sprint is off!
    // sprintTimer.resetTimer();
    instance.setInstance('main')
    // cleanupScene();}
    utils.timers.setTimeout(() => {
      //   renderMainInstance()
      //   loader.showLoader()
    }, 50)
    utils.timers.setTimeout(() => {
      void movePlayerTo({
        newRelativePosition: Vector3.create(32.06, 1.0, 46.99),
        cameraTarget: Vector3.create(31.68, 1.15, 43.41)
      })
    }, 3250)
  }
}
