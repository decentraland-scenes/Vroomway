import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs } from '../ui/utils/utils'
import * as utils from '@dcl-sdk/utils'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { movePlayerTo, openExternalUrl } from '~system/RestrictedActions'
import { SideBar } from '../ui/sidebar'
import Announcement from '../ui/Announcement'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { Profile } from '../ui/profile'
import { MissionsBoard } from '../ui/missions'
import { UIInventoryManager } from '../ui/inventory'
import { type GameController } from './game.controller'
import { RenderOutOfFuel } from '../ui/outOfFuel'
import { dailyMission } from '../utils/dailyMissions'
import Canvas from '../ui/canvas/Canvas'
import { Loader } from '../ui/loader'
import { PowerUpShop } from '../ui/powerUpShop'
import { type PlayerStats } from '../utils/player'
import { Reward } from '../ui/reward'
import { buttonsSprites } from '../ui/atlas/buttonsSprites'

export class UIController {
  public player: PlayerStats
  public socialsVisible: boolean = true
  public canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  public sideBar = new SideBar(this)
  public reward = new Reward(this)
  public profile = new Profile(this)
  public missionsBoard = new MissionsBoard(this)
  public inventory = new UIInventoryManager(this)
  public outOfFuel = new RenderOutOfFuel(this)
  public loader = new Loader(this)
  public powerUpShop = new PowerUpShop(this)
  public timeCounter_visible = true
  public timerText: string = ''
  announcement_visible: boolean = false
  announcement: string = ''
  announcement_color: Color4 = Color4.White()
  gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
    ReactEcsRenderer.setUiRenderer(this.ui.bind(this))
    this.loader.showLoader()
    this.player = gameController.Player
  }

  ui(): ReactEcs.JSX.Element | null {
    if (this.canvasInfo === null) return null
    return (
      <UiEntity>
        <Canvas>
          {this.sideBar.isVisible && this.sideBar.createSideBarIcons()}
        </Canvas>
        <Canvas>{this.profile.isVisible && this.profile.initialize()}</Canvas>
        {this.socialsVisible && this.renderSocials()}
        <Canvas>{this.announcement_visible && this.announcementUI()}</Canvas>
        <Canvas>
          {this.missionsBoard.isVisible &&
            this.missionsBoard.createMissionBoard()}
        </Canvas>
        <Canvas>
          {this.inventory.uiParentVisible && this.inventory.createUI()}
        </Canvas>
        <Canvas>
          {this.gameController.soloSprint.soloSprintBoardVisible &&
            this.gameController.soloSprint.createUI()}
        </Canvas>
        <Canvas>
          {this.gameController.dragRaceBoard.boardVisible &&
            this.gameController.dragRaceBoard.createUI()}
        </Canvas>
        <Canvas>
          {this.gameController.decentrallyBoard.boardVisible &&
            this.gameController.decentrallyBoard.createUI()}
        </Canvas>
        <Canvas>
          {this.gameController.danceAreaUI.isVisible &&
            this.gameController.danceAreaUI.mainUI()}
        </Canvas>
        <Canvas>
          {this.gameController.superChargeTimer.isVisible &&
            this.gameController.superChargeTimer.mainUI()}
        </Canvas>
        <Canvas>
          {this.powerUpShop.isVisible && this.powerUpShop.createUI()}
          {this.gameController.sprintTimer.isVisible &&
            this.gameController.sprintTimer.mainUI()}
        </Canvas>
        <Canvas>{this.reward.isVisible && this.reward.createUi()}</Canvas>
        <Canvas>{this.loader.profileVisible && this.loader.mainUi()}</Canvas>
      </UiEntity>
    )
  }

  render(): void {}

  renderSocials(): ReactEcs.JSX.Element | null {
    if (this.canvasInfo === null) return null
    const iconSizeW =
      (this.canvasInfo.height * 0.055 * buttonsSprites.joinDiscord.w) /
      buttonsSprites.joinDiscord.h
    const iconSizeH = this.canvasInfo.height * 0.055
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          positionType: 'absolute',
          position: { left: '0%', top: '30%' },
          width: iconSizeW * 2,
          height: iconSizeH,
          display: this.socialsVisible ? 'flex' : 'none'
        }}
      >
        <UiEntity
          uiTransform={{
            width: iconSizeW,
            height: iconSizeH
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(buttonsSprites.joinDiscord),
            texture: { src: buttonsSprites.joinDiscord.atlasSrc }
          }}
          onMouseDown={() => {
            void openExternalUrl({ url: 'https://discord.gg/2E9AwrgssP' })
            void dailyMission.checkMission('sprintCompleteThree')

            // To finish solosprint race
            void movePlayerTo({
              newRelativePosition: Vector3.create(23.22, 42.46, 5.85)
            })
          }}
        />
        <UiEntity
          uiTransform={{
            width: iconSizeW,
            height: iconSizeH
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(buttonsSprites.joinTwitter),
            texture: { src: buttonsSprites.joinTwitter.atlasSrc }
          }}
          onMouseDown={() => {
            const getTweetText = (text: string): string => {
              return text.split(' ').join('%20')
            }
            void openExternalUrl({
              url: `https://twitter.com/intent/tweet?text=${getTweetText(
                `Come join me at @Vroomwayio to race, collect and craft your vehicle in @decentraland ${encodeURIComponent(
                  '\n\n'
                )}https://play.decentraland.org/?position=-104%2C-148 ${encodeURIComponent(
                  '\n\n'
                )}`
              )}&hashtags=Decentraland,DCL,P2E,Vroomway`
            })
            // To charge fuel
            this.gameController.Player.getValueAdjuster().fuel += 50
          }}
        />
      </UiEntity>
    )
  }

  announcementUI(): ReactEcs.JSX.Element {
    return (
      <Announcement
        visible={this.announcement_visible}
        text={this.announcement}
        color={this.announcement_color}
      />
    )
  }

  displayAnnouncement(
    announcement: string,
    color: Color4,
    duration: number
  ): void {
    utils.timers.clearInterval(duration)
    console.log('OPEN ANNOUNCEMENT')
    this.announcement = announcement
    this.announcement_visible = true
    this.announcement_color = color
    utils.timers.setTimeout(() => {
      this.announcement_visible = false
    }, duration)
  }
}
