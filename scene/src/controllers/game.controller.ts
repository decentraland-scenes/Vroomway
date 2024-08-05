import { VehicleOwnership } from '../instances/main/vehicleOwnership'
import { DecentrallyBoard } from '../ui/decentrally'
import { DragRaceBoard } from '../ui/dragRace'
import { SoloSprintBoard } from '../ui/soloSprint'
import { UIController } from './ui.controller'
import { Loader } from '../utils/loader'
import { PlayerStats } from '../utils/player'
import { RealmController } from './instance.controller'
import { DanceArea } from '../ui/danceArea'

export class GameController {
  public Player: PlayerStats
  public uiController: UIController
  public vehicleOwnership: VehicleOwnership
  public soloSprint: SoloSprintBoard
  public loader: Loader
  public dragRaceBoard: DragRaceBoard
  public decentrallyBoard: DecentrallyBoard
  public realmController: RealmController
  public danceArea : DanceArea
  constructor() {
    this.uiController = new UIController(this)
    this.realmController = new RealmController(this)
    this.Player = new PlayerStats(this)
    this.vehicleOwnership = new VehicleOwnership(this)
    this.soloSprint = new SoloSprintBoard(this)
    this.loader = new Loader(this)
    this.dragRaceBoard = new DragRaceBoard(this)
    this.decentrallyBoard = new DecentrallyBoard(this)
    this.danceArea = new DanceArea(this)
  }
}
