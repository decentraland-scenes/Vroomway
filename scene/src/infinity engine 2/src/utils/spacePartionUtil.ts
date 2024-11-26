import { REGISTRY } from '../registry'

export function destroySpacePartition(): void {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (REGISTRY.spacePartioner) {
    REGISTRY.spacePartioner.reset()
    REGISTRY.spacePartioner = undefined as any
  }
}
