/*      PLAYER SCORE DATA
    this file contains all object definitions for score defs & indexing
 
    author: Alex Pazder
    contact: TheCryptoTrader69@gmail.com 
*/
/** defines the type of a score, effects how the score is written */
export enum PLAYER_SCORE_TYPES {
  COUNT, // displays score as a number
  TIME // displays score value as a time
}
/** type of sorting meathod used for the scoreboard */
export enum PLAYER_SCORE_SORTING_TYPES {
  HIGHEST_TOP,
  LOWEST_TOP
}
// call-values for IDs,
export enum PLAYER_SCORE_NAMES {
  SPRINT_SOLO_TIME = 'soloSprintTime',
  SPRINT_SOLO_COUNT_COINS = 'sprintCoinsCollected',
  SPRINT_COMP_TIME = 'sprintCompTime',
  SPRINT_COUNT_QTY_COINS = 'sprintCoinsQtyCollected',
  CIRCUIT_TIME = 'circuitTime',
  CIRCUIT_COUNT_COINS = 'circuitsCoinsCollected',
  CIRCUIT_COMP_TIME = 'circuitCompTime',
  COMP_POINTS = 'compPoints',
  DRAG_RACE_TIME = 'dragRaceTime'
}
export type RaceScoreObject = {
  ID: string // unique index, this is the value sent to the server
  DisplayType: PLAYER_SCORE_TYPES // formatting applied to values
  DisplaySortType: PLAYER_SCORE_SORTING_TYPES // sorting method used for values
  DisplayName: string // display name for leader board
  // highscore indexing, allows use to easily conduct leaderboard draws using these data values
  ServerTable: string // call to retreive data table
  ServerName: string // call to retreive data table
  ServerValue: string // value name in data table (when the server gets fixed these should be standardized)
}
/**
 * contains all object definitions for race scores
 */
export const PlayerScoreData: RaceScoreObject[] = [
  // solo sprint
  {
    ID: 'soloSprintTime',
    DisplayType: PLAYER_SCORE_TYPES.TIME,
    DisplaySortType: PLAYER_SCORE_SORTING_TYPES.LOWEST_TOP,
    DisplayName: 'Normal Sprints',
    ServerTable: 'leaders',
    ServerName: 'username',
    ServerValue: 'soloSprintTime'
  },
  {
    ID: 'sprintCoinsCollected',
    DisplayType: PLAYER_SCORE_TYPES.COUNT,
    DisplaySortType: PLAYER_SCORE_SORTING_TYPES.LOWEST_TOP,
    DisplayName: '',
    ServerTable: '',
    ServerName: '',
    ServerValue: ''
  },
  // solo comp
  {
    ID: 'sprintCompTime',
    DisplayType: PLAYER_SCORE_TYPES.TIME,
    DisplaySortType: PLAYER_SCORE_SORTING_TYPES.LOWEST_TOP,
    DisplayName: '',
    ServerTable: '',
    ServerName: '',
    ServerValue: ''
  },
  {
    ID: 'sprintCoinsQtyCollected',
    DisplayType: PLAYER_SCORE_TYPES.COUNT,
    DisplaySortType: PLAYER_SCORE_SORTING_TYPES.LOWEST_TOP,
    DisplayName: '',
    ServerTable: '',
    ServerName: '',
    ServerValue: ''
  },
  // circuit
  {
    ID: 'circuitTime',
    DisplayType: PLAYER_SCORE_TYPES.TIME,
    DisplaySortType: PLAYER_SCORE_SORTING_TYPES.LOWEST_TOP,
    DisplayName: 'Fuego Circuit Time',
    ServerTable: 'circuitleaders',
    ServerName: 'username',
    ServerValue: 'circuitTime'
  },
  {
    ID: 'circuitsCoinsCollected',
    DisplayType: PLAYER_SCORE_TYPES.COUNT,
    DisplaySortType: PLAYER_SCORE_SORTING_TYPES.LOWEST_TOP,
    DisplayName: '',
    ServerTable: '',
    ServerName: '',
    ServerValue: ''
  },
  // circuit comp
  {
    ID: 'circuitCompTime',
    DisplayType: PLAYER_SCORE_TYPES.TIME,
    DisplaySortType: PLAYER_SCORE_SORTING_TYPES.LOWEST_TOP,
    DisplayName: '',
    ServerTable: '',
    ServerName: '',
    ServerValue: ''
  },
  {
    ID: 'compPoints',
    DisplayType: PLAYER_SCORE_TYPES.COUNT,
    DisplaySortType: PLAYER_SCORE_SORTING_TYPES.HIGHEST_TOP,
    DisplayName: 'Competitive Points',
    ServerTable: 'comppoints',
    ServerName: 'username',
    ServerValue: 'compPoints'
  },
  // drag race
  {
    ID: 'dragRaceTime',
    DisplayType: PLAYER_SCORE_TYPES.TIME,
    DisplaySortType: PLAYER_SCORE_SORTING_TYPES.LOWEST_TOP,
    DisplayName: 'Drag Race Time',
    ServerTable: 'dragracetime',
    ServerName: 'username',
    ServerValue: 'dragRaceTime'
  }
]
