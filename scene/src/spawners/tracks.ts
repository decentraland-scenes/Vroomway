// ████████╗██████╗  █████╗  ██████╗██╗  ██╗███████╗
// ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝
//    ██║   ██████╔╝███████║██║     █████╔╝ ███████╗
//    ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ╚════██║
//    ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗███████║
//    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝
//

import { engine, type Entity, GltfContainer, Transform } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { instance } from '../utils/currentInstance'
import * as utils from '@dcl-sdk/utils'
import { Settings } from '../_settings'

class Track {
  public enabled: boolean = false
  public entity: Entity
  public gltf: string
  public name: string
  public position: Vector3
  public scale: Vector3
  public rotation: Quaternion

  constructor(
    name: string,
    gltf: string,
    position: Vector3,
    scale: Vector3,
    rotation: Quaternion
  ) {
    this.entity = engine.addEntity()
    this.gltf = gltf
    this.name = name
    this.position = position
    this.scale = scale
    this.rotation = rotation
  }

  // Function to spawn a track and parent it to another entity
  spawn(parent: Entity): void {
    GltfContainer.create(this.entity, { src: this.gltf })
    Transform.create(this.entity, {
      position: this.position,
      scale: this.scale,
      rotation: this.rotation
    })
    Transform.createOrReplace(this.entity, { parent })
    this.enabled = true
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getFloor1Track = () => {
  return instance.getInstance() !== 'soloSprint'
    ? new Track(
        'floor-01',
        'models/floor-01.gltf',
        Vector3.create(0, -50, 0),
        Vector3.create(0.5, 0.5, 0.5),
        Quaternion.create(0, 0, 0)
      )
    : new Track(
        'floor-01',
        'models/floor-01.gltf',
        Vector3.create(0, 0, 0),
        Vector3.create(1, 1, 1),
        Quaternion.create(0, 0, 0)
      )
}

export class Spawn_Tracks {
  // Array of tracks to spawn in
  public tracks: Track[] = [
    new Track(
      'spawn',
      'models/spawn-room.gltf',
      Vector3.create(0, 0, 0),
      Vector3.create(1, 1, 1),
      Quaternion.create(0, 0, 0)
    ),
    new Track(
      'spawn-start-btn',
      'models/ss-start-button.glb',
      Vector3.create(0, 0, 0),
      Vector3.create(1, 1, 1),
      Quaternion.create(0, 0, 0)
    ),
    getFloor1Track(),
    new Track(
      'outer',
      'models/outer-box.gltf',
      Vector3.create(0, 0, 0),
      Vector3.create(1, 1, 1),
      Quaternion.create(0, 0, 0)
    ),
    new Track(
      'hammers',
      'models/hammers.gltf',
      Vector3.create(0, 0, 0),
      Vector3.create(1, 1, 1),
      Quaternion.create(0, 0, 0)
    ),
    new Track(
      'floor-02',
      'models/floor-02.gltf',
      Vector3.create(0, 0, 0),
      Vector3.create(1, 1, 1),
      Quaternion.create(0, 0, 0)
    ),
    new Track(
      'floor-03',
      'models/floor-03.gltf',
      Vector3.create(0, 0, 0),
      Vector3.create(1, 1, 1),
      Quaternion.create(0, 0, 0)
    ),
    new Track(
      'floor-04',
      'models/floor-04.gltf',
      Vector3.create(0, 0, 0),
      Vector3.create(1, 1, 1),
      Quaternion.create(0, 0, 0)
    ),
    new Track(
      'finish',
      'models/finish-zone.gltf',
      Vector3.create(0, 0, 0),
      Vector3.create(1, 1, 1),
      Quaternion.create(0, 0, 0)
    ),
    new Track(
      'drop-strobe',
      'models/drop-tube-strobe-lights.gltf',
      Vector3.create(0, 0, 0),
      Vector3.create(1, 1, 1),
      Quaternion.create(0, 0, 0)
    )
  ]

  // Simple toggle to easily disable track spawning
  private readonly enabled = true

  // Scene parent
  private readonly _scene: Entity = engine.addEntity()

  // Constructor
  constructor() {
    // Add the scene parent
    const position = Settings.SCENE_TRANSFORM_180.position
    const scale = Settings.SCENE_TRANSFORM_180.scale
    const rotation = Settings.SCENE_TRANSFORM_180.rotation

    Transform.create(this._scene, {
      position,
      scale,
      rotation
    })
  }

  // Spawn all tracks in the list
  public spawnAllTracks(): void {
    for (let i = 0; i < this.tracks.length; i++) {
      this.spawnTrack(i)
    }
  }

  public spawnFloor1(): void {
    this.spawnTrack(2)
  }

  // Spawn all tracks in the list with an interval
  public spawnAllTracksWithInterval(interval: number): void {
    for (let i = 0; i < this.tracks.length; i++) {
      if (i < 3) {
        this.spawnTrack(i)
      } else {
        utils.timers.setTimeout(() => {
          this.spawnTrack(i)
        }, i * interval)
      }
    }
    // TODO: barrel handler will need a minor refactor to change the targeted spawn points
    //  to a different set positioned for the solo sprint
  }

  // Spawn a specific track
  public spawnTrack(index: number = 0): void {
    const isSoloSprintInstance = instance.getInstance() !== 'soloSprint'
    if (this.enabled) {
      if (!this.tracks[index].enabled || !isSoloSprintInstance) {
        this.tracks[index].spawn(this._scene)
      }
    }
  }
}
