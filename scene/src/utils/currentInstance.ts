// import { VehicleAttachmentManager } from "src/vehicle/vehicle-attachment-manager";

// TODO merge with src/types/types.ts: export type RaceType = "circuit" | "derby" | "lobby" | "dragrace" | "solosprint";
export type InstanceId =
  | 'main'
  | 'recharge'
  | 'soloSprint'
  | 'fuegoCircuit'
  | 'demoDerby'
  | 'dragRace'
  | 'scrapyard'
  | 'grandPrix'
// TODO: swap over to enum instead of type (helps solve mistypes/easier to refactor)
export enum INSTANCE_TYPES {
  MAIN = 'main',
  RECHARGE = 'recharge',
  SOLO_SPRINT = 'soloSprint',
  FUEGO_CIRCUIT = 'fuegoCircuit',
  DEMO_DERBY = 'demoDerby',
  DRAG_RACE = 'dragRace',
  SCRAPYARD = 'scrapyard',
  GRAND_PRIX = 'grandPrix'
}

class Instance {
  private instance: InstanceId
  public get Instance(): InstanceId {
    return this.instance
  }

  public set Instance(value: InstanceId) {
    this.instance = value
    // update vehicle attachments
    // VehicleAttachmentManager.Instance.UpdateAttachmentSceneOffsets()
  }

  constructor() {
    this.instance = 'main'
  }

  setInstance(name: InstanceId): void {
    this.Instance = name
  }

  getInstance(): InstanceId {
    return this.Instance
  }
}

export const instance = new Instance()
