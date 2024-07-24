import { MainInstance } from './instances/main/mainInstance'
import { VehicleOwnership } from './instances/main/vehicleOwnership'
import { RechargeInstance } from './instances/recharge/recharge'
import { DecentrallyBoard } from './ui/decentrally'
import { DragRaceBoard } from './ui/dragRace'
import { SoloSprintBoard } from './ui/soloSprint'
import { UIController } from './ui/ui.controller'
import { Loader } from './utils/loader'
import { PlayerStats } from './utils/player'

export class GameController {
  public Player: PlayerStats
  public uiController: UIController
  public vehicleOwnership: VehicleOwnership
  public mainInstance: MainInstance
  public soloSprint: SoloSprintBoard
  public loader: Loader
  public dragRaceBoard: DragRaceBoard
  public decentrallyBoard: DecentrallyBoard
  public rechargeInstance: RechargeInstance
  constructor() {
    this.uiController = new UIController(this)
    this.Player = new PlayerStats(this)
    this.vehicleOwnership = new VehicleOwnership(this)
    this.mainInstance = new MainInstance(this)
    this.rechargeInstance = new RechargeInstance(this)
    void this.mainInstance.renderMainInstance()
    // this.rechargeInstance.renderRecharge()
    this.soloSprint = new SoloSprintBoard(this)
    this.loader = new Loader(this)
    this.dragRaceBoard = new DragRaceBoard(this)
    this.decentrallyBoard = new DecentrallyBoard(this)
  }
}
