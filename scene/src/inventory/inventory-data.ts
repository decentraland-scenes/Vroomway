/*      INVENTORY ITEM DATA
    this file contains all object definitions for items the player can gather, craft, etc.
    counts/values of these items are managed through the 'PlayerStats' class
    leveling data objects (experience and prestige) are also defined here as well b.c they are
        simply a different type of inventory item the way they are being used (basically flag checks)
  
    NOTE: all IDs should be unique across ALL objects
 
    author: Alex Pazder
    contact: TheCryptoTrader69@gmail.com 
*/

import { itemsSprites } from '../ui/atlas/itemsSprites'
import { type Sprite } from '../ui/utils/utils'

// interfaces
export type BaseObject = {
  ID: string // unique index, this is the value sent to the server
  Name: string // display name
  Desc: string // display desc, hover text
  Sprite: Sprite
}
export type CargoObject = {
  ID: string // unique index, this is the value sent to the server
  Name: string // display name
  Desc: string // display desc, hover text
  Rewards: Array<{ Type: number; ID: string; Count: number }> // represents rewards that are awarded upon opening
  // DISPLAY 2D
  Sprite: Sprite
}
export type ResourceObject = {
  ID: string // unique index, this is the value sent to the server
  Rarity: number // TODO: noticed this in the rewards calculator, but currently not implemented
  Name: string // display name
  Desc: string // display desc, hover text
  // DISPLAY 2
  Sprite: Sprite
}
/** call-values for IDs, leveling */
export enum ItemNameLeveling {
  exp = 'exp',
  lvl = 'lvl'
}
/** contains all object definitions for leveling items */
export const LevelingObjectData: BaseObject[] = [
  // experience
  {
    ID: 'exp',
    Name: 'Experience',
    Desc: '<HOVER_TEXT>',

    Sprite: itemsSprites.exp
  },
  // prestige
  {
    ID: 'lvl',
    Name: 'Prestige',
    Desc: '<HOVER_TEXT>',

    Sprite: itemsSprites.lvl
  }
]
/** call-values for IDs, resources */
export enum ItemNameResource {
  coins = 'coins',
  fuel = 'fuel',
  metal = 'metal',
  rubber = 'rubber',
  glass = 'glass',
  propulsion = 'propulsion',
  wires = 'wires',
  antimatter = 'antimatter',
  cannisters = 'cannisters',
  circuitBoard = 'circuitBoard'
}

export const ResourceObjectData: ResourceObject[] = [
  {
    ID: 'coins',
    Rarity: -1,
    Name: 'Coins',
    Desc: '<HOVER_TEXT>',
    Sprite: itemsSprites.coins
  },
  {
    ID: 'fuel',
    Rarity: -1,
    Name: 'Fuel',
    Desc: '<HOVER_TEXT>',

    Sprite: itemsSprites.fuel
  },
  // basic
  {
    ID: 'metal',
    Rarity: 0,
    Name: 'Metal',
    Desc: '<HOVER_TEXT>',

    Sprite: itemsSprites.metal
  },
  {
    ID: 'rubber',
    Rarity: 0,
    Name: 'Rubber',
    Desc: '<HOVER_TEXT>',

    Sprite: itemsSprites.rubber
  },
  {
    ID: 'glass',
    Rarity: 1,
    Name: 'Glass',
    Desc: '<HOVER_TEXT>',

    Sprite: itemsSprites.glass
  },
  {
    ID: 'wires',
    Rarity: 1,
    Name: 'Wires',
    Desc: '<HOVER_TEXT>',

    Sprite: itemsSprites.wires
  },
  // components
  {
    ID: 'cannisters',
    Rarity: 2,
    Name: 'Cannisters',
    Desc: '<HOVER_TEXT>',

    Sprite: itemsSprites.cannisters
  },
  {
    ID: 'circuitBoard',
    Rarity: 2,
    Name: 'Circuit Boards',
    Desc: '<HOVER_TEXT>',

    Sprite: itemsSprites.circuitBoard
  },
  {
    ID: 'propulsion',
    Rarity: 3,
    Name: 'Propulsion',
    Desc: '<HOVER_TEXT>',

    Sprite: itemsSprites.propulsion
  },
  {
    ID: 'antimatter',
    Rarity: 3,
    Name: 'Antimatter',
    Desc: '<HOVER_TEXT>',

    Sprite: itemsSprites.antimatter
  }
]

/** call-values for IDs, cargo */
export enum ItemNameCargo {
  smCargo = 'smCargo',
  mdCargo = 'mdCargo',
  lgCargo = 'lgCargo'
}
/** all cargo objects */
export const CargoObjectData: CargoObject[] = [
  {
    ID: 'smCargo',
    Name: 'Small Cargo',
    Desc: '<HOVER_TEXT>',
    Rewards: [
      { Type: -1, ID: '0', Count: 5 }, // loot generation rounds
      { Type: 0, ID: '0', Count: 5 } // experience
    ],

    Sprite: itemsSprites.smCargo
  },
  {
    ID: 'mdCargo',
    Name: 'Medium Cargo',
    Desc: '<HOVER_TEXT>',
    Rewards: [
      { Type: -1, ID: '0', Count: 12 }, // loot generation rounds
      { Type: 0, ID: '0', Count: 10 } // experience
    ],

    Sprite: itemsSprites.mdCargo
  },
  {
    ID: 'lgCargo',
    Name: 'Large Cargo',
    Desc: '<HOVER_TEXT>',
    Rewards: [
      { Type: -1, ID: '0', Count: 40 }, // loot generation rounds
      { Type: 0, ID: '0', Count: 25 } // experience
    ],

    Sprite: itemsSprites.lgCargo
  }
]
/** call-values for IDs, tokens */
export enum ItemNameToken {
  token0 = 'token0',
  token1 = 'token1',
  token2 = 'token2'
}
/** all tokens objects */
export const TokenObjectData: BaseObject[] = [
  {
    ID: 'token0',
    Name: 'Common Token',
    Desc: '<HOVER_TEXT>',

    Sprite: itemsSprites.token0
  },
  {
    ID: 'token1',
    Name: 'Uncommon Token',
    Desc: '<HOVER_TEXT>',

    Sprite: itemsSprites.token1
  },
  {
    ID: 'token2',
    Name: 'Rare Token',
    Desc: '<HOVER_TEXT>',

    Sprite: itemsSprites.token2
  }
]

/** call-values for IDs, power ups */
export enum ItemNamePowerUp {
  PlayerInvincible = 'healthinvincible15s',
  PlayerHeal = 'healthPlus50',
  BonusCoins = 'multipleCoins2x',
  BonusExp = 'multipleXp2x',
  WeaponBoost = 'projectileDamagePlus5',
  WeaponTrap = 'projectileTrap'
}
/** all power up objects */
export const PowerUpObjectData: BaseObject[] = [
  {
    ID: 'healthinvincible15s',
    Name: 'Invincibility',
    Desc: 'Provides immunity for a small period of time',

    Sprite: itemsSprites.healthinvincible15s
  },
  {
    ID: 'healthPlus50',
    Name: 'Repair Kit',
    Desc: 'Restores X health',

    Sprite: itemsSprites.healthPlus50
  },
  {
    ID: 'multipleCoins2x',
    Name: 'Coin Booster',
    Desc: 'Greatly increases the number of coins gained',

    Sprite: itemsSprites.multipleCoins2x
  },
  {
    ID: 'multipleXp2x',
    Name: 'Exp Booster',
    Desc: 'Greatly increases the amount of experience gained',

    Sprite: itemsSprites.multipleXp2x
  },
  {
    ID: 'projectileDamagePlus5',
    Name: 'Weapon Booster',
    Desc: 'Increases weapon damage by X',

    Sprite: itemsSprites.projectileDamagePlus5
  },
  {
    ID: 'projectileTrap',
    Name: 'Snap Trap',
    Desc: '<HOVER_TEXT>',

    Sprite: itemsSprites.projectileTrap
  }
]
