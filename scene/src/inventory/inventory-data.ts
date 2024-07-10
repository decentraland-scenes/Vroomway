/*      INVENTORY ITEM DATA
    this file contains all object definitions for items the player can gather, craft, etc.
    counts/values of these items are managed through the 'PlayerStats' class
    leveling data objects (experience and prestige) are also defined here as well b.c they are
        simply a different type of inventory item the way they are being used (basically flag checks)
  
    NOTE: all IDs should be unique across ALL objects
 
    author: Alex Pazder
    contact: TheCryptoTrader69@gmail.com 
*/

/** defines the atlas sheets for all base items icons */
export const ATLAS_SHEET_ITEM = [
    "images/uiAtlas/itemsAtlas.png",   // atlas sheet 0
    "images/uiAtlas/itemsAtlas.png",   // atlas sheet 1
];

// interfaces
type BaseObject = {
    ID: string; // unique index, this is the value sent to the server
    Name: string;   // display name 
    Desc: string;   // display desc, hover text
    SheetIndex: number,
    IconPos: { width: string | number, height: string | number, srcWidth: number, srcHeight: number, srcTop: number, srcLeft: number };
}
type CargoObject = {
    ID: string; // unique index, this is the value sent to the server
    Name: string;   // display name 
    Desc: string;   // display desc, hover text
    Rewards: Array<{ Type: number, ID: string, Count: number }>;   // represents rewards that are awarded upon opening
    // DISPLAY 2D
    SheetIndex: number,
    IconPos: { width: string | number, height: string | number, srcWidth: number, srcHeight: number, srcTop: number, srcLeft: number };
}
type ResourceObject = {
    ID: string; // unique index, this is the value sent to the server
    Rarity: number; // TODO: noticed this in the rewards calculator, but currently not implemented
    Name: string;   // display name 
    Desc: string;   // display desc, hover text
    // DISPLAY 2D
    SheetIndex: number,
    IconPos: { width: string | number, height: string | number, srcWidth: number, srcHeight: number, srcTop: number, srcLeft: number };
}
/** call-values for IDs, leveling */
export enum ItemNameLeveling {
    exp = "exp", lvl = "lvl"
}
/** contains all object definitions for leveling items */
export const LevelingObjectData: BaseObject[] = [
    // experience
    {
        ID: "exp",
        Name: "Experience",
        Desc: "<HOVER_TEXT>",
        SheetIndex: 0,
        IconPos: { width: "55px", height: "55px", srcWidth: 240, srcHeight: 240, srcTop: 14.2, srcLeft: 270 }
    },
    // prestige
    {
        ID: "lvl",
        Name: "Prestige",
        Desc: "<HOVER_TEXT>",
        SheetIndex: 0,
        IconPos: { width: "55px", height: "55px", srcWidth: 240, srcHeight: 240, srcTop: 14.2, srcLeft: 270 }
    }
];
/** call-values for IDs, resources */
export enum ItemNameResource {
    coins = "coins", fuel = "fuel",
    metal = "metal", rubber = "rubber", glass = "glass", propulsion = "propulsion",
    wires = "wires", antimatter = "antimatter", cannisters = "cannisters", circuitBoard = "circuitBoard"
}
/** contains all object definitions for resource items 
 * NOTE: we can cull the width/height property IconPos objects if we align the splice sheet correctly
*/
export const ResourceObjectData: ResourceObject[] = [
    // core resources
    {
        ID: "coins",
        Rarity: -1,
        Name: "Coins",
        Desc: "<HOVER_TEXT>",
        SheetIndex: 0,
        IconPos: { width: "55px", height: "55px", srcWidth: 240, srcHeight: 240, srcTop: 14.2, srcLeft: 270 }
    },
    {
        ID: "fuel",
        Rarity: -1,
        Name: "Fuel",
        Desc: "<HOVER_TEXT>",
        SheetIndex: 0,
        IconPos: { width: "50px", height: "50px", srcWidth: 240, srcHeight: 240, srcTop: 14.2, srcLeft: 14.2 }
    },
    // basic
    {
        ID: "metal",
        Rarity: 0,
        Name: "Metal",
        Desc: "<HOVER_TEXT>",
        SheetIndex: 0,
        IconPos: { width: "55px", height: "53px", srcWidth: 240, srcHeight: 240, srcTop: 14.2, srcLeft: 784.9 }
    },
    {
        ID: "rubber",
        Rarity: 0,
        Name: "Rubber",
        Desc: "<HOVER_TEXT>",
        SheetIndex: 0,
        IconPos: { width: "55px", height: "53px", srcWidth: 240, srcHeight: 240, srcTop: 14.2, srcLeft: 528 }
    },
    {
        ID: "glass",
        Rarity: 1,
        Name: "Glass",
        Desc: "<HOVER_TEXT>",
        SheetIndex: 0,
        IconPos: { width: "55px", height: "53px", srcWidth: 240, srcHeight: 240, srcTop: 14.2, srcLeft: 1294.8 }
    },
    {
        ID: "wires",
        Rarity: 1,
        Name: "Wires",
        Desc: "<HOVER_TEXT>",
        SheetIndex: 0,
        IconPos: { width: "55px", height: "53px", srcWidth: 240, srcHeight: 240, srcTop: 14.2, srcLeft: 1808 }
    },
    // components
    {
        ID: "cannisters",
        Rarity: 2,
        Name: "Cannisters",
        Desc: "<HOVER_TEXT>",
        SheetIndex: 0,
        IconPos: { width: "55px", height: "54px", srcWidth: 240, srcHeight: 240, srcTop: 256.5, srcLeft: 14.2 }
    },
    {
        ID: "circuitBoard",
        Rarity: 2,
        Name: "Circuit Boards",
        Desc: "<HOVER_TEXT>",
        SheetIndex: 0,
        IconPos: { width: "55px", height: "53px", srcWidth: 240, srcHeight: 240, srcTop: 14.2, srcLeft: 1039.8 }
    },
    {
        ID: "propulsion",
        Rarity: 3,
        Name: "Propulsion",
        Desc: "<HOVER_TEXT>",
        SheetIndex: 0,
        IconPos: { width: "55px", height: "53px", srcWidth: 240, srcHeight: 240, srcTop: 14.2, srcLeft: 1553.1 }
    },
    {
        ID: "antimatter",
        Rarity: 3,
        Name: "Antimatter",
        Desc: "<HOVER_TEXT>",
        SheetIndex: 0,
        IconPos: { width: "55px", height: "54px", srcWidth: 240, srcHeight: 240, srcTop: 256.5, srcLeft: 270 }
    },
];
/** call-values for IDs, cargo */
export enum ItemNameCargo {
    smCargo = "smCargo", mdCargo = "mdCargo", lgCargo = "lgCargo"
}
/** all cargo objects */
export const CargoObjectData: CargoObject[] = [
    {
        ID: "smCargo",
        Name: "Small Cargo",
        Desc: "<HOVER_TEXT>",
        Rewards: [
            { Type: -1, ID: "0", Count: 5 },   // loot generation rounds
            { Type: 0, ID: "0", Count: 5 }   // experience
        ],
        SheetIndex: 0,
        IconPos: { width: "55px", height: "55px", srcWidth: 240, srcHeight: 238, srcTop: 1215, srcLeft: 14.2 }
    },
    {
        ID: "mdCargo",
        Name: "Medium Cargo",
        Desc: "<HOVER_TEXT>",
        Rewards: [
            { Type: -1, ID: "0", Count: 12 },   // loot generation rounds
            { Type: 0, ID: "0", Count: 10 }   // experience
        ],
        SheetIndex: 0,
        IconPos: { width: "55px", height: "55px", srcWidth: 240, srcHeight: 238, srcTop: 1215, srcLeft: 270 }
    },
    {
        ID: "lgCargo",
        Name: "Large Cargo",
        Desc: "<HOVER_TEXT>",
        Rewards: [
            { Type: -1, ID: "0", Count: 40 },   // loot generation rounds
            { Type: 0, ID: "0", Count: 25 }   // experience
        ],
        SheetIndex: 0,
        IconPos: { width: "55px", height: "55px", srcWidth: 240, srcHeight: 238, srcTop: 1215, srcLeft: 528 }
    }
];
/** call-values for IDs, tokens */
export enum ItemNameToken {
    token0 = "token0", token1 = "token1", token2 = "token2"
}
/** all tokens objects */
export const TokenObjectData: BaseObject[] = [
    {
        ID: "token0",
        Name: "Common Token",
        Desc: "<HOVER_TEXT>",
        SheetIndex: 0,
        IconPos: { width: "55px", height: "55px", srcWidth: 240, srcHeight: 240, srcTop: 1215, srcLeft: 14.2 }
    },
    {
        ID: "token1",
        Name: "Uncommon Token",
        Desc: "<HOVER_TEXT>",
        SheetIndex: 0,
        IconPos: { width: "55px", height: "55px", srcWidth: 240, srcHeight: 240, srcTop: 1215, srcLeft: 270 }
    },
    {
        ID: "token2",
        Name: "Rare Token",
        Desc: "<HOVER_TEXT>",
        SheetIndex: 0,
        IconPos: { width: "55px", height: "55px", srcWidth: 240, srcHeight: 240, srcTop: 1215, srcLeft: 528 }
    }
];

/** call-values for IDs, power ups */
export enum ItemNamePowerUp {
    PlayerInvincible = "healthinvincible15s", PlayerHeal = "healthPlus50",
    BonusCoins = "multipleCoins2x", BonusExp = "multipleXp2x",
    WeaponBoost = "projectileDamagePlus5", WeaponTrap = "projectileTrap"
}
/** all power up objects */
export const PowerUpObjectData: BaseObject[] = [
    {
        ID: "healthinvincible15s",
        Name: "Invincibility",
        Desc: "Provides immunity for a small period of time",
        SheetIndex: 0,
        IconPos: { width: "55px", height: "55px", srcWidth: 240, srcHeight: 240, srcTop: 1447, srcLeft: 782.2 }
    },
    {
        ID: "healthPlus50",
        Name: "Repair Kit",
        Desc: "Restores X health",
        SheetIndex: 0,
        IconPos: { width: "55px", height: "55px", srcWidth: 240, srcHeight: 240, srcTop: 1447, srcLeft: 270.2 }
    },
    {
        ID: "multipleCoins2x",
        Name: "Coin Booster",
        Desc: "Greatly increases the number of coins gained",
        SheetIndex: 0,
        IconPos: { width: "55px", height: "55px", srcWidth: 240, srcHeight: 240, srcTop: 1215, srcLeft: 1552 }
    },
    {
        ID: "multipleXp2x",
        Name: "Exp Booster",
        Desc: "Greatly increases the amount of experience gained",
        SheetIndex: 0,
        IconPos: { width: "55px", height: "55px", srcWidth: 240, srcHeight: 240, srcTop: 1215, srcLeft: 1808 }
    },
    {
        ID: "projectileDamagePlus5",
        Name: "Weapon Booster",
        Desc: "Increases weapon damage by X",
        SheetIndex: 0,
        IconPos: { width: "55px", height: "55px", srcWidth: 240, srcHeight: 240, srcTop: 1447, srcLeft: 14.2 }
    },
    {
        ID: "projectileTrap",
        Name: "Snap Trap",
        Desc: "<HOVER_TEXT>",
        SheetIndex: 0,
        IconPos: { width: "55px", height: "55px", srcWidth: 240, srcHeight: 240, srcTop: 1447, srcLeft: 526.2 }
    }
];