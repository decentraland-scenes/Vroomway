/**     ACCESSORY DATA
    this file contains all types and defs for vroomway accessories, including their
    rarity, effects, and indexing details.

    to add a new accessory:
    1 - create a new entry within the 'ACCESSORY_ID' enum
    2 - create a new entry within the 'AccessoryData' array,
        using the element created in step 1 as the 'id'
*/

import { RARITY_TYPE } from '../inventory/rarity-data'
import { accesoriesSprites } from '../ui/atlas/accesoriesSprites'
import { type Sprite } from '../ui/utils/utils'
import { PLAYER_BONUS_TYPE, type PlayerBonusDataObject } from './vehicle-data'

/** defines the atlas sheets for all accessory icons */
export const ATLAS_SHEET_ACCESSORY = [
  'images/uiAtlas/itemsAtlas.png', // atlas sheet 0
  'images/uiAtlas/itemsAtlas2.png' // atlas sheet 1
]

/** ensure standardization between all data objects
 * (you can ignore this unless you want to mod the object's data def)
 */
/** listing of all accessories managed by the system (allows checks for specific accessories without
 * having to hunt the ID and makes the debug logs more readable. these are identical to the name
 * on the server table)
 */
export enum ACCESSORY_ID {
  NONE = 'none',
  // ###   TIER 1
  WINGS_BETA = 'betaWings',
  WINGS_MASTER = 'masterWings',
  AURA_VROOMWAY = 'vmAura',
  // ###   TIER 2
  TROPHY_1 = 'trophyOne',
  TROPHY_2 = 'trophyTwo',
  LEVEL_CROWN = 'levelCrown',
  // ###   TIER 3
  RACER_JACKET = 'racerJacket'
}

export type AccessoryDataObject = {
  // INDEXING
  Rarity: RARITY_TYPE // accessory's rarity (defines number of attachments)
  ID: ACCESSORY_ID // access id of object (used for registry access & server communications)
  // STATS
  Name: string // display name for accessory
  Bonuses: PlayerBonusDataObject[] // all bonuses associated with this accessory
  // NFT (if source is empty anyone can wear it, otherwise the given urn must exist in the player's wearables)
  NFTSourceURN: string // where the collection is hosted
  // DISPLAY 2D (inventory icon details)
  SheetIndex: number
  Sprite: Sprite
  // DISPLAY 3D
  Model: string // path to display model for accessory
}
/** registry of all accessory */
export const AccessoryData: AccessoryDataObject[] = [
  // ###   TIER # ACCESSORIES
  {
    Rarity: RARITY_TYPE.RARE,
    ID: ACCESSORY_ID.WINGS_BETA,
    // STATS
    Name: 'Beta Wings',
    Bonuses: [{ Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.05 }],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0x8803d94e27b3844dd191fe354ec5d88b49c66f5d:0',
    // DISPLAY 2D
    SheetIndex: 0,
    Sprite: accesoriesSprites[ACCESSORY_ID.WINGS_BETA],
    // DISPLAY 3D
    Model: ''
  },
  {
    Rarity: RARITY_TYPE.RARE,
    ID: ACCESSORY_ID.WINGS_MASTER,
    // STATS
    Name: 'Master Wings',
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.06 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.06 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 2 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xff6d2c1544e4af0796879d37f36af60973b4be2d:0',
    // DISPLAY 2D
    SheetIndex: 0,
    Sprite: accesoriesSprites[ACCESSORY_ID.WINGS_MASTER],
    // DISPLAY 3D
    Model: ''
  },
  {
    Rarity: RARITY_TYPE.RARE,
    ID: ACCESSORY_ID.AURA_VROOMWAY,
    // STATS
    Name: 'Vroomway Aura',
    Bonuses: [{ Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.02 }],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0x9d82a09b425e90e0b6dc7cdf34d5bf6db37362c4:0',
    // DISPLAY 2D
    SheetIndex: 0,
    Sprite: accesoriesSprites[ACCESSORY_ID.AURA_VROOMWAY],
    // DISPLAY 3D
    Model: ''
  },

  // ###   TIER # ACCESSORIES
  {
    Rarity: RARITY_TYPE.MYTHIC,
    ID: ACCESSORY_ID.TROPHY_1,
    // STATS
    Name: 'Trophy 1',
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.08 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.08 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 4 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xc0b2ab864ca328c94b04bdaa03b413b503331e7f:0',
    // DISPLAY 2D
    SheetIndex: 0,
    Sprite: accesoriesSprites[ACCESSORY_ID.TROPHY_1],
    // DISPLAY 3D
    Model: ''
  },
  {
    Rarity: RARITY_TYPE.MYTHIC,
    ID: ACCESSORY_ID.TROPHY_2,
    // STATS
    Name: 'Trophy 2',
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.07 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.07 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 3 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0x219d62f29682bbfd5379a08943f60738c8b2f0c3:0',
    // DISPLAY 2D
    SheetIndex: 0,
    Sprite: accesoriesSprites[ACCESSORY_ID.TROPHY_2],
    // DISPLAY 3D
    Model: ''
  },
  {
    Rarity: RARITY_TYPE.MYTHIC,
    ID: ACCESSORY_ID.LEVEL_CROWN,
    // STATS
    Name: 'Level Crown',
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 5 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xae4addb9783658c6ac331e13820a8d4d330e2606:0',
    // DISPLAY 2D
    SheetIndex: 0,
    Sprite: accesoriesSprites[ACCESSORY_ID.LEVEL_CROWN],
    // DISPLAY 3D
    Model: ''
  },

  // ###   TIER # ACCESSORIES
  {
    Rarity: RARITY_TYPE.MYTHIC,
    ID: ACCESSORY_ID.RACER_JACKET,
    // STATS
    Name: 'Racer Jacket',
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.05 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.05 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 3 },
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.05 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0x92e99608d311842eafad39b7e974ac4e108307c9:0',
    // DISPLAY 2D
    SheetIndex: 0,
    Sprite: accesoriesSprites[ACCESSORY_ID.RACER_JACKET],
    // DISPLAY 3D
    Model: ''
  }
]
