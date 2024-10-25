import { type AvatarTexture, type TransformType } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { CONFIG } from '../config'
import { MovingAverage } from './movingAverage'

const ParcelScale: number = 3
const ParcelScaleDerby: number = 4
const ParcelScaleGrandPrixX: number = 4
const ParcelScaleGrandPrixZ: number = 4

// @Component("worldState")
export class Scene {
  scale: number = 0
  sizeX: number = 0
  sizeY: number = 0
  sizeZ: number = 0

  sizeDerbyX: number = 0
  sizeDerbyY: number = 0
  sizeDerbyZ: number = 0

  sizeGrandPrixX: number = 0
  sizeGrandPrixY: number = 0
  sizeGrandPrixZ: number = 0

  carWidth: number = 0
  lobbyElevation: number = 0
  derbyElevation: number = 0
  raceGroundElevation: number = 0
  raceGroundElevationGrandPrix: number = 0
  // workaround to blooms showing up even in hideen areas, going to randomly place race game height to minimimze the issue
  // raceElevationStartRange is the lowest possible point it can spawn
  // raceElevationRange is the span for which it can spawn
  raceElevationStartRange: number = 0
  raceElevationRange: number = 0
  inCarPlayerGroundElevation: number = 0
  movePlayerYPadding: number = 0
  preventJumpColliderYPos: number = 0
  startPlayerWayAboveRacePosYPad: number = 0
  // groundElevation: number = 1
  maxObjectRadius: number = 0
  center: Vector3 = Vector3.create(0, 0, 0)
  centerDerby: Vector3 = Vector3.create(0, 0, 0)
  centerGrandPrix: Vector3 = Vector3.create(0, 0, 0)
  sceneInnerRadius: number = 0

  playerHeight: number = 0

  worldMoveVector: Vector3 = Vector3.create(0, 0, 0)

  worldTopSpeed: number = 0
  worldTopSpeedWithBoost: number = 0
  worldTopSpeedBackward: number = 0

  DRAG_MAX: number = 0
  BOOST_MAX: number = 0
  BOOST_DECEL: number = 0

  groundTilingFactor: number = 0
  lastTrackPos: Vector3 = Vector3.create(0, 0, 0)
  lastTrackIndex: number = 0
  lastTrackFraction: number = 0
  distanceFromStart: number = 0
  distanceFromCenterLine: number = 0 // PLAYER DATA
  roadFullWidthSquared: number = 0
  roadSmoothWidthSquared: number = 0
  roadWidth: number = 0
  roadDir: Vector3 = Vector3.create(0, 0, 0)
  menuPositions: TransformType[]

  constructor() {
    this.reset()

    const relativeCenter = Vector3.create(8, 0, 40)
    const menuElevation = 4
    this.menuPositions = []
    this.menuPositions.push({
      position: Vector3.create(
        relativeCenter.x + 3.85,
        menuElevation,
        relativeCenter.z + 3.85
      ),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.fromEulerDegrees(-6.76, -135, 0)
    })
    this.menuPositions.push({
      position: Vector3.create(32.1, 4.21, 34.28),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.fromEulerDegrees(180, 0, 180)
    })
    this.menuPositions.push({
      position: Vector3.create(
        relativeCenter.x - 3.85,
        menuElevation,
        relativeCenter.z - 3.85
      ),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.fromEulerDegrees(-6.76, 45, 0)
    })
    this.menuPositions.push({
      position: Vector3.create(
        relativeCenter.x - 3.85,
        menuElevation,
        relativeCenter.z + 3.85
      ),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.fromEulerDegrees(-6.76, 135, 0)
    })
  }

  reset(): void {
    this.scale = ParcelScale
    this.sizeX = ParcelScale * 16
    this.sizeZ = ParcelScale * 16
    this.sizeY = Math.log(ParcelScale * ParcelScale + 1) * Math.LOG2E * 20 // log2(n+1) x 20 //Math.log2( ParcelScale + 1 ) * 20
    this.sizeDerbyX = ParcelScaleDerby * 16
    this.sizeDerbyZ = ParcelScaleDerby * 16
    this.sizeDerbyY =
      Math.log(ParcelScaleDerby * ParcelScaleDerby + 1) * Math.LOG2E * 20
    this.sizeGrandPrixX = ParcelScaleGrandPrixX * 16
    this.sizeGrandPrixZ = ParcelScaleGrandPrixZ * 16
    this.sizeGrandPrixY =
      Math.log(ParcelScaleGrandPrixX * ParcelScaleGrandPrixZ + 1) *
      Math.LOG2E *
      20
    this.movePlayerYPadding = 0.2 // 2 //how much more of the Y should we account for to "drop the player", to ensure they collid with ground
    this.startPlayerWayAboveRacePosYPad = 5 // how much more of the Y should we account for to "drop the player", trying to hide bloom
    this.carWidth = 1
    this.lobbyElevation = 0
    this.derbyElevation = 0
    // workaround to blooms showing up even in hidden areas, going to randomly place race game height to minimimze the issue
    // raceElevationStartRange is the lowest possible point it can spawn
    // 3x3 has a max of ~66 meters  13+12 will be as high as 25 leaving room for 15 meter tall items at most
    // set raceElevationRange to 0 if you want a fixed race spawn location
    // realized random placement will cause entire bodies / not just heads to appear leaving at 0 for now.
    // maybe we can spawn off to side, for a second, them move then in?
    this.raceElevationRange = 0 // how many meters it can span. between raceElevationStartRange - (raceElevationStartRange+raceElevationRange)
    this.raceElevationStartRange = 16 // 12
    // this is the height the player will stand at to be in the car
    this.inCarPlayerGroundElevation =
      this.raceElevationStartRange +
      Math.floor(Math.random() * this.raceElevationRange) // TODO RAISE THIS UP
    this.raceGroundElevation = this.inCarPlayerGroundElevation + 1.45
    this.raceGroundElevationGrandPrix = 1 // this.inCarPlayerGroundElevation + 1.45;
    this.preventJumpColliderYPos = this.inCarPlayerGroundElevation + 2

    this.setRoadWidth(3)

    console.log(
      'scene.this.raceGroundElevation',
      this.raceGroundElevation,
      this.sizeY
    )

    // groundElevation = 1
    this.maxObjectRadius = 0.5
    this.center = Vector3.create(
      this.sizeX / 2,
      this.raceGroundElevation,
      this.sizeZ / 2
    )
    this.centerDerby = Vector3.create(
      this.sizeDerbyX / 2,
      this.raceGroundElevation,
      this.sizeDerbyX / 2
    )
    this.centerGrandPrix = Vector3.create(
      this.sizeGrandPrixX / 2,
      this.raceGroundElevationGrandPrix,
      this.sizeGrandPrixZ / 2
    )

    this.sceneInnerRadius = Math.sqrt(Math.pow(this.sizeX / 2, 2))

    this.playerHeight = 1.8 // 1.177 = camera position
    this.worldMoveVector = Vector3.create(0, 0, 0)
    // this.worldMoveDirection = Quaternion.FromEulerDegrees(0,0,0)

    this.worldTopSpeed = CONFIG.SPEED_WORLD_TOP_SPEED_BASELINE
    this.worldTopSpeedWithBoost = this.worldTopSpeed

    this.DRAG_MAX = 0.4
    this.BOOST_MAX = 1
    this.BOOST_DECEL = 2

    this.worldTopSpeedBackward = -1
    this.groundTilingFactor = 15
    this.lastTrackPos = Vector3.Zero()
    this.lastTrackIndex = 0
    this.lastTrackFraction = 0
    this.distanceFromStart = 0
    this.distanceFromCenterLine = 0 // PLAYER DATA
    this.roadDir = Vector3.Forward()
  }

  setRoadWidth(width: number): void {
    this.roadWidth = width // + 2
    this.roadFullWidthSquared =
      Math.pow(this.roadWidth + this.carWidth / 2, 2) + 0.035
    // (3-(.5-.05))^2 = 6 is the goal as basline
    this.roadSmoothWidthSquared = Math.pow(
      this.roadWidth - (this.carWidth / 2 - 0.05),
      2
    )
    // baseline 3 should be: roadFullWidthSquared = 12.5,roadSmoothWidthSquared=6
    console.log(
      'setRoadWidth',
      width,
      'roadFullWidthSquared',
      this.roadFullWidthSquared,
      'roadSmoothWidthSquared',
      this.roadSmoothWidthSquared
    )
  }
}

export type PlayerBaseArg = {
  id?: string
  sessionId?: string // mere with id??
  name?: string
  userId?: string
  carModelId?: string // MOVE ME SOMEWHERE BETTER!! make car state???
}
export class PlayerBase {
  id: string = ''
  sessionId: string = '' // mere with id??
  name: string = ''
  userId: string = ''
  isDriving: boolean = false
  isNearCar: boolean = false
  friction: number = 0
  sideFriction: number = 0
  driftFriction: number = 0
  appliedSlowdownFriction: number = 0
  appliedBoostFriction: number = 0
  isDrifting: boolean = false
  currentSpeed: number = 0
  MOVE_FORWARD: boolean = false
  MOVE_BACKWARD: boolean = false
  shoot_btn_down: boolean = false
  powerUpInvicible: boolean = false
  acceleration: number = 0
  deceleration: number = 0
  closestProjectedPoint: Vector3 = Vector3.create(0, 0, 0) // is world relative, not sure how much will help multi player
  closestSegmentID: number = 0 // closest segment as a whole AKA track index (player is on this segment)
  forwardMostVisitedSegmentID: number = 0 // closest segment as a whole AKA track index (player is on this segment)
  closestPointID: number = 0 // closest point on segment (could be behind or in front of player, its as a whole which they are closer to)

  closestSegmentPercent: number = 0 // relates to closestSegmentID.  what percent of this segement is player at
  closestSegmentDistance: number = 0 // how far player is from center, aka the segement

  projectileTimer: number = 0
  // projectileCount:number
  boostReloadTimer: number = 0
  // boosterCount:number

  wrongWay: boolean = false
  isOnSideRight: boolean = false
  worldMoveDirection: Quaternion = Quaternion.create()
  cameraDirection: Quaternion = Quaternion.create()
  carRotation: Quaternion = Quaternion.create()
  shootDirection: Quaternion = Quaternion.create()
  carModelId: string|undefined = '' // MOVE ME SOMEWHERE BETTER!! make car state???
  // FIXME for now purposely not resetting this guy, letting avatarswap manage it
  avatarSwapCarModelId: string = '' // MOVE ME SOMEWHERE BETTER!! make car state???

  raceEndTime: number = 0
  completedRace: boolean = false // currently using raceEndTime !== undefined
  racePosition: number = 0
  enrollmentSlotNumber: number = 0 // enrollment slot, should be (1-minToPlay)
  lap: number = 0
  currentCheckpointIndex: number = 0

  latencyAvgMv: MovingAverage = new MovingAverage(
    CONFIG.LATENCY_AVERAGE_WINDOW_SIZE
  )

  latencyAvg: number = 0
  latencyLast: number = 0
  lastKnowServerTime: number = 0
  lastKnownClientTime: number = 0

  lastKnownWorldPosition: Vector3 = Vector3.create(0, 0, 0)
  worldPosition: Vector3 = Vector3.create(0, 0, 0)

  health: number = 0
  healthMax: number = 0

  constructor(args?: PlayerBaseArg) {
    this.reset()

    this.update(args)
  }

  update(args: PlayerBaseArg | undefined): void {
    if (args != null) {
      if (args.id != null) this.id = args.id
      if (args.sessionId != null) this.sessionId = args.sessionId
      if (args.name != null) this.name = args.name
      if (args.carModelId != null) this.carModelId = args.carModelId
    }
  }

  // http://www.zrzahid.com/moving-average-of-last-n-numbers-in-a-stream/
  // https://shareablecode.com/snippets/moving-average-from-data-stream-c-solution-leetcode-Gmzm-7sjZ
  // https://www.toni-develops.com/2022/04/12/moving-average-from-data-stream/?utm_source=rss&utm_medium=rss&utm_campaign=moving-average-from-data-stream
  updateLatency(clientTime: number, serverTime: number): void {
    if (this.lastKnownClientTime > 0) {
      // TODO take a weight average as seeing it cycle, 0 should not be possible
      /*
      index.js:83 kernel:scene: [-14, 76]    calculateWorldPosFromWorldPos latancey 0 0
      2index.js:83 kernel:scene: [-14, 76]    calculateWorldPosFromWorldPos latancey 0.3604 360.4
      2index.js:83 kernel:scene: [-14, 76]    calculateWorldPosFromWorldPos latancey 0.2125 212.5
      2index.js:83 kernel:scene: [-14, 76]    calculateWorldPosFromWorldPos latancey 0.13090000000000002 130.9
      2index.js:83 kernel:scene: [-14, 76]    calculateWorldPosFromWorldPos latancey 0.1751 175.1
      2index.js:83 kernel:scene: [-14, 76]    calculateWorldPosFromWorldPos latancey 0.1802 180.2
      2index.js:83 kernel:scene: [-14, 76]    calculateWorldPosFromWorldPos latancey 0 0
      */
      // should we add in + CONFIG.SEND_RACE_DATA_FREQ_MILLIS?

      this.latencyLast = Math.max(
        clientTime - this.lastKnownClientTime + CONFIG.LATENCY_MISC_FACTOR,
        CONFIG.SEND_RACE_DATA_FREQ_MILLIS
      ) // times 2 for round trip??
      this.latencyAvgMv.add(this.latencyLast)
      this.latencyAvg = this.latencyAvgMv.average
    }
    this.lastKnownClientTime = clientTime
    this.lastKnowServerTime = serverTime
    // only do when valid time for performance???
    // GAME_STATE.setGameTime(serverTime)
  }

  markCompletedRace(reason: string): void {
    console.log(
      'player.',
      'markCompletedRace',
      this.name,
      this.userId,
      'alreadyComplete',
      this.completedRace,
      reason
    )
    this.completedRace = true
  }

  reset(): void {
    this.id = ''
    this.sessionId = '' // mere with id??
    this.name = '_0'
    this.userId = ''
    this.isDriving = false
    this.isNearCar = false
    this.friction = 0
    this.appliedSlowdownFriction = 0
    this.appliedBoostFriction = 0
    this.sideFriction = 0
    this.driftFriction = 0
    this.isDrifting = false
    this.currentSpeed = 0
    this.MOVE_FORWARD = false
    this.MOVE_BACKWARD = false
    this.shoot_btn_down = false
    this.powerUpInvicible = false
    this.acceleration = 2
    this.deceleration = 1.5
    this.closestProjectedPoint = Vector3.create(0, 0, 0) // is world relative, not sure how much will help multi player
    this.closestSegmentID = 0 // closest segment as a whole AKA track index
    this.forwardMostVisitedSegmentID = 0
    this.closestPointID = 0 // closest point on segment
    this.closestSegmentPercent = 0 // relates to closestSegmentID.  what percent of this segement is player at
    this.closestSegmentDistance = 0 // how far player is from center, aka the segement
    // this.projectileCount=0
    // this.boosterCount=0
    this.boostReloadTimer = 0
    this.projectileTimer = 0
    this.wrongWay = false
    this.isOnSideRight = false
    this.worldMoveDirection = Quaternion.fromEulerDegrees(0, 0, 0)
    this.cameraDirection = Quaternion.fromEulerDegrees(0, 0, 0)
    this.carRotation = Quaternion.fromEulerDegrees(0, 0, 0)
    this.shootDirection = Quaternion.fromEulerDegrees(0, 0, 0)
    this.carModelId = ''
    this.raceEndTime = 0
    this.completedRace = false
    this.racePosition = 0
    this.lap = 1
    this.currentCheckpointIndex = 0

    this.latencyLast = -1
    this.latencyAvg = -1

    this.lastKnowServerTime = -1

    this.lastKnownWorldPosition = Vector3.create()
    this.worldPosition = Vector3.create()

    this.health = 0
    this.healthMax = 0
  }
}

export class PlayerState extends PlayerBase {
  // serverState: clientState.PlayerState
  avatarTexture?: AvatarTexture

  reset(): void {
    super.reset()

    // purposely letting this persist. avatarSwapCarModelId is managed by avatarSwap.ts
    this.carModelId = this.avatarSwapCarModelId

    console.log(
      'carModelId.playerstate.reset',
      this.carModelId,
      this.avatarSwapCarModelId
    )
  }
}

// object to store world data
export const scene = new Scene()

export const player = new PlayerState()

export function ResetWorld(): void {
  scene.reset()
}
