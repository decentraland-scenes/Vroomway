import { Vector3 } from '@dcl/sdk/math'

export class SceneVector3Type<T extends number | number[]> {
  x: T
  y: T
  z: T

  // _cachedFixedPosition:Vector3

  constructor(x: T, y: T, z: T) {
    this.x = x
    this.y = y
    this.z = z
  }

  toCenterVector3(): Vector3 {
    const x: number = this.findCenter(this.x)
    const y: number = this.findCenter(this.y)
    const z: number = this.findCenter(this.z)

    return Vector3.create(x, y, z)
  }

  findCenter(val: T): number {
    return Array.isArray(val) ? (val[0] + val[1]) / 2 : val
  }

  copyFrom(src: Vector3): void {
    if (Array.isArray(this.x)) {
      this.x = [src.x] as T
    } else {
      this.x = src.x as T
    }
  }
}

export class ScenePOI {
  name?: string
  type?: string
  default?: boolean
  position?: SceneVector3Type<number | number[]>
  cameraLookAt?: Vector3

  constructor(args: ScenePOIType) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/prefer-optional-chain
    if (args && args.position) this.position = args.position
    if (args?.default !== undefined) this.default = args.default
    if (args?.type !== undefined) this.type = args.type
    if (args?.name !== undefined) this.name = args.name
    if (args?.cameraLookAt !== undefined) this.cameraLookAt = args.cameraLookAt
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  toTransformConstructorArg() {
    return { position: this.position?.toCenterVector3() }
  }
}

export class SpawnPoint extends ScenePOI {}

export type POISelectorType = {
  name?: string
  type?: string
  default?: boolean
}

export type ScenePOIType = {
  name?: string
  type?: string
  default?: boolean
  position: SceneVector3Type<number | number[]>
  cameraLookAt?: Vector3
}
