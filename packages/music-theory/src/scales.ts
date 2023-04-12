import {
  type PitchClass,
  stepList,
  enharmonic,
  stepShift,
  type Step,
} from './notes'
import { P5, transpose } from './intervals'

const scaleIntervals = {
  major: [2, 2, 1, 2, 2, 2],
  ionian: [2, 2, 1, 2, 2, 2],
  minor: [2, 1, 2, 2, 1, 2],
  aeolian: [2, 1, 2, 2, 1, 2],
  dorian: [2, 1, 2, 2, 2, 1],
  phrygian: [1, 2, 2, 2, 1, 2],
  lydian: [2, 2, 2, 1, 2, 2],
  mixolydian: [2, 2, 1, 2, 2, 1],
  locrian: [1, 2, 2, 1, 2, 2],
}

export type KeyMode = keyof typeof scaleIntervals

export interface Key {
  tonic: PitchClass
  mode: KeyMode
}
export interface Scale {
  key: Key
  notes: PitchClass[]
}

export function getScale(tonic: PitchClass, mode: KeyMode = 'major'): Scale {
  const steps = stepList(tonic)
  const intervals = scaleIntervals[mode]
  const scale: PitchClass[] = [tonic]

  let next = 0
  for (let i = 0; i < intervals.length; i++) {
    next = next + intervals[i]
    const note = enharmonic(steps[next], stepShift(scale[i].step))
    scale.push(note)
  }

  return {
    notes: scale,
    key: { tonic: tonic, mode: mode },
  }
}

export function getKey(fifths: number, mode: KeyMode = 'major') {
  let base: Step
  switch (mode) {
    case 'major':
    case 'ionian':
      base = 'C'
      break
    case 'minor':
    case 'aeolian':
      base = 'A'
      break
    case 'dorian':
      base = 'D'
      break
    case 'phrygian':
      base = 'E'
      break
    case 'lydian':
      base = 'F'
      break
    case 'mixolydian':
      base = 'G'
      break
    case 'locrian':
      base = 'B'
      break
  }

  let tonic = { step: base }
  for (let i = 0; i < Math.abs(fifths); i++) {
    tonic = transpose(tonic, P5, fifths < 0 ? 'down' : 'up')
  }

  const key: Key = { tonic, mode }
  return key
}
