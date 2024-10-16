/**     VEHICLE DATA
    this file contains all types and defs for vroomway vehicles, including their
    rarity, effects, and indexing details.

    to add a new vehicle:
    1 - create a new entry within the 'VEHICLE_ID' enum
    2 - create a new entry within the 'VehicleData' array,
        using the element created in step 1 as the 'id'
*/

import { RARITY_TYPE } from '../inventory/rarity-data'
import { vehiclesSprites } from '../ui/atlas/vehiclesSprites'
import { type Sprite } from '../ui/utils/utils'

/** defines the atlas sheets for all vehicle icons */
export const ATLAS_SHEET_VEHICLE = [
  'images/uiAtlas/itemsAtlas.png', // atlas sheet 0
  'images/uiAtlas/itemsAtlas2.png' // atlas sheet 1
]

/** ensure standardization between all data objects
 * (you can ignore this unless you want to mod the object's data def)
 */
/** listing of all possible bonuses that can be applied to the player */
export enum PLAYER_BONUS_TYPE {
  // leveling
  EXPERIENCE_GAIN_PERCENT = 'EXPERIENCE_GAIN_PERCENT',
  // coins
  COIN_GAIN_PERCENT = 'COIN_GAIN_PERCENT',
  // fuel
  FUEL_GAIN_PERCENT = 'FUEL_COST_PERCENT',
  FUEL_COST_PERCENT = 'FUEL_COST_PERCENT',
  // gathering
  GATHERING_GAIN_FLAT = 'GATHERING_GAIN_FLAT',
  // health
  HEALTH_FLAT = 'HEALTH_FLAT',
  // speed
  SPEED_BOOST_PERCENT = 'SPEED_BOOST_PERCENT'
}
/** defines a bonus effect on an item */
export type PlayerBonusDataObject = {
  Type: PLAYER_BONUS_TYPE
  Power: number
}
/** listing of all vehicles managed by the system (allows checks for specific vehicles without
 * having to hunt the ID and makes the debug logs more readable. these are identical to the name
 * on the server table)
 */
export enum VEHICLE_ID {
  NONE = 'none',
  // ###   TIER 1
  SPEED_BOOTS_L1 = 'speedBoots1',
  SPEED_BOOTS_L2 = 'speedBoots2',
  SPEED_BOOTS_L3 = 'speedBoots3',
  // ###   TIER 2
  HOVER_BIKE_L1 = 'hoverBike1',
  HOVER_BIKE_L2 = 'hoverBike2',
  HOVER_BIKE_L3 = 'hoverBike3',
  BRUTE_L1 = 'brute1',
  BRUTE_L2 = 'brute2',
  BRUTE_L3 = 'brute3',
  // ###   TIER 3
  HOVER_CAR_L1 = 'hoverCar1',
  HOVER_CAR_L2 = 'hoverCar2',
  HOVER_CAR_L3 = 'hoverCar3',
  // ###   TIER 4
  VROOM_VROOM = 'vroomVroom',
  MODEL_O = 'modelO',
  WONDER_VROOM = 'wonderVroom',
  DIAMOND_VROOM = 'diamondVroom',
  BUILDA_VROOM = 'buildaVroom',
  CADDY_VROOM = 'caddyVroom',
  BROOM_VROOM = 'broomVroom',
  KITTY_VROOM = 'kittyVroom',
  // ###   TIER 5
  DIVINITY = 'divinity',
  PLEATHER_BIKE = 'pleather',
  OCEAN_PEAFOWL = 'peafowl',
  FUEGO_MACHINA = 'machina',
  JUNKER_VAN = 'junkerVan',
  VROOM_WING = 'vroomWing',
  ROLLER_VROOM = 'rollerVroom',
  BOSIER = 'bosier',
  RATTY_VROOM = 'rattyVroom',
  // ###   TIER 6
  GRAND_PRIX_GOLD = 'goldSaucer',
  GRAND_PRIX_SILVER = 'silverSaucer',
  GRAND_PRIX_BRONZE = 'bronzeSaucer',
  GRAND_PRIX_GOLD_23 = 'goldSaucer2',
  GRAND_PRIX_SILVER_23 = 'silverSaucer2',
  GRAND_PRIX_BRONZE_23 = 'bronzeSaucer2',
  FLAMES_END = 'flamesEnd',
  TIDE_BREAKER = 'tideBreaker',
  VIRIDIAN_QUAKE = 'viridianQuake',
  OBSIDIAN_STRIKE = 'obsidianStrike',
  OPULENT = 'opulent'
}

export type VehicleDataObject = {
  // INDEXING
  Rarity: RARITY_TYPE // vehicle's rarity (defines number of attachments)
  ID: VEHICLE_ID // access id of object (used for registry access & server communications)
  // STATS
  Name: string // display name for vehicle
  SpeedMax: number // defines the max speed the player can move when this vehicle is equipped
  Bonuses: PlayerBonusDataObject[] // all bonuses associated with this vehicle
  // NFT (if source is empty anyone can wear it, otherwise the given urn must exist in the player's wearables)
  NFTSourceURN: string // where the collection is hosted
  // DISPLAY 2D (inventory icon details)
  Sprite: Sprite
  // DISPLAY 3D
  Model: string // path to display model for vehicle
}
/** registry of all vehicle */
export const VehicleData: VehicleDataObject[] = [
  // ###   TIER 1 VEHICLES
  {
    Rarity: RARITY_TYPE.RARE,
    ID: VEHICLE_ID.SPEED_BOOTS_L1,
    // STATS
    Name: 'Speed Boots L1',
    SpeedMax: 122,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 1 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.02 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:0',
    // DISPLAY 2D
    Sprite: vehiclesSprites.speedBoots1,
    // DISPLAY 3D
    Model: 'sbVehicle1.glb'
  },
  {
    Rarity: RARITY_TYPE.RARE,
    ID: VEHICLE_ID.SPEED_BOOTS_L2,
    // STATS
    Name: 'Speed Boots L2',
    SpeedMax: 122,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 3 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.02 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:1',
    // DISPLAY 2D
    Sprite: vehiclesSprites.speedBoots2,
    // DISPLAY 3D
    Model: 'sbVehicle2.glb'
  },
  {
    Rarity: RARITY_TYPE.RARE,
    ID: VEHICLE_ID.SPEED_BOOTS_L3,
    // STATS
    Name: 'Speed Boots L3',
    SpeedMax: 122,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 6 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.02 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:2',
    // DISPLAY 2D
    Sprite: vehiclesSprites.speedBoots3,
    // DISPLAY 3D
    Model: 'sbVehicle3.glb'
  },

  // ###   TIER 2 VEHICLES
  {
    Rarity: RARITY_TYPE.EPIC,
    ID: VEHICLE_ID.HOVER_BIKE_L1,
    // STATS
    Name: 'Hover-Bike L1',
    SpeedMax: 124,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.05 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 1 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.03 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:3',
    // DISPLAY 2D
    Sprite: vehiclesSprites.hoverBike1,
    // DISPLAY 3D
    Model: 'hbVehicle1.glb'
  },
  {
    Rarity: RARITY_TYPE.EPIC,
    ID: VEHICLE_ID.HOVER_BIKE_L2,
    // STATS
    Name: 'Hover-Bike L2',
    SpeedMax: 125,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.07 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 3 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.04 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:4',
    // DISPLAY 2D
    Sprite: vehiclesSprites.hoverBike2,
    // DISPLAY 3D
    Model: 'hbVehicle2.glb'
  },
  {
    Rarity: RARITY_TYPE.EPIC,
    ID: VEHICLE_ID.HOVER_BIKE_L3,
    // STATS
    Name: 'Hover-Bike L3',
    SpeedMax: 127,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.1 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 6 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.06 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:5',
    // DISPLAY 2D
    Sprite: vehiclesSprites.hoverBike3,
    // DISPLAY 3D
    Model: 'hbVehicle3.glb'
  },
  {
    Rarity: RARITY_TYPE.EPIC,
    ID: VEHICLE_ID.BRUTE_L1,
    // STATS
    Name: 'Brute L1',
    SpeedMax: 124,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 1 },
      { Type: PLAYER_BONUS_TYPE.HEALTH_FLAT, Power: 10 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.03 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xc294467684315e7d28aa503ac571df08d4f829be:0',
    // DISPLAY 2D
    Sprite: vehiclesSprites.brute1,
    // DISPLAY 3D
    Model: 'bruteVehicle1.glb'
  },
  {
    Rarity: RARITY_TYPE.EPIC,
    ID: VEHICLE_ID.BRUTE_L2,
    // STATS
    Name: 'Brute L2',
    SpeedMax: 125,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 3 },
      { Type: PLAYER_BONUS_TYPE.HEALTH_FLAT, Power: 20 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.04 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xc294467684315e7d28aa503ac571df08d4f829be:1',
    // DISPLAY 2D
    Sprite: vehiclesSprites.brute2,
    // DISPLAY 3D
    Model: 'bruteVehicle2.glb'
  },
  {
    Rarity: RARITY_TYPE.EPIC,
    ID: VEHICLE_ID.BRUTE_L3,
    // STATS
    Name: 'Brute L3',
    SpeedMax: 127,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 6 },
      { Type: PLAYER_BONUS_TYPE.HEALTH_FLAT, Power: 30 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.06 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xc294467684315e7d28aa503ac571df08d4f829be:2',
    // DISPLAY 2D
    Sprite: vehiclesSprites.brute3,
    // DISPLAY 3D
    Model: 'bruteVehicle3.glb'
  },

  // ###   TIER 3 VEHICLES
  {
    Rarity: RARITY_TYPE.LEGENDARY,
    ID: VEHICLE_ID.HOVER_CAR_L1,
    // STATS
    Name: 'Hover-Car L1',
    SpeedMax: 128,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.05 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 1 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.07 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:6',
    // DISPLAY 2D
    Sprite: vehiclesSprites.hoverCar1,
    // DISPLAY 3D
    Model: 'hcVehicle1.glb'
  },
  {
    Rarity: RARITY_TYPE.LEGENDARY,
    ID: VEHICLE_ID.HOVER_CAR_L2,
    // STATS
    Name: 'Hover-Car L2',
    SpeedMax: 130,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.07 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 3 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.08 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:7',
    // DISPLAY 2D
    Sprite: vehiclesSprites.hoverCar2,
    // DISPLAY 3D
    Model: 'hcVehicle2.glb'
  },
  {
    Rarity: RARITY_TYPE.LEGENDARY,
    ID: VEHICLE_ID.HOVER_CAR_L3,
    // STATS
    Name: 'Hover-Car L3',
    SpeedMax: 132,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.1 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 6 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.1 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xed0c8eaf9d0a04a24701a90da2580da9cf46fb45:8',
    // DISPLAY 2D
    Sprite: vehiclesSprites.hoverCar3,
    // DISPLAY 3D
    Model: 'hcVehicle3.glb'
  },

  // ###   TIER 4 VEHICLES
  {
    Rarity: RARITY_TYPE.EXOTIC,
    ID: VEHICLE_ID.VROOM_VROOM,
    // STATS
    Name: 'VroomVroom',
    SpeedMax: 134,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.05 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.05 },
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.12 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 7 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.12 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0x320a144099546e6561f4747686f79ec6a5c24e27:0',
    // DISPLAY 2D
    Sprite: vehiclesSprites.vroomVroom,
    // DISPLAY 3D
    Model: 'vroomVehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.EXOTIC,
    ID: VEHICLE_ID.MODEL_O,
    // STATS
    Name: 'Model O',
    SpeedMax: 134,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.02 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.05 },
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.12 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 7 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.12 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0x1306d694871ec48aa03dd36f384afa1605cce900:0',
    // DISPLAY 2D
    Sprite: vehiclesSprites.model0,
    // DISPLAY 3D
    Model: 'modelOVehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.EXOTIC,
    ID: VEHICLE_ID.WONDER_VROOM,
    // STATS
    Name: 'WonderVroom',
    SpeedMax: 134,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.05 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.07 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 8 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.12 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xed2692690fb36a4906ec8d04add42e2fa1510151:0',
    // DISPLAY 2D
    Sprite: vehiclesSprites.wonderVroom,
    // DISPLAY 3D
    Model: 'wonderVroomVehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.EXOTIC,
    ID: VEHICLE_ID.DIAMOND_VROOM,
    // STATS
    Name: 'DiamondVroom',
    SpeedMax: 134,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.05 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.12 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0x40519b3aebc58a489d576962a02efca7497faf44:0',
    // DISPLAY 2D
    Sprite: vehiclesSprites.diamondVroom,
    // DISPLAY 3D
    Model: 'diamondVroomVehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.EXOTIC,
    ID: VEHICLE_ID.BUILDA_VROOM,
    // STATS
    Name: 'BuildaVroom',
    SpeedMax: 134,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.05 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.12 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0x681a6e37e96340f21bf7401e3d770d10e3e1f1d7:0',
    // DISPLAY 2D
    Sprite: vehiclesSprites.buildaVroom,

    // DISPLAY 3D
    Model: 'buildaVroomVehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.EXOTIC,
    ID: VEHICLE_ID.CADDY_VROOM,
    // STATS
    Name: 'CaddyVroom',
    SpeedMax: 134,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.05 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.12 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xfc96c422101e708da022ebe19037eac741024a0e:0',
    // DISPLAY 2D
    Sprite: vehiclesSprites.caddyVroom,
    // DISPLAY 3D
    Model: 'caddyVroomVehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.EXOTIC,
    ID: VEHICLE_ID.BROOM_VROOM,
    // STATS
    Name: 'BroomVroom',
    SpeedMax: 134,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.05 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.12 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xd8f18e6791dbb3468a793791e6ad9ca782643c69:3',
    // DISPLAY 2D
    Sprite: vehiclesSprites.broomVroom,
    // DISPLAY 3D
    Model: 'broomVroomVehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.EXOTIC,
    ID: VEHICLE_ID.KITTY_VROOM,
    // STATS
    Name: 'KittyVroom',
    SpeedMax: 134,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.05 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.05 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.12 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xd62cb20c1fc76962aae30e7067babdf66463ffe3:0',
    // DISPLAY 2D
    Sprite: vehiclesSprites.kittyVroom,
    // DISPLAY 3D
    Model: 'kittyVroomVehicle.glb'
  },

  // ###   TIER 5 VEHICLES
  {
    Rarity: RARITY_TYPE.MYTHIC,
    ID: VEHICLE_ID.DIVINITY,
    // STATS
    Name: 'Divinity',
    SpeedMax: 138,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.07 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.15 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 9 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.15 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0x1628fcce52a0d2c671fe828bea0102c76d27c73e:0',
    // DISPLAY 2D
    Sprite: vehiclesSprites.divinity,
    // DISPLAY 3D
    Model: 'divinityVehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.MYTHIC,
    ID: VEHICLE_ID.PLEATHER_BIKE,
    // STATS
    Name: 'Pleather Bike',
    SpeedMax: 138,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.07 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.15 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 9 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.15 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0x3c75b3bd751eb90db5e992e0c735d8e4df386906:0',
    // DISPLAY 2D
    Sprite: vehiclesSprites.pleather,
    // DISPLAY 3D
    Model: 'pleatherVehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.MYTHIC,
    ID: VEHICLE_ID.OCEAN_PEAFOWL,
    // STATS
    Name: 'Ocean Peafowl',
    SpeedMax: 138,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.07 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.15 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 9 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.15 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0x50480f858791fbbc1149a66af7fb983f2e1114e5:0',
    // DISPLAY 2D
    Sprite: vehiclesSprites.peafowl,
    // DISPLAY 3D
    Model: 'peafowlVehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.MYTHIC,
    ID: VEHICLE_ID.FUEGO_MACHINA,
    // STATS
    Name: 'Fuego Machina',
    SpeedMax: 138,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.07 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.15 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 9 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.15 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0x2555a974177d05b50472343701e74594e14af5fc:0',
    // DISPLAY 2D
    Sprite: vehiclesSprites.machina,
    // DISPLAY 3D
    Model: 'machinaVehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.MYTHIC,
    ID: VEHICLE_ID.JUNKER_VAN,
    // STATS
    Name: 'Junker Van',
    SpeedMax: 138,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.07 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.15 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 9 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.15 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xf907f7abe1af828ac16fd5525df019c6e44cf977:0',
    // DISPLAY 2D
    Sprite: vehiclesSprites.junkerVan,
    // DISPLAY 3D
    Model: 'junkerkingVanVehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.MYTHIC,
    ID: VEHICLE_ID.VROOM_WING,
    // STATS
    Name: 'VroomWing',
    SpeedMax: 138,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.07 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.15 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 9 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.15 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0x52f5931b5658d59ee9f740b94ebcb104ab87770e:0',
    // DISPLAY 2D
    Sprite: vehiclesSprites.vroomWing,
    // DISPLAY 3D
    Model: 'vroomWingVehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.MYTHIC,
    ID: VEHICLE_ID.ROLLER_VROOM,
    // STATS
    Name: 'RollerVroom',
    SpeedMax: 138,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.07 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.15 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 9 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.15 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xbed6f4dad1326d7ad268cc1d6beab911566f0e98:0',
    // DISPLAY 2D
    Sprite: vehiclesSprites.rollerVroom,
    // DISPLAY 3D
    Model: 'rollerVroomVehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.MYTHIC,
    ID: VEHICLE_ID.BOSIER,
    // STATS
    Name: 'Bosier',
    SpeedMax: 138,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.07 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.15 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 9 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.15 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0x2d19c4f2212ec37ed48eb8134ffbc0a695612986:1',
    // DISPLAY 2D
    Sprite: vehiclesSprites.bosier,
    // DISPLAY 3D
    Model: 'bosierVehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.MYTHIC,
    ID: VEHICLE_ID.RATTY_VROOM,
    // STATS
    Name: 'RattyVroom',
    SpeedMax: 138,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.07 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.15 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 9 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.15 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xf61d27b7899d2641b02c56f4617f2d01f63f7ee5:4',
    // DISPLAY 2D
    Sprite: vehiclesSprites.rattyVroom,
    // DISPLAY 3D
    Model: 'rattyVroomVehicle.glb'
  },

  // ###   TIER 6 VEHICLES
  {
    Rarity: RARITY_TYPE.UNIQUE,
    ID: VEHICLE_ID.GRAND_PRIX_BRONZE,
    // STATS
    Name: 'Grand Prix Bronze',
    SpeedMax: 140,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.15 },
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.17 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 11 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.17 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0x53d635a3732b03a2b288e7958c3478484959fb1a:2',
    // DISPLAY 2D
    Sprite: vehiclesSprites.bronzeSaucer,
    // DISPLAY 3D
    Model: 'bronzeSaucerVehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.UNIQUE,
    ID: VEHICLE_ID.GRAND_PRIX_SILVER,
    // STATS
    Name: 'Grand Prix Silver',
    SpeedMax: 140,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.15 },
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.17 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 11 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.17 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0x53d635a3732b03a2b288e7958c3478484959fb1a:1',
    // DISPLAY 2D
    Sprite: vehiclesSprites.silverSaucer,
    // DISPLAY 3D
    Model: 'silverSaucerVehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.UNIQUE,
    ID: VEHICLE_ID.GRAND_PRIX_GOLD,
    // STATS
    Name: 'Grand Prix Gold',
    SpeedMax: 140,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.15 },
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.17 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 11 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.17 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0x53d635a3732b03a2b288e7958c3478484959fb1a:0',
    // DISPLAY 2D
    Sprite: vehiclesSprites.goldSaucer,
    // DISPLAY 3D
    Model: 'goldSaucerVehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.UNIQUE,
    ID: VEHICLE_ID.GRAND_PRIX_BRONZE_23,
    // STATS
    Name: 'Grand Prix Bronze 2023',
    SpeedMax: 140,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.15 },
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.17 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 11 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.17 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xb6342949873342512c5bd0a48ad01b80bbe35e90:2',
    // DISPLAY 2D
    Sprite: vehiclesSprites.bronzeSaucer2,
    // DISPLAY 3D
    Model: 'bronzeSaucer2Vehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.UNIQUE,
    ID: VEHICLE_ID.GRAND_PRIX_SILVER_23,
    // STATS
    Name: 'Grand Prix Silver 2023',
    SpeedMax: 140,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.15 },
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.17 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 11 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.17 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xb6342949873342512c5bd0a48ad01b80bbe35e90:1',
    // DISPLAY 2D
    Sprite: vehiclesSprites.silverSaucer2,
    // DISPLAY 3D
    Model: 'silverSaucer2Vehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.UNIQUE,
    ID: VEHICLE_ID.GRAND_PRIX_GOLD_23,
    // STATS
    Name: 'Grand Prix Gold 2023',
    SpeedMax: 140,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.15 },
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.17 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 11 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.17 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xb6342949873342512c5bd0a48ad01b80bbe35e90:0',
    // DISPLAY 2D
    Sprite: vehiclesSprites.goldSaucer2,
    // DISPLAY 3D
    Model: 'goldSaucer2Vehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.UNIQUE,
    ID: VEHICLE_ID.FLAMES_END,
    // STATS
    Name: "Flame's End",
    SpeedMax: 140,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.15 },
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.17 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 11 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.17 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xa5f2cef962d2ad81db43a673a9a2b0e34f3df497:0',
    // DISPLAY 2D
    Sprite: vehiclesSprites.flamesEnd,
    // DISPLAY 3D
    Model: 'flamesEndVehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.UNIQUE,
    ID: VEHICLE_ID.TIDE_BREAKER,
    // STATS
    Name: 'Tide Beaker',
    SpeedMax: 140,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.15 },
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.17 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 11 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.17 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0x12d5b367c1d93a1920162d4fe21c1fafefcc6cc5:0',
    // DISPLAY 2D
    Sprite: vehiclesSprites.tideBreaker,
    // DISPLAY 3D
    Model: 'tideBreakerVehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.UNIQUE,
    ID: VEHICLE_ID.VIRIDIAN_QUAKE,
    // STATS
    Name: 'Viridian Quake',
    SpeedMax: 140,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.15 },
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.17 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 11 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.17 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0xdc9be77fbcee4d374cb5460bf4a71ab81bb9c6c2:0',
    // DISPLAY 2D
    Sprite: vehiclesSprites.viridianQuake,
    // DISPLAY 3D
    Model: 'viridianQuakeVehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.UNIQUE,
    ID: VEHICLE_ID.OBSIDIAN_STRIKE,
    // STATS
    Name: 'Obsidian Strike',
    SpeedMax: 140,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.15 },
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.17 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 11 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.17 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0x82426f63212180d16afc309f2d5dee4fc397165b:0',
    // DISPLAY 2D
    Sprite: vehiclesSprites.obsidianStrike,
    // DISPLAY 3D
    Model: 'obsidianStrikeVehicle.glb'
  },
  {
    Rarity: RARITY_TYPE.UNIQUE,
    ID: VEHICLE_ID.OPULENT,
    // STATS
    Name: 'Opulent',
    SpeedMax: 140,
    Bonuses: [
      { Type: PLAYER_BONUS_TYPE.EXPERIENCE_GAIN_PERCENT, Power: 0.1 },
      { Type: PLAYER_BONUS_TYPE.COIN_GAIN_PERCENT, Power: 0.15 },
      { Type: PLAYER_BONUS_TYPE.FUEL_COST_PERCENT, Power: -0.17 },
      { Type: PLAYER_BONUS_TYPE.GATHERING_GAIN_FLAT, Power: 11 },
      { Type: PLAYER_BONUS_TYPE.SPEED_BOOST_PERCENT, Power: 0.17 }
    ],
    // NFT
    NFTSourceURN:
      'urn:decentraland:matic:collections-v2:0x2d19c4f2212ec37ed48eb8134ffbc0a695612986:0',
    // DISPLAY 2D
    Sprite: vehiclesSprites.opulent,
    // DISPLAY 3D
    Model: 'opulentVehicle.glb'
  }
]
