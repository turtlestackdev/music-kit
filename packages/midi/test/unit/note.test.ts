import { describe, test, expect } from 'vitest'
import * as note from '../../src/note'
import type { DataByte } from '../../src/message.types'
import type { Pitch } from '../../src/note.types'
import { isDataByte } from '../../src/message'
import { MIDIPitchError } from '../../src/error'

describe('test note numbers map to correct pitches', () => {
  test('all DataByte values should generate the correct Pitch', () => {
    let noteNumber: DataByte = 0
    let octave = -1
    let noteIndex = 3
    let expected: Pitch = {
      tone: 'C',
      semitone: note.NATURAL,
      octave: octave,
    }

    while (isDataByte(noteNumber)) {
      const actual = note.getPitch(noteNumber)
      expect(actual).toEqual(expected)
      expect(note.getNoteNumber(actual)).toEqual(noteNumber)

      noteNumber++

      if (noteIndex === 11) {
        noteIndex = 0
      } else {
        noteIndex++
      }

      if (actual.tone === 'B' && actual.semitone === note.NATURAL) {
        octave++
      }

      expected = {
        octave,
        ...note.BASE_NOTES[noteIndex],
      }
    }
  })

  test('Invalid pitch should throw error', () => {
    expect.assertions(1)
    const pitch: Pitch = {
      tone: 'A',
      semitone: note.NATURAL,
      octave: 10,
    }
    try {
      note.getNoteNumber(pitch)
    } catch (e) {
      expect(e).toEqual(
        new MIDIPitchError(`pitch ${JSON.stringify(pitch)} cannot be represented as a MIDI note`)
      )
    }
  })
})

describe('test get list of notes', () => {
  test('get first 12 keys', () => {
    const notes = note.getNotes(12)
    expect(notes.size).toEqual(12)
    for (let i = 21; i < 33; i++) {
      expect(notes.has(i as note.NoteNumber)).toEqual(true)
    }
  })
  test('get 88 keys', () => {
    const notes = note.getNotes(88, {
      tone: 'A',
      semitone: note.NATURAL,
      octave: 0,
    })

    expect(notes.size).toEqual(88)
    expect(notes.get(21)?.noteNumber).toEqual(21)
    expect(notes.get(108)?.noteNumber).toEqual(108)
  })

  test('get 88 keys by pitch', () => {
    const notes = note.getNotes(
      { tone: 'A', semitone: note.NATURAL, octave: 0 },
      { tone: 'C', semitone: note.NATURAL, octave: 8 }
    )

    expect(notes.size).toEqual(88)
    expect(notes.get(21)?.noteNumber).toEqual(21)
    expect(notes.get(108)?.noteNumber).toEqual(108)
  })

  test('get 25 keys', () => {
    const notes = note.getNotes(25, {
      tone: 'C',
      semitone: note.NATURAL,
      octave: 4,
    })

    expect(notes.size).toEqual(25)
    expect(notes.get(60)?.noteNumber).toEqual(60)
    expect(notes.get(84)?.noteNumber).toEqual(84)
  })

  test('get 25 keys by pitch', () => {
    const notes = note.getNotes(
      { tone: 'C', semitone: note.NATURAL, octave: 4 },
      { tone: 'C', semitone: note.NATURAL, octave: 6 }
    )

    expect(notes.size).toEqual(25)
    expect(notes.get(60)?.noteNumber).toEqual(60)
    expect(notes.get(84)?.noteNumber).toEqual(84)
  })
})
