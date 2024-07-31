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
import { Animator, type Entity } from '@dcl/sdk/ecs'
import { DoorRegular } from './classes/class.doorRegular'
import { LockClicker } from './classes/class.lockClicker'
import { DoorLarge } from './classes/class.doorLarge'


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
  doorSingles: Entity[]
  // doorSingle001Tower: DoorRegular
  // doorSingle001Tower2: DoorRegular
  // hexTunnelDoorBroken: DoorBroken
  // hexTunnelDoorBroken2: DoorBroken
  // hexTunnelDoors: Entity[]
  // hexTunnelDoor2: DoorLarge
  // hexTunnelDoors3: Entity[]
  // fans: Entity[]
  // bubbles: Entity[]
  // hexTunnelDoor015: DoorLarge
  // hexTunnelDoor017: DoorLarge
  // hexTunnelDoor014: DoorLarge
  // hexTunnelDoor007: DoorLarge
  // hexTunnelDoor021: DoorLarge
  // hexTunnelDoor002: DoorLarge
  // hexTunnelDoor003: DoorLarge
  // hexTunnelDoor004: DoorLarge
  // hexTunnelDoor020: DoorLarge
  // hexTunnelDoor001: DoorLarge

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
        this.onRaceStart()
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
      { position: Vector3.create(3.758, 6.698, 51.439),
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
      this.doorSingles.push(doorSingle001.entity)
    }
    // // ███████╗███╗   ███╗        ██████╗ ███╗   ██╗███████╗██╗    ██╗ █████╗ ██╗   ██╗       ████████╗ ██████╗ ██╗    ██╗███████╗██████╗
    // // ██╔════╝████╗ ████║██╗    ██╔═══██╗████╗  ██║██╔════╝██║    ██║██╔══██╗╚██╗ ██╔╝██╗    ╚══██╔══╝██╔═══██╗██║    ██║██╔════╝██╔══██╗
    // // ███████╗██╔████╔██║╚═╝    ██║   ██║██╔██╗ ██║█████╗  ██║ █╗ ██║███████║ ╚████╔╝ ╚═╝       ██║   ██║   ██║██║ █╗ ██║█████╗  ██████╔╝
    // // ╚════██║██║╚██╔╝██║██╗    ██║   ██║██║╚██╗██║██╔══╝  ██║███╗██║██╔══██║  ╚██╔╝  ██╗       ██║   ██║   ██║██║███╗██║██╔══╝  ██╔══██╗
    // // ███████║██║ ╚═╝ ██║╚═╝    ╚██████╔╝██║ ╚████║███████╗╚███╔███╔╝██║  ██║   ██║   ╚═╝       ██║   ╚██████╔╝╚███╔███╔╝███████╗██║  ██║
    // // ╚══════╝╚═╝     ╚═╝        ╚═════╝ ╚═╝  ╚═══╝╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝             ╚═╝    ╚═════╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝
    // //
    // const towerDoorTriggerTransform = {
    //   position: Vector3.create(-2, -1.25, -5.65),
    //   scale: Vector3.create(8, 3, 22),
    //   rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    // }

    // // Spawn the array above, with the trigger transform above
    // this.doorSingle001Tower = new DoorRegular(
    //   'door.single.001',
    //   Vector3.create(78.098, 12.018, 37.414),
    //   Vector3.create(1, 1, 1),
    //   Quaternion.fromEulerDegrees(0.0, 120.0, 0.0),
    //   true,
    //   true,
    //   towerDoorTriggerTransform.position,
    //   towerDoorTriggerTransform.scale,
    //   towerDoorTriggerTransform.rotation
    // )
    // this.doorSingle001Tower2 = new DoorRegular(
    //   'door.single.001',
    //   Vector3.create(77.04, 16.633, 33.587),
    //   Vector3.create(1, 1, 1),
    //   Quaternion.fromEulerDegrees(0.0, 90.0, 0.0),
    //   true,
    //   true,
    //   towerDoorTriggerTransform.position,
    //   towerDoorTriggerTransform.scale,
    //   towerDoorTriggerTransform.rotation
    // )
    // // ██╗      ██████╗     ██████╗ ██████╗  ██████╗ ██╗  ██╗███████╗███╗   ██╗
    // // ██║     ██╔════╝     ██╔══██╗██╔══██╗██╔═══██╗██║ ██╔╝██╔════╝████╗  ██║
    // // ██║     ██║  ███╗    ██████╔╝██████╔╝██║   ██║█████╔╝ █████╗  ██╔██╗ ██║
    // // ██║     ██║   ██║    ██╔══██╗██╔══██╗██║   ██║██╔═██╗ ██╔══╝  ██║╚██╗██║
    // // ███████╗╚██████╔╝    ██████╔╝██║  ██║╚██████╔╝██║  ██╗███████╗██║ ╚████║
    // // ╚══════╝ ╚═════╝     ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝
    // //

    // // Add the large, broken doors, to the start and end of the first floor flooded tunnel

    // // Spawn all the one-way large doors
    // this.hexTunnelDoorBroken = new DoorBroken(
    //   'hex-tunnel.door.broken',
    //   Vector3.create(9.203, 0.953, 19.672),
    //   Vector3.create(1.2, 1.0, 1.2),
    //   Quaternion.fromEulerDegrees(0.0, 270.0, 0.0),
    //   false
    // )
    // this.hexTunnelDoorBroken2 = new DoorBroken(
    //   'hex-tunnel.door.broken',
    //   Vector3.create(47.226, 3.953, 18.692),
    //   Vector3.create(1.2, 1.0, 1.2),
    //   Quaternion.fromEulerDegrees(0.0, 90.0, 0.0),
    //   false
    // )
    // // ██╗      ██████╗         ██████╗ ███╗   ██╗███████╗██╗    ██╗ █████╗ ██╗   ██╗
    // // ██║     ██╔════╝ ██╗    ██╔═══██╗████╗  ██║██╔════╝██║    ██║██╔══██╗╚██╗ ██╔╝
    // // ██║     ██║  ███╗╚═╝    ██║   ██║██╔██╗ ██║█████╗  ██║ █╗ ██║███████║ ╚████╔╝
    // // ██║     ██║   ██║██╗    ██║   ██║██║╚██╗██║██╔══╝  ██║███╗██║██╔══██║  ╚██╔╝
    // // ███████╗╚██████╔╝╚═╝    ╚██████╔╝██║ ╚████║███████╗╚███╔███╔╝██║  ██║   ██║
    // // ╚══════╝ ╚═════╝         ╚═════╝ ╚═╝  ╚═══╝╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝
    // //

    // const oneWayLargeDoors = [
    //   // 0 - hex-tunnel.door.015
    //   {
    //     position: Vector3.create(18.875, 21.0, 59.414),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
    //   },

    //   // 1 - hex-tunnel.door.017
    //   {
    //     position: Vector3.create(8.875, 21.0, 49.414),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0)
    //   },

    //   // 2 - hex-tunnel.door.014
    //   {
    //     position: Vector3.create(19.0, 30.828, 59.5),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0)
    //   },

    //   // 3 - hex-tunnel.door.007
    //   {
    //     position: Vector3.create(12.5, 24.828, 14.5),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0)
    //   },

    //   // 4 - hex-tunnel.door.021
    //   {
    //     position: Vector3.create(10.0, 24.828, 4.5),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 270.0, 0.0)
    //   }
    // ]
    // this.hexTunnelDoors = []
    // // Spawn all the one-way large doors
    // for (let i = 0; i < oneWayLargeDoors.length; i++) {
    //   const hexTunnelDoor = new DoorLarge(
    //     'hex-tunnel.door',
    //     oneWayLargeDoors[i].position,
    //     Vector3.create(1, 1, 1),
    //     oneWayLargeDoors[i].rotation,
    //     true,
    //     true
    //   )
    //   this.hexTunnelDoors.push(hexTunnelDoor.entity)
    // }

    // // Elevator.02 entrance
    // // This gets spawned separately as it has a custom trigger box scale
    // this.hexTunnelDoor2 = new DoorLarge(
    //   'hex-tunnel.door',
    //   Vector3.create(55.158, 30.828, 4.274),
    //   Vector3.create(1, 1, 1),
    //   Quaternion.fromEulerDegrees(0.0, 90.0, 0.0),
    //   true,
    //   true,
    //   Vector3.create(0, 0, 0),
    //   Vector3.create(7, 4, 16),
    //   Quaternion.fromEulerDegrees(0.0, 0.0, 0.0)
    // )
    // // ██╗      ██████╗        ████████╗██╗    ██╗ ██████╗ ██╗    ██╗ █████╗ ██╗   ██╗
    // // ██║     ██╔════╝ ██╗    ╚══██╔══╝██║    ██║██╔═══██╗██║    ██║██╔══██╗╚██╗ ██╔╝
    // // ██║     ██║  ███╗╚═╝       ██║   ██║ █╗ ██║██║   ██║██║ █╗ ██║███████║ ╚████╔╝
    // // ██║     ██║   ██║██╗       ██║   ██║███╗██║██║   ██║██║███╗██║██╔══██║  ╚██╔╝
    // // ███████╗╚██████╔╝╚═╝       ██║   ╚███╔███╔╝╚██████╔╝╚███╔███╔╝██║  ██║   ██║
    // // ╚══════╝ ╚═════╝           ╚═╝    ╚══╝╚══╝  ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝
    // //

    // const twoWayDoorsLarge = [
    //   // 0 - hex-tunnel.door
    //   {
    //     position: Vector3.create(14.0, 30.828, 54.5),
    //     rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    //   },

    //   // 1 - hex-tunnel.door.005
    //   {
    //     position: Vector3.create(4.0, 30.828, 54.5),
    //     rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    //   },

    //   // 2 - hex-tunnel.door.006
    //   {
    //     position: Vector3.create(14.0, 30.828, 44.5),
    //     rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    //   },

    //   // 3 - hex-tunnel.door.008
    //   {
    //     position: Vector3.create(14.0, 30.828, 34.5),
    //     rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    //   },

    //   // 4 - hex-tunnel.door.010
    //   {
    //     position: Vector3.create(14.0, 30.828, 19.5),
    //     rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    //   },

    //   // 5 - hex-tunnel.door.011
    //   {
    //     position: Vector3.create(4.0, 30.828, 19.5),
    //     rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    //   },

    //   // 6 - hex-tunnel.door.012
    //   {
    //     position: Vector3.create(14.0, 30.828, 9.5),
    //     rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    //   },

    //   // 7 - hex-tunnel.door.013
    //   {
    //     position: Vector3.create(4.0, 30.747, 9.5),
    //     rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    //   },

    //   // 8 - hex-tunnel.door.016
    //   {
    //     position: Vector3.create(4.0, 30.828, 29.5),
    //     rotation: Quaternion.create(0.0, 180.0, 0.0)
    //   },

    //   // 9 - hex-tunnel.door.020
    //   {
    //     position: Vector3.create(3.875, 21.0, 44.414),
    //     rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    //   },

    //   // 10 - hex-tunnel.door.001
    //   {
    //     position: Vector3.create(9.0, 30.828, 49.5),
    //     rotation: Quaternion.create(0.0, 270.0, 0.0)
    //   },

    //   // 11 - hex-tunnel.door.002
    //   {
    //     position: Vector3.create(9.0, 30.828, 39.5),
    //     rotation: Quaternion.create(0.0, 270.0, 0.0)
    //   },

    //   // 12 - hex-tunnel.door.003
    //   {
    //     position: Vector3.create(9.0, 30.828, 24.5),
    //     rotation: Quaternion.create(0.0, 270.0, 0.0)
    //   },

    //   // 13 - hex-tunnel.door.004
    //   {
    //     position: Vector3.create(9.0, 30.828, 14.5),
    //     rotation: Quaternion.create(0.0, 270.0, 0.0)
    //   }
    // ]
    // this.hexTunnelDoors3 = []
    // // Spawn all the two-way doors
    // for (let i = 0; i < twoWayDoorsLarge.length; i++) {
    //   const hexTunnelDoor3 = new DoorLarge(
    //     'hex-tunnel.door',
    //     twoWayDoorsLarge[i].position,
    //     Vector3.create(1, 1, 1),
    //     twoWayDoorsLarge[i].rotation
    //   )
    //   this.hexTunnelDoors3.push(hexTunnelDoor3.entity)
    // }
    // // ███████╗ █████╗ ███╗   ██╗███████╗
    // // ██╔════╝██╔══██╗████╗  ██║██╔════╝
    // // █████╗  ███████║██╔██╗ ██║███████╗
    // // ██╔══╝  ██╔══██║██║╚██╗██║╚════██║
    // // ██║     ██║  ██║██║ ╚████║███████║
    // // ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝
    // //

    // const fans = [
    //   // 0 - _hex-fan
    //   {
    //     position: Vector3.create(86.046, 21.299, 23.665),
    //     rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    //   },

    //   // 1 - _hex-fan.001
    //   {
    //     position: Vector3.create(86.046, 26.479, 23.665),
    //     rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    //   },

    //   // 2 - _hex-fan.002
    //   {
    //     position: Vector3.create(86.346, 26.331, 42.14),
    //     rotation: Quaternion.create(0.0, 180.0, 0.0)
    //   },

    //   // 3 - _hex-fan.003
    //   {
    //     position: Vector3.create(86.346, 21.312, 42.14),
    //     rotation: Quaternion.create(0.0, 180.0, 0.0)
    //   }
    // ]
    // this.fans = []
    // // Spawn all the fans
    // for (let i = 0; i < fans.length; i++) {
    //   const hexFan = new GLTFEntity(
    //     'hex-fan',
    //     fans[i].position,
    //     Vector3.create(1, 1, 1),
    //     fans[i].rotation
    //   )
    //   this.fans.push(hexFan.entity)
    // }
    // // ██████╗ ██╗   ██╗██████╗ ██████╗ ██╗     ███████╗███████╗
    // // ██╔══██╗██║   ██║██╔══██╗██╔══██╗██║     ██╔════╝██╔════╝
    // // ██████╔╝██║   ██║██████╔╝██████╔╝██║     █████╗  ███████╗
    // // ██╔══██╗██║   ██║██╔══██╗██╔══██╗██║     ██╔══╝  ╚════██║
    // // ██████╔╝╚██████╔╝██████╔╝██████╔╝███████╗███████╗███████║
    // // ╚═════╝  ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝
    // //

    // const bubbles = [
    //   // 0 - particles.bubbles.01
    //   {
    //     position: Vector3.create(62.438, 10.97, 46.455),
    //     scale: Vector3.create(1, 1, 1),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 118.66300000000001, 0.0)
    //   },
    //   // 1 - particles.bubbles.002
    //   {
    //     position: Vector3.create(54.386, 17.272, 31.323),
    //     scale: Vector3.create(1, 1, 1),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 88.66300000000001, 0.0)
    //   },
    //   // 2 - particles.bubbles.003
    //   {
    //     position: Vector3.create(45.119, 13.199, 41.148),
    //     scale: Vector3.create(1, 1, 1),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 88.66300000000001, 0.0)
    //   },
    //   // 3 - particles.bubbles.004
    //   {
    //     position: Vector3.create(43.118, 12.294, 45.137),
    //     scale: Vector3.create(1, 1, 1),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 88.66300000000001, 0.0)
    //   },
    //   // 4 - particles.bubbles.005
    //   {
    //     position: Vector3.create(39.34, 11.07, 53.537),
    //     scale: Vector3.create(1, 1, 1),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 41.742999999999995, 0.0)
    //   },
    //   // 5 - particles.bubbles.006
    //   {
    //     position: Vector3.create(57.084, 11.842, 54.747),
    //     scale: Vector3.create(1, 1, 1),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 99.18, 0.0)
    //   },
    //   // 6 - particles.bubbles.007
    //   {
    //     position: Vector3.create(44.538, 11.541, 34.318),
    //     scale: Vector3.create(1, 1, 1),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 99.18, 0.0)
    //   },
    //   // 7 - particles.bubbles.008
    //   {
    //     position: Vector3.create(26.087, 10.97, 55.514),
    //     scale: Vector3.create(1, 1, 1),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 126.88, 0.0)
    //   },
    //   // 8 - particles.bubbles.009
    //   {
    //     position: Vector3.create(49.245, 10.97, 53.124),
    //     scale: Vector3.create(1, 1, 1),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 116.72800000000001, 0.0)
    //   },
    //   // 9 - particles.bubbles.010
    //   {
    //     position: Vector3.create(47.456, 10.97, 49.039),
    //     scale: Vector3.create(1, 1, 1),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 296.728, 0.0)
    //   },
    //   // 10 - particles.bubbles.011
    //   {
    //     position: Vector3.create(42.781, 4.483, 45.403),
    //     scale: Vector3.create(1, 1, 1),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 226.855, 0.0)
    //   },
    //   // 11 - particles.bubbles.012
    //   {
    //     position: Vector3.create(31.913, 5.052, 56.995),
    //     scale: Vector3.create(1, 1, 1),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 93.47000000000003, 0.0)
    //   },
    //   // 12 - particles.bubbles.013
    //   {
    //     position: Vector3.create(22.414, 5.58, 49.679),
    //     scale: Vector3.create(1, 1, 1),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 36.38900000000001, 0.0)
    //   },
    //   // 13 - particles.bubbles.014
    //   {
    //     position: Vector3.create(45.205, 0.75, 29.185),
    //     scale: Vector3.create(1.431, 1.431, 1.431),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 96.95499999999998, 0.0)
    //   },
    //   // 14 - particles.bubbles.015
    //   {
    //     position: Vector3.create(42.682, 1.729, 36.274),
    //     scale: Vector3.create(1.431, 1.431, 1.431),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 223.99900000000002, 0.0)
    //   },
    //   // 15 - particles.bubbles.016
    //   {
    //     position: Vector3.create(40.372, 17.599, 31.262),
    //     scale: Vector3.create(1.431, 1.431, 1.431),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 261.971, 0.0)
    //   },
    //   // 16 - particles.bubbles.017
    //   {
    //     position: Vector3.create(32.073, 17.599, 38.574),
    //     scale: Vector3.create(1.431, 1.431, 1.431),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 196.81899999999996, 0.0)
    //   },
    //   // 17 - particles.bubbles.018
    //   {
    //     position: Vector3.create(62.013, 20.872, 21.655),
    //     scale: Vector3.create(1.431, 1.431, 1.431),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 196.81899999999996, 0.0)
    //   },
    //   // 18 - particles.bubbles.019
    //   {
    //     position: Vector3.create(49.336, 24.519, 21.655),
    //     scale: Vector3.create(1.431, 1.61, 1.431),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 356.329, 0.0)
    //   },
    //   // 19 - particles.bubbles.020
    //   {
    //     position: Vector3.create(34.891, 37.612, 20.521),
    //     scale: Vector3.create(1.431, 1.431, 1.431),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 196.81899999999996, 0.0)
    //   },
    //   // 20 - particles.bubbles.021
    //   {
    //     position: Vector3.create(34.891, 45.513, 20.521),
    //     scale: Vector3.create(1.431, 1.431, 1.431),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 16.819000000000017, 0.0)
    //   },
    //   // 21 - particles.bubbles.022
    //   {
    //     position: Vector3.create(72.298, 7.904, 14.423),
    //     scale: Vector3.create(1.431, 1.431, 1.431),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0)
    //   },
    //   // 22 - particles.bubbles.023
    //   {
    //     position: Vector3.create(12.288, 41.509, 8.722),
    //     scale: Vector3.create(0.373, 0.438, 0.373),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0)
    //   },
    //   // 23 - particles.bubbles.024
    //   {
    //     position: Vector3.create(43.676, 21.459, 54.772),
    //     scale: Vector3.create(0.373, 0.438, 0.373),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 90.0, 0.0)
    //   },
    //   // 24 - particles.bubbles.025
    //   {
    //     position: Vector3.create(46.059, 21.459, 54.876),
    //     scale: Vector3.create(0.425, 0.499, 0.425),
    //     rotation: Quaternion.fromEulerDegrees(0.0, 315.0, 0.0)
    //   }
    // ]
    // this.bubbles = []
    // for (let i = 0; i < bubbles.length; i++) {
    //   const randomSpeed = Math.floor(
    //     Math.random() *
    //       (CONFIG.BUBBLES_SPEED_MAX - CONFIG.BUBBLES_SPEED_MIN + 1) +
    //       CONFIG.BUBBLES_SPEED_MIN
    //   )
    //   const particlesBubblesO1 = new GLTFParticles(
    //     'particles.bubbles.01',
    //     bubbles[i].position,
    //     bubbles[i].scale,
    //     bubbles[i].rotation,
    //     'action.bubbles',
    //     true,
    //     0,
    //     randomSpeed
    //   )
    //   this.bubbles.push(particlesBubblesO1.entity)
    
  }

  onRaceStart(): void {
    // Start the race!
    // timer = new Timer()
    // timer.start()
  }

  onRaceEnd(): void {
    // Move the player back to the jail
    const respawnPosition = Vector3.create(33.5, 0, 57.5)
    void movePlayerTo({ newRelativePosition: respawnPosition })

    // timer.stop()
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
    // // log("DEBUG: RandomiseZappers")
    // // log("DEBUG: zapper_array_index_start: " + zapper_array_index_start)
    // // log("DEBUG: zapper_array_index_end: " + zapper_array_index_end)
    // // Loop through all zappers first and siable them
    // for (let i = 0; i < zappers.length; i++) {
    //   // log("DEBUG: disabling zapper index " + i)
    //   // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    //   const zapper = zappers[i] as Zapper
    //   zapper.disable()
    // }
    // // Create an array of the zapper indexes so we can randomly choose and remove the indexes
    // const zapperIndexes: number[] = []
    // for (let i = 0; i < zappers.length + 1; i++) {
    //   zapperIndexes.push(i)
    // }
    // // Next, choose one of the zapper_indexes at random and enable that zapper
    // // then remove the index from the array of indexes so we don't enable it multiple times
    // for (let i = 0; i < ZAPPER_QUANTITY; i++) {
    //   // eslint-disable-next-line @typescript-eslint/no-use-before-define
    //   if (zapperIndexes.length === 0) {
    //     break // No more zappers available
    //   }
    //   const randomIndex = Math.floor(Math.random() * zapperIndexes.length)
    //   // log("DEBUG: Enabling Zapper index " + randomIndex)
    //   const zapperIndex = zapperIndexes.splice(randomIndex, 1)[0]
    //   // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    //   const zapper = zappers[zapperIndex] as Zapper
    //   // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    //   if (zapper) {
    //     zapper.enable()
    //   }
    // }
    // console.log('Zappers have been randomised')
    // // log("DEBUG: zapper_index have remaining count: " + zapper_indexes.length)
  }

  spawnSingleEntity(entityName: string): void {}

  removeSingleEntity(entityName: string): void {}

  removeAllEntities(): void {}

  getId(): RealmType {
    return 'soloSprint'
  }

  deadPosition(): Vector3 {
    return { x: -38.34, y: 10.43, z: -39.75 }
  }
}
