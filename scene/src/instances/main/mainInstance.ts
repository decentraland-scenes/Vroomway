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
import * as npc from 'dcl-npc-toolkit'
import * as utils from '@dcl-sdk/utils'
import { movePlayerTo, openExternalUrl } from '~system/RestrictedActions'
import { getUserData } from '~system/UserIdentity'
import { PLAYER_SCORE_NAMES } from '../../player-scores/player-score-data'
import { ScoreboardDisplayObject } from '../../player-scores/scoreboard-display-object'
import { BLACKLIST } from '../../utils/constants'
import { instance } from '../../utils/currentInstance'

export const renderMainInstance = async (): Promise<void> => {
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
  // Player.updateUI();
  // PowerUpsInv.powerUpMgr.reset();

  // Constants.SCENE_MGR?.lobbyScene?.init();
  // Constants.SCENE_MGR?.lobbyScene?.show();
  const _scene = engine.addEntity()
  Transform.createOrReplace(_scene, {
    position: Vector3.create(96, 0, 64),
    rotation: Quaternion.create(0, 180, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })

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
  staticEntities.forEach((entity) => {
    const newEntity = engine.addEntity()
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
      PointerEvents.createOrReplace(newEntity, {
        pointerEvents: [
          {
            eventType: PointerEventType.PET_DOWN,
            eventInfo: {
              button: InputAction.IA_POINTER,
              showFeedback: true
            }
          }
        ]
      })
      engine.addSystem(() => {
        if (
          inputSystem.isTriggered(
            InputAction.IA_POINTER,
            PointerEventType.PET_DOWN,
            newEntity
          )
        ) {
          if (entity.includes('SS')) {
            if (instance.getInstance() !== 'main') return
            // if (Player.getFuel() < SOLO_SPRINT_COST) return renderOutOfFuel()
            // soloSprintBoard.show()
          }
          if (entity.includes('DD')) {
            if (instance.getInstance() !== 'main') return
            // if (Player.getFuel() >= DEMO_DERBY_COST) {
            //   demoDerbyBoard.show()
            // } else {
            //   return renderOutOfFuel()
            // }
          }
          if (entity.includes('FC')) {
            if (instance.getInstance() !== 'main') return
            // if (Player.getFuel() >= FUEGO_CIRCUIT_COST) {
            //   decentrallyBoard.show()
            // } else {
            //   return renderOutOfFuel()
            // }
          }
          if (entity.includes('DR')) {
            // if (instance.getInstance() !== 'main') return
            // if (Player.getFuel() >= DRAG_RACE_COST) {
            //   dragRaceBoard.show() //TODO
            // } else {
            //   return renderOutOfFuel()
            // }
          }
        }
      })
    }
  })
  //  race times scoreboard parent
  const parentRaceScores = engine.addEntity()
  Transform.createOrReplace(parentRaceScores, {
    position: Vector3.create(32.15, 9.3, 7.72),
    rotation: Quaternion.fromEulerDegrees(0, 225.0, 0)
  })
  //  solo sprint time
  const scoreboardSoloSprint = new ScoreboardDisplayObject(
    PLAYER_SCORE_NAMES.SPRINT_SOLO_TIME,
    Color4.Red(),
    Color4.White(),
    Color4.Red(),
    parentRaceScores
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
    parentRaceScores
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
    parentRaceScores
  )
  Transform.getMutable(scoreboardDragRace.entityParent).position =
    Vector3.create(11.1, 1.75, 0)
  scoreboardDragRace.UpdateScoreDisplay()

  let yoyo = engine.addEntity()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  yoyo = npc.create(
    {
      position: Vector3.create(49.94, 0.0, 50.45),
      scale: Vector3.create(2.0, 2.0, 2.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 335.0, 0.0)
    },
    {
      type: npc.NPCType.CUSTOM,
      model: 'assets/models/npcs/yoyoNPC.glb',
      onActivate: () => {
        // missions.getCurrentMissionName() === 'yoyo' ? yoyo.talk(YoYoDialog1, 0) : null
      },
      idleAnim: `idle`,
      faceUser: true,
      darkUI: true,
      coolDownDuration: 3,
      // hoverText: missions.getCurrentMissionName() === 'yoyo' ? 'Talk to YoYo' : null,
      onlyClickTrigger: true,
      onlyExternalTrigger: false,
      reactDistance: 3,
      continueOnWalkAway: false
    }
  )
  const yoyoText = engine.addEntity()
  TextShape.create(yoyoText)
  Transform.create(yoyoText, {
    position: Vector3.create(49.94, 4.5, 50.45),
    scale: Vector3.create(1.0, 1.0, 1.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0)
  })
  TextShape.getMutable(yoyoText).fontSize = 6
  TextShape.getMutable(yoyoText).textColor = Color4.White()
  TextShape.getMutable(yoyoText).text = 'YoYo'

  // SOCIAL PORTAL
  const socialPortal = engine.addEntity()
  Transform.createOrReplace(socialPortal, {
    position: Vector3.create(10.23, 1.99, 31.84),
    scale: Vector3.create(3.0, 7.0, 6.0),
    rotation: Quaternion.create(0.0, 0.0, 0.0)
  })
  MeshRenderer.setBox(socialPortal)
  Material.setPbrMaterial(socialPortal, {
    albedoColor: Color4.create(0, 0, 0, 0)
  })
  utils.triggers.addTrigger(
    socialPortal,
    1,
    1,
    [{ type: 'box', scale: Vector3.create(3, 9, 10) }],
    () => {
      console.log('enter zone')
      instance.setInstance('recharge')
      // cleanupScene();
      utils.timers.setTimeout(() => {
        //   renderRecharge();
        //   movePlayerTo({ x: 48, y: 6.29, z: 32 }, { x: 48, y: 8.29, z: 32 });
        //   loader.showLoader(5000);
      }, 50)
    }
  )

  // SCRAPYARD PORTAL
  const scrapYardPortal = engine.addEntity()
  Transform.createOrReplace(scrapYardPortal, {
    position: Vector3.create(88.29, 2.0, 31.26),
    scale: Vector3.create(2.2, 8.0, 7.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 0.0, 0.0)
  })
  MeshRenderer.setBox(scrapYardPortal)
  Material.setPbrMaterial(scrapYardPortal, {
    albedoColor: Color4.create(0, 0, 0, 0)
  })
  utils.triggers.addTrigger(
    scrapYardPortal,
    1,
    1,
    [{ type: 'box', scale: Vector3.create(3, 9, 10) }],
    () => {
      console.log('enter zone')
      instance.setInstance('scrapyard')
      // cleanupScene();
      utils.timers.setTimeout(() => {
        // renderScrapyard();
        // loader.showLoader(7000);
      }, 50)
    }
  )

  const userData = await getUserData({})
  const publicKey = userData.data?.publicKey
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if ((BLACKLIST as any).includes(publicKey?.toLowerCase())) {
    // return cleanupScene();
  }

  // FUEL Purchase Sign
  const fuelPurchase = engine.addEntity()
  Transform.create(fuelPurchase, {
    position: Vector3.create(30.5, 9.2, 52.7),
    scale: Vector3.create(-15.0, -4.0, -1.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 315.0, 180.0)
  })
  MeshRenderer.setPlane(fuelPurchase)
  Material.setPbrMaterial(fuelPurchase, {
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
  const termsAndCondPoster = engine.addEntity()
  Transform.create(termsAndCondPoster, {
    position: Vector3.create(64.2, 7.45, 56.68),
    scale: Vector3.create(-7.5, -7.5, -1.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 39.272, 180.0)
  })
  MeshRenderer.setPlane(termsAndCondPoster)
  MeshCollider.setPlane(termsAndCondPoster)
  Material.setPbrMaterial(termsAndCondPoster, {
    texture: Material.Texture.Common({
      src: 'https://bafkreihx7gxctg6oqoblairxd27qvycyug2ouza7trigycyxr6xxgenl4a.ipfs.nftstorage.link/'
    }),
    emissiveColor: Color4.White(),
    emissiveIntensity: 1,
    emissiveTexture: Material.Texture.Common({
      src: 'https://bafkreihx7gxctg6oqoblairxd27qvycyug2ouza7trigycyxr6xxgenl4a.ipfs.nftstorage.link/'
    })
  })
  PointerEvents.createOrReplace(termsAndCondPoster, {
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
        termsAndCondPoster
      )
    ) {
      // missions.checkAndUnlockCampaignMission("discord");
      void openExternalUrl({
        url: 'https://discord.gg/vk4kcpkgre'
      })
    }
  })

  // FUEL Infographic
  const fuelInfoPoster = engine.addEntity()
  Transform.create(fuelInfoPoster, {
    position: Vector3.create(47.66, 2.8, 49.54),
    scale: Vector3.create(-4.6, -4.6, -3.6),
    rotation: Quaternion.fromEulerDegrees(0.0, 179.998, 180.0)
  })
  MeshRenderer.setPlane(fuelInfoPoster)
  Material.setPbrMaterial(fuelInfoPoster, {
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
  PointerEvents.createOrReplace(fuelInfoPoster, {
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
        termsAndCondPoster
      )
    ) {
      // missions.checkAndUnlockCampaignMission("discord");
      void openExternalUrl({
        url: 'https://vimeo.com/762813555/71d29cedd5'
      })
    }
  })

  // Solo Sprint Sign
  const soloSprintSign = engine.addEntity()
  Transform.create(soloSprintSign, {
    position: Vector3.create(64, 5.25, 9.54),
    scale: Vector3.create(-8.75, -8.75, -8.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 135.0, 180.0)
  })
  MeshRenderer.setPlane(soloSprintSign)
  Material.setPbrMaterial(soloSprintSign, {
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

  // Solo Sprint Sign
  const dragRaceSign = engine.addEntity()
  Transform.create(dragRaceSign, {
    position: Vector3.create(45.31, 6, 5.92),
    scale: Vector3.create(-8.75, -8.75, -8.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 180.0)
  })
  MeshRenderer.setPlane(dragRaceSign)
  Material.setPbrMaterial(dragRaceSign, {
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
  const fuegoCircuitsSign = engine.addEntity()
  Transform.create(fuegoCircuitsSign, {
    position: Vector3.create(53.16, 6, 5.72),
    scale: Vector3.create(-8.75, -8.75, -8.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 180.0)
  })
  MeshRenderer.setPlane(fuegoCircuitsSign)
  Material.setPbrMaterial(fuegoCircuitsSign, {
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
  const scrapyardSign = engine.addEntity()
  Transform.create(scrapyardSign, {
    position: Vector3.create(89.08, 12.65, 31.43),
    scale: Vector3.create(-12.75, -12.75, -12.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 101.0, 180.0)
  })
  MeshRenderer.setPlane(scrapyardSign)
  Material.setPbrMaterial(scrapyardSign, {
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
  const rechargeSign = engine.addEntity()
  Transform.create(rechargeSign, {
    position: Vector3.create(9.58, 12.65, 32.43),
    scale: Vector3.create(-12.75, -12.75, -12.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 267.0, 180.0)
  })
  MeshRenderer.setPlane(rechargeSign)
  Material.setPbrMaterial(rechargeSign, {
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

  let tulio = engine.addEntity()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tulio = npc.create(
    {
      position: Vector3.create(63.92, 0.0, 17.92),
      scale: Vector3.create(1.25, 1.25, 1.25),
      rotation: Quaternion.fromEulerDegrees(0.0, 314.715, 0.0)
    },
    {
      type: npc.NPCType.CUSTOM,
      model: 'assets/models/npcs/tulioNPC.glb',
      onActivate: () => {
        // missions.getCurrentMissionName() === "visitRacehub" ? tulio.talk(TulioDialog1, 0) : null;
      },
      idleAnim: `idle`,
      faceUser: true,
      darkUI: true,
      coolDownDuration: 3,
      // hoverText: missions.getCurrentMissionName() === "visitRacehub" ? "Talk to Tulio" : null,
      onlyClickTrigger: true,
      onlyExternalTrigger: false,
      reactDistance: 3,
      continueOnWalkAway: false
    }
  )
  const tulioText = engine.addEntity()
  TextShape.create(tulioText)
  Transform.create(tulioText, {
    position: Vector3.create(63.92, 2.9, 17.92),
    scale: Vector3.create(1.0, 1.0, 1.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 135.0, 0.0)
  })
  TextShape.getMutable(tulioText).fontSize = 6
  TextShape.getMutable(tulioText).textColor = Color4.White()
  TextShape.getMutable(tulioText).text = 'Tulio'

  // Assid Mary Poster
  const aMaryPosterText = engine.addEntity()
  Transform.create(aMaryPosterText, {
    position: Vector3.create(72.14, 9.0, 15.58),
    scale: Vector3.create(8.5, 13.0, 4.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 135.0, 0.0)
  })
  MeshRenderer.setPlane(aMaryPosterText)
  Material.setPbrMaterial(aMaryPosterText, {
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
  const kKoinPosterText = engine.addEntity()
  Transform.create(kKoinPosterText, {
    position: Vector3.create(21.6, 9.0, 46.1),
    scale: Vector3.create(8.5, 13.0, 4.0),
    rotation: Quaternion.fromEulerDegrees(360.0, 305.0, 0.0)
  })
  MeshRenderer.setPlane(kKoinPosterText)
  Material.setPbrMaterial(kKoinPosterText, {
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
  const puSign = engine.addEntity()
  Transform.create(puSign, {
    position: Vector3.create(72.15, 1.85, 44.0),
    scale: Vector3.create(-3.75, -3.75, -13.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 55.0, 180.0)
  })
  MeshRenderer.setPlane(puSign)
  Material.setPbrMaterial(puSign, {
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
  const seasonWinner1 = engine.addEntity()
  Transform.create(seasonWinner1, {
    position: Vector3.create(48.05, 44.55, 18.8),
    scale: Vector3.create(-5.75, -9.75, -13.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0)
  })
  MeshRenderer.setPlane(seasonWinner1)
  Material.setPbrMaterial(seasonWinner1, {
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
  const seasonWinner2 = engine.addEntity()
  Transform.create(seasonWinner2, {
    position: Vector3.create(42.25, 44.55, 20.1),
    scale: Vector3.create(-5.75, -9.75, -13.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 205.0, 0.0)
  })
  MeshRenderer.setPlane(seasonWinner2)
  Material.setPbrMaterial(seasonWinner2, {
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
  const seasonWinner3 = engine.addEntity()
  Transform.create(seasonWinner3, {
    position: Vector3.create(37.35, 44.55, 23.9),
    scale: Vector3.create(-5.75, -9.75, -13.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 230.0, 0.0)
  })
  MeshRenderer.setPlane(seasonWinner3)
  Material.setPbrMaterial(seasonWinner3, {
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
  const seasonWinner4 = engine.addEntity()
  Transform.create(seasonWinner4, {
    position: Vector3.create(37.35, 44.55, 23.9),
    scale: Vector3.create(-5.75, -9.75, -13.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 230.0, 0.0)
  })
  MeshRenderer.setPlane(seasonWinner4)
  Material.setPbrMaterial(seasonWinner4, {
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
  const seasonWinner5 = engine.addEntity()
  Transform.create(seasonWinner5, {
    position: Vector3.create(34.35, 44.55, 35.8),
    scale: Vector3.create(-5.75, -9.75, -13.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 283.0, 0.0)
  })
  MeshRenderer.setPlane(seasonWinner5)
  Material.setPbrMaterial(seasonWinner5, {
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
  const hyperfy = engine.addEntity()
  Transform.create(hyperfy, {
    position: Vector3.create(56.85, 1.85, 58.2),
    scale: Vector3.create(-3.75, -3.75, -13.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 25.0, 180.0)
  })
  MeshRenderer.setPlane(hyperfy)
  MeshCollider.setPlane(hyperfy)
  Material.setPbrMaterial(hyperfy, {
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
  PointerEvents.createOrReplace(hyperfy, {
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
        hyperfy
      )
    ) {
      void openExternalUrl({
        url: 'https://hyperfy.io/vroomway'
        //  missions.checkAndUnlockCampaignMission("visitHyperfy");
      })
    }
  })

  // Drag Race How to Play
  const howToPlay1 = engine.addEntity()
  Transform.create(howToPlay1, {
    position: Vector3.create(43.15, 2.25, 7.8),
    scale: Vector3.create(-2.75, -1.75, -13.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 225.0, 180.0)
  })
  MeshRenderer.setPlane(howToPlay1)
  Material.setPbrMaterial(howToPlay1, {
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
  const howToPlay2 = engine.addEntity()
  Transform.create(howToPlay2, {
    position: Vector3.create(56.15, 2.25, 7.8),
    scale: Vector3.create(-2.75, -1.75, -13.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 160.0, 180.0)
  })
  MeshRenderer.setPlane(howToPlay2)
  Material.setPbrMaterial(howToPlay2, {
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
  const howToPlay3 = engine.addEntity()
  Transform.create(howToPlay3, {
    position: Vector3.create(64.15, 2.25, 13.8),
    scale: Vector3.create(-2.75, -1.75, -13.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 115.0, 0.0)
  })
  MeshRenderer.setPlane(howToPlay3)
  Material.setPbrMaterial(howToPlay3, {
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
  const newHere = engine.addEntity()
  Transform.create(newHere, {
    position: Vector3.create(52.15, 2.25, 50.5),
    scale: Vector3.create(-2.75, -2.75, -13.0),
    rotation: Quaternion.fromEulerDegrees(360.0, 165.0, 180.0)
  })
  MeshRenderer.setPlane(newHere)
  Material.setPbrMaterial(newHere, {
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
  const hofText = engine.addEntity()
  Transform.create(hofText, {
    position: Vector3.create(24.0, 2.0, 21.0),
    scale: Vector3.create(1.0, 1.0, 1.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 225.0, 0.0)
  })
  TextShape.create(hofText)
  TextShape.getMutable(hofText).fontSize = 6
  TextShape.getMutable(hofText).textColor = Color4.White()
  TextShape.getMutable(hofText).text = 'Visit Hall of Fame'

  const hofButton = engine.addEntity()
  MeshCollider.setBox(hofButton)
  Transform.create(hofButton, {
    position: Vector3.create(23.83, 1.35, 21),
    rotation: Quaternion.fromEulerDegrees(0, 90, 0),
    scale: Vector3.create(0.25, 0.25, 0.25)
  })
  const hofButton2 = engine.addEntity()
  MeshCollider.setBox(hofButton2)
  Transform.create(hofButton2, {
    position: Vector3.create(45.0, 40.95, 29.96),
    rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0),
    scale: Vector3.create(0.25, 0.25, 0.25)
  })
  PointerEvents.createOrReplace(hofButton, {
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
  PointerEvents.createOrReplace(hofButton2, {
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
        hofButton
      )
    ) {
      void movePlayerTo({ newRelativePosition: Vector3.create(47, 45, 32) })
    }
    if (
      inputSystem.isTriggered(
        InputAction.IA_POINTER,
        PointerEventType.PET_DOWN,
        hofButton2
      )
    ) {
      void movePlayerTo({ newRelativePosition: Vector3.create(47, 5, 32) })
    }
  })
}
