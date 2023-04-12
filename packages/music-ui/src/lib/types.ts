import type { midi, note } from 'midi'

export interface InputRegistry {
  get: (id: string) => Promise<Partial<midi.Input>>
  set: (input: midi.Input) => Promise<void>
}

export type KeyState = note.NoteState & { blink?: boolean }

export type Fifths = -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
export interface KeySignature {
  fifths: Fifths
  mode: 'major' | 'minor'
}
