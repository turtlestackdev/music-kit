import type { DataByte, MultiByteValue } from './message.types'

export function calculateMultiByteValue(msb: DataByte, lsb: DataByte) {
  return msb * 128 + lsb
}

export function getMsbAndLsb(value: MultiByteValue) {
  const msb = Math.floor(value / 128)
  const lsb = value % 128

  return [msb, lsb]
}
