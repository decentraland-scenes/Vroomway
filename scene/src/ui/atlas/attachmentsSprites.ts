import { type Sprite } from '../utils/utils'
import { VEHICLE_ATTACHMENT } from '../../vehicle/vehicle-attachment-data'

const atlasSrc: string = 'assets/images/uiAtlas/vehicleModsAtlas.png'
const atlasSize: { x: number; y: number } = { x: 2048, y: 2048 }

export const attachmentsSprites: Record<VEHICLE_ATTACHMENT, Sprite> = {
  [VEHICLE_ATTACHMENT.TRAIL_RED]: {
    atlasSrc,
    atlasSize,
    w: 118,
    h: 118,
    y: 0,
    x: 0
  },

  [VEHICLE_ATTACHMENT.TRAIL_GREEN]: {
    atlasSrc,
    atlasSize,
    w: 118,
    h: 118,
    y: 0,
    x: 0
  },

  [VEHICLE_ATTACHMENT.TRAIL_BLUE]: {
    atlasSrc,
    atlasSize,
    w: 118,
    h: 118,
    y: 0,
    x: 0
  },

  // ###   HORN

  [VEHICLE_ATTACHMENT.HORN_00]: {
    atlasSrc,
    atlasSize,
    w: 118,
    h: 118,
    y: 118,
    x: 0
  },

  [VEHICLE_ATTACHMENT.HORN_01]: {
    atlasSrc,
    atlasSize,
    w: 118,
    h: 118,
    y: 118,
    x: 0
  },

  [VEHICLE_ATTACHMENT.HORN_02]: {
    atlasSrc,
    atlasSize,
    w: 118,
    h: 118,
    y: 118,
    x: 0
  },

  // ###   UNDERGLOW

  [VEHICLE_ATTACHMENT.UNDERGLOW_GREEN]: {
    atlasSrc,
    atlasSize,
    w: 118,
    h: 118,
    y: 236,
    x: 0
  },

  [VEHICLE_ATTACHMENT.UNDERGLOW_RED]: {
    atlasSrc,
    atlasSize,
    w: 118,
    h: 118,
    y: 236,
    x: 0
  },

  [VEHICLE_ATTACHMENT.UNDERGLOW_BLUE]: {
    atlasSrc,
    atlasSize,
    w: 118,
    h: 118,
    y: 236,
    x: 0
  },

  [VEHICLE_ATTACHMENT.THRUSTER_RED]: {
    atlasSrc,
    atlasSize,
    w: 118,
    h: 118,
    y: 0,
    x: 0
  },

  [VEHICLE_ATTACHMENT.THRUSTER_GREEN]: {
    atlasSrc,
    atlasSize,
    w: 118,
    h: 118,
    y: 0,
    x: 0
  },

  [VEHICLE_ATTACHMENT.THRUSTER_BLUE]: {
    atlasSrc,
    atlasSize,
    w: 118,
    h: 118,
    y: 0,
    x: 0
  },

  [VEHICLE_ATTACHMENT.AURA_RED]: {
    atlasSrc,
    atlasSize,
    w: 118,
    h: 118,
    y: 0,
    x: 0
  },

  [VEHICLE_ATTACHMENT.AURA_GREEN]: {
    atlasSrc,
    atlasSize,
    w: 118,
    h: 118,
    y: 0,
    x: 0
  },

  [VEHICLE_ATTACHMENT.AURA_BLUE]: {
    atlasSrc,
    atlasSize,
    w: 118,
    h: 118,
    y: 0,
    x: 0
  },
  [VEHICLE_ATTACHMENT.BODYKIT_00]: {
    atlasSrc,
    atlasSize,
    w: 118,
    h: 118,
    y: 0,
    x: 0
  },

  [VEHICLE_ATTACHMENT.BODYKIT_01]: {
    atlasSrc,
    atlasSize,
    w: 118,
    h: 118,
    y: 0,
    x: 0
  },

  [VEHICLE_ATTACHMENT.BODYKIT_02]: {
    atlasSrc,
    atlasSize,
    w: 118,
    h: 118,
    y: 0,
    x: 0
  }
}
