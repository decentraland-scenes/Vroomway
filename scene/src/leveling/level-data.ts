/*		LEVEL PERMISSIONS DATA
    contains listings of every permission to be given to the player at a given level

    this has been split from the main level rewards data to allow for easier processing
    when experience is set. rewards will only be given on organic level gain, while
    these will be set whenever a level is set (including initialization)

    data entry breakdown:
        permission def example: [level, index]
            level: defines level required to acquire permission
            index: defines targeted permission 
        	
    author: Alex Pazder
    contact: TheCryptoTrader69@gmail.com
*/
type LevelPermissions = Record<string, number[][]>;
export const LevelPermissionData: LevelPermissions =
{
    // teleport access
    "PermissionsTeleports":
        [
            // Main Entrance
            [0, 0],
            // Scrapyard
            [10, 1],
            // Recharge
            [15, 2],
            // Wondermine
            [20, 3]
        ],
    // wearable claim
    "PermissionsWearables":
        [
            // Beta Wings
            [10, 0],
            // Master Wings
            [60, 1]
        ]
}

/*      LEVEL REWARDS DATA
    contains listings of every rewards given to the player based
    on newly aquirred levels. every level needs an entry (even if empty).
    this reduces the processing overhead of indexing each level individually
    and provides easy modability.
    
    level rewards are generated externally using the rewards-generator.js
    tool. you can change the data set's generation features within the tool,
    generate a new rewards file, and replace this file's data set with the result.

    data entry breakdown:
        reward def example: [type, subtype, count]
            type: defines type of reward to be given
                [0=resource, 1=Cargo, 2=Claim Token]
            subtype: defines the specific reward tied to that type
                ex for resources: [0=fuel, 1=coins, 2=propulsion, 3=cannisters, 4=antimatter]
            count: number of items to award player
*/
type LevelRewardData = Record<string, any[][]>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LevelRewardData: LevelRewardData =
// when regenerating level rewards data using the python script:
//  delete everthing below this point, then copy and past the contents of the output file below
{
    "0":
        [
            ["fuel", 250]
        ],
    "1":
        [
            ["fuel", 250]
        ],
    "2":
        [
            ["fuel", 250],
            ["coins", 250]
        ],
    "3":
        [
            ["fuel", 250],
            ["coins", 500]
        ],
    "4":
        [
            ["fuel", 250],
            ["coins", 750]
        ],
    "5":
        [
            ["fuel", 250],
            ["coins", 1000],
            ["cannisters", 25],
            ["antimatter", 25]
        ],
    "6":
        [
            ["fuel", 250],
            ["coins", 1250]
        ],
    "7":
        [
            ["fuel", 250],
            ["coins", 1500]
        ],
    "8":
        [
            ["fuel", 250],
            ["coins", 1750]
        ],
    "9":
        [
            ["fuel", 250],
            ["coins", 2000]
        ],
    "10":
        [
            ["fuel", 250],
            ["coins", 2250],
            ["smCargo", 1],
            ["cannisters", 50],
            ["antimatter", 50]
        ],
    "11":
        [
            ["fuel", 250],
            ["coins", 2500]
        ],
    "12":
        [
            ["fuel", 250],
            ["coins", 2750]
        ],
    "13":
        [
            ["fuel", 250],
            ["coins", 3000]
        ],
    "14":
        [
            ["fuel", 250],
            ["coins", 3250]
        ],
    "15":
        [
            ["fuel", 250],
            ["coins", 3500],
            ["mdCargo", 1],
            ["cannisters", 75],
            ["antimatter", 75]
        ],
    "16":
        [
            ["fuel", 250],
            ["coins", 3750]
        ],
    "17":
        [
            ["fuel", 250],
            ["coins", 4000]
        ],
    "18":
        [
            ["fuel", 250],
            ["coins", 4250]
        ],
    "19":
        [
            ["fuel", 250],
            ["coins", 4500]
        ],
    "20":
        [
            ["fuel", 250],
            ["coins", 4750],
            ["lgCargo", 1],
            ["cannisters", 100],
            ["antimatter", 100]
        ],
    "21":
        [
            ["fuel", 250],
            ["coins", 5000]
        ],
    "22":
        [
            ["fuel", 250],
            ["coins", 5250]
        ],
    "23":
        [
            ["fuel", 250],
            ["coins", 5500]
        ],
    "24":
        [
            ["fuel", 250],
            ["coins", 5750]
        ],
    "25":
        [
            ["fuel", 250],
            ["coins", 6000],
            ["lgCargo", 1],
            ["cannisters", 125],
            ["antimatter", 125]
        ],
    "26":
        [
            ["fuel", 250],
            ["coins", 6250]
        ],
    "27":
        [
            ["fuel", 250],
            ["coins", 6500]
        ],
    "28":
        [
            ["fuel", 250],
            ["coins", 6750]
        ],
    "29":
        [
            ["fuel", 250],
            ["coins", 7000]
        ],
    "30":
        [
            ["fuel", 250],
            ["coins", 7250],
            ["lgCargo", 1],
            ["cannisters", 150],
            ["antimatter", 150],
            ["token0", 1]
        ],
    "31":
        [
            ["fuel", 250],
            ["coins", 7500]
        ],
    "32":
        [
            ["fuel", 250],
            ["coins", 7750]
        ],
    "33":
        [
            ["fuel", 250],
            ["coins", 8000]
        ],
    "34":
        [
            ["fuel", 250],
            ["coins", 8250]
        ],
    "35":
        [
            ["fuel", 250],
            ["coins", 8500],
            ["lgCargo", 1],
            ["cannisters", 175],
            ["antimatter", 175]
        ],
    "36":
        [
            ["fuel", 250],
            ["coins", 8750]
        ],
    "37":
        [
            ["fuel", 250],
            ["coins", 9000]
        ],
    "38":
        [
            ["fuel", 250],
            ["coins", 9250]
        ],
    "39":
        [
            ["fuel", 250],
            ["coins", 9500]
        ],
    "40":
        [
            ["fuel", 250],
            ["coins", 9750],
            ["lgCargo", 1],
            ["cannisters", 200],
            ["antimatter", 200]
        ],
    "41":
        [
            ["fuel", 250],
            ["coins", 10000]
        ],
    "42":
        [
            ["fuel", 250],
            ["coins", 10250]
        ],
    "43":
        [
            ["fuel", 250],
            ["coins", 10500]
        ],
    "44":
        [
            ["fuel", 250],
            ["coins", 10750]
        ],
    "45":
        [
            ["fuel", 250],
            ["coins", 11000],
            ["cannisters", 225],
            ["antimatter", 225],
            ["token1", 1]
        ],
    "46":
        [
            ["fuel", 250],
            ["coins", 11250]
        ],
    "47":
        [
            ["fuel", 250],
            ["coins", 11500]
        ],
    "48":
        [
            ["fuel", 250],
            ["coins", 11750]
        ],
    "49":
        [
            ["fuel", 250],
            ["coins", 12000]
        ],
    "50":
        [
            ["fuel", 250],
            ["coins", 12250],
            ["lgCargo", 5],
            ["cannisters", 250],
            ["antimatter", 250]
        ],
    "51":
        [
            ["fuel", 250],
            ["coins", 12500]
        ],
    "52":
        [
            ["fuel", 250],
            ["coins", 12750]
        ],
    "53":
        [
            ["fuel", 250],
            ["coins", 13000]
        ],
    "54":
        [
            ["fuel", 250],
            ["coins", 13250]
        ],
    "55":
        [
            ["fuel", 250],
            ["coins", 13500],
            ["lgCargo", 10],
            ["cannisters", 275],
            ["antimatter", 275]
        ],
    "56":
        [
            ["fuel", 250],
            ["coins", 13750]
        ],
    "57":
        [
            ["fuel", 250],
            ["coins", 14000]
        ],
    "58":
        [
            ["fuel", 250],
            ["coins", 14250]
        ],
    "59":
        [
            ["fuel", 250],
            ["coins", 14500]
        ],
    "60":
        [
            ["fuel", 250],
            ["coins", 15000],
            ["cannisters", 200],
            ["antimatter", 200],
            ["lgCargo", 10],
            ["token2", 1]
        ]    
};