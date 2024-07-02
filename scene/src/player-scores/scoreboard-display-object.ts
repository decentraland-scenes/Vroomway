/*      SCOREBOARD DISPLAY
    contains a modular solution to drawing scoreboards. scoreboards are drawn based on the provided
    target score and can be easily placed/moved around the map, reformatted, and updated without needing
    to delete all the previously created objects.
  
    NOTE: things are set up in a certain way to make migration to SDK7 easy, the main points are that
    all refernces need to be maintained by entities rather than components (currently, in SDK7 long-term
    refs to components break -.-) 
    
    author: Alex Pazder
    contact: TheCryptoTrader69@gmail.com 
*/

import {
  type Entity,
  Font,
  TextAlignMode,
  TextShape,
  Transform,
  engine,
  executeTask
} from '@dcl/sdk/ecs'
import {
  type PLAYER_SCORE_NAMES,
  PLAYER_SCORE_SORTING_TYPES,
  PLAYER_SCORE_TYPES
} from './player-score-data'
import { PlayerScoreManager } from './player-score-manager'
import { Vector3, Quaternion, type Color4 } from '@dcl/sdk/math'
import { LAMBDA_URL } from '../utils/constants'

// placement settings for scoreboard frame
const SCOREBOARD_FRAME_POSITION = { x: 0, y: 0, z: 0 }
const SCOREBOARD_FRAME_SCALE = { x: 0, y: 0, z: 0 }
const SCOREBOARD_FRAME_ROTATION = { x: 0, y: 0, z: 0, w: 0 }

// default font size of header
const SCOREBOARD_HEADER_FONTSIZE = 4
const SCOREBOARD_HEADER_FONT = Font.F_SANS_SERIF
// positional for score entries
const SCOREBOARD_HEADER_OFFSET = { x: 0, y: 0, z: 0 }

// default number of score entries
const SCOREBOARD_ENTRY_COUNT = 18
// default vertical spacing for score entries
const SCOREBOARD_ENTRY_SPACING = 0.34
// default font size of entry text
const SCOREBOARD_ENTRY_FONTSIZE = 3
const SCOREBOARD_ENTRY_FONT = Font.F_SANS_SERIF
// positional for score entries
const SCOREBOARD_ENTRY_OFFSET_ALL = { x: 0, y: -0.4, z: 0 }
// default position for entry's player name
const SCOREBOARD_ENTRY_OFFSET_NAME = { x: -0.9, y: 0, z: 0 }
// default position for entry's player score
const SCOREBOARD_ENTRY_OFFSET_SCORE = { x: 1.2, y: 0, z: 0 }

/** represents a single entry on the scoreboard */
export class ScoreboardDisplayEntry {
  /** parental object, use for placement of object */
  entityParent: Entity
  /** entity with textshape for player's name */
  entityPlayerNameText: Entity
  /** entity with textshape for player's score */
  entityPlayerScoreText: Entity

  constructor(parent: Entity) {
    // parent
    this.entityParent = engine.addEntity()
    Transform.createOrReplace(this.entityParent, { parent: parent })
    // player name
    this.entityPlayerNameText = engine.addEntity()
    Transform.createOrReplace(this.entityPlayerNameText, {
      parent: this.entityParent
    })
    Transform.getMutable(this.entityPlayerNameText).position = Vector3.create(
      SCOREBOARD_ENTRY_OFFSET_NAME.x,
      SCOREBOARD_ENTRY_OFFSET_NAME.y,
      SCOREBOARD_ENTRY_OFFSET_NAME.z
    )
    TextShape.createOrReplace(this.entityPlayerNameText)
    TextShape.getMutable(this.entityPlayerNameText).fontSize =
      SCOREBOARD_ENTRY_FONTSIZE
    TextShape.getMutable(this.entityPlayerNameText).font = SCOREBOARD_ENTRY_FONT
    TextShape.getMutable(this.entityPlayerNameText).textAlign =
      TextAlignMode.TAM_MIDDLE_CENTER
    // player score
    this.entityPlayerScoreText = engine.addEntity()
    Transform.createOrReplace(this.entityPlayerScoreText, {
      parent: this.entityParent
    })
    Transform.getMutable(this.entityPlayerScoreText).position = Vector3.create(
      SCOREBOARD_ENTRY_OFFSET_SCORE.x,
      SCOREBOARD_ENTRY_OFFSET_SCORE.y,
      SCOREBOARD_ENTRY_OFFSET_SCORE.z
    )
    TextShape.createOrReplace(this.entityPlayerScoreText)
    TextShape.getMutable(this.entityPlayerScoreText).fontSize =
      SCOREBOARD_ENTRY_FONTSIZE
    TextShape.getMutable(this.entityPlayerScoreText).font =
      SCOREBOARD_ENTRY_FONT
    TextShape.getMutable(this.entityPlayerScoreText).textAlign =
      TextAlignMode.TAM_MIDDLE_CENTER
  }
}

/** displays highscores of given type */
export class ScoreboardDisplayObject {
  static IsDebugging = true

  // NOTE: the legacy system lacked conistancy between scoreboards, so this is a fix until the db is migrated & upgraded
  /** targeted highscore table */
  targetTable: string
  public SetTargetTable(tarTable: string): void {
    this.targetTable = tarTable
  }
  /** targeted highscore name label */

  targetName: string

  public SetTargetName(tarName: string): void {
    this.targetName = tarName
  }
  /** targeted highscore value label */

  targetValue: string

  public SetTargetValue(tarValue: string): void {
    this.targetValue = tarValue
  }

  /** defines how the score value is drawn */
  valueDisplayType: PLAYER_SCORE_TYPES
  public SetDisplayType(type: PLAYER_SCORE_TYPES): void {
    this.valueDisplayType = type
  }

  /** parental entity, contains all display objects */
  entityParent: Entity
  /** display frame */
  entityFrame: Entity

  /** display colour of header text */
  colourHeader: Color4
  /** score header */
  entityHeader: Entity

  /** display colour of entry name text */
  entryColourName: Color4
  /** display colour of entry score text */
  entryColourScore: Color4

  entrySorting: PLAYER_SCORE_SORTING_TYPES
  /** spacing */
  entrySpacing: number
  /** offset of all entries */
  entryOffsetAll: Vector3
  /** offset of entry name text */
  entryOffsetName: Vector3
  /** offset of entry score value text */
  entryOffsetScore: Vector3

  /** score entry objects */
  entryObjects: ScoreboardDisplayEntry[]

  /** prepares scoreboard using default display settings */
  constructor(
    type: PLAYER_SCORE_NAMES,
    colourHeader: Color4,
    colourName: Color4,
    colourScore: Color4,
    parent: Entity
  ) {
    if (ScoreboardDisplayObject.IsDebugging)
      console.log(
        'Scoreboard Display: creating new scoreboard with type=' + type + '...'
      )
    // get def
    const def = PlayerScoreManager.Instance.GetDefByID(type)

    // set targeting
    this.targetTable = def.ServerTable
    this.targetName = def.ServerName
    this.targetValue = def.ServerValue
    // set display type
    this.valueDisplayType = def.DisplayType

    // load in colours
    this.colourHeader = colourHeader
    this.entryColourName = colourName
    this.entryColourScore = colourScore

    // load in positioning
    this.entrySorting = def.DisplaySortType
    this.entrySpacing = SCOREBOARD_ENTRY_SPACING
    this.entryOffsetAll = Vector3.create(
      SCOREBOARD_ENTRY_OFFSET_ALL.x,
      SCOREBOARD_ENTRY_OFFSET_ALL.y,
      SCOREBOARD_ENTRY_OFFSET_ALL.z
    )
    this.entryOffsetName = Vector3.create(
      SCOREBOARD_ENTRY_OFFSET_NAME.x,
      SCOREBOARD_ENTRY_OFFSET_NAME.y,
      SCOREBOARD_ENTRY_OFFSET_NAME.z
    )
    this.entryOffsetScore = Vector3.create(
      SCOREBOARD_ENTRY_OFFSET_SCORE.x,
      SCOREBOARD_ENTRY_OFFSET_SCORE.y,
      SCOREBOARD_ENTRY_OFFSET_SCORE.z
    )

    // create parent
    this.entityParent = engine.addEntity()
    Transform.createOrReplace(this.entityParent, { parent: parent })
    // create frame
    this.entityFrame = engine.addEntity()
    Transform.createOrReplace(this.entityFrame, { parent: this.entityParent })
    Transform.getMutable(this.entityFrame).position = Vector3.create(
      SCOREBOARD_FRAME_POSITION.x,
      SCOREBOARD_FRAME_POSITION.y,
      SCOREBOARD_FRAME_POSITION.z
    )
    Transform.getMutable(this.entityFrame).scale = Vector3.create(
      SCOREBOARD_FRAME_SCALE.x,
      SCOREBOARD_FRAME_SCALE.y,
      SCOREBOARD_FRAME_SCALE.z
    )
    Transform.getMutable(this.entityFrame).rotation =
      Quaternion.fromEulerDegrees(
        SCOREBOARD_FRAME_ROTATION.x,
        SCOREBOARD_FRAME_ROTATION.y,
        SCOREBOARD_FRAME_ROTATION.z
      )
    // create score header
    this.entityHeader = engine.addEntity()
    Transform.createOrReplace(this.entityHeader, { parent: this.entityParent })
    Transform.getMutable(this.entityHeader).position = Vector3.create(
      SCOREBOARD_HEADER_OFFSET.x,
      SCOREBOARD_HEADER_OFFSET.y,
      SCOREBOARD_HEADER_OFFSET.z
    )
    TextShape.create(this.entityHeader, { text: def.DisplayName })
    TextShape.getMutable(this.entityHeader).fontSize =
      SCOREBOARD_HEADER_FONTSIZE
    TextShape.getMutable(this.entityHeader).font = SCOREBOARD_HEADER_FONT
    TextShape.getMutable(this.entityHeader).textColor = this.colourHeader
    TextShape.getMutable(this.entityHeader).textAlign =
      TextAlignMode.TAM_MIDDLE_CENTER
    // prepare entries
    this.entryObjects = []
    this.SetEntryCount(SCOREBOARD_ENTRY_COUNT)
    if (ScoreboardDisplayObject.IsDebugging)
      console.log(
        'Scoreboard Display: created new scoreboard with type=' + type + '!'
      )
  }

  /** redraws the entire entry menu, reasserting entry positioning */
  public RedrawEntryDisplay(): void {
    for (let i: number = 0; i < this.entryObjects.length; i++) {
      // position entry pieces
      Transform.getMutable(this.entryObjects[i].entityParent).position =
        Vector3.create(
          this.entryOffsetAll.x,
          this.entryOffsetAll.y - i * this.entrySpacing,
          this.entryOffsetAll.z
        )
      Transform.getMutable(this.entryObjects[i].entityPlayerNameText).position =
        Vector3.create(
          this.entryOffsetName.x,
          this.entryOffsetName.y,
          this.entryOffsetName.z
        )
      Transform.getMutable(
        this.entryObjects[i].entityPlayerScoreText
      ).position = Vector3.create(
        this.entryOffsetScore.x,
        this.entryOffsetScore.y,
        this.entryOffsetScore.z
      )
    }
  }

  /** redraws the entire entry menu, redefining the font size of all entries */
  public SetEntryFontSize(value: number): void {
    for (let i: number = 0; i < this.entryObjects.length; i++) {
      // resize text
      TextShape.getMutable(this.entryObjects[i].entityPlayerNameText).fontSize =
        value
      TextShape.getMutable(
        this.entryObjects[i].entityPlayerScoreText
      ).fontSize = value
    }
  }

  /** sets the number of scores being displayed */
  public SetEntryCount(count: number): void {
    // ensure correct number of score entries
    while (this.entryObjects.length !== count) {
      // add entry
      if (this.entryObjects.length < count) {
        // create entry
        const entry: ScoreboardDisplayEntry = new ScoreboardDisplayEntry(
          this.entityParent
        )
        TextShape.getMutable(entry.entityPlayerNameText).text = '-'
        TextShape.getMutable(entry.entityPlayerNameText).textColor =
          this.entryColourName
        TextShape.getMutable(entry.entityPlayerScoreText).text = '-'
        TextShape.getMutable(entry.entityPlayerScoreText).textColor =
          this.entryColourName
        // position entry
        Transform.getMutable(entry.entityParent).position = Vector3.create(
          this.entryOffsetAll.x,
          this.entryOffsetAll.y - this.entryObjects.length * this.entrySpacing,
          this.entryOffsetAll.z
        )
        // add to collection
        this.entryObjects.push(entry)
      }
      // remove entry
      else {
        const entry = this.entryObjects.pop()
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (entry) engine.removeEntity(entry.entityParent)
      }
    }
  }

  updateLog: string = ''
  /** attempts to get fresh score data from the server and redraws the display */
  public UpdateScoreDisplay(): void {
    this.updateLog =
      'Scoreboard Display: updating scoreboard target' + this.targetTable
    executeTask(async () => {
      try {
        if (ScoreboardDisplayObject.IsDebugging)
          console.log('Scoreboard Display: getting highscores')
        // attempt to get and sort highscores from server
        const url = LAMBDA_URL + '/' + this.targetTable
        const response = await fetch(url)
        if (ScoreboardDisplayObject.IsDebugging)
          console.log('Scoreboard Display: parsing highscores')
        const json = await response.json()
        const items = json.Items
        // remove guest entries from items (NOTE: this is a quick fix solution)
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        const cleanedItems = items.filter(
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          (item: any) => !item.username.includes('Guest#')
        )
        // sort entries
        if (ScoreboardDisplayObject.IsDebugging)
          console.log('Scoreboard Display: sorting highscores')
        const sorted = cleanedItems.sort((a: any, b: any) => {
          // sort based on type
          switch (this.entrySorting) {
            case PLAYER_SCORE_SORTING_TYPES.HIGHEST_TOP:
              if (a[this.targetValue] > b[this.targetValue]) return -1
              break
            case PLAYER_SCORE_SORTING_TYPES.LOWEST_TOP:
              if (a[this.targetValue] < b[this.targetValue]) return -1
              break
          }
          // end-case
          return 1
        })
        if (ScoreboardDisplayObject.IsDebugging)
          console.log('Scoreboard Display: sorted highscores')
        if (ScoreboardDisplayObject.IsDebugging)
          this.updateLog += '\n\tfound scores:'

        // update scoreboard entries
        for (let i = 0; i < this.entryObjects.length; i++) {
          if (i < sorted.length) {
            // format fetched values (this should happen on server-side as well, but currently does not)
            const name = sorted[i][this.targetName].replace(/\s+/g, '')
            var score = sorted[i][this.targetValue]
            // process required formatting
            switch (this.valueDisplayType) {
              // format as time
              case PLAYER_SCORE_TYPES.TIME:
                score = this.formatTime(score)
                break
            }
            if (ScoreboardDisplayObject.IsDebugging)
              this.updateLog +=
                '\n\tentry-' + i + ": '" + name + "' '" + score + "'"
            // update score entry display
            TextShape.getMutable(
              this.entryObjects[i].entityPlayerNameText
            ).text = name
            TextShape.getMutable(
              this.entryObjects[i].entityPlayerScoreText
            ).text = score
            // work around for displaying accurate levels
            if (this.targetValue === 'lvl')
              TextShape.getMutable(
                this.entryObjects[i].entityPlayerScoreText
              ).text = score + 1
          } else {
            if (ScoreboardDisplayObject.IsDebugging)
              this.updateLog += '\n\tentry-' + i + ': no data'
            TextShape.getMutable(
              this.entryObjects[i].entityPlayerNameText
            ).text = '-'
            TextShape.getMutable(
              this.entryObjects[i].entityPlayerScoreText
            ).text = '-'
          }
        }
        if (ScoreboardDisplayObject.IsDebugging) console.log(this.updateLog)
      } catch (e) {
        console.log(
          'Scoreboard Display: error fetching leaderboards from server ',
          e
        )
      }
    })
  }

  private formatTime(time: string): string {
    const secNum = parseFloat(time)
    var minutes = Math.floor(secNum / 60) % 60
    var seconds = (secNum % 60).toFixed(2)

    return [minutes, seconds]
      .map((v) => (+v < 10 ? '0' + v : v))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':')
  }
}
