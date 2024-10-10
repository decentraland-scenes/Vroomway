import {
  engine,
  Transform,
  TextShape,
  Material,
  GltfContainer,
  MeshRenderer,
  InputAction,
  PointerEventType,
  PointerEvents,
  inputSystem,
  MeshCollider,
  AvatarAttach,
  AvatarAnchorPointType,
  type Entity
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { movePlayerTo, openExternalUrl } from '~system/RestrictedActions'
import * as npc from 'dcl-npc-toolkit'
import { missions } from '../../utils/missions'
import { getUserData } from '~system/UserIdentity'
import { crystals } from '../../crystals'
import { type GameController } from '../../controllers/game.controller'
import { entityController } from '../../utils/entityController'
import { type RealmType } from '../types'
import * as utils from '@dcl-sdk/utils'
import { instance } from '../../utils/currentInstance'
import { BarrelHandler } from './rummaging'

// initVWRegistry();
export class Scrapyard {
  gameController: GameController
  assets: string[]
  assets_entities: Entity[]
  assidMary = entityController.addEntity()
  assidMaryText = entityController.addEntity()
  cube = entityController.addEntity()
  adPosterObj = entityController.addEntity()
  vwPosterObj = entityController.addEntity()
  communityPosterObj = entityController.addEntity()
  vwBannerObj = entityController.addEntity()
  claimBootsObj = entityController.addEntity()
  gweiWarning1Obj = entityController.addEntity()
  claimBikesObj = entityController.addEntity()
  gweiWarning2Obj = entityController.addEntity()
  claimCarsObj = entityController.addEntity()
  gweiWarning3Obj = entityController.addEntity()
  claimBrutesObj = entityController.addEntity()
  gweiWarning4Obj = entityController.addEntity()
  claimMythicObj = entityController.addEntity()
  claimCargoObj = entityController.addEntity()
  claimMachine1Obj = entityController.addEntity()
  claimMachine2Obj = entityController.addEntity()
  claimMachine3Obj = entityController.addEntity()
  claimMachine4Obj = entityController.addEntity()
  claimMachine5Obj = entityController.addEntity()
  speedBootClaimBox = entityController.addEntity()
  hoverBikeClaimBox = entityController.addEntity()
  hoverCarClaimBox = entityController.addEntity()
  bruteClaimBox = entityController.addEntity()
  mythicClaimBox = entityController.addEntity()
  gweiWarning5Obj = entityController.addEntity()
  _scene: Entity = entityController.addEntity()
  barrelHandler: BarrelHandler
  public mainPortal = entityController.addEntity()
  constructor(gameController: GameController) {
    this.gameController = gameController
    this.barrelHandler = new BarrelHandler(11, this.gameController)
    this.assets = [
      'scrapyard/scrapyardStatic.gltf',
      'scrapyard/carousel.gltf',
      'scrapyard/fan1.gltf',
      'scrapyard/fan2.gltf',
      'scrapyard/claimMachine.gltf',
      'scrapyard/craftingTable.gltf',
      'scrapyard/redPortal.glb',
      'scrapyard/mythicClaimMachine.glb'
    ]
    this.assets_entities = []
    void this.renderScrapyard()
  }

  renderScrapyard = async (): Promise<void> => {
    missions.checkAndUnlockCampaignMission('scrapyard')
    for (const [index, asset] of (this.assets as any).entries()) {
      const entity = entityController.addEntity()
      this.assets_entities.push(entity)
      Transform.create(entity)
      GltfContainer.create(entity, { src: `assets/models/${asset}` })
      if (index === 7) {
        const entityBox = entityController.addEntity()
        Transform.createOrReplace(entityBox, {
          position: Vector3.create(60, 2.26, 31.53),
          scale: Vector3.create(3, 9, 4)
        })
        // VW_REGISTRY.triggerBox.rechargeMainTriggerBox(entityBox);
      }
    }
    this.assidMary = npc.create(
      {
        position: Vector3.create(22.97, 0, 29.03),
        rotation: Quaternion.fromEulerDegrees(0, 0, 0)
      },
      {
        type: npc.NPCType.CUSTOM,
        model: 'assets/models/npcs/assidmaryNPC.glb',
        onActivate: () => {
          //             missions.getCurrentMissionName() === "assidMary"
          // ? assidMary.(AssidMaryDialog1, 0)
          // : cargoClaim.toggleCargoClaim();
        },
        idleAnim: `idle`,
        faceUser: true,
        darkUI: true,
        coolDownDuration: 3,
        hoverText:
          missions.getCurrentMissionName() === 'assidMary'
            ? 'Talk to Assid Mary'
            : 'Claim crates',
        onlyClickTrigger: true,
        onlyExternalTrigger: false,
        reactDistance: 3,
        continueOnWalkAway: false
      }
    )
    // Assid Mary Title
    TextShape.create(this.assidMaryText)
    Transform.create(this.assidMaryText, {
      position: Vector3.create(22.9, 2.9, 29.0),
      scale: Vector3.create(0.5, 0.6, 1.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0)
    })
    TextShape.getMutable(this.assidMaryText).fontSize = 6
    TextShape.getMutable(this.assidMaryText).textColor = Color4.White()
    TextShape.getMutable(this.assidMaryText).text = 'Assid Mary'

    // set barrel parent and attempt to place all barrels
    // VW_REGISTRY.triggerBox.mainTriggerBox(box, BarrelHandler.Instance);
    this.barrelHandler.SetParent(this._scene)
    this.barrelHandler.PlaceAllBarrels()
    // MUSIC TRACK
    const publicKey = await getUserData({})
    AvatarAttach.createOrReplace(this.cube, {
      avatarId: publicKey.data?.userId,
      anchorPointId: AvatarAnchorPointType.AAPT_NAME_TAG
    })

    // atlasAnalytics.updateBranchName("Scrapyard");

    // Ad Poster
    Transform.create(this.adPosterObj, {
      position: Vector3.create(63.05, 34.5, 35.8),
      scale: Vector3.create(23.5, 23.5, 13.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0)
    })
    MeshRenderer.setPlane(this.adPosterObj)
    Material.setPbrMaterial(this.adPosterObj, {
      texture: Material.Texture.Common({
        src: 'https://i.ibb.co/XXtR5Cz/billboard-sign.png'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://i.ibb.co/XXtR5Cz/billboard-sign.png'
      })
    })
    // VW SB Poster

    Transform.create(this.vwPosterObj, {
      position: Vector3.create(14.05, 17.5, 63.8),
      scale: Vector3.create(11.5, 23.5, 13.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 360.0, 0.0)
    })
    MeshRenderer.setPlane(this.vwPosterObj)
    Material.setPbrMaterial(this.vwPosterObj, {
      texture: Material.Texture.Common({
        src: 'https://i.ibb.co/Gt0NpqG/Cinematic-Speed-Boots-Poster.png'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://i.ibb.co/Gt0NpqG/Cinematic-Speed-Boots-Poster.png'
      })
    })
    // Social Poster

    Transform.create(this.communityPosterObj, {
      position: Vector3.create(0.15, 17.5, 50.8),
      scale: Vector3.create(11.5, 11.5, 13.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
    })
    MeshRenderer.setPlane(this.communityPosterObj)
    Material.setPbrMaterial(this.communityPosterObj, {
      texture: Material.Texture.Common({
        src: 'https://i.ibb.co/qnKVzP5/Jayking.png'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://i.ibb.co/qnKVzP5/Jayking.png'
      })
    })
    // Vroomway Banner

    Transform.create(this.vwBannerObj, {
      position: Vector3.create(31.05, 49.0, 0.8),
      scale: Vector3.create(33.5, 11.5, 35.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0)
    })
    MeshRenderer.setPlane(this.vwBannerObj)
    Material.setPbrMaterial(this.vwBannerObj, {
      texture: Material.Texture.Common({
        src: 'https://i.ibb.co/FKkS6C3/Vroomway-Logo-White-2.png'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://i.ibb.co/FKkS6C3/Vroomway-Logo-White-2.png'
      }),
      transparencyMode: 2
    })
    // Claim Boots

    Transform.create(this.claimBootsObj, {
      position: Vector3.create(7.05, 4.0, 10.8),
      scale: Vector3.create(4.5, 5.5, 31.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
    })
    MeshRenderer.setPlane(this.claimBootsObj)
    Material.setPbrMaterial(this.claimBootsObj, {
      texture: Material.Texture.Common({
        src: 'https://i.ibb.co/LhmpZzf/speed-boots-sign.png'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://i.ibb.co/LhmpZzf/speed-boots-sign.png'
      }),
      transparencyMode: 2
    })

    // GWEI warning1

    Transform.create(this.gweiWarning1Obj, {
      position: Vector3.create(7.08, 1.3, 9.26),
      scale: Vector3.create(1.3, 1.3, 26.3),
      rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
    })
    MeshRenderer.setPlane(this.gweiWarning1Obj)
    MeshCollider.setPlane(this.gweiWarning1Obj)
    Material.setPbrMaterial(this.gweiWarning1Obj, {
      texture: Material.Texture.Common({
        src: 'https://bafkreidbag7swhrqwuawtfsag4ou4hqak4gd2f5gx24imkjtwfyed7brim.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafkreidbag7swhrqwuawtfsag4ou4hqak4gd2f5gx24imkjtwfyed7brim.ipfs.nftstorage.link/'
      }),
      transparencyMode: 2
    })
    PointerEvents.createOrReplace(this.gweiWarning1Obj, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Check Polygon GWEI'
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.gweiWarning1Obj
        )
      ) {
        console.log('polygon gwei')
        void openExternalUrl({
          url: 'https://polygonscan.com/gastracker/'
        })
      }
    })
    // Claim Bikes

    Transform.create(this.claimBikesObj, {
      position: Vector3.create(7.05, 4.0, 17.1),
      scale: Vector3.create(4.5, 5.5, 31.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
    })
    MeshRenderer.setPlane(this.claimBikesObj)
    Material.setPbrMaterial(this.claimBikesObj, {
      texture: Material.Texture.Common({
        src: 'https://i.ibb.co/xsbx6Th/hover-bike-sign.png'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://i.ibb.co/xsbx6Th/hover-bike-sign.png'
      }),
      transparencyMode: 2
    })
    // GWEI warning2

    Transform.create(this.gweiWarning2Obj, {
      position: Vector3.create(7.08, 1.3, 15.61),
      scale: Vector3.create(1.3, 1.3, 26.3),
      rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
    })
    MeshRenderer.setPlane(this.gweiWarning2Obj)
    MeshCollider.setPlane(this.gweiWarning2Obj)
    Material.setPbrMaterial(this.gweiWarning2Obj, {
      texture: Material.Texture.Common({
        src: 'https://bafkreidbag7swhrqwuawtfsag4ou4hqak4gd2f5gx24imkjtwfyed7brim.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafkreidbag7swhrqwuawtfsag4ou4hqak4gd2f5gx24imkjtwfyed7brim.ipfs.nftstorage.link/'
      }),
      transparencyMode: 2
    })
    PointerEvents.createOrReplace(this.gweiWarning2Obj, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Check Polygon GWEI'
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.gweiWarning2Obj
        )
      ) {
        void openExternalUrl({
          url: 'https://polygonscan.com/gastracker/'
        })
      }
    })
    // Claim Cars

    Transform.create(this.claimCarsObj, {
      position: Vector3.create(7.05, 4.0, 23.4),
      scale: Vector3.create(4.5, 5.5, 31.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
    })
    MeshRenderer.setPlane(this.claimCarsObj)
    Material.setPbrMaterial(this.claimCarsObj, {
      texture: Material.Texture.Common({
        src: 'https://i.ibb.co/GQd32w1/hover-car-sign.png'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://i.ibb.co/GQd32w1/hover-car-sign.png'
      }),
      transparencyMode: 2
    })
    // GWEI warning3

    Transform.create(this.gweiWarning3Obj, {
      position: Vector3.create(7.08, 1.3, 21.91),
      scale: Vector3.create(1.3, 1.3, 26.3),
      rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
    })
    MeshRenderer.setPlane(this.gweiWarning3Obj)
    MeshCollider.setPlane(this.gweiWarning3Obj)
    Material.setPbrMaterial(this.gweiWarning3Obj, {
      texture: Material.Texture.Common({
        src: 'https://bafkreidbag7swhrqwuawtfsag4ou4hqak4gd2f5gx24imkjtwfyed7brim.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafkreidbag7swhrqwuawtfsag4ou4hqak4gd2f5gx24imkjtwfyed7brim.ipfs.nftstorage.link/'
      }),
      transparencyMode: 2
    })
    PointerEvents.createOrReplace(this.gweiWarning3Obj, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Check Polygon GWEI'
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.gweiWarning3Obj
        )
      ) {
        void openExternalUrl({
          url: 'https://polygonscan.com/gastracker/'
        })
      }
    })
    // Claim Brutes

    Transform.create(this.claimBrutesObj, {
      position: Vector3.create(7.05, 4.0, 29.8),
      scale: Vector3.create(4.5, 5.5, 31.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
    })
    MeshRenderer.setPlane(this.claimBrutesObj)
    Material.setPbrMaterial(this.claimBrutesObj, {
      texture: Material.Texture.Common({
        src: 'https://i.ibb.co/2gSzTjQ/brutes-sign.png'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://i.ibb.co/2gSzTjQ/brutes-sign.png'
      }),
      transparencyMode: 2
    })
    // GWEI warning4

    Transform.create(this.gweiWarning4Obj, {
      position: Vector3.create(7.08, 1.3, 28.31),
      scale: Vector3.create(1.3, 1.3, 26.3),
      rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
    })
    MeshRenderer.setPlane(this.gweiWarning4Obj)
    MeshCollider.setPlane(this.gweiWarning4Obj)
    Material.setPbrMaterial(this.gweiWarning4Obj, {
      texture: Material.Texture.Common({
        src: 'https://bafkreidbag7swhrqwuawtfsag4ou4hqak4gd2f5gx24imkjtwfyed7brim.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafkreidbag7swhrqwuawtfsag4ou4hqak4gd2f5gx24imkjtwfyed7brim.ipfs.nftstorage.link/'
      }),
      transparencyMode: 2
    })
    PointerEvents.createOrReplace(this.gweiWarning4Obj, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Check Polygon GWEI'
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.gweiWarning4Obj
        )
      ) {
        void openExternalUrl({
          url: 'https://polygonscan.com/gastracker/'
        })
      }
    })
    // Claim Mythic

    Transform.create(this.claimMythicObj, {
      position: Vector3.create(18.85, 4.0, 30.3),
      scale: Vector3.create(4.5, 5.5, 31.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0)
    })
    MeshRenderer.setPlane(this.claimMythicObj)
    Material.setPbrMaterial(this.claimMythicObj, {
      texture: Material.Texture.Common({
        src: 'https://bafkreigafv6omdnhcjruxi2vphfpvchlzzntivcxtwlbw2laz3r3goohf4.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafkreigafv6omdnhcjruxi2vphfpvchlzzntivcxtwlbw2laz3r3goohf4.ipfs.nftstorage.link/'
      }),
      transparencyMode: 2
    })
    // Claim Cargo

    Transform.create(this.claimCargoObj, {
      position: Vector3.create(21.55, 4.0, 28.8),
      scale: Vector3.create(4.5, 2.5, 31.0),
      rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0)
    })
    MeshRenderer.setPlane(this.claimCargoObj)
    Material.setPbrMaterial(this.claimCargoObj, {
      texture: Material.Texture.Common({
        src: 'https://i.ibb.co/XxMRDhQ/cargo-claim-sign.png'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://i.ibb.co/XxMRDhQ/cargo-claim-sign.png'
      }),
      transparencyMode: 2
    })
    // Claim Machine Boots Graphic

    Transform.create(this.claimMachine1Obj, {
      position: Vector3.create(6.95, 1.3, 10.67),
      scale: Vector3.create(1.3, 2.0, 26.3),
      rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
    })
    MeshRenderer.setPlane(this.claimMachine1Obj)
    Material.setPbrMaterial(this.claimMachine1Obj, {
      texture: Material.Texture.Common({
        src: 'https://i.ibb.co/Phrm2Nz/Speed-Boots-Graphic.png'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://i.ibb.co/Phrm2Nz/Speed-Boots-Graphic.png'
      }),
      transparencyMode: 2
    })
    // Claim Machine Bikes Graphic

    Transform.create(this.claimMachine2Obj, {
      position: Vector3.create(6.95, 1.3, 17.01),
      scale: Vector3.create(1.3, 2.0, 26.3),
      rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
    })
    MeshRenderer.setPlane(this.claimMachine2Obj)
    Material.setPbrMaterial(this.claimMachine2Obj, {
      texture: Material.Texture.Common({
        src: 'https://i.ibb.co/b13SxJj/Bikes-Graphic.png'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://i.ibb.co/b13SxJj/Bikes-Graphic.png'
      }),
      transparencyMode: 2
    })
    // Claim Machine Cars Graphic

    Transform.create(this.claimMachine3Obj, {
      position: Vector3.create(6.95, 1.3, 23.35),
      scale: Vector3.create(1.3, 2.0, 26.3),
      rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
    })
    MeshRenderer.setPlane(this.claimMachine3Obj)
    Material.setPbrMaterial(this.claimMachine3Obj, {
      texture: Material.Texture.Common({
        src: 'https://i.ibb.co/qy5jfMg/Hover-Car-Graphic.png'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://i.ibb.co/qy5jfMg/Hover-Car-Graphic.png'
      }),
      transparencyMode: 2
    })
    // Claim Machine Brutes Graphic

    Transform.create(this.claimMachine4Obj, {
      position: Vector3.create(6.95, 1.3, 29.67),
      scale: Vector3.create(1.3, 2.0, 26.3),
      rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
    })
    MeshRenderer.setPlane(this.claimMachine4Obj)
    Material.setPbrMaterial(this.claimMachine4Obj, {
      texture: Material.Texture.Common({
        src: 'https://i.ibb.co/7SxVLsg/Brutes-Graphic.png'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://i.ibb.co/7SxVLsg/Brutes-Graphic.png'
      }),
      transparencyMode: 2
    })
    // Claim Machine Mythic Graphic

    Transform.create(this.claimMachine5Obj, {
      position: Vector3.create(19.0, 1.3, 30.16),
      scale: Vector3.create(1.3, 2.0, 26.3),
      rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0)
    })
    MeshRenderer.setPlane(this.claimMachine5Obj)
    Material.setPbrMaterial(this.claimMachine5Obj, {
      texture: Material.Texture.Common({
        src: 'https://bafkreihqpxo7xg455p44laehrpjxipqjhvidqqyydupsnbyvmb5sq5iej4.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafkreihqpxo7xg455p44laehrpjxipqjhvidqqyydupsnbyvmb5sq5iej4.ipfs.nftstorage.link/'
      }),
      transparencyMode: 2
    })
    // speed boots claim

    MeshCollider.setBox(this.speedBootClaimBox)
    Material.setPbrMaterial(this.speedBootClaimBox, {
      albedoColor: Color4.create(1, 1, 1, 0)
    })
    Transform.create(this.speedBootClaimBox, {
      position: Vector3.create(7.44, 0.88, 10.39),
      scale: Vector3.create(2, 5.5, 2)
    })
    PointerEvents.createOrReplace(this.speedBootClaimBox, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Claim Speed Boots!'
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.speedBootClaimBox
        )
      ) {
        missions.checkAndUnlockCampaignMission('visitSpeedBoots')
        this.gameController.uiController.claimAsset.show('boots')
        // speedBootClaim.show();
      }
    })
    // bike claim

    MeshCollider.setBox(this.hoverBikeClaimBox)
    Material.setPbrMaterial(this.hoverBikeClaimBox, {
      albedoColor: Color4.create(1, 1, 1, 0)
    })
    Transform.create(this.hoverBikeClaimBox, {
      position: Vector3.create(7.44, 0.88, 17.2),
      scale: Vector3.create(2, 5.5, 2)
    })
    PointerEvents.createOrReplace(this.hoverBikeClaimBox, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Claim Hover Bikes!'
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.hoverBikeClaimBox
        )
      ) {
        missions.checkAndUnlockCampaignMission('visitHoverBike')
        this.gameController.uiController.claimAsset.show('bikes')
      }
    })
    // car claim

    MeshCollider.setBox(this.hoverCarClaimBox)
    Material.setPbrMaterial(this.hoverCarClaimBox, {
      albedoColor: Color4.create(1, 1, 1, 0)
    })
    Transform.create(this.hoverCarClaimBox, {
      position: Vector3.create(7.44, 0.88, 23.44),
      scale: Vector3.create(2, 5.5, 2)
    })
    PointerEvents.createOrReplace(this.hoverCarClaimBox, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Claim Hover Cars!'
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.hoverCarClaimBox
        )
      ) {
        missions.checkAndUnlockCampaignMission('visitHoverCar')
        this.gameController.uiController.claimAsset.show('cars')
      }
    })
    // brute claim

    MeshCollider.setBox(this.bruteClaimBox)
    Material.setPbrMaterial(this.bruteClaimBox, {
      albedoColor: Color4.create(1, 1, 1, 0)
    })
    Transform.create(this.bruteClaimBox, {
      position: Vector3.create(7.44, 0.88, 29.87),
      scale: Vector3.create(2, 5.5, 2)
    })
    PointerEvents.createOrReplace(this.bruteClaimBox, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Claim Brutes!'
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.bruteClaimBox
        )
      ) {
        this.gameController.uiController.claimAsset.show('brutes')
      }
    })
    // Mythic Claim Box

    MeshCollider.setBox(this.mythicClaimBox)
    Material.setPbrMaterial(this.mythicClaimBox, {
      albedoColor: Color4.create(1, 1, 1, 0)
    })
    Transform.create(this.mythicClaimBox, {
      position: Vector3.create(19.0, 1.3, 30.16),
      scale: Vector3.create(2, 5.5, 2)
    })
    PointerEvents.createOrReplace(this.mythicClaimBox, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Claim KittyVroom!'
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.mythicClaimBox
        )
      ) {
        this.gameController.uiController.claimAsset.show('legacy')

      }
    })
    // GWEI warning5

    Transform.create(this.gweiWarning5Obj, {
      position: Vector3.create(20.38, 1.3, 30.36),
      scale: Vector3.create(1.3, 1.3, 26.3),
      rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0)
    })
    MeshRenderer.setPlane(this.gweiWarning5Obj)
    MeshCollider.setPlane(this.gweiWarning5Obj)
    Material.setPbrMaterial(this.gweiWarning5Obj, {
      texture: Material.Texture.Common({
        src: 'https://bafkreidbag7swhrqwuawtfsag4ou4hqak4gd2f5gx24imkjtwfyed7brim.ipfs.nftstorage.link/'
      }),
      emissiveColor: Color4.White(),
      emissiveIntensity: 1,
      emissiveTexture: Material.Texture.Common({
        src: 'https://bafkreidbag7swhrqwuawtfsag4ou4hqak4gd2f5gx24imkjtwfyed7brim.ipfs.nftstorage.link/'
      }),
      transparencyMode: 2
    })
    PointerEvents.createOrReplace(this.gweiWarning5Obj, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Check Polygon GWEI'
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (
        inputSystem.isTriggered(
          InputAction.IA_POINTER,
          PointerEventType.PET_DOWN,
          this.gweiWarning5Obj
        )
      ) {
        void openExternalUrl({
          url: 'https://polygonscan.com/gastracker/'
        })
      }
    })
    crystals.updateCrystals()
    // Main Portal
    Transform.createOrReplace(this.mainPortal, {
      position: Vector3.create(30.91, 2.3, 59.07),
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
        utils.timers.setTimeout(() => {
          instance.setInstance('main')
          // cleanUpScene();
          utils.timers.setTimeout(() => {
            void movePlayerTo({
              newRelativePosition: Vector3.create(83.98, 1.92, 31.5),
              cameraTarget: Vector3.create(68.79, 0.88, 32.11)
            })
            this.gameController.realmController.switchRealm('mainInstance')
            this.gameController.uiController.loader.showLoader()
          }, 50)
        }, 50)
      }
    )
  }

  spawnSingleEntity(entityName: string): void {}

  callSingleFunction(functionName: string, boolean: boolean): void {}

  removeSingleEntity(entityName: string): void {}

  callAFunction(functionName: string): void {}

  removeAllEntities(): void {
    this.assets_entities.forEach((asset) => {
      entityController.removeEntity(asset)
    })
    entityController.removeEntity(this.assidMary)
    entityController.removeEntity(this.assidMaryText)
    entityController.removeEntity(this.cube)
    entityController.removeEntity(this.adPosterObj)
    entityController.removeEntity(this.vwPosterObj)
    entityController.removeEntity(this.communityPosterObj)
    entityController.removeEntity(this.vwBannerObj)
    entityController.removeEntity(this.claimBootsObj)
    entityController.removeEntity(this.gweiWarning1Obj)
    entityController.removeEntity(this.claimBikesObj)
    entityController.removeEntity(this.gweiWarning2Obj)
    entityController.removeEntity(this.claimCarsObj)
    entityController.removeEntity(this.gweiWarning3Obj)
    entityController.removeEntity(this.claimBrutesObj)
    entityController.removeEntity(this.gweiWarning4Obj)
    entityController.removeEntity(this.claimMythicObj)
    entityController.removeEntity(this.claimCargoObj)
    entityController.removeEntity(this.claimMachine1Obj)
    entityController.removeEntity(this.claimMachine2Obj)
    entityController.removeEntity(this.claimMachine3Obj)
    entityController.removeEntity(this.claimMachine4Obj)
    entityController.removeEntity(this.claimMachine5Obj)
    entityController.removeEntity(this.speedBootClaimBox)
    entityController.removeEntity(this.hoverBikeClaimBox)
    entityController.removeEntity(this.hoverCarClaimBox)
    entityController.removeEntity(this.bruteClaimBox)
    entityController.removeEntity(this.mythicClaimBox)
    entityController.removeEntity(this.gweiWarning5Obj)
    entityController.removeEntity(this._scene)
  }

  getId(): RealmType {
    return 'scrapyard'
  }

  deadPosition(): Vector3 {
    return { x: -38.34, y: 10.43, z: -39.75 }
  }
}
