// ███████╗███████╗████████╗████████╗██╗███╗   ██╗ ██████╗ ███████╗
// ██╔════╝██╔════╝╚══██╔══╝╚══██╔══╝██║████╗  ██║██╔════╝ ██╔════╝
// ███████╗█████╗     ██║      ██║   ██║██╔██╗ ██║██║  ███╗███████╗
// ╚════██║██╔══╝     ██║      ██║   ██║██║╚██╗██║██║   ██║╚════██║
// ███████║███████╗   ██║      ██║   ██║██║ ╚████║╚██████╔╝███████║
// ╚══════╝╚══════╝   ╚═╝      ╚═╝   ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝
//

import { Vector3, Quaternion } from "@dcl/sdk/math";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Settings {
  // Default Transform for non-flipped objects
  static SCENE_TRANSFORM = {
    position: Vector3.create(0, 0, 0),
    scale: Vector3.create(1, 1, 1),
    rotation: Quaternion.fromEulerDegrees(0, 0, 0)
  };

  // 180-rotation Transform for Blender-exported gltfs
  static SCENE_TRANSFORM_180 = {
    position: Vector3.create(0, 0, 0),
    scale: Vector3.create(1, 1, 1),
    rotation: Quaternion.fromEulerDegrees(0, 180, 0)
  };

  // Should trigger zones be visible en-masse?
  static DEBUG_SHOW_TRIGGERS: boolean = false;

  // Should the debug teleporters be active?
  static DEBUG_SHOW_TELEPORTERS: boolean = false;

  // Should the spawn room doors have triggers in front of them?
  static DEBUG_SPAWN_TRIGGERS: boolean = false;
}
