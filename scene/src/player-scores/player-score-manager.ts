/*      PLAYER SCORE MANAGER
    provides an interface for managing a player's scores; this includes highscores, as well as
    scores for the number of collectables a player has gathered in a run.

    TODO: should likely split data more (atm we have highscores and other score mingling, no issues yet
        but it is always good to decompose when possible)

    author: Alex Pazder
    contact: TheCryptoTrader69@gmail.com 
*/

import Dictionary, { List } from '../utils/collections'
import {
  PlayerScoreData,
  PLAYER_SCORE_NAMES,
  type RaceScoreObject
} from './player-score-data'

/** defines a player's current highscore's live data in-scene */
export class PlayerScoreEntry {
  /** positional index of data object */
  private readonly index: number
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public get Index() {
    return this.index
  }

  /** unique identifier */
  private readonly id: string
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public get ID() {
    return this.id
  }

  /** score's current value, defaults to '-1' so value is only sent after an update from server occurs */
  private value: number = -1
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public get Value() {
    return this.value
  }

  public SetValue(value: number, thresh: boolean): void {
    // if only allow better time scores
    if (thresh) {
      if (this.value === -1 || this.value > value) this.value = value
    }
    // standard set
    else {
      this.value = value
    }
  }

  /** constructor */
  constructor(index: number, id: string) {
    this.index = index
    this.id = id
  }
}
/** manages the state of all player's scores in the game */
export class PlayerScoreManager {
  /** when true debugging logs will be generated (ensure is false when deploying to remove overhead) */
  private readonly IsDebugging: boolean = false

  // access pocketing
  private static instance: undefined | PlayerScoreManager
  static IsDebugging: any
  public static get Instance(): PlayerScoreManager {
    // ensure instance is set
    if (PlayerScoreManager.instance === undefined) {
      PlayerScoreManager.instance = new PlayerScoreManager()
    }

    return PlayerScoreManager.instance
  }

  // highscore registries, providing access
  //  to ALL registered data
  private readonly entryRegistry: List<PlayerScoreEntry>
  //  id as key
  private readonly entryRegistryViaID: Dictionary<PlayerScoreEntry>

  /** prepares registry for use, this is done automatically when the instance is first called */
  public constructor() {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (PlayerScoreManager.IsDebugging)
      console.log('Player Scores Manager: initializing...')

    // initialize collection sets
    this.entryRegistry = new List<PlayerScoreEntry>()
    this.entryRegistryViaID = new Dictionary<PlayerScoreEntry>()

    // populate registry collections
    //  process every score def
    for (var i: number = 0; i < PlayerScoreData.length; i++) {
      // prepare entry
      const entry = new PlayerScoreEntry(i, PlayerScoreData[i].ID)
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (PlayerScoreManager.IsDebugging)
        console.log(
          'Player Scores Manager: creating entry=' +
            i +
            ', name=' +
            PlayerScoreData[i].DisplayName
        )
      // add to registry
      this.entryRegistry.addItem(entry)
      this.entryRegistryViaID.addItem(PlayerScoreData[i].ID, entry)
    }

    // set comp points to zero by default
    this.GetEntryByID(PLAYER_SCORE_NAMES.COMP_POINTS).SetValue(0, false)

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (PlayerScoreManager.IsDebugging)
      console.log(
        'Player Scores Manager: initialized, total count=' +
          this.entryRegistry.size()
      )
  }

  /** returns entry at given position */
  public CallbackGetEntryByPos(index: number): PlayerScoreEntry {
    return PlayerScoreManager.Instance.GetEntryByPos(index)
  }

  public GetEntryByPos(index: number): PlayerScoreEntry {
    return this.entryRegistry.getItem(index)
  }

  /** returns entry of given id */
  public CallbackGetEntryByID(id: PLAYER_SCORE_NAMES): PlayerScoreEntry {
    return PlayerScoreManager.Instance.GetEntryByID(id)
  }

  public GetEntryByID(id: PLAYER_SCORE_NAMES): PlayerScoreEntry {
    return this.entryRegistryViaID.getItem(id)
  }

  /** returns data definition that corosponds to the given id */
  public CallbackGetDefByID(id: PLAYER_SCORE_NAMES): RaceScoreObject {
    return PlayerScoreManager.Instance.GetDefByID(id)
  }

  public GetDefByID(id: PLAYER_SCORE_NAMES): RaceScoreObject {
    return PlayerScoreData[this.entryRegistryViaID.getItem(id).Index]
  }
}
