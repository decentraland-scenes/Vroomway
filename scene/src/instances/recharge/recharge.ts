import {
  type Entity,
  GltfContainer,
  InputAction,
  Material,
  MeshCollider,
  MeshRenderer,
  PointerEventType,
  PointerEvents,
  TextShape,
  Transform,
  engine,
  inputSystem
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'
import { movePlayerTo, openExternalUrl } from '~system/RestrictedActions'
import {
  PLAYER_SCORE_NAMES,
  PLAYER_SCORE_TYPES,
  PLAYER_SCORE_SORTING_TYPES
} from '../../player-scores/player-score-data'
import { ScoreboardDisplayObject } from '../../player-scores/scoreboard-display-object'
import { missions } from '../../utils/missions'
import { crystals } from '../../crystals'
import { type GameController } from '../../controllers/game.controller'
import { instance } from '../../utils/currentInstance'
import { entityController } from '../../utils/entityController'
import { type RealmType } from '../types'

export class RechargeInstance {
  gameController: GameController
  public parentLevelScores = entityController.addEntity()
  public krystalKoinText = entityController.addEntity()
  public wishPartnerObj = entityController.addEntity()
  public socialPoster1Obj = entityController.addEntity()
  public socialPoster2Obj = entityController.addEntity()
  public socialPoster3Obj = entityController.addEntity()
  public socialPoster4Obj = entityController.addEntity()
  public socialPoster5Obj = entityController.addEntity()
  public socialPoster6Obj = entityController.addEntity()
  public socialPoster7Obj = entityController.addEntity()
  public socialPoster8Obj = entityController.addEntity()
  public spotLights = entityController.addEntity()
  public offSwitch = entityController.addEntity()
  public offSwitchCollider = entityController.addEntity()
  public onSwitch = entityController.addEntity()
  public onSwitchCollider = entityController.addEntity()
  public mainPortal = entityController.addEntity()
  public scrapYardPortal = entityController.addEntity()
  // Assets
  assets: Entity[]
  public flagGORL1: Entity
  public flagGORL2: Entity
  public flagGORL3: Entity
  public redPortal: Entity
  public purplePortal: Entity
  public greenPortal: Entity
  public structure: Entity
  public stage: Entity
  public booths: Entity
  public boards: Entity
  public platforms: Entity
  public theatreSeats: Entity
  public krystalKoin: Entity
  // Leaderboard
  scoreboardLevels: ScoreboardDisplayObject
  constructor(gameController: GameController) {
    this.gameController = gameController
    this.assets = [
      (this.flagGORL1 = entityController.addEntity()),
      (this.flagGORL2 = entityController.addEntity()),
      (this.flagGORL3 = entityController.addEntity()),
      (this.redPortal = entityController.addEntity()),
      (this.purplePortal = entityController.addEntity()),
      (this.greenPortal = entityController.addEntity()),
      (this.structure = entityController.addEntity()),
      (this.stage = entityController.addEntity()),
      (this.booths = entityController.addEntity()),
      (this.boards = entityController.addEntity()),
      (this.platforms = entityController.addEntity()),
      (this.theatreSeats = entityController.addEntity()),
      (this.krystalKoin = entityController.addEntity())
    ]
    GltfContainer.create(this.flagGORL1, {
      src: 'assets/models/the-recharge/flagGORL1.glb'
    })
    GltfContainer.create(this.flagGORL2, {
      src: 'assets/models/the-recharge/flagGORL2.glb'
    })
    GltfContainer.create(this.flagGORL3, {
      src: 'assets/models/the-recharge/flagGORL3.glb'
    })
    GltfContainer.create(this.redPortal, {
      src: 'assets/models/the-recharge/redPortal.glb'
    })
    GltfContainer.create(this.purplePortal, {
      src: 'assets/models/the-recharge/purplePortal.glb'
    })
    GltfContainer.create(this.greenPortal, {
      src: 'assets/models/the-recharge/greenPortal.glb'
    })
    GltfContainer.create(this.structure, {
      src: 'assets/models/the-recharge/structure.gltf'
    })
    GltfContainer.create(this.stage, {
      src: 'assets/models/the-recharge/stage.gltf'
    })
    GltfContainer.create(this.booths, {
      src: 'assets/models/the-recharge/booths.gltf'
    })
    GltfContainer.create(this.boards, {
      src: 'assets/models/the-recharge/boards.gltf'
    })
    GltfContainer.create(this.platforms, {
      src: 'assets/models/the-recharge/platforms.gltf'
    })
    GltfContainer.create(this.theatreSeats, {
      src: 'assets/models/the-recharge/theatreSeats.gltf'
    })
    GltfContainer.create(this.krystalKoin, {
      src: 'assets/models/npcs/krystalKoin.glb'
    })
    Transform.createOrReplace(this.parentLevelScores, {
      position: Vector3.create(59.5, 27, 5.5),
      rotation: Quaternion.fromEulerDegrees(0, 160, 0)
    })
    this.scoreboardLevels = new ScoreboardDisplayObject(
      PLAYER_SCORE_NAMES.SPRINT_SOLO_TIME,
      Color4.Magenta(),
      Color4.White(),
      Color4.Magenta(),
      this.parentLevelScores
    )
    this.renderLeaderBoard()
    this.renderRecharge()
  }

  renderLeaderBoard = (): void => {
    // ### LEADERBOARD
    //  player level scoreboard (we build on a scoreboard initialized off other data b.c we dont hold a def per-level)
    Transform.getMutable(this.scoreboardLevels.entityParent).position =
      Vector3.create(2.05, 0.5, 0)
    // modify target value and display type
    //  header
    TextShape.getMutable(this.scoreboardLevels.entityHeader).text = 'Racer LvL'
    TextShape.getMutable(this.scoreboardLevels.entityHeader).fontSize = 7
    //  server namespacing
    this.scoreboardLevels.SetTargetValue('lvl')
    this.scoreboardLevels.SetDisplayType(PLAYER_SCORE_TYPES.COUNT)
    //  entries
    this.scoreboardLevels.entrySorting = PLAYER_SCORE_SORTING_TYPES.HIGHEST_TOP
    this.scoreboardLevels.SetEntryCount(10)
    this.scoreboardLevels.SetEntryFontSize(5)
    this.scoreboardLevels.entrySpacing = 0.65
    this.scoreboardLevels.entryOffsetAll = Vector3.create(0, -1.2, 0)
    this.scoreboardLevels.entryOffsetName = Vector3.create(-1.3, 0, 0)
    this.scoreboardLevels.entryOffsetScore = Vector3.create(1.3, 0, 0)
    this.scoreboardLevels.RedrawEntryDisplay()
    //  update board display
    this.scoreboardLevels.UpdateScoreDisplay()
  }

  renderRecharge(): void {
    this.gameController.danceArea.createDanceAreas();
    missions.checkAndUnlockCampaignMission('visitRecharge')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [index, asset] of (this.assets as any).entries()) {
      Transform.create(asset)
    }
    TextShape.create(this.krystalKoinText)
    Transform.create(this.krystalKoinText, {
      position: Vector3.create(48.0, 4.1, 53.5),
      scale: Vector3.create(0.7, 0.7, 1.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 360.0, 0.0)
    })
    const rawText4: string = 'Krystal Koin'
    TextShape.getMutable(this.krystalKoinText).fontSize = 6
    TextShape.getMutable(this.krystalKoinText).text = rawText4
    TextShape.getMutable(this.krystalKoinText).textColor = Color4.Magenta()

    this.renderLeaderBoard()

    // utils.timers.setTimeout(() => {
    //   // atlasAnalytics.updateBranchName("Recharge");
    //   void movePlayerTo({ newRelativePosition: Vector3.create(47, 30, 32) })
    // }, 5500)

    // Wisher Partner display

    Transform.create(this.wishPartnerObj, {
      position: Vector3.create(47.85, 23.8, 2.8),
      scale: Vector3.create(8.5, 8.5, 1.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0)
    })
    MeshRenderer.setPlane(this.wishPartnerObj)
    Material.setPbrMaterial(this.wishPartnerObj, {
      texture: Material.Texture.Common({
        src: 'https://bafybeieethbu6l6couxp6u67doies3ovfu75mw2mhorrpg3qf4qnddocfu.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafybeieethbu6l6couxp6u67doies3ovfu75mw2mhorrpg3qf4qnddocfu.ipfs.nftstorage.link/'
      })
    })
    PointerEvents.createOrReplace(this.wishPartnerObj, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Wisher Vodka Website'
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.wishPartnerObj
        )
      ) {
        void openExternalUrl({
          url: 'https://wishervodka.com/'
        })
      }
    })

    // Social Posters
    // SocialPoster1 trax

    Transform.create(this.socialPoster1Obj, {
      position: Vector3.create(16.25, 22.5, 44.8),
      scale: Vector3.create(18.5, 18.5, 1.0),
      rotation: Quaternion.fromEulerDegrees(360.0, 311.0, 0.0)
    })
    MeshRenderer.setPlane(this.socialPoster1Obj)
    Material.setPbrMaterial(this.socialPoster1Obj, {
      texture: Material.Texture.Common({
        src: 'https://bafybeiboa7zylp35n6b3s2x7ubhobq7uhtnzez2h4agyo5cchd3xed3fry.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafybeiboa7zylp35n6b3s2x7ubhobq7uhtnzez2h4agyo5cchd3xed3fry.ipfs.nftstorage.link/'
      })
    })
    // SocialPoster2

    Transform.create(this.socialPoster2Obj, {
      position: Vector3.create(16.35, 6.0, 45.4),
      scale: Vector3.create(5.5, 10.0, 2.0),
      rotation: Quaternion.fromEulerDegrees(360.0, 310.0, 0.0)
    })
    MeshRenderer.setPlane(this.socialPoster2Obj)
    Material.setPbrMaterial(this.socialPoster2Obj, {
      texture: Material.Texture.Common({
        src: 'https://bafybeiguqsekcurm7mz4nktt37xpmg5gn6tossxl54rnlcjm6bwjyudnie.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafybeiguqsekcurm7mz4nktt37xpmg5gn6tossxl54rnlcjm6bwjyudnie.ipfs.nftstorage.link/'
      })
    })
    // SocialPoster3 groupy2

    Transform.create(this.socialPoster3Obj, {
      position: Vector3.create(17.05, 27.5, 17.8),
      scale: Vector3.create(20.5, 20.5, 1.0),
      rotation: Quaternion.fromEulerDegrees(360.0, 229.0, 0.0)
    })
    MeshRenderer.setPlane(this.socialPoster3Obj)
    Material.setPbrMaterial(this.socialPoster3Obj, {
      texture: Material.Texture.Common({
        src: 'https://bafybeidxfqpxywfwxndknbmknx6qygq2yml7x3llkjbgk2aekearsrz5rm.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafybeidxfqpxywfwxndknbmknx6qygq2yml7x3llkjbgk2aekearsrz5rm.ipfs.nftstorage.link/'
      })
    })
    // SocialPoster4 Tang

    Transform.create(this.socialPoster4Obj, {
      position: Vector3.create(78.85, 26.5, 17.7),
      scale: Vector3.create(20.5, 20.5, 1.0),
      rotation: Quaternion.fromEulerDegrees(360.0, 131.0, 0.0)
    })
    MeshRenderer.setPlane(this.socialPoster4Obj)
    Material.setPbrMaterial(this.socialPoster4Obj, {
      texture: Material.Texture.Common({
        src: 'https://bafybeihtp2gfdz6hkagfbxlkrdnkubb3sqqerveelftfp4en6g5nvkoiem.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafybeihtp2gfdz6hkagfbxlkrdnkubb3sqqerveelftfp4en6g5nvkoiem.ipfs.nftstorage.link/'
      })
    })
    // SocialPoster5 Lemon Man

    Transform.create(this.socialPoster5Obj, {
      position: Vector3.create(78.45, 4.0, 46.5),
      scale: Vector3.create(4.5, 7.5, 1.0),
      rotation: Quaternion.fromEulerDegrees(360.0, 228.0, 0.0)
    })
    MeshRenderer.setPlane(this.socialPoster5Obj)
    Material.setPbrMaterial(this.socialPoster5Obj, {
      texture: Material.Texture.Common({
        src: 'https://bafybeie3ymmudjv4l73qwjwgnhpkgqel5nxv57wtlckr6v2dkey4snxeue.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafybeie3ymmudjv4l73qwjwgnhpkgqel5nxv57wtlckr6v2dkey4snxeue.ipfs.nftstorage.link/'
      })
    })
    // SocialPoster6 toxic waifu

    Transform.create(this.socialPoster6Obj, {
      position: Vector3.create(78.25, 18.6, 46.8),
      scale: Vector3.create(20.5, 20.5, 1.0),
      rotation: Quaternion.fromEulerDegrees(360.0, 48.0, 0.0)
    })
    MeshRenderer.setPlane(this.socialPoster6Obj)
    Material.setPbrMaterial(this.socialPoster6Obj, {
      texture: Material.Texture.Common({
        src: 'https://bafybeictn5atwa6lzeipvazgiskhuworyacltge3evzuqwl7e7ze6gamcy.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafybeictn5atwa6lzeipvazgiskhuworyacltge3evzuqwl7e7ze6gamcy.ipfs.nftstorage.link/'
      })
    })
    // SocialPoster7

    Transform.create(this.socialPoster7Obj, {
      position: Vector3.create(8.95, 14.5, 48.1),
      scale: Vector3.create(10.5, 7.5, 1.0),
      rotation: Quaternion.fromEulerDegrees(360.0, 310.0, 0.0)
    })
    MeshRenderer.setPlane(this.socialPoster7Obj)
    Material.setPbrMaterial(this.socialPoster7Obj, {
      texture: Material.Texture.Common({
        src: 'https://bafybeicb4jsc5gadlex5cjr4qkfgqqqh4gaeq4d26vtepkuc52hg2el5py.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafybeicb4jsc5gadlex5cjr4qkfgqqqh4gaeq4d26vtepkuc52hg2el5py.ipfs.nftstorage.link/'
      })
    })
    // SocialPoster8 groupy1

    Transform.create(this.socialPoster8Obj, {
      position: Vector3.create(3.25, 12.5, 32.0),
      scale: Vector3.create(6.5, 7.5, 1.0),
      rotation: Quaternion.fromEulerDegrees(360.0, 270.0, 0.0)
    })
    MeshRenderer.setPlane(this.socialPoster8Obj)
    Material.setPbrMaterial(this.socialPoster8Obj, {
      texture: Material.Texture.Common({
        src: 'https://bafybeibkf7e5cxz7ck4pfg3oyzjh3owmu44vgboyimmampktjwkm6oizje.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafybeibkf7e5cxz7ck4pfg3oyzjh3owmu44vgboyimmampktjwkm6oizje.ipfs.nftstorage.link/'
      })
    })
    crystals.updateCrystals()

    // SPAWN SPOTLIGHTS

    Transform.create(this.spotLights, {
      position: Vector3.create(0, 0, 0),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    })
    GltfContainer.create(this.spotLights, {
      src: 'assets/models/the-recharge/spotlights.glb'
    })
    // SPAWN OFF SWITCH

    Transform.create(this.offSwitch, {
      position: Vector3.create(0, 0, 0),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    })
    Transform.create(this.offSwitchCollider, {
      position: Vector3.create(47.7, 1.6, 18.89),
      scale: Vector3.create(0.5, 1.6, 0.4),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    })
    MeshCollider.setCylinder(this.offSwitchCollider)
    GltfContainer.create(this.offSwitch, {
      src: 'assets/models/the-recharge/offSwitch.glb'
    })
    PointerEvents.createOrReplace(this.offSwitchCollider, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Disable Lights'
          }
        }
      ]
    })
    // SPAWN ON SWITCH

    Transform.create(this.onSwitch, {
      position: Vector3.create(0, 0, 0),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    })
    Transform.create(this.onSwitchCollider, {
      position: Vector3.create(48.3, 1.6, 18.89),
      scale: Vector3.create(0.5, 1.6, 0.4),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    })
    MeshCollider.setCylinder(this.onSwitchCollider)
    GltfContainer.create(this.onSwitch, {
      src: 'assets/models/the-recharge/onSwitch.glb'
    })
    PointerEvents.createOrReplace(this.onSwitchCollider, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Enable Lights'
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.offSwitchCollider
        )
      ) {
        Transform.getMutable(this.spotLights).scale.x = 0
        Transform.getMutable(this.spotLights).scale.y = 0
        Transform.getMutable(this.spotLights).scale.z = 0
      }
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.onSwitchCollider
        )
      ) {
        Transform.getMutable(this.spotLights).scale.x = 1
        Transform.getMutable(this.spotLights).scale.y = 1
        Transform.getMutable(this.spotLights).scale.z = 1
      }
    })
    // Main Portal
    Transform.createOrReplace(this.mainPortal, {
      position: Vector3.create(82.47, 2.5, 32),
      scale: Vector3.create(3, 9, 4)
    })
    MeshRenderer.setBox(this.mainPortal)
    Material.setPbrMaterial(this.mainPortal, {
      albedoColor: Color4.create(0, 0, 0, 0)
    })
    utils.triggers.addTrigger(
      this.mainPortal,
      1,
      1,
      [{ type: 'box', scale: Vector3.create(3, 9, 10) }],
      () => {
        console.log('test trigger')
        utils.timers.setTimeout(() => {
          instance.setInstance('main')
          // cleanUpScene();
          utils.timers.setTimeout(() => {
            void movePlayerTo({
              newRelativePosition: Vector3.create(14.78, 1.92, 31.81),
              cameraTarget: Vector3.create(30.18, 0.88, 31.3)
            })
            this.gameController.realmController.switchRealm('mainInstance')
            // loader.showLoader();
          }, 50)
        }, 50)
      }
    )
    // Scraapyard Portal
    Transform.createOrReplace(this.scrapYardPortal, {
      position: Vector3.create(14, 2.5, 32),
      scale: Vector3.create(3, 9, 4)
    })
    MeshRenderer.setBox(this.scrapYardPortal)
    Material.setPbrMaterial(this.scrapYardPortal, {
      albedoColor: Color4.create(0, 0, 0, 0)
    })
    utils.triggers.addTrigger(
      this.scrapYardPortal,
      1,
      1,
      [{ type: 'box', scale: Vector3.create(3, 9, 10) }],
      () => {
        utils.timers.setTimeout(() => {
          instance.setInstance('scrapyard')
          // cleanUpScene();
          utils.timers.setTimeout(() => {
            this.gameController.realmController.switchRealm('scrapyard')
            // loader.showLoader();
          }, 50)
        }, 50)
      }
    )
  }

  spawnSingleEntity(entityName: string): void {}

  removeSingleEntity(entityName: string): void {}

  removeAllEntities(): void {
    entityController.removeEntity(this.parentLevelScores)
    entityController.removeEntity(this.krystalKoinText)
    entityController.removeEntity(this.wishPartnerObj)
    entityController.removeEntity(this.socialPoster1Obj)
    entityController.removeEntity(this.socialPoster2Obj)
    entityController.removeEntity(this.socialPoster3Obj)
    entityController.removeEntity(this.socialPoster4Obj)
    entityController.removeEntity(this.socialPoster5Obj)
    entityController.removeEntity(this.socialPoster6Obj)
    entityController.removeEntity(this.socialPoster7Obj)
    entityController.removeEntity(this.socialPoster8Obj)
    entityController.removeEntity(this.spotLights)
    entityController.removeEntity(this.offSwitch)
    entityController.removeEntity(this.offSwitchCollider)
    entityController.removeEntity(this.onSwitch)
    entityController.removeEntity(this.onSwitchCollider)
    entityController.removeEntity(this.mainPortal)
    entityController.removeEntity(this.scrapYardPortal)
    this.assets.forEach((asset) => {
      entityController.removeEntity(asset)
    })
    this.scoreboardLevels.destroy()
  }

  getId(): RealmType {
    return 'mainInstance'
  }

  deadPosition(): Vector3 {
    return { x: -38.34, y: 10.43, z: -39.75 }
  }
}
