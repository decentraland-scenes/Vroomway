import { MainInstance } from '../instances/main/mainInstance'
import { RechargeInstance } from '../instances/recharge/recharge'
import { Scrapyard } from '../instances/scrapyard/scrapyard'
import { type Realm, type RealmType } from '../instances/types'
import { entityController } from '../utils/entityController'
import { type GameController } from './game.controller'

export class RealmController {
  public currentRealm: Realm | null = null
  gameController: GameController

  constructor(gameController: GameController) {
    this.gameController = gameController
  }

  switchRealm(realm: RealmType): void {
    this.cleanUpScene()

    // TODO: utils and npc library should be cleaned as well
    entityController.clean()

    switch (realm) {
      case 'mainInstance':
        this.currentRealm = new MainInstance(this.gameController)
        break
      case 'recharge':
        this.currentRealm = new RechargeInstance(this.gameController)
        break
      case 'scrapyard':
        this.currentRealm = new Scrapyard(this.gameController)
        break
    }
  }

  cleanUpScene(): void {
    this.currentRealm?.removeAllEntities()
    this.currentRealm = null
  }
}
