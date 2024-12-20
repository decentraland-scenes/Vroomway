import {
  InputAction,
  PointerEventType,
  Transform,
  engine,
  inputSystem
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { Observable } from '@dcl/sdk/internal/Observable'

let initAlready = false

let lastTriggered = Date.now()
let playerState: 'idle' | 'active' = 'active'
let lastRotation: Quaternion = Quaternion.create(0, 0, 0, 0)

// right now idle of 5 min will mark u idle
// TODO allow diff subscribers to set diff idle values?
const IDLE_TIME = 1000 * 60 * 5 // 60000 //5 minute goes idle

export const onIdleStateChangedObservable = new Observable<boolean>(
  (observer) => {
    onIdleStateChangedObservable.notifyObserver(
      observer,
      playerState === 'idle'
    )
  }
)

/*
export function onIdleStateChangedObservableAdd(callback: (isIdle: boolean) => void) {
  return onIdleStateChangedObservable.add(callback)
} */
/* function notifyIdleStateChanged(isIdle: boolean) {
  //player went active
  for (let cb of observablesCB) {
    cb(isIdle)
  }
} */

const inputList = [
  InputAction.IA_ANY,
  InputAction.IA_FORWARD,
  InputAction.IA_BACKWARD,
  InputAction.IA_JUMP,
  InputAction.IA_LEFT,
  InputAction.IA_RIGHT,
  InputAction.IA_SECONDARY,
  InputAction.IA_PRIMARY,
  InputAction.IA_POINTER,
  InputAction.IA_WALK
]

function globalButtonSystem(dt: number): void {
  // fix me   IA_ANY not working

  let triggered = false

  // eslint-disable-next-line no-constant-condition
  if (true) {
    // if (CONFIG.USE_ANY_INPUT) {
    triggered = inputSystem.isTriggered(
      InputAction.IA_ANY,
      PointerEventType.PET_DOWN
    )
  } else {
    for (let index = 0; index < inputList.length; index++) {
      const input = inputList[index]
      if (inputSystem.isTriggered(input, PointerEventType.PET_DOWN))
        triggered = true
    }
  }

  if (!triggered) {
    const hasRotated = checkRotationInput()
    triggered = hasRotated
  }

  const now = Date.now()
  const delta = now - lastTriggered
  if (triggered) {
    lastTriggered = now
    if (playerState === 'idle') {
      // went active
      playerState = 'active'
      onIdleStateChangedObservable.notifyObservers(false)
    }
  } else {
    if (playerState === 'active' && delta >= IDLE_TIME) {
      // player went idle
      playerState = 'idle'
      // went idle
      onIdleStateChangedObservable.notifyObservers(true)
    }
  }
  // console.log('onIdleStateChangedObservableAdd',"IA_ANY.PET_DOWN.triggered",triggered,"lastTriggered",lastTriggered,"delta",delta,"IDLE_TIME",IDLE_TIME)
}
export function initIdleStateChangedObservable(): void {
  if (initAlready) return
  engine.addSystem(globalButtonSystem)
  initAlready = true
}

const EPSILON_TOLERANCE = 0.0001
function checkRotationInput(): boolean {
  // TODO capture once and read from same place. do for position too???
  const transform = Transform.getOrNull(engine.CameraEntity)
  if (transform == null) return false

  const currentRotation = transform.rotation
  const hasRotated = !equalsWithEpsilon(
    lastRotation,
    currentRotation,
    EPSILON_TOLERANCE
  )
  lastRotation = currentRotation
  return hasRotated
}

function equalsWithEpsilon(
  q1: Quaternion,
  q2: Quaternion,
  epsilon: number
): boolean {
  // will do x,y,z for us
  if (!Vector3.equalsWithEpsilon(q1, q2, epsilon)) return false
  if (Math.abs(q1.w - q2.w) > epsilon) return false
  return true
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isEqual(q1: Quaternion, q2: Quaternion): boolean {
  if (q1.x !== q2.x) return false
  if (q1.y !== q2.y) return false
  if (q1.z !== q2.z) return false
  if (q1.w !== q2.w) return false
  return true
}
