export * from './note.types'
import type { NoteNumber, NoteState, Pitch } from './note.types'
import { isDataByte } from './message'
import { MIDIPitchError } from './error'

export const FLAT = {
  symbol: '♭',
  value: -0.5,
}

export const NATURAL = {
  symbol: '♮',
  value: 0,
}

export const SHARP = {
  symbol: '♯',
  value: +0.5,
}

export const BASE_NOTES = [
  {
    tone: 'A',
    semitone: NATURAL,
  },
  {
    tone: 'A',
    semitone: SHARP,
  },
  {
    tone: 'B',
    semitone: NATURAL,
  },
  {
    tone: 'C',
    semitone: NATURAL,
  },
  {
    tone: 'C',
    semitone: SHARP,
  },
  {
    tone: 'D',
    semitone: NATURAL,
  },
  {
    tone: 'D',
    semitone: SHARP,
  },
  {
    tone: 'E',
    semitone: NATURAL,
  },
  {
    tone: 'F',
    semitone: NATURAL,
  },
  {
    tone: 'F',
    semitone: SHARP,
  },
  {
    tone: 'G',
    semitone: NATURAL,
  },
  {
    tone: 'G',
    semitone: SHARP,
  },
] as const

export function getPitch(noteNumber: number) {
  const index = noteNumber + 3 - 12 * Math.floor((noteNumber + 3) / 12)
  const octave = Math.floor(noteNumber / 12) - 1

  return {
    octave: octave,
    ...BASE_NOTES[index],
  }
}

export function getNoteNumber(pitch: Pitch): NoteNumber {
  const index = BASE_NOTES.findIndex((base) => {
    return base.tone === pitch.tone && base.semitone === pitch.semitone
  })

  const noteNumber =
    index < 3
      ? (pitch.octave + 2) * 12 - (3 - index)
      : (pitch.octave + 1) * 12 + (index - 3)

  if (!isDataByte(noteNumber)) {
    throw new MIDIPitchError(
      `pitch ${JSON.stringify(pitch)} cannot be represented as a MIDI note`
    )
  }

  return noteNumber
}

export function getNotes(count: number): Map<NoteNumber, NoteState>
export function getNotes(
  count: number,
  startingNote: Pitch
): Map<NoteNumber, NoteState>
export function getNotes(
  startingNote: Pitch,
  endingNote: Pitch
): Map<NoteNumber, NoteState>
export function getNotes(
  startingNote: Pitch | number,
  endingNote: Pitch | undefined = undefined
): Map<NoteNumber, NoteState> {
  const notes: Map<NoteNumber, NoteState> = new Map()
  let startNumber: number
  let endNumber: number
  if (typeof startingNote === 'number') {
    const count = startingNote
    if (count <= 0) {
      return notes
    }
    startingNote = endingNote ?? { tone: 'A', semitone: NATURAL, octave: 0 }
    startNumber = getNoteNumber(startingNote)
    endNumber = Math.min(startNumber + count, 127)
  } else {
    if (endingNote === undefined) {
      return notes
    }
    startNumber = getNoteNumber(startingNote)
    endNumber = getNoteNumber(endingNote) + 1
  }

  let i = startNumber
  let currentPitch = startingNote
  do {
    const noteNumber = getNoteNumber(currentPitch)
    notes.set(noteNumber, {
      ...defaultNote,
      noteNumber,
      ...currentPitch,
    })
    currentPitch = getPitch(noteNumber + 1)
    i++
  } while (i < endNumber)

  return notes
}

export const defaultNote: Omit<
  NoteState,
  'tone' | 'semitone' | 'octave' | 'noteNumber'
> = {
  on: false,
  sustain: false,
  velocity: 0,
  aftertouch: 0,
}
