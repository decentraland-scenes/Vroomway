import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs } from './utils/utils'
import * as utils from '@dcl-sdk/utils'
import { joinDiscord, joinTwitter } from './buttons'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { openExternalUrl } from '~system/RestrictedActions'
import { SideBar } from './sidebar'
import Announcement from './Announcement'
import { Color4 } from '@dcl/sdk/math'
import { Profile } from './profile'
import { MissionsBoard } from './missions'
import { UIInventoryManager } from './inventory'
import { type GameController } from '../game.controller'
import { RenderOutOfFuel } from './outOfFuel'
import { dailyMission } from '../utils/dailyMissions'
import Canvas from './canvas/Canvas'

export class UIController {
  public socialsVisible: boolean = true
  public canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  public sideBar = new SideBar(this)
  public profile = new Profile(this)
  public missionsBoard = new MissionsBoard(this)
  public inventory = new UIInventoryManager(this)
  public outOfFuel = new RenderOutOfFuel(this)
  announcement_visible: boolean = false
  announcement: string = ''
  announcement_color: Color4 = Color4.White()
  gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
    ReactEcsRenderer.setUiRenderer(this.ui.bind(this))
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
      </UiEntity>
    )
  }

  render(): void {}

  renderSocials(): ReactEcs.JSX.Element | null {
    if (this.canvasInfo === null) return null
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          positionType: 'absolute',
          position: { left: '0%', top: '30%' },
          width: (this.canvasInfo.height * 0.055) / 0.67,
          height: this.canvasInfo.height * 0.055,
          display: this.socialsVisible ? 'flex' : 'none'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(joinDiscord),
          texture: { src: joinDiscord.atlasSrc }
        }}
        onMouseDown={() => {
          void openExternalUrl({ url: 'https://discord.gg/2E9AwrgssP' })
          void dailyMission.checkMission('sprintCompleteThree')
        }}
      >
        <UiEntity
          uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            positionType: 'absolute',
            position: { left: '90%', top: '0%' },
            width: (this.canvasInfo.height * 0.055) / 0.67,
            height: this.canvasInfo.height * 0.055
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(joinTwitter),
            texture: { src: joinTwitter.atlasSrc }
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
