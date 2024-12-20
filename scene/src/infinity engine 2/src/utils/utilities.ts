import { type TransformTypeWithOptionals } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

export function distance(vec1: Vector3, vec2: Vector3): number {
  const a = vec1.x - vec2.x
  const b = vec1.y - vec2.y
  const c = vec1.z - vec2.z
  return Math.sqrt(a * a + b * b + c * c)
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function cloneTransformTypeWithOptionals(
  source: TransformTypeWithOptionals
) {
  const tf: TransformTypeWithOptionals = {}
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (source.position) tf.position = Vector3.clone(source.position)
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (source.scale) tf.scale = Vector3.clone(source.scale)
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (source.rotation) tf.position = Vector3.clone(source.rotation)

  return tf
}
