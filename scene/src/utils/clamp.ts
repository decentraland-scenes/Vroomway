/**
 * Clamps a value so that it doesn't exceed a minimum or a maximum value.
 *
 * @param value - The input number to be clamped.
 * @param min - The minimum output value.
 * @param max - The maximum output value.
 * @returns The resulting value clamped between the min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}
