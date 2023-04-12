import type { Pitch, PitchClass } from './notes'
import { enharmonic, pitchShift, stepShift } from './notes'

export interface Perfect {
  quality: 'perfect'
  number: 1 | 4 | 5 | 8
}

export interface Minor {
  quality: 'minor'
  number: 2 | 3 | 6 | 7
}

export interface Major {
  quality: 'major'
  number: 2 | 3 | 6 | 7
}

export interface Diminished {
  quality: 'diminished'
  number: 2 | 3 | 4 | 5 | 6 | 7 | 8
}

export interface Augmented {
  quality: 'augmented'
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7
}

export type Interval = Perfect | Minor | Major | Diminished | Augmented
const intervalSemitones = [0, 2, 4, 5, 7, 9, 11, 12]

export const P1: Perfect = {
  quality: 'perfect',
  number: 1,
} as const

export const P4: Perfect = {
  quality: 'perfect',
  number: 4,
} as const

export const P5: Perfect = {
  quality: 'perfect',
  number: 5,
} as const

export const P8: Perfect = {
  quality: 'perfect',
  number: 8,
} as const

export const m2: Minor = {
  quality: 'minor',
  number: 2,
} as const

export const m3: Minor = {
  quality: 'minor',
  number: 3,
} as const

export const m6: Minor = {
  quality: 'minor',
  number: 6,
} as const

export const m7: Minor = {
  quality: 'minor',
  number: 7,
} as const

export const M2: Major = {
  quality: 'major',
  number: 2,
} as const

export const M3: Major = {
  quality: 'major',
  number: 3,
} as const

export const M6: Major = {
  quality: 'major',
  number: 6,
} as const

export const M7: Major = {
  quality: 'major',
  number: 7,
} as const

export const d2: Diminished = {
  quality: 'diminished',
  number: 2,
} as const

export const d3: Diminished = {
  quality: 'diminished',
  number: 3,
} as const

export const d4: Diminished = {
  quality: 'diminished',
  number: 4,
} as const

export const d5: Diminished = {
  quality: 'diminished',
  number: 5,
} as const

export const d6: Diminished = {
  quality: 'diminished',
  number: 6,
} as const

export const d7: Diminished = {
  quality: 'diminished',
  number: 7,
} as const

export const d8: Diminished = {
  quality: 'diminished',
  number: 8,
} as const

export const A1: Augmented = {
  quality: 'augmented',
  number: 1,
} as const

export const A2: Augmented = {
  quality: 'augmented',
  number: 2,
} as const

export const A3: Augmented = {
  quality: 'augmented',
  number: 3,
} as const

export const A4: Augmented = {
  quality: 'augmented',
  number: 4,
} as const

export const A5: Augmented = {
  quality: 'augmented',
  number: 5,
} as const

export const A6: Augmented = {
  quality: 'augmented',
  number: 6,
} as const

export const A7: Augmented = {
  quality: 'augmented',
  number: 7,
} as const

export function transpose(pitch: PitchClass, interval: Interval): PitchClass
export function transpose(
  pitch: PitchClass,
  interval: Interval,
  direction: 'up' | 'down'
): PitchClass
export function transpose(pitch: Pitch, interval: Interval): Pitch
export function transpose(
  pitch: Pitch,
  interval: Interval,
  direction: 'up' | 'down'
): Pitch
export function transpose(
  pitch: PitchClass | Pitch,
  interval: Interval,
  direction: 'up' | 'down' = 'up'
) {
  // give a baseline octave of 4 for calculations if not provided.
  const original: Pitch = { octave: 4, ...pitch }
  const stepDiff = interval.number - 1
  const alter =
    intervalSemitones[interval.number - 1] +
    (interval.quality in ['minor', 'diminished']
      ? -1
      : interval.quality === 'augmented'
      ? 1
      : 0)

  const multiplier = direction === 'down' ? -1 : 1

  const step = stepShift(original.step, stepDiff * multiplier)
  const target = enharmonic(pitchShift(pitch, alter * multiplier), step)

  if ('octave' in pitch) {
    // todo calculate octave change
    return { ...target, octave: pitch.octave }
  }

  return target
}
