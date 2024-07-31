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
import { Animator } from '@dcl/sdk/ecs'
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
