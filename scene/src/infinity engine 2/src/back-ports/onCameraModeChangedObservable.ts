import { CameraMode, CameraType, engine } from '@dcl/sdk/ecs'
import { Observable } from '@dcl/sdk/internal/Observable'

let initAlready = false

// https://sentry.io/answers/remove-specific-item-from-array/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function removeValue(value: any, index: any, arr: any): boolean {
  // If the value at the current array index matches the specified value (2)
  if (value === 2) {
    // Removes the value from the original array
    arr.splice(index, 1)
    return true
  }
  return false
}

let lastKnownCameraMode: CameraType
export const onCameraModeChangedObservable = new Observable<CameraType>(
  (observer) => {
    onCameraModeChangedObservable.notifyObserver(observer, lastKnownCameraMode)
  }
)

/*
export function onOnCameraModeChangedObservableAdd(callback: (mode: CameraType) => void) {
  //observablesCB.push(callback)
  //return () => { observablesCB.filter(removeValue) }
  return onCameraModeChangedObservable.add(callback)
} */

function cameraModeCheckSystem(dt: number): void {
  const cameraEntity = CameraMode.get(engine.CameraEntity)

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!cameraEntity) return

  if (cameraEntity.mode !== lastKnownCameraMode) {
    lastKnownCameraMode = cameraEntity.mode
    if (cameraEntity.mode === CameraType.CT_THIRD_PERSON) {
      // console.log("The player is using the 3rd person camera")
      onCameraModeChangedObservable.notifyObservers(cameraEntity.mode)
    } else {
      // console.log("The player is using the 1st person camera")
      onCameraModeChangedObservable.notifyObservers(cameraEntity.mode)
    }
  }
}

/* engine.addSystem(function cameraModeCheck() {
  
}) */
export function initOnCameraModeChangedObservable(): void {
  if (initAlready) return
  engine.addSystem(cameraModeCheckSystem)
  initAlready = true
}