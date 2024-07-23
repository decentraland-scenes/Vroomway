import {
  GltfContainer,
  InputAction,
  PointerEventType,
  PointerEvents,
  Transform,
  engine,
  inputSystem
} from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { instance } from './utils/currentInstance'
import { missions } from './utils/missions'
import { entityController } from './utils/entity-controller'

class Crystals {
  updateCrystals(): void {
    this.showScrapyardCrystal()
    this.showRechargeCrystal()
    this.showYoYoCrystal()
    this.showSecondFloorCrystal()
  }

  showScrapyardCrystal(): void {
    // Scrapyard crystal
    if (
      missions.currentMissionIndex === 9 &&
      instance.getInstance() === 'scrapyard'
    ) {
      const scrapCrystal = entityController.addEntity()
      GltfContainer.create(scrapCrystal, {
        src: 'assets/models/missions/scrapyardCrystal.glb'
      })
      Transform.create(scrapCrystal, {
        position: Vector3.create(47.39, 48.04, 60.77),
        scale: Vector3.create(1, 1, 1)
      })
      PointerEvents.createOrReplace(scrapCrystal, {
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
            scrapCrystal
          )
        ) {
          missions.checkAndUnlockCampaignMission('scrapyardCrystal')
          entityController.removeEntity(scrapCrystal)
        }
      })
    }
  }

  showRechargeCrystal(): void {
    // Recharge Crystal
    if (
      missions.currentMissionIndex === 13 &&
      instance.getInstance() === 'recharge'
    ) {
      const rechargeCrystal = entityController.addEntity()
      GltfContainer.create(rechargeCrystal, {
        src: 'assets/models/missions/rechargeCrystal.glb'
      })
      Transform.create(rechargeCrystal, {
        position: Vector3.create(30.15, 2, 6.91),
        scale: Vector3.create(1, 1, 1)
      })
      PointerEvents.createOrReplace(rechargeCrystal, {
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
            rechargeCrystal
          )
        ) {
          missions.checkAndUnlockCampaignMission('rechargeCrystal')
          entityController.removeEntity(rechargeCrystal)
        }
      })
    }
  }

  showYoYoCrystal(): void {
    if (
      missions.currentMissionIndex === 26 &&
      instance.getInstance() === 'main'
    ) {
      // Final Crystal Yoyo
      const finalCrystal = entityController.addEntity()
      GltfContainer.create(finalCrystal, {
        src: 'assets/models/missions/finalCrystal.glb'
      })
      Transform.create(finalCrystal, {
        position: Vector3.create(51.64, 0.5, 57.02),
        scale: Vector3.create(1, 1, 1)
      })
      PointerEvents.createOrReplace(finalCrystal, {
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
            finalCrystal
          )
        ) {
          missions.checkAndUnlockCampaignMission('yoyoCrystal')
          entityController.removeEntity(finalCrystal)
          missions.campaignMissionsComplete = true
        }
      })
    }
  }

  showSecondFloorCrystal(): void {
    if (
      missions.currentMissionIndex === 24 &&
      instance.getInstance() === 'main'
    ) {
      const mainCrystal = entityController.addEntity()
      GltfContainer.create(mainCrystal, {
        src: 'assets/models/missions/mainEntranceCrystal.glb'
      })
      Transform.create(mainCrystal, {
        position: Vector3.create(32, 0.5, 32),
        scale: Vector3.create(1, 1, 1)
      })
      PointerEvents.createOrReplace(mainCrystal, {
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
            mainCrystal
          )
        ) {
          missions.checkAndUnlockCampaignMission('secondFloorCrystal')
          entityController.removeEntity(mainCrystal)
        }
      })
    }
  }
}

export const crystals = new Crystals()
