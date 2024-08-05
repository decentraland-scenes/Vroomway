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
import * as npc from 'dcl-npc-toolkit'
import * as utils from '@dcl-sdk/utils'
import { movePlayerTo, openExternalUrl } from '~system/RestrictedActions'
import { getUserData } from '~system/UserIdentity'
import { PLAYER_SCORE_NAMES } from '../../player-scores/player-score-data'
import { ScoreboardDisplayObject } from '../../player-scores/scoreboard-display-object'
import {
  BLACKLIST,
  DEMO_DERBY_COST,
  DRAG_RACE_COST,
  FUEGO_CIRCUIT_COST,
  SOLO_SPRINT_COST
} from '../../utils/constants'
import { instance } from '../../utils/currentInstance'
import { TulioDialog1, YoYoDialog1 } from '../../utils/dialog'
import { missions } from '../../utils/missions'
import { cleanUpScene } from '../../utils/cleanupScene'
import { type RealmType } from '../types'
import { type GameController } from '../../controllers/game.controller'
import { entityController } from '../../utils/entityController'

export class MainInstance {
  gameController: GameController
  assets: Entity[]
  parentRaceScores = entityController.addEntity()
  yoyo = entityController.addEntity()
  yoyoText = entityController.addEntity()
  socialPortal = entityController.addEntity()
  scrapYardPortal = entityController.addEntity()
  fuelPurchase = entityController.addEntity()
  termsAndCondPoster = entityController.addEntity()
  fuelInfoPoster = entityController.addEntity()
  soloSprintSign = entityController.addEntity()
  dragRaceSign = entityController.addEntity()
  fuegoCircuitsSign = entityController.addEntity()
  scrapyardSign = entityController.addEntity()
  rechargeSign = entityController.addEntity()
  tulio = entityController.addEntity()
  tulioText = entityController.addEntity()
  aMaryPosterText = entityController.addEntity()
  kKoinPosterText = entityController.addEntity()
  puSign = entityController.addEntity()
  seasonWinner1 = entityController.addEntity()
  seasonWinner2 = entityController.addEntity()
  seasonWinner3 = entityController.addEntity()
  seasonWinner4 = entityController.addEntity()
  seasonWinner5 = entityController.addEntity()
  seasonWinner6 = entityController.addEntity()
  seasonWinner7 = entityController.addEntity()
  seasonWinner8 = entityController.addEntity()
  seasonWinner9 = entityController.addEntity()
  seasonWinner10 = entityController.addEntity()
  seasonWinner11 = entityController.addEntity()
  seasonWinner12 = entityController.addEntity()
  seasonWinner13 = entityController.addEntity()
  seasonWinner14 = entityController.addEntity()
  seasonWinner15 = entityController.addEntity()
  seasonWinner16 = entityController.addEntity()
  seasonWinner17 = entityController.addEntity()
  seasonWinner18 = entityController.addEntity()
  seasonWinner19 = entityController.addEntity()
  seasonWinner20 = entityController.addEntity()
  hyperfy = entityController.addEntity()
  howToPlay1 = entityController.addEntity()
  howToPlay2 = entityController.addEntity()
  howToPlay3 = entityController.addEntity()
  newHere = entityController.addEntity()
  hofText = entityController.addEntity()
  hofButton = entityController.addEntity()
  hofButton2 = entityController.addEntity()

  constructor(gameController: GameController) {
    this.gameController = gameController
    this.assets = []
    void this.renderMainInstance()
  }

  renderMainInstance = async (): Promise<void> => {
    //   if (Constants.SCENE_MGR && (!Constants.SCENE_MGR.lastRaceType || Constants.SCENE_MGR.lastRaceType != "lobby")) {
    //     //workaround to assign this here. all sets should take place in raceSceneManager but fall back when not
    //     log(
    //         "renderMainInstance",
    //         "WORKAROUND setting Constants.SCENE_MGR.lastRaceType",
    //         Constants.SCENE_MGR.lastRaceType,
    //         "to",
    //         "lobby"
    //     );
    //     Constants.SCENE_MGR.lastRaceType = "lobby";
    // } else if (!Constants.SCENE_MGR) {
    //     log("renderMainInstance", "WARNING Constants.SCENE_MGR was null, could not set Constants.SCENE_MGR.lastRaceType");
    // }
    // if (powerUpBarUI) powerUpBarUI.hide();
    this.gameController.Player.updateUI()
    // PowerUpsInv.powerUpMgr.reset();

    // Constants.SCENE_MGR?.lobbyScene?.init();
    // Constants.SCENE_MGR?.lobbyScene?.show();

    const staticEntities = [
      'assets/models/main-entrance/mainStructure.glb',
      'assets/models/main-entrance/ssHub.glb',
      'assets/models/main-entrance/fcHub.glb',
      'assets/models/main-entrance/drHub.glb',
      'assets/models/main-entrance/seating.glb',
      'assets/models/main-entrance/leaderboard.glb',
      'assets/models/main-entrance/startCoinSS.glb',
      'assets/models/main-entrance/startCoinDR.glb',
      'assets/models/main-entrance/startCoinFC.glb',
      'assets/models/main-entrance/vendingMachine.glb',
      'assets/models/main-entrance/directionArrows.glb',
      'assets/models/main-entrance/scrapyardPortal.glb',
      'assets/models/main-entrance/rechargePortal.glb',
      'assets/models/main-entrance/ceilingLogo.glb',
      'assets/models/main-entrance/hofButton.glb',
      'assets/models/main-entrance/hofButton2.glb',
      'assets/models/main-entrance/portalFrames.glb',
      'assets/models/main-entrance/tocZone.glb',
      'assets/models/main-entrance/fuelPurchase.glb'
    ]

    const startCoinPositions = [
      Vector3.create(62.89, 2.06, 10.69),
      Vector3.create(45.28, 1.98, 7.48),
      Vector3.create(53.09, 2.05, 7.27)
    ]

    let startCoinIndex = 0

    staticEntities.forEach((entity) => {
      const newEntity = entityController.addEntity()
      this.assets.push(newEntity)
      Transform.create(newEntity, {
        position: Vector3.create(96, 0, 64),
        rotation: Quaternion.create(0, 90, 0, 0)
      })
      GltfContainer.create(newEntity, { src: entity })

      if (
        [
          'assets/models/main-entrance/startCoinSS.glb',
          'assets/models/main-entrance/startCoinDR.glb',
          'assets/models/main-entrance/startCoinFC.glb'
        ].includes(entity)
      ) {
        const collider = entityController.addEntity()
        this.assets.push(collider)
        MeshCollider.setBox(collider)
        Transform.create(collider, {
          position: startCoinPositions[startCoinIndex],
          scale: Vector3.create(1, 1, 1),
          rotation: Quaternion.create(0, 90, 0, 0)
        })
        startCoinIndex = (startCoinIndex + 1) % startCoinPositions.length
        PointerEvents.createOrReplace(collider, {
          pointerEvents: [
            {
              eventType: PointerEventType.PET_DOWN,
              eventInfo: {
                button: InputAction.IA_POINTER,
                showFeedback: true,
                hoverText: 'Interact'
              }
            }
          ]
        })
        engine.addSystem(() => {
          if (
            inputSystem.isTriggered(
              InputAction.IA_POINTER,
              PointerEventType.PET_DOWN,
              collider
            )
          ) {
            if (entity.includes('SS')) {
              if (instance.getInstance() !== 'main') return
              if (this.gameController.Player.getFuel() < SOLO_SPRINT_COST) {
                this.gameController.uiController.outOfFuel.show()
                return
              }
              this.gameController.soloSprint.show()
            }
            if (entity.includes('DD')) {
              if (instance.getInstance() !== 'main') return
              if (this.gameController.Player.getFuel() >= DEMO_DERBY_COST) {
                // demoDerbyBoard.show()
              } else {
                this.gameController.uiController.outOfFuel.show()
                return
              }
            }
            if (entity.includes('FC')) {
              if (instance.getInstance() !== 'main') return
              if (this.gameController.Player.getFuel() >= FUEGO_CIRCUIT_COST) {
                this.gameController.decentrallyBoard.show()
              } else {
                this.gameController.uiController.outOfFuel.show()
                return
              }
            }
            if (entity.includes('DR')) {
              if (instance.getInstance() !== 'main') return
              if (this.gameController.Player.getFuel() >= DRAG_RACE_COST) {
                this.gameController.dragRaceBoard.show() // TODO
              } else {
                this.gameController.uiController.outOfFuel.show()
              }
            }
          }
        })
      }
    })

    //  race times scoreboard parent
    Transform.createOrReplace(this.parentRaceScores, {
      position: Vector3.create(32.15, 9.3, 7.72),
      rotation: Quaternion.fromEulerDegrees(0, 225.0, 0)
    })
    //  solo sprint time
    const scoreboardSoloSprint = new ScoreboardDisplayObject(
      PLAYER_SCORE_NAMES.SPRINT_SOLO_TIME,
      Color4.Red(),
      Color4.White(),
      Color4.Red(),
      this.parentRaceScores
    )
    Transform.getMutable(scoreboardSoloSprint.entityParent).position =
      Vector3.create(1.0, 1.75, 0)
    scoreboardSoloSprint.UpdateScoreDisplay()
    //  solo sprint time
    const scoreboardCircuit = new ScoreboardDisplayObject(
      PLAYER_SCORE_NAMES.CIRCUIT_TIME,
      Color4.Yellow(),
      Color4.White(),
      Color4.Yellow(),
      this.parentRaceScores
    )
    Transform.getMutable(scoreboardCircuit.entityParent).position =
      Vector3.create(6.2, 1.75, 0)
    scoreboardCircuit.UpdateScoreDisplay()
    //  drag race time
    const scoreboardDragRace = new ScoreboardDisplayObject(
      PLAYER_SCORE_NAMES.DRAG_RACE_TIME,
      Color4.Blue(),
      Color4.White(),
      Color4.Blue(),
      this.parentRaceScores
    )
    Transform.getMutable(scoreboardDragRace.entityParent).position =
      Vector3.create(11.1, 1.75, 0)
    scoreboardDragRace.UpdateScoreDisplay()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.yoyo = npc.create(
      {
        position: Vector3.create(49.94, 0.0, 50.45),
        scale: Vector3.create(2.0, 2.0, 2.0),
        rotation: Quaternion.fromEulerDegrees(0.0, 335.0, 0.0)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/npcs/yoyoNPC.glb',
        onActivate: () => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          missions.getCurrentMissionName() === 'yoyo'
            ? npc.openDialogWindow(this.yoyo, YoYoDialog1, 0)
            : null
        },
        idleAnim: `idle`,
        faceUser: true,
        darkUI: true,
        coolDownDuration: 3,
        hoverText:
          missions.getCurrentMissionName() === 'yoyo' ? 'Talk to YoYo' : '',
        onlyClickTrigger: true,
        onlyExternalTrigger: false,
        reactDistance: 3,
        continueOnWalkAway: false
      }
    )

    TextShape.create(this.yoyoText)
    Transform.create(this.yoyoText, {
      position: Vector3.create(49.94, 4.5, 50.45),
      scale: Vector3.create(1.0, 1.0, 1.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0)
    })
    TextShape.getMutable(this.yoyoText).fontSize = 6
    TextShape.getMutable(this.yoyoText).textColor = Color4.White()
    TextShape.getMutable(this.yoyoText).text = 'YoYo'

    // SOCIAL PORTAL

    Transform.createOrReplace(this.socialPortal, {
      position: Vector3.create(10.23, 1.99, 31.84),
      scale: Vector3.create(3.0, 7.0, 6.0),
      rotation: Quaternion.create(0.0, 0.0, 0.0)
    })
    MeshRenderer.setBox(this.socialPortal)
    Material.setPbrMaterial(this.socialPortal, {
      albedoColor: Color4.create(0, 0, 0, 0)
    })
    utils.triggers.addTrigger(
      this.socialPortal,
      1,
      1,
      [{ type: 'box', scale: Vector3.create(3, 9, 10) }],
      () => {
        instance.setInstance('recharge')
        // cleanUpScene()
        utils.timers.setTimeout(() => {
          this.gameController.realmController.switchRealm('recharge')
          void movePlayerTo({
            newRelativePosition: Vector3.create(48, 6.29, 32),
            cameraTarget: Vector3.create(48, 8.29, 32)
          })
          //   loader.showLoader(5000);
        }, 50)
      }
    )

    // SCRAPYARD PORTAL

    Transform.createOrReplace(this.scrapYardPortal, {
      position: Vector3.create(88.29, 2.0, 31.26),
      scale: Vector3.create(2.2, 8.0, 7.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 0.0, 0.0)
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
        instance.setInstance('scrapyard')
        void movePlayerTo({
          newRelativePosition: Vector3.create(31.38, 1.55, 47)
        })
        this.gameController.realmController.switchRealm('scrapyard')
        utils.timers.setTimeout(() => {
          // loader.showLoader(7000);
        }, 50)
      }
    )

    const userData = await getUserData({})
    const publicKey = userData.data?.publicKey
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if ((BLACKLIST as any).includes(publicKey?.toLowerCase())) {
      cleanUpScene()
      return
    }

    // FUEL Purchase Sign

    Transform.create(this.fuelPurchase, {
      position: Vector3.create(30.5, 9.2, 52.7),
      scale: Vector3.create(-15.0, -4.0, -1.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 315.0, 180.0)
    })
    MeshRenderer.setPlane(this.fuelPurchase)
    Material.setPbrMaterial(this.fuelPurchase, {
      texture: Material.Texture.Common({
        src: 'https://bafkreigsu33magq5tnyps5fjwcdxbwpyetrrdeowqz4mp2d6sgruvghz44.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafkreigsu33magq5tnyps5fjwcdxbwpyetrrdeowqz4mp2d6sgruvghz44.ipfs.nftstorage.link/'
      })
    })

    // T&C Poster

    Transform.create(this.termsAndCondPoster, {
      position: Vector3.create(64.2, 7.45, 56.68),
      scale: Vector3.create(-7.5, -7.5, -1.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 39.272, 180.0)
    })
    MeshRenderer.setPlane(this.termsAndCondPoster)
    MeshCollider.setPlane(this.termsAndCondPoster)
    Material.setPbrMaterial(this.termsAndCondPoster, {
      texture: Material.Texture.Common({
        src: 'https://bafkreihx7gxctg6oqoblairxd27qvycyug2ouza7trigycyxr6xxgenl4a.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafkreihx7gxctg6oqoblairxd27qvycyug2ouza7trigycyxr6xxgenl4a.ipfs.nftstorage.link/'
      })
    })
    PointerEvents.createOrReplace(this.termsAndCondPoster, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Join our Discord!'
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.termsAndCondPoster
        )
      ) {
        missions.checkAndUnlockCampaignMission('discord')
        void openExternalUrl({
          url: 'https://discord.gg/vk4kcpkgre'
        })
      }
    })

    // FUEL Infographic

    Transform.create(this.fuelInfoPoster, {
      position: Vector3.create(47.66, 2.8, 49.54),
      scale: Vector3.create(-4.6, -4.6, -3.6),
      rotation: Quaternion.fromEulerDegrees(0.0, 179.998, 180.0)
    })
    MeshRenderer.setPlane(this.fuelInfoPoster)
    Material.setPbrMaterial(this.fuelInfoPoster, {
      texture: Material.Texture.Common({
        src: 'https://bafybeibgpc27qayhrp6rnibpqdmbxa3cujflglogwfv53lvm2twt5hpqri.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      transparencyMode: 2,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafybeibgpc27qayhrp6rnibpqdmbxa3cujflglogwfv53lvm2twt5hpqri.ipfs.nftstorage.link/'
      })
    })
    PointerEvents.createOrReplace(this.fuelInfoPoster, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Watch a video tutorial!'
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.termsAndCondPoster
        )
      ) {
        missions.checkAndUnlockCampaignMission('discord')
        void openExternalUrl({
          url: 'https://vimeo.com/762813555/71d29cedd5'
        })
      }
    })

    // Solo Sprint Sign

    Transform.create(this.soloSprintSign, {
      position: Vector3.create(64, 5.25, 9.54),
      scale: Vector3.create(-8.75, -8.75, -8.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 135.0, 180.0)
    })
    MeshRenderer.setPlane(this.soloSprintSign)
    Material.setPbrMaterial(this.soloSprintSign, {
      texture: Material.Texture.Common({
        src: 'https://bafkreidz7jasew2mjigvh2ja2jm7gd5js6s7mqj5daogwsuerhvrilqmbu.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.Red(),
      emissiveIntensity: 3,
      transparencyMode: 2,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafkreidz7jasew2mjigvh2ja2jm7gd5js6s7mqj5daogwsuerhvrilqmbu.ipfs.nftstorage.link/'
      })
    })

    // Drag Race Sign

    Transform.create(this.dragRaceSign, {
      position: Vector3.create(45.31, 6, 5.92),
      scale: Vector3.create(-8.75, -8.75, -8.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 180.0)
    })
    MeshRenderer.setPlane(this.dragRaceSign)
    Material.setPbrMaterial(this.dragRaceSign, {
      texture: Material.Texture.Common({
        src: 'https://bafkreid5gmydkzhkyazy5l6uj5frrwdzicwo6igyeypcktaicraqr4ftk4.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 2,
      transparencyMode: 2,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafkreid5gmydkzhkyazy5l6uj5frrwdzicwo6igyeypcktaicraqr4ftk4.ipfs.nftstorage.link/'
      })
    })

    // Fuego Circuits Sign

    Transform.create(this.fuegoCircuitsSign, {
      position: Vector3.create(53.16, 6, 5.72),
      scale: Vector3.create(-8.75, -8.75, -8.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 180.0)
    })
    MeshRenderer.setPlane(this.fuegoCircuitsSign)
    Material.setPbrMaterial(this.fuegoCircuitsSign, {
      texture: Material.Texture.Common({
        src: 'https://bafkreigehlbdsuxzcljwbps4kzip4qm3suiu36rtinwwdo34ylawkh5pme.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 3,
      transparencyMode: 2,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafkreigehlbdsuxzcljwbps4kzip4qm3suiu36rtinwwdo34ylawkh5pme.ipfs.nftstorage.link/'
      })
    })

    // Scrapyard Sign

    Transform.create(this.scrapyardSign, {
      position: Vector3.create(89.08, 12.65, 31.43),
      scale: Vector3.create(-12.75, -12.75, -12.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 101.0, 180.0)
    })
    MeshRenderer.setPlane(this.scrapyardSign)
    Material.setPbrMaterial(this.scrapyardSign, {
      texture: Material.Texture.Common({
        src: 'assets/images/scrapyard_sign.png'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 3,
      transparencyMode: 2,
      emissiveTexture: Material.Texture.Common({
        src: 'assets/images/scrapyard_sign.png'
      })
    })

    // Recharge Sign

    Transform.create(this.rechargeSign, {
      position: Vector3.create(9.58, 12.65, 32.43),
      scale: Vector3.create(-12.75, -12.75, -12.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 267.0, 180.0)
    })
    MeshRenderer.setPlane(this.rechargeSign)
    Material.setPbrMaterial(this.rechargeSign, {
      texture: Material.Texture.Common({
        src: 'assets/images/recharge_sign.png'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 3,
      transparencyMode: 2,
      emissiveTexture: Material.Texture.Common({
        src: 'assets/images/recharge_sign.png'
      })
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.tulio = npc.create(
      {
        position: Vector3.create(63.92, 0.0, 17.92),
        scale: Vector3.create(1.25, 1.25, 1.25),
        rotation: Quaternion.fromEulerDegrees(0.0, 314.715, 0.0)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/npcs/tulioNPC.glb',
        onActivate: () => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          missions.getCurrentMissionName() === 'visitRacehub'
            ? npc.openDialogWindow(this.tulio, TulioDialog1, 0)
            : null
        },
        idleAnim: `idle`,
        faceUser: true,
        darkUI: true,
        coolDownDuration: 3,
        hoverText:
          missions.getCurrentMissionName() === 'visitRacehub'
            ? 'Talk to Tulio'
            : '',
        onlyClickTrigger: true,
        onlyExternalTrigger: false,
        reactDistance: 3,
        continueOnWalkAway: false
      }
    )

    TextShape.create(this.tulioText)
    Transform.create(this.tulioText, {
      position: Vector3.create(63.92, 2.9, 17.92),
      scale: Vector3.create(1.0, 1.0, 1.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 135.0, 0.0)
    })
    TextShape.getMutable(this.tulioText).fontSize = 6
    TextShape.getMutable(this.tulioText).textColor = Color4.White()
    TextShape.getMutable(this.tulioText).text = 'Tulio'

    // Assid Mary Poster

    Transform.create(this.aMaryPosterText, {
      position: Vector3.create(72.14, 9.0, 15.58),
      scale: Vector3.create(8.5, 13.0, 4.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 135.0, 0.0)
    })
    MeshRenderer.setPlane(this.aMaryPosterText)
    Material.setPbrMaterial(this.aMaryPosterText, {
      texture: Material.Texture.Common({
        src: 'https://i.ibb.co/WFcb0hK/Cinematic-Assid-Mary.png'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 3,
      emissiveTexture: Material.Texture.Common({
        src: 'https://i.ibb.co/WFcb0hK/Cinematic-Assid-Mary.png'
      })
    })

    // Krystal Koin Poster

    Transform.create(this.kKoinPosterText, {
      position: Vector3.create(21.6, 9.0, 46.1),
      scale: Vector3.create(8.5, 13.0, 4.0),
      rotation: Quaternion.fromEulerDegrees(360.0, 305.0, 0.0)
    })
    MeshRenderer.setPlane(this.kKoinPosterText)
    Material.setPbrMaterial(this.kKoinPosterText, {
      texture: Material.Texture.Common({
        src: 'https://i.ibb.co/7C8f963/Cinematic-Krystal-Koin.png'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 2,
      emissiveTexture: Material.Texture.Common({
        src: 'https://i.ibb.co/7C8f963/Cinematic-Krystal-Koin.png'
      })
    })

    // Power Up Sign

    Transform.create(this.puSign, {
      position: Vector3.create(72.15, 1.85, 44.0),
      scale: Vector3.create(-3.75, -3.75, -13.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 55.0, 180.0)
    })
    MeshRenderer.setPlane(this.puSign)
    Material.setPbrMaterial(this.puSign, {
      texture: Material.Texture.Common({
        src: 'https://bafybeibyecasmxnmhfo5va7zaam6h4c6if7enmxevwq7ufebpqoivksi3i.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      transparencyMode: 2,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafybeibyecasmxnmhfo5va7zaam6h4c6if7enmxevwq7ufebpqoivksi3i.ipfs.nftstorage.link/'
      })
    })

    // Season Winner 1

    Transform.create(this.seasonWinner1, {
      position: Vector3.create(48.05, 44.55, 18.8),
      scale: Vector3.create(-5.75, -9.75, -13.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 180.0)
    })
    MeshRenderer.setPlane(this.seasonWinner1)
    Material.setPbrMaterial(this.seasonWinner1, {
      texture: Material.Texture.Common({
        src: 'https://bafybeics5wprng67ifpdl7qdtglrhw2ddid74maq6au6tbfoi7r26bz2za.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      transparencyMode: 2,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafybeics5wprng67ifpdl7qdtglrhw2ddid74maq6au6tbfoi7r26bz2za.ipfs.nftstorage.link/'
      })
    })

    // Season Winner 2

    Transform.create(this.seasonWinner2, {
      position: Vector3.create(42.25, 44.55, 20.1),
      scale: Vector3.create(-5.75, -9.75, -13.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 205.0, 180.0)
    })
    MeshRenderer.setPlane(this.seasonWinner2)
    Material.setPbrMaterial(this.seasonWinner2, {
      texture: Material.Texture.Common({
        src: 'https://bafybeic7nmnqrekwpuavwowxdrayznkpakp3bn5os22hxcv7zqd45wacbe.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      transparencyMode: 2,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafybeic7nmnqrekwpuavwowxdrayznkpakp3bn5os22hxcv7zqd45wacbe.ipfs.nftstorage.link/'
      })
    })

    // Season Winner 3

    Transform.create(this.seasonWinner3, {
      position: Vector3.create(37.35, 44.55, 23.9),
      scale: Vector3.create(-5.75, -9.75, -13.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 230.0, 180.0)
    })
    MeshRenderer.setPlane(this.seasonWinner3)
    Material.setPbrMaterial(this.seasonWinner3, {
      texture: Material.Texture.Common({
        src: 'https://bafkreifosg5m4udqza65h443bp4ibdnkehuniw7srlpnqa3biykrrddtre.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      transparencyMode: 2,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafkreifosg5m4udqza65h443bp4ibdnkehuniw7srlpnqa3biykrrddtre.ipfs.nftstorage.link/'
      })
    })

    // Season Winner 4

    Transform.create(this.seasonWinner4, {
      position: Vector3.create(34.45, 44.55, 29.5),
      scale: Vector3.create(-5.75, -9.75, -13.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 255.0, 180.0)
    })
    MeshRenderer.setPlane(this.seasonWinner4)
    Material.setPbrMaterial(this.seasonWinner4, {
      texture: Material.Texture.Common({
        src: 'https://bafybeibfbnhxd5i3arfoemdk3fn2w6faqe6wn7yki7iliv42dxkxjy4cby.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      transparencyMode: 2,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafybeibfbnhxd5i3arfoemdk3fn2w6faqe6wn7yki7iliv42dxkxjy4cby.ipfs.nftstorage.link/'
      })
    })

    // Season Winner 5

    Transform.create(this.seasonWinner5, {
      position: Vector3.create(34.35, 44.55, 35.8),
      scale: Vector3.create(-5.75, -9.75, -13.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 283.0, 180.0)
    })
    MeshRenderer.setPlane(this.seasonWinner5)
    Material.setPbrMaterial(this.seasonWinner5, {
      texture: Material.Texture.Common({
        src: 'https://bafybeifchhwy2umyprwvdrkoljpnan4l3cavtyvspxtd73yrqfidgsouiq.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      transparencyMode: 2,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafybeifchhwy2umyprwvdrkoljpnan4l3cavtyvspxtd73yrqfidgsouiq.ipfs.nftstorage.link/'
      })
    })

    // Hyperfy Portal Sign

    Transform.create(this.hyperfy, {
      position: Vector3.create(56.85, 1.85, 58.2),
      scale: Vector3.create(-3.75, -3.75, -13.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 25.0, 180.0)
    })
    MeshRenderer.setPlane(this.hyperfy)
    MeshCollider.setPlane(this.hyperfy)
    Material.setPbrMaterial(this.hyperfy, {
      texture: Material.Texture.Common({
        src: 'https://bafkreig6idrtcsdf5dzkrbfekrh2iagwmii42ocpqyeb5h23qq3tcu7ifa.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 2,
      transparencyMode: 2,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafkreig6idrtcsdf5dzkrbfekrh2iagwmii42ocpqyeb5h23qq3tcu7ifa.ipfs.nftstorage.link/'
      })
    })
    PointerEvents.createOrReplace(this.hyperfy, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Visit our Hyperfy World!'
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.hyperfy
        )
      ) {
        void openExternalUrl({
          url: 'https://hyperfy.io/vroomway'
        })
        missions.checkAndUnlockCampaignMission('visitHyperfy')
      }
    })

    // Drag Race How to Play

    Transform.create(this.howToPlay1, {
      position: Vector3.create(43.15, 2.25, 7.8),
      scale: Vector3.create(-2.75, -1.75, -13.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 225.0, 180.0)
    })
    MeshRenderer.setPlane(this.howToPlay1)
    Material.setPbrMaterial(this.howToPlay1, {
      texture: Material.Texture.Common({
        src: 'https://bafkreieofeo7vuexnhhb5o2sg4ak6zytk6geslh5cyszdxgx4lmt6fzkki.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      transparencyMode: 2,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafkreieofeo7vuexnhhb5o2sg4ak6zytk6geslh5cyszdxgx4lmt6fzkki.ipfs.nftstorage.link/'
      })
    })
    // Fuego Circuits How to Play

    Transform.create(this.howToPlay2, {
      position: Vector3.create(56.15, 2.25, 7.8),
      scale: Vector3.create(-2.75, -1.75, -13.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 160.0, 180.0)
    })
    MeshRenderer.setPlane(this.howToPlay2)
    Material.setPbrMaterial(this.howToPlay2, {
      texture: Material.Texture.Common({
        src: 'https://bafkreih5k3sri5f67i2lvjfvp2t4nski5dqpebzngikgghexakybttxa2e.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      transparencyMode: 2,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafkreih5k3sri5f67i2lvjfvp2t4nski5dqpebzngikgghexakybttxa2e.ipfs.nftstorage.link/'
      })
    })
    // Solo-Sprint How to Play

    Transform.create(this.howToPlay3, {
      position: Vector3.create(64.15, 2.25, 13.8),
      scale: Vector3.create(-2.75, -1.75, -13.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 115.0, 180.0)
    })
    MeshRenderer.setPlane(this.howToPlay3)
    Material.setPbrMaterial(this.howToPlay3, {
      texture: Material.Texture.Common({
        src: 'https://bafkreihrxq2vrthpcphetyryy4erhlw7abffglh5tcxw3donf5pmw4flxm.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      transparencyMode: 2,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafkreihrxq2vrthpcphetyryy4erhlw7abffglh5tcxw3donf5pmw4flxm.ipfs.nftstorage.link/'
      })
    })
    // New Here board

    Transform.create(this.newHere, {
      position: Vector3.create(52.15, 2.25, 50.5),
      scale: Vector3.create(-2.75, -2.75, -13.0),
      rotation: Quaternion.fromEulerDegrees(360.0, 165.0, 180.0)
    })
    MeshRenderer.setPlane(this.newHere)
    Material.setPbrMaterial(this.newHere, {
      texture: Material.Texture.Common({
        src: 'https://bafkreigmzy4kbncu35ktvh47qox7bk4oae4h5e6gogwnsw5ss7druadtca.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      transparencyMode: 2,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafkreigmzy4kbncu35ktvh47qox7bk4oae4h5e6gogwnsw5ss7druadtca.ipfs.nftstorage.link/'
      })
    })

    // Tulio Title

    Transform.create(this.hofText, {
      position: Vector3.create(24.0, 2.0, 21.0),
      scale: Vector3.create(1.0, 1.0, 1.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 225.0, 0.0)
    })
    TextShape.create(this.hofText)
    TextShape.getMutable(this.hofText).fontSize = 6
    TextShape.getMutable(this.hofText).textColor = Color4.White()
    TextShape.getMutable(this.hofText).text = 'Visit Hall of Fame'

    MeshCollider.setBox(this.hofButton)
    Transform.create(this.hofButton, {
      position: Vector3.create(23.83, 1.35, 21),
      rotation: Quaternion.fromEulerDegrees(0, 90, 0),
      scale: Vector3.create(0.25, 0.25, 0.25)
    })

    MeshCollider.setBox(this.hofButton2)
    Transform.create(this.hofButton2, {
      position: Vector3.create(45.0, 40.95, 29.96),
      rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0),
      scale: Vector3.create(0.25, 0.25, 0.25)
    })
    PointerEvents.createOrReplace(this.hofButton, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Teleport Me'
          }
        }
      ]
    })
    PointerEvents.createOrReplace(this.hofButton2, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Teleport Me Back'
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.hofButton
        )
      ) {
        void movePlayerTo({ newRelativePosition: Vector3.create(47, 45, 32) })
      }
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.hofButton2
        )
      ) {
        void movePlayerTo({ newRelativePosition: Vector3.create(47, 5, 32) })
      }
    })
  }

  callSingleFunction(functionName: string, boolean: boolean): void {}

  spawnSingleEntity(entityName: string): void {}

  removeSingleEntity(entityName: string): void {}

  removeAllEntities(): void {
    this.assets.forEach((entity) => {
      entityController.removeEntity(entity)
    })
    entityController.removeEntity(this.parentRaceScores)
    entityController.removeEntity(this.yoyo)
    entityController.removeEntity(this.yoyoText)
    entityController.removeEntity(this.socialPortal)
    entityController.removeEntity(this.scrapYardPortal)
    entityController.removeEntity(this.fuelPurchase)
    entityController.removeEntity(this.termsAndCondPoster)
    entityController.removeEntity(this.fuelInfoPoster)
    entityController.removeEntity(this.soloSprintSign)
    entityController.removeEntity(this.dragRaceSign)
    entityController.removeEntity(this.fuegoCircuitsSign)
    entityController.removeEntity(this.scrapyardSign)
    entityController.removeEntity(this.rechargeSign)
    entityController.removeEntity(this.tulio)
    entityController.removeEntity(this.tulioText)
    entityController.removeEntity(this.aMaryPosterText)
    entityController.removeEntity(this.kKoinPosterText)
    entityController.removeEntity(this.puSign)
    entityController.removeEntity(this.seasonWinner1)
    entityController.removeEntity(this.seasonWinner2)
    entityController.removeEntity(this.seasonWinner3)
    entityController.removeEntity(this.seasonWinner4)
    entityController.removeEntity(this.seasonWinner5)
    entityController.removeEntity(this.seasonWinner6)
    entityController.removeEntity(this.seasonWinner7)
    entityController.removeEntity(this.seasonWinner8)
    entityController.removeEntity(this.seasonWinner9)
    entityController.removeEntity(this.seasonWinner10)
    entityController.removeEntity(this.seasonWinner11)
    entityController.removeEntity(this.seasonWinner12)
    entityController.removeEntity(this.seasonWinner13)
    entityController.removeEntity(this.seasonWinner14)
    entityController.removeEntity(this.seasonWinner15)
    entityController.removeEntity(this.seasonWinner16)
    entityController.removeEntity(this.seasonWinner17)
    entityController.removeEntity(this.seasonWinner18)
    entityController.removeEntity(this.seasonWinner19)
    entityController.removeEntity(this.seasonWinner20)
    entityController.removeEntity(this.hyperfy)
    entityController.removeEntity(this.howToPlay1)
    entityController.removeEntity(this.howToPlay2)
    entityController.removeEntity(this.howToPlay3)
    entityController.removeEntity(this.newHere)
    entityController.removeEntity(this.hofText)
    entityController.removeEntity(this.hofButton)
    entityController.removeEntity(this.hofButton2)
  }

  getId(): RealmType {
    return 'mainInstance'
  }

  deadPosition(): Vector3 {
    return { x: -38.34, y: 10.43, z: -39.75 }
  }
}
