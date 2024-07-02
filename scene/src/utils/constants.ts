export const LEVEL_UP_FUEL = 250
export const SOLO_SPRINT_COST = 50
export const DEMO_DERBY_COST = 25
export const FUEGO_CIRCUIT_COST = 50
export const DRAG_RACE_COST = 20
export const RUMMAGE_COST = 10
export const RECHARGE_REFUEL_AMOUNT = 125
export const LAMBDA_URL =
  'https://9ai3xqmwnd.execute-api.us-east-1.amazonaws.com'
export const BLACKLIST = ['0x2ebb0e88c6edeaef1d912bee639a9e6acc2ed418']
export const TESTERS = [
  '0x6a8E4eA8C220EbeEA71c87A701ddFd06209C2e4b'.toLowerCase(),
  '0x4317036d2Cb249e3e4B847164674B7d27C33442b'.toLowerCase(),
  '0x6d5E5Ba88861Df8dba0EB53ebad1BA89eB4b238b'.toLowerCase(),
  '0x07424b254b72b2272764100a98A6EB338F2FFBD0'.toLowerCase(),
  '0x6d873a14a470dd969d7c76a2e088169ab2a1d7ae'.toLowerCase(),
  '0x0d779d67a428457cabec145a0f94703d14cd496b'.toLowerCase(),
  '0x56469159D91eb810dCE34dd13eC4eD8194bCA7be'.toLowerCase(),
  '0xd1413203a673ad13a88e2cf5a8105ced53f350db'.toLowerCase()
]
export const SAVE_TESTERS: Record<string, boolean> = {}

;[
  // no one in this test group for now so can merge main branch
  /* "x0xbd5b79d53d75497673e699a571afa85492a2cc74",
  "0x2e3b6816CeD5BF57Df135Af566180e11B9b9689d",
  "0x56469159D91eb810dCE34dd13eC4eD8194bCA7be",
  "0x56D947fA1AE6d6293b307b489540C156AF628F0F" */
].forEach((val) => {
  SAVE_TESTERS[val] = true
})
export const WILL = '0xbd5b79d53d75497673e699a571afa85492a2cc74'

const d = new Date()
const milliseconds = d.getTime()
export const SEED_STATS = {
  lapsCompleted: 20,
  lastLogin: milliseconds,
  cannisters: 1000000,
  antimatter: 1000000,
  rubber: 1000000,
  metal: 1000000,
  wires: 1000000,
  glass: 1000000,
  circuitBoard: 10000000,
  dragRaceTime: 100000,
  propulsion: 10000000,
  fuel: 10000000,
  coins: 10000000,
  lvl: 20,
  exp: 10000000,
  smCargo: 50,
  mdCargo: 50,
  lgCargo: 50,
  elims: 0,
  compPoints: 0,
  coinPowerup: 0,
  speedPowerup: 0,
  freezePowerup: 0,
  soloSprintTime: null,
  circuitTime: null,
  // pinkSlips: 0,
  sprintCompTime: null,
  circuitCompTime: null,
  equippedVehicle: null,
  equippedAccessory: null
}
