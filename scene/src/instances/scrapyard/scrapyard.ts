// initVWRegistry();

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
  MeshCollider
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { movePlayerTo, openExternalUrl } from '~system/RestrictedActions'
import * as npc from 'dcl-npc-toolkit'

const assets = [
  'scrapyard/scrapyardStatic.gltf',
  'scrapyard/carousel.gltf',
  'scrapyard/fan1.gltf',
  'scrapyard/fan2.gltf',
  'scrapyard/claimMachine.gltf',
  'scrapyard/craftingTable.gltf',
  'scrapyard/redPortal.glb',
  'scrapyard/mythicClaimMachine.glb'
]

export const renderScrapyard = async (): Promise<void> => {
  void movePlayerTo({ newRelativePosition: Vector3.create(31.38, 1.55, 47) })
  // missions.checkAndUnlockCampaignMission("scrapyard");

  for (const [index, asset] of (assets as any).entries()) {
    const entity = engine.addEntity()
    Transform.create(entity)
    GltfContainer.create(entity, { src: `assets/models/${asset}` })
    if (index === 7) {
      const entityBox = engine.addEntity()
      Transform.createOrReplace(entityBox, {
        position: Vector3.create(60, 2.26, 31.53),
        scale: Vector3.create(3, 9, 4)
      })
      // VW_REGISTRY.triggerBox.rechargeMainTriggerBox(entityBox);
    }
  }

  const _scene = engine.addEntity()
  Transform.createOrReplace(_scene, {
    position: Vector3.create(0, 0, 0),
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  let assidMary = engine.addEntity()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  assidMary = npc.create(
    {
      position: Vector3.create(22.97, 0, 29.03),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    },
    {
      type: npc.NPCType.CUSTOM,
      model: 'assets/models/npcs/assidmaryNPC.glb',
      onActivate: () => {
        //             missions.getCurrentMissionName() === "assidMary"
        // ? assidMary.talk(AssidMaryDialog1, 0)
        // : cargoClaim.toggleCargoClaim();
      },
      idleAnim: `idle`,
      faceUser: true,
      darkUI: true,
      coolDownDuration: 3,
      // missions.getCurrentMissionName() === "assidMary" ? "Talk to Assid Mary" : "Claim crates",
      onlyClickTrigger: true,
      onlyExternalTrigger: false,
      reactDistance: 3,
      continueOnWalkAway: false
    }
  )
  // Assid Mary Title
  const assidMaryText = engine.addEntity()
  TextShape.create(assidMaryText)
  Transform.create(assidMaryText, {
    position: Vector3.create(22.9, 2.9, 29.0),
    scale: Vector3.create(0.5, 0.6, 1.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0)
  })
  TextShape.getMutable(assidMaryText).fontSize = 6
  TextShape.getMutable(assidMaryText).textColor = Color4.White()
  TextShape.getMutable(assidMaryText).text = 'Assid Mary'

  // set barrel parent and attempt to place all barrels
  // VW_REGISTRY.triggerBox.mainTriggerBox(box, BarrelHandler.Instance);
  // BarrelHandler.Instance.SetParent(_scene);
  // BarrelHandler.Instance.PlaceAllBarrels();
  // MUSIC TRACK
  //   const { publicKey } = await getUserData()
  //   const cube = new Entity()
  //   cube.addComponentOrReplace(
  //     new AttachToAvatar({
  //       avatarId: publicKey,
  //       anchorPointId: AttachToAvatarAnchorPointId.NameTag
  //     })
  //   )

  // atlasAnalytics.updateBranchName("Scrapyard");

  // Ad Poster
  const adPosterObj = engine.addEntity()
  Transform.create(adPosterObj, {
    position: Vector3.create(63.05, 34.5, 35.8),
    scale: Vector3.create(23.5, 23.5, 13.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0)
  })
  MeshRenderer.setPlane(adPosterObj)
  Material.setPbrMaterial(adPosterObj, {
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
  const vwPosterObj = engine.addEntity()
  Transform.create(vwPosterObj, {
    position: Vector3.create(14.05, 17.5, 63.8),
    scale: Vector3.create(11.5, 23.5, 13.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 360.0, 0.0)
  })
  MeshRenderer.setPlane(vwPosterObj)
  Material.setPbrMaterial(vwPosterObj, {
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
  const communityPosterObj = engine.addEntity()
  Transform.create(communityPosterObj, {
    position: Vector3.create(0.15, 17.5, 50.8),
    scale: Vector3.create(11.5, 11.5, 13.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
  })
  MeshRenderer.setPlane(communityPosterObj)
  Material.setPbrMaterial(communityPosterObj, {
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
  const vwBannerObj = engine.addEntity()
  Transform.create(vwBannerObj, {
    position: Vector3.create(31.05, 49.0, 0.8),
    scale: Vector3.create(33.5, 11.5, 35.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0)
  })
  MeshRenderer.setPlane(vwBannerObj)
  Material.setPbrMaterial(vwBannerObj, {
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
  const claimBootsObj = engine.addEntity()
  Transform.create(claimBootsObj, {
    position: Vector3.create(7.05, 4.0, 10.8),
    scale: Vector3.create(4.5, 5.5, 31.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
  })
  MeshRenderer.setPlane(claimBootsObj)
  Material.setPbrMaterial(claimBootsObj, {
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
  const gweiWarning1Obj = engine.addEntity()
  Transform.create(gweiWarning1Obj, {
    position: Vector3.create(7.08, 1.3, 9.26),
    scale: Vector3.create(1.3, 1.3, 26.3),
    rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
  })
  MeshRenderer.setPlane(gweiWarning1Obj)
  Material.setPbrMaterial(gweiWarning1Obj, {
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
  PointerEvents.createOrReplace(gweiWarning1Obj, {
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
        gweiWarning1Obj
      )
    ) {
      void openExternalUrl({
        url: 'https://polygonscan.com/gastracker/'
      })
    }
  })
  // Claim Bikes
  const claimBikesObj = engine.addEntity()
  Transform.create(claimBikesObj, {
    position: Vector3.create(7.05, 4.0, 17.1),
    scale: Vector3.create(4.5, 5.5, 31.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
  })
  MeshRenderer.setPlane(claimBikesObj)
  Material.setPbrMaterial(claimBikesObj, {
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
  const gweiWarning2Obj = engine.addEntity()
  Transform.create(gweiWarning2Obj, {
    position: Vector3.create(7.08, 1.3, 15.61),
    scale: Vector3.create(1.3, 1.3, 26.3),
    rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
  })
  MeshRenderer.setPlane(gweiWarning2Obj)
  Material.setPbrMaterial(gweiWarning2Obj, {
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
  PointerEvents.createOrReplace(gweiWarning2Obj, {
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
        gweiWarning2Obj
      )
    ) {
      void openExternalUrl({
        url: 'https://polygonscan.com/gastracker/'
      })
    }
  })
  // Claim Cars
  const claimCarsObj = engine.addEntity()
  Transform.create(claimCarsObj, {
    position: Vector3.create(7.05, 4.0, 23.4),
    scale: Vector3.create(4.5, 5.5, 31.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
  })
  MeshRenderer.setPlane(claimCarsObj)
  Material.setPbrMaterial(claimCarsObj, {
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
  const gweiWarning3Obj = engine.addEntity()
  Transform.create(gweiWarning3Obj, {
    position: Vector3.create(7.08, 1.3, 21.91),
    scale: Vector3.create(1.3, 1.3, 26.3),
    rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
  })
  MeshRenderer.setPlane(gweiWarning3Obj)
  Material.setPbrMaterial(gweiWarning3Obj, {
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
  PointerEvents.createOrReplace(gweiWarning3Obj, {
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
        gweiWarning3Obj
      )
    ) {
      void openExternalUrl({
        url: 'https://polygonscan.com/gastracker/'
      })
    }
  })
  // Claim Brutes
  const claimBrutesObj = engine.addEntity()
  Transform.create(claimBrutesObj, {
    position: Vector3.create(7.05, 4.0, 29.8),
    scale: Vector3.create(4.5, 5.5, 31.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
  })
  MeshRenderer.setPlane(claimBrutesObj)
  Material.setPbrMaterial(claimBrutesObj, {
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
  const gweiWarning4Obj = engine.addEntity()
  Transform.create(gweiWarning4Obj, {
    position: Vector3.create(7.08, 1.3, 28.31),
    scale: Vector3.create(1.3, 1.3, 26.3),
    rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
  })
  MeshRenderer.setPlane(gweiWarning4Obj)
  Material.setPbrMaterial(gweiWarning4Obj, {
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
  PointerEvents.createOrReplace(gweiWarning4Obj, {
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
        gweiWarning4Obj
      )
    ) {
      void openExternalUrl({
        url: 'https://polygonscan.com/gastracker/'
      })
    }
  })
  // Claim Mythic
  const claimMythicObj = engine.addEntity()
  Transform.create(claimMythicObj, {
    position: Vector3.create(18.85, 4.0, 30.3),
    scale: Vector3.create(4.5, 5.5, 31.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0)
  })
  MeshRenderer.setPlane(claimMythicObj)
  Material.setPbrMaterial(claimMythicObj, {
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
  const claimCargoObj = engine.addEntity()
  Transform.create(claimCargoObj, {
    position: Vector3.create(21.55, 4.0, 28.8),
    scale: Vector3.create(4.5, 2.5, 31.0),
    rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0)
  })
  MeshRenderer.setPlane(claimCargoObj)
  Material.setPbrMaterial(claimCargoObj, {
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
  const claimMachine1Obj = engine.addEntity()
  Transform.create(claimMachine1Obj, {
    position: Vector3.create(6.95, 1.3, 10.67),
    scale: Vector3.create(1.3, 2.0, 26.3),
    rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
  })
  MeshRenderer.setPlane(claimMachine1Obj)
  Material.setPbrMaterial(claimMachine1Obj, {
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
  const claimMachine2Obj = engine.addEntity()
  Transform.create(claimMachine2Obj, {
    position: Vector3.create(6.95, 1.3, 17.01),
    scale: Vector3.create(1.3, 2.0, 26.3),
    rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
  })
  MeshRenderer.setPlane(claimMachine2Obj)
  Material.setPbrMaterial(claimMachine2Obj, {
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
  const claimMachine3Obj = engine.addEntity()
  Transform.create(claimMachine3Obj, {
    position: Vector3.create(6.95, 1.3, 23.35),
    scale: Vector3.create(1.3, 2.0, 26.3),
    rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
  })
  MeshRenderer.setPlane(claimMachine3Obj)
  Material.setPbrMaterial(claimMachine3Obj, {
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
  const claimMachine4Obj = engine.addEntity()
  Transform.create(claimMachine4Obj, {
    position: Vector3.create(6.95, 1.3, 29.67),
    scale: Vector3.create(1.3, 2.0, 26.3),
    rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
  })
  MeshRenderer.setPlane(claimMachine4Obj)
  Material.setPbrMaterial(claimMachine4Obj, {
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
  const claimMachine5Obj = engine.addEntity()
  Transform.create(claimMachine5Obj, {
    position: Vector3.create(19.0, 1.3, 30.16),
    scale: Vector3.create(1.3, 2.0, 26.3),
    rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0)
  })
  MeshRenderer.setPlane(claimMachine5Obj)
  Material.setPbrMaterial(claimMachine5Obj, {
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
  const speedBootClaimBox = engine.addEntity()
  MeshCollider.setBox(speedBootClaimBox)
  Material.setPbrMaterial(speedBootClaimBox, {
    albedoColor: Color4.create(1, 1, 1, 0)
  })
  Transform.create(speedBootClaimBox, {
    position: Vector3.create(7.44, 0.88, 10.39),
    scale: Vector3.create(2, 5.5, 2)
  })
  PointerEvents.createOrReplace(speedBootClaimBox, {
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
        speedBootClaimBox
      )
    ) {
      // missions.checkAndUnlockCampaignMission("visitSpeedBoots");
      // speedBootClaim.show();
    }
  })
  // bike claim
  const hoverBikeClaimBox = engine.addEntity()
  MeshCollider.setBox(hoverBikeClaimBox)
  Material.setPbrMaterial(hoverBikeClaimBox, {
    albedoColor: Color4.create(1, 1, 1, 0)
  })
  Transform.create(hoverBikeClaimBox, {
    position: Vector3.create(7.44, 0.88, 17.2),
    scale: Vector3.create(2, 5.5, 2)
  })
  PointerEvents.createOrReplace(hoverBikeClaimBox, {
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
        hoverBikeClaimBox
      )
    ) {
      // missions.checkAndUnlockCampaignMission("visitHoverBike");
      // hoverBikeClaim.show();
    }
  })
  // car claim
  const hoverCarClaimBox = engine.addEntity()
  MeshCollider.setBox(hoverCarClaimBox)
  Material.setPbrMaterial(hoverCarClaimBox, {
    albedoColor: Color4.create(1, 1, 1, 0)
  })
  Transform.create(hoverCarClaimBox, {
    position: Vector3.create(7.44, 0.88, 23.44),
    scale: Vector3.create(2, 5.5, 2)
  })
  PointerEvents.createOrReplace(hoverCarClaimBox, {
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
        hoverCarClaimBox
      )
    ) {
      // missions.checkAndUnlockCampaignMission("visitHoverCar");
      // hoverCarClaim.show();
    }
  })
  // brute claim
  const bruteClaimBox = engine.addEntity()
  MeshCollider.setBox(bruteClaimBox)
  Material.setPbrMaterial(bruteClaimBox, {
    albedoColor: Color4.create(1, 1, 1, 0)
  })
  Transform.create(bruteClaimBox, {
    position: Vector3.create(7.44, 0.88, 29.87),
    scale: Vector3.create(2, 5.5, 2)
  })
  PointerEvents.createOrReplace(bruteClaimBox, {
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
        bruteClaimBox
      )
    ) {
      // bruteClaim.show();
    }
  })
  // Mythic Claim Box
  const mythicClaimBox = engine.addEntity()
  MeshCollider.setBox(mythicClaimBox)
  Material.setPbrMaterial(mythicClaimBox, {
    albedoColor: Color4.create(1, 1, 1, 0)
  })
  Transform.create(mythicClaimBox, {
    position: Vector3.create(19.0, 1.3, 30.16),
    scale: Vector3.create(2, 5.5, 2)
  })
  PointerEvents.createOrReplace(mythicClaimBox, {
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
        mythicClaimBox
      )
    ) {
      // mythicClaim.show();
    }
  })
  // GWEI warning5
  const gweiWarning5Obj = engine.addEntity()
  Transform.create(gweiWarning5Obj, {
    position: Vector3.create(20.38, 1.3, 30.36),
    scale: Vector3.create(1.3, 1.3, 26.3),
    rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0)
  })
  MeshRenderer.setPlane(gweiWarning5Obj)
  Material.setPbrMaterial(gweiWarning5Obj, {
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
  PointerEvents.createOrReplace(gweiWarning5Obj, {
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
        gweiWarning5Obj
      )
    ) {
      void openExternalUrl({
        url: 'https://polygonscan.com/gastracker/'
      })
    }
  })
  //   crystals.updateCrystals();
}
