import { Color4 } from '@dcl/sdk/math'
import { type UIController } from './ui.controller'

export class RenderOutOfFuel {
  uiController: UIController
  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  show(): void {
    this.uiController.displayAnnouncement(
      'You need more FUEL!\n\nHit the Recharge to dance for more.',
      Color4.Yellow(),
      2000
    )
  }
}
