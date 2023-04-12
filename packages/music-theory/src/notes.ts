const steps = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const
export type Step = (typeof steps)[number]
// used for various calculations
const stepValues = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
} as const

// A quick helper object to reference common semitone values by key.
export const accidentals = {
  doubleFlat: -2,
  flat: -1,
  natural: 0,
  sharp: 1,
  doubleSharp: 2,
} as const

// Alter values of -2 and 2 can be used for double-flat and double-sharp.
// Decimal values can be used for microtones (e.g., 0.5 for a quarter-tone sharp)
export interface PitchClass {
  step: Step
  alter?: number
}

export const pitchClasses: readonly PitchClass[] = [
  { step: 'C' },
  { step: 'C', alter: accidentals.sharp },
  { step: 'D' },
  { step: 'D', alter: accidentals.sharp },
  { step: 'E' },
  { step: 'F' },
  { step: 'F', alter: accidentals.sharp },
  { step: 'G' },
  { step: 'G', alter: accidentals.sharp },
  { step: 'A' },
  { step: 'A', alter: accidentals.sharp },
  { step: 'B' },
] as const

export type Pitch = PitchClass & {
  octave: number
}

export function pitchClassIndex(note: PitchClass) {
  const value = stepValue(note)
  return pitchClasses.findIndex(function (baseNote) {
    return stepValue(baseNote) === value
  })
}

export function pitchClassDistance(note1: PitchClass, note2: PitchClass) {
  const index1 = pitchClassIndex(note1)
  const index2 = pitchClassIndex(note2)
  const up = index2 < index1 ? 11 - index1 + index2 + 1 : index2 - index1
  const down =
    (index2 > index1 ? 11 - index2 + index1 + 1 : index1 - index2) * -1
  return { up, down }
}

export function pitchShift(pitch: PitchClass, semitones: number): PitchClass {
  const diff = (pitchClassIndex(pitch) + semitones) % 12
  const index = diff < 0 ? 12 + diff : diff
  return pitchClasses[index]
}

function stepValue(note: PitchClass) {
  const value = stepValues[note.step] + Math.round(note.alter ?? 0)
  if (value >= 0 && value <= 11) {
    return value
  }

  // Attempt to roll over to the next octave if outside the base note range.
  // This assumes less than 12 semitones in either direction.
  if (value < 0) {
    return 12 - value
  }

  return value - 11
}

export function stepList(startingNote: PitchClass): PitchClass[] {
  const index = pitchClassIndex(startingNote)
  return pitchClasses.slice(index).concat(pitchClasses.slice(0, index))
}

// When converted to MIDI microtones are rounded to the nearest whole.
export function toMIDINumber({
  step,
  alter,
  octave,
}: Pitch): number | undefined {
  if (octave < -1) {
    return undefined
  }
  const value = stepValues[step] + Math.round(alter ?? 0)
  const noteNumber = 12 * (octave + 1) + value
  if (noteNumber >= 0 && noteNumber <= 127) {
    return noteNumber
  }

  return undefined
}

export function fromMIDINumber(midi: number): Pitch | undefined {
  if (midi < 0 || midi > 127) {
    return undefined
  }

  const octave = Math.floor(midi / 12) - 1
  const value = Math.abs(12 * (octave + 1) - midi)
  const note = pitchClasses[value]
  return note ? { ...note, octave } : undefined
}

export function stepShift(step: Step, diff = 1): Step {
  diff = (steps.indexOf(step) + Math.round(diff)) % 7
  const index = diff < 0 ? 7 + diff : diff
  return steps[index]
}

export function enharmonic(
  note: PitchClass,
  target: Step | undefined = undefined
): PitchClass {
  if ((!target && !note.alter) || target === note.step) {
    // we don't have anything to convert
    return note
  }

  const step =
    target ??
    stepShift(
      note.step,
      // note.alter is always defined here, but tsc doesn't recognize that, thus ?? 1
      ((note.alter ?? 1) / Math.abs(note.alter ?? 1)) as 1 | -1
    )

  // if there is no index difference just use the inverse of the original alter
  // e.g., A## === B, but we want Bbb
  const { up, down } = pitchClassDistance({ step }, note)
  const alter = (Math.abs(down) < up ? down : up) || (note.alter ?? 0) * -1
  return { step, alter }
}
