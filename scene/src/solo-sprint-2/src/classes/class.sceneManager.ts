// ███████╗ ██████╗███████╗███╗   ██╗███████╗    ███╗   ███╗ █████╗ ███╗   ██╗ █████╗  ██████╗ ███████╗██████╗
// ██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝    ████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝ ██╔════╝██╔══██╗
// ███████╗██║     █████╗  ██╔██╗ ██║█████╗      ██╔████╔██║███████║██╔██╗ ██║███████║██║  ███╗█████╗  ██████╔╝
// ╚════██║██║     ██╔══╝  ██║╚██╗██║██╔══╝      ██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║██║   ██║██╔══╝  ██╔══██╗
// ███████║╚██████╗███████╗██║ ╚████║███████╗    ██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║╚██████╔╝███████╗██║  ██║
// ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝╚══════╝    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝
//

import { type Scene } from './class.scene'

export class SceneManager {
  scenes: Scene[] = []

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    // Nothing to be done here, init is manually called after all scenes have been added to the scene manager
  }

  // Add a scene to the manager - does not enable it
  addScene(scene: Scene): void {
    scene.sceneManager = this
    this.scenes.push(scene)
  }

  // Remove a scene from the manager
  destroyScene(name: string): void {
    for (let i = 0; i < this.scenes.length; i++) {
      const scene = this.scenes[i]

      if (scene.name === name) {
        console.log('class.sceneManager: enableScene: ' + name)

        scene.destroy()
      }

      this.scenes.splice(i, 1)
    }
  }

  // Init the manager - go through all added scenes and init them
  init(): void {
    console.log('class.sceneManager: initialising SceneManager')

    for (let i = 0; i < this.scenes.length; i++) {
      const scene = this.scenes[i]

      scene.init()
    }
  }

  enableAllScenes(): void {
    for (let i = 0; i < this.scenes.length; i++) {
      const scene = this.scenes[i]
      scene.enable()

      console.log('class.sceneManager: enableAllScenes: ' + scene.name)
    }
  }

  // Enables a scene without disabling others
  enableScene(name: string): void {
    let flag: boolean = false
    for (let i = 0; i < this.scenes.length; i++) {
      const scene = this.scenes[i]

      if (scene.name === name) {
        console.log('class.sceneManager: enableScene: ' + name)

        flag = true
        scene.enable()
        break
      }
    }
    if (!flag) {
      console.log(
        'class.sceneManager: enableScene: ' + name + ': scene not found'
      )
    }
  }

  // Enables a scene without disabling others
  resetScene(name: string): void {
    let flag: boolean = false
    for (let i = 0; i < this.scenes.length; i++) {
      const scene = this.scenes[i]

      if (scene.name === name) {
        console.log('class.sceneManager: resetScene: ' + name)

        flag = true
        scene.reset()
        break
      }
    }
    if (!flag) {
      console.log(
        'class.sceneManager: resetScene: ' + name + ': scene not found'
      )
    }
  }

  // Enables a scene without disabling others
  disableScene(name: string): void {
    let flag: boolean = false

    for (let i = 0; i < this.scenes.length; i++) {
      const scene = this.scenes[i]

      if (scene.name === name) {
        console.log('class.sceneManager: disableScene: ' + name)

        flag = true
        scene.disable()
        break
      }
    }
    if (!flag) {
      console.log(
        'class.sceneManager: disableScene: ' + name + ': scene not found'
      )
    }
  }
}
