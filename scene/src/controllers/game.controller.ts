import { VehicleOwnership } from '../instances/main/vehicleOwnership'
import { DecentrallyBoard } from '../ui/decentrally'
import { DragRaceBoard } from '../ui/dragRace'
import { SoloSprintBoard } from '../ui/soloSprint'
import { UIController } from './ui.controller'
import { PlayerStats } from '../utils/player'
import { RealmController } from './instance.controller'
import { DanceAreaUI } from '../ui/danceArea'
import { SuperChargeTimer } from '../instances/recharge/timer'
import { SprintTimer } from '../utils/sprintTimer'
import { PlayerPowerUps } from '../utils/powerUps'

export class GameController {
  public Player: PlayerStats
  public uiController: UIController
  public vehicleOwnership: VehicleOwnership
  public soloSprint: SoloSprintBoard
  public dragRaceBoard: DragRaceBoard
  public decentrallyBoard: DecentrallyBoard
  public realmController: RealmController
  public danceAreaUI: DanceAreaUI
  public superChargeTimer: SuperChargeTimer
  public sprintTimer: SprintTimer
  public PowerUpsInv: PlayerPowerUps
  constructor() {
    this.uiController = new UIController(this)
    this.realmController = new RealmController(this)
    this.Player = new PlayerStats(this)
    this.vehicleOwnership = new VehicleOwnership(this)
    this.soloSprint = new SoloSprintBoard(this)
    this.dragRaceBoard = new DragRaceBoard(this)
    this.decentrallyBoard = new DecentrallyBoard(this)
    this.danceAreaUI = new DanceAreaUI(this)
    this.superChargeTimer = new SuperChargeTimer(this)
    this.sprintTimer = new SprintTimer(this)
    this.PowerUpsInv = new PlayerPowerUps(this)
  }
}
