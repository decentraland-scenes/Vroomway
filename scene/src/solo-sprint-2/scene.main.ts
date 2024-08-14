import { type GameController } from '../controllers/game.controller'
import { type RealmType } from '../instances/types'
import { CONFIG } from './_config'
import { GLTFEntity } from './classes/class.gltfEntity'
import { movePlayerTo } from '~system/RestrictedActions'
import { ButtonSprint } from './classes/class.button'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { Door } from './classes/class.door'
import * as utils from '@dcl-sdk/utils'
import { Elevator } from './classes/class.elevator'
import { ElevatorButton } from './classes/class.elevatorButton'
import { TriggerZone } from './classes/class.triggerZone'
import {
  Animator,
  AudioSource,
  AvatarAnchorPointType,
  AvatarAttach,
  engine,
  Transform} from '@dcl/sdk/ecs'
import { DoorRegular } from './classes/class.doorRegular'
import { LockClicker } from './classes/class.lockClicker'
import { DoorLarge } from './classes/class.doorLarge'
import { DoorBroken } from './classes/class.doorBroken'
import { GLTFParticles } from './classes/class.gltfParticles'
import { Zapper } from './classes/class.zapper'
import { entityController } from '../utils/entityController'
import { getUserData } from '~system/UserIdentity'

export class SoloSprint {
  gameController: GameController
  base_combined: GLTFEntity
  terrain_combined: GLTFEntity
  scene_skybox_combined: GLTFEntity
  btnGoToStart: ButtonSprint
  towerButton: ButtonSprint
  towerTrapdoor: Door
  floor01Elevator: Elevator
  floor01ElevatorBtn: ElevatorButton
  floor01ElevatorOpenTrigger: TriggerZone
  floor02Elevator: Elevator
  floor02ElevatorBtn: ElevatorButton
  floor02ElevatorEnterTrigger: TriggerZone
  baseSouth3Lifter: GLTFEntity
  baseSouth3SharkRoom: GLTFEntity
  sharkPoolTrigger: TriggerZone
  floor04Airlock: Elevator
  floor04AirlockBtn: ButtonSprint
  floor04SubmarineBtn: ButtonSprint
  doorGenRoom: DoorRegular
  lockGenRoom: LockClicker
  doorStoreRoom: DoorRegular
  lockStoreRoom: LockClicker
  doorTunnel03: DoorLarge
  lockTunnels03: LockClicker
  doorAirlock: DoorRegular
  lockAirlock: LockClicker
  doorLifterRoomBottom: DoorLarge
  doorLifterRoomTop: DoorLarge
  lockSimpleLifterRoomBottom: ButtonSprint
  lockSimpleLifterRoomTop: ButtonSprint
  doorSingles: DoorRegular[]
  doorSingle001Tower: DoorRegular
  doorSingle001Tower2: DoorRegular
  hexTunnelDoorBroken: DoorBroken
  hexTunnelDoorBroken2: DoorBroken
  hexTunnelDoors: DoorLarge[]
  hexTunnelDoor2: DoorLarge
  hexTunnelDoors3: DoorLarge[]
  fans: GLTFEntity[]
  bubbles: GLTFParticles[]
  particlesCaustics: GLTFParticles[]
  particlesFish: GLTFParticles[]
  creatureSharks: GLTFParticles[]
  shark01: GLTFEntity
  particlesWaterDrips: GLTFParticles[]
  zappers: Zapper[]
  ZAPPER_QUANTITY: number = 14
  ZAPPER_MODELS: string[] = ['wires.01', 'wires.02']
  constructor(gameController: GameController) {
    this.gameController = gameController
    // ██████╗  █████╗ ███████╗███████╗
    // ██╔══██╗██╔══██╗██╔════╝██╔════╝
    // ██████╔╝███████║███████╗█████╗
    // ██╔══██╗██╔══██║╚════██║██╔══╝
    // ██████╔╝██║  ██║███████║███████╗
    // ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝
    //
    this.base_combined = new GLTFEntity(
      'base_combined',
      CONFIG.SCENE_TRANSFORM_180.position,
      CONFIG.SCENE_TRANSFORM_180.scale,
      CONFIG.SCENE_TRANSFORM_180.rotation
    )
    // ████████╗███████╗██████╗ ██████╗  █████╗ ██╗███╗   ██╗
    // ╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██╔══██╗██║████╗  ██║
    //    ██║   █████╗  ██████╔╝██████╔╝███████║██║██╔██╗ ██║
    //    ██║   ██╔══╝  ██╔══██╗██╔══██╗██╔══██║██║██║╚██╗██║
    //    ██║   ███████╗██║  ██║██║  ██║██║  ██║██║██║ ╚████║
    //    ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝
    //
    this.terrain_combined = new GLTFEntity(
      'terrain_combined',
      CONFIG.SCENE_TRANSFORM_180.position,
      CONFIG.SCENE_TRANSFORM_180.scale,
      CONFIG.SCENE_TRANSFORM_180.rotation
    )
    // ███████╗██╗  ██╗██╗   ██╗██████╗  ██████╗ ██╗  ██╗
    // ██╔════╝██║ ██╔╝╚██╗ ██╔╝██╔══██╗██╔═══██╗╚██╗██╔╝
    // ███████╗█████╔╝  ╚████╔╝ ██████╔╝██║   ██║ ╚███╔╝
    // ╚════██║██╔═██╗   ╚██╔╝  ██╔══██╗██║   ██║ ██╔██╗
    // ███████║██║  ██╗   ██║   ██████╔╝╚██████╔╝██╔╝ ██╗
    // ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═════╝  ╚═════╝ ╚═╝  ╚═╝
    //
    this.scene_skybox_combined = new GLTFEntity(
      'scene_skybox_combined',
      CONFIG.SCENE_TRANSFORM_180.position,
      CONFIG.SCENE_TRANSFORM_180.scale,
      CONFIG.SCENE_TRANSFORM_180.rotation
    )
    //  ██████╗  █████╗  ██████╗ ██╗
    // ██╔════╝ ██╔══██╗██╔═══██╗██║
    // ██║  ███╗███████║██║   ██║██║
    // ██║   ██║██╔══██║██║   ██║██║
    // ╚██████╔╝██║  ██║╚██████╔╝███████╗
    //  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
    const PLAYER_START_POSITION = Vector3.create(86.25, 38, 32.9)
    this.btnGoToStart = new ButtonSprint(
      'lock.simple',
      Vector3.create(62.381, 0.0, 30.5),
      Vector3.create(1, 1, 1),
      Quaternion.fromEulerDegrees(0, 0, 0),
      () => {
        console.log('Gaol interface was clicked')
        void movePlayerTo({ newRelativePosition: PLAYER_START_POSITION })
      },
      'Go To Start'
    )
    //  ██████╗  ██████╗     ████████╗ ██████╗ ██╗    ██╗███████╗██████╗     ████████╗██████╗  █████╗ ██████╗ ██████╗  ██████╗  ██████╗ ██████╗
    // ██╔═████╗██╔═████╗    ╚══██╔══╝██╔═══██╗██║    ██║██╔════╝██╔══██╗    ╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔═══██╗██╔═══██╗██╔══██╗
    // ██║██╔██║██║██╔██║       ██║   ██║   ██║██║ █╗ ██║█████╗  ██████╔╝       ██║   ██████╔╝███████║██████╔╝██║  ██║██║   ██║██║   ██║██████╔╝
    // ████╔╝██║████╔╝██║       ██║   ██║   ██║██║███╗██║██╔══╝  ██╔══██╗       ██║   ██╔══██╗██╔══██║██╔═══╝ ██║  ██║██║   ██║██║   ██║██╔══██╗
    // ╚██████╔╝╚██████╔╝       ██║   ╚██████╔╝╚███╔███╔╝███████╗██║  ██║       ██║   ██║  ██║██║  ██║██║     ██████╔╝╚██████╔╝╚██████╔╝██║  ██║
    //  ╚═════╝  ╚═════╝        ╚═╝    ╚═════╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝       ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝
    //

    // // Spawn the tower trapdoor as a door, with the trigger disabled.
    // // It's controlled via the button below. The extended cooldown time is to prevent button mashing
    this.towerTrapdoor = new Door(
      'base_north.tower_trapdoor',
      CONFIG.SCENE_TRANSFORM_180.position,
      CONFIG.SCENE_TRANSFORM_180.scale,
      CONFIG.SCENE_TRANSFORM_180.rotation,
      false,
      true
    )
    this.towerTrapdoor.isOpen = false
    this.towerTrapdoor.cooldown = 10000
    this.towerButton = new ButtonSprint(
      'lock.simple',
      Vector3.create(89.729, 34.398, 30.811),
      Vector3.create(1, 1, 1),
      Quaternion.fromEulerDegrees(0.0, 30.0, 0.0),
      () => {
        void this.onRaceStart()
        this.towerTrapdoor.unlockAndOpenDoor()
        utils.timers.setTimeout(() => {
          this.towerTrapdoor.closeDoor(false, true)
        }, 2000)
      },
      'Start the Race',
      8
    )
    //  ██████╗  ██╗    ███████╗██╗     ███████╗██╗   ██╗ █████╗ ████████╗ ██████╗ ██████╗
    // ██╔═████╗███║    ██╔════╝██║     ██╔════╝██║   ██║██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗
    // ██║██╔██║╚██║    █████╗  ██║     █████╗  ██║   ██║███████║   ██║   ██║   ██║██████╔╝
    // ████╔╝██║ ██║    ██╔══╝  ██║     ██╔══╝  ╚██╗ ██╔╝██╔══██║   ██║   ██║   ██║██╔══██╗
    // ╚██████╔╝ ██║    ███████╗███████╗███████╗ ╚████╔╝ ██║  ██║   ██║   ╚██████╔╝██║  ██║
    //  ╚═════╝  ╚═╝    ╚══════╝╚══════╝╚══════╝  ╚═══╝  ╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝
    //

    // Add the elevator gltf and animations
    this.floor01Elevator = new Elevator('01.elevator', false)
    this.floor01ElevatorBtn = new ElevatorButton(
      '01.elevator_btn',
      this.floor01Elevator
    )

    // A trigger to call the elevator down as the player approaches it
    this.floor01ElevatorOpenTrigger = new TriggerZone(
      Vector3.create(20.18, 9.462, 27.704),
      Vector3.create(6.0, 5.0, 6.0),
      Quaternion.fromEulerDegrees(0.0, 90.0, 0.0),
      () => {
        this.floor01Elevator.liftDown()
      }
    )
    //  ██████╗ ██████╗     ███████╗██╗     ███████╗██╗   ██╗ █████╗ ████████╗ ██████╗ ██████╗
    // ██╔═████╗╚════██╗    ██╔════╝██║     ██╔════╝██║   ██║██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗
    // ██║██╔██║ █████╔╝    █████╗  ██║     █████╗  ██║   ██║███████║   ██║   ██║   ██║██████╔╝
    // ████╔╝██║██╔═══╝     ██╔══╝  ██║     ██╔══╝  ╚██╗ ██╔╝██╔══██║   ██║   ██║   ██║██╔══██╗
    // ╚██████╔╝███████╗    ███████╗███████╗███████╗ ╚████╔╝ ██║  ██║   ██║   ╚██████╔╝██║  ██║
    //  ╚═════╝ ╚══════╝    ╚══════╝╚══════╝╚══════╝  ╚═══╝  ╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝
    //

    // Add the elevator gltf and animations
    this.floor02Elevator = new Elevator('02.elevator', false)
    this.floor02ElevatorBtn = new ElevatorButton(
      '02.elevator_btn',
      this.floor02Elevator
    )
    // A trigger to ensure the levator is down when the player approaches it
    this.floor02ElevatorEnterTrigger = new TriggerZone(
      Vector3.create(60.5, 31.544, 5.0),
      Vector3.create(10.0, 5.0, 9.0),
      Quaternion.fromEulerDegrees(0, 0, 0),
      () => {
        this.floor02Elevator.liftDown(true)
      }
    )
    //  ██████╗ ██████╗     ██╗     ██╗███████╗████████╗███████╗██████╗     ██████╗  ██████╗  ██████╗ ███╗   ███╗
    // ██╔═████╗╚════██╗    ██║     ██║██╔════╝╚══██╔══╝██╔════╝██╔══██╗    ██╔══██╗██╔═══██╗██╔═══██╗████╗ ████║
    // ██║██╔██║ █████╔╝    ██║     ██║█████╗     ██║   █████╗  ██████╔╝    ██████╔╝██║   ██║██║   ██║██╔████╔██║
    // ████╔╝██║ ╚═══██╗    ██║     ██║██╔══╝     ██║   ██╔══╝  ██╔══██╗    ██╔══██╗██║   ██║██║   ██║██║╚██╔╝██║
    // ╚██████╔╝██████╔╝    ███████╗██║██║        ██║   ███████╗██║  ██║    ██║  ██║╚██████╔╝╚██████╔╝██║ ╚═╝ ██║
    //  ╚═════╝ ╚═════╝     ╚══════╝╚═╝╚═╝        ╚═╝   ╚══════╝╚═╝  ╚═╝    ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝     ╚═╝
    //

    // Add the elevator GLTF and animations
    this.baseSouth3Lifter = new GLTFEntity(
      '03.lifter',
      CONFIG.SCENE_TRANSFORM_180.position,
      CONFIG.SCENE_TRANSFORM_180.scale,
      CONFIG.SCENE_TRANSFORM_180.rotation
    )

    // Pick a random speed for the lifter animation
    const lifterSpeedMin = 1.4
    const lifterSpeedMax = 1.75
    const lifterSpeed =
      Math.floor(Math.random() * (lifterSpeedMax - lifterSpeedMin + 1)) +
      lifterSpeedMin

    // Add an animator for the lifter, and then add the clip.
    // This way we can tweak the animation speed.
    Animator.create(this.baseSouth3Lifter.entity, {
      states: [
        {
          clip: 'lifter.action',
          loop: true,
          speed: lifterSpeed
        }
      ]
    })
    Animator.getClip(this.baseSouth3Lifter.entity, 'lifter.action').playing =
      true
    //  ██████╗ ██████╗     ███████╗██╗  ██╗ █████╗ ██████╗ ██╗  ██╗    ████████╗ █████╗ ███╗   ██╗██╗  ██╗
    // ██╔═████╗╚════██╗    ██╔════╝██║  ██║██╔══██╗██╔══██╗██║ ██╔╝    ╚══██╔══╝██╔══██╗████╗  ██║██║ ██╔╝
    // ██║██╔██║ █████╔╝    ███████╗███████║███████║██████╔╝█████╔╝        ██║   ███████║██╔██╗ ██║█████╔╝
    // ████╔╝██║ ╚═══██╗    ╚════██║██╔══██║██╔══██║██╔══██╗██╔═██╗        ██║   ██╔══██║██║╚██╗██║██╔═██╗
    // ╚██████╔╝██████╔╝    ███████║██║  ██║██║  ██║██║  ██║██║  ██╗       ██║   ██║  ██║██║ ╚████║██║  ██╗
    //  ╚═════╝ ╚═════╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝       ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝
    //

    // Add the flipping platform in the shark room
    this.baseSouth3SharkRoom = new GLTFEntity(
      '03.shark_room',
      CONFIG.SCENE_TRANSFORM_180.position,
      CONFIG.SCENE_TRANSFORM_180.scale,
      CONFIG.SCENE_TRANSFORM_180.rotation
    )

    // Add the trigger zone to reset the player
    this.sharkPoolTrigger = new TriggerZone(
      Vector3.create(32.525, 20.0, 9.755),
      Vector3.create(25, 2, 19),
      Quaternion.fromEulerDegrees(0, 0, 0),
      () => {
        const respawnPosition = Vector3.create(12, 26, 5)
        const repsawnCameraTarget = Vector3.create(20, 26, 5)
        void movePlayerTo({
          newRelativePosition: respawnPosition,
          cameraTarget: repsawnCameraTarget
        })
      }
    )
    //  ██████╗ ██╗  ██╗     █████╗ ██╗██████╗ ██╗      ██████╗  ██████╗██╗  ██╗
    // ██╔═████╗██║  ██║    ██╔══██╗██║██╔══██╗██║     ██╔═══██╗██╔════╝██║ ██╔╝
    // ██║██╔██║███████║    ███████║██║██████╔╝██║     ██║   ██║██║     █████╔╝
    // ████╔╝██║╚════██║    ██╔══██║██║██╔══██╗██║     ██║   ██║██║     ██╔═██╗
    // ╚██████╔╝     ██║    ██║  ██║██║██║  ██║███████╗╚██████╔╝╚██████╗██║  ██╗
    //  ╚═════╝      ╚═╝    ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝
    //

    // Add the airlock gltf and animations
    this.floor04Airlock = new Elevator('airlock', true)

    // floor_04_airlock.liftDown()
    // floor_04_airlock.isDown = true

    this.floor04AirlockBtn = new ButtonSprint(
      'airlock_btn',
      CONFIG.SCENE_TRANSFORM_180.position,
      CONFIG.SCENE_TRANSFORM_180.scale,
      CONFIG.SCENE_TRANSFORM_180.rotation,
      () => {
        this.floor04Airlock.liftUp()
        utils.timers.setTimeout(() => {
          this.floor04Airlock.liftDown()
        }, 1500)
      }
    )

    //  ██████╗ ██╗  ██╗    ███████╗██╗   ██╗██████╗ ███╗   ███╗ █████╗ ██████╗ ██╗███╗   ██╗███████╗
    // ██╔═████╗██║  ██║    ██╔════╝██║   ██║██╔══██╗████╗ ████║██╔══██╗██╔══██╗██║████╗  ██║██╔════╝
    // ██║██╔██║███████║    ███████╗██║   ██║██████╔╝██╔████╔██║███████║██████╔╝██║██╔██╗ ██║█████╗
    // ████╔╝██║╚════██║    ╚════██║██║   ██║██╔══██╗██║╚██╔╝██║██╔══██║██╔══██╗██║██║╚██╗██║██╔══╝
    // ╚██████╔╝     ██║    ███████║╚██████╔╝██████╔╝██║ ╚═╝ ██║██║  ██║██║  ██║██║██║ ╚████║███████╗
    //  ╚═════╝      ╚═╝    ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝
    //

    // Add the end game trigger button
    this.floor04SubmarineBtn = new ButtonSprint(
      'submarine.003.btn',
      Vector3.create(48.488, 42.524, 34.267),
      Vector3.create(1, 1, 1),
      Quaternion.fromEulerDegrees(0.0, 90.0, 0.0),
      () => {
        this.onRaceEnd()
      },
      'Launch!'
    )
    // ██████╗  ██████╗  ██████╗ ██████╗ ███████╗
    // ██╔══██╗██╔═══██╗██╔═══██╗██╔══██╗██╔════╝
    // ██║  ██║██║   ██║██║   ██║██████╔╝███████╗
    // ██║  ██║██║   ██║██║   ██║██╔══██╗╚════██║
    // ██████╔╝╚██████╔╝╚██████╔╝██║  ██║███████║
    // ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝
    //

    //  ██████╗██╗     ██╗ ██████╗██╗  ██╗███████╗██████╗     ██╗      ██████╗  ██████╗██╗  ██╗
    // ██╔════╝██║     ██║██╔════╝██║ ██╔╝██╔════╝██╔══██╗    ██║     ██╔═══██╗██╔════╝██║ ██╔╝
    // ██║     ██║     ██║██║     █████╔╝ █████╗  ██████╔╝    ██║     ██║   ██║██║     █████╔╝
    // ██║     ██║     ██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗    ██║     ██║   ██║██║     ██╔═██╗
    // ╚██████╗███████╗██║╚██████╗██║  ██╗███████╗██║  ██║    ███████╗╚██████╔╝╚██████╗██║  ██╗
    //  ╚═════╝╚══════╝╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝    ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝
    //

    const clickerLockTransforms = [
      // 0 - door.single.escape.airlock
      { position: Vector3.create(28.488, 40.643, 16.767) },

      // 1 - door.single.generator-room
      { position: Vector3.create(11.653, 7.007, 14.428) },

      // 2 - door.single.store-room
      { position: Vector3.create(50.211, 11.882, 12.408) },

      // 3 - hex-tunnel.tunnels.03
      { position: Vector3.create(41.0, 30.828, 9.5) },

      // 4 - lock.clicker.escape.airlock
      {
        position: Vector3.create(30.979, 40.518, 15.537),
        rotation: Quaternion.fromEulerDegrees(0.0, 300.0, 0.0)
      },

      // 5 - lock.clicker.store-room
      {
        position: Vector3.create(47.72, 11.882, 11.657),
        rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
      },

      // 6 - lock.clicker.generator.room
      {
        position: Vector3.create(9.449, 6.857, 12.577),
        rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0)
      },

      // 7 - lock.clicker.tunnels.03
      {
        position: Vector3.create(37.25, 30.828, 7.35),
        rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
      }
    ]

    // lock.clicker.generator.room
    this.doorGenRoom = new DoorRegular(
      'door.single.001',
      clickerLockTransforms[1].position,
      Vector3.create(1, 1, 1),
      Quaternion.fromEulerDegrees(0, 0, 0),
      false,
      true
    )

    this.lockGenRoom = new LockClicker(
      clickerLockTransforms[6].position,
      Vector3.create(1, 1, 1),
      clickerLockTransforms[6].rotation,
      () => {
        this.doorGenRoom.unlockAndOpenDoor()
        utils.timers.setTimeout(() => {
          this.doorGenRoom.lockAndCloseDoor()
        }, 5000)
      }
    )

    // lock.clicker.store_room
    this.doorStoreRoom = new DoorRegular(
      'door.single.001',
      clickerLockTransforms[2].position,
      Vector3.create(1, 1, 1),
      Quaternion.fromEulerDegrees(0, 0, 0),
      false,
      true
    )

    this.lockStoreRoom = new LockClicker(
      clickerLockTransforms[5].position,
      Vector3.create(1, 1, 1),
      clickerLockTransforms[5].rotation,
      () => {
        this.doorStoreRoom.unlockAndOpenDoor()

        utils.timers.setTimeout(() => {
          this.doorStoreRoom.lockAndCloseDoor()
        }, 5000)
      }
    )

    // lock.clicker.tunnels.03
    this.doorTunnel03 = new DoorLarge(
      'hex-tunnel.door',
      clickerLockTransforms[3].position,
      Vector3.create(1, 1, 1),
      Quaternion.fromEulerDegrees(0, 0, 0),
      false,
      true
    )
    // door_tunnel_03.closeDoor(false, true)
    // door_tunnel_03.lockDoor()

    this.lockTunnels03 = new LockClicker(
      clickerLockTransforms[7].position,
      Vector3.create(1, 1, 1),
      clickerLockTransforms[7].rotation,
      () => {
        this.doorTunnel03.unlockAndOpenDoor()
        utils.timers.setTimeout(() => {
          this.doorTunnel03.lockAndCloseDoor()
        }, 5000)
      }
    )

    // lock.clicker.airlock
    this.doorAirlock = new DoorRegular(
      'door.single.001',
      clickerLockTransforms[0].position,
      Vector3.create(1, 1, 1),
      Quaternion.fromEulerDegrees(0, 0, 0),
      false,
      true
    )

    this.lockAirlock = new LockClicker(
      clickerLockTransforms[4].position,
      Vector3.create(1, 1, 1),
      clickerLockTransforms[4].rotation,
      () => {
        this.doorAirlock.unlockAndOpenDoor()

        utils.timers.setTimeout(() => {
          this.doorAirlock.lockAndCloseDoor()
        }, 5000)
      }
    )
    // ███████╗██╗███╗   ███╗██████╗ ██╗     ███████╗    ██╗      ██████╗  ██████╗██╗  ██╗
    // ██╔════╝██║████╗ ████║██╔══██╗██║     ██╔════╝    ██║     ██╔═══██╗██╔════╝██║ ██╔╝
    // ███████╗██║██╔████╔██║██████╔╝██║     █████╗      ██║     ██║   ██║██║     █████╔╝
    // ╚════██║██║██║╚██╔╝██║██╔═══╝ ██║     ██╔══╝      ██║     ██║   ██║██║     ██╔═██╗
    // ███████║██║██║ ╚═╝ ██║██║     ███████╗███████╗    ███████╗╚██████╔╝╚██████╗██║  ██╗
    // ╚══════╝╚═╝╚═╝     ╚═╝╚═╝     ╚══════╝╚══════╝    ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝
    //

    const simpleLockTransforms = [
      // 0 - door.lifter_room.bottom
      {
        position: Vector3.create(36.575, 21.0, 59.414),
        rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
      },

      // 1 - door.lifter_room.top
      {
        position: Vector3.create(29.295, 30.844, 59.414),
        rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0)
      },

      // 2 - lock.simple.lifter_room.bottom
      {
        position: Vector3.create(35.029, 20.875, 56.195),
        rotation: Quaternion.fromEulerDegrees(0.0, 45.0, 0.0)
      },

      // 3 - lock.simple.lifter_room.top
      {
        position: Vector3.create(30.754, 30.453, 62.657),
        rotation: Quaternion.fromEulerDegrees(0.0, 225.0, 0.0)
      }
    ]

    // door.lifter_room.bottom
    this.doorLifterRoomBottom = new DoorLarge(
      'hex-tunnel.door',
      simpleLockTransforms[0].position,
      Vector3.create(1, 1, 1),
      simpleLockTransforms[0].rotation,
      false,
      true
    )

    // door_lifter_room_bottom.closeDoor(false, true)
    // door_lifter_room_bottom.lockDoor()

    this.lockSimpleLifterRoomBottom = new ButtonSprint(
      'lock.simple',
      simpleLockTransforms[2].position,
      Vector3.create(1, 1, 1),
      simpleLockTransforms[2].rotation,
      () => {
        console.log('Click!')
        this.doorLifterRoomBottom.unlockDoor()
        this.doorLifterRoomBottom.openDoor()

        utils.timers.setTimeout(() => {
          this.doorLifterRoomBottom.lockAndCloseDoor()
        }, 5000)
      }
    )

    // Add the doors for the locks to control
    // door.lifter_room.top
    this.doorLifterRoomTop = new DoorLarge(
      'hex-tunnel.door',
      simpleLockTransforms[1].position,
      Vector3.create(1, 1, 1),
      simpleLockTransforms[1].rotation,
      false,
      true
    )

    // door_lifter_room_top.closeDoor(false, true)
    // door_lifter_room_top.lockDoor()

    // Add the door control lock
    this.lockSimpleLifterRoomTop = new ButtonSprint(
      'lock.simple',
      simpleLockTransforms[3].position,
      Vector3.create(1, 1, 1),
      simpleLockTransforms[3].rotation,
      () => {
        console.log('Click!')
        this.doorLifterRoomTop.unlockDoor()
        this.doorLifterRoomTop.openDoor()
        utils.timers.setTimeout(() => {
          this.doorLifterRoomTop.lockAndCloseDoor(true)
        }, 5000)
      }
    )
    // ███████╗███╗   ███╗        ██████╗ ███╗   ██╗███████╗██╗    ██╗ █████╗ ██╗   ██╗
    // ██╔════╝████╗ ████║██╗    ██╔═══██╗████╗  ██║██╔════╝██║    ██║██╔══██╗╚██╗ ██╔╝
    // ███████╗██╔████╔██║╚═╝    ██║   ██║██╔██╗ ██║█████╗  ██║ █╗ ██║███████║ ╚████╔╝
    // ╚════██║██║╚██╔╝██║██╗    ██║   ██║██║╚██╗██║██╔══╝  ██║███╗██║██╔══██║  ╚██╔╝
    // ███████║██║ ╚═╝ ██║╚═╝    ╚██████╔╝██║ ╚████║███████╗╚███╔███╔╝██║  ██║   ██║
    // ╚══════╝╚═╝     ╚═╝        ╚═════╝ ╚═╝  ╚═══╝╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝
    //

    // Add the one-way, small single doors
    const oneWaySingleDoors = [
      // 0 - door.single.011
      {
        position: Vector3.create(25.429, 11.206, 45.96),
        rotation: Quaternion.fromEulerDegrees(0.0, 30.0, 0.0)
      },

      // 1 - door.single.012
      {
        position: Vector3.create(3.758, 6.698, 51.439),
        rotation: Quaternion.fromEulerDegrees(0.0, 0.0, 0.0)
      },

      // 2 - door.single.shark-room.entrance
      {
        position: Vector3.create(50.247, 25.2, 16.749),
        rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
      },

      // 3 - door.single.006
      {
        position: Vector3.create(45.247, 25.2, 16.749),
        rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
      },

      // 4 - door.single.002
      {
        position: Vector3.create(32.057, 11.857, 1.776),
        rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
      },

      // 5 - door.single.003
      {
        position: Vector3.create(32.057, 7.007, 4.55),
        rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
      },

      // 6 - door.single.elevator.02.exit
      {
        position: Vector3.create(43.92, 40.608, 3.748),
        rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0)
      },

      // 7 - door.single.005
      {
        position: Vector3.create(23.92, 40.608, 3.748),
        rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0)
      },

      // 8 - door.single.escape.airlock.001
      {
        position: Vector3.create(42.488, 40.65, 34.267),
        rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
      }
    ]
    this.doorSingles = []
    // Spawn all the one-way single doors
    for (let i = 0; i < oneWaySingleDoors.length; i++) {
      const doorSingle001 = new DoorRegular(
        'door.single.001',
        oneWaySingleDoors[i].position,
        Vector3.create(1, 1, 1),
        oneWaySingleDoors[i].rotation,
        true,
        true
      )
      this.doorSingles.push(doorSingle001)
    }
    // ███████╗███╗   ███╗        ██████╗ ███╗   ██╗███████╗██╗    ██╗ █████╗ ██╗   ██╗       ████████╗ ██████╗ ██╗    ██╗███████╗██████╗
    // ██╔════╝████╗ ████║██╗    ██╔═══██╗████╗  ██║██╔════╝██║    ██║██╔══██╗╚██╗ ██╔╝██╗    ╚══██╔══╝██╔═══██╗██║    ██║██╔════╝██╔══██╗
    // ███████╗██╔████╔██║╚═╝    ██║   ██║██╔██╗ ██║█████╗  ██║ █╗ ██║███████║ ╚████╔╝ ╚═╝       ██║   ██║   ██║██║ █╗ ██║█████╗  ██████╔╝
    // ╚════██║██║╚██╔╝██║██╗    ██║   ██║██║╚██╗██║██╔══╝  ██║███╗██║██╔══██║  ╚██╔╝  ██╗       ██║   ██║   ██║██║███╗██║██╔══╝  ██╔══██╗
    // ███████║██║ ╚═╝ ██║╚═╝    ╚██████╔╝██║ ╚████║███████╗╚███╔███╔╝██║  ██║   ██║   ╚═╝       ██║   ╚██████╔╝╚███╔███╔╝███████╗██║  ██║
    // ╚══════╝╚═╝     ╚═╝        ╚═════╝ ╚═╝  ╚═══╝╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝             ╚═╝    ╚═════╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝
    //
    const towerDoorTriggerTransform = {
      position: Vector3.create(-2, -1.25, -5.65),
      scale: Vector3.create(8, 3, 22),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    }

    // Spawn the array above, with the trigger transform above
    this.doorSingle001Tower = new DoorRegular(
      'door.single.001',
      Vector3.create(78.098, 12.018, 37.414),
      Vector3.create(1, 1, 1),
      Quaternion.fromEulerDegrees(0.0, 120.0, 0.0),
      true,
      true,
      towerDoorTriggerTransform.position,
      towerDoorTriggerTransform.scale,
      towerDoorTriggerTransform.rotation
    )
    this.doorSingle001Tower2 = new DoorRegular(
      'door.single.001',
      Vector3.create(77.04, 16.633, 33.587),
      Vector3.create(1, 1, 1),
      Quaternion.fromEulerDegrees(0.0, 90.0, 0.0),
      true,
      true,
      towerDoorTriggerTransform.position,
      towerDoorTriggerTransform.scale,
      towerDoorTriggerTransform.rotation
    )
    // ██╗      ██████╗     ██████╗ ██████╗  ██████╗ ██╗  ██╗███████╗███╗   ██╗
    // ██║     ██╔════╝     ██╔══██╗██╔══██╗██╔═══██╗██║ ██╔╝██╔════╝████╗  ██║
    // ██║     ██║  ███╗    ██████╔╝██████╔╝██║   ██║█████╔╝ █████╗  ██╔██╗ ██║
    // ██║     ██║   ██║    ██╔══██╗██╔══██╗██║   ██║██╔═██╗ ██╔══╝  ██║╚██╗██║
    // ███████╗╚██████╔╝    ██████╔╝██║  ██║╚██████╔╝██║  ██╗███████╗██║ ╚████║
    // ╚══════╝ ╚═════╝     ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝
    //

    // Add the large, broken doors, to the start and end of the first floor flooded tunnel

    // Spawn all the one-way large doors
    this.hexTunnelDoorBroken = new DoorBroken(
      'hex-tunnel.door.broken',
      Vector3.create(9.203, 0.953, 19.672),
      Vector3.create(1.2, 1.0, 1.2),
      Quaternion.fromEulerDegrees(0.0, 270.0, 0.0),
      false
    )
    this.hexTunnelDoorBroken2 = new DoorBroken(
      'hex-tunnel.door.broken',
      Vector3.create(47.226, 3.953, 18.692),
      Vector3.create(1.2, 1.0, 1.2),
      Quaternion.fromEulerDegrees(0.0, 90.0, 0.0),
      false
    )
    // ██╗      ██████╗         ██████╗ ███╗   ██╗███████╗██╗    ██╗ █████╗ ██╗   ██╗
    // ██║     ██╔════╝ ██╗    ██╔═══██╗████╗  ██║██╔════╝██║    ██║██╔══██╗╚██╗ ██╔╝
    // ██║     ██║  ███╗╚═╝    ██║   ██║██╔██╗ ██║█████╗  ██║ █╗ ██║███████║ ╚████╔╝
    // ██║     ██║   ██║██╗    ██║   ██║██║╚██╗██║██╔══╝  ██║███╗██║██╔══██║  ╚██╔╝
    // ███████╗╚██████╔╝╚═╝    ╚██████╔╝██║ ╚████║███████╗╚███╔███╔╝██║  ██║   ██║
    // ╚══════╝ ╚═════╝         ╚═════╝ ╚═╝  ╚═══╝╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝
    //

    const oneWayLargeDoors = [
      // 0 - hex-tunnel.door.015
      {
        position: Vector3.create(18.875, 21.0, 59.414),
        rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
      },

      // 1 - hex-tunnel.door.017
      {
        position: Vector3.create(8.875, 21.0, 49.414),
        rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0)
      },

      // 2 - hex-tunnel.door.014
      {
        position: Vector3.create(19.0, 30.828, 59.5),
        rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0)
      },

      // 3 - hex-tunnel.door.007
      {
        position: Vector3.create(12.5, 24.828, 14.5),
        rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0)
      },

      // 4 - hex-tunnel.door.021
      {
        position: Vector3.create(10.0, 24.828, 4.5),
        rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
      }
    ]
    this.hexTunnelDoors = []
    // Spawn all the one-way large doors
    for (let i = 0; i < oneWayLargeDoors.length; i++) {
      const hexTunnelDoor = new DoorLarge(
        'hex-tunnel.door',
        oneWayLargeDoors[i].position,
        Vector3.create(1, 1, 1),
        oneWayLargeDoors[i].rotation,
        true,
        true
      )
      this.hexTunnelDoors.push(hexTunnelDoor)
    }

    // Elevator.02 entrance
    // This gets spawned separately as it has a custom trigger box scale
    this.hexTunnelDoor2 = new DoorLarge(
      'hex-tunnel.door',
      Vector3.create(55.158, 30.828, 4.274),
      Vector3.create(1, 1, 1),
      Quaternion.fromEulerDegrees(0.0, 90.0, 0.0),
      true,
      true,
      Vector3.create(0, 0, 0),
      Vector3.create(7, 4, 16),
      Quaternion.fromEulerDegrees(0.0, 0.0, 0.0)
    )
    // ██╗      ██████╗        ████████╗██╗    ██╗ ██████╗ ██╗    ██╗ █████╗ ██╗   ██╗
    // ██║     ██╔════╝ ██╗    ╚══██╔══╝██║    ██║██╔═══██╗██║    ██║██╔══██╗╚██╗ ██╔╝
    // ██║     ██║  ███╗╚═╝       ██║   ██║ █╗ ██║██║   ██║██║ █╗ ██║███████║ ╚████╔╝
    // ██║     ██║   ██║██╗       ██║   ██║███╗██║██║   ██║██║███╗██║██╔══██║  ╚██╔╝
    // ███████╗╚██████╔╝╚═╝       ██║   ╚███╔███╔╝╚██████╔╝╚███╔███╔╝██║  ██║   ██║
    // ╚══════╝ ╚═════╝           ╚═╝    ╚══╝╚══╝  ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝
    //

    const twoWayDoorsLarge = [
      // 0 - hex-tunnel.door
      {
        position: Vector3.create(14.0, 30.828, 54.5),
        rotation: Quaternion.fromEulerDegrees(0, 0, 0)
      },

      // 1 - hex-tunnel.door.005
      {
        position: Vector3.create(4.0, 30.828, 54.5),
        rotation: Quaternion.fromEulerDegrees(0, 0, 0)
      },

      // 2 - hex-tunnel.door.006
      {
        position: Vector3.create(14.0, 30.828, 44.5),
        rotation: Quaternion.fromEulerDegrees(0, 0, 0)
      },

      // 3 - hex-tunnel.door.008
      {
        position: Vector3.create(14.0, 30.828, 34.5),
        rotation: Quaternion.fromEulerDegrees(0, 0, 0)
      },

      // 4 - hex-tunnel.door.010
      {
        position: Vector3.create(14.0, 30.828, 19.5),
        rotation: Quaternion.fromEulerDegrees(0, 0, 0)
      },

      // 5 - hex-tunnel.door.011
      {
        position: Vector3.create(4.0, 30.828, 19.5),
        rotation: Quaternion.fromEulerDegrees(0, 0, 0)
      },

      // 6 - hex-tunnel.door.012
      {
        position: Vector3.create(14.0, 30.828, 9.5),
        rotation: Quaternion.fromEulerDegrees(0, 0, 0)
      },

      // 7 - hex-tunnel.door.013
      {
        position: Vector3.create(4.0, 30.747, 9.5),
        rotation: Quaternion.fromEulerDegrees(0, 0, 0)
      },

      // 8 - hex-tunnel.door.016
      {
        position: Vector3.create(4.0, 30.828, 29.5),
        rotation: Quaternion.create(0.0, 180.0, 0.0)
      },

      // 9 - hex-tunnel.door.020
      {
        position: Vector3.create(3.875, 21.0, 44.414),
        rotation: Quaternion.fromEulerDegrees(0, 0, 0)
      },

      // 10 - hex-tunnel.door.001
      {
        position: Vector3.create(9.0, 30.828, 49.5),
        rotation: Quaternion.create(0.0, 270.0, 0.0)
      },

      // 11 - hex-tunnel.door.002
      {
        position: Vector3.create(9.0, 30.828, 39.5),
        rotation: Quaternion.create(0.0, 270.0, 0.0)
      },

      // 12 - hex-tunnel.door.003
      {
        position: Vector3.create(9.0, 30.828, 24.5),
        rotation: Quaternion.create(0.0, 270.0, 0.0)
      },

      // 13 - hex-tunnel.door.004
      {
        position: Vector3.create(9.0, 30.828, 14.5),
        rotation: Quaternion.create(0.0, 270.0, 0.0)
      }
    ]
    this.hexTunnelDoors3 = []
    // Spawn all the two-way doors
    for (let i = 0; i < twoWayDoorsLarge.length; i++) {
      const hexTunnelDoor3 = new DoorLarge(
        'hex-tunnel.door',
        twoWayDoorsLarge[i].position,
        Vector3.create(1, 1, 1),
        twoWayDoorsLarge[i].rotation
      )
      this.hexTunnelDoors3.push(hexTunnelDoor3)
    }
    // ███████╗ █████╗ ███╗   ██╗███████╗
    // ██╔════╝██╔══██╗████╗  ██║██╔════╝
    // █████╗  ███████║██╔██╗ ██║███████╗
    // ██╔══╝  ██╔══██║██║╚██╗██║╚════██║
    // ██║     ██║  ██║██║ ╚████║███████║
    // ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝
    //

    const fans = [
      // 0 - _hex-fan
      {
        position: Vector3.create(86.046, 21.299, 23.665),
        rotation: Quaternion.fromEulerDegrees(0, 0, 0)
      },

      // 1 - _hex-fan.001
      {
        position: Vector3.create(86.046, 26.479, 23.665),
        rotation: Quaternion.fromEulerDegrees(0, 0, 0)
      },

      // 2 - _hex-fan.002
      {
        position: Vector3.create(86.346, 26.331, 42.14),
        rotation: Quaternion.create(0.0, 180.0, 0.0)
      },

      // 3 - _hex-fan.003
      {
        position: Vector3.create(86.346, 21.312, 42.14),
        rotation: Quaternion.create(0.0, 180.0, 0.0)
      }
    ]
    this.fans = []
    // Spawn all the fans
    for (let i = 0; i < fans.length; i++) {
      const hexFan = new GLTFEntity(
        'hex-fan',
        fans[i].position,
        Vector3.create(1, 1, 1),
        fans[i].rotation
      )
      this.fans.push(hexFan)
    }
    // ██████╗ ██╗   ██╗██████╗ ██████╗ ██╗     ███████╗███████╗
    // ██╔══██╗██║   ██║██╔══██╗██╔══██╗██║     ██╔════╝██╔════╝
    // ██████╔╝██║   ██║██████╔╝██████╔╝██║     █████╗  ███████╗
    // ██╔══██╗██║   ██║██╔══██╗██╔══██╗██║     ██╔══╝  ╚════██║
    // ██████╔╝╚██████╔╝██████╔╝██████╔╝███████╗███████╗███████║
    // ╚═════╝  ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝
    //

    const bubbles = [
      // 0 - particles.bubbles.01
      {
        position: Vector3.create(62.438, 10.97, 46.455),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 118.66300000000001, 0.0)
      },
      // 1 - particles.bubbles.002
      {
        position: Vector3.create(54.386, 17.272, 31.323),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 88.66300000000001, 0.0)
      },
      // 2 - particles.bubbles.003
      {
        position: Vector3.create(45.119, 13.199, 41.148),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 88.66300000000001, 0.0)
      },
      // 3 - particles.bubbles.004
      {
        position: Vector3.create(43.118, 12.294, 45.137),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 88.66300000000001, 0.0)
      },
      // 4 - particles.bubbles.005
      {
        position: Vector3.create(39.34, 11.07, 53.537),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 41.742999999999995, 0.0)
      },
      // 5 - particles.bubbles.006
      {
        position: Vector3.create(57.084, 11.842, 54.747),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 99.18, 0.0)
      },
      // 6 - particles.bubbles.007
      {
        position: Vector3.create(44.538, 11.541, 34.318),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 99.18, 0.0)
      },
      // 7 - particles.bubbles.008
      {
        position: Vector3.create(26.087, 10.97, 55.514),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 126.88, 0.0)
      },
      // 8 - particles.bubbles.009
      {
        position: Vector3.create(49.245, 10.97, 53.124),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 116.72800000000001, 0.0)
      },
      // 9 - particles.bubbles.010
      {
        position: Vector3.create(47.456, 10.97, 49.039),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 296.728, 0.0)
      },
      // 10 - particles.bubbles.011
      {
        position: Vector3.create(42.781, 4.483, 45.403),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 226.855, 0.0)
      },
      // 11 - particles.bubbles.012
      {
        position: Vector3.create(31.913, 5.052, 56.995),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 93.47000000000003, 0.0)
      },
      // 12 - particles.bubbles.013
      {
        position: Vector3.create(22.414, 5.58, 49.679),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 36.38900000000001, 0.0)
      },
      // 13 - particles.bubbles.014
      {
        position: Vector3.create(45.205, 0.75, 29.185),
        scale: Vector3.create(1.431, 1.431, 1.431),
        rotation: Quaternion.fromEulerDegrees(0.0, 96.95499999999998, 0.0)
      },
      // 14 - particles.bubbles.015
      {
        position: Vector3.create(42.682, 1.729, 36.274),
        scale: Vector3.create(1.431, 1.431, 1.431),
        rotation: Quaternion.fromEulerDegrees(0.0, 223.99900000000002, 0.0)
      },
      // 15 - particles.bubbles.016
      {
        position: Vector3.create(40.372, 17.599, 31.262),
        scale: Vector3.create(1.431, 1.431, 1.431),
        rotation: Quaternion.fromEulerDegrees(0.0, 261.971, 0.0)
      },
      // 16 - particles.bubbles.017
      {
        position: Vector3.create(32.073, 17.599, 38.574),
        scale: Vector3.create(1.431, 1.431, 1.431),
        rotation: Quaternion.fromEulerDegrees(0.0, 196.81899999999996, 0.0)
      },
      // 17 - particles.bubbles.018
      {
        position: Vector3.create(62.013, 20.872, 21.655),
        scale: Vector3.create(1.431, 1.431, 1.431),
        rotation: Quaternion.fromEulerDegrees(0.0, 196.81899999999996, 0.0)
      },
      // 18 - particles.bubbles.019
      {
        position: Vector3.create(49.336, 24.519, 21.655),
        scale: Vector3.create(1.431, 1.61, 1.431),
        rotation: Quaternion.fromEulerDegrees(0.0, 356.329, 0.0)
      },
      // 19 - particles.bubbles.020
      {
        position: Vector3.create(34.891, 37.612, 20.521),
        scale: Vector3.create(1.431, 1.431, 1.431),
        rotation: Quaternion.fromEulerDegrees(0.0, 196.81899999999996, 0.0)
      },
      // 20 - particles.bubbles.021
      {
        position: Vector3.create(34.891, 45.513, 20.521),
        scale: Vector3.create(1.431, 1.431, 1.431),
        rotation: Quaternion.fromEulerDegrees(0.0, 16.819000000000017, 0.0)
      },
      // 21 - particles.bubbles.022
      {
        position: Vector3.create(72.298, 7.904, 14.423),
        scale: Vector3.create(1.431, 1.431, 1.431),
        rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0)
      },
      // 22 - particles.bubbles.023
      {
        position: Vector3.create(12.288, 41.509, 8.722),
        scale: Vector3.create(0.373, 0.438, 0.373),
        rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0)
      },
      // 23 - particles.bubbles.024
      {
        position: Vector3.create(43.676, 21.459, 54.772),
        scale: Vector3.create(0.373, 0.438, 0.373),
        rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0)
      },
      // 24 - particles.bubbles.025
      {
        position: Vector3.create(46.059, 21.459, 54.876),
        scale: Vector3.create(0.425, 0.499, 0.425),
        rotation: Quaternion.fromEulerDegrees(0.0, 315.0, 0.0)
      }
    ]
    this.bubbles = []
    for (let i = 0; i < bubbles.length; i++) {
      const randomSpeed = Math.floor(
        Math.random() *
          (CONFIG.BUBBLES_SPEED_MAX - CONFIG.BUBBLES_SPEED_MIN + 1) +
          CONFIG.BUBBLES_SPEED_MIN
      )
      const particlesBubblesO1 = new GLTFParticles(
        'particles.bubbles.01',
        bubbles[i].position,
        bubbles[i].scale,
        bubbles[i].rotation,
        'action.bubbles',
        true,
        0,
        randomSpeed
      )
      this.bubbles.push(particlesBubblesO1)
    }
    //  ██████╗ █████╗ ██╗   ██╗███████╗████████╗██╗ ██████╗███████╗
    // ██╔════╝██╔══██╗██║   ██║██╔════╝╚══██╔══╝██║██╔════╝██╔════╝
    // ██║     ███████║██║   ██║███████╗   ██║   ██║██║     ███████╗
    // ██║     ██╔══██║██║   ██║╚════██║   ██║   ██║██║     ╚════██║
    // ╚██████╗██║  ██║╚██████╔╝███████║   ██║   ██║╚██████╗███████║
    //  ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ╚═╝ ╚═════╝╚══════╝
    //

    const caustics = [
      // 0 - particles.caustics.01
      {
        position: Vector3.create(68.435, 10.829, 43.185),
        scale: Vector3.create(1.23, 1.23, 1.23),
        rotation: Quaternion.fromEulerDegrees(315.0, 120.0, 0.0)
      },
      // 1 - particles.caustics.003
      {
        position: Vector3.create(73.945, 12.267, 39.812),
        scale: Vector3.create(3.527, 3.527, 3.527),
        rotation: Quaternion.fromEulerDegrees(0.0, 120.0, 0.0)
      },
      // 2 - particles.caustics.002
      {
        position: Vector3.create(51.666, 13.259, 49.673),
        scale: Vector3.create(1.226, 1.226, 1.226),
        rotation: Quaternion.fromEulerDegrees(0.0, 30.0, 0.0)
      },
      // 3 - particles.caustics.004
      {
        position: Vector3.create(40.598, 6.969, 53.405),
        scale: Vector3.create(1.117, 1.117, 1.117),
        rotation: Quaternion.fromEulerDegrees(0.0, 58.240999999999985, 0.0)
      },
      // 4 - particles.caustics.005
      {
        position: Vector3.create(49.326, 6.988, 53.973),
        scale: Vector3.create(1.209, 1.209, 1.209),
        rotation: Quaternion.fromEulerDegrees(0.0, 117.28499999999997, 0.0)
      },
      // 5 - particles.caustics.006
      {
        position: Vector3.create(59.935, 15.582, 31.323),
        scale: Vector3.create(2.219, 2.219, 1.544),
        rotation: Quaternion.fromEulerDegrees(317.20799999999997, 90.0, 0.0)
      },
      // 6 - particles.caustics.007
      {
        position: Vector3.create(36.501, 1.79, 28.341),
        scale: Vector3.create(7.382, 1.0, 7.382),
        rotation: Quaternion.fromEulerDegrees(0.0, 40.178999999999974, 0.0)
      },
      // 7 - particles.caustics.008
      {
        position: Vector3.create(42.01, 1.81, 18.695),
        scale: Vector3.create(12.911, 1.0, 11.041),
        rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
      },
      // 8 - particles.caustics.010
      {
        position: Vector3.create(50.045, 11.941, 5.323),
        scale: Vector3.create(2.595, 3.007, 3.158),
        rotation: Quaternion.fromEulerDegrees(0.0, 0.0, 0.0)
      },
      // 9 - particles.caustics.011
      {
        position: Vector3.create(72.415, 16.843, 33.699),
        scale: Vector3.create(1.025, 1.025, 1.025),
        rotation: Quaternion.fromEulerDegrees(0.0, 84.40300000000002, 0.0)
      },
      // 10 - particles.caustics.012
      {
        position: Vector3.create(74.35, 16.843, 33.874),
        scale: Vector3.create(1.025, 1.025, 1.025),
        rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0)
      },
      // 11 - particles.caustics.013
      {
        position: Vector3.create(66.998, 9.242, 43.876),
        scale: Vector3.create(1.057, 1.057, 1.057),
        rotation: Quaternion.fromEulerDegrees(
          315.047,
          117.68099999999998,
          2.3170000000000073
        )
      },
      // 12 - particles.caustics.014
      {
        position: Vector3.create(52.599, 13.259, 51.53),
        scale: Vector3.create(1.226, 1.226, 1.226),
        rotation: Quaternion.fromEulerDegrees(0.0, 204.225, 0.0)
      },
      // 13 - particles.caustics.015
      {
        position: Vector3.create(42.201, 6.969, 54.381),
        scale: Vector3.create(1.117, 1.117, 1.117),
        rotation: Quaternion.fromEulerDegrees(0.0, 235.712, 0.0)
      },
      // 14 - particles.caustics.016
      {
        position: Vector3.create(51.271, 6.988, 52.97),
        scale: Vector3.create(1.209, 1.209, 1.209),
        rotation: Quaternion.fromEulerDegrees(0.0, 297.28499999999997, 0.0)
      },
      // 15 - particles.caustics.009
      {
        position: Vector3.create(50.154, 11.941, 19.737),
        scale: Vector3.create(2.595, 3.007, 3.158),
        rotation: Quaternion.fromEulerDegrees(0.0, 0.0, 0.0)
      },
      // 16 - particles.caustics.020
      {
        position: Vector3.create(61.003, 1.577, 18.825),
        scale: Vector3.create(7.13, 7.13, 4.962),
        rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0)
      },
      // 17 - particles.caustics.017
      {
        position: Vector3.create(32.324, 1.8, 21.612),
        scale: Vector3.create(10.567, 0.666, 7.354),
        rotation: Quaternion.fromEulerDegrees(0.0, 312.0, 0.0)
      }
    ]
    this.particlesCaustics = []
    for (let i = 0; i < caustics.length; i++) {
      const particlesCaustics01 = new GLTFParticles(
        'particles.caustics.01',
        caustics[i].position,
        caustics[i].scale,
        caustics[i].rotation,
        'action.caustics'
      )
      this.particlesCaustics.push(particlesCaustics01)
    }
    // ███████╗██╗███████╗██╗  ██╗
    // ██╔════╝██║██╔════╝██║  ██║
    // █████╗  ██║███████╗███████║
    // ██╔══╝  ██║╚════██║██╔══██║
    // ██║     ██║███████║██║  ██║
    // ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝
    //

    const fish = [
      // 0 - particles.fish.01
      {
        position: Vector3.create(45.543, 5.496, 32.359),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 54.65899999999999, 0.0)
      },
      // 1 - particles.fish.002
      {
        position: Vector3.create(39.702, 15.199, 42.841),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 27.86700000000002, 0.0)
      },
      // 2 - particles.fish.003
      {
        position: Vector3.create(68.984, 13.738, 36.531),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 27.86700000000002, 0.0)
      },
      // 3 - particles.fish.004
      {
        position: Vector3.create(49.066, 15.051, 28.669),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 212.375, 0.0)
      },
      // 4 - particles.fish.005
      {
        position: Vector3.create(44.198, 8.6, 49.049),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 160.791, 0.0)
      },
      // 5 - particles.fish.006
      {
        position: Vector3.create(35.875, 50.668, 21.008),
        scale: Vector3.create(1.087, 1.087, 1.087),
        rotation: Quaternion.fromEulerDegrees(0.0, 197.114, 0.0)
      },
      // 6 - particles.fish.007
      {
        position: Vector3.create(49.455, 40.627, 14.385),
        scale: Vector3.create(1.087, 1.087, 1.087),
        rotation: Quaternion.fromEulerDegrees(0.0, 197.114, 0.0)
      },
      // 7 - particles.fish.008
      {
        position: Vector3.create(18.158, 41.125, 11.898),
        scale: Vector3.create(0.222, 0.222, 0.222),
        rotation: Quaternion.fromEulerDegrees(0.0, 177.478, 0.0)
      },
      // 8 - particles.fish.009
      {
        position: Vector3.create(21.291, 41.125, 11.92),
        scale: Vector3.create(0.222, 0.222, 0.222),
        rotation: Quaternion.fromEulerDegrees(0.0, 357.478, 0.0)
      }
    ]
    this.particlesFish = []
    for (let i = 0; i < fish.length; i++) {
      const randomSpeed = Math.random() * (CONFIG.FISH_SPEED_MAX - CONFIG.FISH_SPEED_MIN) + CONFIG.FISH_SPEED_MIN;
      console.log('random speed ' + randomSpeed)
      const particlesFish01 = new GLTFParticles(
        'particles.fish.01',
        fish[i].position,
        fish[i].scale,
        fish[i].rotation,
        'action.fish',
        true,
        0,
        randomSpeed
      )
      this.particlesFish.push(particlesFish01)
    }
    // ███████╗██╗  ██╗ █████╗ ██████╗ ██╗  ██╗███████╗
    // ██╔════╝██║  ██║██╔══██╗██╔══██╗██║ ██╔╝██╔════╝
    // ███████╗███████║███████║██████╔╝█████╔╝ ███████╗
    // ╚════██║██╔══██║██╔══██║██╔══██╗██╔═██╗ ╚════██║
    // ███████║██║  ██║██║  ██║██║  ██║██║  ██╗███████║
    // ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
    //
    //

    const sharks = [
      // 0 - hammerhead_shark_02.006
      {
        position: Vector3.create(31.698, 23.831, 32.437),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0)
      },
      // 1 - hammerhead_shark_02.001
      {
        position: Vector3.create(64.901, 17.281, 38.547),
        scale: Vector3.create(0.6, 0.6, 0.6),
        rotation: Quaternion.fromEulerDegrees(0.0, 352.265, 0.0)
      },
      // 2 - hammerhead_shark_02.002
      {
        position: Vector3.create(47.536, 40.324, 21.306),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 0.0, 0.0)
      },
      // 3 - hammerhead_shark_02.003
      {
        position: Vector3.create(40.207, 14.046, 42.001),
        scale: Vector3.create(0.6, 0.6, 0.6),
        rotation: Quaternion.fromEulerDegrees(0.0, 352.265, 0.0)
      },
      // 4 - hammerhead_shark_02.004
      {
        position: Vector3.create(51.69, 24.597, 28.201),
        rotation: Quaternion.fromEulerDegrees(0.0, 135.0, 0.0),
        scale: Vector3.create(1, 1, 1)
      },
      // 5 - hammerhead_shark_02.005
      {
        position: Vector3.create(61.128, 12.549, 14.053),
        scale: Vector3.create(0.6, 0.6, 0.6),
        rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0)
      }
    ]
    this.creatureSharks = []
    for (let i = 0; i < sharks.length; i++) {
      const randomSpeed = Math.floor(
        Math.random() * (CONFIG.SHARK_SPEED_MAX - CONFIG.SHARK_SPEED_MIN + 1) +
          CONFIG.SHARK_SPEED_MIN
      )
      const creatureShark02 = new GLTFParticles(
        'creature.shark.02',
        sharks[i].position,
        sharks[i].scale,
        sharks[i].rotation,
        'action',
        true,
        0,
        randomSpeed
      )
      this.creatureSharks.push(creatureShark02)
    }

    // Moon pool shark - he's one of a kind and moves in his own way
    this.shark01 = new GLTFEntity(
      'creature.shark.01',
      CONFIG.SCENE_TRANSFORM_180.position,
      CONFIG.SCENE_TRANSFORM_180.scale,
      CONFIG.SCENE_TRANSFORM_180.rotation
    )
    // ██╗    ██╗ █████╗ ████████╗███████╗██████╗     ██████╗ ██████╗ ██╗██████╗ ███████╗
    // ██║    ██║██╔══██╗╚══██╔══╝██╔════╝██╔══██╗    ██╔══██╗██╔══██╗██║██╔══██╗██╔════╝
    // ██║ █╗ ██║███████║   ██║   █████╗  ██████╔╝    ██║  ██║██████╔╝██║██████╔╝███████╗
    // ██║███╗██║██╔══██║   ██║   ██╔══╝  ██╔══██╗    ██║  ██║██╔══██╗██║██╔═══╝ ╚════██║
    // ╚███╔███╔╝██║  ██║   ██║   ███████╗██║  ██║    ██████╔╝██║  ██║██║██║     ███████║
    //  ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝     ╚══════╝
    //

    const droplets = [
      // 0 - particles.water-drips.01
      {
        position: Vector3.create(39.583, 1.769, 32.934),
        rotation: Quaternion.fromEulerDegrees(0.0, 135.0, 0.0),
        scale: Vector3.create(1, 1, 1)
      },
      // 1 - particles.water-drips.003
      {
        position: Vector3.create(72.701, 0.677, 20.209),
        rotation: Quaternion.fromEulerDegrees(0.0, 135.0, 0.0),
        scale: Vector3.create(1, 1, 1)
      },
      // 2 - particles.water-drips.002
      {
        position: Vector3.create(28.519, 0.884, 12.621),
        rotation: Quaternion.fromEulerDegrees(0.0, 135.0, 0.0),
        scale: Vector3.create(1, 1, 1)
      }
    ]
    this.particlesWaterDrips = [] 
    for (let i = 0; i < droplets.length; i++) {
      const particlesWaterDrips01 = new GLTFParticles(
        'particles.water-drips.01',
        droplets[i].position,
        droplets[i].scale,
        droplets[i].rotation,
        'action.water-01'
      )
      this.particlesWaterDrips.push(particlesWaterDrips01)
    }
    // ███████╗ █████╗ ██████╗ ██████╗ ███████╗██████╗ ███████╗
    // ╚══███╔╝██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔════╝
    //   ███╔╝ ███████║██████╔╝██████╔╝█████╗  ██████╔╝███████╗
    //  ███╔╝  ██╔══██║██╔═══╝ ██╔═══╝ ██╔══╝  ██╔══██╗╚════██║
    // ███████╗██║  ██║██║     ██║     ███████╗██║  ██║███████║
    // ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝
    //

    this.ZAPPER_QUANTITY = 14
    this.ZAPPER_MODELS = ['wires.01', 'wires.02']

    const zapperPositions = [
      // 0 - wires.001
      {
        position: Vector3.create(62.794, 5.453, 5.52),
        rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0),
        scale: Vector3.create(1, 1, 1)
      },
      // 1 - wires.002
      {
        position: Vector3.create(62.794, 5.453, 17.869),
        rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0),
        scale: Vector3.create(1, 1, 1)
      },
      // 2 - wires.004
      {
        position: Vector3.create(26.801, 5.453, 8.766),
        rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0),
        scale: Vector3.create(1, 1, 1)
      },
      // 3 - wires.005
      {
        position: Vector3.create(58.378, 5.453, 19.442),
        rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0),
        scale: Vector3.create(1, 1, 1)
      },
      // 4 - wires.006
      {
        position: Vector3.create(71.25, 5.453, 14.5),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 0.0, 0.0)
      },
      // 5 - wires.007
      {
        position: Vector3.create(66.878, 5.453, 7.942),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 0.0, 0.0)
      },
      // 6 - wires.008
      {
        position: Vector3.create(40.032, 5.453, 5.692),
        rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0),
        scale: Vector3.create(1, 1, 1)
      },
      // 7 - wires.009
      {
        position: Vector3.create(25.033, 5.453, 14.069),
        rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0),
        scale: Vector3.create(1, 1, 1)
      },
      // 8 - wires.010
      {
        position: Vector3.create(15.178, 5.453, 17.422),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 0.0, 0.0)
      },
      // 9 - wires.003
      {
        position: Vector3.create(57.184, 5.453, 7.817),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 0.0, 0.0)
      },
      // 10 - wires.011
      {
        position: Vector3.create(56.184, 5.453, 4.267),
        rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0),
        scale: Vector3.create(1, 1, 1)
      },
      // 11 - wires.013
      {
        position: Vector3.create(64.794, 5.453, 21.117),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 0.0, 0.0)
      },
      // 12 - wires.014
      {
        position: Vector3.create(71.128, 5.453, 7.442),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 0.0, 0.0)
      },
      // 13 - wires.015
      {
        position: Vector3.create(71.128, 5.453, 9.442),
        rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0),
        scale: Vector3.create(1, 1, 1)
      },
      // 14 - wires.016
      {
        position: Vector3.create(67.128, 5.453, 3.453),
        rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0),
        scale: Vector3.create(1, 1, 1)
      },
      // 15 - wires.017
      {
        position: Vector3.create(53.184, 5.453, 6.817),
        rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0),
        scale: Vector3.create(1, 1, 1)
      },
      // 16 - wires.018
      {
        position: Vector3.create(52.184, 5.453, 3.567),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 0.0, 0.0)
      },
      // 17 - wires.012
      {
        position: Vector3.create(43.559, 5.453, 7.317),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0.0, 0.0, 0.0)
      },
      // 18 - wires.019
      {
        position: Vector3.create(43.559, 5.453, 4.267),
        rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0),
        scale: Vector3.create(1, 1, 1)
      },
      // 19 - wires.020
      {
        position: Vector3.create(34.559, 5.453, 7.317),
        rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0),
        scale: Vector3.create(1, 1, 1)
      },
      // 20 - wires.021
      {
        position: Vector3.create(34.559, 5.453, 4.267),
        rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0),
        scale: Vector3.create(1, 1, 1)
      },
      // 21 - wires.022
      {
        position: Vector3.create(22.205, 5.453, 15.055),
        rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0),
        scale: Vector3.create(1, 1, 1)
      },
      // 22 - wires.023
      {
        position: Vector3.create(12.178, 5.453, 18.422),
        rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0),
        scale: Vector3.create(1, 1, 1)
      },
      // 23 - wires.024
      {
        position: Vector3.create(15.178, 5.453, 20.422),
        rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0),
        scale: Vector3.create(1, 1, 1)
      }
    ]

    // Confirm the number of zappers to spawn does not exceed the number of possible zapper transforms
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const zapperQty = Math.min(this.ZAPPER_QUANTITY, zapperPositions.length)

    // Create a blank array for the zappers to fill
    this.zappers = []

    // Loop through each of the possible
    for (let i = 0; i < zapperPositions.length; i++) {
      // Pick a random model from the possible models
      const randomModelIndex = Math.floor(
        Math.random() * this.ZAPPER_MODELS.length
      )

      // Spawn the Zapper and add it to both the objects and zapper arrays
      const zapper = new Zapper(
        this.ZAPPER_MODELS[randomModelIndex],
        zapperPositions[i].position,
        zapperPositions[i].scale,
        zapperPositions[i].rotation
      )
      this.zappers.push(zapper)
    }
    this.enableAllObjects()
  }

  async onRaceStart(): Promise<void> {
    let startClicked = false
    console.log('Race is starting! WOOOOOP')

    if (startClicked) return
    startClicked = true
    const publicKey = await getUserData({})
    // Create entity
    const cube = entityController.addEntity()
    Transform.createOrReplace(cube, {
      parent: engine.PlayerEntity
    })
    AvatarAttach.createOrReplace(cube, {
      avatarId: publicKey.data?.publicKey,
      anchorPointId: AvatarAnchorPointType.AAPT_NAME_TAG
    })
    // Create AudioClip object, holding audio file
    AudioSource.create(cube, {
      audioClipUrl: 'sounds/solosprintMusicTrack.mp3'
    })
    // Add AudioSource component to entity
    // start timer
    // if connected to lobby, lobby will overwrite, but still want this here to enforce expectation
    // Constants.SCENE_MGR.lastRaceType = 'solosprint'
    // powerUpBarUI.show()
    // GAME_STATE.setGameTimeFromServerClock({ serverTime: -2 }) // using local game time since not connected
    // PowerUpsInv.powerUpMgr.reset()
    // PowerUpsInv.powerUpMgr.initPowerUps(options.powerUps)
    // PowerUpsInv.powerUpMgr.updateStatuses()
    // save too??
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const preFuel = this.gameController.Player.getFuel()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const preFuelAdj = this.gameController.Player.getValueAdjuster().fuel
    this.gameController.Player.getValueAdjuster().fuel -=
      this.gameController.soloSprint.getFuelCost(50)
    this.gameController.uiController.profile.updateFuel()
    void this.gameController.Player.writeDataToServer({
      onFinish: { updateUI: true }
    })
    // sprintTimer.startTimer(options);
  }

  hasEnableMethod(obj: any): obj is { enable: () => void } {
    return typeof obj.enable === 'function'
  }

  hasDisableMethod(obj: any): obj is { disable: () => void } {
    return typeof obj.disable === 'function'
  }

  enableAllObjects(): void {
    const allProperties = Object.values(this)

    allProperties.forEach((obj) => {
      if (Array.isArray(obj)) {
        obj.forEach((item) => {
          if (this.hasEnableMethod(item)) {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
            console.log(`Enabling object in array: ${item}`)
            item.enable()
          } else {
            console.log(
              `Object in array does not have an enable() method: ${item}`
            )
          }
        })
      } else if (this.hasEnableMethod(obj)) {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
        console.log(`Enabling object: ${obj}`)
        obj.enable()
      } else {
        console.log(`Object does not have an enable() method: ${obj}`)
      }
    })
  }

  disableAllObjects(): void {
    const allProperties = Object.values(this)

    allProperties.forEach((obj) => {
      if (Array.isArray(obj)) {
        obj.forEach((item) => {
          if (this.hasDisableMethod(item)) {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
            console.log(`Disabling object in array: ${item}`)
            item.disable()
          } else {
            console.log(
              `Object in array does not have a disable() method: ${item}`
            )
          }
        })
      } else if (this.hasDisableMethod(obj)) {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
        console.log(`Disabling object: ${obj}`)
        obj.disable()
      } else {
        console.log(`Object does not have a disable() method: ${obj}`)
      }
    })
  }

  onRaceEnd(): void {
    const respawnPosition = Vector3.create(33.5, 0, 57.5)
    void movePlayerTo({ newRelativePosition: respawnPosition })
    // debugger
    console.log('Race is over. Finished. DONE-ZO!')
    // end timer
    // by setting this the timer should pick up and close race out
    // this.gameController.sprintTimer.sprintComplete = true
  }

  reset(): void {
    console.log('TRACK RESET!')
    utils.timers.setTimeout(() => {
      this.randomiseZappers()
    }, 500)

    // // Loop through all the objects in the scene
    // for (let i = 0; i < SCENE_BASE_MAIN.objects.length; i++) {
    //   // Set a reference to the object
    //   const obj = SCENE_BASE_MAIN.objects[i] as unknown as Door | Elevator

    //   // Check if the object is one that needs to be reset
    //   if (obj instanceof Door || obj instanceof Elevator) {
    //     // log("Resetting door/elevator")
    //     obj.reset()
    //   }
    // }
  }

  randomiseZappers(): void {
    // log("DEBUG: RandomiseZappers")
    // log("DEBUG: zapper_array_index_start: " + zapper_array_index_start)
    // log("DEBUG: zapper_array_index_end: " + zapper_array_index_end)
    // Loop through all zappers first and siable them
    for (let i = 0; i < this.zappers.length; i++) {
      // log("DEBUG: disabling zapper index " + i)
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const zapper = this.zappers[i] as Zapper
      zapper.disable()
    }
    // Create an array of the zapper indexes so we can randomly choose and remove the indexes
    const zapperIndexes: number[] = []
    for (let i = 0; i < this.zappers.length + 1; i++) {
      zapperIndexes.push(i)
    }
    // Next, choose one of the zapper_indexes at random and enable that zapper
    // then remove the index from the array of indexes so we don't enable it multiple times
    for (let i = 0; i < this.ZAPPER_QUANTITY; i++) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      if (zapperIndexes.length === 0) {
        break // No more zappers available
      }
      const randomIndex = Math.floor(Math.random() * zapperIndexes.length)
      // log("DEBUG: Enabling Zapper index " + randomIndex)
      const zapperIndex = zapperIndexes.splice(randomIndex, 1)[0]
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const zapper = this.zappers[zapperIndex] as Zapper
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (zapper) {
        zapper.enable()
      }
    }
    console.log('Zappers have been randomised')
    // log("DEBUG: zapper_index have remaining count: " + zapper_indexes.length)
  }

  callSingleFunction(functionName: string, boolean: boolean): void {
    if (functionName === 'onRaceStart') {
      void this.onRaceStart()
    }
  }

  spawnSingleEntity(entityName: string): void {}

  removeSingleEntity(entityName: string): void {}

  removeAllEntities(): void {
    // triggers
    this.hexTunnelDoorBroken.removerTriggerEntity()
    this.doorSingle001Tower2.removerTriggerEntity()
    this.doorSingle001Tower.removerTriggerEntity()
    this.hexTunnelDoor2.removerTriggerEntity()
    this.hexTunnelDoorBroken2.removerTriggerEntity()
    // Entities
    entityController.removeEntity(this.base_combined.entity)
    entityController.removeEntity(this.terrain_combined.entity)
    entityController.removeEntity(this.scene_skybox_combined.entity)
    entityController.removeEntity(this.btnGoToStart.entity)
    entityController.removeEntity(this.towerButton.entity)
    entityController.removeEntity(this.towerTrapdoor.entity)
    entityController.removeEntity(this.floor01Elevator.entity)
    entityController.removeEntity(this.floor01ElevatorBtn.entity)
    entityController.removeEntity(this.floor01ElevatorOpenTrigger.entity)
    entityController.removeEntity(this.floor02Elevator.entity)
    entityController.removeEntity(this.floor02ElevatorBtn.entity)
    entityController.removeEntity(this.floor02ElevatorEnterTrigger.entity)
    entityController.removeEntity(this.baseSouth3Lifter.entity)
    entityController.removeEntity(this.baseSouth3SharkRoom.entity)
    entityController.removeEntity(this.sharkPoolTrigger.entity)
    entityController.removeEntity(this.floor04Airlock.entity)
    entityController.removeEntity(this.floor04AirlockBtn.entity)
    entityController.removeEntity(this.floor04SubmarineBtn.entity)
    entityController.removeEntity(this.doorGenRoom.entity)
    entityController.removeEntity(this.lockGenRoom.entity)
    entityController.removeEntity(this.doorStoreRoom.entity)
    entityController.removeEntity(this.lockStoreRoom.entity)
    entityController.removeEntity(this.doorTunnel03.entity)
    entityController.removeEntity(this.lockTunnels03.entity)
    entityController.removeEntity(this.doorAirlock.entity)
    entityController.removeEntity(this.lockAirlock.entity)
    entityController.removeEntity(this.doorLifterRoomBottom.entity)
    entityController.removeEntity(this.doorLifterRoomTop.entity)
    entityController.removeEntity(this.lockSimpleLifterRoomBottom.entity)
    entityController.removeEntity(this.lockSimpleLifterRoomTop.entity)
    entityController.removeEntity(this.doorSingle001Tower.entity)
    entityController.removeEntity(this.doorSingle001Tower2.entity)
    entityController.removeEntity(this.hexTunnelDoorBroken.entity)
    entityController.removeEntity(this.hexTunnelDoor2.entity)
    entityController.removeEntity(this.hexTunnelDoorBroken2.entity)
    entityController.removeEntity(this.shark01.entity)
    // Arrays
    this.doorSingles.forEach((entity) => {
      entity.removerTriggerEntity()
      entityController.removeEntity(entity.entity)
    })
    this.hexTunnelDoors.forEach((entity) => {
      entity.removerTriggerEntity()
      entityController.removeEntity(entity.entity)
    })
    this.hexTunnelDoors3.forEach((entity) => {
      entity.removerTriggerEntity()
      entityController.removeEntity(entity.entity)
    })
    this.fans.forEach((entity) => {
      entityController.removeEntity(entity.entity)
    })
    this.bubbles.forEach((entity) => {
      entityController.removeEntity(entity.entity)
    })
    this.particlesCaustics.forEach((entity) => {
      entityController.removeEntity(entity.entity)
    })
    this.particlesFish.forEach((entity) => {
      entityController.removeEntity(entity.entity)
    })
    this.creatureSharks.forEach((entity) => {
      entityController.removeEntity(entity.entity)
    })

    this.particlesWaterDrips.forEach((entity) => {
      entityController.removeEntity(entity.entity)
    })
    this.zappers.forEach((entity) => {
      entity.removerTriggerEntity()
      entityController.removeEntity(entity.entity)
    })
    this.disableAllObjects()
  }

  getId(): RealmType {
    return 'soloSprint'
  }

  deadPosition(): Vector3 {
    return { x: -38.34, y: 10.43, z: -39.75 }
  }
}
