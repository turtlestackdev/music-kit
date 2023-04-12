import type { FLAT, NATURAL, SHARP } from './note'
import type { DataByte } from './message.types'

export type Tone = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
export type Semitone = typeof FLAT | typeof NATURAL | typeof SHARP
export type NoteNumber = DataByte

export interface Flat {
  tone: Exclude<Tone, 'C' | 'F'>
  semitone: typeof FLAT
}

export interface Natural {
  tone: Tone
  semitone: typeof NATURAL
}

export interface Sharp {
  tone: Exclude<Tone, 'B' | 'E'>
  semitone: typeof SHARP
}

export type Note = Flat | Natural | Sharp

export type Pitch = Note & {
  octave: number
}

export type NoteState = Pitch & {
  on: boolean
  sustain: boolean
  velocity: DataByte
  aftertouch: DataByte
  noteNumber: NoteNumber
}
