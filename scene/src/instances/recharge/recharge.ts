import {
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
import { type GameController } from '../../game.controller'


export class RechargeInstance {
  gameController: GameController
  assets: string[];
  constructor(gameController: GameController) {
    this.gameController = gameController
    this.assets = [
      'the-recharge/flagGORL1.glb',
      'the-recharge/flagGORL2.glb',
      'the-recharge/flagGORL3.glb',
      'the-recharge/redPortal.glb',
      'the-recharge/purplePortal.glb',
      'the-recharge/greenPortal.glb',
      // "the-recharge/spotlights.glb",
      'the-recharge/structure.gltf',
      'the-recharge/stage.gltf',
      'the-recharge/booths.gltf',
      'the-recharge/boards.gltf',
      'the-recharge/platforms.gltf',
      'the-recharge/theatreSeats.gltf',
      'npcs/krystalKoin.glb'
      // "the-recharge/stars.glb"
    ]
  }

   renderLeaderBoard = (): void => {
    // ### LEADERBOARD
    //  player levels parent object
    const parentLevelScores = engine.addEntity()
    Transform.createOrReplace(parentLevelScores, {
      position: Vector3.create(59.5, 27, 5.5),
      rotation: Quaternion.fromEulerDegrees(0, 160, 0)
    })
    //  player level scoreboard (we build on a scoreboard initialized off other data b.c we dont hold a def per-level)
    const scoreboardLevels = new ScoreboardDisplayObject(
      PLAYER_SCORE_NAMES.SPRINT_SOLO_TIME,
      Color4.Magenta(),
      Color4.White(),
      Color4.Magenta(),
      parentLevelScores
    )
    Transform.getMutable(scoreboardLevels.entityParent).position = Vector3.create(
      2.05,
      0.5,
      0
    )
    // modify target value and display type
    //  header
    TextShape.getMutable(scoreboardLevels.entityHeader).text = 'Racer LvL'
    TextShape.getMutable(scoreboardLevels.entityHeader).fontSize = 7
    //  server namespacing
    scoreboardLevels.SetTargetValue('lvl')
    scoreboardLevels.SetDisplayType(PLAYER_SCORE_TYPES.COUNT)
    //  entries
    scoreboardLevels.entrySorting = PLAYER_SCORE_SORTING_TYPES.HIGHEST_TOP
    scoreboardLevels.SetEntryCount(10)
    scoreboardLevels.SetEntryFontSize(5)
    scoreboardLevels.entrySpacing = 0.65
    scoreboardLevels.entryOffsetAll = Vector3.create(0, -1.2, 0)
    scoreboardLevels.entryOffsetName = Vector3.create(-1.3, 0, 0)
    scoreboardLevels.entryOffsetScore = Vector3.create(1.3, 0, 0)
    scoreboardLevels.RedrawEntryDisplay()
    //  update board display
    scoreboardLevels.UpdateScoreDisplay()
  }
  
  renderRecharge(): void {
    // createDanceAreas();
    missions.checkAndUnlockCampaignMission('visitRecharge')
    for (const [index, asset] of (this.assets as any).entries()) {
      const entity = engine.addEntity()
      Transform.create(entity)
      GltfContainer.create(entity, { src: `assets/models/${asset}` })
      if (index === 7) {
        const entityBox = engine.addEntity()
        Transform.createOrReplace(entityBox, {
          position: Vector3.create(82.47, 2.5, 32),
          scale: Vector3.create(3, 9, 4)
        })
        // VW_REGISTRY.triggerBox.rechargeMainTriggerBox(entityBox);
      }
  
      if (index === 5) {
        const entityBox = engine.addEntity()
        Transform.createOrReplace(entityBox, {
          position: Vector3.create(14, 2.5, 32),
          scale: Vector3.create(3, 9, 4)
        })
        // VW_REGISTRY.triggerBox.rechargeScrapyardTriggerBox(entityBox);
      }
    }
    const krystalKoinText = engine.addEntity()
    TextShape.create(krystalKoinText)
    Transform.create(krystalKoinText, {
      position: Vector3.create(48.0, 4.1, 53.5),
      scale: Vector3.create(0.7, 0.7, 1.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 360.0, 0.0)
    })
    const rawText4: string = 'Krystal Koin'
    TextShape.getMutable(krystalKoinText).fontSize = 6
    TextShape.getMutable(krystalKoinText).text = rawText4
    TextShape.getMutable(krystalKoinText).textColor = Color4.Magenta()
  
    this.renderLeaderBoard()
  
    utils.timers.setTimeout(() => {
      // atlasAnalytics.updateBranchName("Recharge");
      void movePlayerTo({ newRelativePosition: Vector3.create(47, 30, 32) })
    }, 5500)
  
    // Wisher Partner display
    const wishPartnerObj = engine.addEntity()
    Transform.create(wishPartnerObj, {
      position: Vector3.create(47.85, 23.8, 2.8),
      scale: Vector3.create(8.5, 8.5, 1.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0)
    })
    MeshRenderer.setPlane(wishPartnerObj)
    Material.setPbrMaterial(wishPartnerObj, {
      texture: Material.Texture.Common({
        src: 'https://bafybeieethbu6l6couxp6u67doies3ovfu75mw2mhorrpg3qf4qnddocfu.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafybeieethbu6l6couxp6u67doies3ovfu75mw2mhorrpg3qf4qnddocfu.ipfs.nftstorage.link/'
      })
    })
    PointerEvents.createOrReplace(wishPartnerObj, {
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
          wishPartnerObj
        )
      ) {
        void openExternalUrl({
          url: 'https://wishervodka.com/'
        })
      }
    })
  
    // Social Posters
    // SocialPoster1 trax
    const socialPoster1Obj = engine.addEntity()
    Transform.create(socialPoster1Obj, {
      position: Vector3.create(16.25, 22.5, 44.8),
      scale: Vector3.create(18.5, 18.5, 1.0),
      rotation: Quaternion.fromEulerDegrees(360.0, 311.0, 0.0)
    })
    MeshRenderer.setPlane(socialPoster1Obj)
    Material.setPbrMaterial(socialPoster1Obj, {
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
    const socialPoster2Obj = engine.addEntity()
    Transform.create(socialPoster2Obj, {
      position: Vector3.create(16.35, 6.0, 45.4),
      scale: Vector3.create(5.5, 10.0, 2.0),
      rotation: Quaternion.fromEulerDegrees(360.0, 310.0, 0.0)
    })
    MeshRenderer.setPlane(socialPoster2Obj)
    Material.setPbrMaterial(socialPoster2Obj, {
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
    const socialPoster3Obj = engine.addEntity()
    Transform.create(socialPoster3Obj, {
      position: Vector3.create(17.05, 27.5, 17.8),
      scale: Vector3.create(20.5, 20.5, 1.0),
      rotation: Quaternion.fromEulerDegrees(360.0, 229.0, 0.0)
    })
    MeshRenderer.setPlane(socialPoster3Obj)
    Material.setPbrMaterial(socialPoster3Obj, {
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
    const socialPoster4Obj = engine.addEntity()
    Transform.create(socialPoster4Obj, {
      position: Vector3.create(78.85, 26.5, 17.7),
      scale: Vector3.create(20.5, 20.5, 1.0),
      rotation: Quaternion.fromEulerDegrees(360.0, 131.0, 0.0)
    })
    MeshRenderer.setPlane(socialPoster4Obj)
    Material.setPbrMaterial(socialPoster4Obj, {
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
    const socialPoster5Obj = engine.addEntity()
    Transform.create(socialPoster5Obj, {
      position: Vector3.create(78.45, 4.0, 46.5),
      scale: Vector3.create(4.5, 7.5, 1.0),
      rotation: Quaternion.fromEulerDegrees(360.0, 228.0, 0.0)
    })
    MeshRenderer.setPlane(socialPoster5Obj)
    Material.setPbrMaterial(socialPoster5Obj, {
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
    const socialPoster6Obj = engine.addEntity()
    Transform.create(socialPoster6Obj, {
      position: Vector3.create(78.25, 18.6, 46.8),
      scale: Vector3.create(20.5, 20.5, 1.0),
      rotation: Quaternion.fromEulerDegrees(360.0, 48.0, 0.0)
    })
    MeshRenderer.setPlane(socialPoster6Obj)
    Material.setPbrMaterial(socialPoster6Obj, {
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
    const socialPoster7Obj = engine.addEntity()
    Transform.create(socialPoster7Obj, {
      position: Vector3.create(8.95, 14.5, 48.1),
      scale: Vector3.create(10.5, 7.5, 1.0),
      rotation: Quaternion.fromEulerDegrees(360.0, 310.0, 0.0)
    })
    MeshRenderer.setPlane(socialPoster7Obj)
    Material.setPbrMaterial(socialPoster7Obj, {
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
    const socialPoster8Obj = engine.addEntity()
    Transform.create(socialPoster8Obj, {
      position: Vector3.create(3.25, 12.5, 32.0),
      scale: Vector3.create(6.5, 7.5, 1.0),
      rotation: Quaternion.fromEulerDegrees(360.0, 270.0, 0.0)
    })
    MeshRenderer.setPlane(socialPoster8Obj)
    Material.setPbrMaterial(socialPoster8Obj, {
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
    const spotLights = engine.addEntity()
    Transform.create(spotLights, {
      position: Vector3.create(0, 0, 0),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    })
    GltfContainer.create(spotLights, {
      src: 'assets/models/the-recharge/spotlights.glb'
    })
    // SPAWN OFF SWITCH
    const offSwitch = engine.addEntity()
    const offSwitchCollider = engine.addEntity()
    Transform.create(offSwitch, {
      position: Vector3.create(0, 0, 0),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    })
    Transform.create(offSwitchCollider,{
      position: Vector3.create(47.7,1.60,18.89),
      scale: Vector3.create(0.5,1.6,0.4),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    })
    MeshCollider.setCylinder(offSwitchCollider)
    GltfContainer.create(offSwitch, {
      src: 'assets/models/the-recharge/offSwitch.glb'
    })
    PointerEvents.createOrReplace(offSwitchCollider, {
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
    const onSwitch = engine.addEntity()
    const onSwitchCollider = engine.addEntity()
    Transform.create(onSwitch, {
      position: Vector3.create(0, 0, 0),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    })
    Transform.create(onSwitchCollider,{
      position: Vector3.create(48.3,1.60,18.89),
      scale: Vector3.create(0.5,1.6,0.4),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    })
    MeshCollider.setCylinder(onSwitchCollider)
    GltfContainer.create(onSwitch, {
      src: 'assets/models/the-recharge/onSwitch.glb'
    })
    PointerEvents.createOrReplace(onSwitchCollider, {
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
          offSwitchCollider
        )
      ) {
        Transform.getMutable(spotLights).scale.x = 0
        Transform.getMutable(spotLights).scale.y = 0
        Transform.getMutable(spotLights).scale.z = 0
      }
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          onSwitchCollider
        )
      ) {
        Transform.getMutable(spotLights).scale.x = 1
        Transform.getMutable(spotLights).scale.y = 1
        Transform.getMutable(spotLights).scale.z = 1
      }
    })
  }
  
}
